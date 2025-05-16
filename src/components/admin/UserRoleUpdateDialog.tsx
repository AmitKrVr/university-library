"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changeUserRoleAction } from "@/lib/admin/actions/changeUserRole";
import { ReusableAlertDialog } from "./ReusableAlertDialog";

interface User {
    id: string;
    name: string;
    email: string;
    universityId: number;
    universityCard: string;
    role: "USER" | "ADMIN" | null;
    dateJoined: Date | null;
    borrowedCount: number;
}

const UserRoleUpdateDialog = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isChangingRole, setIsChangingRole] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openAdminDialog, setOpenAdminDialog] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const handleRoleChange = async (newRole: "USER" | "ADMIN", setDialogOpen: (open: boolean) => void) => {
        if (isChangingRole) return;

        setIsChangingRole(true);

        try {
            setError(null);
            const result = await changeUserRoleAction(user.id, newRole);

            if (!result.success) {
                setError(result.message);
                return;
            }

            toast.success(`Role successfully changed to ${newRole}`, {
                description: `User ${user.email || user.id} is now a ${newRole}`,

            });
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
            toast.error("Failed to change role", {
                description: "An error occurred while updating the user role.",
            });
        } finally {
            setIsChangingRole(false);
            setDialogOpen(false);
        }
    };

    return (
        <>
            <ReusableAlertDialog
                open={openUserDialog}
                setOpen={setOpenUserDialog}
                isLoading={isChangingRole}
                error={error}
                setError={setError}
                icon="/icons/admin/circle-help.svg"
                iconAlt="warning"
                iconBg="bg-pink-400"
                iconBorder="border-[10px] border-pink-100"
                title="Revoke Administrative Access"
                description="You are about to change this user to a regular user role. This will remove their admin privileges and notify them about the change."
                actionText="Remove Admin Access"
                actionBtnColor="bg-pink-400 hover:bg-pink-500/70"
                onAction={async (e) => {
                    e.preventDefault();
                    await handleRoleChange("USER", setOpenUserDialog);
                }}
                trigger={
                    <button
                        disabled={user.role === "USER"}
                        className="bg-pink-100 text-pink-600 rounded-full px-2 text-sm font-medium py-1 transition-colors hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setOpenUserDialog(true)}
                    >
                        User
                    </button>
                }
            />

            <ReusableAlertDialog
                open={openAdminDialog}
                setOpen={setOpenAdminDialog}
                isLoading={isChangingRole}
                error={error}
                icon="/icons/admin/circle-help.svg"
                iconAlt="warning"
                iconBg="bg-green-400"
                iconBorder="border-[10px] border-green-100"
                title="Grant Administrative Access"
                description="You are about to grant this user administrative privileges. This will give them full access to manage users, books, and system settings. They will be notified about this change."
                actionText="Grant Admin Access"
                actionBtnColor="bg-green-400 hover:bg-green-400/90"
                onAction={async (e) => {
                    e.preventDefault();
                    await handleRoleChange("ADMIN", setOpenAdminDialog);
                }}
                trigger={
                    <button
                        disabled={user.role === "ADMIN"}
                        className="bg-green-100 text-green-600 rounded-full px-2 text-sm font-medium py-1 transition-colors hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setOpenAdminDialog(true)}
                    >
                        Admin
                    </button>
                }
            />
        </>
    );
}

export default UserRoleUpdateDialog;