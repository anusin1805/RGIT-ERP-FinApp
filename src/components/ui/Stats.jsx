import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className 
}) {
  return (
    <Card className={cn("dashboard-card overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
        </div>
        
        {(description || trend) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {trend && (
              <span className={cn(
                "flex items-center font-medium",
                // Logic to handle colors for both Objects and Strings
                (typeof trend === 'object' && trend.isPositive) || 
                (typeof trend === 'string' && !trend.includes("-")) 
                  ? "text-green-600" 
                  : "text-red-600"
              )}>
                {/* Logic to render both Objects and Strings safely */}
                {typeof trend === 'object' ? (
                    <>
                        {trend.isPositive ? "+" : ""}{trend.value}%
                    </>
                ) : (
                    trend
                )}
              </span>
            )}
            <span className="text-muted-foreground">{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
