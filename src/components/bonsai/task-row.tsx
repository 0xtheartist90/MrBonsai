'use client';

import Link from 'next/link';

import { daysBetween, relativeDue } from '@/lib/bonsai/season';
import { useBonsai } from '@/lib/bonsai/store';
import type { CareTask, TaskKind, Tree } from '@/lib/bonsai/types';
import { cn } from '@/lib/utils';

import { Cable, Camera, Check, CloudRain, Droplets, FlaskConical, Leaf, ListChecks, Shovel, Sprout, X } from 'lucide-react';
import { toast } from 'sonner';

const kindIcon: Record<TaskKind, typeof Droplets> = {
    water: Droplets,
    fertilize: Leaf,
    micro: FlaskConical,
    repot: Shovel,
    photo: Camera,
    wirecheck: Cable,
    rooting: Sprout,
    custom: ListChecks
};

/** The care date a task writes on completion — captured before, restored on Undo */
const undoPatch = (task: CareTask, tree?: Tree): Partial<Tree> | null => {
    if (!tree) return null;
    switch (task.kind) {
        case 'water':
            return { lastWatered: tree.lastWatered };
        case 'fertilize':
            return { lastFertilized: tree.lastFertilized };
        case 'micro':
            return { lastMicronutrients: tree.lastMicronutrients };
        case 'repot':
            return { lastRepotted: tree.lastRepotted };
        case 'wirecheck':
            return { wireCheckedAt: tree.wireCheckedAt };
        case 'rooting':
            return { stage: tree.stage };
        default:
            return null;
    }
};

export const TaskRow = ({ task }: { task: CareTask }) => {
    const { completeTask, addCustomTask, deleteCustomTask, reopenCustomTask, snoozeWaterCheck, updateTree, trees, customTasks } =
        useBonsai();
    const Icon = kindIcon[task.kind];
    const overdue = daysBetween(new Date(), task.due) < 0;
    const tree = trees.find((t) => t.id === task.treeId);

    const complete = () => {
        const patch = undoPatch(task, tree);
        completeTask(task);
        toast.success(
            task.kind === 'water'
                ? `${tree?.name ?? 'Plant'} watered.`
                : task.kind === 'rooting'
                  ? `${tree?.name ?? 'Cutting'} is rooted! Stage set to Development — feeding starts.`
                  : `${task.title} — done!`,
            {
                action:
                    patch && task.treeId
                        ? { label: 'Undo', onClick: () => updateTree(task.treeId!, patch) }
                        : task.customId
                          ? { label: 'Undo', onClick: () => reopenCustomTask(task.customId!) }
                          : undefined
            }
        );
    };

    return (
        <div className='bg-card flex items-center gap-3 rounded-3xl p-3 shadow-sm'>
            <span
                className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-2xl',
                    overdue ? 'bg-destructive/10 text-destructive' : 'bg-accent text-accent-foreground'
                )}>
                <Icon className='size-5' strokeWidth={1.8} />
            </span>
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold'>{task.title}</p>
                <p className={cn('truncate text-xs', overdue ? 'text-destructive' : 'text-muted-foreground')}>
                    {relativeDue(task.due)}
                    {tree ? ` · ${tree.location}` : task.kind === 'photo' ? ` · ${task.detail}` : ''}
                </p>
            </div>
            {task.kind === 'photo' ? (
                <Link
                    href={task.treeId ? `/trees/${task.treeId}?progress=1` : '/'}
                    className='bg-secondary text-secondary-foreground shrink-0 rounded-full px-3 py-2 text-xs font-medium'>
                    {task.treeId ? 'Add photo' : 'Start'}
                </Link>
            ) : (
                <div className='flex shrink-0 gap-1.5'>
                    {task.kind === 'water' && task.treeId && (
                        <button
                            aria-label={`${tree?.name ?? 'Plant'} is still moist — check again tomorrow`}
                            title='Still moist — check again tomorrow'
                            onClick={() => {
                                const prev = tree?.lastWatered;
                                snoozeWaterCheck(task.treeId!);
                                toast(`Still moist — ${tree?.name ?? 'plant'} checks again tomorrow.`, {
                                    action: prev
                                        ? { label: 'Undo', onClick: () => updateTree(task.treeId!, { lastWatered: prev }) }
                                        : undefined
                                });
                            }}
                            className='bg-secondary/70 text-muted-foreground hover:text-primary hover:bg-accent flex size-9 items-center justify-center rounded-full shadow-[inset_0_1px_2px_rgb(30_35_22/0.06)] transition-colors active:scale-95'>
                            <CloudRain className='size-4' />
                        </button>
                    )}
                    {task.customId && (
                        <button
                            aria-label={`Delete ${task.title}`}
                            onClick={() => {
                                const removed = customTasks.find((c) => c.id === task.customId);
                                deleteCustomTask(task.customId!);
                                toast.success('Task deleted.', {
                                    action: removed
                                        ? {
                                              label: 'Undo',
                                              onClick: () =>
                                                  addCustomTask({ title: removed.title, due: removed.due, treeId: removed.treeId })
                                          }
                                        : undefined
                                });
                            }}
                            className='bg-secondary/70 text-muted-foreground hover:text-destructive flex size-9 items-center justify-center rounded-full shadow-[inset_0_1px_2px_rgb(30_35_22/0.06)] transition-colors active:scale-95'>
                            <X className='size-4' />
                        </button>
                    )}
                    <button
                        aria-label={
                            task.kind === 'water' ? `Mark ${tree?.name ?? 'plant'} as watered` : `Mark ${task.title} as done`
                        }
                        onClick={complete}
                        className='bg-accent text-accent-foreground hover:from-primary hover:to-primary/85 hover:text-primary-foreground flex size-9 items-center justify-center rounded-full shadow-[0_1px_2px_rgb(30_35_22/0.08)] transition-all hover:bg-gradient-to-b hover:shadow-primary/40 active:scale-95'>
                        <Check className='size-4' />
                    </button>
                </div>
            )}
        </div>
    );
};
