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
  ExternalLink,
  Edit,
  Trash2,
  Mail,
  Key,
  Globe,
  CheckCircle2,
  XCircle
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

  return (
    <div className="space-y-6">
      <Header 
        title="Companies" 
        subtitle="Manage companies and their API connections"
        onRefresh={() => refetch()}
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{companies?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Companies</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {companies?.filter(c => c.is_active).length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {companies?.filter(c => !c.is_active).length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {companies?.reduce((acc, c) => acc + (c.email_recipients?.length || 0), 0) || 0}
              </p>
              <p className="text-xs text-muted-foreground">Recipients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Company Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
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
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Company Name
                </Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Artcaffe"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiUrl" className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  API URL
                </Label>
                <Input 
                  id="apiUrl" 
                  placeholder="https://api.example.com/tickets"
                  value={newCompany.api_url}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, api_url: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  API Key
                </Label>
                <Input 
                  id="apiKey" 
                  type="password" 
                  placeholder="Enter API key"
                  value={newCompany.api_key}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, api_key: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailRecipients" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Recipients
                </Label>
                <Textarea 
                  id="emailRecipients" 
                  placeholder="email1@example.com, email2@example.com"
                  value={newCompany.email_recipients}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, email_recipients: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple emails with commas
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCompany}
                disabled={createMutation.isPending || !newCompany.name || !newCompany.api_url || !newCompany.api_key}
                className="gap-2"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Company
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : companies?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {companies?.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={cn(
                "bg-card rounded-xl border border-border overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300",
                !company.is_active && "opacity-60"
              )}
            >
              {/* Header */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{company.name}</h3>
                      <Badge 
                        variant={company.is_active ? "default" : "secondary"}
                        className={cn(
                          "text-xs mt-1",
                          company.is_active && "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
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
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Globe className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">API Endpoint</p>
                    <p className="text-sm text-foreground truncate font-medium">{company.api_url}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Key className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">API Key</p>
                    <p className="text-sm text-foreground font-medium font-mono">
                      ••••••••{company.api_key.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Email Recipients */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-1.5">Email Recipients</p>
                    {company.email_recipients && company.email_recipients.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {company.email_recipients.map((email, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="text-xs font-normal bg-background"
                          >
                            {email}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No recipients configured</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {company.id}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-3 text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteCompany(company.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
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
