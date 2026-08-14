'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Project = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  progress: number;
};

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProjects();

    window.addEventListener('tasks-updated', fetchProjects);
    window.addEventListener('project-created', fetchProjects);

    return () => {
      window.removeEventListener('tasks-updated', fetchProjects);
      window.removeEventListener('project-created', fetchProjects);
    };
  }, []);

  return (
    <div className="rounded-xl border">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Recent Projects</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>Loading projects...</TableCell>
            </TableRow>
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>No projects found.</TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>

                <TableCell>
                  <Badge>{project.status}</Badge>
                </TableCell>

                <TableCell>{project.progress}%</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
