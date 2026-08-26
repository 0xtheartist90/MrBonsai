import { SEASON_LABEL, addDays, currentSeason, startOfDay } from './season';
import { speciesById } from './species';
import type { CareTask, CustomTask, Tree } from './types';

/** Multitech 16-16-16 label: 4-month supply — 3-4 g per 5" pot, 6-8 g per 10" pot */
export const NPK_TOPUP_DAYS = 120;

const daysBetween = (a: Date, b: Date): number => Math.round((b.getTime() - a.getTime()) / 86_400_000);

/**
 * Derives every due care task from species schedules, per-tree overrides and the
 * care dates. Pure — the app store and the push-notification cron both use it.
 */
export const computeTasks = (trees: Tree[], customTasks: CustomTask[], now = new Date()): CareTask[] => {
    const season = currentSeason(now);
    const tasks: CareTask[] = [];

    for (const tree of trees) {
        const species = speciesById(tree.speciesId);
        if (!species) continue;

        // A tree's own schedule wins over the species default for the season
        const waterInterval = tree.careOverrides?.wateringDays ?? species.care.wateringIntervalDays[season];
        const lastWatered = tree.lastWatered ? new Date(tree.lastWatered) : addDays(now, -waterInterval);
        tasks.push({
            key: `water-${tree.id}`,
            kind: 'water',
            treeId: tree.id,
            title: `Check soil · ${tree.name}`,
            detail: species.care.watering,
            due: addDays(startOfDay(lastWatered), waterInterval)
        });

        // Cuttings: no feeding or repotting until rooted — only watering and photo reminders.
        // A stressed or sick plant also gets no fertilizer: resolve the stress before feeding.
        const isCutting = tree.stage === 'cutting';
        const noFeeding = isCutting || (tree.health !== undefined && tree.health !== 'healthy');

        // Cuttings get a rooting check ~5 weeks in; completing it promotes the plant
        if (isCutting) {
            tasks.push({
                key: `rooting-${tree.id}`,
                kind: 'rooting',
                treeId: tree.id,
                title: `Check rooting · ${tree.name}`,
                detail: 'Firm in the pot, new leaves staying on, roots at the drainage holes? Tick to mark it rooted — feeding then starts.',
                due: addDays(startOfDay(new Date(tree.acquiredAt)), 35)
            });
        }

        // Fertilizer pauses after root work (see public/fertilizer_schedule_app_logic.md):
        // NPK light 7-14d / moderate 14-21d / heavy 21-28d; micronutrients 14/18/21d
        const severity = tree.lastRepotSeverity ?? 'moderate';
        const npkPauseDays = { light: 10, moderate: 18, heavy: 24 }[severity];
        const microPauseDays = { light: 14, moderate: 18, heavy: 21 }[severity];
        const lastRepot = tree.lastRepotted ? startOfDay(new Date(tree.lastRepotted)) : null;
        const later = (a: Date, b: Date | null): Date => (b && b > a ? b : a);

        // Multitech 16-16-16 is SLOW-RELEASE: granules feed for ~4 months, so the task is a
        // top-up on that cycle — not the species' liquid-feed rhythm, which would overfeed.
        const speciesFeed = species.care.fertilizingIntervalDays[season];
        const feedInterval = tree.careOverrides?.fertilizingDays ?? (speciesFeed === null ? null : NPK_TOPUP_DAYS);
        if (feedInterval !== null && !noFeeding) {
            // never fertilized: count from acquisition — a fresh (often just-repotted) plant should not be fed on day one
            const lastFed = tree.lastFertilized ? new Date(tree.lastFertilized) : new Date(tree.acquiredAt);
            tasks.push({
                key: `fertilize-${tree.id}`,
                kind: 'fertilize',
                treeId: tree.id,
                title: `Top up 16-16-16 · ${tree.name}`,
                detail: 'Multitech 4-month slow-release: ±3-4 g for a 5" pot, 6-8 g for 10". Skip if granules remain; healthy, growing trees only.',
                due: later(addDays(startOfDay(lastFed), feedInterval), lastRepot && addDays(lastRepot, npkPauseDays))
            });
        }

        // Nic-Spray EDTA micronutrients: every 4-6 weeks on established plants, never on cuttings
        if (!noFeeding) {
            // never applied: due from today, not retroactively overdue since acquisition
            const lastMicro = tree.lastMicronutrients
                ? new Date(tree.lastMicronutrients)
                : new Date(Math.max(new Date(tree.acquiredAt).getTime(), addDays(now, -35).getTime()));
            tasks.push({
                key: `micro-${tree.id}`,
                kind: 'micro',
                treeId: tree.id,
                title: `Micronutrients ${tree.name}`,
                detail: 'Nic-Spray EDTA, label dilution. If leaves yellow with green veins, check pH and roots first.',
                due: later(addDays(startOfDay(lastMicro), 35), lastRepot && addDays(lastRepot, microPauseDays))
            });
        }

        // Repotting: due at the start of the hot season (warm active growth) once the interval elapses
        const lastRepotted = tree.lastRepotted ? new Date(tree.lastRepotted) : new Date(tree.acquiredAt);
        const repotYear = lastRepotted.getFullYear() + (tree.careOverrides?.repotYears ?? species.care.repotEveryYears);
        const repotDue = new Date(repotYear, 2, 1);
        if (!isCutting && repotDue.getTime() - now.getTime() < 60 * 86_400_000) {
            tasks.push({
                key: `repot-${tree.id}`,
                kind: 'repot',
                treeId: tree.id,
                title: `Repot ${tree.name}`,
                detail: species.care.repotting,
                due: repotDue
            });
        }

        // Wire check: wire bites in as branches thicken — check 6 weeks after wiring
        if (tree.lastWired && (!tree.wireCheckedAt || tree.wireCheckedAt < tree.lastWired)) {
            tasks.push({
                key: `wirecheck-${tree.id}`,
                kind: 'wirecheck',
                treeId: tree.id,
                title: `Check wire on ${tree.name}`,
                detail: 'Make sure the wire is not cutting into the bark; remove or rewrap if needed.',
                due: addDays(startOfDay(new Date(tree.lastWired)), tree.careOverrides?.wireCheckDays ?? 42)
            });
        }

        // Seasonal photo reminder: no progress photo taken this season yet
        const seasonHasPhoto = tree.progress.some(
            (p) => p.photo && currentSeason(new Date(p.date)) === season && daysBetween(new Date(p.date), now) < 100
        );
        if (!seasonHasPhoto) {
            tasks.push({
                key: `photo-${tree.id}`,
                kind: 'photo',
                treeId: tree.id,
                title: `Seasonal photo of ${tree.name}`,
                detail: 'Capture this season for the visual history of your tree.',
                due: now
            });
        }
    }

    for (const task of customTasks) {
        if (task.done) continue;
        tasks.push({
            key: `custom-${task.id}`,
            kind: 'custom',
            treeId: task.treeId,
            title: task.title,
            detail: 'Custom task',
            due: new Date(task.due),
            customId: task.id
        });
    }

    return tasks.sort((a, b) => a.due.getTime() - b.due.getTime());
};

/**
 * One photo reminder per tree floods the agenda — every tree wants one at the start of a season.
 * Collection-wide views get a single "photo round" row instead.
 */
export const collapsePhotoTasks = (tasks: CareTask[], now = new Date()): CareTask[] => {
    const photos = tasks.filter((t) => t.kind === 'photo');
    if (photos.length <= 1) return tasks;

    const rest = tasks.filter((t) => t.kind !== 'photo');
    const season = SEASON_LABEL[currentSeason(now)];
    const round: CareTask = {
        key: 'photo-round',
        kind: 'photo',
        title: `${season} photo round`,
        detail: `${photos.length} plants still need a photo this season.`,
        due: photos.reduce((earliest, t) => (t.due < earliest ? t.due : earliest), photos[0].due)
    };

    return [...rest, round].sort((a, b) => a.due.getTime() - b.due.getTime());
};
