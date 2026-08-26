'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { daysBetween } from '@/lib/bonsai/season';
import { useBonsai } from '@/lib/bonsai/store';
import { cn } from '@/lib/utils';

import { BookOpen, ListChecks, Plus, Sprout, Trees } from 'lucide-react';

const items = [
    { href: '/', label: 'My Trees', icon: Trees },
    { href: '/grow', label: 'Grow', icon: Sprout },
    { href: '/tasks', label: 'Tasks', icon: ListChecks },
    { href: '/learn', label: 'Learn', icon: BookOpen }
];

/** My Trees owns the root plus every individual tree route */
const isActive = (href: string, pathname: string): boolean =>
    href === '/' ? pathname === '/' || pathname.startsWith('/trees') : pathname.startsWith(href);

export const BottomNav = () => {
    const pathname = usePathname();
    const { agenda } = useBonsai();
    const dueCount = agenda.filter((t) => daysBetween(new Date(), t.due) <= 0).length;

    const left = items.slice(0, 2);
    const right = items.slice(2);

    const renderItem = ({ href, label, icon: Icon }: (typeof items)[number]) => {
        const active = isActive(href, pathname);

        return (
            <Link
                key={href}
                href={href}
                className={cn(
                    'relative mx-0.5 flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-medium transition-colors',
                    active ? 'bg-accent/80 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}>
                <Icon className='size-5' strokeWidth={active ? 2.4 : 1.8} />
                {label}
                {href === '/tasks' && dueCount > 0 && (
                    <span className='bg-primary text-primary-foreground absolute top-0 right-1/2 translate-x-4 rounded-full px-1.5 text-[10px] leading-4 shadow-sm'>
                        {dueCount}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <nav className='fixed inset-x-0 bottom-0 z-40 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
            <div className='mx-auto flex w-[calc(100%-2rem)] max-w-sm items-center rounded-[2rem] border border-white/60 bg-white/75 px-2 py-1.5 shadow-xl backdrop-blur-xl'>
                {left.map(renderItem)}
                <Link
                    href='/trees/new'
                    aria-label='Add a bonsai'
                    className='from-primary to-primary/85 text-primary-foreground shadow-primary/40 -mt-7 mx-2 flex size-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-b shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_10px_24px_-8px] ring-4 ring-white/70 transition-transform active:scale-95'>
                    <Plus className='size-6' />
                </Link>
                {right.map(renderItem)}
            </div>
        </nav>
    );
};
