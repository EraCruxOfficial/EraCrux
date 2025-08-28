import Dashboard from "./dashboard";

interface Props {
  params: { id: string };
}

export default async function DashboardPage({ params }: Props) {
  const resolvedParams = await params;
  return <Dashboard id={resolvedParams.id} />;
}
