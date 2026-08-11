'use client';

import { use } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SEASON_LABEL, currentSeason } from '@/lib/bonsai/season';
import { speciesById } from '@/lib/bonsai/species';
import { useBonsai } from '@/lib/bonsai/store';
import type { Season } from '@/lib/bonsai/types';

import { ArrowLeft, Droplets, Leaf, MapPin, Scissors, Shovel, Sun, Thermometer } from 'lucide-react';

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];

const SpeciesGuidePage = ({ params }: { params: Promise<{ speciesId: string }> }) => {
    const { speciesId } = use(params);
    const router = useRouter();
    const { trees } = useBonsai();

    const species = speciesById(speciesId);
    if (!species) {
        return (
            <div className='space-y-4 pt-10 text-center'>
                <p className='font-medium'>Species guide not found.</p>
                <Link href='/learn' className='text-primary text-sm font-medium'>
                    Back to Learn
                </Link>
            </div>
        );
    }

    const myTrees = trees.filter((t) => t.speciesId === species.id);
    const season = currentSeason();

    return (
        <div className='space-y-5'>
            <header className='flex items-start gap-3 pt-2'>
                <button
                    onClick={() => router.back()}
                    aria-label='Back'
                    className='bg-card flex size-10 shrink-0 items-center justify-center rounded-full'>
                    <ArrowLeft className='size-5' />
                </button>
                <div>
                    <h1 className='text-2xl font-bold'>{species.name}</h1>
                    <p className='text-muted-foreground text-sm italic'>{species.latin}</p>
                </div>
            </header>

            <div className='flex flex-wrap gap-2'>
                <Badge label={species.placement === 'both' ? 'indoor & outdoor' : species.placement} />
                <Badge label={species.difficulty} />
                <Badge label={species.evergreen ? 'evergreen' : 'deciduous'} />
                {species.flowers && <Badge label='flowering' />}
            </div>

            <p className='text-sm leading-relaxed'>{species.description}</p>

            {myTrees.length > 0 && (
                <div className='bg-accent rounded-3xl p-4'>
                    <p className='text-sm font-semibold'>In your collection</p>
                    <div className='mt-2 flex flex-wrap gap-2'>
                        {myTrees.map((t) => (
                            <Link
                                key={t.id}
                                href={`/trees/${t.id}`}
                                className='bg-card rounded-full px-3 py-1.5 text-xs font-medium'>
                                {t.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <section className='bg-card space-y-3 rounded-3xl p-4'>
                <h2 className='font-semibold'>Care guide</h2>
                <GuideLine icon={Droplets} title='Watering' text={species.care.watering} />
                <GuideLine icon={Leaf} title='Fertilizing' text={species.care.fertilizing} />
                <GuideLine icon={Shovel} title='Repotting' text={species.care.repotting} />
                <GuideLine icon={Scissors} title='Pruning' text={species.care.pruning} />
                <GuideLine icon={Sun} title='Sunlight' text={species.care.sunlight} />
                <GuideLine icon={Thermometer} title='Temperature' text={species.care.temperature} />
                <GuideLine
                    icon={MapPin}
                    title='Placement'
                    text={
                        species.placement === 'indoor'
                            ? 'Keep indoors; a summer holiday outside is appreciated.'
                            : species.placement === 'outdoor'
                              ? 'Must live outdoors year-round — it needs the seasons.'
                              : 'Thrives indoors and outdoors.'
                    }
                />
            </section>

            <section>
                <h2 className='mb-2 font-semibold'>Through the year</h2>
                <div className='space-y-2'>
                    {SEASONS.map((s) => (
                        <div
                            key={s}
                            className={`rounded-3xl p-4 ${s === season ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                            <p className={`text-xs font-semibold ${s === season ? 'opacity-80' : 'text-muted-foreground'}`}>
                                {SEASON_LABEL[s]}
                                {s === season ? ' · now' : ''}
                            </p>
                            <p className='mt-1 text-sm leading-relaxed'>{species.seasonalTips[s]}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const Badge = ({ label }: { label: string }) => (
    <span className='bg-card rounded-full px-3 py-1 text-xs font-medium capitalize'>{label}</span>
);

const GuideLine = ({ icon: Icon, title, text }: { icon: typeof Droplets; title: string; text: string }) => (
    <div className='flex gap-3'>
        <span className='bg-accent text-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-xl'>
            <Icon className='size-4' strokeWidth={1.8} />
        </span>
        <div>
            <p className='text-sm font-semibold'>{title}</p>
            <p className='text-muted-foreground text-xs leading-relaxed'>{text}</p>
        </div>
    </div>
);

export default SpeciesGuidePage;
