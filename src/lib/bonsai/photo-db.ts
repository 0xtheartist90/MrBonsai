'use client';

/**
 * Photo storage in IndexedDB. localStorage tops out around 5 MB, which a handful
 * of uploaded photos exceeds — after that every save silently failed and photos
 * vanished on the next reload. IndexedDB holds hundreds of MB.
 *
 * Trees store a `idb:<id>` reference; the image data lives here. When Supabase
 * sync is configured, photos also upload to the cloud (queued until signed in)
 * and download on demand on devices that don't have them locally.
 */
import { downloadPhoto, uploadPhoto } from './sync';

const DB_NAME = 'mr-bonsai-photos';
const STORE = 'photos';
const UPLOAD_QUEUE_KEY = 'mr-bonsai-photo-upload-queue';

export const PHOTO_REF_PREFIX = 'idb:';

export const isPhotoRef = (photo?: string): photo is string => Boolean(photo?.startsWith(PHOTO_REF_PREFIX));

/** Serves a photo immediately after saving, before the async IDB write lands */
const memoryCache = new Map<string, string>();

const openDb = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

const withStore = async <T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
    const db = await openDb();

    return new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = run(tx.objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
};

// ---- cloud upload queue (survives reloads; flushed once signed in) ----

const readQueue = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem(UPLOAD_QUEUE_KEY) ?? '[]') as string[];
    } catch {
        return [];
    }
};

const writeQueue = (ids: string[]): void => {
    try {
        localStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(ids));
    } catch {
        // non-fatal: the queue rebuilds from a later save
    }
};

const enqueueUpload = (id: string): void => {
    const queue = readQueue();
    if (!queue.includes(id)) writeQueue([...queue, id]);
};

/** Try to push every queued photo to the cloud; keeps whatever fails for next time */
export const flushPhotoUploads = async (): Promise<void> => {
    const queue = readQueue();
    if (queue.length === 0) return;
    const remaining: string[] = [];
    for (const id of queue) {
        const dataUrl = memoryCache.get(id) ?? (await withStore<string | undefined>('readonly', (s) => s.get(id)).catch(() => undefined));
        if (!dataUrl) continue; // photo no longer exists locally
        const ok = await uploadPhoto(id, dataUrl);
        if (!ok) remaining.push(id);
    }
    writeQueue(remaining);
};

// ---- API ----

/** Stores a data URL and returns the reference to keep in app state */
export const savePhoto = (id: string, dataUrl: string): string => {
    memoryCache.set(id, dataUrl);
    void withStore('readwrite', (store) => store.put(dataUrl, id)).catch((error) => {
        console.error('Failed to persist photo', error);
    });
    enqueueUpload(id);
    void flushPhotoUploads();

    return `${PHOTO_REF_PREFIX}${id}`;
};

export const loadPhoto = async (ref: string): Promise<string | undefined> => {
    const id = ref.slice(PHOTO_REF_PREFIX.length);
    const cached = memoryCache.get(id);
    if (cached) return cached;

    try {
        const stored = await withStore<string | undefined>('readonly', (store) => store.get(id));
        if (stored) {
            memoryCache.set(id, stored);

            return stored;
        }
    } catch {
        // fall through to the cloud
    }

    // not on this device — fetch from the cloud and cache locally
    const remote = await downloadPhoto(id);
    if (remote) {
        memoryCache.set(id, remote);
        void withStore('readwrite', (store) => store.put(remote, id)).catch(() => {});
    }

    return remote;
};

export const removePhoto = (ref: string): void => {
    const id = ref.slice(PHOTO_REF_PREFIX.length);
    memoryCache.delete(id);
    writeQueue(readQueue().filter((qid) => qid !== id));
    void withStore('readwrite', (store) => store.delete(id)).catch(() => {});
};
