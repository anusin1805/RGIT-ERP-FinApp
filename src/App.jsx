import { Switch, Route, Redirect } from "wouter"; // Using wouter as per your project
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/Toaster"; // Ensure Capital 'T'
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import { Loader2 } from "lucide-react";

// 1. Create a ProtectedRoute Component
function ProtectedRoute({ component: Component }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no user, KICK THEM OUT to the login page
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Otherwise, let them in
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* 2. Public Route (Login) */}
      <Route path="/auth" component={Login} />

      {/* 3. Protected Route (Dashboard) */}
      {/* If user visits '/', check if they are logged in first */}
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      {/* Catch-all for 404s */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
