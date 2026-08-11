'use client';

import Link from 'next/link';

import { ARTICLES, VIDEOS } from '@/lib/bonsai/knowledge';
import { SPECIES } from '@/lib/bonsai/species';
import { useBonsai } from '@/lib/bonsai/store';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/registry/new-york-v4/ui/accordion';

import { ChevronRight, Clock, GraduationCap, Play, Sprout } from 'lucide-react';

const LearnPage = () => {
    const { trees } = useBonsai();
    const mySpeciesIds = new Set(trees.map((t) => t.speciesId));
    const mySpecies = SPECIES.filter((s) => mySpeciesIds.has(s.id));
    const otherSpecies = SPECIES.filter((s) => !mySpeciesIds.has(s.id));

    return (
        <div className='space-y-6'>
            <header className='pt-2'>
                <h1 className='text-2xl font-bold'>Learn</h1>
                <p className='text-muted-foreground text-sm'>Guides, articles and videos to grow your skills</p>
            </header>

            {mySpecies.length > 0 && (
                <section>
                    <h2 className='mb-2 font-semibold'>Guides for your trees</h2>
                    <div className='space-y-2'>
                        {mySpecies.map((s) => (
                            <SpeciesLink key={s.id} id={s.id} name={s.name} latin={s.latin} highlighted />
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className='mb-2 font-semibold'>Species care guides</h2>
                <div className='space-y-2'>
                    {otherSpecies.map((s) => (
                        <SpeciesLink key={s.id} id={s.id} name={s.name} latin={s.latin} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className='mb-2 font-semibold'>Articles</h2>
                <Accordion type='single' collapsible className='space-y-2'>
                    {ARTICLES.map((a) => (
                        <AccordionItem key={a.id} value={a.id} className='bg-card rounded-3xl border-none px-4'>
                            <AccordionTrigger className='py-4 hover:no-underline'>
                                <div className='flex items-center gap-3 text-left'>
                                    <span className='bg-accent text-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-xl'>
                                        <GraduationCap className='size-4' />
                                    </span>
                                    <div>
                                        <p className='text-sm font-semibold'>{a.title}</p>
                                        <p className='text-muted-foreground text-xs'>
                                            {a.level === 'beginner' ? 'Beginner' : 'Advanced'} · {a.minutes} min read
                                        </p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className='space-y-2 pb-4'>
                                {a.body.map((p, i) => (
                                    <p key={i} className='text-muted-foreground text-sm leading-relaxed'>
                                        {p}
                                    </p>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            <section>
                <h2 className='mb-2 font-semibold'>Free videos</h2>
                <div className='space-y-2'>
                    {VIDEOS.map((v) => (
                        <a
                            key={v.id}
                            href={v.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='bg-card flex items-center gap-3 rounded-3xl p-3'>
                            <span className='bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl'>
                                <Play className='size-4' />
                            </span>
                            <div className='min-w-0 flex-1'>
                                <p className='truncate text-sm font-semibold'>{v.title}</p>
                                <p className='text-muted-foreground flex items-center gap-1 text-xs'>
                                    {v.source} · <Clock className='size-3' /> {v.minutes} min
                                </p>
                            </div>
                            <ChevronRight className='text-muted-foreground size-4 shrink-0' />
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

const SpeciesLink = ({
    id,
    name,
    latin,
    highlighted
}: {
    id: string;
    name: string;
    latin: string;
    highlighted?: boolean;
}) => (
    <Link
        href={`/learn/${id}`}
        className={`flex items-center gap-3 rounded-3xl p-3 ${highlighted ? 'bg-accent' : 'bg-card'}`}>
        <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                highlighted ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
            }`}>
            <Sprout className='size-5' strokeWidth={1.8} />
        </span>
        <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-semibold'>{name}</p>
            <p className='text-muted-foreground truncate text-xs italic'>{latin}</p>
        </div>
        <ChevronRight className='text-muted-foreground size-4 shrink-0' />
    </Link>
);

export default LearnPage;
