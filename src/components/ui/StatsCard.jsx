import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {(trend || description) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {/* 1. Safely Render Trend (Handles both String "+12%" and Object {value:12, isPositive:true}) */}
            {trend && (
              <span className={cn(
                "font-medium",
                // If it's an object and positive, OR a string with '+', make it green. Else red.
                (typeof trend === 'object' && trend.isPositive) || 
                (typeof trend === 'string' && trend.includes("+")) 
                  ? "text-green-500" 
                  : "text-red-500"
              )}>
                {typeof trend === 'object' 
                  ? `${trend.isPositive ? '+' : ''}${trend.value}%` 
                  : trend}
              </span>
            )}

            {/* 2. Render Description */}
            {description && <span>{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
