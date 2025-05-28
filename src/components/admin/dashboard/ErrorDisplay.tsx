import { CircleHelp } from "lucide-react";

const ErrorDisplay = ({ message, className = "" }: { message: string; className?: string }) => (
    <div className={`flex flex-col items-center justify-center gap-5 py-10 ${className}`}>
        <CircleHelp height={80} width={80} className="text-red-500" />
        <div className="text-center space-y-1">
            <p className="text-base font-semibold text-red-500">⚠️ {message}</p>
        </div>
    </div>
)
export default ErrorDisplay