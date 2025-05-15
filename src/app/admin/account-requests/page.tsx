import UserAccountApprovalDialog from "@/components/admin/UserAccountApprovalDialog"
import UserAccountRejectDialog from "@/components/admin/UserAccountRejectDialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/database/drizzle"
import { users } from "@/database/schema"
import config from "@/lib/config"
import { getColorForUser, getInitials, getMonthAndDayAndYear } from "@/lib/utils"
import { eq, asc, desc } from "drizzle-orm"
import { unstable_noStore } from "next/cache"
import Image from "next/image"
import Link from "next/link"

const page = async ({ searchParams }: { searchParams: Promise<{ sort: string }> }) => {
    unstable_noStore(); // <-- disables caching

    const { sort: rawSort = 'recent' } = await searchParams;
    const sort = ['oldest', 'recent'].includes(rawSort) ? rawSort : 'recent';
    const sortOrder = sort === 'oldest' ? 'asc' : 'desc';

    const pendingUsers = await db.
        select()
        .from(users)
        .where(eq(users.status, "PENDING"))
        .orderBy(sortOrder === "asc" ? asc(users.createdAt) : desc(users.createdAt))

    const isOldest = sort === 'oldest'
    const nextSort = isOldest ? 'recent' : 'oldest'

    const sortLabel = isOldest ? 'Recent to Oldest' : 'Oldest to Recent'
    const sortIcon = (
        <Image
            alt="sort"
            src="/icons/admin/arrow-swap.svg"
            height={15}
            width={15}
            className={pendingUsers.length <= 1 ? "invert-100" : ""}
        />
    )

    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Account Registration Requests</h2>

                {pendingUsers.length <= 1 ? (
                    <Button disabled className="bg-primary-admin text-white">
                        {sortLabel} {sortIcon}
                    </Button>
                ) : (
                    <Link
                        href={`?sort=${nextSort}`}
                        className="bg-white text-black border border-gray-50 hover:bg-light-300 h-8 px-3 inline-flex items-center gap-1 rounded-md text-sm font-medium"
                    >
                        {sortLabel} {sortIcon}
                    </Link>
                )}


            </div>
            <div className="mt-5">
                {!pendingUsers ? (
                    <div className="text-center text-red py-10 font-bold text-xl">Error fetching user</div>
                ) : (
                    pendingUsers.length > 0 ? (
                        <Table className="rounded-md overflow-hidden">
                            <TableHeader className="[&_tr]:border-b-0 h-12">
                                <TableRow className="bg-light-300 border-0">
                                    <TableHead className="font-light">Name</TableHead>
                                    <TableHead className="font-light">Date Joined</TableHead>
                                    <TableHead className="font-light">University ID No</TableHead>
                                    <TableHead className="font-light">University ID Card</TableHead>
                                    <TableHead className="font-light">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="">
                                {pendingUsers.map((user) => (
                                    <TableRow key={user.id} className="h-14 border-gray-50">
                                        <TableCell className="flex items-center gap-2 min-w-max">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className={`${getColorForUser(user.email || user.id)} font-medium`}>
                                                    {getInitials(user?.fullName || "XX")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-[#1E293B]">{user.fullName}</p>
                                                <p className="text-[#64748B] text-sm">{user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-dark-200">{user.createdAt ? getMonthAndDayAndYear(user.createdAt) : "--"}</TableCell>

                                        <TableCell className="font-medium">{user.universityId}</TableCell>
                                        <TableCell className="">
                                            <Link target="_blank" href={config.env.imageKit.urlEndpoint + user.universityCard} className="flex items-center gap-1 font-medium text-[#0089F1]">
                                                View ID Card
                                                <Image
                                                    alt="view button"
                                                    src="/icons/admin/link.svg"
                                                    height={15}
                                                    width={15}
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell className="flex gap-4 items-center">
                                            <UserAccountApprovalDialog userId={user.id} />
                                            <UserAccountRejectDialog userId={user.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="h-[60vh] flex flex-col gap-7 items-center justify-center">
                            <Image
                                alt="empty user account approval"
                                src="/icons/admin/empty-account-approval.svg"
                                height={300}
                                width={300}
                                className="object-contain"
                            />
                            <div className="space-y-3">
                                <h3 className="text-xl text-[#1E293B] font-bold text-center">No Pending Account Requests</h3>
                                <p className="text-[#64748B] text-center">There are currently no account requests awaiting approval.</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    )
}
export default page;