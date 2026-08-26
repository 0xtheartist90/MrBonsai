'use client';

import { use, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { PhotoInput } from '@/components/bonsai/photo-input';
import { TaskRow } from '@/components/bonsai/task-row';
import { TreePhoto } from '@/components/bonsai/tree-photo';
import { SEASON_LABEL, currentSeason, formatDate } from '@/lib/bonsai/season';
import { SPECIES, speciesById } from '@/lib/bonsai/species';
import { useBonsai } from '@/lib/bonsai/store';
import type { ProgressKind } from '@/lib/bonsai/types';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';

import {
    ArrowLeft,
    BookOpen,
    Banknote,
    Cable,
    Camera,
    Droplets,
    Layers,
    Leaf,
    Pencil,
    Scissors,
    Shovel,
    Sparkles,
    Store,
    Sun,
    Thermometer,
    TreeDeciduous,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';

// Multi-select: an entry can be repotting AND wiring at once; nothing selected = plain note
const KIND_OPTIONS: { value: ProgressKind; label: string; icon: typeof Camera }[] = [
    { value: 'pruning', label: 'Pruning', icon: Scissors },
    { value: 'wiring', label: 'Wiring', icon: Cable },
    { value: 'repotting', label: 'Repotting', icon: Shovel },
    { value: 'styling', label: 'Styling', icon: Sparkles }
];

const toggleKind = (kinds: ProgressKind[], kind: ProgressKind): ProgressKind[] =>
    kinds.includes(kind) ? kinds.filter((k) => k !== kind) : [...kinds, kind];

const SOIL_COMPONENTS = ['pumice', 'akadama', 'lava', 'cocopeat', 'grit', 'potting soil', 'sphagnum', 'perlite'];

const FERTILIZERS = ['organic pellets', 'liquid balanced', 'slow-release', 'biogold', 'none (rooting)'];

const KIND_LABEL: Record<ProgressKind, string> = {
    note: 'Note',
    pruning: 'Pruning',
    wiring: 'Wiring',
    repotting: 'Repotting',
    styling: 'Styling'
};

const TreePage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { ready, trees, tasks, addProgress, updateProgress, deleteProgress, deleteTree, updateTree } = useBonsai();

    const [progressNote, setProgressNote] = useState('');
    const [progressPhoto, setProgressPhoto] = useState<string>();
    const [progressKinds, setProgressKinds] = useState<ProgressKind[]>([]);
    const [progressDate, setProgressDate] = useState(new Date().toISOString().slice(0, 10));
    const [addingProgress, setAddingProgress] = useState(searchParams.get('progress') === '1');
    const [editingEntry, setEditingEntry] = useState<string | null>(null);
    const [tab, setTab] = useState(searchParams.get('progress') === '1' ? 'progress' : 'care');

    if (!ready) return null;

    const tree = trees.find((t) => t.id === id);
    if (!tree) {
        return (
            <div className='space-y-4 pt-10 text-center'>
                <p className='font-medium'>This tree is no longer in your collection.</p>
                <Link href='/' className='text-primary text-sm font-medium'>
                    Back to My Trees
                </Link>
            </div>
        );
    }

    const species = speciesById(tree.speciesId)!;
    const season = currentSeason();
    const treeTasks = tasks.filter((t) => t.treeId === tree.id);
    const age = tree.birthYear ? new Date().getFullYear() - tree.birthYear : undefined;

    const saveProgress = () => {
        if (!progressNote.trim() && !progressPhoto) {
            toast.error('Add a note or a photo first.');

            return;
        }
        addProgress(tree.id, {
            date: new Date(`${progressDate}T12:00:00`).toISOString(),
            note: progressNote.trim(),
            photo: progressPhoto,
            kinds: progressKinds
        });
        setProgressNote('');
        setProgressPhoto(undefined);
        setProgressKinds([]);
        setProgressDate(new Date().toISOString().slice(0, 10));
        setAddingProgress(false);
        toast.success(
            progressKinds.includes('wiring')
                ? 'Wiring logged — a wire check is scheduled in 6 weeks.'
                : 'Progress saved to the timeline.'
        );
    };

    return (
        <div className='space-y-4'>
            <div className='relative -mx-4 -mt-4 h-80 overflow-hidden'>
                <TreePhoto photo={tree.photo} name={tree.name} />
                <div className='absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 via-black/25 to-transparent' />
                <button
                    onClick={() => router.back()}
                    aria-label='Back'
                    className='absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-md'>
                    <ArrowLeft className='size-5' />
                </button>
                <button
                    onClick={() => {
                        if (confirm(`Remove ${tree.name} from your collection? This cannot be undone.`)) {
                            deleteTree(tree.id);
                            toast.success(`${tree.name} removed.`);
                            router.push('/');
                        }
                    }}
                    aria-label='Delete tree'
                    className='text-destructive absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-md'>
                    <Trash2 className='size-4' />
                </button>
                <div className='absolute inset-x-4 bottom-4 text-white'>
                    {tree.stage && (
                        <span className='mb-1.5 inline-block rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-semibold capitalize backdrop-blur-sm'>
                            {tree.stage}
                        </span>
                    )}
                    <h1 className='text-3xl font-bold tracking-tight drop-shadow-sm'>{tree.name}</h1>
                    <p className='text-sm text-white/85'>
                        {species.name} · <span className='italic'>{species.latin}</span>
                    </p>
                </div>
            </div>

            <div className='-mx-4 flex snap-x gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                <StatChip
                    icon={TreeDeciduous}
                    label='Age'
                    value={age === undefined ? 'Unknown' : age < 1 ? '< 1 yr' : `±${age} yrs`}
                    onClick={() => setTab('details')}
                />
                <StatChip
                    icon={Banknote}
                    label='Paid'
                    value={tree.purchasePrice !== undefined ? `฿${tree.purchasePrice}` : '—'}
                    onClick={() => setTab('details')}
                />
                <StatChip
                    icon={Cable}
                    label='Wired'
                    value={tree.lastWired ? formatDate(tree.lastWired) : 'Not yet'}
                    onClick={() => setTab('details')}
                />
                <StatChip icon={Store} label='From' value={tree.purchasedAt || '—'} onClick={() => setTab('details')} />
            </div>

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className='bg-card h-11 w-full rounded-full p-1 shadow-sm'>
                    <TabsTrigger value='care' className='flex-1 rounded-full'>
                        Care
                    </TabsTrigger>
                    <TabsTrigger value='progress' className='flex-1 rounded-full'>
                        Progress
                    </TabsTrigger>
                    <TabsTrigger value='details' className='flex-1 rounded-full'>
                        Details
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='care' className='mt-4 space-y-4'>
                    {treeTasks.length > 0 && (
                        <div className='space-y-2'>
                            {treeTasks.map((task) => (
                                <TaskRow key={task.key} task={task} />
                            ))}
                        </div>
                    )}

                    <div className='from-primary to-primary/80 text-primary-foreground rounded-3xl bg-gradient-to-br p-4 shadow-sm'>
                        <p className='text-sm font-medium opacity-80'>
                            {SEASON_LABEL[season]} · {species.name}
                        </p>
                        <p className='mt-1 text-sm leading-relaxed'>{species.seasonalTips[season]}</p>
                    </div>

                    {(tree.soilMix || tree.fertilizer) && (
                        <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                            <h2 className='font-semibold'>Your setup</h2>
                            {tree.soilMix && <CareLine icon={Layers} title='Soil mix' text={tree.soilMix} />}
                            {tree.fertilizer && <CareLine icon={Leaf} title='Fertilizer' text={tree.fertilizer} />}
                        </div>
                    )}

                    <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                        <CareLine icon={Droplets} title='Watering' text={species.care.watering} />
                        <CareLine icon={Leaf} title='Fertilizing' text={species.care.fertilizing} />
                        <CareLine icon={Shovel} title='Repotting' text={species.care.repotting} />
                        <CareLine icon={Sun} title='Sunlight' text={species.care.sunlight} />
                        <CareLine icon={Thermometer} title='Temperature' text={species.care.temperature} />
                    </div>

                    <Link
                        href={`/learn/${species.id}`}
                        className='bg-card flex items-center gap-3 rounded-3xl p-4 text-sm font-medium shadow-sm'>
                        <BookOpen className='text-primary size-5' /> Full {species.name} care guide
                    </Link>
                </TabsContent>

                <TabsContent value='progress' className='mt-4 space-y-4'>
                    {addingProgress ? (
                        <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                            <div>
                                <p className='text-muted-foreground mb-1.5 text-xs font-medium'>
                                    What did you do? Select all that apply — none selected is just a note.
                                </p>
                                <div className='flex flex-wrap gap-2'>
                                    {KIND_OPTIONS.map((o) => (
                                        <button
                                            key={o.value}
                                            onClick={() => setProgressKinds((k) => toggleKind(k, o.value))}
                                            className={cn(
                                                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                                                progressKinds.includes(o.value)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary text-secondary-foreground'
                                            )}>
                                            <o.icon className='size-3.5' /> {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <PhotoInput
                                value={progressPhoto}
                                onChange={setProgressPhoto}
                                label='Take a photo or pick one from your library'
                            />
                            <Field label='Date (e.g. when the photo was taken)'>
                                <Input
                                    type='date'
                                    value={progressDate}
                                    max={new Date().toISOString().slice(0, 10)}
                                    onChange={(e) => e.target.value && setProgressDate(e.target.value)}
                                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                                />
                            </Field>
                            <Textarea
                                value={progressNote}
                                onChange={(e) => setProgressNote(e.target.value)}
                                placeholder='What changed? Pruning, wiring, new growth…'
                                className='bg-secondary/60 min-h-20 rounded-2xl border-none'
                            />
                            <div className='flex gap-2'>
                                <Button onClick={saveProgress} className='h-11 flex-1 rounded-full'>
                                    Save entry
                                </Button>
                                <Button
                                    variant='secondary'
                                    onClick={() => setAddingProgress(false)}
                                    className='h-11 rounded-full'>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={() => setAddingProgress(true)} className='h-12 w-full rounded-full shadow-sm'>
                            <Camera className='size-4' /> New progress entry
                        </Button>
                    )}

                    {tree.progress.length === 0 ? (
                        <div className='bg-card rounded-3xl p-5 text-center shadow-sm'>
                            <p className='font-medium'>No entries yet</p>
                            <p className='text-muted-foreground mt-1 text-sm'>
                                Add photos and notes over time to build the visual history of {tree.name} — and compare
                                seasons and years.
                            </p>
                        </div>
                    ) : (
                        <ol className='space-y-3'>
                            {tree.progress.map((entry) => (
                                <li key={entry.id} className='bg-card overflow-hidden rounded-3xl shadow-sm'>
                                    {entry.photo && (
                                        <div className='h-48'>
                                            <TreePhoto photo={entry.photo} name={tree.name} />
                                        </div>
                                    )}
                                    <div className='p-4'>
                                        <div className='flex items-center gap-2'>
                                            <p className='text-muted-foreground text-xs'>
                                                {formatDate(entry.date)} ·{' '}
                                                {SEASON_LABEL[currentSeason(new Date(entry.date))]}
                                            </p>
                                            {(entry.kinds ?? []).map((k) => (
                                                <span
                                                    key={k}
                                                    className='bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold'>
                                                    {KIND_LABEL[k]}
                                                </span>
                                            ))}
                                            <div className='ml-auto flex gap-1'>
                                                <button
                                                    aria-label='Edit entry'
                                                    onClick={() =>
                                                        setEditingEntry(editingEntry === entry.id ? null : entry.id)
                                                    }
                                                    className='bg-secondary text-secondary-foreground flex size-7 items-center justify-center rounded-full'>
                                                    <Pencil className='size-3' />
                                                </button>
                                                <button
                                                    aria-label='Delete entry'
                                                    onClick={() => {
                                                        if (confirm('Delete this progress entry?')) {
                                                            deleteProgress(tree.id, entry.id);
                                                            toast.success('Entry deleted.');
                                                        }
                                                    }}
                                                    className='bg-destructive/10 text-destructive flex size-7 items-center justify-center rounded-full'>
                                                    <Trash2 className='size-3' />
                                                </button>
                                            </div>
                                        </div>
                                        {editingEntry === entry.id ? (
                                            <div className='mt-2 space-y-2'>
                                                <div className='flex flex-wrap gap-1.5'>
                                                    {KIND_OPTIONS.map((o) => (
                                                        <button
                                                            key={o.value}
                                                            onClick={() =>
                                                                updateProgress(tree.id, entry.id, {
                                                                    kinds: toggleKind(entry.kinds ?? [], o.value)
                                                                })
                                                            }
                                                            className={cn(
                                                                'rounded-full px-2.5 py-1 text-[10px] font-medium',
                                                                (entry.kinds ?? []).includes(o.value)
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-secondary text-secondary-foreground'
                                                            )}>
                                                            {o.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <Textarea
                                                    defaultValue={entry.note}
                                                    onBlur={(e) =>
                                                        updateProgress(tree.id, entry.id, { note: e.target.value })
                                                    }
                                                    className='bg-secondary/60 min-h-16 rounded-2xl border-none text-sm'
                                                />
                                                <div className='flex items-center justify-between'>
                                                    <Input
                                                        type='date'
                                                        defaultValue={entry.date.slice(0, 10)}
                                                        max={new Date().toISOString().slice(0, 10)}
                                                        onBlur={(e) =>
                                                            e.target.value &&
                                                            updateProgress(tree.id, entry.id, {
                                                                date: new Date(e.target.value).toISOString()
                                                            })
                                                        }
                                                        className='bg-secondary/60 h-9 w-40 rounded-xl border-none text-xs'
                                                    />
                                                    <button
                                                        onClick={() => setEditingEntry(null)}
                                                        className='text-primary text-xs font-semibold'>
                                                        Done
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            entry.note && <p className='mt-1 text-sm'>{entry.note}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </TabsContent>

                <TabsContent value='details' className='mt-4 space-y-4'>
                    <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                        <h2 className='font-semibold'>Cover photo</h2>
                        <PhotoInput
                            value={tree.photo?.startsWith('idb:') ? undefined : tree.photo}
                            onChange={(dataUrl) => {
                                updateTree(tree.id, { photo: dataUrl });
                                toast.success('Cover photo updated.');
                            }}
                            label='Tap to replace the cover photo'
                        />
                    </div>

                    <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                        <h2 className='font-semibold'>Tree details</h2>
                        <Field label='Name'>
                            <Input
                                defaultValue={tree.name}
                                onBlur={(e) => e.target.value.trim() && updateTree(tree.id, { name: e.target.value.trim() })}
                                className='bg-secondary/60 h-11 rounded-2xl border-none'
                            />
                        </Field>
                        <Field label='Species'>
                            <select
                                value={tree.speciesId}
                                onChange={(e) => {
                                    updateTree(tree.id, { speciesId: e.target.value });
                                    toast.success('Species updated — care schedules now follow the new species.');
                                }}
                                className='bg-secondary/60 h-11 w-full rounded-2xl px-3 text-sm'>
                                {SPECIES.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.latin})
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label='Location'>
                            <Input
                                defaultValue={tree.location}
                                onBlur={(e) => updateTree(tree.id, { location: e.target.value.trim() })}
                                className='bg-secondary/60 h-11 rounded-2xl border-none'
                            />
                        </Field>
                        <Field label='In your care since'>
                            <Input
                                type='date'
                                defaultValue={tree.acquiredAt.slice(0, 10)}
                                onBlur={(e) =>
                                    e.target.value &&
                                    updateTree(tree.id, { acquiredAt: new Date(e.target.value).toISOString() })
                                }
                                className='bg-secondary/60 h-11 rounded-2xl border-none'
                            />
                        </Field>
                        <div className='grid grid-cols-2 gap-3'>
                            <Field label='Estimated start year'>
                                <Input
                                    type='number'
                                    defaultValue={tree.birthYear}
                                    placeholder='e.g. 2015'
                                    onBlur={(e) =>
                                        updateTree(tree.id, {
                                            birthYear: e.target.value ? Number(e.target.value) : undefined
                                        })
                                    }
                                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                                />
                            </Field>
                            <Field label='Purchase price (฿)'>
                                <Input
                                    type='number'
                                    defaultValue={tree.purchasePrice}
                                    placeholder='e.g. 45'
                                    onBlur={(e) =>
                                        updateTree(tree.id, {
                                            purchasePrice: e.target.value ? Number(e.target.value) : undefined
                                        })
                                    }
                                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                                />
                            </Field>
                        </div>
                        <Field label='Stage'>
                            <select
                                defaultValue={tree.stage ?? ''}
                                onChange={(e) =>
                                    updateTree(tree.id, {
                                        stage: (e.target.value || undefined) as typeof tree.stage
                                    })
                                }
                                className='bg-secondary/60 h-11 w-full rounded-2xl px-3 text-sm'>
                                <option value=''>—</option>
                                <option value='cutting'>Cutting (rooting)</option>
                                <option value='development'>Development (trunk & roots)</option>
                                <option value='refinement'>Refinement (branches & crown)</option>
                            </select>
                        </Field>
                        <Field label='Bought at'>
                            <Input
                                defaultValue={tree.purchasedAt}
                                placeholder='Nursery, web shop, market…'
                                onBlur={(e) => updateTree(tree.id, { purchasedAt: e.target.value.trim() || undefined })}
                                className='bg-secondary/60 h-11 rounded-2xl border-none'
                            />
                        </Field>
                        <p className='text-muted-foreground text-xs'>
                            In your care since {formatDate(tree.acquiredAt)}
                            {age ? ` · estimated age ±${age} years` : ''}. Changes save when you tap outside a field.
                        </p>
                    </div>

                    <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                        <div>
                            <h2 className='font-semibold'>Care schedule</h2>
                            <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                                Your pot, soil mix and spot dry differently than the species average — set your own
                                rhythm here. Empty fields follow the {species.name} schedule, which shifts with the
                                seasons.
                            </p>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <Field label='Water every (days)'>
                                <Input
                                    type='number'
                                    min={1}
                                    defaultValue={tree.careOverrides?.wateringDays}
                                    placeholder={`Species: ${species.care.wateringIntervalDays[season]}`}
                                    onBlur={(e) =>
                                        updateTree(tree.id, {
                                            careOverrides: {
                                                ...tree.careOverrides,
                                                wateringDays: e.target.value ? Math.max(1, Number(e.target.value)) : undefined
                                            }
                                        })
                                    }
                                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                                />
                            </Field>
                            <Field label='Fertilize every (days)'>
                                <Input
                                    type='number'
                                    min={1}
                                    defaultValue={tree.careOverrides?.fertilizingDays}
                                    placeholder={
                                        species.care.fertilizingIntervalDays[season] === null
                                            ? 'Species: paused'
                                            : `Species: ${species.care.fertilizingIntervalDays[season]}`
                                    }
                                    onBlur={(e) =>
                                        updateTree(tree.id, {
                                            careOverrides: {
                                                ...tree.careOverrides,
                                                fertilizingDays: e.target.value ? Math.max(1, Number(e.target.value)) : undefined
                                            }
                                        })
                                    }
                                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                                />
                            </Field>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <Field label='Repot every (years)'>
                                <Input
                                    type='number'
                                    min={1}
                                    defaultValue={tree.careOverrides?.repotYears}
                                    placeholder={`Species: ${species.care.repotEveryYears}`}
                                    onBlur={(e) =>
                                        updateTree(tree.id, {
                                            careOverrides: {
                                                ...tree.careOverrides,
                                                repotYears: e.target.value ? Math.max(1, Number(e.target.value)) : undefined
                                            }
                                        })
                                    }
                                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                                />
                            </Field>
                            <Field label='Wire check after (days)'>
                                <Input
                                    type='number'
                                    min={1}
                                    defaultValue={tree.careOverrides?.wireCheckDays}
                                    placeholder='Default: 42'
                                    onBlur={(e) =>
                                        updateTree(tree.id, {
                                            careOverrides: {
                                                ...tree.careOverrides,
                                                wireCheckDays: e.target.value ? Math.max(1, Number(e.target.value)) : undefined
                                            }
                                        })
                                    }
                                    className='bg-secondary/60 h-11 rounded-2xl border-none'
                                />
                            </Field>
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            Now watering every{' '}
                            <span className='text-foreground font-semibold'>
                                {tree.careOverrides?.wateringDays ?? species.care.wateringIntervalDays[season]}
                            </span>{' '}
                            days
                            {tree.stage === 'cutting' ? (
                                <> · feeding paused while rooting</>
                            ) : (
                                <>
                                    {' '}
                                    · feeding every{' '}
                                    <span className='text-foreground font-semibold'>
                                        {(tree.careOverrides?.fertilizingDays ??
                                            species.care.fertilizingIntervalDays[season]) ?? '— (paused)'}
                                    </span>{' '}
                                    days
                                </>
                            )}
                            .
                        </p>
                    </div>

                    <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                        <div>
                            <h2 className='font-semibold'>Soil & feeding</h2>
                            <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                                What this tree is actually potted in and fed with — tap a component to add it, or type
                                freely (e.g. “70% pumice 1-3 mm · 30% cocopeat”).
                            </p>
                        </div>
                        <Field label='Soil mix'>
                            <Input
                                key={`soil-${tree.soilMix ?? ''}`}
                                defaultValue={tree.soilMix}
                                placeholder='e.g. 70% pumice 1-3 mm · 30% cocopeat'
                                onBlur={(e) => updateTree(tree.id, { soilMix: e.target.value.trim() || undefined })}
                                className='bg-secondary/60 h-11 rounded-2xl border-none'
                            />
                        </Field>
                        <div className='flex flex-wrap gap-1.5'>
                            {SOIL_COMPONENTS.map((component) => (
                                <button
                                    key={component}
                                    onClick={() =>
                                        updateTree(tree.id, {
                                            soilMix: tree.soilMix ? `${tree.soilMix} · ${component}` : component
                                        })
                                    }
                                    className='bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-[11px] font-medium'>
                                    + {component}
                                </button>
                            ))}
                        </div>
                        <Field label='Fertilizer used'>
                            <Input
                                key={`fert-${tree.fertilizer ?? ''}`}
                                defaultValue={tree.fertilizer}
                                placeholder='e.g. organic pellets · liquid 2-4 weekly · none'
                                onBlur={(e) => updateTree(tree.id, { fertilizer: e.target.value.trim() || undefined })}
                                className='bg-secondary/60 h-11 rounded-2xl border-none'
                            />
                        </Field>
                        <div className='flex flex-wrap gap-1.5'>
                            {FERTILIZERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() =>
                                        updateTree(tree.id, {
                                            fertilizer: tree.fertilizer ? `${tree.fertilizer} · ${f}` : f
                                        })
                                    }
                                    className='bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-[11px] font-medium'>
                                    + {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                        <div>
                            <h2 className='font-semibold'>Care history</h2>
                            <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                                All reminders count from these dates — correct them here if you cared for the tree
                                without ticking a task.
                            </p>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <DateField
                                label='Last watered'
                                value={tree.lastWatered}
                                onChange={(iso) => updateTree(tree.id, { lastWatered: iso })}
                            />
                            <DateField
                                label='Last fertilized'
                                value={tree.lastFertilized}
                                onChange={(iso) => updateTree(tree.id, { lastFertilized: iso })}
                            />
                            <DateField
                                label='Last repotted'
                                value={tree.lastRepotted}
                                onChange={(iso) => updateTree(tree.id, { lastRepotted: iso })}
                            />
                            <DateField
                                label='Last wired'
                                value={tree.lastWired}
                                onChange={(iso) => updateTree(tree.id, { lastWired: iso })}
                            />
                        </div>
                    </div>

                    <div className='bg-card rounded-3xl p-4 shadow-sm'>
                        <h2 className='mb-2 font-semibold'>Notes</h2>
                        <Textarea
                            defaultValue={tree.notes}
                            onBlur={(e) => updateTree(tree.id, { notes: e.target.value })}
                            placeholder={`Notes about ${tree.name}…`}
                            className='bg-secondary/60 min-h-32 rounded-2xl border-none'
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const StatChip = ({
    icon: Icon,
    label,
    value,
    onClick
}: {
    icon: typeof Cable;
    label: string;
    value: string;
    onClick?: () => void;
}) => (
    <button
        onClick={onClick}
        className='bg-card flex shrink-0 snap-start items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-left shadow-sm transition-transform active:scale-95'>
        <span className='bg-accent text-accent-foreground flex size-8 items-center justify-center rounded-xl'>
            <Icon className='size-4' strokeWidth={1.8} />
        </span>
        <div>
            <p className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase'>{label}</p>
            <p className='max-w-32 truncate text-xs font-semibold'>{value}</p>
        </div>
    </button>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className='block'>
        <span className='text-muted-foreground mb-1 block text-xs font-medium'>{label}</span>
        {children}
    </label>
);

const DateField = ({
    label,
    value,
    onChange
}: {
    label: string;
    value?: string;
    onChange: (iso: string | undefined) => void;
}) => (
    <Field label={label}>
        <Input
            type='date'
            defaultValue={value?.slice(0, 10)}
            max={new Date().toISOString().slice(0, 10)}
            onBlur={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            className='bg-secondary/60 h-11 rounded-2xl border-none'
        />
    </Field>
);

const CareLine = ({ icon: Icon, title, text }: { icon: typeof Droplets; title: string; text: string }) => (
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

export default TreePage;
