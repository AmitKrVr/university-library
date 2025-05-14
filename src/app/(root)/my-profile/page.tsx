"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { BadgeCheck, BadgeInfo, LoaderPinwheel } from "lucide-react"
import Image from "next/image"
import { Image as IKImage } from "@imagekit/next"
import config from "@/lib/config"
import BorrowedBooks from "./BorrowedBooks"
import { useUserProfile } from "@/hooks/useUserProfile"

const ProfilePage = () => {
    const { data, isLoading, isError } = useUserProfile()

    if (isLoading) return (
        <div className="flex items-center justify-center w-full h-screen md:h-[400px]">
            <div className="flex flex-col items-center justify-center gap-3">
                <LoaderPinwheel className="size-12 animate-spin text-light-100" />
            </div>
        </div>
    )
    if (isError) return <p className="text-red-500">Failed to load profile</p>

    const { user, borrowedWithBooks } = data || { user: {}, borrowedWithBooks: [] }

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            <div className="basis-1/3 xl:flex-2/5">
                <div className="relative gradient-blue w-full rounded-2xl p-8">
                    <Image
                        alt="badge"
                        src="/icons/badge.svg"
                        height={50}
                        width={50}
                        className="absolute h-20 w-auto -top-4 left-1/2 -translate-x-1/2"
                    />
                    <div className="mt-12 space-y-7">
                        <div className="flex gap-6 items-center">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-amber-100">
                                    {getInitials(user?.name || "XX")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p title="Verified Student" className="flex items-center gap-2 text-light-100">
                                    {user.status === "APPROVED" ? (
                                        <>
                                            <BadgeCheck className="text-primary size-5 shrink-0" aria-hidden="true" />
                                            <span >Verified Student</span>
                                        </>
                                    ) : (
                                        <>
                                            <BadgeInfo className="text-yellow-500 size-5 shrink-0" aria-hidden="true" />
                                            <span>Your account is not verified yet</span>
                                        </>
                                    )}
                                </p>
                                <p className="text-xl font-bold text-light-300">{user?.name}</p>
                                <p className="text-light-100">{user?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-light-500">University</p>
                            <h3 className="text-xl font-semibold text-light-100">Vinoba Bhave University</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-light-500">Student ID</p>
                            <h3 className="text-xl font-semibold text-light-100">{user.universityId}</h3>
                        </div>

                        <IKImage
                            urlEndpoint={config.env.imageKit.urlEndpoint}
                            alt="id card"
                            height={300}
                            width={400}
                            className="object-cover w-full h-auto max-h-[300px] rounded-2xl"
                            src={user.universityCard || ""}
                        />
                    </div>

                </div>
            </div>
            <section className="xl:flex-3/5 space-y-7">
                <BorrowedBooks borrowedWithBooks={borrowedWithBooks} />
            </section >
        </div >
    )
}
export default ProfilePage;