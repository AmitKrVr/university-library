"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { changeUserRoleAction } from "@/lib/admin/actions/changeUserRole";
import { Button } from "../ui/button";

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

    const handleRoleChange = async (newRole: "USER" | "ADMIN", setDialogOpen: (open: boolean) => void) => {
        if (isChangingRole) return;

        setIsChangingRole(true);

        try {
            await changeUserRoleAction(user.id, newRole);

            toast.success(`Role successfully changed to ${newRole}`, {
                description: `User ${user.email || user.id} is now a ${newRole}`,
            });
            router.refresh();
        } catch (error) {
            toast.error("Failed to change role", {
                description: "An error occurred while updating the user role.",
            });
            console.error("Role change error:", error);
        } finally {
            setIsChangingRole(false);
            setDialogOpen(false);
        }
    };

    return (
        <>
            <AlertDialog
                open={openUserDialog}
                onOpenChange={(open) => {
                    if (isChangingRole) return;
                    setOpenUserDialog(open);
                }}
            >
                <AlertDialogTrigger asChild>
                    <button
                        disabled={user.role === "USER"}
                        className="bg-pink-100 text-pink-600 rounded-full px-2 text-sm font-medium py-1 transition-colors hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setOpenUserDialog(true)}
                    >
                        User
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change role to User?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        Are you sure you want to change the role of this user to &quot;User&quot;?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isChangingRole}>Cancel</AlertDialogCancel>
                        <button
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary-admin px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={(e) => {
                                e.preventDefault();
                                handleRoleChange("USER", setOpenUserDialog);
                            }}
                            disabled={isChangingRole}
                        >
                            {isChangingRole ? "Updating..." : "Confirm"}
                        </button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={openAdminDialog}
                onOpenChange={(open) => {
                    if (isChangingRole) return;
                    setOpenAdminDialog(open);
                }}
            >
                <AlertDialogTrigger asChild>
                    <button
                        disabled={user.role === "ADMIN"}
                        className="bg-green-100 text-green-600 rounded-full px-2 text-sm font-medium py-1 transition-colors hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setOpenAdminDialog(true)}
                    >
                        Admin
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change role to Admin?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        Are you sure you want to change the role of this user to &quot;Admin&quot;?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isChangingRole}>Cancel</AlertDialogCancel>
                        <Button
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary-admin hover:bg-primary-admin px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={(e) => {
                                e.preventDefault();
                                handleRoleChange("ADMIN", setOpenAdminDialog);
                            }}
                            disabled={isChangingRole}
                        >
                            {isChangingRole ? "Updating..." : "Confirm"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default UserRoleUpdateDialog;