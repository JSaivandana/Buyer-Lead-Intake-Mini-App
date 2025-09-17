// src/server/validators/buyer.ts
import { z } from 'zod';

export const cityEnum = ['Chandigarh','Mohali','Zirakpur','Panchkula','Other'] as const;
export const propertyTypeEnum = ['Apartment','Villa','Plot','Office','Retail'] as const;
export const bhkEnum = ['1','2','3','4','Studio'] as const;
export const purposeEnum = ['Buy','Rent'] as const;
export const timelineEnum = ['0-3m','3-6m','>6m','Exploring'] as const;
export const sourceEnum = ['Website','Referral','Walk-in','Call','Other'] as const;
export const statusEnum = ['New','Qualified','Contacted','Visited','Negotiation','Converted','Dropped'] as const;

export const BuyerCreateSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80),
    email: z.string().email().optional().or(z.literal('')).transform(v => v === '' ? undefined : v).optional(),
    phone: z.string().regex(/^[0-9]{10,15}$/, 'Phone must be 10-15 digits'),
    city: z.enum(cityEnum),
    propertyType: z.enum(propertyTypeEnum),
    bhk: z.string().optional(), // we'll conditionally refine below
    purpose: z.enum(purposeEnum),
    budgetMin: z.number().int().positive().optional(),
    budgetMax: z.number().int().positive().optional(),
    timeline: z.enum(timelineEnum),
    source: z.enum(sourceEnum),
    notes: z.string().max(1000).optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
    tags: z.array(z.string()).optional(),
    status: z.enum(statusEnum).optional()
}).superRefine((data, ctx) => {
    // budget check
    if (data.budgetMin != null && data.budgetMax != null) {
        if (data.budgetMax < data.budgetMin) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'budgetMax must be >= budgetMin',
                path: ['budgetMax']
            });
        }
    }
    // bhk required for Apartment/Villa
    if (data.propertyType === 'Apartment' || data.propertyType === 'Villa') {
        if (!data.bhk) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'bhk is required for Apartment and Villa',
                path: ['bhk']
            });
        } else if (!bhkEnum.includes(data.bhk as any)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid bhk value`,
                path: ['bhk']
            });
        }
    }
});
