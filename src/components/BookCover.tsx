"use client"

import { cn } from "@/lib/utils";
import BookCoverSvg from "./BookCoverSVG";
import { buildSrc, Image as IKImage } from "@imagekit/next";
import config from "@/lib/config";
import { useState } from "react";

type BookCoverVriant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVriant, string> = {
    extraSmall: 'book-cover_extra_small',
    small: 'book-cover_small',
    medium: 'book-cover_medium',
    regular: 'book-cover_regular',
    wide: 'book-cover_wide',
}

interface Props {
    className?: string;
    variant?: BookCoverVriant;
    coverColor: string;
    coverImage: string;
}

const BookCover = ({ className,
    variant = "regular",
    coverColor = "#012B48",
    coverImage = "https://placehold.co/400x600.png" }: Props) => {
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    return (
        <div
            className={cn(
                "relative transition-all duration-300",
                variantStyles[variant],
                className
            )}
        >
            <BookCoverSvg coverColor={coverColor} />

            <div className="absolute z-10" style={{ left: '12%', width: "87.5%", height: "88%" }}>
                <IKImage
                    urlEndpoint={config.env.imageKit.urlEndpoint}
                    fill
                    sizes={
                        variant === "extraSmall"
                            ? "29px"
                            : variant === "small"
                                ? "55px"
                                : variant === "medium"
                                    ? "144px"
                                    : variant === "regular"
                                        ? "(max-width: 640px) 114px, 174px"
                                        : "(max-width: 640px) 256px, 296px"
                    }
                    src={coverImage}
                    alt="Book cover"
                    loading="lazy"
                    style={showPlaceholder ? {
                        backgroundImage: `url(${buildSrc({
                            urlEndpoint: config.env.imageKit.urlEndpoint,
                            src: coverImage,
                            transformation: [
                                {
                                    quality: 10,
                                    blur: 90,
                                }
                            ]
                        })})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    } : {}}
                    onLoad={() => {
                        setShowPlaceholder(false);
                    }}
                    className="rounded-sm object-fill"
                />
            </div>
        </div>
    )
}
export default BookCover