'use client';

import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/kibo-ui/dropzone';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';

export default function IntegrationPage() {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleDrop = async (files: File[]) => {
    setFiles(files);

    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          setUploadStatus(`✅ File uploaded: ${data.filePath}`);
        } else {
          setUploadStatus(`❌ Error: ${data.error}`);
        }
      } catch (err) {
        setUploadStatus("❌ Upload failed");
        console.error(err);
      }
    }
  };

  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 p-4'>
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

      {uploadStatus && (
        <p className="text-sm text-muted-foreground">{uploadStatus}</p>
      )}
    </div>
  );
}
