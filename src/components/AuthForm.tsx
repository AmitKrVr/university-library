"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { ZodType } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import OtpInputField from "./OtpInputField";
import { verifyOTPAndSignup } from "@/lib/auth/verifyOTPAndSignup";
import { resendOTP } from "@/lib/auth/resendOtp";
import Image from "next/image";

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean, error?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
    type, schema, defaultValues, onSubmit
}: Props<T>) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [otpDialogOpen, setOtpDialogOpen] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [formData, setFormData] = useState<T | null>(null)

    const isSignIn = type === "SIGN_IN"

    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>
    })

    const handleSubmit: SubmitHandler<T> = async (data) => {
        setLoading(true)

        try {
            const result = await onSubmit(data);
            if (result.success) {
                if (isSignIn) {
                    toast.success("Success", {
                        description: "You have Successfully signed in."
                    })
                    router.push("/");
                    return
                }
                setFormData(data)
                setUserEmail((data).email)
                setOtpDialogOpen(true);
                toast.success("Success", {
                    description: "OTP sent to your email. Please verify to complete signup."
                })
            } else {
                toast.error(`Error ${isSignIn ? "signing in" : "signing up"}`, {
                    description: result.error ?? `An error occurred during ${isSignIn ? "signing in" : "signing up"}`
                })
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false)
        }
    }

    const handleOtpVerification = async (otp: string) => {
        if (!formData || !userEmail) return;

        setOtpLoading(true)

        try {
            const result = await verifyOTPAndSignup({
                ...formData as any,
                otp
            });

            if (result.success) {
                toast.success("Account created successfully!");
                setOtpDialogOpen(false);
                router.push("/");
            } else {
                toast.error("OTP verification failed", {
                    description: result.error
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("An error occurred during verification");
        } finally {
            setOtpLoading(false)
        }
    }

    const handleOtpResend = async (email: string, fullName: string) => {
        if (!email) return;
        try {
            const result = await resendOTP(email, fullName);
            if (result.success) {
                toast.success("OTP Resent", {
                    description: "A new verification code has been sent to your email"
                })
            } else {
                toast.error("Error", {
                    description: result.error
                })
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("OTP Resend Failed", {
                description: "Failed to send verification code. Please try again later."
            })
        }
    }


    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
            </h1>

            <p className="text-light-100">
                {isSignIn ? "Access the vast collection of resources, and stay updated" : "Please complete all fields and upload a valid university ID to gain access to the library"}
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">

                    {Object.keys(defaultValues).map((field) => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<T>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">
                                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                        {field.name === "universityCard" ? (
                                            <FileUpload
                                                type="image"
                                                accept="image/*"
                                                placeholder="Upload your ID"
                                                folder="ids"
                                                variant="dark"
                                                onFileChange={field.onChange} />
                                        ) : (
                                            <Input
                                                required
                                                type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                {...field}
                                                className="form-input min-h-12"
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button type="submit" disabled={loading} className="form-btn">
                        {loading ? (
                            <>
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                {isSignIn ? "Signing in..." : "Signing up..."}
                            </>
                        ) : (
                            isSignIn ? "Sign In" : "Sign Up"
                        )}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-base font-medium">
                {isSignIn ? "New to BookWise? " : "Already have an account? "}

                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-primary">{isSignIn ? "Create an account" : "Sign in"}</Link>
            </p>


            <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    className="pattern w-lg text-light-100 border-light-500"
                >
                    <DialogHeader>
                        <div
                            className={`mx-auto size-16 bg-primary border-[10px] border-light-800 rounded-full flex items-center justify-center`}
                        >
                            <Image alt="icon" src="/icons/mailbox.svg" width={30} height={30} />
                        </div>

                        <DialogTitle className="text-2xl text-center text-light-100">Verify Your Email</DialogTitle>
                        <DialogDescription className="text-center">
                            <p>We have send a verification code to <span className="text-primary">{userEmail}</span>.</p>
                            <p>Please check your inbox and input the code below to activate your account</p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 mt-3">
                        <OtpInputField
                            email={userEmail}
                            fullName={formData ? formData.fullName : "User"}
                            onComplete={handleOtpVerification}
                            loading={otpLoading}
                            onResend={handleOtpResend}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
export default AuthForm;