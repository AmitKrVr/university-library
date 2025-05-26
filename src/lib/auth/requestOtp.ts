import { sendOTPEmail, storeOTP } from "../otp";

export const requestOTP = async (email: string, fullName: string) => {

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await storeOTP(email, otp);
    await sendOTPEmail(email, otp, fullName);

    return { success: true, message: "OTP sent to email", data: { email } };
};