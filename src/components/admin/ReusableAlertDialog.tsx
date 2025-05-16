import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ReusableAlertDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isLoading?: boolean;
    error?: string | null;
    setError?: (error: string | null) => void;
    icon: string;
    iconBg: string;
    iconBorder: string;
    iconAlt?: string;
    title: string;
    description: string;
    actionText: string;
    onAction: (e: React.MouseEvent) => Promise<void>;
    trigger: React.ReactNode;
    closeIcon?: string;
    actionBtnColor: string;
}

export const ReusableAlertDialog = ({
    open,
    setOpen,
    isLoading = false,
    error,
    setError,
    icon,
    iconAlt = "icon",
    iconBg,
    iconBorder,
    title,
    description,
    actionText,
    onAction,
    trigger,
    closeIcon = "/icons/admin/close.svg",
    actionBtnColor
}: ReusableAlertDialogProps) => {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(newOpen) => {
                if (isLoading) return;
                setOpen(newOpen);
                if (newOpen && setError) setError(null)
            }}
        >
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent className="w-md rounded-xl text-center">
                <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <Image alt="close" src={closeIcon} height={15} width={15} />
                </Button>

                <div
                    className={`mx-auto mb-4 mt-2 size-16 rounded-full ${iconBg} ${iconBorder} flex items-center justify-center`}
                >
                    <Image alt={iconAlt} src={icon} width={20} height={20} />
                </div>

                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-gray-900 text-center">
                        {title}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogDescription className="text-sm text-gray-600 mb-4 px-4">
                    {description}
                </AlertDialogDescription>

                {error && (
                    <div className="mb-4 px-4 py-2 text-sm text-red-700 bg-red-50 rounded-md">
                        Error: {error}
                    </div>
                )}

                <AlertDialogFooter className="flex flex-col gap-2">
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={onAction}
                        className={`${actionBtnColor} text-white font-medium w-full py-2 rounded-lg`}
                    >
                        {isLoading ? "Processing..." : actionText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
