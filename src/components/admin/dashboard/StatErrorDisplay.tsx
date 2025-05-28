const StatErrorDisplay = ({ title, message, className = "" }: { title: string; message: string; className?: string }) => (
    <div className={`text-red-500 bg-white rounded-md p-5 w-full space-y-2 border ${className}`}>
        <p className="flex gap-2.5 text-base font-medium text-slate-500">
            {title}
        </p>
        <p className="text-red-500">⚠️ {message}</p>
    </div>
)
export default StatErrorDisplay