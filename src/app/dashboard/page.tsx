import { DashboardShell } from '@/components/layout/dashboard-shell';
import { StatsCards } from '@/features/dashboard/components/stats-cards';
import { RecentProjects } from '@/features/dashboard/components/recent-projects';
import { TaskBoard } from '@/features/dashboard/components/task-board';
import { AIPlanner } from '@/features/ai-assistant/components/ai-planner';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back 👋</h1>

          <p className="text-muted-foreground">
            Manage your projects smarter with AI.
          </p>
        </div>

        <StatsCards />
        <RecentProjects />
        <TaskBoard />
        <AIPlanner />
      </div>
    </DashboardShell>
  );
}
