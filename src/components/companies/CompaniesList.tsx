import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
  Building2, 
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanies, useCreateCompany, useDeleteCompany } from "@/hooks/useApi";

export const CompaniesList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", api_url: "", api_key: "" });

  const { data: companies, isLoading, refetch } = useCompanies();
  const createMutation = useCreateCompany();
  const deleteMutation = useDeleteCompany();

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.api_url || !newCompany.api_key) return;
    
    await createMutation.mutateAsync(newCompany);
    setNewCompany({ name: "", api_url: "", api_key: "" });
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

      {/* Add Company Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter company name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL</Label>
                <Input 
                  id="apiUrl" 
                  placeholder="https://api.example.com/tickets"
                  value={newCompany.api_url}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, api_url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input 
                  id="apiKey" 
                  type="password" 
                  placeholder="Enter API key"
                  value={newCompany.api_key}
                  onChange={(e) => setNewCompany(prev => ({ ...prev, api_key: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateCompany}
                disabled={createMutation.isPending || !newCompany.name || !newCompany.api_url || !newCompany.api_key}
              >
                {createMutation.isPending ? "Adding..." : "Add Company"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : companies?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No companies found. Add your first company to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies?.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={cn(
                "bg-card rounded-xl border border-border p-5 group hover:shadow-lg transition-all duration-300",
                !company.is_active && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    <span className={cn(
                      "text-xs font-medium",
                      company.is_active ? "text-success" : "text-muted-foreground"
                    )}>
                      {company.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{company.api_url}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">API Connected</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  ID: {company.id}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCompany(company.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
