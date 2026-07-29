import { FolderKanban, CheckSquare, Sparkles, Users } from 'lucide-react';

const stats = [
  {
    title: 'Total Projects',
    value: '24',
    icon: FolderKanban,
  },
  {
    title: 'Active Tasks',
    value: '12',
    icon: CheckSquare,
  },
  {
    title: 'AI Insights',
    value: '86%',
    icon: Sparkles,
  },
  {
    title: 'Team Members',
    value: '8',
    icon: Users,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{stat.title}</p>

            <stat.icon size={20} />
          </div>

          <h3 className="mt-4 text-3xl font-bold">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
