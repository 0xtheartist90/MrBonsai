'use client';

import Link from 'next/link';

import { TaskRow } from '@/components/bonsai/task-row';
import { SEASON_LABEL, currentSeason, daysBetween } from '@/lib/bonsai/season';
import { useBonsai } from '@/lib/bonsai/store';

import { ChevronRight, Sprout } from 'lucide-react';

const GrowPage = () => {
    const { ready, trees, tasks } = useBonsai();
    const season = currentSeason();

    if (!ready) return null;

    const dueTasks = tasks.filter((t) => daysBetween(new Date(), t.due) <= 0);
    const upcoming = tasks.filter((t) => daysBetween(new Date(), t.due) > 0).slice(0, 3);
    const cuttings = trees.filter((t) => t.stage === 'cutting').length;
    const value = trees.reduce((sum, t) => sum + (t.purchasePrice ?? 0), 0);

    return (
        <div className='space-y-6'>
            <header className='flex items-center justify-between pt-2'>
                <div>
                    <p className='text-muted-foreground text-sm'>{SEASON_LABEL[season]} · it&apos;s plant care time</p>
                    <h1 className='text-3xl font-bold tracking-tight'>Grow</h1>
                </div>
                <span className='from-primary to-primary/70 text-primary-foreground shadow-primary/25 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg'>
                    <Sprout className='size-6' />
                </span>
            </header>

            <section>
                <div className='mb-2 flex items-center justify-between'>
                    <h2 className='font-semibold'>Today&apos;s care</h2>
                    <Link href='/tasks' className='text-primary flex items-center text-sm font-medium'>
                        All tasks <ChevronRight className='size-4' />
                    </Link>
                </div>
                {dueTasks.length === 0 ? (
                    <div className='bg-card rounded-3xl p-5 text-center shadow-sm'>
                        <p className='font-medium'>All done for today 🌿</p>
                        <p className='text-muted-foreground mt-1 text-sm'>Your trees are happy. Check back tomorrow.</p>
                    </div>
                ) : (
                    <div className='space-y-2'>
                        {dueTasks.slice(0, 4).map((task) => (
                            <TaskRow key={task.key} task={task} />
                        ))}
                        {dueTasks.length > 4 && (
                            <Link href='/tasks' className='text-primary block py-1 text-center text-sm font-medium'>
                                +{dueTasks.length - 4} more due
                            </Link>
                        )}
                    </div>
                )}
            </section>

            {upcoming.length > 0 && (
                <section>
                    <h2 className='mb-2 font-semibold'>Coming up</h2>
                    <div className='space-y-2'>
                        {upcoming.map((task) => (
                            <TaskRow key={task.key} task={task} />
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className='mb-2 font-semibold'>Your collection</h2>
                <div className='grid grid-cols-3 gap-2'>
                    <Stat label='Trees' value={String(trees.length - cuttings)} />
                    <Stat label='Cuttings' value={String(cuttings)} />
                    <Stat label='Invested' value={`฿${value.toLocaleString('en-US')}`} />
                </div>
            </section>

            <section className='from-primary to-primary/80 text-primary-foreground shadow-primary/20 rounded-3xl bg-gradient-to-br p-5 shadow-lg'>
                <p className='text-sm font-medium opacity-80'>{SEASON_LABEL[season]} tip</p>
                <p className='mt-1 text-sm leading-relaxed'>
                    {seasonTip(season)}{' '}
                    <Link href='/learn' className='underline underline-offset-2'>
                        Open the knowledge base
                    </Link>
                </p>
            </section>
        </div>
    );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className='bg-card rounded-2xl p-3 text-center shadow-sm'>
        <p className='truncate text-lg font-bold'>{value}</p>
        <p className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>{label}</p>
    </div>
);

const seasonTip = (season: ReturnType<typeof currentSeason>): string =>
    ({
        spring: 'Repotting season! Most species are best repotted right as their buds start to swell.',
        summer: 'Hot days ahead — check soil moisture daily and shade sensitive species from afternoon sun.',
        autumn: 'Growth slows down. Reduce feeding, do your wiring, and photograph the autumn colours.',
        winter: 'Most trees rest now. Water sparingly and plan next year’s styling.'
    })[season];

export default GrowPage;
