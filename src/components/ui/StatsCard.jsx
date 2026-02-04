import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("dashboard-card overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        
        {(description || trend) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {trend && (
              <span className={cn(
                "flex items-center font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            <span className="text-muted-foreground">{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
