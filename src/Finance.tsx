import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFinancialRecords, useFinancialStats, useCreateFinancialRecord } from "@/hooks/use-financial";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFinancialRecordSchema, type InsertFinancialRecord } from "@shared/schema";
import { IndianRupee, PieChart as PieIcon, TrendingUp, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";
import { format } from "date-fns";

// For Recharts
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

export default function Finance() {
  const { data: stats } = useFinancialStats();
  const { data: records } = useFinancialRecords();
  const createMutation = useCreateFinancialRecord();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertFinancialRecord>({
    resolver: zodResolver(insertFinancialRecordSchema),
    defaultValues: {
      type: "expense",
      status: "pending",
      metadata: "{}"
    }
  });

  const onSubmit = (data: InsertFinancialRecord) => {
    // Ensure amount is integer
    createMutation.mutate({ ...data, amount: parseInt(data.amount.toString()) }, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  const pieData = stats ? [
    { name: 'Recovered', value: stats.totalRecovered },
    { name: 'Remaining', value: stats.totalAdvance - stats.totalRecovered }
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Sidebar />
      <div className="md:pl-64 pb-12">
        <Header title="Financial Hub" />
        
        <main className="px-6 py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Total Advance"
              value={`₹${((stats?.totalAdvance || 0) / 10000000).toFixed(2)} Cr`}
              description="Initial Disbursement"
              icon={IndianRupee}
            />
            <StatsCard
              title="Interest Accrued"
              value={`₹${((stats?.interestAccrued || 0) / 100000).toFixed(2)} L`}
              description="At 10% p.a. Simple Interest"
              icon={TrendingUp}
              className="border-l-4 border-l-red-500"
            />
            <StatsCard
              title="BG Exposure"
              value={`₹${((stats?.bgExposure || 0) / 10000000).toFixed(2)} Cr`}
              description="Active Bank Guarantees"
              icon={PieIcon}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="dashboard-card h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Add Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Financial Record</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select 
                              onValueChange={(val) => form.setValue("type", val)}
                              defaultValue={form.getValues("type")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="advance">Advance</SelectItem>
                                <SelectItem value="ra_bill">RA Bill</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="bg">Bank Guarantee</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Amount (₹)</Label>
                            <Input 
                              type="number" 
                              {...form.register("amount", { valueAsNumber: true })} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input {...form.register("description")} />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select 
                            onValueChange={(val) => form.setValue("status", val)}
                            defaultValue="pending"
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                          {createMutation.isPending ? "Saving..." : "Save Record"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records?.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.date ? format(new Date(record.date), 'dd MMM yyyy') : '-'}
                          </TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell className="capitalize">{record.type?.replace('_', ' ')}</TableCell>
                          <TableCell className="text-right font-mono">
                            ₹{record.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className={
                              record.status === 'paid' ? 'text-green-600 font-medium' :
                              record.status === 'pending' ? 'text-amber-600' : 
                              'text-slate-600'
                            }>
                              {record.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="dashboard-card h-full">
                <CardHeader>
                  <CardTitle>Advance Recovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ReTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Recovered</span>
                      </div>
                      <span className="font-semibold">₹{stats?.totalRecovered.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Remaining</span>
                      </div>
                      <span className="font-semibold">₹{((stats?.totalAdvance || 0) - (stats?.totalRecovered || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
