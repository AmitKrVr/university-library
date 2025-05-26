'use server'

import redis from "@/database/redis";
import { resend } from "./email";
import SignupOtpEmail from "@/email/SignupOtpEmail";

export const storeOTP = async (email: string, otp: string) => {
    await redis.set(`otp:${email.toLowerCase()}`, otp, { ex: 300 }); // 5 mins
};

export const verifyStoredOTP = async (email: string, inputOTP: string) => {
    const storedOTP = await redis.get(`otp:${email.toLowerCase()}`);
    return String(storedOTP) === String(inputOTP);
};

export async function deleteOtp(email: string) {
    await redis.del(`otp:${email.toLowerCase()}`);
}

export const sendOTPEmail = async (email: string, otp: string, fullName: string) => {
    await resend.emails.send({
        from: 'BookWise <contact@devamit.info>',
        to: [email],
        subject: 'Your BookWise signup OTP code',
        react: SignupOtpEmail({
            fullName: fullName,
            otp: otp,
        }),
    });
};

