import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import { Toaster } from "@/components/ui/AppToaster"; 

import Dashboard from "@/pages/Dashboard";
import Finance from "@/pages/Finance";
import Labor from "@/pages/Labor";
import Materials from "@/pages/Materials";
import QC from "@/pages/QC";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/finance" component={() => <ProtectedRoute component={Finance} />} />
      <Route path="/labor" component={() => <ProtectedRoute component={Labor} />} />
      <Route path="/materials" component={() => <ProtectedRoute component={Materials} />} />
      <Route path="/qc" component={() => <ProtectedRoute component={QC} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        
        {/* FIX 2: Render the Toaster component */}
        <Toaster />

        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
