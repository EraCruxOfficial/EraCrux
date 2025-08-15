'use client';

// import { Dropzone } from "@/components/ui/kibo-ui/dropzone"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/kibo-ui/dropzone';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';

export default function IntegrationPage() {
    const [files, setFiles] = useState<File[] | undefined>();

    const handleDrop = (files: File[]) => {
        console.log(files);
        setFiles(files);
    };
    return (
        <div className='flex w-full flex-col items-center justify-center gap-4 p-4 '>
            <Dropzone onDrop={handleDrop} onError={console.error} src={files}>
                <DropzoneEmptyState>
                    <div className="flex w-full items-center gap-4 p-8">
                        <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <UploadIcon size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-sm">Upload a file</p>
                            <p className="text-muted-foreground text-xs">
                                Drag and drop or click to upload
                            </p>
                        </div>
                    </div>
                </DropzoneEmptyState>
                <DropzoneContent />
            </Dropzone>
            {/* Additional content for the upload page can be added here */}
        </div>
    )
}