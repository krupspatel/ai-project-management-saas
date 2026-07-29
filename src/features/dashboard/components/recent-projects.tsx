import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const projects = [
  {
    name: 'AI CRM Platform',
    status: 'In Progress',
    progress: '65%',
  },
  {
    name: 'Trading Dashboard',
    status: 'Completed',
    progress: '100%',
  },
  {
    name: 'Healthcare SaaS',
    status: 'Review',
    progress: '80%',
  },
];

export function RecentProjects() {
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
          {projects.map((project) => (
            <TableRow key={project.name}>
              <TableCell className="font-medium">{project.name}</TableCell>

              <TableCell>
                <Badge>{project.status}</Badge>
              </TableCell>

              <TableCell>{project.progress}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
