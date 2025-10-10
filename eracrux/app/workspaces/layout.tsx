// layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard-components/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <SidebarProvider style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar user={session.user} />
        <main className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-0.5 border-b bg-background shadow-sm">
            <SidebarTrigger />
            {/* <h1 className="font-semibold text-lg">CruxAI (Beta)</h1> */}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
