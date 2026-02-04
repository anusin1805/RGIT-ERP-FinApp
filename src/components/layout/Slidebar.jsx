import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  IndianRupee, 
  Users, 
  Package, 
  ClipboardCheck, 
  Settings,
  HardHat,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Financial Hub", href: "/finance", icon: IndianRupee },
    { name: "Labor Force", href: "/labor", icon: Users },
    { name: "Materials", href: "/materials", icon: Package },
    { name: "Quality Control", href: "/qc", icon: ClipboardCheck },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-slate-50/50 backdrop-blur-xl md:flex dark:bg-slate-900/50">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <HardHat className="h-6 w-6" />
          <span>Infra-Link</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "nav-item cursor-pointer",
                  location === item.href && "active"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <Link href="/settings">
          <div className={cn("nav-item cursor-pointer mb-2", location === "/settings" && "active")}>
            <Settings className="h-5 w-5" />
            Settings
          </div>
        </Link>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
