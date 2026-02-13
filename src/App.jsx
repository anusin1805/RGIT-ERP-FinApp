import { Switch, Route, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

// --- PAGE IMPORTS ---
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Finance from "@/pages/Finance";     // ✅ Added
import Labor from "@/pages/Labor";         // ✅ Added
import Materials from "@/pages/Materials"; // ✅ Added
import QC from "@/pages/QC";               // ✅ Added

// 1. The Security Guard
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

  return <Component />;
}

// 2. The Router (Now with all pages!)
function Router() {
  return (
    <Switch>
      {/* Public Route */}
      <Route path="/auth" component={Login} />

      {/* Protected Routes */}
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/finance">
        <ProtectedRoute component={Finance} />
      </Route>

      <Route path="/labor">
        <ProtectedRoute component={Labor} />
      </Route>

      <Route path="/materials">
        <ProtectedRoute component={Materials} />
      </Route>

      <Route path="/qc">
        <ProtectedRoute component={QC} />
      </Route>

      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

// 3. Main App
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
