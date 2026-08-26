'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { isPhotoRef, removePhoto, savePhoto } from './photo-db';
import { SEASON_LABEL, addDays, currentSeason, startOfDay } from './season';
import { speciesById } from './species';
import type { CareTask, CustomTask, ProgressEntry, Tree } from './types';

const STORAGE_KEY = 'mr-bonsai-v3';

interface PersistedState {
    trees: Tree[];
    customTasks: CustomTask[];
    /** Data revision — bumping it lets new code append trees to an existing collection */
    rev?: number;
}

const DATA_REV = 3;

/** 26 Aug 2026: the user watered the entire collection by hand */
const WATERED_ALL_AT = '2026-08-26T10:00:00.000Z';

const uid = (): string => Math.random().toString(36).slice(2, 10);

/**
 * Brings collections saved by an older build up to date. Photos shipped as JPEG
 * until they were converted to WebP, and the JPEGs no longer exist — a browser
 * that stored the collection before that would show broken images forever.
 */
const migratePhotoPath = (photo?: string): string | undefined =>
    photo?.startsWith('/images/trees/') ? photo.replace(/\.jpg$/i, '.webp') : photo;

/**
 * Uploaded photos used to live inline in localStorage as data URLs, which blew
 * through its ~5 MB quota after a few uploads and silently lost photos. New
 * uploads go to IndexedDB; this moves any inline photo a previous build stored.
 */
const internPhoto = (photo?: string): string | undefined =>
    photo?.startsWith('data:') ? savePhoto(uid(), photo) : photo;

const migrateTree = (tree: Tree): Tree => ({
    ...tree,
    photo: internPhoto(migratePhotoPath(tree.photo)),
    progress: tree.progress.map((entry) => ({
        ...entry,
        photo: internPhoto(migratePhotoPath(entry.photo)),
        // entries used to carry a single kind; the app now works with a list
        kinds: entry.kinds ?? (entry.kind && entry.kind !== 'note' ? [entry.kind] : [])
    }))
});

/** Every idb photo reference a tree owns — cover and progress timeline */
const photoRefs = (tree: Tree): string[] =>
    [tree.photo, ...tree.progress.map((p) => p.photo)].filter(isPhotoRef);

/** Kamthieng Market purchases of 23 & 26 Aug 2026 plus the existing orange plant */
const newCollectionAug2026 = (): Tree[] => {
    const bought26 = '2026-08-26T09:00:00.000Z';
    const bought23 = '2026-08-23T09:00:00.000Z';
    const worked24 = '2026-08-24T09:00:00.000Z';
    const market = 'Kamthieng Market';

    const tree = (t: Omit<Tree, 'id' | 'progress' | 'notes'> & { notes?: string; progress?: ProgressEntry[] }): Tree => ({
        id: uid(),
        progress: [],
        notes: '',
        lastWatered: '2026-08-25T09:00:00.000Z',
        lastFertilized: undefined,
        lastRepotted: t.acquiredAt,
        stage: 'development',
        ...t
    });

    const entry = (kind: ProgressEntry['kind'], note: string): ProgressEntry => ({
        id: uid(),
        date: worked24,
        kind,
        note
    });

    return [
        // — 26 Aug 2026 —
        tree({ name: 'Japanese Blue Bell 1', speciesId: 'blue-bell', acquiredAt: bought26, location: 'Outside', purchasePrice: 80, purchasedAt: market }),
        tree({ name: 'Japanese Blue Bell 2', speciesId: 'blue-bell', acquiredAt: bought26, location: 'Outside', purchasePrice: 80, purchasedAt: market }),
        tree({ name: 'Chinese Fringe Tree', speciesId: 'chinese-fringe', acquiredAt: bought26, location: 'Outside', purchasePrice: 250, purchasedAt: market }),
        tree({ name: 'Dragon Pine', speciesId: 'dragon-juniper', acquiredAt: bought26, location: 'Outside — full sun', purchasePrice: 150, purchasedAt: market }),
        tree({ name: 'Orange Jasmine', speciesId: 'orange-jasmine', acquiredAt: bought26, location: 'Outside', purchasePrice: 150, purchasedAt: market }),
        tree({ name: 'Creeping Juniper 4', speciesId: 'creeping-juniper', acquiredAt: bought26, location: 'Outside — full sun, max airflow', purchasePrice: 40, purchasedAt: market }),
        tree({ name: 'Creeping Juniper 5', speciesId: 'creeping-juniper', acquiredAt: bought26, location: 'Outside — full sun, max airflow', purchasePrice: 40, purchasedAt: market }),
        tree({ name: 'Creeping Juniper 6', speciesId: 'creeping-juniper', acquiredAt: bought26, location: 'Outside — full sun, max airflow', purchasePrice: 40, purchasedAt: market }),
        // — 23 Aug 2026 —
        tree({
            name: 'Red Japanese Maple',
            speciesId: 'japanese-maple',
            acquiredAt: bought23,
            location: 'Outside — morning sun, afternoon shade',
            purchasePrice: 50,
            purchasedAt: market,
            notes: 'Red-leaved Japanese Maple. In this heat: morning sun only and never let the small pot dry out.'
        }),
        tree({ name: 'Ficus Triangularis', speciesId: 'triangle-fig', acquiredAt: bought23, location: 'Outside', purchasePrice: 35, purchasedAt: market }),
        tree({
            name: 'Dok Khem',
            speciesId: 'ixora',
            acquiredAt: bought23,
            location: 'Outside — full sun',
            purchasePrice: 35,
            purchasedAt: market,
            lastRepotted: worked24,
            progress: [
                entry('pruning', 'First pruning after purchase.'),
                entry('repotting', 'Repotted into fresh mix the day after purchase.')
            ]
        }),
        tree({
            name: 'Creeping Juniper 2',
            speciesId: 'creeping-juniper',
            acquiredAt: bought23,
            location: 'Outside — full sun, max airflow',
            purchasePrice: 40,
            purchasedAt: market,
            lastRepotted: worked24,
            lastWired: worked24,
            progress: [
                entry('wiring', 'Wired the day after purchase.'),
                entry('repotting', 'Repotted into a free-draining mix.')
            ]
        }),
        tree({
            name: 'Creeping Juniper 3',
            speciesId: 'creeping-juniper',
            acquiredAt: bought23,
            location: 'Outside — full sun, max airflow',
            purchasePrice: 40,
            purchasedAt: market,
            lastRepotted: worked24,
            lastWired: worked24,
            progress: [
                entry('wiring', 'Wired the day after purchase.'),
                entry('repotting', 'Repotted into a free-draining mix.')
            ]
        }),
        // — already owned —
        tree({
            name: 'Sweet Orange',
            speciesId: 'sweet-orange',
            acquiredAt: bought23,
            location: 'Outside — full sun',
            lastRepotted: worked24,
            progress: [
                entry('repotting', 'Repotted into fresh free-draining mix.'),
                entry('pruning', 'Pruned back after repotting.')
            ],
            notes: 'Owned before the Kamthieng purchases; repotted and pruned on 24 Aug 2026.'
        })
    ];
};

const seedTrees = (): Tree[] => {
    const now = new Date();
    const year = now.getFullYear();
    const iso = (daysAgo: number) => addDays(now, -daysAgo).toISOString();

    const tree = (t: Omit<Tree, 'id' | 'progress' | 'notes'> & { notes?: string }): Tree => ({
        id: uid(),
        progress: [],
        notes: '',
        lastWatered: iso(1),
        lastFertilized: iso(10),
        lastRepotted: t.acquiredAt,
        ...t
    });

    return [
        tree({
            name: 'Golden Spoon Ficus 1 yr',
            speciesId: 'ficus-annulata',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/gs-ficus-1yr.webp',
            birthYear: year - 1,
            purchasePrice: 39,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Priority: roots, trunk thickening, trunk movement, future branch positions. Avoid too many short pruning rounds while thickening the trunk.'
        }),
        tree({
            name: 'Golden Spoon Ficus 2 yr',
            speciesId: 'ficus-annulata',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/gs-ficus-2yr.webp',
            birthYear: year - 2,
            purchasePrice: 135,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Start choosing a front, main leader and primary branches; remove competing leaders. If the trunk is still thin: grow first, refine later.'
        }),
        tree({
            name: 'Fukien Tea',
            speciesId: 'carmona',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/fukien-tea.webp',
            birthYear: year - 2,
            purchasePrice: 120,
            purchasedAt: 'Family Garden (Shopee)',
            stage: 'development',
            notes: 'Fix trunk structure, choose primary branches, run sacrifice branches for thickness. Not yet into super-fine ramification. Leaf drop ≠ automatically more water: check the soil first.'
        }),
        tree({
            name: 'Fukien Tea small',
            speciesId: 'carmona',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/fukien-tea-small.webp',
            birthYear: year - 1,
            purchasePrice: 120,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Growth first: strong roots, fast healthy growth, trunk thickening. Do not clip every new shoot, no heavy defoliation, no tiny show pot yet.'
        }),
        tree({
            name: 'Creeping Juniper',
            speciesId: 'creeping-juniper',
            acquiredAt: iso(200),
            location: 'Outside — full sun, max airflow',
            photo: '/images/trees/creeping-juniper.webp',
            birthYear: year - 1,
            purchasePrice: 120,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Temperate species in a tropical climate — the collection\'s watchlist plant. Always outside, extreme drainage, never constantly wet. Health and vigor before any deadwood work.'
        }),
        tree({
            name: 'Wood Apple (Ma-sang)',
            speciesId: 'wood-apple',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/wood-apple.webp',
            birthYear: year - 2,
            purchasePrice: 160,
            purchasedAt: 'Family Garden (Shopee)',
            stage: 'development',
            notes: 'Feroniella lucida (มะสัง). Priority: root system, nebari, trunk thickness, taper, primary branches. Don\'t keep it compact too early — power trunk first.'
        }),
        tree({
            name: 'Dwarf Jade',
            speciesId: 'jade',
            acquiredAt: iso(200),
            location: 'Outside — sheltered from long rain',
            photo: '/images/trees/dwarf-jade.webp',
            birthYear: year - 3,
            purchasePrice: 650,
            purchasedAt: 'Facebook',
            stage: 'refinement',
            notes: 'Driest plant of the collection: almost fully dry before watering — overwatering is far more dangerous than slightly too dry. If trunk is thick enough: choose front, finalize primaries, build taper.'
        }),
        tree({
            name: 'Vietnamese Blue Bell',
            speciesId: 'blue-bell',
            acquiredAt: iso(200),
            location: 'Outside — full sun',
            photo: '/images/trees/blue-bell.webp',
            birthYear: year - 3,
            purchasePrice: 500,
            purchasedAt: 'Plant market',
            stage: 'refinement',
            notes: 'Linh Sam. If trunk is thick enough: finalize primary structure, refine branching, build the flowering crown. Otherwise let some branches run longer.'
        }),
        tree({
            name: 'Tamarind cuttings',
            speciesId: 'tamarind',
            acquiredAt: iso(10),
            location: 'Propagation corner — bright, no midday sun',
            photo: '/images/trees/cuttings-tamarind.webp',
            birthYear: year,
            purchasedAt: 'Own propagation',
            stage: 'cutting',
            notes: 'Rooting phase: evenly lightly moist, high humidity WITH airflow, warm. No fertilizer until sustained new growth. Don\'t pull them out to check — look for roots at the drainage holes.'
        }),
        tree({
            name: 'Dwarf Jade cuttings',
            speciesId: 'jade',
            acquiredAt: iso(10),
            location: 'Propagation corner — bright, airy',
            birthYear: year,
            purchasedAt: 'Own propagation',
            stage: 'cutting',
            notes: 'Treat much drier than the other cuttings: let cut callus, very airy mix, dry to barely moist — NO wet humidity dome. Water more only after callus and first roots.'
        }),
        tree({
            name: 'Blue Bell cuttings',
            speciesId: 'blue-bell',
            acquiredAt: iso(10),
            location: 'Propagation corner — bright, humid',
            photo: '/images/trees/cuttings-blue-bell.webp',
            birthYear: year,
            purchasedAt: 'Own propagation',
            stage: 'cutting',
            notes: 'Rooting phase: constantly lightly moist, never soggy, high humidity with daily fresh air against mold. Leave the first flush of growth alone — roots and reserves before any pruning.'
        }),
        ...newCollectionAug2026()
    ];
};

interface BonsaiContextValue {
    ready: boolean;
    trees: Tree[];
    customTasks: CustomTask[];
    addTree: (tree: Omit<Tree, 'id' | 'progress'>) => Tree;
    updateTree: (id: string, patch: Partial<Tree>) => void;
    deleteTree: (id: string) => void;
    addProgress: (treeId: string, entry: Omit<ProgressEntry, 'id'>) => void;
    updateProgress: (treeId: string, entryId: string, patch: Partial<Omit<ProgressEntry, 'id'>>) => void;
    deleteProgress: (treeId: string, entryId: string) => void;
    addCustomTask: (task: Omit<CustomTask, 'id' | 'done'>) => void;
    deleteCustomTask: (id: string) => void;
    completeTask: (task: CareTask) => void;
    /** Every task, one per tree — used on a tree's own page */
    tasks: CareTask[];
    /** Same list for collection-wide views, with the seasonal photo reminders collapsed into one */
    agenda: CareTask[];
}

const BonsaiContext = createContext<BonsaiContextValue | null>(null);

export const BonsaiProvider = ({ children }: { children: ReactNode }) => {
    const [ready, setReady] = useState(false);
    const [trees, setTrees] = useState<Tree[]>([]);
    const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as PersistedState;
                let trees = (parsed.trees ?? []).map(migrateTree);
                const rev = parsed.rev ?? 1;
                // rev 2: the Aug 2026 purchases — append what's missing
                if (rev < 2) {
                    const additions = newCollectionAug2026().filter(
                        (added) => !trees.some((t) => t.name === added.name)
                    );
                    trees = [...trees, ...additions];
                }
                // rev 3: the whole collection was watered on 26 Aug 2026
                if (rev < 3) {
                    trees = trees.map((t) =>
                        !t.lastWatered || t.lastWatered < WATERED_ALL_AT ? { ...t, lastWatered: WATERED_ALL_AT } : t
                    );
                }
                setTrees(trees);
                setCustomTasks(parsed.customTasks ?? []);
            } else {
                setTrees(seedTrees());
            }
        } catch {
            setTrees(seedTrees());
        }
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ trees, customTasks, rev: DATA_REV } satisfies PersistedState)
            );
        } catch {
            // storage full (photos) — keep running in memory
        }
    }, [ready, trees, customTasks]);

    const addTree: BonsaiContextValue['addTree'] = useCallback((tree) => {
        const created: Tree = { ...tree, id: uid(), progress: [], photo: internPhoto(tree.photo) };
        setTrees((t) => [created, ...t]);

        return created;
    }, []);

    const updateTree: BonsaiContextValue['updateTree'] = useCallback((id, patch) => {
        const safePatch = 'photo' in patch ? { ...patch, photo: internPhoto(patch.photo) } : patch;
        setTrees((t) => t.map((tree) => (tree.id === id ? { ...tree, ...safePatch } : tree)));
    }, []);

    const deleteTree: BonsaiContextValue['deleteTree'] = useCallback((id) => {
        setTrees((t) => {
            t.filter((tree) => tree.id === id).flatMap(photoRefs).forEach(removePhoto);

            return t.filter((tree) => tree.id !== id);
        });
        setCustomTasks((c) => c.filter((task) => task.treeId !== id));
    }, []);

    const addProgress: BonsaiContextValue['addProgress'] = useCallback((treeId, entry) => {
        const photo = internPhoto(entry.photo);
        setTrees((t) =>
            t.map((tree) =>
                tree.id === treeId
                    ? {
                          ...tree,
                          photo: photo ?? tree.photo,
                          // typed entries also update the care timestamps they represent
                          lastWired: entry.kinds?.includes('wiring') ? entry.date : tree.lastWired,
                          lastRepotted: entry.kinds?.includes('repotting') ? entry.date : tree.lastRepotted,
                          progress: [{ ...entry, photo, id: uid() }, ...tree.progress]
                      }
                    : tree
            )
        );
    }, []);

    const updateProgress: BonsaiContextValue['updateProgress'] = useCallback((treeId, entryId, patch) => {
        const safePatch = 'photo' in patch ? { ...patch, photo: internPhoto(patch.photo) } : patch;
        setTrees((t) =>
            t.map((tree) =>
                tree.id === treeId
                    ? {
                          ...tree,
                          progress: tree.progress.map((entry) =>
                              entry.id === entryId ? { ...entry, ...safePatch } : entry
                          )
                      }
                    : tree
            )
        );
    }, []);

    const deleteProgress: BonsaiContextValue['deleteProgress'] = useCallback((treeId, entryId) => {
        setTrees((t) =>
            t.map((tree) => {
                if (tree.id !== treeId) return tree;
                const entry = tree.progress.find((p) => p.id === entryId);
                // only remove the stored photo when no other entry or the cover still uses it
                if (isPhotoRef(entry?.photo)) {
                    const usedElsewhere =
                        tree.photo === entry.photo ||
                        tree.progress.some((p) => p.id !== entryId && p.photo === entry.photo);
                    if (!usedElsewhere) removePhoto(entry.photo);
                }

                return { ...tree, progress: tree.progress.filter((p) => p.id !== entryId) };
            })
        );
    }, []);

    const addCustomTask: BonsaiContextValue['addCustomTask'] = useCallback((task) => {
        setCustomTasks((c) => [...c, { ...task, id: uid(), done: false }]);
    }, []);

    const deleteCustomTask: BonsaiContextValue['deleteCustomTask'] = useCallback((id) => {
        setCustomTasks((c) => c.filter((task) => task.id !== id));
    }, []);

    const tasks = useMemo(() => computeTasks(trees, customTasks), [trees, customTasks]);
    const agenda = useMemo(() => collapsePhotoTasks(tasks), [tasks]);

    const completeTask: BonsaiContextValue['completeTask'] = useCallback((task) => {
        const nowIso = new Date().toISOString();
        if (task.customId) {
            setCustomTasks((c) => c.map((t) => (t.id === task.customId ? { ...t, done: true } : t)));

            return;
        }
        if (!task.treeId) return;
        if (task.kind === 'water') updateTree(task.treeId, { lastWatered: nowIso });
        if (task.kind === 'fertilize') updateTree(task.treeId, { lastFertilized: nowIso });
        if (task.kind === 'repot') updateTree(task.treeId, { lastRepotted: nowIso });
        if (task.kind === 'wirecheck') updateTree(task.treeId, { wireCheckedAt: nowIso });
    }, [updateTree]);

    const value: BonsaiContextValue = {
        ready,
        trees,
        customTasks,
        addTree,
        updateTree,
        deleteTree,
        addProgress,
        updateProgress,
        deleteProgress,
        addCustomTask,
        deleteCustomTask,
        completeTask,
        tasks,
        agenda
    };

    return <BonsaiContext.Provider value={value}>{children}</BonsaiContext.Provider>;
};

export const useBonsai = (): BonsaiContextValue => {
    const ctx = useContext(BonsaiContext);
    if (!ctx) throw new Error('useBonsai must be used inside BonsaiProvider');

    return ctx;
};

/** Derive due care tasks from species schedules + last-done dates */
const computeTasks = (trees: Tree[], customTasks: CustomTask[]): CareTask[] => {
    const now = new Date();
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
            title: `Water ${tree.name}`,
            detail: species.care.watering,
            due: addDays(startOfDay(lastWatered), waterInterval)
        });

        // Cuttings: no feeding or repotting until rooted — only watering and photo reminders
        const isCutting = tree.stage === 'cutting';

        const feedInterval = tree.careOverrides?.fertilizingDays ?? species.care.fertilizingIntervalDays[season];
        if (feedInterval !== null && !isCutting) {
            // never fertilized: count from acquisition — a fresh (often just-repotted) plant should not be fed on day one
            const lastFed = tree.lastFertilized ? new Date(tree.lastFertilized) : new Date(tree.acquiredAt);
            tasks.push({
                key: `fertilize-${tree.id}`,
                kind: 'fertilize',
                treeId: tree.id,
                title: `Fertilize ${tree.name}`,
                detail: species.care.fertilizing,
                due: addDays(startOfDay(lastFed), feedInterval)
            });
        }

        // Repotting: due in the next spring window after the interval elapses
        const lastRepotted = tree.lastRepotted ? new Date(tree.lastRepotted) : new Date(tree.acquiredAt);
        const repotYear = lastRepotted.getFullYear() + (tree.careOverrides?.repotYears ?? species.care.repotEveryYears);
        const repotDue = new Date(repotYear, 2, 15);
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

const daysBetween = (a: Date, b: Date): number => Math.round((b.getTime() - a.getTime()) / 86_400_000);

/**
 * One photo reminder per tree floods the agenda — every tree wants one at the start of a season.
 * Collection-wide views get a single "photo round" row instead.
 */
const collapsePhotoTasks = (tasks: CareTask[]): CareTask[] => {
    const photos = tasks.filter((t) => t.kind === 'photo');
    if (photos.length <= 1) return tasks;

    const rest = tasks.filter((t) => t.kind !== 'photo');
    const season = SEASON_LABEL[currentSeason()];
    const round: CareTask = {
        key: 'photo-round',
        kind: 'photo',
        title: `${season} photo round`,
        detail: `${photos.length} plants still need a photo this season.`,
        due: photos.reduce((earliest, t) => (t.due < earliest ? t.due : earliest), photos[0].due)
    };

    return [...rest, round].sort((a, b) => a.due.getTime() - b.due.getTime());
};
