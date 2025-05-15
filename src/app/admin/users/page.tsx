import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/database/drizzle";
import { borrowRecords, users } from "@/database/schema";
import { cn, getColorForUser, getInitials, getMonthAndDayAndYear } from "@/lib/utils";
import { asc, count, desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import UserRoleUpdateDialog from "@/components/admin/UserRoleUpdateDialog";
import config from "@/lib/config";

const UserPage = async ({ searchParams }: { searchParams: Promise<{ sort?: string }> }) => {

    const { sort } = await searchParams;
    const sortOption = sort || "name-asc";

    const orderByClause =
        sort === "name-desc"
            ? desc(users.fullName)
            : asc(users.fullName);

    const allUsersWithBorrowCount = await db
        .select({
            id: users.id,
            name: users.fullName,
            email: users.email,
            universityId: users.universityId,
            universityCard: users.universityCard,
            role: users.role,
            dateJoined: users.createdAt,
            borrowedCount: count(borrowRecords.id).as("borrowedCount"),
        })
        .from(users)
        .leftJoin(borrowRecords, eq(borrowRecords.userId, users.id))
        .groupBy(users.id)
        .orderBy(orderByClause)
        .limit(12);


    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">All Users</h2>
                <Link
                    href={`?sort=${sortOption === "name-asc" ? "name-desc" : "name-asc"}`}
                    className="bg-white text-black border border-gray-50 hover:bg-white h-8 px-2 inline-flex items-center gap-1 rounded-md text-sm font-medium"
                >
                    {sortOption === "name-asc" ? "Z-A" : "A-Z"}
                    <Image
                        alt="sort"
                        src="/icons/admin/arrow-swap.svg"
                        height={15}
                        width={15}
                    />
                </Link>
            </div>
            <div className="mt-5">
                <Table className="rounded-md overflow-hidden">
                    <TableHeader className="[&_tr]:border-b-0 h-12">
                        <TableRow className="bg-light-300 border-0">
                            <TableHead className="font-light">Name</TableHead>
                            <TableHead className="font-light">Date Joined</TableHead>
                            <TableHead className="font-light">Role</TableHead>
                            <TableHead className="font-light w-[130px]">Books Borrowed</TableHead>
                            <TableHead className="font-light">University ID No</TableHead>
                            <TableHead className="font-light">University ID Card</TableHead>
                            <TableHead className="font-light">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="">
                        {allUsersWithBorrowCount.map((user) => (
                            <TableRow key={user.id} className="h-14 border-gray-50">
                                <TableCell className="flex items-center gap-2 min-w-max">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className={`${getColorForUser(user.email || user.id)} font-medium`}>
                                            {getInitials(user?.name || "XX")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-[#1E293B]">{user.name}</p>
                                        <p className="text-[#64748B] text-sm">{user.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-dark-200">{user.dateJoined ? getMonthAndDayAndYear(user.dateJoined) : "--"}</TableCell>
                                <TableCell
                                    className={cn(user.role === "ADMIN" ? "text-green bg-green-100" : "text-pink-600 bg-pink-100", "flex text-xs font-medium rounded-full py-1 w-max")}
                                >
                                    <Popover>
                                        <PopoverTrigger>
                                            {user.role === "ADMIN" ? "Admin" : "User"}
                                        </PopoverTrigger>
                                        <PopoverContent className="flex flex-col w-28 py-2 mt-2 space-y-2 border border-gray-200 shadow-2xl">
                                            <UserRoleUpdateDialog user={user} />
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell className="font-medium">{user.borrowedCount}</TableCell>
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
                                <TableCell>
                                    <div className="flex justify-center">
                                        <DeleteUserDialog userId={user.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}
export default UserPage;