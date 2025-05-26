"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { requestOTP } from "../auth/requestOtp";

export const signInWithCrendentials = async (params: Pick<AuthCrendentials, "email" | "password">) => {
    const { email, password } = params;

    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect("/too-fast");

    try {
        const result = await signIn("credentials", {
            email, password, redirect: false
        })

        if (result?.error) {
            return { success: false, error: result.error }
        }

        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return { success: false, error: "Signin error" };
    }
}

export const signUP = async (params: AuthCrendentials) => {
    const { email, fullName } = params;

    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect("/too-fast");

    // Check if the user already exists
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        return { success: false, error: "User already exists" };
    }

    const result = await requestOTP(email, fullName);

    if (result.success) {
        return {
            success: true,
        }
    }

    return {
        success: false,
        error: "Unable to send OTP, Please try again later"
    }
};

