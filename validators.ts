// src/lib/validators.ts
import { z } from "zod";

export const cityEnum = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"] as const;
export const propertyTypes = ["Apartment", "Villa", "Plot", "Office", "Retail"] as const;
export const bhkEnum = ["Studio", "One", "Two", "Three", "Four"] as const;
export const purposeEnum = ["Buy", "Rent"] as const;
export const timelineEnum = ["0-3m", "3-6m", ">6m", "Exploring"] as const;
export const sourceEnum = ["Website", "Referral", "Walk-in", "Call", "Other"] as const;
export const statusEnum = ["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"] as const;

export const buyerCreateSchema = z.object({
    fullName: z.string().min(2).max(80),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
    city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
    propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]),
    bhk: z.enum(["ONE", "TWO", "THREE", "FOUR", "STUDIO"]).optional(),
    purpose: z.enum(["Buy", "Rent"]),
    budgetMin: z.coerce.number().int().positive().optional(),
    budgetMax: z.coerce.number().int().positive().optional(),
    timeline: z.enum(["ZERO_TO_3M", "THREE_TO_6M", "GT_6M", "EXPLORING"]),
    source: z.enum(["Website", "Referral", "Walk_in", "Call", "Other"]),
    status: z.enum([
        "New",
        "Qualified",
        "Contacted",
        "Visited",
        "Negotiation",
        "Converted",
        "Dropped",
    ]).default("New"),
    notes: z.string().max(1000).optional(),
    tags: z.array(z.string()).optional(),
});

export const buyerUpdateSchema = buyerCreateSchema.partial().extend({
    updatedAt: z.string().optional(), // ISO timestamp from client for concurrency checks
}).refine(data => {
    // if both budgets present, budgetMax >= budgetMin
    if (typeof data.budgetMin === "number" && typeof data.budgetMax === "number") {
        return data.budgetMax >= data.budgetMin;
    }
    return true;
}, {
    message: "budgetMax must be greater than or equal to budgetMin",
});

export const listQuerySchema = z.object({
    page: z.preprocess((v) => Number(v), z.number().int().positive().default(1)),
    pageSize: z.preprocess((v) => Number(v), z.number().int().positive().default(10)),
    city: z.string().optional(),
    propertyType: z.string().optional(),
    status: z.string().optional(),
    timeline: z.string().optional(),
    q: z.string().optional(),
    sort: z.enum(["updatedAt:desc","updatedAt:asc"]).optional().default("updatedAt:desc"),
});
