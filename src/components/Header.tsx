'use client'

import { cn, getInitials } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Session } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { logoutAction } from "@/lib/actions/logout"

const Header = ({ session }: { session: Session }) => {
    const pathname = usePathname()

    return (
        <header className="my-10 flex justify-between gap-5">
            <Link href="/">
                <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
            </Link>

            <ul className="flex flex-row items-center gap-8">
                <li>
                    <Link href="/" className={cn(
                        'text-base cursor-pointer capitalize',
                        pathname === '/' ? 'text-light-200' : 'text-light-100')}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/search?page=1" className={cn(
                        'text-base cursor-pointer capitalize',
                        pathname.startsWith("/search") ? 'text-light-200' : 'text-light-100')}>
                        Search
                    </Link>
                </li>
                <li>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarFallback className="bg-amber-100">
                                    {getInitials(session?.user?.name || "XX")}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 bg-dark-500 text-white border-muted-foreground mr-4">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-muted-foreground" />
                            <DropdownMenuGroup>
                                <Link href="/my-profile">
                                    <DropdownMenuItem>
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/contact-us">
                                    <DropdownMenuItem>
                                        Contact Us
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator className="bg-muted-foreground" />
                                <DropdownMenuItem>
                                    <form
                                        action={logoutAction}
                                        className="w-full"
                                    >
                                        <button type="submit" className="w-full text-left">
                                            Logout
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>
            </ul>
        </header>
    )
}
export default Header