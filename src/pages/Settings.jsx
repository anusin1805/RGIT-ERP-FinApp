import { Sidebar } from "@/components/layout/Slidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { User, Bell, Moon, Shield } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  // Get initials for avatar
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U';

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Sidebar />
      <div className="md:pl-64 pb-12">
        <Header title="Settings" />
        
        <main className="px-6 py-8 max-w-4xl mx-auto space-y-8">
          
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {user?.role || "Admin"}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue={user?.firstName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue={user?.lastName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={user?.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input defaultValue={user?.id} disabled className="font-mono text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your application appearance and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 space-y-0.5">
                  <Moon className="h-4 w-4 text-slate-500" />
                  <Label className="text-base">Dark Mode</Label>
                </div>
                <Switch disabled aria-label="Toggle dark mode" />
              </div>
              <div className="border-t pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 space-y-0.5">
                  <Bell className="h-4 w-4 text-slate-500" />
                  <Label className="text-base">Email Notifications</Label>
                </div>
                <Switch defaultChecked aria-label="Toggle notifications" />
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-full border">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Google Authentication</p>
                    <p className="text-sm text-muted-foreground">Used for secure login</p>
                  </div>
                </div>
                <Button variant="outline" disabled>Connected</Button>
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  );
}

// Simple Badge component for local use if not imported
function Badge({ children, className, variant }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className} ${variant === 'outline' ? 'text-foreground' : 'bg-primary text-primary-foreground'}`}>
      {children}
    </span>
  );
}
