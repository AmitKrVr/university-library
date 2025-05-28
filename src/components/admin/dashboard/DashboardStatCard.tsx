import Image from "next/image";

interface DashboardStatCardProps {
    title: string;
    count: number;
    trend: string;
    trendValue: number;
}

export const DashboardStatCard = ({ title, count, trend, trendValue }: DashboardStatCardProps) => {
    return (
        <div className="bg-white rounded-md p-5 w-full space-y-2">
            <p className="flex gap-2.5 text-base font-medium text-slate-500">
                {title}
                {trendValue > 0 &&
                    <span className={`flex gap-1 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        <Image
                            alt="trend"
                            src={`/icons/admin/caret-${trend}.svg`}
                            height={10}
                            width={10}
                        />
                        {trendValue}
                    </span>
                }
            </p>
            <p className="text-2xl font-semibold">{count}</p>
        </div>
    )
}
