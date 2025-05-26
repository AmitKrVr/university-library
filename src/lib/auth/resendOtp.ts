import { requestOTP } from "./requestOtp";
import { deleteOtp } from "../otp";

export const resendOTP = async (email: string, fullName: string) => {
    try {
        await deleteOtp(email)
        const result = await requestOTP(email, fullName);
        if (result.success) return { success: true };
        return { success: false, error: "Failed to resend OTP" };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return { success: false, error: "Unexpected error occurred" };
    }
};