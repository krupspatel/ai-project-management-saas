import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Sparkles,
  BarChart3,
  Settings,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    icon: FolderKanban,
  },
  {
    title: 'Tasks',
    icon: CheckSquare,
  },
  {
    title: 'AI Assistant',
    icon: Sparkles,
  },
  {
    title: 'Analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 border-r bg-background md:block">
      <div className="p-6">
        <h1 className="text-xl font-bold">AI Project AI</h1>
      </div>

      <nav className="space-y-2 px-4">
        {menuItems.map((item) => (
          <button
            key={item.title}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
          >
            <item.icon size={18} />
            {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}
