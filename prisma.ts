// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = globalThis.__prisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore - store on global for dev hot reload safety
    globalThis.__prisma__ = prisma;
}

export default prisma;
