'use client';

/**
 * Photo storage in IndexedDB. localStorage tops out around 5 MB, which a handful
 * of uploaded photos exceeds — after that every save silently failed and photos
 * vanished on the next reload. IndexedDB holds hundreds of MB.
 *
 * Trees store a `idb:<id>` reference; the image data lives here.
 */

const DB_NAME = 'mr-bonsai-photos';
const STORE = 'photos';

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

/** Stores a data URL and returns the reference to keep in app state */
export const savePhoto = (id: string, dataUrl: string): string => {
    memoryCache.set(id, dataUrl);
    void withStore('readwrite', (store) => store.put(dataUrl, id)).catch((error) => {
        console.error('Failed to persist photo', error);
    });

    return `${PHOTO_REF_PREFIX}${id}`;
};

export const loadPhoto = async (ref: string): Promise<string | undefined> => {
    const id = ref.slice(PHOTO_REF_PREFIX.length);
    const cached = memoryCache.get(id);
    if (cached) return cached;

    try {
        const stored = await withStore<string | undefined>('readonly', (store) => store.get(id));
        if (stored) memoryCache.set(id, stored);

        return stored;
    } catch {
        return undefined;
    }
};

export const removePhoto = (ref: string): void => {
    const id = ref.slice(PHOTO_REF_PREFIX.length);
    memoryCache.delete(id);
    void withStore('readwrite', (store) => store.delete(id)).catch(() => {});
};
