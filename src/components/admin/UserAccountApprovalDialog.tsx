"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { approvedUser } from "@/lib/admin/actions/user"
import { toast } from "sonner"
import { ReusableAlertDialog } from "./ReusableAlertDialog"

const UserAccountApprovalDialog = ({ userId }: { userId: string }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleAccountApproving = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            setIsApproving(true);
            setError(null);
            const result = await approvedUser(userId);

            if (!result.success) {
                setError(result.message);
                setIsApproving(false);
                return;
            }

            toast.success(result.message)

            setOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            setIsApproving(false);
        }
    };


    return (
        <ReusableAlertDialog
            open={open}
            setOpen={setOpen}
            isLoading={isApproving}
            error={error}
            setError={setError}
            icon="/icons/admin/tick.svg"
            iconBg="bg-green-400"
            iconBorder="border-[10px] border-green-100"
            title="Approved Account Request"
            description="Approve the student’s account request and grant access. A confirmation email will be sent upon approval."
            actionText="Approve & Send Notification"
            onAction={handleAccountApproving}
            trigger={
                <Button className="bg-green-100 text-green font-semibold hover:bg-green-200/50 cursor-pointer">
                    Approve Account
                </Button>
            }
            actionBtnColor="bg-green-400 hover:bg-green-400"
        />
    )
}
export default UserAccountApprovalDialog