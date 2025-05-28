import { db } from "@/database/drizzle";
import { contactUs } from "@/database/schema";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();
        const result = await db.insert(contactUs).values({ name, email, message }).returning();

        if (result) {
            return Response.json({
                success: true,
                message: "We’ve received your message and will get back to you shortly."
            })
        }

        return Response.json({
            success: false,
            message: "Something went wrong, Please try again"
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return Response.json({
            success: false,
            message: "An unexpected error occurred. Please try again later."
        })
    }
}