import { getBookDetails } from "@/lib/actions/book";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const bookId = params.id;
    const result = await getBookDetails(bookId);

    if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
    }
    return NextResponse.json(result.data[0]);
}
