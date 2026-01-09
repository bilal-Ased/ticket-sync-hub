import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Plus, 
  Building2, 
  Edit,
  Trash2,
  Mail,
  Key,
  Globe,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanies, useCreateCompany, useDeleteCompany } from "@/hooks/useApi";

export const CompaniesList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ 
    name: "", 
    api_url: "", 
    api_key: "",
    email_recipients: "" 
  });

  const { data: companies, isLoading, refetch } = useCompanies();
  const createMutation = useCreateCompany();
  const deleteMutation = useDeleteCompany();

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.api_url || !newCompany.api_key) return;
    
    const emailList = newCompany.email_recipients
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);
    
    await createMutation.mutateAsync({
      name: newCompany.name,
      api_url: newCompany.api_url,
      api_key: newCompany.api_key,
      email_recipients: emailList.length > 0 ? emailList : undefined
    });
    setNewCompany({ name: "", api_url: "", api_key: "", email_recipients: "" });
    setIsDialogOpen(false);
  };

  const handleDeleteCompany = async (id: number) => {
    if (confirm("Are you sure you want to delete this company?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const stats = {
    total: companies?.length || 0,
    active: companies?.filter(c => c.is_active).length || 0,
    inactive: companies?.filter(c => !c.is_active).length || 0,
    recipients: companies?.reduce((acc, c) => acc + (c.email_recipients?.length || 0), 0) || 0,
  };

  return (
    <div className="page-container">
      <Header 
        title="Companies" 
        subtitle="Manage companies and their API connections"
        onRefresh={() => refetch()}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Building2, color: "primary" },
          { label: "Active", value: stats.active, icon: CheckCircle2, color: "success" },
          { label: "Inactive", value: stats.inactive, icon: XCircle, color: "warning" },
          { label: "Recipients", value: stats.recipients, icon: Mail, color: "info" },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                stat.color === "primary" && "bg-primary/10 text-primary",
                stat.color === "success" && "bg-success/10 text-success",
                stat.color === "warning" && "bg-warning/10 text-warning",
                stat.color === "info" && "bg-info/10 text-info"
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Add New Company
              </DialogTitle>
              <DialogDescription>
                Connect a new company by providing their API details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  placeholder="e.g. Artcaffe"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>API URL</Label>
                <Input 
                  placeholder="https://api.example.com/tickets"
                  value={newCompany.api_url}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, api_url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input 
                  type="password" 
                  placeholder="Enter API key"
                  value={newCompany.api_key}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, api_key: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Recipients</Label>
                <Textarea 
                  placeholder="email1@example.com, email2@example.com"
                  value={newCompany.email_recipients}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, email_recipients: e.target.value }))}
                  className="resize-none"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple emails with commas
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCompany}
                disabled={createMutation.isPending || !newCompany.name || !newCompany.api_url || !newCompany.api_key}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Company"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : companies?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="empty-state"
        >
          <div className="empty-state-icon">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No companies yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Add your first company to start importing and managing tickets.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Company
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {companies?.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={cn(
                "card-surface overflow-hidden group",
                !company.is_active && "opacity-60"
              )}
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{company.name}</h3>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "mt-1 text-xs",
                          company.is_active 
                            ? "bg-success/10 text-success border-success/20" 
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {company.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="px-5 pb-4 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                  <Globe className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">API Endpoint</p>
                    <p className="text-sm text-foreground truncate">{company.api_url}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                  <Key className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">API Key</p>
                    <p className="text-sm text-foreground font-mono">
                      ••••••••{company.api_key.slice(-8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-1.5">Email Recipients</p>
                    {company.email_recipients && company.email_recipients.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {company.email_recipients.map((email, i) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal">
                            {email}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No recipients</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">ID: {company.id}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 px-2.5">
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteCompany(company.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
