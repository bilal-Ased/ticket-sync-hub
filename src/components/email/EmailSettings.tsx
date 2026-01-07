import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Send, 
  Clock,
  FileText,
  Users,
  CheckCircle2,
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const EmailSettings = () => {
  const [isSending, setIsSending] = useState(false);

  const handleSendTest = () => {
    setIsSending(true);
    setTimeout(() => setIsSending(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Email Settings" 
        subtitle="Configure email reports and notifications"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">SMTP Configuration</h3>
              <p className="text-sm text-muted-foreground">Setup email delivery settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input placeholder="smtp.example.com" defaultValue="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input placeholder="587" defaultValue="587" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input placeholder="your@email.com" defaultValue="reports@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" defaultValue="password123" />
            </div>
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input placeholder="noreply@example.com" defaultValue="reports@company.com" />
            </div>
            <Button className="w-full">Save Configuration</Button>
          </div>
        </motion.div>

        {/* Quick Send */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Send Report</h3>
              <p className="text-sm text-muted-foreground">Email ticket reports manually</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Summary</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Analysis</SelectItem>
                  <SelectItem value="custom">Custom Export</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Input placeholder="email1@example.com, email2@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="Ticket Report - January 2024" />
            </div>
            <div className="space-y-2">
              <Label>Additional Message (Optional)</Label>
              <Textarea placeholder="Add a custom message..." rows={3} />
            </div>
            <Button className="w-full gap-2" onClick={handleSendTest}>
              {isSending ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Report
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Scheduled Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Scheduled Reports</h3>
                <p className="text-sm text-muted-foreground">Automatic email reports</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Add Schedule</Button>
          </div>

          <div className="space-y-4">
            {[
              { name: "Daily Summary", recipients: "team@company.com", schedule: "Every day at 8:00 AM", enabled: true },
              { name: "Weekly Report", recipients: "management@company.com", schedule: "Every Monday at 9:00 AM", enabled: true },
              { name: "Monthly Analysis", recipients: "executives@company.com", schedule: "1st of every month", enabled: false },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span>{report.recipients}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{report.schedule}</span>
                    </div>
                  </div>
                </div>
                <Switch checked={report.enabled} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
