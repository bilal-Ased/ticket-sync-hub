import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Plus, 
  Clock, 
  Play,
  Pause,
  Trash2,
  Edit,
  Calendar,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CronJob {
  id: number;
  name: string;
  company: string;
  schedule: string;
  scheduleHuman: string;
  isActive: boolean;
  lastRun: string;
  nextRun: string;
}

const mockCronJobs: CronJob[] = [
  { id: 1, name: "Acme Daily Import", company: "Acme Corp", schedule: "0 9 * * *", scheduleHuman: "Every day at 9:00 AM", isActive: true, lastRun: "Today, 9:00 AM", nextRun: "Tomorrow, 9:00 AM" },
  { id: 2, name: "TechStart Hourly Sync", company: "TechStart Inc", schedule: "0 * * * *", scheduleHuman: "Every hour", isActive: true, lastRun: "1 hour ago", nextRun: "In 1 hour" },
  { id: 3, name: "GlobalTech Weekly Batch", company: "GlobalTech", schedule: "0 6 * * 1", scheduleHuman: "Every Monday at 6:00 AM", isActive: false, lastRun: "6 days ago", nextRun: "Paused" },
  { id: 4, name: "Beta Corp Nightly", company: "Beta Corp", schedule: "0 0 * * *", scheduleHuman: "Every day at midnight", isActive: true, lastRun: "Today, 12:00 AM", nextRun: "Tomorrow, 12:00 AM" },
];

export const CronJobs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Header 
        title="Cron Jobs" 
        subtitle="Schedule automatic ticket imports"
      />

      {/* Add Cron Job Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Cron Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Cron Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Job Name</Label>
                <Input placeholder="e.g., Daily Import for Acme" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corp</SelectItem>
                    <SelectItem value="techstart">TechStart Inc</SelectItem>
                    <SelectItem value="globaltech">GlobalTech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="daily">Every day at 9:00 AM</SelectItem>
                    <SelectItem value="weekly">Every Monday at 9:00 AM</SelectItem>
                    <SelectItem value="custom">Custom (cron expression)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cron Jobs List */}
      <div className="space-y-4">
        {mockCronJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={cn(
              "bg-card rounded-xl border border-border p-5 group transition-all duration-300",
              !job.isActive && "opacity-60"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  job.isActive ? "bg-primary/10" : "bg-muted"
                )}>
                  <Clock className={cn("w-5 h-5", job.isActive ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{job.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{job.company}</span>
                    <span className="text-muted-foreground">•</span>
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{job.scheduleHuman}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Last run</p>
                  <p className="text-sm text-foreground">{job.lastRun}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Next run</p>
                  <p className="text-sm text-foreground">{job.nextRun}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={job.isActive} />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {job.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
