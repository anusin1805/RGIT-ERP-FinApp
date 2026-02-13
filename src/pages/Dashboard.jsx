import { Sidebar as AppSidebar } from "@/components/layout/Slidebar"; // FIX 1: Import the layout sidebar as AppSidebar
import { Header } from "@/components/layout/Header";
// import { Sidebar } from "@/components/ui/Sidebar"; // REMOVE: You don't need the UI sidebar directly here if AppSidebar wraps it
import { StatsCard } from "@/components/ui/StatsCard";
import { useFinancialStats } from "@/hooks/use-financial";
import { useMilestones } from "@/hooks/use-project";
import { cn } from "@/lib/utils"; 
import { 
  IndianRupee, 
  Users, 
  AlertTriangle, 
  Activity,
  CalendarCheck
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  // FIX 2: Rename 'data' to 'stats' here so it matches your JSX usage
  const { data: stats } = useFinancialStats(); 
  
  const { data: milestones } = useMilestones();

  // Mock data for charts
  const progressData = [
    { month: 'Jan', progress: 10, planned: 15 },
    { month: 'Feb', progress: 25, planned: 28 },
    { month: 'Mar', progress: 40, planned: 45 },
    { month: 'Apr', progress: 55, planned: 58 },
    { month: 'May', progress: 68, planned: 70 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex"> 
      {/* FIX 3: Use AppSidebar (the one with the menu items) */}
      <AppSidebar />
      
      {/* FIX 4: Adjust layout. Using 'flex' above helps sidebars behave better */}
      <div className="flex-1 md:pl-64 pb-12">
        <Header title="Project Dashboard" />
        
        <main className="px-6 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatsCard
              title="Total Advance"
              // Usage matches the variable name 'stats' now
              value={`₹${((stats?.totalAdvance || 0) / 10000000).toFixed(2)} Cr`}
              description="Mobilization Advance"
              icon={IndianRupee}
              className="border-l-4 border-l-blue-500"
            />
            <StatsCard
              title="Active Workforce"
              value="245"
              description="Daily Average"
              icon={Users}
              trend="+12%"
              className="border-l-4 border-l-green-500"
            />
            {/* ... rest of your cards ... */}
            <StatsCard
              title="Pending Issues"
              value="3"
              description="Requires Attention"
              icon={AlertTriangle}
              className="border-l-4 border-l-amber-500"
            />
            <StatsCard
              title="Project Progress"
              value="68%"
              description="Ahead of Schedule"
              icon={Activity}
              className="border-l-4 border-l-purple-500"
            />
          </motion.div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
             {/* ... Chart and Milestones section (Looks correct) ... */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="dashboard-card h-[400px]">
                <CardHeader>
                  <CardTitle>S-Curve Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} name="Planned" />
                        <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={3} name="Actual" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="dashboard-card h-[400px]">
                <CardHeader>
                  <CardTitle>Upcoming Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {milestones?.slice(0, 4).map((milestone, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold",
                          milestone.status === 'completed' 
                            ? "border-green-500 text-green-600 bg-green-50" 
                            : "border-slate-200 text-slate-500"
                        )}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{milestone.name}</h4>
                          <p className="text-sm text-muted-foreground">Due: {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                            milestone.status === 'completed' ? "bg-green-100 text-green-700" :
                            milestone.status === 'delayed' ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {milestone.status?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {!milestones?.length && (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <CalendarCheck className="h-10 w-10 opacity-20" />
                        <p className="mt-2">No upcoming milestones</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
