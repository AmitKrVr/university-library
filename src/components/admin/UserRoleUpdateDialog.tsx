"use client";

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { changeUserRoleAction } from "@/lib/admin/actions/changeUserRole";
import { Button } from "../ui/button";
import Image from "next/image";

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
    const [error, seterror] = useState(null)

    const handleRoleChange = async (newRole: "USER" | "ADMIN", setDialogOpen: (open: boolean) => void) => {
        if (isChangingRole) return;

        setIsChangingRole(true);

        try {
            await changeUserRoleAction(user.id, newRole);

            toast.success(`Role successfully changed to ${newRole}`, {
                description: `User ${user.email || user.id} is now a ${newRole}`,
            });
            router.refresh();
        } catch (err) {
            seterror(err)
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

                <AlertDialogContent className="w-md rounded-xl text-center">
                    <Button variant="ghost"
                        onClick={() => setOpenUserDialog(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <Image
                            alt="close"
                            src="/icons/admin/close.svg"
                            height={15}
                            width={15}
                        />
                    </Button>

                    <div className="mx-auto mb-4 mt-2 size-16 rounded-full bg-pink-400 border-[10px] border-pink-100 flex items-center justify-center">
                        <Image
                            alt="warning"
                            src="/icons/admin/circle-help.svg"
                            width={20}
                            height={20} />
                    </div>

                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900 text-center">
                            Change User Role
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    <AlertDialogDescription className="text-sm text-gray-600 mb-4 px-4">
                        You are about to change this user to a regular user role. This will remove their admin privileges and notify them about the change.
                    </AlertDialogDescription>

                    {error && (
                        <div className="mb-4 px-4 text-sm text-red-700 bg-red-50 rounded-md">
                            Error: {error}
                        </div>
                    )}

                    <AlertDialogFooter className="flex flex-col gap-2">
                        <AlertDialogAction
                            disabled={isChangingRole}
                            onClick={(e) => {
                                e.preventDefault();
                                handleRoleChange("USER", setOpenUserDialog);
                            }}
                            className="bg-pink-400 hover:bg-pink-500/70 text-white font-medium w-full py-2 rounded-lg"
                        >
                            {isChangingRole ? "Updating..." : "Remove Admin Access"}
                        </AlertDialogAction>
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

                <AlertDialogContent className="w-md rounded-xl text-center">
                    <Button variant="ghost"
                        onClick={() => setOpenAdminDialog(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <Image
                            alt="close"
                            src="/icons/admin/close.svg"
                            height={15}
                            width={15}
                        />
                    </Button>

                    <div className="mx-auto mb-4 mt-2 size-16 rounded-full bg-green-400 border-[10px] border-green-100 flex items-center justify-center">
                        <Image
                            alt="warning"
                            src="/icons/admin/circle-help.svg"
                            width={20}
                            height={20} />
                    </div>

                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900 text-center">
                            Change Admin Role
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    <AlertDialogDescription className="text-sm text-gray-600 mb-4 px-4">
                        You are about to grant this user administrative privileges. This will give them full access to manage users, books, and system settings. They will be notified about this change.
                    </AlertDialogDescription>

                    {error && (
                        <div className="mb-4 px-4 text-sm text-red-700 bg-red-50 rounded-md">
                            Error: {error}
                        </div>
                    )}

                    <AlertDialogFooter className="flex flex-col gap-2">
                        <AlertDialogAction
                            disabled={isChangingRole}
                            onClick={(e) => {
                                e.preventDefault();
                                handleRoleChange("ADMIN", setOpenAdminDialog);
                            }}
                            className="bg-green-400 hover:bg-green-400/90 text-white font-medium w-full py-2 rounded-lg"
                        >
                            {isChangingRole ? "Updating..." : "Grant Admin Access"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default UserRoleUpdateDialog;