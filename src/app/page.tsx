'use client';

import { useState } from 'react';

import Link from 'next/link';

import { TreePhoto } from '@/components/bonsai/tree-photo';
import { formatDate } from '@/lib/bonsai/season';
import { speciesById } from '@/lib/bonsai/species';
import { useBonsai } from '@/lib/bonsai/store';
import { Input } from '@/registry/new-york-v4/ui/input';

import { Search, Sprout } from 'lucide-react';

const MyTreesPage = () => {
    const { ready, trees } = useBonsai();
    const [query, setQuery] = useState('');

    if (!ready) return null;

    const filtered = trees
        .filter((tree) => {
            const species = speciesById(tree.speciesId);
            const haystack = `${tree.name} ${species?.name ?? ''} ${species?.latin ?? ''}`.toLowerCase();

            return haystack.includes(query.toLowerCase());
        })
        // oldest first; trees without a known start year go last
        .sort(
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

            <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2' />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search your collection'
                    className='bg-card h-12 rounded-full border-none pl-11 shadow-sm'
                />
            </div>

            {filtered.length === 0 ? (
                <div className='bg-card rounded-3xl p-6 text-center shadow-sm'>
                    <p className='font-medium'>{trees.length === 0 ? 'No trees yet' : 'No matches'}</p>
                    <p className='text-muted-foreground mt-1 text-sm'>
                        {trees.length === 0 ? (
                            <>
                                Tap the <span className='text-primary font-semibold'>+</span> button to add your first
                                bonsai.
                            </>
                        ) : (
                            'Try a different search term.'
                        )}
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-2 gap-3'>
                    {filtered.map((tree) => {
                        const species = speciesById(tree.speciesId);

                        return (
                            <Link
                                key={tree.id}
                                href={`/trees/${tree.id}`}
                                className='bg-card overflow-hidden rounded-3xl shadow-sm transition-transform active:scale-[0.98]'>
                                <div className='relative h-40'>
                                    <TreePhoto photo={tree.photo} name={tree.name} />
                                    {tree.stage === 'cutting' && (
                                        <span className='bg-card/90 absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur'>
                                            Cutting
                                        </span>
                                    )}
                                </div>
                                <div className='p-3'>
                                    <p className='truncate font-semibold'>{tree.name}</p>
                                    <p className='text-muted-foreground truncate text-xs'>{species?.name}</p>
                                    <p className='text-muted-foreground mt-1 text-xs'>
                                        {tree.birthYear
                                            ? new Date().getFullYear() - tree.birthYear < 1
                                                ? '< 1 yr old'
                                                : `±${new Date().getFullYear() - tree.birthYear} yrs old`
                                            : `Since ${formatDate(tree.acquiredAt)}`}
                                    </p>
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
