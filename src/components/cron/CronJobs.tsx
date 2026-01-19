import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  Building2,
  Loader2,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useScheduledReports, 
  useCreateScheduledReport, 
  useDeleteScheduledReport, 
  useToggleScheduledReport,
  useExecuteScheduledReport
} from "@/hooks/useApi";
import { useCompanies } from "@/hooks/useApi";
import { ScheduledReportCreate } from "@/lib/api";
import { format, formatDistanceToNow } from "date-fns";

const SCHEDULE_PRESETS = [
  { value: "hourly", label: "Every hour", cron: "0 * * * *" },
  { value: "daily_9am", label: "Daily at 9:00 AM", cron: "0 9 * * *" },
  { value: "daily_midnight", label: "Daily at midnight", cron: "0 0 * * *" },
  { value: "weekly_monday", label: "Weekly on Monday at 9:00 AM", cron: "0 9 * * 1" },
  { value: "monthly", label: "Monthly on 1st at 9:00 AM", cron: "0 9 1 * *" },
  { value: "custom", label: "Custom cron expression", cron: "" },
];

const getCronDescription = (cron: string): string => {
  const preset = SCHEDULE_PRESETS.find(p => p.cron === cron);
  if (preset && preset.value !== "custom") return preset.label;
  
  // Basic cron parsing for common patterns
  const parts = cron.split(" ");
  if (parts.length !== 5) return cron;
  
  const [min, hour, dom, month, dow] = parts;
  
  if (min === "0" && hour === "*") return "Every hour";
  if (min === "0" && hour !== "*" && dom === "*" && dow === "*") return `Daily at ${hour}:00`;
  if (dow !== "*" && dom === "*") return `Weekly on day ${dow}`;
  
  return cron;
};

export const CronJobs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: reports = [], isLoading } = useScheduledReports();
  const { data: companies = [] } = useCompanies();
  const createReport = useCreateScheduledReport();
  const deleteReport = useDeleteScheduledReport();
  const toggleReport = useToggleScheduledReport();
  const executeReport = useExecuteScheduledReport();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company_id: "",
    schedule_preset: "",
    cron_expression: "",
    recipients: "",
    report_type: "tickets",
    email_subject: "",
    email_body: "",
  });

  const handleCreate = () => {
    const preset = SCHEDULE_PRESETS.find(p => p.value === formData.schedule_preset);
    const cronExpression = formData.schedule_preset === "custom" 
      ? formData.cron_expression 
      : preset?.cron || "";

    const data: ScheduledReportCreate = {
      company_id: parseInt(formData.company_id),
      name: formData.name,
      report_type: formData.report_type,
      schedule_type: "cron",
      cron_expression: cronExpression,
      recipients: formData.recipients.split(",").map(e => e.trim()).filter(Boolean),
      email_subject: formData.email_subject || undefined,
      email_body: formData.email_body || undefined,
      is_active: true,
    };

    createReport.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setFormData({
          name: "",
          company_id: "",
          schedule_preset: "",
          cron_expression: "",
          recipients: "",
          report_type: "tickets",
          email_subject: "",
          email_body: "",
        });
      },
    });
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || `Company ${companyId}`;
  };

  const formatLastRun = (lastRun?: string) => {
    if (!lastRun) return "Never";
    try {
      return formatDistanceToNow(new Date(lastRun), { addSuffix: true });
    } catch {
      return lastRun;
    }
  };

  const formatNextRun = (nextRun?: string, isActive?: boolean) => {
    if (!isActive) return "Paused";
    if (!nextRun) return "Calculating...";
    try {
      return format(new Date(nextRun), "MMM d, h:mm a");
    } catch {
      return nextRun;
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Scheduled Reports" 
        subtitle="Automate ticket reports and email delivery"
      />

      {/* Add Cron Job Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Scheduled Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Schedule Name</Label>
                <Input 
                  placeholder="e.g., Daily Ticket Report for Acme"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Select 
                  value={formData.company_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, company_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={String(company.id)}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Select
                  value={formData.schedule_preset}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, schedule_preset: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_PRESETS.map(preset => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.schedule_preset === "custom" && (
                <div className="space-y-2">
                  <Label>Cron Expression</Label>
                  <Input 
                    placeholder="0 9 * * *"
                    value={formData.cron_expression}
                    onChange={(e) => setFormData(prev => ({ ...prev, cron_expression: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: minute hour day month weekday
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Recipients (comma-separated emails)</Label>
                <Input 
                  placeholder="user@example.com, team@example.com"
                  value={formData.recipients}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Subject (optional)</Label>
                <Input 
                  placeholder="Leave empty for default subject"
                  value={formData.email_subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, email_subject: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Body (optional)</Label>
                <Textarea 
                  placeholder="Custom message to include in the email"
                  value={formData.email_body}
                  onChange={(e) => setFormData(prev => ({ ...prev, email_body: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!formData.name || !formData.company_id || !formData.schedule_preset || !formData.recipients || createReport.isPending}
              >
                {createReport.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && reports.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No scheduled reports</h3>
          <p className="text-muted-foreground mb-4">Create your first scheduled report to automate ticket exports</p>
        </div>
      )}

      {/* Scheduled Reports List */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={cn(
              "bg-card rounded-xl border border-border p-5 group transition-all duration-300",
              !report.is_active && "opacity-60"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  report.is_active ? "bg-primary/10" : "bg-muted"
                )}>
                  <Clock className={cn("w-5 h-5", report.is_active ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{report.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{getCompanyName(report.company_id)}</span>
                    </div>
                    <span className="text-muted-foreground hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {getCronDescription(report.cron_expression || "")}
                      </span>
                    </div>
                    <span className="text-muted-foreground hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {report.recipients?.length || 0} recipient(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-muted-foreground">Last run</p>
                  <p className="text-sm text-foreground">{formatLastRun(report.last_run)}</p>
                </div>
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-muted-foreground">Next run</p>
                  <p className="text-sm text-foreground">{formatNextRun(report.next_run, report.is_active)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Switch 
                    checked={report.is_active} 
                    onCheckedChange={() => toggleReport.mutate(report.id)}
                    disabled={toggleReport.isPending}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => executeReport.mutate(report.id)}
                    disabled={executeReport.isPending}
                    title="Run now"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this scheduled report?")) {
                        deleteReport.mutate(report.id);
                      }
                    }}
                    disabled={deleteReport.isPending}
                  >
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
