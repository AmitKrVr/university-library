import { getBooks } from "@/lib/actions/book";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "12");

        const result = await getBooks(page, limit);

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        return NextResponse.json(result.data);
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong while fetching books." },
            { status: 500 })
    }
}