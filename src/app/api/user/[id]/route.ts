import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const [user] = await db
            .select({
                id: users.id,
                status: users.status,
                role: users.role,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return NextResponse.json(user || null);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}