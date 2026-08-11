'use client';

import { useRef } from 'react';

import { Camera } from 'lucide-react';

/** Reads a picked image, downscales it and returns a compact data URL (keeps localStorage small) */
const fileToDataUrl = (file: File, maxSize = 900): Promise<string> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = url;
    });

export const PhotoInput = ({
    value,
    onChange,
    label = 'Add photo'
}: {
    value?: string;
    onChange: (dataUrl: string) => void;
    label?: string;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <button
            type='button'
            onClick={() => inputRef.current?.click()}
            className='border-border bg-card relative flex h-40 w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed'>
            {value ? (
                <img src={value} alt='Selected' className='size-full object-cover' />
            ) : (
                <span className='text-muted-foreground flex flex-col items-center gap-2 text-sm'>
                    <Camera className='size-6' />
                    {label}
                </span>
            )}
            <input
                ref={inputRef}
                type='file'
                accept='image/*'
                capture='environment'
                className='hidden'
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange(await fileToDataUrl(file));
                }}
            />
        </button>
    );
};
