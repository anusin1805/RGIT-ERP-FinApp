import { Switch, Route, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
// FIXED: Lowercase 'toaster' matches your filename
import { Toaster } from "@/components/ui/toaster"; 
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import { Loader2 } from "lucide-react";

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

  // If NOT logged in -> Go to Login
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // If logged in -> Show Page
  return <Component />;
}

// 2. The Router
function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Login} />

      {/* Protected Dashboard Route */}
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

// 3. Main App Component
function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
