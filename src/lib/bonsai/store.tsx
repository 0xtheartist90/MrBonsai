'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { flushPhotoUploads, isPhotoRef, removePhoto, savePhoto } from './photo-db';
import { addDays, currentSeason, startOfDay } from './season';
import { collapsePhotoTasks, computeTasks } from './tasks';
import {
    getUserId,
    onAuthChange,
    pullState,
    pushState,
    signIn as syncAuthSignIn,
    signOut as syncAuthSignOut,
    syncConfigured
} from './sync';
import { speciesById } from './species';
import type { CareTask, CustomTask, ProgressEntry, Tree } from './types';

const STORAGE_KEY = 'mr-bonsai-v3';

interface PersistedState {
    trees: Tree[];
    customTasks: CustomTask[];
    /** Data revision — bumping it lets new code append trees to an existing collection */
    rev?: number;
    /** Last local change — the newer side wins when local and cloud state differ */
    updatedAt?: string;
    /** Tombstones: ids of deleted trees, so a merge does not resurrect them */
    deletedTreeIds?: string[];
}

export type SyncStatus = 'off' | 'signedOut' | 'syncing' | 'synced' | 'error';

const DATA_REV = 4;

/** 26 Aug 2026: the user watered the entire collection by hand */
const WATERED_ALL_AT = '2026-08-26T10:00:00.000Z';

export { NPK_TOPUP_DAYS } from './tasks';

const uid = (): string => Math.random().toString(36).slice(2, 10);

/**
 * Brings collections saved by an older build up to date. Photos shipped as JPEG
 * until they were converted to WebP, and the JPEGs no longer exist — a browser
 * that stored the collection before that would show broken images forever.
 */
const migratePhotoPath = (photo?: string): string | undefined =>
    photo?.startsWith('/images/trees/') ? photo.replace(/\.jpg$/i, '.webp') : photo;

/**
 * Uploaded photos used to live inline in localStorage as data URLs, which blew
 * through its ~5 MB quota after a few uploads and silently lost photos. New
 * uploads go to IndexedDB; this moves any inline photo a previous build stored.
 */
const internPhoto = (photo?: string): string | undefined =>
    photo?.startsWith('data:') ? savePhoto(uid(), photo) : photo;

const migrateTree = (tree: Tree): Tree => ({
    ...tree,
    photo: internPhoto(migratePhotoPath(tree.photo)),
    progress: tree.progress.map((entry) => ({
        ...entry,
        photo: internPhoto(migratePhotoPath(entry.photo)),
        // entries used to carry a single kind; the app now works with a list
        kinds: entry.kinds ?? (entry.kind && entry.kind !== 'note' ? [entry.kind] : [])
    }))
});

/** Stamps a tree as just-changed so per-tree sync merging knows which copy is newest */
const touch = (tree: Tree): Tree => ({ ...tree, modifiedAt: new Date().toISOString() });

/**
 * Per-tree merge: for every tree id the copy with the newer modifiedAt wins, trees
 * that exist on only one side survive, tombstoned ids stay gone. This is what stops
 * one device's unrelated edit from wiping another device's new progress entry —
 * whole-state last-write-wins did exactly that.
 */
const mergeTrees = (local: Tree[], remote: Tree[], deleted: Set<string>): Tree[] => {
    const byId = new Map<string, Tree>();
    const remoteIds = new Set(remote.map((t) => t.id));
    for (const tree of remote) byId.set(tree.id, tree);
    for (const tree of local) {
        const other = byId.get(tree.id);
        // ties go to the cloud copy: a stale device must never displace it
        if (!other || (tree.modifiedAt ?? '') > (other.modifiedAt ?? '')) byId.set(tree.id, tree);
    }
    // devices that seeded independently can hold the same tree under different ids
    const byName = new Map<string, Tree>();
    for (const tree of byId.values()) {
        if (deleted.has(tree.id)) continue;
        const key = `${tree.name}|${tree.speciesId}`;
        const twin = byName.get(key);
        if (!twin) {
            byName.set(key, tree);
            continue;
        }
        const treeStamp = tree.modifiedAt ?? '';
        const twinStamp = twin.modifiedAt ?? '';
        // strictly newer wins; on a tie prefer whichever copy the cloud knows
        if (treeStamp > twinStamp || (treeStamp === twinStamp && remoteIds.has(tree.id) && !remoteIds.has(twin.id))) {
            byName.set(key, tree);
        }
    }

    return [...byName.values()];
};

const mergeCustomTasks = (local: CustomTask[], remote: CustomTask[]): CustomTask[] => {
    const byId = new Map<string, CustomTask>();
    for (const task of remote) byId.set(task.id, task);
    for (const task of local) {
        const other = byId.get(task.id);
        // done wins so a completed task doesn't reopen after a merge
        byId.set(task.id, other && other.done ? other : task);
    }

    return [...byId.values()];
};

/** Every idb photo reference a tree owns — cover and progress timeline */
const photoRefs = (tree: Tree): string[] =>
    [tree.photo, ...tree.progress.map((p) => p.photo)].filter(isPhotoRef);

/**
 * A cover photo that is about to be replaced and lives nowhere else would vanish —
 * archive it as a timeline entry so the visual history keeps every photo.
 */
const archiveCoverEntry = (tree: Tree): ProgressEntry | null => {
    if (!tree.photo || tree.progress.some((p) => p.photo === tree.photo)) return null;

    // seed paths date from acquisition; an uploaded cover's origin is unknown, so date it now
    const fromSeed = tree.photo.startsWith('/images/trees/');

    return {
        id: uid(),
        date: fromSeed ? tree.acquiredAt : new Date().toISOString(),
        note: 'Earlier cover photo — kept automatically when it was replaced.',
        kinds: [],
        photo: tree.photo
    };
};

/** Kamthieng Market purchases of 23 & 26 Aug 2026 plus the existing orange plant */
const newCollectionAug2026 = (): Tree[] => {
    const bought26 = '2026-08-26T09:00:00.000Z';
    const bought23 = '2026-08-23T09:00:00.000Z';
    const worked24 = '2026-08-24T09:00:00.000Z';
    const market = 'Kamthieng Market';

    const tree = (t: Omit<Tree, 'id' | 'progress' | 'notes'> & { notes?: string; progress?: ProgressEntry[] }): Tree => ({
        id: uid(),
        progress: [],
        notes: '',
        lastWatered: '2026-08-25T09:00:00.000Z',
        lastFertilized: undefined,
        lastRepotted: t.acquiredAt,
        stage: 'development',
        ...t
    });

    const entry = (kind: ProgressEntry['kind'], note: string): ProgressEntry => ({
        id: uid(),
        date: worked24,
        kind,
        note
    });

    return [
        // — 26 Aug 2026 —
        tree({ name: 'Japanese Blue Bell 1', speciesId: 'blue-bell', acquiredAt: bought26, location: 'Outside', purchasePrice: 80, purchasedAt: market }),
        tree({ name: 'Japanese Blue Bell 2', speciesId: 'blue-bell', acquiredAt: bought26, location: 'Outside', purchasePrice: 80, purchasedAt: market }),
        tree({ name: 'Chinese Fringe Tree', speciesId: 'chinese-fringe', acquiredAt: bought26, location: 'Outside', purchasePrice: 250, purchasedAt: market }),
        tree({ name: 'Dragon Pine', speciesId: 'dragon-juniper', acquiredAt: bought26, location: 'Outside — full sun', purchasePrice: 150, purchasedAt: market }),
        tree({ name: 'Orange Jasmine', speciesId: 'orange-jasmine', acquiredAt: bought26, location: 'Outside', purchasePrice: 150, purchasedAt: market }),
        tree({ name: 'Creeping Juniper 4', speciesId: 'creeping-juniper', acquiredAt: bought26, location: 'Outside — full sun, max airflow', purchasePrice: 40, purchasedAt: market }),
        tree({ name: 'Creeping Juniper 5', speciesId: 'creeping-juniper', acquiredAt: bought26, location: 'Outside — full sun, max airflow', purchasePrice: 40, purchasedAt: market }),
        tree({ name: 'Creeping Juniper 6', speciesId: 'creeping-juniper', acquiredAt: bought26, location: 'Outside — full sun, max airflow', purchasePrice: 40, purchasedAt: market }),
        // — 23 Aug 2026 —
        tree({
            name: 'Red Japanese Maple',
            speciesId: 'japanese-maple',
            acquiredAt: bought23,
            location: 'Outside — morning sun, afternoon shade',
            purchasePrice: 50,
            purchasedAt: market,
            notes: 'Red-leaved Japanese Maple. In this heat: morning sun only and never let the small pot dry out.'
        }),
        tree({ name: 'Ficus Triangularis', speciesId: 'triangle-fig', acquiredAt: bought23, location: 'Outside', purchasePrice: 35, purchasedAt: market }),
        tree({
            name: 'Dok Khem',
            speciesId: 'ixora',
            acquiredAt: bought23,
            location: 'Outside — full sun',
            purchasePrice: 35,
            purchasedAt: market,
            lastRepotted: worked24,
            progress: [
                entry('pruning', 'First pruning after purchase.'),
                entry('repotting', 'Repotted into fresh mix the day after purchase.')
            ]
        }),
        tree({
            name: 'Creeping Juniper 2',
            speciesId: 'creeping-juniper',
            acquiredAt: bought23,
            location: 'Outside — full sun, max airflow',
            purchasePrice: 40,
            purchasedAt: market,
            lastRepotted: worked24,
            lastWired: worked24,
            progress: [
                entry('wiring', 'Wired the day after purchase.'),
                entry('repotting', 'Repotted into a free-draining mix.')
            ]
        }),
        tree({
            name: 'Creeping Juniper 3',
            speciesId: 'creeping-juniper',
            acquiredAt: bought23,
            location: 'Outside — full sun, max airflow',
            purchasePrice: 40,
            purchasedAt: market,
            lastRepotted: worked24,
            lastWired: worked24,
            progress: [
                entry('wiring', 'Wired the day after purchase.'),
                entry('repotting', 'Repotted into a free-draining mix.')
            ]
        }),
        // — already owned —
        tree({
            name: 'Sweet Orange',
            speciesId: 'sweet-orange',
            acquiredAt: bought23,
            location: 'Outside — full sun',
            lastRepotted: worked24,
            progress: [
                entry('repotting', 'Repotted into fresh free-draining mix.'),
                entry('pruning', 'Pruned back after repotting.')
            ],
            notes: 'Owned before the Kamthieng purchases; repotted and pruned on 24 Aug 2026.'
        })
    ];
};

const seedTrees = (): Tree[] => {
    const now = new Date();
    const year = now.getFullYear();
    const iso = (daysAgo: number) => addDays(now, -daysAgo).toISOString();

    const tree = (t: Omit<Tree, 'id' | 'progress' | 'notes'> & { notes?: string }): Tree => ({
        id: uid(),
        progress: [],
        notes: '',
        lastWatered: iso(1),
        lastFertilized: iso(10),
        lastRepotted: t.acquiredAt,
        ...t
    });

    return [
        tree({
            name: 'Golden Spoon Ficus 1 yr',
            speciesId: 'ficus-annulata',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/gs-ficus-1yr.webp',
            birthYear: year - 1,
            purchasePrice: 39,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Priority: roots, trunk thickening, trunk movement, future branch positions. Avoid too many short pruning rounds while thickening the trunk.'
        }),
        tree({
            name: 'Golden Spoon Ficus 2 yr',
            speciesId: 'ficus-annulata',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/gs-ficus-2yr.webp',
            birthYear: year - 2,
            purchasePrice: 135,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Start choosing a front, main leader and primary branches; remove competing leaders. If the trunk is still thin: grow first, refine later.'
        }),
        tree({
            name: 'Fukien Tea',
            speciesId: 'carmona',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/fukien-tea.webp',
            birthYear: year - 2,
            purchasePrice: 120,
            purchasedAt: 'Family Garden (Shopee)',
            stage: 'development',
            notes: 'Fix trunk structure, choose primary branches, run sacrifice branches for thickness. Not yet into super-fine ramification. Leaf drop ≠ automatically more water: check the soil first.'
        }),
        tree({
            name: 'Fukien Tea small',
            speciesId: 'carmona',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/fukien-tea-small.webp',
            birthYear: year - 1,
            purchasePrice: 120,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Growth first: strong roots, fast healthy growth, trunk thickening. Do not clip every new shoot, no heavy defoliation, no tiny show pot yet.'
        }),
        tree({
            name: 'Creeping Juniper',
            speciesId: 'creeping-juniper',
            acquiredAt: iso(200),
            location: 'Outside — full sun, max airflow',
            photo: '/images/trees/creeping-juniper.webp',
            birthYear: year - 1,
            purchasePrice: 120,
            purchasedAt: 'Treehouse Garden (Shopee)',
            stage: 'development',
            notes: 'Temperate species in a tropical climate — the collection\'s watchlist plant. Always outside, extreme drainage, never constantly wet. Health and vigor before any deadwood work.'
        }),
        tree({
            name: 'Wood Apple (Ma-sang)',
            speciesId: 'wood-apple',
            acquiredAt: iso(200),
            location: 'Outside',
            photo: '/images/trees/wood-apple.webp',
            birthYear: year - 2,
            purchasePrice: 160,
            purchasedAt: 'Family Garden (Shopee)',
            stage: 'development',
            notes: 'Feroniella lucida (มะสัง). Priority: root system, nebari, trunk thickness, taper, primary branches. Don\'t keep it compact too early — power trunk first.'
        }),
        tree({
            name: 'Dwarf Jade',
            speciesId: 'jade',
            acquiredAt: iso(200),
            location: 'Outside — sheltered from long rain',
            photo: '/images/trees/dwarf-jade.webp',
            birthYear: year - 3,
            purchasePrice: 650,
            purchasedAt: 'Facebook',
            stage: 'refinement',
            notes: 'Driest plant of the collection: almost fully dry before watering — overwatering is far more dangerous than slightly too dry. If trunk is thick enough: choose front, finalize primaries, build taper.'
        }),
        tree({
            name: 'Vietnamese Blue Bell',
            speciesId: 'blue-bell',
            acquiredAt: iso(200),
            location: 'Outside — full sun',
            photo: '/images/trees/blue-bell.webp',
            birthYear: year - 3,
            purchasePrice: 500,
            purchasedAt: 'Plant market',
            stage: 'refinement',
            notes: 'Linh Sam. If trunk is thick enough: finalize primary structure, refine branching, build the flowering crown. Otherwise let some branches run longer.'
        }),
        tree({
            name: 'Tamarind cuttings',
            speciesId: 'tamarind',
            acquiredAt: iso(10),
            location: 'Propagation corner — bright, no midday sun',
            photo: '/images/trees/cuttings-tamarind.webp',
            birthYear: year,
            purchasedAt: 'Own propagation',
            stage: 'cutting',
            notes: 'Rooting phase: evenly lightly moist, high humidity WITH airflow, warm. No fertilizer until sustained new growth. Don\'t pull them out to check — look for roots at the drainage holes.'
        }),
        tree({
            name: 'Dwarf Jade cuttings',
            speciesId: 'jade',
            acquiredAt: iso(10),
            location: 'Propagation corner — bright, airy',
            birthYear: year,
            purchasedAt: 'Own propagation',
            stage: 'cutting',
            notes: 'Treat much drier than the other cuttings: let cut callus, very airy mix, dry to barely moist — NO wet humidity dome. Water more only after callus and first roots.'
        }),
        tree({
            name: 'Blue Bell cuttings',
            speciesId: 'blue-bell',
            acquiredAt: iso(10),
            location: 'Propagation corner — bright, humid',
            photo: '/images/trees/cuttings-blue-bell.webp',
            birthYear: year,
            purchasedAt: 'Own propagation',
            stage: 'cutting',
            notes: 'Rooting phase: constantly lightly moist, never soggy, high humidity with daily fresh air against mold. Leave the first flush of growth alone — roots and reserves before any pruning.'
        }),
        ...newCollectionAug2026()
    ];
};

interface BonsaiContextValue {
    ready: boolean;
    trees: Tree[];
    customTasks: CustomTask[];
    addTree: (tree: Omit<Tree, 'id' | 'progress'>) => Tree;
    updateTree: (id: string, patch: Partial<Tree>) => void;
    /** Set a new cover photo, archiving the old one into the timeline */
    replaceCover: (id: string, dataUrl: string) => void;
    deleteTree: (id: string) => void;
    addProgress: (treeId: string, entry: Omit<ProgressEntry, 'id'>) => void;
    updateProgress: (treeId: string, entryId: string, patch: Partial<Omit<ProgressEntry, 'id'>>) => void;
    deleteProgress: (treeId: string, entryId: string) => void;
    addCustomTask: (task: Omit<CustomTask, 'id' | 'done'>) => void;
    deleteCustomTask: (id: string) => void;
    /** Undo for a completed custom task */
    reopenCustomTask: (id: string) => void;
    /** "Checked, still moist": pushes the water check to tomorrow without logging a watering */
    snoozeWaterCheck: (treeId: string) => void;
    /** The watering button: stamps lastWatered now and appends to the care log */
    logWatering: (treeId: string) => void;
    /** Undo for a deleted progress entry */
    insertProgress: (treeId: string, entry: ProgressEntry) => void;
    completeTask: (task: CareTask) => void;
    /** Every task, one per tree — used on a tree's own page */
    tasks: CareTask[];
    /** Same list for collection-wide views, with the seasonal photo reminders collapsed into one */
    agenda: CareTask[];
    syncStatus: SyncStatus;
    syncSignIn: (email: string, password: string) => Promise<string | null>;
    syncSignOut: () => Promise<void>;
    /** Stamp this device's collection as newest and push it to the cloud */
    syncPushNow: () => Promise<boolean>;
    /** Fetch the cloud state and adopt it when newer */
    syncPullNow: () => Promise<void>;
}

/** Runs the migration chain over a persisted state, wherever it came from */
const hydrate = (parsed: PersistedState): { trees: Tree[]; customTasks: CustomTask[] } => {
    let trees = (parsed.trees ?? []).map(migrateTree);
    const rev = parsed.rev ?? 1;
    // rev 2: the Aug 2026 purchases — append what's missing
    if (rev < 2) {
        const additions = newCollectionAug2026().filter((added) => !trees.some((t) => t.name === added.name));
        trees = [...trees, ...additions];
    }
    // rev 3: the whole collection was watered on 26 Aug 2026
    if (rev < 3) {
        trees = trees.map((t) =>
            !t.lastWatered || t.lastWatered < WATERED_ALL_AT ? { ...t, lastWatered: WATERED_ALL_AT } : t
        );
    }
    // rev 4: replacing a cover photo used to overwrite it silently — restore the
    // original seed photo into the timeline of any tree whose cover moved on
    if (rev < 4) {
        const seedPhotoByName = new Map(seedTrees().map((t) => [t.name, t.photo]));
        trees = trees.map((t) => {
            const original = seedPhotoByName.get(t.name);
            if (!original || t.photo === original || t.progress.some((p) => p.photo === original)) return t;

            return {
                ...t,
                progress: [
                    ...t.progress,
                    {
                        id: uid(),
                        date: t.acquiredAt,
                        note: 'Original photo — restored to the timeline when the cover was replaced.',
                        kinds: [],
                        photo: original
                    }
                ]
            };
        });
    }

    return { trees, customTasks: parsed.customTasks ?? [] };
};

const BonsaiContext = createContext<BonsaiContextValue | null>(null);

export const BonsaiProvider = ({ children }: { children: ReactNode }) => {
    const [ready, setReady] = useState(false);
    const [trees, setTrees] = useState<Tree[]>([]);
    const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncConfigured ? 'signedOut' : 'off');
    const localUpdatedAtRef = useRef<string | undefined>(undefined);
    const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Loading and adopting cloud state also set React state; those must NOT count as
    // local edits — stamping them as "newest" would push stale data over the cloud.
    const suppressNextPersistRef = useRef(true);
    const lastPullAtRef = useRef(0);
    const [deletedTreeIds, setDeletedTreeIds] = useState<string[]>([]);
    // live mirrors for the merge inside pullFromCloud, which must not re-create on every edit
    const treesRef = useRef<Tree[]>([]);
    const customTasksRef = useRef<CustomTask[]>([]);
    const deletedRef = useRef<string[]>([]);

    /** Adopt cloud state when it is newer than what this device has */
    const pullFromCloud = useCallback(async () => {
        if (!(await getUserId())) {
            setSyncStatus(syncConfigured ? 'signedOut' : 'off');

            return;
        }
        lastPullAtRef.current = Date.now();
        setSyncStatus('syncing');
        const remote = await pullState();
        if (remote) {
            const remoteParsed = remote.data as PersistedState;
            const remoteState = hydrate(remoteParsed);
            const deleted = new Set([...deletedRef.current, ...(remoteParsed.deletedTreeIds ?? [])]);
            const mergedTrees = mergeTrees(treesRef.current, remoteState.trees, deleted);
            const mergedTasks = mergeCustomTasks(customTasksRef.current, remoteState.customTasks);
            // when the merge holds anything the cloud is missing, the save effect must push it
            const differsFromRemote =
                JSON.stringify(mergedTrees) !== JSON.stringify(remoteState.trees) ||
                JSON.stringify(mergedTasks) !== JSON.stringify(remoteState.customTasks);
            if (!localUpdatedAtRef.current || remote.updatedAt > localUpdatedAtRef.current) {
                localUpdatedAtRef.current = remote.updatedAt;
            }
            suppressNextPersistRef.current = !differsFromRemote;
            setTrees(mergedTrees);
            setCustomTasks(mergedTasks);
            setDeletedTreeIds([...deleted]);
        }
        setSyncStatus('synced');
        void flushPhotoUploads();
    }, []);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as PersistedState;
                const state = hydrate(parsed);
                localUpdatedAtRef.current = parsed.updatedAt;
                treesRef.current = state.trees;
                customTasksRef.current = state.customTasks;
                deletedRef.current = parsed.deletedTreeIds ?? [];
                setTrees(state.trees);
                setCustomTasks(state.customTasks);
                setDeletedTreeIds(deletedRef.current);
            } else if (!syncConfigured) {
                const seeded = seedTrees();
                treesRef.current = seeded;
                setTrees(seeded);
            }
            // sync-configured fresh browser: start empty and let sign-in pull the real collection
        } catch {
            if (!syncConfigured) setTrees(seedTrees());
        }
        setReady(true);
        void pullFromCloud();

        return onAuthChange(() => void pullFromCloud());
    }, [pullFromCloud]);

    useEffect(() => {
        if (!ready) return;
        treesRef.current = trees;
        customTasksRef.current = customTasks;
        deletedRef.current = deletedTreeIds;
        // hydration (initial load or a merge that matched the cloud) is not a local edit:
        // persist it under its existing timestamp and never push it
        if (suppressNextPersistRef.current) {
            suppressNextPersistRef.current = false;
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        trees,
                        customTasks,
                        deletedTreeIds,
                        rev: DATA_REV,
                        updatedAt: localUpdatedAtRef.current ?? new Date().toISOString()
                    } satisfies PersistedState)
                );
            } catch {
                // storage full — keep running in memory
            }

            return;
        }
        const updatedAt = new Date().toISOString();
        localUpdatedAtRef.current = updatedAt;
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ trees, customTasks, deletedTreeIds, rev: DATA_REV, updatedAt } satisfies PersistedState)
            );
        } catch {
            // storage full — keep running in memory
        }
        // debounce the cloud push so rapid edits become one write
        if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
        pushTimerRef.current = setTimeout(() => {
            void (async () => {
                if (!(await getUserId())) return;
                const ok = await pushState(
                    { trees, customTasks, deletedTreeIds, rev: DATA_REV, updatedAt },
                    updatedAt
                );
                setSyncStatus(ok ? 'synced' : 'error');
            })();
        }, 1500);
    }, [ready, trees, customTasks, deletedTreeIds]);

    // returning to the app (tab focus, phone unlock) picks up changes from other devices
    useEffect(() => {
        const onFocus = () => {
            if (document.visibilityState !== 'visible') return;
            if (Date.now() - lastPullAtRef.current < 10_000) return;
            void pullFromCloud();
        };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onFocus);
        };
    }, [pullFromCloud]);

    const syncSignIn: BonsaiContextValue['syncSignIn'] = useCallback(
        async (email, password) => {
            const error = await syncAuthSignIn(email, password);
            if (!error) void pullFromCloud();

            return error;
        },
        [pullFromCloud]
    );

    const syncSignOut: BonsaiContextValue['syncSignOut'] = useCallback(async () => {
        await syncAuthSignOut();
        setSyncStatus(syncConfigured ? 'signedOut' : 'off');
    }, []);

    const syncPushNow: BonsaiContextValue['syncPushNow'] = useCallback(async () => {
        if (!(await getUserId())) return false;
        setSyncStatus('syncing');
        const updatedAt = new Date().toISOString();
        localUpdatedAtRef.current = updatedAt;
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ trees, customTasks, deletedTreeIds, rev: DATA_REV, updatedAt } satisfies PersistedState)
            );
        } catch {
            // storage full — push proceeds regardless
        }
        const ok = await pushState({ trees, customTasks, deletedTreeIds, rev: DATA_REV, updatedAt }, updatedAt);
        setSyncStatus(ok ? 'synced' : 'error');
        await flushPhotoUploads();

        return ok;
    }, [trees, customTasks]);

    const addTree: BonsaiContextValue['addTree'] = useCallback((tree) => {
        const created: Tree = touch({ ...tree, id: uid(), progress: [], photo: internPhoto(tree.photo) });
        setTrees((t) => [created, ...t]);

        return created;
    }, []);

    const updateTree: BonsaiContextValue['updateTree'] = useCallback((id, patch) => {
        const safePatch = 'photo' in patch ? { ...patch, photo: internPhoto(patch.photo) } : patch;
        setTrees((t) => t.map((tree) => (tree.id === id ? touch({ ...tree, ...safePatch }) : tree)));
    }, []);

    const replaceCover: BonsaiContextValue['replaceCover'] = useCallback((id, dataUrl) => {
        const photo = internPhoto(dataUrl);
        setTrees((t) =>
            t.map((tree) => {
                if (tree.id !== id) return tree;
                const archived = archiveCoverEntry(tree);

                return touch({ ...tree, photo, progress: archived ? [...tree.progress, archived] : tree.progress });
            })
        );
    }, []);

    const deleteTree: BonsaiContextValue['deleteTree'] = useCallback((id) => {
        setTrees((t) => {
            t.filter((tree) => tree.id === id).flatMap(photoRefs).forEach(removePhoto);

            return t.filter((tree) => tree.id !== id);
        });
        setCustomTasks((c) => c.filter((task) => task.treeId !== id));
        // tombstone so a sync merge cannot resurrect it from another device
        setDeletedTreeIds((d) => (d.includes(id) ? d : [...d, id]));
    }, []);

    const addProgress: BonsaiContextValue['addProgress'] = useCallback((treeId, entry) => {
        const photo = internPhoto(entry.photo);
        setTrees((t) =>
            t.map((tree) => {
                if (tree.id !== treeId) return tree;
                // a photo entry becomes the new cover — keep the old cover in the timeline
                const archived = photo ? archiveCoverEntry(tree) : null;

                return touch({
                          ...tree,
                          photo: photo ?? tree.photo,
                          // typed entries also update the care timestamps they represent
                          lastWired: entry.kinds?.includes('wiring') ? entry.date : tree.lastWired,
                          lastRepotted: entry.kinds?.includes('repotting') ? entry.date : tree.lastRepotted,
                          lastRepotSeverity: entry.kinds?.includes('repotting')
                              ? (entry.repotSeverity ?? 'moderate')
                              : tree.lastRepotSeverity,
                          progress: [
                              { ...entry, photo, id: uid() },
                              ...tree.progress,
                              ...(archived ? [archived] : [])
                          ]
                      });
            })
        );
    }, []);

    const updateProgress: BonsaiContextValue['updateProgress'] = useCallback((treeId, entryId, patch) => {
        const safePatch = 'photo' in patch ? { ...patch, photo: internPhoto(patch.photo) } : patch;
        setTrees((t) =>
            t.map((tree) =>
                tree.id === treeId
                    ? touch({
                          ...tree,
                          progress: tree.progress.map((entry) =>
                              entry.id === entryId ? { ...entry, ...safePatch } : entry
                          )
                      })
                    : tree
            )
        );
    }, []);

    const deleteProgress: BonsaiContextValue['deleteProgress'] = useCallback((treeId, entryId) => {
        // the stored photo is deliberately kept: it makes Undo possible, and orphans are cheap
        setTrees((t) =>
            t.map((tree) =>
                tree.id === treeId ? touch({ ...tree, progress: tree.progress.filter((p) => p.id !== entryId) }) : tree
            )
        );
    }, []);

    const addCustomTask: BonsaiContextValue['addCustomTask'] = useCallback((task) => {
        setCustomTasks((c) => [...c, { ...task, id: uid(), done: false }]);
    }, []);

    const deleteCustomTask: BonsaiContextValue['deleteCustomTask'] = useCallback((id) => {
        setCustomTasks((c) => c.filter((task) => task.id !== id));
    }, []);

    const reopenCustomTask: BonsaiContextValue['reopenCustomTask'] = useCallback((id) => {
        setCustomTasks((c) => c.map((task) => (task.id === id ? { ...task, done: false } : task)));
    }, []);

    const snoozeWaterCheck: BonsaiContextValue['snoozeWaterCheck'] = useCallback((treeId) => {
        setTrees((t) =>
            t.map((tree) => {
                if (tree.id !== treeId) return tree;
                const species = speciesById(tree.speciesId);
                if (!species) return tree;
                const interval = tree.careOverrides?.wateringDays ?? species.care.wateringIntervalDays[currentSeason()];
                // due = lastWatered + interval, so aim lastWatered such that due lands tomorrow
                const lastWatered = addDays(startOfDay(new Date()), 1 - interval).toISOString();

                return touch({
                    ...tree,
                    lastWatered,
                    careLog: [{ date: new Date().toISOString(), kind: 'moist' as const }, ...(tree.careLog ?? [])].slice(0, 200)
                });
            })
        );
    }, []);

    const logWatering: BonsaiContextValue['logWatering'] = useCallback((treeId) => {
        const nowIso = new Date().toISOString();
        setTrees((t) =>
            t.map((tree) =>
                tree.id === treeId
                    ? touch({
                          ...tree,
                          lastWatered: nowIso,
                          careLog: [{ date: nowIso, kind: 'water' as const }, ...(tree.careLog ?? [])].slice(0, 200)
                      })
                    : tree
            )
        );
    }, []);

    const insertProgress: BonsaiContextValue['insertProgress'] = useCallback((treeId, entry) => {
        setTrees((t) => t.map((tree) => (tree.id === treeId ? touch({ ...tree, progress: [entry, ...tree.progress] }) : tree)));
    }, []);

    const tasks = useMemo(() => computeTasks(trees, customTasks), [trees, customTasks]);
    const agenda = useMemo(() => collapsePhotoTasks(tasks), [tasks]);

    const completeTask: BonsaiContextValue['completeTask'] = useCallback((task) => {
        const nowIso = new Date().toISOString();
        if (task.customId) {
            setCustomTasks((c) => c.map((t) => (t.id === task.customId ? { ...t, done: true } : t)));

            return;
        }
        if (!task.treeId) return;
        const patch: Partial<Tree> = {};
        let logKind: NonNullable<Tree['careLog']>[number]['kind'] | null = null;
        if (task.kind === 'water') (patch.lastWatered = nowIso), (logKind = 'water');
        if (task.kind === 'fertilize') (patch.lastFertilized = nowIso), (logKind = 'fertilize');
        if (task.kind === 'micro') (patch.lastMicronutrients = nowIso), (logKind = 'micro');
        if (task.kind === 'repot') (patch.lastRepotted = nowIso), (logKind = 'repot');
        if (task.kind === 'wirecheck') (patch.wireCheckedAt = nowIso), (logKind = 'wirecheck');
        if (task.kind === 'rooting') (patch.stage = 'development'), (logKind = 'rooted');
        setTrees((t) =>
            t.map((tree) =>
                tree.id === task.treeId
                    ? touch({
                          ...tree,
                          ...patch,
                          careLog: logKind
                              ? [{ date: nowIso, kind: logKind }, ...(tree.careLog ?? [])].slice(0, 200)
                              : tree.careLog
                      })
                    : tree
            )
        );
    }, []);

    const value: BonsaiContextValue = {
        ready,
        trees,
        customTasks,
        addTree,
        updateTree,
        replaceCover,
        deleteTree,
        addProgress,
        updateProgress,
        deleteProgress,
        addCustomTask,
        deleteCustomTask,
        reopenCustomTask,
        snoozeWaterCheck,
        logWatering,
        insertProgress,
        completeTask,
        tasks,
        agenda,
        syncStatus,
        syncSignIn,
        syncSignOut,
        syncPushNow,
        syncPullNow: pullFromCloud
    };

    return <BonsaiContext.Provider value={value}>{children}</BonsaiContext.Provider>;
};

export const useBonsai = (): BonsaiContextValue => {
    const ctx = useContext(BonsaiContext);
    if (!ctx) throw new Error('useBonsai must be used inside BonsaiProvider');

    return ctx;
};

