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

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean, errro?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
    type, schema, defaultValues, onSubmit
}: Props<T>) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

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
                toast.success("Success", {
                    description: isSignIn
                        ? "You have Successfully signed in."
                        : "You have successfully signed up."
                })
                router.push("/");
            } else {
                toast.error(`Error ${isSignIn ? "signing in" : "signing up"}`, {
                    description: result.errro ?? `An error occurred during ${isSignIn ? "signing in" : "signing up"}`
                })
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false)
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
        </div>
    )
}
export default AuthForm;