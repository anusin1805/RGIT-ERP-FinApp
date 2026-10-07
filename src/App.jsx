import { Switch, Route, Redirect, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { 
  Loader2, 
  Home, 
  IndianRupee, 
  Users, 
  Package, 
  ShieldCheck, 
  Settings as SettingsIcon 
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// --- PAGE IMPORTS ---
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Finance from "@/pages/Finance";
import Labor from "@/pages/Labor";
import Materials from "@/pages/Materials";
import QC from "@/pages/QC";
import Settings from "@/pages/Settings";

// --- BOTTOM NAVIGATION ---
export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50">
      <Link href="/" className="flex flex-col items-center text-slate-500 hover:text-primary">
        <Home className="h-5 w-5" />
        <span className="text-xs">Home</span>
      </Link>

      <Link href="/finance" className="flex flex-col items-center text-slate-500 hover:text-primary">
        <IndianRupee className="h-5 w-5" />
        <span className="text-xs">Finance</span>
      </Link>

      <Link href="/labor" className="flex flex-col items-center text-slate-500 hover:text-primary">
        <Users className="h-5 w-5" />
        <span className="text-xs">Labor</span>
      </Link>

      <Link href="/materials" className="flex flex-col items-center text-slate-500 hover:text-primary">
        <Package className="h-5 w-5" />
        <span className="text-xs">Materials</span>
      </Link>

      <Link href="/qc" className="flex flex-col items-center text-slate-500 hover:text-primary">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-xs">QC</span>
      </Link>

      <Link href="/settings" className="flex flex-col items-center text-slate-500 hover:text-primary">
        <SettingsIcon className="h-5 w-5" />
        <span className="text-xs">Settings</span>
      </Link>
    </nav>
  );
}

// --- LAYOUT WRAPPER ---
function AppLayout({ children }) {
  return (
    <div className="pb-20 min-h-screen bg-slate-50">
      {children}
      <BottomNav />
    </div>
  );
}

// --- PROTECTED ROUTE GUARD ---
function ProtectedRoute({ component: Component }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

// --- ROUTER ---
function Router() {
  return (
    <Switch>
      {/* Public Route */}
      <Route path="/auth" component={Login} />

      {/* Protected Routes */}
      <Route path="/">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/finance">{() => <ProtectedRoute component={Finance} />}</Route>
      <Route path="/labor">{() => <ProtectedRoute component={Labor} />}</Route>
      <Route path="/materials">{() => <ProtectedRoute component={Materials} />}</Route>
      <Route path="/qc">{() => <ProtectedRoute component={QC} />}</Route>
      <Route path="/settings">{() => <ProtectedRoute component={Settings} />}</Route>

      {/* Fallback 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// --- MAIN APP ENTRY ---
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
