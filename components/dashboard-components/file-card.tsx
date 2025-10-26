"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileChartLine } from "lucide-react"
import {IconFileTypeCsv} from "@tabler/icons-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { DropdownMenuDialog } from "../ui/delete-dropdown-menu"

interface FileCardProps {
  id: string
  filename: string
  createdAt: string
  fileSize?: number
}

export function FileCard({ id, filename, createdAt, fileSize }: FileCardProps) {
  const router = useRouter()

  // 🔁 Function to refresh the page (re-fetch server data)
  const refreshFiles = () => {
    router.refresh() // This revalidates the current route in Next.js App Router
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        {/* Left section: icon + filename + date */}
        <div className="flex items-center gap-3 min-w-0">
          <IconFileTypeCsv className="h-6 w-6 text-primary shrink-0" />
          <div className="truncate">
            <CardTitle className="truncate">{filename}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">
              Uploaded: {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ✅ Pass refresh function so UI updates after delete */}
        <DropdownMenuDialog fileId={id} onDeleteSuccess={refreshFiles} />
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
