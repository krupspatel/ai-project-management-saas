'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  async function createTask() {
    if (!newTaskTitle.trim()) {
      return;
    }

    try {
      setCreatingTask(true);

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle,
          projectId: 'cmsri99od00016szcgbyktjd4',
          status: 'TODO',
          priority: 'MEDIUM',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask: Task = await response.json();

      setTasks((currentTasks) => [newTask, ...currentTasks]);

      setNewTaskTitle('');
      setDialogOpen(false);

      window.dispatchEvent(new Event('tasks-updated'));
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setCreatingTask(false);
    }
  }

  async function updateTaskStatus(taskId: string, status: string) {
    try {
      setUpdatingTask(taskId);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask: Task = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );
      window.dispatchEvent(new Event('tasks-updated'));
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setUpdatingTask(null);
    }
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>Add Task</DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <input
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="Task title"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />

              <Button
                onClick={createTask}
                disabled={creatingTask || !newTaskTitle.trim()}
              >
                {creatingTask ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          );

          return (
            <div
              key={column.title}
              className="rounded-xl border bg-muted/30 p-4"
            >
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
                      className="rounded-lg border bg-background p-3"
                    >
                      <div className="text-sm font-medium">{task.title}</div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        {task.project.name}
                      </div>

                      <div className="mt-2 text-xs text-muted-foreground">
                        Priority: {task.priority}
                      </div>

                      <select
                        value={task.status}
                        disabled={updatingTask === task.id}
                        onChange={(event) =>
                          updateTaskStatus(task.id, event.target.value)
                        }
                        className="mt-3 w-full rounded-md border bg-background px-2 py-1 text-xs"
                      >
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Done</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
