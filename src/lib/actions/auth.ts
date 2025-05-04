"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export const signInWithCrendentials = async (params: Pick<AuthCrendentials, "email" | "password">) => {
    const { email, password } = params;

    try {
        const result = await signIn("credentials", {
            email, password, redirect: false
        })

        if (result?.error) {
            return { success: false, error: result.error }
        }

        return { success: true };
    } catch (error) {
        console.log(error, "Signin error");
        return { success: false, error: "Signin error" };
    }
}

export const signUP = async (params: AuthCrendentials) => {
    const { fullName, email, universityId, password, universityCard } = params;

    // Check if the user already exists
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            universityId,
            password: hashedPassword,
            universityCard,
        });

        // await signInWithCrendentials({email, password});

        return { success: true };
    } catch (error) {
        console.log(error, "Signup error")
        return { success: false, error: "Signup error" }
    }
};

