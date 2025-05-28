import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SectionCardProps {
    title: string;
    viewAllHref: string;
    error?: boolean;
    children: React.ReactNode;
    className?: string
}

const SectionCard: React.FC<SectionCardProps> = ({
    title,
    viewAllHref,
    error = false,
    children,
    className,
}) => {
    return (
        <section
            className={`
                relative bg-white rounded-md p-4 overflow-hidden space-y-3.5 
                ${error ? "border border-red-500" : ""} 
                ${className}`
            }
        >
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{title}</h2>
                <Button asChild>
                    <Link href={viewAllHref} className="view-btn !bg-light-300 !hover:bg-light-300/80">
                        View All
                    </Link>
                </Button>
            </div>
            {children}
        </section>
    );
};

export default SectionCard;
