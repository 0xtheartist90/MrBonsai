'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useBonsai } from '@/lib/bonsai/store';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';

import { ArrowLeft, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const SyncPage = () => {
    const router = useRouter();
    const { syncStatus, syncSignIn, syncSignOut } = useBonsai();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async () => {
        if (!email.trim() || !password) {
            toast.error('Fill in your email and password.');

            return;
        }
        setBusy(true);
        const error = await syncSignIn(email.trim(), password);
        setBusy(false);
        if (error) toast.error(error);
        else toast.success('Signed in — your collection now syncs across devices.');
    };

    return (
        <div className='space-y-5'>
            <header className='flex items-center gap-3 pt-2'>
                <button
                    onClick={() => router.back()}
                    aria-label='Back'
                    className='bg-card flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm'>
                    <ArrowLeft className='size-5' />
                </button>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight'>Sync</h1>
                    <p className='text-muted-foreground text-sm'>One collection on all your devices</p>
                </div>
            </header>

            {syncStatus === 'off' && (
                <div className='bg-card space-y-2 rounded-3xl p-5 shadow-sm'>
                    <div className='flex items-center gap-2 font-semibold'>
                        <CloudOff className='text-muted-foreground size-5' /> Sync is not configured
                    </div>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                        This build is running local-only. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the environment (locally in{' '}
                        <code>.env.local</code>, on Vercel under Project Settings → Environment Variables), redeploy,
                        and this page becomes a sign-in. Full setup steps live in the README.
                    </p>
                </div>
            )}

            {syncStatus === 'signedOut' && (
                <div className='bg-card space-y-3 rounded-3xl p-5 shadow-sm'>
                    <div className='flex items-center gap-2 font-semibold'>
                        <Cloud className='text-primary size-5' /> Sign in to sync
                    </div>
                    <p className='text-muted-foreground text-sm'>
                        Use the account you created in the Supabase dashboard. Sign in once per device.
                    </p>
                    <Input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        autoComplete='email'
                        className='bg-secondary/60 h-12 rounded-2xl border-none'
                    />
                    <Input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        autoComplete='current-password'
                        onKeyDown={(e) => e.key === 'Enter' && submit()}
                        className='bg-secondary/60 h-12 rounded-2xl border-none'
                    />
                    <Button onClick={submit} disabled={busy} className='h-12 w-full rounded-full font-semibold'>
                        {busy ? 'Signing in…' : 'Sign in'}
                    </Button>
                </div>
            )}

            {(syncStatus === 'synced' || syncStatus === 'syncing' || syncStatus === 'error') && (
                <div className='bg-card space-y-3 rounded-3xl p-5 shadow-sm'>
                    <div className='flex items-center gap-2 font-semibold'>
                        {syncStatus === 'syncing' ? (
                            <RefreshCw className='text-primary size-5 animate-spin' />
                        ) : (
                            <Cloud className={syncStatus === 'error' ? 'text-destructive size-5' : 'text-primary size-5'} />
                        )}
                        {syncStatus === 'syncing' && 'Syncing…'}
                        {syncStatus === 'synced' && 'Synced'}
                        {syncStatus === 'error' && 'Last push failed — will retry on the next change'}
                    </div>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                        Every change on this device is saved to the cloud, and other signed-in devices pick it up when
                        they open the app. Photos upload automatically and download on demand.
                    </p>
                    <Button variant='secondary' onClick={() => void syncSignOut()} className='h-11 rounded-full'>
                        Sign out on this device
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SyncPage;
