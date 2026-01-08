import { motion } from "framer-motion";
import { Ticket, Building2, Clock, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const activities = [
  {
    id: 1,
    type: "import",
    message: "Imported 245 tickets from Acme Corp",
    time: "2 min ago",
    icon: Ticket,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    id: 2,
    type: "company",
    message: "New company added: TechStart Inc",
    time: "15 min ago",
    icon: Building2,
    iconBg: "bg-success/10 text-success",
  },
  {
    id: 3,
    type: "cron",
    message: "Scheduled import completed for GlobalTech",
    time: "1 hour ago",
    icon: Clock,
    iconBg: "bg-warning/10 text-warning",
  },
  {
    id: 4,
    type: "resolved",
    message: "12 tickets marked as resolved",
    time: "2 hours ago",
    icon: CheckCircle2,
    iconBg: "bg-success/10 text-success",
  },
  {
    id: 5,
    type: "email",
    message: "Weekly report sent to stakeholders",
    time: "3 hours ago",
    icon: Mail,
    iconBg: "bg-muted text-muted-foreground",
  },
];

export const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Latest updates from your team</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1.5">
          View all
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-accent/50 transition-colors -mx-3 cursor-pointer group"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
              activity.iconBg
            )}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed font-medium">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
