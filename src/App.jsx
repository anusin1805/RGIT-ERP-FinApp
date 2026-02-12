import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import React from "react";
// import { Toaster } from "@/components/ui/toaster"; // <-- DISABLED to prevent crash
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard"; // Ensure this path is correct for your project
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// 1. Simple Error Boundary to catch the crash
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-500">
          <h1 className="text-2xl font-bold">Something crashed!</h1>
          <pre className="mt-4 bg-gray-100 p-4 rounded text-sm text-black">
            {this.state.error.toString()}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => window.location.href = '/'}
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 2. Protected Route Wrapper
function ProtectedRoute({ component: Component }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // If not logged in, redirect to login
    window.location.href = "/auth/login";
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth/login" component={Login} />
      {/* Protect the home route */}
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router />
        {/* <Toaster />  <-- KEEP THIS COMMENTED OUT */}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
