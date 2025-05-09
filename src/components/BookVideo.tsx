"use client"

import config from "@/lib/config";
import { ImageKitProvider, Video } from "@imagekit/next";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
    return (
        <ImageKitProvider urlEndpoint={config.env.imageKit.urlEndpoint}>
            <Video
                src={videoUrl}
                controls
                className="w-full rounded-xl"
            />
        </ImageKitProvider>
    )
}
export default BookVideo;