import Image from "next/image"

interface EmptyStateProps {
    imageSrc: string
    imageAlt: string
    title: string
    description: string
    className?: string
}

const EmptyState = ({
    imageSrc,
    imageAlt,
    title,
    description,
    className = ""
}: EmptyStateProps) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-5 py-10 ${className}`}>
            <Image
                alt={imageAlt}
                src={imageSrc}
                height={144}
                width={190}
            />
            <div className="text-center space-y-1">
                <p className="text-base font-semibold">{title}</p>
                <p className="text-sm font-normal text-slate-500">{description}</p>
            </div>
        </div>
    )
}
export default EmptyState