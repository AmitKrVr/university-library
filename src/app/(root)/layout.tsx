import { ReactNode } from "react"
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header"

const Layout = async ({ children }: { children: ReactNode }) => {

    const session = await auth();
    if (!session) redirect("/sign-in");

    return (
        <main className="root-container">
            <div className="mx-auto max-w-7xl">
                <Header session={session} />

                <div className="mt-20 pb-20">{children}</div>
            </div>
        </main>
    )
}
export default Layout