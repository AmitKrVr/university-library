'use client'

import { Image as IKImage, ImageKitAbortError, ImageKitInvalidRequestError, ImageKitProvider, ImageKitServerError, ImageKitUploadNetworkError, upload } from '@imagekit/next'
import config from '@/lib/config'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const { publicKey, urlEndpoint } = config.env.imageKit

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();

    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const authenticator = async () => {
        const res = await fetch("/api/upload-auth");
        if (!res.ok) throw new Error("Auth failed");
        return await res.json();
    };

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files?.length) {
            toast.error("Please select a file");
            return;
        }

        const file = fileInput.files[0];

        let auth;
        try {
            setUploading(true);
            auth = await authenticator();
        } catch (err) {
            console.error("Auth Error", err);
            toast.error("Failed to authenticate upload request")
            setUploading(false);
            return;
        }

        try {
            const res = await upload({
                ...auth,
                file,
                fileName: file.name,
                onProgress: (e) => setProgress((e.loaded / e.total) * 100),
                abortSignal: abortController.signal,
                publicKey,
            });

            setPreviewUrl(res.url);
            onFileChange(res.url);
            setProgress(100);

            toast.success("Image uploaded successfully ✅", {
                description: `${res.url}`,
            });
        } catch (err) {
            if (err instanceof ImageKitAbortError) {
                toast.error("Upload aborted: " + err.reason)
            } else if (err instanceof ImageKitInvalidRequestError) {
                toast.error("Invalid request: " + err.message)
            } else if (err instanceof ImageKitUploadNetworkError) {
                toast.error("Network error: " + err.message)
            } else if (err instanceof ImageKitServerError) {
                toast.error("Server error: " + err.message)
            } else {
                toast.error("Unexpected error occurred during upload")
            }
        } finally {
            setUploading(false);
            fileInputRef.current!.value = "";
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                <>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />

                    <button
                        className={cn("upload-btn bg-dark-300")}
                        onClick={(e) => {
                            e.preventDefault();
                            if (fileInputRef.current) {
                                fileInputRef.current.click();
                            }
                        }}
                    >
                        <Image
                            src="/icons/upload.svg"
                            alt="upload-icon"
                            width={20}
                            height={20}
                            className="object-contain"
                        />

                        <p className={cn("text-base text-slate-500")}>Select a File</p>
                    </button>
                </>


                {progress > 0 && (
                    <progress className="w-full h-1.5" value={progress} max={100}></progress>
                )}

                {previewUrl && (
                    <IKImage
                        src={previewUrl}
                        width={500}
                        height={500}
                        alt="Picture of the author"
                        className="w-full h-auto rounded border mt-4"
                    />
                )}
            </ImageKitProvider>
        </div>
    )
}

export default ImageUpload
