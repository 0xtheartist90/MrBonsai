export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type LeafType = 'broadleaf' | 'needle' | 'scale' | 'succulent';

export interface Species {
    id: string;
    name: string;
    latin: string;
    placement: 'indoor' | 'outdoor' | 'both';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    leafType: LeafType;
    evergreen: boolean;
    flowers: boolean;
    description: string;
    care: {
        watering: string;
        /** Days between waterings, per season */
        wateringIntervalDays: Record<Season, number>;
        fertilizing: string;
        /** Days between feedings during the growing season; null = pause */
        fertilizingIntervalDays: Record<Season, number | null>;
        repotting: string;
        repotEveryYears: number;
        pruning: string;
        sunlight: string;
        temperature: string;
    };
    seasonalTips: Record<Season, string>;
}

export type ProgressKind = 'note' | 'wiring' | 'pruning' | 'repotting' | 'styling';

export interface ProgressEntry {
    id: string;
    date: string; // ISO
    note: string;
    photo?: string; // data URL
    kind?: ProgressKind;
}

export interface Tree {
    id: string;
    name: string;
    speciesId: string;
    acquiredAt: string; // ISO
    location: string;
    notes: string;
    photo?: string; // data URL (cover)
    progress: ProgressEntry[];
    /** Estimated year the tree started growing — age is computed from this */
    birthYear?: number;
    /** Development stage: cuttings get gentler care guidance */
    stage?: 'cutting' | 'development' | 'refinement';
    /** Free-text soil mix, e.g. "70% pumice 1-3 mm · 30% cocopeat" */
    soilMix?: string;
    /** Free-text fertilizer in use, e.g. "organic pellets" or "none" */
    fertilizer?: string;
    /** Per-tree schedule overrides; unset fields follow the species schedule */
    careOverrides?: {
        wateringDays?: number;
        fertilizingDays?: number;
        repotYears?: number;
        /** Days after wiring before the wire check is due (default 42) */
        wireCheckDays?: number;
    };
    purchasePrice?: number;
    purchasedAt?: string; // shop / seller
    lastWatered?: string;
    lastFertilized?: string;
    lastRepotted?: string;
    lastWired?: string;
    wireCheckedAt?: string;
}

export type TaskKind = 'water' | 'fertilize' | 'repot' | 'photo' | 'wirecheck' | 'custom';

export interface CustomTask {
    id: string;
    treeId?: string;
    title: string;
    due: string; // ISO date
    done: boolean;
}

/** A task computed from care schedules or read from custom tasks */
export interface CareTask {
    key: string;
    kind: TaskKind;
    treeId?: string;
    title: string;
    detail: string;
    due: Date;
    customId?: string;
}
