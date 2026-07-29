import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <h1 className="text-3xl font-bold">Welcome back 👋</h1>

      <p className="mt-2 text-muted-foreground">
        Manage your projects with AI.
      </p>
    </DashboardShell>
  );
}
