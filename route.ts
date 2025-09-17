import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);

        // Filters
        const city = searchParams.get("city") || undefined;
        const propertyType = searchParams.get("propertyType") || undefined;
        const status = searchParams.get("status") || undefined;
        const timeline = searchParams.get("timeline") || undefined;
        const search = searchParams.get("q") || undefined;

        const where: any = {};

        if (city) where.city = city;
        if (propertyType) where.propertyType = propertyType;
        if (status) where.status = status;
        if (timeline) where.timeline = timeline;
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        const buyers = await prisma.buyer.findMany({
            where,
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        });

        const total = await prisma.buyer.count({ where });

        return NextResponse.json({
            data: buyers,
            pagination: {
                page,
                total,
                pageSize: PAGE_SIZE,
                totalPages: Math.ceil(total / PAGE_SIZE),
            },
        });
    } catch (err: any) {
        console.error("API /buyers error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
