'use client'

import { cn, getInitials } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Session } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { logoutAction } from "@/lib/actions/logout"
import { useEffect, useState } from "react"

const Header = ({ session }: { session: Session }) => {
    const pathname = usePathname()

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "px-5 xs:px-10 md:px-16 py-5 flex justify-between gap-5 sticky top-0 left-0 z-50 transition-colors duration-300",
                isScrolled ? "backdrop-blur-sm bg-dark-300/70" : ""
            )}
        >
            <Link href="/" className="select-none flex items-center gap-2">
                <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
                <span className="hidden md:block text-3xl font-semibold text-light-100">BookWise</span>
            </Link>

            <ul className="flex flex-row items-center gap-8">
                <li>
                    <Link href="/" className={cn(
                        'text-base md:text-lg font-medium cursor-pointer capitalize',
                        pathname === '/' ? 'text-light-200' : 'text-light-100')}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/search?page=1" className={cn(
                        'text-base md:text-lg font-medium cursor-pointer capitalize',
                        pathname.startsWith("/search") ? 'text-light-200' : 'text-light-100')}>
                        Search
                    </Link>
                </li>
                <li>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="size-10">
                                <AvatarFallback className="bg-amber-100 font-semibold">
                                    {getInitials(session?.user?.name || "XX")}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 gradient-blue text-white border-gray-800 mr-4">
                            <DropdownMenuLabel className="text-muted-foreground select-none">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-800" />
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
                                <DropdownMenuSeparator className="bg-gray-800 " />
                                <DropdownMenuItem asChild>
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