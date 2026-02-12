import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";

// --- Placeholder Pages (So links don't crash) ---
// You can replace these with real components later
const FinancialHub = () => (
  <div className="p-8 md:pl-72 pt-20">
    <h1 className="text-2xl font-bold">Financial Hub</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

const LaborForce = () => (
  <div className="p-8 md:pl-72 pt-20">
    <h1 className="text-2xl font-bold">Labor Force Management</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

const Materials = () => (
  <div className="p-8 md:pl-72 pt-20">
    <h1 className="text-2xl font-bold">Materials Inventory</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

const QualityControl = () => (
  <div className="p-8 md:pl-72 pt-20">
    <h1 className="text-2xl font-bold">Quality Control</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

// --- Main App Component ---
function Router() {
  return (
    <Switch>
      {/* Auth Route */}
      <Route path="/auth/login" component={Login} />
      
      {/* Main Routes */}
      <Route path="/" component={Dashboard} />
      <Route path="/finance" component={FinancialHub} />
      <Route path="/labor" component={LaborForce} />
      <Route path="/materials" component={Materials} />
      <Route path="/quality" component={QualityControl} />
      
      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
