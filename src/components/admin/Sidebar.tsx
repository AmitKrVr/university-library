"use client"

import { adminSideBarLinks } from "@/constants"
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
    const pathname = usePathname()
    return (
        <div className="admin-sidebar">
            <div>
                <div className="logo">
                    <Image
                        src="/icons/admin/logo.svg"
                        height={37}
                        width={37}
                        alt="admin logo" />
                    <h1>BookWise</h1>
                </div>

                <div className="mt-10 flex flex-col gap-5">
                    {adminSideBarLinks.map((item) => {
                        const isSelected = (item.route !== "/admin" && pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

                        return (
                            <Link href={item.route} key={item.route}>
                                <div className={cn("link", isSelected && "bg-primary-admin shadow-sm")}>
                                    <div className="relative size-5">
                                        <Image
                                            fill
                                            src={item.img}
                                            alt="icon"
                                            className={`${isSelected ? "brightness-0 invert" : "object-contain"}`}
                                        />
                                    </div>
                                    <p className={cn(isSelected ? "text-white" : "text-dark")}>{item.text}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="user">
                <Avatar>
                    {/* <AvatarImage src="https://avatars.githubusercontent.com/u/136904032?v=4" /> */}
                    <AvatarFallback className="bg-amber-100">
                        {getInitials(session?.user?.name || "XX")}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col max-md:hidden">
                    <p className="font-semibold text-dark-200">{session?.user?.name}</p>
                    <p className="text-xs text-light-500 ">{session?.user?.email}</p>
                </div>
            </div>
        </div>
    )
}
export default Sidebar