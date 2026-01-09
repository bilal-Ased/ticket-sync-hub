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
    color: "text-primary bg-primary/10",
  },
  {
    id: 2,
    type: "company",
    message: "New company added: TechStart Inc",
    time: "15 min ago",
    icon: Building2,
    color: "text-success bg-success/10",
  },
  {
    id: 3,
    type: "cron",
    message: "Scheduled import completed for GlobalTech",
    time: "1 hour ago",
    icon: Clock,
    color: "text-warning bg-warning/10",
  },
  {
    id: 4,
    type: "resolved",
    message: "12 tickets marked as resolved",
    time: "2 hours ago",
    icon: CheckCircle2,
    color: "text-success bg-success/10",
  },
  {
    id: 5,
    type: "email",
    message: "Weekly report sent to stakeholders",
    time: "3 hours ago",
    icon: Mail,
    color: "text-info bg-info/10",
  },
];

export const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-surface p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your team</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-primary">
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
            className="flex items-start gap-3 p-3 -mx-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              activity.color
            )}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
