const columns = [
  {
    title: 'Todo',
    tasks: ['Setup authentication', 'Create landing page'],
  },
  {
    title: 'In Progress',
    tasks: ['Build API integration', 'Database schema'],
  },
  {
    title: 'Done',
    tasks: ['Dashboard UI', 'Project setup'],
  },
];

export function TaskBoard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <div key={column.title} className="rounded-xl border bg-muted/30 p-4">
          <h3 className="mb-4 font-semibold">{column.title}</h3>

          <div className="space-y-3">
            {column.tasks.map((task) => (
              <div
                key={task}
                className="rounded-lg border bg-background p-3 text-sm"
              >
                {task}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
