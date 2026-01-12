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
  Download, 
  Upload, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Loader2,
  Sparkles,
  Calendar,
  Building2,
  Mail,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanies, useImportTickets } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";

interface ImportHistory {
  company: string;
  count: number;
  time: string;
  status: "success" | "error";
}

export const ImportTickets = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [recipientEmails, setRecipientEmails] = useState("");
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([]);

  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const importMutation = useImportTickets();

  const selectedCompanyData = companies?.find(c => c.id.toString() === selectedCompany);

  const handleImport = async () => {
    if (!selectedCompany || !dateStart) return;
    
    const emailList = recipientEmails
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);
    
    try {
      const result = await importMutation.mutateAsync({
        company_id: parseInt(selectedCompany),
        date_start: dateStart,
        date_end: dateEnd || undefined,
        send_email: sendEmail,
        recipient_emails: sendEmail && emailList.length > 0 ? emailList : undefined,
      });

      setImportHistory(prev => [
        {
          company: selectedCompanyData?.name || "Unknown",
          count: result.tickets_imported,
          time: "Just now",
          status: "success",
        },
        ...prev.slice(0, 4),
      ]);
    } catch {
      setImportHistory(prev => [
        {
          company: selectedCompanyData?.name || "Unknown",
          count: 0,
          time: "Just now",
          status: "error",
        },
        ...prev.slice(0, 4),
      ]);
    }
  };

  const status = importMutation.isPending ? "importing" : 
                 importMutation.isSuccess ? "success" : 
                 importMutation.isError ? "error" : "idle";

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
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Manual Import</h3>
              <p className="text-sm text-muted-foreground">Import tickets on demand</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Company
              </Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="h-12 rounded-xl border-border/50">
                  <SelectValue placeholder={companiesLoading ? "Loading..." : "Select a company"} />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input 
                  type="date" 
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="h-12 rounded-xl border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  End Date
                </Label>
                <Input 
                  type="date" 
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="h-12 rounded-xl border-border/50"
                />
              </div>
            </div>

            {/* Email Options */}
            <div className="space-y-4 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Send CSV via Email
                </Label>
                <Switch 
                  checked={sendEmail} 
                  onCheckedChange={setSendEmail}
                />
              </div>
              
              {sendEmail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Send className="w-4 h-4 text-muted-foreground" />
                    Recipients
                  </Label>
                  <Input 
                    type="text"
                    placeholder={selectedCompanyData?.email_recipients?.join(', ') || "email1@example.com, email2@example.com"}
                    value={recipientEmails}
                    onChange={(e) => setRecipientEmails(e.target.value)}
                    className="h-12 rounded-xl border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    {selectedCompanyData?.email_recipients?.length 
                      ? `Leave empty to use company defaults: ${selectedCompanyData.email_recipients.join(', ')}`
                      : "Enter comma-separated email addresses"}
                  </p>
                </motion.div>
              )}
            </div>

            <Button
              className="w-full h-12 gap-2 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={handleImport}
              disabled={importMutation.isPending || !selectedCompany || !dateStart}
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Importing tickets...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
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
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Import Status</h3>
              <p className="text-sm text-muted-foreground">Track your import progress</p>
            </div>
          </div>
          
          <div className={cn(
            "rounded-xl p-5 mb-6 transition-all duration-300 border",
            status === "idle" && "bg-muted/50 border-border",
            status === "importing" && "bg-primary/5 border-primary/20",
            status === "success" && "bg-success/5 border-success/20",
            status === "error" && "bg-destructive/5 border-destructive/20"
          )}>
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                status === "idle" && "bg-muted text-muted-foreground",
                status === "importing" && "bg-primary/10 text-primary",
                status === "success" && "bg-success/10 text-success",
                status === "error" && "bg-destructive/10 text-destructive"
              )}>
                {status === "idle" && <Clock className="w-5 h-5" />}
                {status === "importing" && <Loader2 className="w-5 h-5 animate-spin" />}
                {status === "success" && <CheckCircle2 className="w-5 h-5" />}
                {status === "error" && <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {status === "idle" && "Ready to import"}
                  {status === "importing" && "Importing tickets..."}
                  {status === "success" && "Import completed!"}
                  {status === "error" && "Import failed"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {status === "idle" && "Select a company and date range to begin"}
                  {status === "importing" && "Fetching data from external API..."}
                  {status === "success" && importMutation.data && (
                    <>
                      {importMutation.data.tickets_imported} imported, {importMutation.data.tickets_skipped} skipped in {importMutation.data.processing_time}s
                      {importMutation.data.email_sent && (
                        <span className="block text-success">✓ Email sent to {importMutation.data.recipients?.length || 0} recipient(s)</span>
                      )}
                    </>
                  )}
                  {status === "error" && (importMutation.error?.message || "Connection error. Please try again.")}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Imports */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Recent Imports</h4>
            <div className="space-y-3">
              {importHistory.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No recent imports</p>
                </div>
              ) : (
                importHistory.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.status === "success" ? (
                        <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.company}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === "success" ? "default" : "destructive"} className="rounded-lg">
                      {item.count} tickets
                    </Badge>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
