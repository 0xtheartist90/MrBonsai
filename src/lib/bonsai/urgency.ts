import { daysBetween } from './season';
import type { CareTask, TaskKind } from './types';

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
