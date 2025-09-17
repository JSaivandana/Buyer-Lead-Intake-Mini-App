// src/components/BuyerForm.tsx
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuyerCreateSchema } from '@/server/validators/buyer';
import type { z } from 'zod';

type FormData = z.infer<typeof BuyerCreateSchema>;

export default function BuyerForm({ defaultValues = {}, onSuccess }: { defaultValues?: Partial<FormData>, onSuccess?: (id:string)=>void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(BuyerCreateSchema),
        defaultValues: defaultValues as any
    });

    async function submit(data: FormData) {
        const res = await fetch('/api/buyers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (res.ok) {
            const json = await res.json();
            onSuccess?.(json.id);
        } else {
            // handle errors (display)
            console.error(await res.text());
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <label>Full name
                <input {...register('fullName')} />
                {errors.fullName && <p>{String(errors.fullName.message)}</p>}
            </label>
            <label>Phone
                <input {...register('phone')} />
                {errors.phone && <p>{String(errors.phone.message)}</p>}
            </label>
            {/* add other fields similarly */}
            <button type="submit" disabled={isSubmitting}>Create</button>
        </form>
    );
}
