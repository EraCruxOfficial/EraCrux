// app/workspaces/dashboard/[id]/page.tsx
import Dashboard from "./dashboard";

interface Props {
  params: Promise<{ id: string }>; // Promise in Next.js 15
}

export default async function DashboardPage({ params }: Props) {
  const { id } = await params; // Await the params
  return <Dashboard id={id} />;
}