import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  Upload, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

type ImportStatus = "idle" | "importing" | "success" | "error";

export const ImportTickets = () => {
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [selectedCompany, setSelectedCompany] = useState("");

  const handleImport = () => {
    if (!selectedCompany) return;
    setStatus("importing");
    setTimeout(() => {
      setStatus("success");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Import Tickets" 
        subtitle="Fetch tickets from external ticketing systems"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Manual Import</h3>
              <p className="text-sm text-muted-foreground">Import tickets on demand</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="techstart">TechStart Inc</SelectItem>
                  <SelectItem value="globaltech">GlobalTech</SelectItem>
                  <SelectItem value="beta">Beta Corp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>

            <Button 
              className="w-full gap-2" 
              onClick={handleImport}
              disabled={status === "importing" || !selectedCompany}
            >
              {status === "importing" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Start Import
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Import Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-semibold text-foreground mb-6">Import Status</h3>
          
          <div className={cn(
            "rounded-lg p-4 mb-4 transition-colors",
            status === "idle" && "bg-muted",
            status === "importing" && "bg-primary/10",
            status === "success" && "bg-success/10",
            status === "error" && "bg-destructive/10"
          )}>
            <div className="flex items-center gap-3">
              {status === "idle" && <Clock className="w-5 h-5 text-muted-foreground" />}
              {status === "importing" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
              {status === "success" && <CheckCircle2 className="w-5 h-5 text-success" />}
              {status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}
              <div>
                <p className="font-medium text-foreground">
                  {status === "idle" && "Ready to import"}
                  {status === "importing" && "Importing tickets..."}
                  {status === "success" && "Import completed"}
                  {status === "error" && "Import failed"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {status === "idle" && "Select a company and date range to begin"}
                  {status === "importing" && "Fetching data from external API..."}
                  {status === "success" && "245 tickets imported successfully"}
                  {status === "error" && "Connection timeout. Please try again."}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Imports */}
          <h4 className="text-sm font-medium text-foreground mb-3">Recent Imports</h4>
          <div className="space-y-2">
            {[
              { company: "Acme Corp", count: 245, time: "2 hours ago", status: "success" },
              { company: "TechStart Inc", count: 89, time: "5 hours ago", status: "success" },
              { company: "GlobalTech", count: 0, time: "1 day ago", status: "error" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  {item.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm text-foreground">{item.company}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{item.count} tickets</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
