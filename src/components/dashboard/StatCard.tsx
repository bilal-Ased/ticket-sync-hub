import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
  iconColor?: "primary" | "success" | "warning" | "info";
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon: Icon, 
  delay = 0,
  iconColor = "primary"
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="stat-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center",
          colorClasses[iconColor]
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        {change && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
            changeType === "positive" && "bg-success/10 text-success",
            changeType === "negative" && "bg-destructive/10 text-destructive",
            changeType === "neutral" && "bg-muted text-muted-foreground"
          )}>
            {changeType === "positive" && <TrendingUp className="w-3 h-3" />}
            {changeType === "negative" && <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
};
