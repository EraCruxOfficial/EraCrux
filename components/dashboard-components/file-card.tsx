"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileChartLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface FileCardProps {
  id: string
  filename: string
  createdAt: string
  fileSize?: number
}

export function FileCard({ id, filename, createdAt, fileSize }: FileCardProps) {
  const router = useRouter()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3">
        <FileChartLine className="h-6 w-6 text-primary" />
        <div className="truncate">
          <CardTitle>{filename}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Uploaded: {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          File ID: <span className="font-mono text-foreground">{id}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Size: {(fileSize ? fileSize / 1024 : 0).toFixed(1)} KB
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-3 w-full"
          onClick={() => router.push(`/workspaces/dashboard/${id}`)}
        >
          View Data
        </Button>
      </CardContent>
    </Card>
  )
}
