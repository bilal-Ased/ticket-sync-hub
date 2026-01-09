import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Filter, 
  Download, 
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTickets, useCompanies } from "@/hooks/useApi";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  "Open": "bg-primary/10 text-primary",
  "In Progress": "bg-warning/10 text-warning",
  "Resolved": "bg-success/10 text-success",
  "Closed": "bg-muted text-muted-foreground",
  "Pending": "bg-info/10 text-info",
};

const priorityStyles: Record<string, string> = {
  "High": "bg-destructive/10 text-destructive",
  "Medium": "bg-warning/10 text-warning",
  "Low": "bg-muted text-muted-foreground",
};

const ITEMS_PER_PAGE = 20;

export const TicketsList = () => {
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [page, setPage] = useState(0);

  const { data: companies } = useCompanies();
  
  const companyMap = companies?.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {} as Record<number, string>) ?? {};
  
  const { data: tickets, isLoading, refetch, isFetching } = useTickets({
    company_id: companyFilter && companyFilter !== "all" ? parseInt(companyFilter) : undefined,
    status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
    category: categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined,
    date_start: dateStart || undefined,
    date_end: dateEnd || undefined,
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
  });

  const formatDate = (timestamp: number) => {
    try {
      return format(new Date(timestamp * 1000), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  const clearFilters = () => {
    setCompanyFilter("");
    setStatusFilter("");
    setCategoryFilter("");
    setDateStart("");
    setDateEnd("");
    setPage(0);
  };

  const hasFilters = companyFilter || statusFilter || categoryFilter || dateStart || dateEnd;

  return (
    <div className="page-container">
      <Header 
        title="Tickets" 
        subtitle="View and manage all imported tickets"
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="filter-bar"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">Filters</span>
        </div>
        
        <div className="h-6 w-px bg-border hidden sm:block" />
        
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-40 h-9 rounded-xl">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies?.map((company) => (
              <SelectItem key={company.id} value={company.id.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-32 h-9 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Billing">Billing</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="w-36 h-9 rounded-xl text-sm"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
          <span className="text-muted-foreground text-sm">to</span>
          <Input
            type="date"
            className="w-36 h-9 rounded-xl text-sm"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>

        <div className="flex-1" />

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}

        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-surface overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Company</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : tickets?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12">
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Search className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">No tickets found</p>
                      <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets?.map((ticket, index) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.02 * index }}
                    className="group"
                  >
                    <td>
                      <span className="font-mono text-sm font-medium">{ticket.ticket_number}</span>
                    </td>
                    <td>
                      <span className="font-medium">{companyMap[ticket.company_id] || `#${ticket.company_id}`}</span>
                    </td>
                    <td>
                      <span className="text-muted-foreground">{ticket.category || "—"}</span>
                    </td>
                    <td>
                      <Badge className={cn(
                        "status-badge",
                        statusStyles[ticket.status] || statusStyles["Open"]
                      )}>
                        {ticket.status || "Unknown"}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant="outline" className={cn(
                        "status-badge",
                        priorityStyles[ticket.priority || "Medium"]
                      )}>
                        {ticket.priority || "Medium"}
                      </Badge>
                    </td>
                    <td>
                      <span className="text-muted-foreground">{ticket.assigned_to || "Unassigned"}</span>
                    </td>
                    <td>
                      <span className="text-muted-foreground">{formatDate(ticket.created_date_ts)}</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{tickets?.length || 0}</span> tickets
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="rounded-lg gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-muted">
              {page + 1}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              disabled={!tickets || tickets.length < ITEMS_PER_PAGE}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
