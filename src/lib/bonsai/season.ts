import type { Season } from './types';

export const currentSeason = (date = new Date()): Season => {
    const m = date.getMonth() + 1;
    if (m >= 3 && m <= 5) return 'spring';
    if (m >= 6 && m <= 8) return 'summer';
    if (m >= 9 && m <= 11) return 'autumn';

    return 'winter';
};

export const SEASON_LABEL: Record<Season, string> = {
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter'
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
