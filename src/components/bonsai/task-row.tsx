'use client';

import Link from 'next/link';

import { daysBetween, relativeDue } from '@/lib/bonsai/season';
import { useBonsai } from '@/lib/bonsai/store';
import type { CareTask, TaskKind } from '@/lib/bonsai/types';
import { cn } from '@/lib/utils';

import { Cable, Camera, Check, Droplets, Leaf, ListChecks, Shovel } from 'lucide-react';
import { toast } from 'sonner';

const kindIcon: Record<TaskKind, typeof Droplets> = {
    water: Droplets,
    fertilize: Leaf,
    repot: Shovel,
    photo: Camera,
    wirecheck: Cable,
    custom: ListChecks
};

export const TaskRow = ({ task }: { task: CareTask }) => {
    const { completeTask, trees } = useBonsai();
    const Icon = kindIcon[task.kind];
    const overdue = daysBetween(new Date(), task.due) < 0;
    const tree = trees.find((t) => t.id === task.treeId);

    const row = (
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
                <button
                    aria-label={`Mark ${task.title} as done`}
                    onClick={() => {
                        completeTask(task);
                        toast.success(`${task.title} — done!`);
                    }}
                    className='border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary flex size-9 items-center justify-center rounded-full border transition-colors'>
                    <Check className='size-4' />
                </button>
            )}
        </div>
    );

    return row;
};
