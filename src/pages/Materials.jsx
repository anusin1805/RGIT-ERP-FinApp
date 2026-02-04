import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useMaterials, useCreateMaterial, useCreateMaterialTransaction } from "@/hooks/use-materials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMaterialSchema} from "@shared/schema";
import { Package, Truck, Leaf, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Materials() {
  const { data} = useMaterials();
  const createMutation = useCreateMaterial();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertMaterialSchema),
    defaultValues: {
      stock: 0,
      minLevel: 10,
      grihaCompliant: false
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
        <Header title="Material Inventory & GRIHA" />
        
        <main className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Inventory Status</h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <Truck className="mr-2 h-4 w-4" /> New Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Material</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Material Name</Label>
                    <Input {...form.register("name")} placeholder="e.g. Cement PPC 43 Grade" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select onValueChange={(val) => form.setValue("category", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cement">Cement</SelectItem>
                          <SelectItem value="steel">Steel</SelectItem>
                          <SelectItem value="aggregate">Aggregate</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input {...form.register("unit")} placeholder="e.g. Bags, MT" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="griha" 
                      onCheckedChange={(checked) => form.setValue("grihaCompliant", checked)} 
                    />
                    <Label htmlFor="griha" className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      GRIHA 3-Star Compliant
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add to Inventory"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {materials?.map((item) => (
              <Card key={item.id} className="dashboard-card overflow-hidden">
                <CardHeader className="pb-3 bg-slate-50/50 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                    </div>
                    {item.grihaCompliant && (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 flex gap-1">
                        <Leaf className="h-3 w-3" /> GRIHA
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-3xl font-bold text-slate-900">{item.stock}</span>
                      <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                    </div>
                    {item.stock < (item.minLevel || 0) && (
                      <Badge variant="destructive" className="flex gap-1 animate-pulse">
                        <AlertCircle className="h-3 w-3" /> Low Stock
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current Level</span>
                      <span>Min: {item.minLevel} {item.unit}</span>
                    </div>
                    <Progress 
                      value={(item.stock / (item.minLevel! * 2)) * 100} 
                      className={`h-2 ${item.stock < item.minLevel! ? 'bg-red-100' : 'bg-slate-100'}`}
                    />
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Add Stock</Button>
                    <Button variant="outline" size="sm" className="flex-1">Issue</Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {!materials?.length && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed rounded-xl">
                <Package className="h-12 w-12 mb-4 opacity-50" />
                <p>No materials tracked yet. Add items to inventory.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
