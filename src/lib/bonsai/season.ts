import type { Season } from './types';

/**
 * The internal season keys keep their names (species data is keyed on them),
 * but boundaries and labels follow the Thai year:
 *   spring → hot season (Mar–May) · summer → rainy season (Jun–Aug)
 *   autumn → late rains (Sep–Oct) · winter → cool season (Nov–Feb)
 */
export const currentSeason = (date = new Date()): Season => {
    const m = date.getMonth() + 1;
    if (m >= 3 && m <= 5) return 'spring';
    if (m >= 6 && m <= 8) return 'summer';
    if (m >= 9 && m <= 10) return 'autumn';

    return 'winter';
};

export const SEASON_LABEL: Record<Season, string> = {
    spring: 'Hot season',
    summer: 'Rainy season',
    autumn: 'Late rains',
    winter: 'Cool season'
};

export const daysBetween = (a: Date, b: Date): number =>
    Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);

export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, days: number): Date => {
    const r = new Date(d);
    r.setDate(r.getDate() + days);

    return r;
};

export const formatDate = (iso: string | Date): string =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const relativeDue = (due: Date, now = new Date()): string => {
    const diff = daysBetween(now, due);
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';

    return `In ${diff} days`;
};
