import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import EmptyState from "./EmptyState"
import SectionCard from "./SectionCard"
import { getColorForUser, getInitials } from "@/lib/utils"
import ErrorDisplay from "./ErrorDisplay"

interface Data {
    id: string;
    name: string;
    email: string;
}

interface Props {
    pendingUsersResult: {
        data: Data[];
        error: boolean;
        message?: string;
    }

}

const AccountRequestsSection = ({ pendingUsersResult }: Props) => {
    return (
        <SectionCard
            title="Account Requests"
            viewAllHref="/admin/account-requests"
            error={pendingUsersResult.error}
        >
            {pendingUsersResult.error ? (
                <ErrorDisplay message={pendingUsersResult.message || "An unknown error occurred."} />
            ) : (
                pendingUsersResult.data.length === 0
                    ? (
                        <EmptyState
                            imageAlt="empty-user-requests"
                            imageSrc="/icons/admin/empty-account-request.svg"
                            title="No Pending Account Requests"
                            description="There are currently no account requests awaiting approval."
                        />
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {pendingUsersResult.data.map((user) => (
                                <div key={user.id} className="space-y-2.5 rounded-md p-3 bg-light-300">
                                    <div className="flex w-full justify-center">
                                        <Avatar className="h-12 w-12 font-medium">
                                            <AvatarFallback className={getColorForUser(user.email)}>
                                                {getInitials(user.name || "XX")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="text-center ">
                                        <p className="text-base font-medium line-clamp-1">{user.name}</p>
                                        <p className="text-sm font-normal text-slate-500 overflow-hidden overflow-ellipsis">{user.email}</p>
                                    </div>
                                </div>))}
                        </div>
                    ))}
            {!pendingUsersResult.error && pendingUsersResult.data.length > 5 &&
                <div className="absolute z-10 bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            }
        </SectionCard>
    )
}
export default AccountRequestsSection