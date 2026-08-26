'use client';

import { useState } from 'react';

import Link from 'next/link';

import { LoadingScreen } from '@/components/bonsai/loading-screen';
import { TaskRow } from '@/components/bonsai/task-row';
import { TreePhoto } from '@/components/bonsai/tree-photo';
import { SEASON_LABEL, currentSeason, daysBetween } from '@/lib/bonsai/season';
import { speciesById } from '@/lib/bonsai/species';
import { useBonsai } from '@/lib/bonsai/store';
import { stylingFocus, treeUrgency } from '@/lib/bonsai/urgency';
import type { TaskKind } from '@/lib/bonsai/types';
import { cn } from '@/lib/utils';

import { toast } from 'sonner';

import {
    Cable,
    Camera,
    ChevronLeft,
    ChevronRight,
    Cloud,
    CloudOff,
    Droplets,
    Leaf,
    Scissors,
    Shovel,
    Sprout,
    TreeDeciduous
} from 'lucide-react';

const FILTERS: { kind: TaskKind; label: string; icon: typeof Droplets }[] = [
    { kind: 'water', label: 'Water', icon: Droplets },
    { kind: 'fertilize', label: 'Feed', icon: Leaf },
    { kind: 'repot', label: 'Repot', icon: Shovel },
    { kind: 'photo', label: 'Photo', icon: Camera }
];

const GrowPage = () => {
    const { ready, trees, tasks, agenda, completeTask, syncStatus } = useBonsai();
    const [filter, setFilter] = useState<TaskKind | null>(null);
    const [featured, setFeatured] = useState(0);
    const season = currentSeason();

    if (!ready) return <LoadingScreen />;

    const now = new Date();
    // the Feed tile covers both fertilizer products (16-16-16 and micronutrients)
    const matchesFilter = (kind: TaskKind, task: { kind: TaskKind }) =>
        kind === 'fertilize' ? task.kind === 'fertilize' || task.kind === 'micro' : task.kind === kind;

    const dueTasks = agenda.filter((t) => daysBetween(now, t.due) <= 0);
    const shown = filter ? dueTasks.filter((t) => matchesFilter(filter, t)) : dueTasks;
    const dueWater = dueTasks.filter((t) => t.kind === 'water');

    const needsAttention = trees
        .map((tree) => ({ tree, urgency: treeUrgency(tasks, tree.id, now) }))
        .filter((t): t is { tree: (typeof trees)[number]; urgency: NonNullable<ReturnType<typeof treeUrgency>> } =>
            Boolean(t.urgency)
        );

    const upToDate = trees.length - needsAttention.length;
    const healthPct = trees.length ? Math.round((upToDate / trees.length) * 100) : 100;
    const cuttings = trees.filter((t) => t.stage === 'cutting').length;

    const current = needsAttention[featured % Math.max(needsAttention.length, 1)];
    const styling = stylingFocus(trees, now);

    return (
        <div className='space-y-5'>
            <header className='flex items-center justify-between pt-2'>
                <div>
                    <p className='text-muted-foreground text-sm'>{SEASON_LABEL[season]} · it&apos;s plant care time</p>
                    <h1 className='text-3xl font-bold tracking-tight'>Grow</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <Link
                        href='/sync'
                        aria-label='Sync settings'
                        className={cn(
                            'bg-card flex size-10 items-center justify-center rounded-full shadow-sm',
                            syncStatus === 'synced' && 'text-primary',
                            syncStatus === 'error' && 'text-destructive',
                            (syncStatus === 'off' || syncStatus === 'signedOut') && 'text-muted-foreground'
                        )}>
                        {syncStatus === 'off' ? <CloudOff className='size-4.5' /> : <Cloud className='size-4.5' />}
                    </Link>
                    <span className='shadow-primary/20 flex size-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg'>
                        <img src='/images/logo-mark.png' alt='Mr. Bonsai logo' className='size-10' />
                    </span>
                </div>
            </header>

            <div className='grid grid-cols-4 gap-2'>
                {FILTERS.map(({ kind, label, icon: Icon }) => {
                    const count = dueTasks.filter((t) => matchesFilter(kind, t)).length;
                    const active = filter === kind;

                    return (
                        <button
                            key={kind}
                            onClick={() => setFilter(active ? null : kind)}
                            className={cn(
                                'relative flex flex-col items-center gap-1.5 rounded-2xl py-3 text-[11px] font-semibold shadow-sm transition-colors',
                                active ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                            )}>
                            <Icon className='size-5' strokeWidth={1.9} />
                            {label}
                            {count > 0 && (
                                <span
                                    className={cn(
                                        'absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[9px] font-bold',
                                        active ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                                    )}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-2 space-y-2'>
                    <div className='bg-card flex items-center gap-2 rounded-2xl px-3 py-2.5 shadow-sm'>
                        <TreeDeciduous className='text-primary size-4 shrink-0' />
                        <span className='text-lg leading-none font-bold'>{trees.length - cuttings}</span>
                        <span className='text-muted-foreground truncate text-[11px]'>trees</span>
                    </div>
                    <div className='bg-card flex items-center gap-2 rounded-2xl px-3 py-2.5 shadow-sm'>
                        <Sprout className='text-primary size-4 shrink-0' />
                        <span className='text-lg leading-none font-bold'>{cuttings}</span>
                        <span className='text-muted-foreground truncate text-[11px]'>cuttings</span>
                    </div>
                </div>
                <div className='from-primary to-primary/80 text-primary-foreground shadow-primary/20 col-span-3 rounded-2xl bg-gradient-to-br p-4 shadow-lg'>
                    <div className='flex items-baseline gap-1'>
                        <span className='text-3xl font-bold'>{upToDate}</span>
                        <span className='text-sm opacity-80'>/ {trees.length} up to date</span>
                    </div>
                    <div className='mt-3 h-2 overflow-hidden rounded-full bg-white/25'>
                        <div className='h-full rounded-full bg-white transition-all' style={{ width: `${healthPct}%` }} />
                    </div>
                    <p className='mt-2 text-[11px] opacity-80'>
                        {needsAttention.length === 0
                            ? 'Every plant is happy right now'
                            : `${needsAttention.length} ${needsAttention.length === 1 ? 'plant needs' : 'plants need'} care`}
                    </p>
                </div>
            </div>

            {current && (
                <section>
                    <div className='mb-2 flex items-center justify-between'>
                        <h2 className='font-semibold'>Needs you now</h2>
                        {needsAttention.length > 1 && (
                            <div className='flex gap-1.5'>
                                <button
                                    aria-label='Previous plant'
                                    onClick={() => setFeatured((i) => (i - 1 + needsAttention.length) % needsAttention.length)}
                                    className='bg-card text-foreground flex size-8 items-center justify-center rounded-full shadow-sm'>
                                    <ChevronLeft className='size-4' />
                                </button>
                                <button
                                    aria-label='Next plant'
                                    onClick={() => setFeatured((i) => (i + 1) % needsAttention.length)}
                                    className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full shadow-sm'>
                                    <ChevronRight className='size-4' />
                                </button>
                            </div>
                        )}
                    </div>
                    <Link
                        href={`/trees/${current.tree.id}`}
                        className='relative block h-56 overflow-hidden rounded-3xl shadow-sm transition-transform active:scale-[0.99]'>
                        <TreePhoto photo={current.tree.photo} name={current.tree.name} />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent' />
                        <span
                            className={cn(
                                'absolute top-3 left-3 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md',
                                current.urgency.overdue ? 'bg-destructive/90 text-white' : 'bg-white/85 text-foreground'
                            )}>
                            {current.urgency.label}
                        </span>
                        <div className='absolute inset-x-4 bottom-4 text-white'>
                            <p className='text-xl font-bold drop-shadow-sm'>{current.tree.name}</p>
                            <p className='text-xs text-white/80'>
                                {speciesById(current.tree.speciesId)?.name} · {current.tree.location}
                            </p>
                        </div>
                    </Link>
                </section>
            )}

            {styling && (
                <section>
                    <h2 className='mb-2 font-semibold'>Work on this</h2>
                    <Link
                        href={`/trees/${styling.tree.id}?progress=1`}
                        className='bg-card flex gap-3 rounded-3xl p-3 shadow-sm transition-transform active:scale-[0.99]'>
                        <div className='size-24 shrink-0 overflow-hidden rounded-2xl'>
                            <TreePhoto photo={styling.tree.photo} name={styling.tree.name} />
                        </div>
                        <div className='min-w-0 flex-1 py-0.5'>
                            <span className='bg-accent text-accent-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold'>
                                {styling.kind === 'wiring' ? (
                                    <Cable className='size-3' />
                                ) : (
                                    <Scissors className='size-3' />
                                )}
                                {styling.title}
                            </span>
                            <p className='mt-1 truncate text-sm font-semibold'>{styling.tree.name}</p>
                            <p className='text-muted-foreground line-clamp-2 text-xs leading-snug'>{styling.detail}</p>
                            <p className='text-muted-foreground mt-1 text-[11px]'>
                                {styling.everStyled
                                    ? `Last styled ${styling.daysSince} days ago`
                                    : 'No styling logged yet'}
                            </p>
                        </div>
                    </Link>
                </section>
            )}

            <section>
                <div className='mb-2 flex items-center justify-between'>
                    <h2 className='font-semibold'>{filter ? `${FILTERS.find((f) => f.kind === filter)?.label} tasks` : 'Today’s care'}</h2>
                    <div className='flex items-center gap-3'>
                        {dueWater.length > 0 && (
                            <button
                                onClick={() => {
                                    dueWater.forEach(completeTask);
                                    toast.success(
                                        `${dueWater.length} ${dueWater.length === 1 ? 'plant' : 'plants'} marked as watered — the rest stay on their own rhythm.`
                                    );
                                }}
                                className='bg-accent text-accent-foreground flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold'>
                                <Droplets className='size-3.5' /> Watered the {dueWater.length} due
                            </button>
                        )}
                        <Link href='/tasks' className='text-primary flex items-center text-sm font-medium'>
                            All tasks <ChevronRight className='size-4' />
                        </Link>
                    </div>
                </div>
                {shown.length === 0 ? (
                    <div className='bg-card rounded-3xl p-5 text-center shadow-sm'>
                        <p className='font-medium'>{filter ? 'Nothing of this kind due' : 'All done for today 🌿'}</p>
                        <p className='text-muted-foreground mt-1 text-sm'>
                            {filter ? 'Tap the tile again to see everything.' : 'Your trees are happy. Check back tomorrow.'}
                        </p>
                    </div>
                ) : (
                    <div className='space-y-2'>
                        {shown.slice(0, 4).map((task) => (
                            <TaskRow key={task.key} task={task} />
                        ))}
                        {shown.length > 4 && (
                            <Link href='/tasks' className='text-primary block py-1 text-center text-sm font-medium'>
                                +{shown.length - 4} more due
                            </Link>
                        )}
                    </div>
                )}
            </section>

            <section className='bg-card rounded-3xl p-5 shadow-sm'>
                <p className='text-primary text-sm font-semibold'>{SEASON_LABEL[season]} tip</p>
                <p className='mt-1 text-sm leading-relaxed'>
                    {seasonTip(season)}{' '}
                    <Link href='/learn' className='text-primary font-medium underline underline-offset-2'>
                        Open the knowledge base
                    </Link>
                </p>
            </section>
        </div>
    );
};

const seasonTip = (season: ReturnType<typeof currentSeason>): string =>
    ({
        spring: 'Hot season: small pots can dry in hours — check every morning, shade the pots themselves, and repot now while growth is explosive.',
        summer: 'Rainy season: check drainage instead of watering on schedule, keep the air moving against fungus, and shelter jade and junipers from days of rain.',
        autumn: 'Late rains: vigorous growth — keep trimming, wire flexible branches and check wire often, it bites fast now.',
        winter: 'Cool season: the closest thing to rest. Give temperate species the coolest spot you have and use the calm for styling decisions.'
    })[season];

export default GrowPage;
