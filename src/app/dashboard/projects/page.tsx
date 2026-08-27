'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { CreateProject } from '@/features/dashboard/components/create-project';

type Project = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  progress: number;
  createdAt: string;
};

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    try {
      const response = await fetch('/api/projects');

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data: Project[] = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleProjectCreated = () => {
      fetchProjects();
    };

    queueMicrotask(() => {
      fetchProjects();
    });

    window.addEventListener('project-created', handleProjectCreated);

    return () => {
      window.removeEventListener('project-created', handleProjectCreated);
    };
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your projects.
            </p>
          </div>

          <CreateProject />
        </div>

        {loading ? (
          <div className="rounded-xl border p-8 text-center">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h2 className="text-lg font-semibold">No projects yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="rounded-xl border bg-background p-6 text-left transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{project.name}</h2>

                  <Badge>{project.status}</Badge>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {project.description || 'No description'}
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>

                    <span className="font-medium">{project.progress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="mt-5 text-xs text-muted-foreground">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
