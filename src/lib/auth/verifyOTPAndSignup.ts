'use server'

import { hash } from "bcryptjs";
import { deleteOtp, verifyStoredOTP } from "../otp";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { workflowClient } from "../workflow";
import config from "../config";
import { signInWithCrendentials } from "../actions/auth";
import redis from "@/database/redis";
import { userCountKey } from "../cacheKeys";

export const verifyOTPAndSignup = async (params: AuthCrendentials & { otp: string }) => {
    const { fullName, email, universityId, password, universityCard, otp } = params;

    try {
        const isValid = await verifyStoredOTP(email, otp);
        if (!isValid) return { success: false, error: "Invalid or expired OTP" };

        const hashedPassword = await hash(password, 10);

        await db.insert(users).values({
            fullName,
            email,
            universityId,
            password: hashedPassword,
            universityCard,
        });

        await deleteOtp(email);
        await redis.del(userCountKey);

        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/workflow`,
            body: { email, fullName }
        });

        await signInWithCrendentials({ email, password });

        return { success: true };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        await deleteOtp(email);
        return { success: false, error: "An error occurred during signup. Please try again." };
    }
};