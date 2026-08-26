export const LoadingScreen = () => (
    <div className='flex min-h-[70dvh] items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
            <span className='flex size-16 animate-pulse items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm'>
                <img src='/images/logo-mark.png' alt='Mr. Bonsai' className='size-13' />
            </span>
            <p className='text-muted-foreground text-sm'>Loading your collection…</p>
        </div>
    </div>
);
