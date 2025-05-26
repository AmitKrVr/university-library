import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface OtpInputFieldProps {
    email: string;
    fullName: string
    onComplete: (otp: string) => Promise<void>;
    loading?: boolean;
    onResend?: (email: string, fullName: string) => Promise<void>;
}

const OtpInputField = ({ email, fullName, onComplete, loading = false, onResend }: OtpInputFieldProps) => {
    const OTP_DIGITS = 6;

    const [otpValues, setOtpValues] = useState(new Array(OTP_DIGITS).fill(""));
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const inputRefs = useRef(new Array(OTP_DIGITS).fill(null));

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleInputChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;

        const newValue = value.trim().slice(-1);
        const updatedOtp = [...otpValues];
        updatedOtp[index] = newValue;
        setOtpValues(updatedOtp);

        if (newValue && index < OTP_DIGITS - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < otpValues.length - 1) {
            inputRefs.current[index + 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            const prevInput = inputRefs.current[index - 1];
            requestAnimationFrame(() => {
                prevInput.focus();
                prevInput.setSelectionRange(
                    prevInput.value.length,
                    prevInput.value.length
                );
            });
        }
    };

    const handlePasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text").slice(0, OTP_DIGITS);
        if (!/^\d+$/.test(pastedText)) return;

        const newArr = pastedText.split("");
        setOtpValues([
            ...newArr,
            ...new Array(OTP_DIGITS - newArr.length).fill(""),
        ]);

        inputRefs.current[Math.min(pastedText.length, OTP_DIGITS - 1)]?.focus();
    };

    const handleManualSubmit = async () => {
        const otp = otpValues.join("");

        if (otp.length === OTP_DIGITS) {
            await onComplete(otp);
        }
    };

    const startCountdown = () => {
        setResendDisabled(true);
        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };


    useEffect(() => {
        startCountdown()
    }, [email]);

    const handleResendOTP = async () => {
        if (!onResend || !email) return;

        try {
            startCountdown();
            setOtpValues(new Array(OTP_DIGITS).fill(""))
            await onResend(email, fullName)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setResendDisabled(false);
            setCountdown(0);
        }
    };

    const isComplete = otpValues.every(digit => digit !== "");

    return (
        <div
            role="group"
            aria-labelledby="otpGroup"
            className="flex flex-col items-center">
            <h2 id="otpGroup" className="sr-only">
                One-Time Password Input
            </h2>

            <div className="flex space-x-4">
                {otpValues.map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        value={otpValues[index]}
                        ref={(el) => (inputRefs.current[index] = el)}
                        maxLength={1} // Restrict input to 1 digit
                        onChange={(e) =>
                            handleInputChange(e.target.value, index)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePasteEvent}
                        // pattern="\d*"
                        aria-label={`OTP digit ${index + 1}`}
                        aria-describedby="otp-instructions"
                        className="h-10 text-xl text-light-100 w-10 text-center border rounded-md focus:outline-primary"
                    />
                ))}
            </div>

            <Button
                disabled={!isComplete || loading}
                onClick={handleManualSubmit}
                className="mt-7 mb-1 px-4 py-1 w-1/3 text-sm font-medium bg-primary text-black h-10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                    </>
                ) : (
                    "Verify OTP"
                )}
            </Button>

            <p className=" flex items-center">
                Don&apos;t receive the OTP?
                <Button
                    disabled={resendDisabled}
                    onClick={handleResendOTP}
                    variant="link"
                    className="-ml-2"
                >
                    {resendDisabled
                        ? `Resend OTP in ${countdown}`
                        : "Resend OTP"}
                </Button>
            </p>
        </div>
    );
}
export default OtpInputField