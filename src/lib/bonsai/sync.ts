'use client';

/**
 * Supabase sync: the collection state lives in one row per user, photos in a
 * storage bucket. Without the two NEXT_PUBLIC_SUPABASE_* env vars the app runs
 * exactly as before — local-only. Last write wins across devices.
 */
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const syncConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export const supabase = (): SupabaseClient | null => {
    if (!syncConfigured) return null;
    client ??= createClient(url!, anonKey!);

    return client;
};

export const getUserId = async (): Promise<string | null> => {
    const sb = supabase();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();

    return data.session?.user.id ?? null;
};

export const signIn = async (email: string, password: string): Promise<string | null> => {
    const sb = supabase();
    if (!sb) return 'Sync is not configured.';
    const { error } = await sb.auth.signInWithPassword({ email, password });

    return error ? error.message : null;
};

export const signOut = async (): Promise<void> => {
    await supabase()?.auth.signOut();
};

export const onAuthChange = (cb: () => void): (() => void) => {
    const sb = supabase();
    if (!sb) return () => {};
    const { data } = sb.auth.onAuthStateChange(() => cb());

    return () => data.subscription.unsubscribe();
};

// ---- collection state ----

export interface RemoteState {
    data: unknown;
    updatedAt: string;
}

export const pullState = async (): Promise<RemoteState | null> => {
    const sb = supabase();
    const userId = await getUserId();
    if (!sb || !userId) return null;
    const { data, error } = await sb.from('collection_state').select('data, updated_at').eq('user_id', userId).maybeSingle();
    if (error || !data) return null;

    return { data: data.data, updatedAt: data.updated_at };
};

export const pushState = async (data: unknown, updatedAt: string): Promise<boolean> => {
    const sb = supabase();
    const userId = await getUserId();
    if (!sb || !userId) return false;
    const { error } = await sb.from('collection_state').upsert({ user_id: userId, data, updated_at: updatedAt });
    if (error) console.error('Sync push failed:', error.message);

    return !error;
};

// ---- photos ----

const dataUrlToBlob = (dataUrl: string): Blob => {
    const [head, body] = dataUrl.split(',');
    const mime = head.match(/data:(.*?);/)?.[1] ?? 'image/jpeg';
    const bytes = atob(body);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);

    return new Blob([arr], { type: mime });
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

export const uploadPhoto = async (id: string, dataUrl: string): Promise<boolean> => {
    const sb = supabase();
    const userId = await getUserId();
    if (!sb || !userId) return false;
    const { error } = await sb.storage
        .from('photos')
        .upload(`${userId}/${id}.jpg`, dataUrlToBlob(dataUrl), { upsert: true, contentType: 'image/jpeg' });
    if (error) console.error('Photo upload failed:', error.message);

    return !error;
};

export const downloadPhoto = async (id: string): Promise<string | undefined> => {
    const sb = supabase();
    const userId = await getUserId();
    if (!sb || !userId) return undefined;
    const { data, error } = await sb.storage.from('photos').download(`${userId}/${id}.jpg`);
    if (error || !data) return undefined;

    return blobToDataUrl(data);
};
