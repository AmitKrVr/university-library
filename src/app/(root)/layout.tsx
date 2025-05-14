import { ReactNode } from "react"
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header"
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {

    const session = await auth();
    if (!session) redirect("/sign-in");

    after(async () => {
        if (!session?.user?.id) return;

        // get the user and see if the last activity date is today
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, session?.user?.id))
            .limit(1);

        if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10)) return

        await db
            .update(users)
            .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
            .where(eq(users.id, session?.user?.id));
    })

    return (
        <main className="root-container">
            <Header session={session} />

            <div className="mt-14 md:mt-10 pb-20 px-5 xs:px-10 md:px-16">{children}</div>
        </main>
    )
}
export default Layout