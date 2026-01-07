import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Download, 
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockTickets = [
  { id: 1, ticketNumber: "TKT-001234", company: "Acme Corp", category: "Technical", status: "Open", assignedTo: "John Doe", createdAt: "2024-01-15", priority: "High" },
  { id: 2, ticketNumber: "TKT-001235", company: "TechStart Inc", category: "Billing", status: "In Progress", assignedTo: "Jane Smith", createdAt: "2024-01-14", priority: "Medium" },
  { id: 3, ticketNumber: "TKT-001236", company: "GlobalTech", category: "Support", status: "Resolved", assignedTo: "Mike Johnson", createdAt: "2024-01-14", priority: "Low" },
  { id: 4, ticketNumber: "TKT-001237", company: "Beta Corp", category: "Technical", status: "Closed", assignedTo: "Sarah Wilson", createdAt: "2024-01-13", priority: "High" },
  { id: 5, ticketNumber: "TKT-001238", company: "Acme Corp", category: "Feature Request", status: "Open", assignedTo: "John Doe", createdAt: "2024-01-13", priority: "Medium" },
  { id: 6, ticketNumber: "TKT-001239", company: "Innovation Labs", category: "Technical", status: "In Progress", assignedTo: "Emily Brown", createdAt: "2024-01-12", priority: "High" },
  { id: 7, ticketNumber: "TKT-001240", company: "TechStart Inc", category: "Support", status: "Open", assignedTo: "Jane Smith", createdAt: "2024-01-12", priority: "Low" },
  { id: 8, ticketNumber: "TKT-001241", company: "GlobalTech", category: "Billing", status: "Resolved", assignedTo: "Mike Johnson", createdAt: "2024-01-11", priority: "Medium" },
];

const statusColors: Record<string, string> = {
  "Open": "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  "Resolved": "bg-success/10 text-success border-success/20",
  "Closed": "bg-muted text-muted-foreground border-border",
};

const priorityColors: Record<string, string> = {
  "High": "bg-destructive/10 text-destructive",
  "Medium": "bg-warning/10 text-warning",
  "Low": "bg-muted text-muted-foreground",
};

export const TicketsList = () => {
  return (
    <div className="space-y-6">
      <Header 
        title="Tickets" 
        subtitle="View and manage all imported tickets"
        onRefresh={() => console.log("Refresh")}
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filters:</span>
          </div>
          
          <Select>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="acme">Acme Corp</SelectItem>
              <SelectItem value="techstart">TechStart Inc</SelectItem>
              <SelectItem value="globaltech">GlobalTech</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            className="w-40 h-9"
            placeholder="From Date"
          />
          
          <Input
            type="date"
            className="w-40 h-9"
            placeholder="To Date"
          />

          <div className="flex-1" />

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ticket #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTickets.map((ticket, index) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 * index }}
                  className="table-row"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-foreground">{ticket.ticketNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{ticket.company}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("badge-status", statusColors[ticket.status])}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("badge-status", priorityColors[ticket.priority])}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.assignedTo}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">1-8</span> of <span className="font-medium text-foreground">2,847</span> tickets
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="outline" size="sm">356</Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
