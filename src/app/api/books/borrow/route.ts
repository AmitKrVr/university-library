import { auth } from "@/auth";
import { borrowBook } from "@/lib/actions/book";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await req.json();

    if (!bookId) {
        return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const result = await borrowBook({
        userId: session.user.id,
        bookId
    })

    if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(result.data)
}