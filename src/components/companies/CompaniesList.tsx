import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Company {
  id: number;
  name: string;
  apiUrl: string;
  ticketCount: number;
  lastImport: string;
  isActive: boolean;
}

const mockCompanies: Company[] = [
  { id: 1, name: "Acme Corp", apiUrl: "https://api.acme.com/tickets", ticketCount: 1245, lastImport: "2 hours ago", isActive: true },
  { id: 2, name: "TechStart Inc", apiUrl: "https://api.techstart.io/v2/tickets", ticketCount: 567, lastImport: "5 hours ago", isActive: true },
  { id: 3, name: "GlobalTech", apiUrl: "https://tickets.globaltech.net/api", ticketCount: 892, lastImport: "1 day ago", isActive: true },
  { id: 4, name: "Beta Corp", apiUrl: "https://api.beta-corp.com/helpdesk", ticketCount: 143, lastImport: "3 days ago", isActive: false },
  { id: 5, name: "Innovation Labs", apiUrl: "https://support.innovationlabs.co/api", ticketCount: 0, lastImport: "Never", isActive: true },
];

export const CompaniesList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Header 
        title="Companies" 
        subtitle="Manage companies and their API connections"
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
                <Input id="name" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL</Label>
                <Input id="apiUrl" placeholder="https://api.example.com/tickets" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" type="password" placeholder="Enter API key" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Add Company</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={cn(
              "bg-card rounded-xl border border-border p-5 group hover:shadow-lg transition-all duration-300",
              !company.isActive && "opacity-60"
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
                    company.isActive ? "text-success" : "text-muted-foreground"
                  )}>
                    {company.isActive ? "Active" : "Inactive"}
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
                <span className="text-muted-foreground truncate">{company.apiUrl}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Ticket className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{company.ticketCount.toLocaleString()}</span>
                <span className="text-muted-foreground">tickets</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Last import: {company.lastImport}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
