import { useState } from "react";
import { Sidebar } from "@/components/layout/Slidebar";
import { Header } from "@/components/layout/Header";
import { useQcForms, useCreateQcForm } from "@/hooks/use-project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQcFormSchema} from "@shared/schema";
import { ClipboardCheck, MapPin, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function QC() {
  const { data } = useQcForms();
  const createMutation = useCreateQcForm();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertQcFormSchema),
    defaultValues: {
      status: "pending",
      data: "{}"
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Sidebar />
      <div className="md:pl-64 pb-12">
        <Header title="Quality Control & Inspection" />
        
        <main className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Inspection Reports</h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <ClipboardCheck className="mr-2 h-4 w-4" /> New Inspection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Inspection Report</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inspection Type</Label>
                      <Select onValueChange={(val) => form.setValue("type", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rcc">RCC Work</SelectItem>
                          <SelectItem value="plaster">Plastering</SelectItem>
                          <SelectItem value="flooring">Flooring</SelectItem>
                          <SelectItem value="waterproofing">Waterproofing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Location / Block</Label>
                      <Input {...form.register("location")} placeholder="e.g. Block A, 2nd Floor" />
                    </div>
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
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Textarea {...form.register("remarks")} placeholder="Observations and comments..." />
                  </div>

                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Submit Report"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {qcForms?.map((form) => (
              <Card key={form.id} className="dashboard-card hover:border-primary/50 cursor-pointer">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      form.status === 'approved' ? 'bg-green-100 text-green-600' :
                      form.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {form.status === 'approved' ? <CheckCircle className="h-6 w-6" /> :
                       form.status === 'rejected' ? <XCircle className="h-6 w-6" /> :
                       <Clock className="h-6 w-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 capitalize">{form.type.replace('_', ' ')} Inspection</h4>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {form.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {form.date ? format(new Date(form.date), 'dd MMM yyyy') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={
                      form.status === 'approved' ? 'default' :
                      form.status === 'rejected' ? 'destructive' : 'secondary'
                    } className="mb-2 uppercase">
                      {form.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {form.remarks || "No remarks"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {!qcForms?.length && (
              <div className="text-center py-12 text-slate-400">
                <ClipboardCheck className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>No inspection reports generated yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
