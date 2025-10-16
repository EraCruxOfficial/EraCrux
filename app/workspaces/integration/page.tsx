"use client";

import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/kibo-ui/dropzone";
import {
  UploadIcon,
  DatabaseIcon,
  FileSpreadsheetIcon,
  FileInputIcon,
  FacebookIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function IntegrationPage() {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleDrop = async (files: File[]) => {
    if (!files?.length) return;
    const formData = new FormData();
    formData.append("file", files[0]);
    const id = toast.loading("Uploading file...");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }
      toast.success("File uploaded! Redirecting...", { id });
      router.push(`/workspaces/dashboard/${data.id}`);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed", { id });
      console.error(err);
    }
  };

  const handleIntegration = (service: string) => {
    setUploadStatus(`🔗 Connecting to ${service}...`);
    setTimeout(() => {
      router.push(`/workspaces/integrations/${service.toLowerCase().replace(" ", "-")}`);
    }, 1000);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 p-6">
      <h1 className="text-2xl font-semibold text-center">Connect Your Data Source</h1>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Upload your data or connect directly to popular platforms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-6">
        {/* CSV Upload Card — spans full width (3 columns) */}
        <Card className="md:col-span-3 border-dashed border-2 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5 text-primary" /> CSV Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dropzone onDrop={handleDrop} onError={console.error} src={files}>
              <DropzoneEmptyState>
                <div className="flex flex-col items-center justify-center gap-3 p-6 md:p-10 text-center  border-muted rounded-lg">
                  <div className="flex items-center justify-center size-16 rounded-lg bg-muted text-muted-foreground">
                    <UploadIcon size={24} />
                  </div>
                  <p className="font-medium text-sm">Upload a CSV file</p>
                  <p className="text-muted-foreground text-xs">
                    Drag and drop or click to upload
                  </p>
                </div>
              </DropzoneEmptyState>
              <DropzoneContent />
            </Dropzone>
          </CardContent>
        </Card>

        {/* Other Integrations Below */}
        {[
          {
            title: "Google Sheets",
            icon: <FileSpreadsheetIcon className="w-5 h-5 text-green-500" />,
            onClick: () => handleIntegration("Google Sheets"),
          },
          {
            title: "Microsoft Excel",
            icon: <FileInputIcon className="w-5 h-5 text-green-700" />,
            onClick: () => handleIntegration("Microsoft Excel"),
          },
          {
            title: "MySQL",
            icon: <DatabaseIcon className="w-5 h-5 text-blue-600" />,
            onClick: () => handleIntegration("MySQL"),
          },
          {
            title: "Facebook Marketplace",
            icon: <FacebookIcon className="w-5 h-5 text-blue-500" />,
            onClick: () => handleIntegration("Facebook Marketplace"),
          },
        ].map(({ title, icon, onClick }) => (
          <Card key={title} className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {icon} {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
              <p className="text-xs mb-2">Coming soon...</p>
              {/* <Button variant={"secondary"} onClick={()=>{}}>Request Integration</Button> */}
            </CardContent>
          </Card>
        ))}

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="w-5 h-5 text-gray-500" /> Other Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-xs mb-2">Coming soon...</p>
            <Link href="https://forms.gle/a6oih3a1p7LZp5w38" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">Request Integration</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
