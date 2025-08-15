import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard-components/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <SidebarProvider style={{ fontFamily: 'Inter, sans-serif' }}>
      <AppSidebar user={session.user} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}