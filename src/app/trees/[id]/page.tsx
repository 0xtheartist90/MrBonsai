'use client';

import { use, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { PhotoInput } from '@/components/bonsai/photo-input';
import { TaskRow } from '@/components/bonsai/task-row';
import { TreePhoto } from '@/components/bonsai/tree-photo';
import { SEASON_LABEL, currentSeason, formatDate } from '@/lib/bonsai/season';
import { speciesById } from '@/lib/bonsai/species';
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
    Leaf,
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

const KIND_OPTIONS: { value: ProgressKind; label: string; icon: typeof Camera }[] = [
    { value: 'note', label: 'Note', icon: Camera },
    { value: 'pruning', label: 'Pruning', icon: Scissors },
    { value: 'wiring', label: 'Wiring', icon: Cable },
    { value: 'repotting', label: 'Repotting', icon: Shovel },
    { value: 'styling', label: 'Styling', icon: Sparkles }
];

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
    const { ready, trees, tasks, addProgress, deleteTree, updateTree } = useBonsai();

    const [progressNote, setProgressNote] = useState('');
    const [progressPhoto, setProgressPhoto] = useState<string>();
    const [progressKind, setProgressKind] = useState<ProgressKind>('note');
    const [addingProgress, setAddingProgress] = useState(searchParams.get('progress') === '1');

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
            date: new Date().toISOString(),
            note: progressNote.trim(),
            photo: progressPhoto,
            kind: progressKind
        });
        setProgressNote('');
        setProgressPhoto(undefined);
        setProgressKind('note');
        setAddingProgress(false);
        toast.success(
            progressKind === 'wiring'
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
                />
                <StatChip
                    icon={Banknote}
                    label='Paid'
                    value={tree.purchasePrice !== undefined ? `฿${tree.purchasePrice}` : '—'}
                />
                <StatChip icon={Cable} label='Wired' value={tree.lastWired ? formatDate(tree.lastWired) : 'Not yet'} />
                <StatChip icon={Store} label='From' value={tree.purchasedAt || '—'} />
            </div>

            <Tabs defaultValue={addingProgress ? 'progress' : 'care'}>
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
                            <div className='flex flex-wrap gap-2'>
                                {KIND_OPTIONS.map((o) => (
                                    <button
                                        key={o.value}
                                        onClick={() => setProgressKind(o.value)}
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                                            progressKind === o.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground'
                                        )}>
                                        <o.icon className='size-3.5' /> {o.label}
                                    </button>
                                ))}
                            </div>
                            <PhotoInput value={progressPhoto} onChange={setProgressPhoto} label='Add a progress photo' />
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
                                            {entry.kind && entry.kind !== 'note' && (
                                                <span className='bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold'>
                                                    {KIND_LABEL[entry.kind]}
                                                </span>
                                            )}
                                        </div>
                                        {entry.note && <p className='mt-1 text-sm'>{entry.note}</p>}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </TabsContent>

                <TabsContent value='details' className='mt-4 space-y-4'>
                    <div className='bg-card space-y-3 rounded-3xl p-4 shadow-sm'>
                        <h2 className='font-semibold'>Tree details</h2>
                        <Field label='Name'>
                            <Input
                                defaultValue={tree.name}
                                onBlur={(e) => e.target.value.trim() && updateTree(tree.id, { name: e.target.value.trim() })}
                                className='bg-secondary/60 h-11 rounded-2xl border-none'
                            />
                        </Field>
                        <Field label='Location'>
                            <Input
                                defaultValue={tree.location}
                                onBlur={(e) => updateTree(tree.id, { location: e.target.value.trim() })}
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

const StatChip = ({ icon: Icon, label, value }: { icon: typeof Cable; label: string; value: string }) => (
    <div className='bg-card flex shrink-0 snap-start items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-sm'>
        <span className='bg-accent text-accent-foreground flex size-8 items-center justify-center rounded-xl'>
            <Icon className='size-4' strokeWidth={1.8} />
        </span>
        <div>
            <p className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase'>{label}</p>
            <p className='max-w-32 truncate text-xs font-semibold'>{value}</p>
        </div>
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className='block'>
        <span className='text-muted-foreground mb-1 block text-xs font-medium'>{label}</span>
        {children}
    </label>
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
