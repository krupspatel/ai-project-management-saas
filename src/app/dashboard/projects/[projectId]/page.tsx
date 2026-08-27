'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`);

        if (!response.ok) {
          throw new Error('Project not found');
        }

        const data: Project = await response.json();

        setProject(data);
        setEditName(data.name);
        setEditDescription(data.description || '');
        setEditStatus(data.status);
      } catch (error) {
        console.error('Failed to load project:', error);
        setError('Unable to load project.');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

  function openEditDialog() {
    if (!project) return;

    setEditName(project.name);
    setEditDescription(project.description || '');
    setEditStatus(project.status);
    setEditOpen(true);
  }

  async function saveProject() {
    if (!editName.trim()) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
          status: editStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject: Project = await response.json();

      setProject(updatedProject);
      setEditOpen(false);

      window.dispatchEvent(new Event('project-updated'));
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="p-6">Loading project...</div>
      </DashboardShell>
    );
  }

  if (error || !project) {
    return (
      <DashboardShell>
        <div className="space-y-4 p-6">
          <p className="text-destructive">{error || 'Project not found'}</p>

          <Button onClick={() => router.push('/dashboard/projects')}>
            ← Back to Projects
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/projects')}
        >
          ← Back to Projects
        </Button>

        <div className="rounded-xl border bg-background p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>

              <p className="mt-2 text-muted-foreground">
                {project.description || 'No description available.'}
              </p>
            </div>

            <Badge>{project.status}</Badge>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>

              <span className="text-sm font-medium">{project.progress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="mt-1 font-medium">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="mt-1 font-medium">
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={openEditDialog}>
              Edit Project
            </Button>

            <Button variant="destructive">Delete Project</Button>
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Tasks</h2>
              <p className="text-sm text-muted-foreground">
                Tasks for this project will appear here.
              </p>
            </div>

            <Button>+ Add Task</Button>
          </div>
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>

                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  placeholder="Project name"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>

                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  placeholder="Project description"
                  rows={4}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>

                <select
                  value={editStatus}
                  onChange={(event) => setEditStatus(event.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  onClick={saveProject}
                  disabled={saving || !editName.trim()}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
