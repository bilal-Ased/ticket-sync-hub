import { motion } from "framer-motion";
import { Ticket, Building2, Clock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "import",
    message: "Imported 245 tickets from Acme Corp",
    time: "2 minutes ago",
    icon: Ticket,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    id: 2,
    type: "company",
    message: "New company added: TechStart Inc",
    time: "15 minutes ago",
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
    type: "email",
    message: "Weekly report sent to stakeholders",
    time: "3 hours ago",
    icon: Mail,
    iconBg: "bg-muted text-muted-foreground",
  },
  {
    id: 5,
    type: "import",
    message: "Imported 89 tickets from Beta Corp",
    time: "5 hours ago",
    icon: Ticket,
    iconBg: "bg-primary/10 text-primary",
  },
];

export const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-elevated p-5"
    >
      <h3 className="text-base font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            className="flex items-start gap-3"
          >
            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0", activity.iconBg)}>
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