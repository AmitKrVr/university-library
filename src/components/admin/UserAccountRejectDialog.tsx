"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { rejectUser } from "@/lib/admin/actions/user"
import { toast } from "sonner"
import Image from "next/image"
import { ReusableAlertDialog } from "./ReusableAlertDialog"

const UserAccountRejectDialog = ({ userId }: { userId: string }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleAccountReject = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {
            setIsRejecting(true);
            setError(null);
            const result = await rejectUser(userId);

            if (!result.success) {
                setError(result.message);
                setIsRejecting(false);
                return;
            }

            toast.success(result.message)

            setOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            setIsRejecting(false);
        }
    };


    return (
        <ReusableAlertDialog
            open={open}
            setOpen={setOpen}
            isLoading={isRejecting}
            error={error}
            setError={setError}
            icon="/icons/admin/circle-alert.svg"
            iconBg="bg-red-400"
            iconBorder="border-[10px] border-red-100"
            title="Deny Account Request"
            description="Denying this request will notify the student they’re not eligible due to unsuccessful ID card verification."
            actionText="Deny & Notify Student"
            onAction={handleAccountReject}
            trigger={
                <Image
                    alt="reject"
                    src="/icons/admin/circle-x.svg"
                    height={15}
                    width={15}
                    className="size-5 cursor-pointer"
                />
            }
            actionBtnColor="bg-red-400 hover:bg-red-600/70"
        />
    )
}
export default UserAccountRejectDialog