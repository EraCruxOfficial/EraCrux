import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileChartLine, Plus } from "lucide-react"
import { FileCard } from "@/components/dashboard-components/file-card"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  // ✅ Fetch user files securely
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/fetchCsv/list`, {
    headers: Object.fromEntries(await headers()),
    cache: "no-store",
  })

  const data = await res.json()
  const files = data?.files || []

  return (
    <div className="bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {(() => {
              const hour = new Date().getHours()
              if (hour < 12) return "Good morning"
              if (hour < 18) return "Good afternoon"
              return "Good evening"
            })()}, {session.user.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back to {session.user.name}&apos;s Workspace
          </p>
        </div>

        <Separator />

        {/* Uploaded Files */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Uploaded CSV Files</h2>

          {files.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p>No files uploaded yet</p>
              <Link href="/workspaces/integration" passHref>
              
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Upload a new CSV
              </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file: any) => (
                <FileCard
                  key={file.id}
                  id={file.id}
                  filename={file.filename}
                  createdAt={file.createdAt}
                  fileSize={file.fileSize}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
