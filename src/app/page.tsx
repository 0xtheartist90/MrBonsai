'use client';

import Link from 'next/link';

import { TreePhoto } from '@/components/bonsai/tree-photo';
import { useBonsai } from '@/lib/bonsai/store';
import { treeUrgency } from '@/lib/bonsai/urgency';
import { cn } from '@/lib/utils';

import { Sprout } from 'lucide-react';

/**
 * Two rows of cards fill the screen exactly, on any device height.
 * Subtracted: page padding + header + grid offset + the floating nav's zone.
 */
const CARD_HEIGHT = 'h-[calc((100dvh-11.25rem)/2-0.375rem)]';

const MyTreesPage = () => {
    const { ready, trees, tasks } = useBonsai();

    if (!ready) return null;

    // oldest first; trees without a known start year go last
    const sorted = [...trees].sort(
        (a, b) =>
            (a.birthYear ?? Number.MAX_SAFE_INTEGER) - (b.birthYear ?? Number.MAX_SAFE_INTEGER) ||
            new Date(a.acquiredAt).getTime() - new Date(b.acquiredAt).getTime()
    );

    return (
        <div className='space-y-4'>
            <header className='flex items-center justify-between pt-2'>
                <div>
                    <p className='text-muted-foreground text-sm'>
                        {trees.length} {trees.length === 1 ? 'plant' : 'plants'} in your collection
                    </p>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Mr. <span className='text-primary'>Bonsai</span>
                    </h1>
                </div>
                <span className='from-primary to-primary/70 text-primary-foreground shadow-primary/25 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg'>
                    <Sprout className='size-6' />
                </span>
            </header>

            {sorted.length === 0 ? (
                <div className='bg-card rounded-3xl p-6 text-center shadow-sm'>
                    <p className='font-medium'>No trees yet</p>
                    <p className='text-muted-foreground mt-1 text-sm'>
                        Tap the <span className='text-primary font-semibold'>+</span> button to add your first bonsai.
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-2 gap-3'>
                    {sorted.map((tree) => {
                        const urgency = treeUrgency(tasks, tree.id);
                        const age = tree.birthYear ? new Date().getFullYear() - tree.birthYear : undefined;

                        return (
                            <Link
                                key={tree.id}
                                href={`/trees/${tree.id}`}
                                className={cn(
                                    'bg-card relative overflow-hidden rounded-[1.75rem] shadow-sm transition-transform active:scale-[0.97]',
                                    CARD_HEIGHT
                                )}>
                                <TreePhoto photo={tree.photo} name={tree.name} />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5' />

                                <div className='absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-1'>
                                    {urgency && (
                                        <span
                                            className={cn(
                                                'truncate rounded-full px-2 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-md',
                                                urgency.overdue
                                                    ? 'bg-destructive/90 text-white'
                                                    : 'bg-white/85 text-foreground'
                                            )}>
                                            {urgency.label}
                                        </span>
                                    )}
                                    {tree.stage === 'cutting' && (
                                        <span className='ml-auto shrink-0 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold backdrop-blur-md'>
                                            Cutting
                                        </span>
                                    )}
                                </div>

                                <div className='absolute inset-x-3 bottom-3 text-white'>
                                    <p className='line-clamp-2 text-[15px] leading-tight font-bold drop-shadow-sm'>
                                        {tree.name}
                                    </p>
                                    {age !== undefined && (
                                        <span className='mt-1.5 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap backdrop-blur-sm'>
                                            {age < 1 ? '< 1 yr' : `±${age} yrs`}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyTreesPage;
