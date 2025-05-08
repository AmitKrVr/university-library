'use client'

import { Image as IKImage, ImageKitAbortError, ImageKitInvalidRequestError, ImageKitProvider, ImageKitServerError, ImageKitUploadNetworkError, upload, Video } from '@imagekit/next'
import config from '@/lib/config'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const { publicKey, urlEndpoint } = config.env.imageKit


interface Props {
    type: "image" | "video";
    accept?: string;
    placeholder: string;
    folder: string;
    variant: "dark" | "light";
    onFileChange: (filePath: string) => void;
    value?: string;
}

const FileUpload = ({ type,
    accept,
    placeholder,
    folder,
    variant,
    onFileChange,
    value, }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<any>(value);

    const [uploading, setUploading] = useState(false);

    const styles = {
        button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border",
        placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-dark-500"
    }

    const authenticator = async () => {
        try {
            const res = await fetch("/api/upload-auth");
            if (!res.ok) {
                const errorText = await res.text();

                throw new Error(
                    `Request failed with status ${res.status}: ${errorText}`,
                );
            }
            const data = await res.json();
            const { signature, expire, token } = data;
            return { token, expire, signature };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`)
        }
    };

    const handleUpload = useCallback(async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files?.length) {
            toast.error("Please select a file");
            return;
        }

        const file = fileInput.files[0];

        const MAX_FILE_SIZE_MB = type === "image" ? 20 : 50;

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.error("File too large", {
                description: `Upload files less than ${MAX_FILE_SIZE_MB}MB`,
            });
            return;
        }


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

        const { signature, expire, token } = auth;;

        try {
            const res = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                folder: folder,
                fileName: file.name,
                useUniqueFileName: true,
                onProgress: (e) => {
                    const percent = Math.floor((e.loaded / e.total) * 100);
                    setProgress(percent);
                },
                abortSignal: abortController.signal,
            });


            setFile(res);
            onFileChange(res.filePath);

            toast.success(`${type} uploaded successfully ✅`, {
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
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }, [type, fileInputRef, folder, onFileChange]);

    return (
        <div className="flex flex-col gap-2">
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                <>
                    <input
                        type="file"
                        accept={accept}
                        ref={fileInputRef}
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />

                    <button
                        className={cn("upload-btn cursor-pointer", styles.button)}
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

                        <p className={cn("text-base", styles.placeholder)}>
                            {uploading ? "Uploading..." : placeholder}
                        </p>

                        {file && (
                            <p className={cn("upload-filename truncate max-w-52", styles.text)}>{file.filePath}</p>
                        )}
                    </button>
                </>

                {progress > 0 && progress !== 100 && (
                    <div className="w-full rounded-full bg-green-200">
                        <div className="progress" style={{ width: `${progress}%` }}>
                            {progress}%
                        </div>
                    </div>
                )}

                {file && (
                    (type === "image" ? (
                        <IKImage
                            src={file.url}
                            width={500}
                            height={500}
                            alt="Picture of the author"
                            className="w-full h-auto rounded border mt-4"
                        />
                    ) : (type === "video" ? (
                        <Video
                            src={file.url}
                            controls
                            width={500}
                            height={500}
                            className="h-96 w-full rounded-xl"
                        />
                    ) : null))
                )}
            </ImageKitProvider>
        </div>
    )
}

export default FileUpload
