// "use client"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, FileText, LayoutDashboard, MessageSquare } from "lucide-react"
import { Logout } from "@/components/dashboard-components/logout"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className=" bg-background text-foreground p-4 sm:p-6 lg:p-8">
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

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="w-full sm:w-auto">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            New Dashboard
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>

        <Separator />

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Chats */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="hover:underline cursor-pointer">Dashboard Creation Guide</li>
                <li className="hover:underline cursor-pointer">Website Content Performance Analysis</li>
                <li className="hover:underline cursor-pointer">Website Analytics Report Request</li>
                <li className="hover:underline cursor-pointer">New Chat</li>
              </ul>
            </CardContent>
          </Card>

          {/* Dashboards */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="hover:underline cursor-pointer">Untitled Dashboard</li>
                <li className="hover:underline cursor-pointer">New Dashboard</li>
              </ul>
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Button variant="ghost" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* <div>
          <Logout />
        </div> */}
      </div>
    </div>
  )
}
