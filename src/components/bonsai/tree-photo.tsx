import { cn } from '@/lib/utils';

import { Sprout } from 'lucide-react';

export const TreePhoto = ({ photo, name, className }: { photo?: string; name: string; className?: string }) => {
    if (photo) {
        return <img src={photo} alt={name} className={cn('size-full object-cover', className)} />;
    }

    return (
        <div className={cn('bg-accent text-accent-foreground flex size-full items-center justify-center', className)}>
            <Sprout className='size-10 opacity-60' strokeWidth={1.5} />
        </div>
    );
};
