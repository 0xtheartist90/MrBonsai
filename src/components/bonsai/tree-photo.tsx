'use client';

import { useEffect, useState } from 'react';

import { isPhotoRef, loadPhoto } from '@/lib/bonsai/photo-db';
import { cn } from '@/lib/utils';

import { Sprout } from 'lucide-react';

export const TreePhoto = ({ photo, name, className }: { photo?: string; name: string; className?: string }) => {
    const isRef = isPhotoRef(photo);
    const [resolved, setResolved] = useState<string>();
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
        setResolved(undefined);
        if (!isRef || !photo) return;

        let cancelled = false;
        const resolve = async () => {
            try {
                const dataUrl = await loadPhoto(photo);
                if (cancelled) return;
                if (dataUrl) setResolved(dataUrl);
                else setFailed(true);
            } catch {
                if (!cancelled) setFailed(true);
            }
        };
        void resolve();

        return () => {
            cancelled = true;
        };
    }, [photo, isRef]);

    const src = isRef ? resolved : photo;

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={name}
                onError={() => setFailed(true)}
                className={cn('size-full object-cover', className)}
            />
        );
    }

    return (
        <div className={cn('bg-accent text-accent-foreground flex size-full items-center justify-center', className)}>
            {(!photo || failed) && <Sprout className='size-10 opacity-60' strokeWidth={1.5} />}
        </div>
    );
};
