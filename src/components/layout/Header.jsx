import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-white/50 px-6 backdrop-blur-md md:pl-72 dark:bg-slate-950/50">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
      
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800">
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3 border-l pl-4 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
              {user?.firstName || user?.username || "Engineer"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Project Manager</p>
          </div>
          <Avatar>
            <AvatarImage src={user?.profileImageUrl || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.username?.substring(0, 2).toUpperCase() || "EN"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
