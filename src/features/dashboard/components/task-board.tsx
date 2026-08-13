'use client';

import { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  projectId: string;
  project: {
    id: string;
    name: string;
  };
};

const columns = [
  {
    title: 'Todo',
    status: 'TODO',
  },
  {
    title: 'In Progress',
    status: 'IN_PROGRESS',
  },
  {
    title: 'Done',
    status: 'COMPLETED',
  },
];

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks');

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data: Task[] = await response.json();

        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status,
        );

        return (
          <div key={column.title} className="rounded-xl border bg-muted/30 p-4">
            <h3 className="mb-4 font-semibold">
              {column.title} ({columnTasks.length})
            </h3>

            <div className="space-y-3">
              {columnTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks</p>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border bg-background p-3 text-sm"
                  >
                    <div className="font-medium">{task.title}</div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {task.project.name}
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      Priority: {task.priority}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
