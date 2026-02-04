import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useLaborRecords, useCreateLaborRecord, useLaborCompliance } from "@/hooks/use-labor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLaborRecordSchema, type InsertLaborRecord } from "@shared/schema";
import { Users, HardHat, Hammer, Briefcase } from "lucide-react";
import { format } from "date-fns";

export default function Labor() {
  const { data: labor } = useLaborRecords();
  const { data: compliance } = useLaborCompliance();
  const createMutation = useCreateLaborRecord();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertLaborRecord>({
    resolver: zodResolver(insertLaborRecordSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      source: "market",
      shift: "day"
    }
  });

  const onSubmit = (data: InsertLaborRecord) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  const totalWorkers = labor?.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Sidebar />
      <div className="md:pl-64 pb-12">
        <Header title="Human Capital Hub" />
        
        <main className="px-6 py-8">
          <div className="grid gap-6 sm:grid-cols-4">
            <Card className="dashboard-card bg-blue-600 text-white border-none">
              <CardContent className="p-6">
                <p className="text-blue-100">Total Workforce</p>
                <h3 className="text-3xl font-bold mt-2">{totalWorkers}</h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
                  <Users className="h-4 w-4" />
                  <span>On Site Today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6">
                <p className="text-slate-500">Masons</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-900">
                  {labor?.filter(l => l.category === 'mason').reduce((acc, c) => acc + c.count, 0) || 0}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <Hammer className="h-4 w-4" />
                  <span>Skilled</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dashboard-card">
              <CardContent className="p-6">
                <p className="text-slate-500">Unskilled</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-900">
                  {labor?.filter(l => l.category === 'unskilled').reduce((acc, c) => acc + c.count, 0) || 0}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <HardHat className="h-4 w-4" />
                  <span>Helpers</span>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-6">
                <p className="text-slate-500">Compliance</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-900">100%</h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium">
                  <Briefcase className="h-4 w-4" />
                  <span>Verified</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="attendance" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance Checklist</TabsTrigger>
                </TabsList>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Attendance Record</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Daily Attendance</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" {...form.register("date")} />
                        </div>
                        <div className="space-y-2">
                          <Label>Shift</Label>
                          <Select 
                            onValueChange={(val) => form.setValue("shift", val)}
                            defaultValue="day"
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Day</SelectItem>
                              <SelectItem value="night">Night</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select 
                            onValueChange={(val) => form.setValue("category", val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mason">Mason</SelectItem>
                              <SelectItem value="carpenter">Carpenter</SelectItem>
                              <SelectItem value="bar_bender">Bar Bender</SelectItem>
                              <SelectItem value="unskilled">Unskilled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Count</Label>
                          <Input type="number" {...form.register("count", { valueAsNumber: true })} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Source</Label>
                        <Select 
                          onValueChange={(val) => form.setValue("source", val)}
                          defaultValue="market"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market Labor</SelectItem>
                            <SelectItem value="nbcc">NBCC Workforce</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Submitting..." : "Submit Report"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <TabsContent value="attendance">
                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle>Daily Attendance Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {labor?.map((record) => (
                        <div key={record.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              {record.category === 'mason' ? <Hammer className="h-5 w-5" /> : <HardHat className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium capitalize text-slate-900">{record.category.replace('_', ' ')}</p>
                              <p className="text-sm text-muted-foreground">Source: {record.source} • Shift: {record.shift}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">{record.count}</p>
                            <p className="text-xs text-muted-foreground">Workers</p>
                          </div>
                        </div>
                      ))}
                      {!labor?.length && (
                        <p className="text-center text-muted-foreground py-8">No attendance records for today.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance">
                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle>Contractor Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {compliance?.map((comp) => (
                        <div key={comp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-slate-900">{comp.contractorName}</h4>
                            <p className="text-sm text-muted-foreground">Reg: {comp.epfRegistration}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${comp.safetyChecklist ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              Safety Check
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${comp.welfareFacilities ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              Welfare
                            </span>
                          </div>
                        </div>
                      ))}
                      {!compliance?.length && (
                        <p className="text-center text-muted-foreground py-8">No compliance records found.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
