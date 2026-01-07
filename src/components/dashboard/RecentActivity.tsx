import { motion } from "framer-motion";
import { Ticket, Building2, Clock, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-soft p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Recent Activity</h3>
          <p className="text-[13px] text-muted-foreground">Latest updates from your team</p>
        </div>
        <button className="text-[13px] text-primary font-medium hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 * index }}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors -mx-2.5"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", activity.iconBg)}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-foreground leading-relaxed">{activity.message}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};