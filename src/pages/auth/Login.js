import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { HardHat } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Login() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

 const handleLogin = () => {
  // This now hits the Google Auth route we just set up
  window.location.href = "/api/login";
};

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-slate-200 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <HardHat className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 text-center">
            RGIPT Infra-Link
          </h1>
          <p className="text-slate-500 text-center mt-2">
            Resource Management System
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          >
            Login with gmail
          </Button>
          
          <p className="text-xs text-center text-slate-400 mt-6">
            Authorized Personnel Only • Secure Access
          </p>
        </div>
      </div>
    </div>
  );
}
