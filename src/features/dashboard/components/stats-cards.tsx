'use client';

import { useEffect, useState } from 'react';
import { FolderKanban, CheckSquare, Sparkles, Users } from 'lucide-react';

type Stats = {
  totalProjects: number;
  activeTasks: number;
  teamMembers: number;
};

const statsConfig = [
  {
    title: 'Total Projects',
    key: 'totalProjects',
    icon: FolderKanban,
  },
  {
    title: 'Active Tasks',
    key: 'activeTasks',
    icon: CheckSquare,
  },
  {
    title: 'AI Insights',
    value: 'Coming Soon',
    icon: Sparkles,
  },
  {
    title: 'Team Members',
    key: 'teamMembers',
    icon: Users,
  },
];

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeTasks: 0,
    teamMembers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data: Stats = await response.json();

        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;

        const value =
          'value' in stat
            ? stat.value
            : loading
              ? '...'
              : stats[stat.key as keyof Stats];

        return (
          <div key={stat.title} className="rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.title}</p>

              <Icon size={20} />
            </div>

            <h3 className="mt-4 text-3xl font-bold">{value}</h3>
          </div>
        );
      })}
    </div>
  );
}
