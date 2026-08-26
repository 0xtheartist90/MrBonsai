'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { PhotoInput } from '@/components/bonsai/photo-input';
import { SPECIES, speciesById } from '@/lib/bonsai/species';
import { useBonsai } from '@/lib/bonsai/store';
import type { LeafType } from '@/lib/bonsai/types';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';

import { Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const leafOptions: { value: LeafType; label: string }[] = [
    { value: 'broadleaf', label: 'Flat leaves' },
    { value: 'needle', label: 'Needles' },
    { value: 'scale', label: 'Scale foliage' },
    { value: 'succulent', label: 'Thick succulent' }
];

const NewTreePage = () => {
    const router = useRouter();
    const { addTree } = useBonsai();

    const [name, setName] = useState('');
    const [photo, setPhoto] = useState<string>();
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [speciesId, setSpeciesId] = useState<string>();
    const [speciesQuery, setSpeciesQuery] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [price, setPrice] = useState('');
    const [shop, setShop] = useState('');
    const [acquiredDate, setAcquiredDate] = useState(new Date().toISOString().slice(0, 10));
    const [stage, setStage] = useState<'cutting' | 'development' | 'refinement'>('development');

    // identification wizard state
    const [identifying, setIdentifying] = useState(false);
    const [leafType, setLeafType] = useState<LeafType>();
    const [evergreen, setEvergreen] = useState<boolean>();
    const [flowers, setFlowers] = useState<boolean>();

    const matches = useMemo(() => {
        if (!leafType) return [];

        return SPECIES.filter(
            (s) =>
                s.leafType === leafType &&
                (evergreen === undefined || s.evergreen === evergreen) &&
                (flowers === undefined || s.flowers === flowers)
        );
    }, [leafType, evergreen, flowers]);

    const selected = speciesId ? speciesById(speciesId) : undefined;

    const save = () => {
        if (!name.trim() || !speciesId) {
            toast.error('Give your tree a name and pick its species.');

            return;
        }
        const tree = addTree({
            name: name.trim(),
            speciesId,
            acquiredAt: new Date(`${acquiredDate}T12:00:00`).toISOString(),
            location: location.trim() || 'Home',
            notes: notes.trim(),
            photo,
            stage,
            birthYear: birthYear ? Number(birthYear) : undefined,
            purchasePrice: price ? Number(price) : undefined,
            purchasedAt: shop.trim() || undefined
        });
        toast.success(`${tree.name} added to your collection!`);
        router.push(`/trees/${tree.id}`);
    };

    return (
        <div className='space-y-5'>
            <header className='pt-2'>
                <h1 className='text-2xl font-bold'>Add a bonsai</h1>
                <p className='text-muted-foreground text-sm'>Create a profile to start tracking care and progress.</p>
            </header>

            <PhotoInput value={photo} onChange={setPhoto} label='Add a photo of your tree' />

            <div className='space-y-3'>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name (e.g. Mr. Miyagi)'
                    className='bg-card h-12 rounded-2xl border-none'
                />
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder='Location (e.g. balcony, windowsill)'
                    className='bg-card h-12 rounded-2xl border-none'
                />
                <div className='flex gap-3'>
                    <Input
                        type='number'
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder='Start year (± age)'
                        className='bg-card h-12 flex-1 rounded-2xl border-none'
                    />
                    <Input
                        type='number'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder='Price (฿)'
                        className='bg-card h-12 flex-1 rounded-2xl border-none'
                    />
                </div>
                <Input
                    value={shop}
                    onChange={(e) => setShop(e.target.value)}
                    placeholder='Bought at (nursery, web shop, market…)'
                    className='bg-card h-12 rounded-2xl border-none'
                />
                <div>
                    <p className='text-muted-foreground mb-1 text-xs font-medium'>In your care since</p>
                    <Input
                        type='date'
                        value={acquiredDate}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => e.target.value && setAcquiredDate(e.target.value)}
                        className='bg-card h-12 rounded-2xl border-none'
                    />
                </div>
                <div>
                    <p className='text-muted-foreground mb-1 text-xs font-medium'>Stage</p>
                    <div className='flex gap-1.5'>
                        {(
                            [
                                ['cutting', 'Cutting'],
                                ['development', 'Development'],
                                ['refinement', 'Refinement']
                            ] as ['cutting' | 'development' | 'refinement', string][]
                        ).map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() => setStage(value)}
                                className={cn(
                                    'flex-1 rounded-full px-3 py-2.5 text-xs font-semibold transition-colors',
                                    stage === value ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
                                )}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <section className='bg-card space-y-3 rounded-3xl p-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-semibold'>Species</h2>
                    <button
                        onClick={() => setIdentifying((v) => !v)}
                        className='text-primary flex items-center gap-1 text-sm font-medium'>
                        <Sparkles className='size-4' /> Help me identify
                    </button>
                </div>

                {identifying && (
                    <div className='bg-accent/50 space-y-3 rounded-2xl p-3'>
                        <p className='text-sm font-medium'>What do the leaves look like?</p>
                        <div className='flex flex-wrap gap-2'>
                            {leafOptions.map((o) => (
                                <Chip
                                    key={o.value}
                                    active={leafType === o.value}
                                    onClick={() => setLeafType(o.value)}
                                    label={o.label}
                                />
                            ))}
                        </div>
                        <p className='text-sm font-medium'>Does it keep its leaves in winter?</p>
                        <div className='flex gap-2'>
                            <Chip active={evergreen === true} onClick={() => setEvergreen(true)} label='Yes' />
                            <Chip active={evergreen === false} onClick={() => setEvergreen(false)} label='No' />
                        </div>
                        <p className='text-sm font-medium'>Have you seen it flower?</p>
                        <div className='flex gap-2'>
                            <Chip active={flowers === true} onClick={() => setFlowers(true)} label='Yes' />
                            <Chip active={flowers === false} onClick={() => setFlowers(false)} label='No' />
                        </div>
                        {leafType && (
                            <p className='text-muted-foreground text-xs'>
                                {matches.length} matching species — highlighted below.
                            </p>
                        )}
                    </div>
                )}

                <Input
                    value={speciesQuery}
                    onChange={(e) => setSpeciesQuery(e.target.value)}
                    placeholder='Search species (name or latin)…'
                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                />
                <div className='max-h-72 space-y-2 overflow-y-auto'>
                    {SPECIES.filter((s) =>
                        `${s.name} ${s.latin}`.toLowerCase().includes(speciesQuery.toLowerCase())
                    ).map((s) => {
                        const highlighted = matches.some((m) => m.id === s.id);
                        const active = speciesId === s.id;

                        return (
                            <button
                                key={s.id}
                                onClick={() => setSpeciesId(s.id)}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors',
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : highlighted
                                          ? 'bg-accent'
                                          : 'bg-secondary/60'
                                )}>
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate text-sm font-semibold'>{s.name}</p>
                                    <p className={cn('truncate text-xs', active ? 'opacity-80' : 'text-muted-foreground')}>
                                        {s.latin} · {s.placement} · {s.difficulty}
                                    </p>
                                </div>
                                {active && <Check className='size-4 shrink-0' />}
                            </button>
                        );
                    })}
                </div>

                {selected && (
                    <p className='text-muted-foreground text-xs leading-relaxed'>
                        {selected.description} Care schedules for watering, feeding and repotting will be created
                        automatically.
                    </p>
                )}
            </section>

            <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Notes (style plans, history, quirks…)'
                className='bg-card min-h-24 rounded-2xl border-none'
            />

            <Button onClick={save} className='h-13 w-full rounded-full text-base font-semibold'>
                Add to my collection
            </Button>
        </div>
    );
};

const Chip = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
    <button
        onClick={onClick}
        className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            active ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
        )}>
        {label}
    </button>
);

export default NewTreePage;
