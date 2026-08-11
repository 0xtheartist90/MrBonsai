import { speciesById } from './species';
import { daysBetween } from './season';
import type { CareTask, TaskKind, Tree } from './types';

/** Photo reminders are always "due", so they never signal urgency on a card */
const SIGNAL_KINDS: TaskKind[] = ['water', 'fertilize', 'repot', 'wirecheck', 'custom'];

export interface TreeUrgency {
    task: CareTask;
    overdue: boolean;
    label: string;
}

/** The single most pressing task for a tree, or null when nothing is due yet */
export const treeUrgency = (tasks: CareTask[], treeId: string, now = new Date()): TreeUrgency | null => {
    const due = tasks
        .filter((t) => t.treeId === treeId && SIGNAL_KINDS.includes(t.kind) && daysBetween(now, t.due) <= 0)
        .sort((a, b) => a.due.getTime() - b.due.getTime());

    const task = due[0];
    if (!task) return null;

    const days = daysBetween(now, task.due);
    const verb: Record<string, string> = {
        water: 'Water me',
        fertilize: 'Feed me',
        repot: 'Repot me',
        wirecheck: 'Check wire',
        custom: task.title
    };

    return {
        task,
        overdue: days < 0,
        label: days < 0 ? `${verb[task.kind]} · ${Math.abs(days)}d late` : verb[task.kind]
    };
};

const STYLING_KINDS = ['wiring', 'pruning', 'styling'];

export interface StylingFocus {
    tree: Tree;
    kind: 'wiring' | 'pruning';
    title: string;
    detail: string;
    daysSince: number;
    everStyled: boolean;
}

/**
 * Styling is the work that actually shapes a tree, and it has no due date — so the
 * tree that has gone longest without wiring, pruning or styling gets surfaced.
 * Cuttings are excluded: they need roots before anyone touches them.
 */
export const stylingFocus = (trees: Tree[], now = new Date()): StylingFocus | null => {
    const ranked = trees
        .filter((t) => t.stage !== 'cutting')
        .map((tree) => {
            const last = tree.progress
                .filter((p) => p.kind && STYLING_KINDS.includes(p.kind))
                .map((p) => new Date(p.date).getTime())
                .sort((a, b) => b - a)[0];

            return {
                tree,
                everStyled: last !== undefined,
                daysSince: Math.abs(daysBetween(new Date(last ?? tree.acquiredAt), now))
            };
        })
        .sort((a, b) => b.daysSince - a.daysSince);

    const top = ranked[0];
    if (!top) return null;

    const species = speciesById(top.tree.speciesId);
    // A tree that has never been wired needs its trunk line set before anything else
    const kind: 'wiring' | 'pruning' = top.tree.lastWired ? 'pruning' : 'wiring';

    return {
        ...top,
        kind,
        title: kind === 'wiring' ? 'Set the trunk line' : 'Prune and build ramification',
        detail:
            kind === 'wiring'
                ? `Not wired yet. ${
                      top.tree.stage === 'refinement'
                          ? 'Wire the primary branches to place them where the design needs them.'
                          : 'Wire the trunk and main branches while they are still flexible.'
                  }`
                : (species?.care.pruning ?? 'Trim the extending shoots back into the silhouette.')
    };
};
