import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@/components/ui/Notifications";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Dashboard from "@/pages/Dashboard";
import Finance from "@/pages/Finance";
import Labor from "@/pages/Labor";
import Materials from "@/pages/Materials";
import QC from "@/pages/QC";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Notifications />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
