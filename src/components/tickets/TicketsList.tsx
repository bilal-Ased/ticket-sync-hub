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
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTickets, useCompanies } from "@/hooks/useApi";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  "Open": "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  "Resolved": "bg-success/10 text-success border-success/20",
  "Closed": "bg-muted text-muted-foreground border-border",
  "Pending": "bg-info/10 text-info border-info/20",
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
    <div className="space-y-6">
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
        className="card-elevated p-5"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Filter className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">Filters</span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-44 h-10 rounded-xl border-border/50">
              <SelectValue placeholder="All Companies" />
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
            <SelectTrigger className="w-36 h-10 rounded-xl border-border/50">
              <SelectValue placeholder="All Statuses" />
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
            <SelectTrigger className="w-36 h-10 rounded-xl border-border/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Billing">Billing</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                className="w-40 h-10 pl-9 rounded-xl border-border/50"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              className="w-40 h-10 rounded-xl border-border/50"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>

          <div className="flex-1" />

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear all
            </Button>
          )}

          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ticket #</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned To</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={8} className="px-5 py-4">
                      <Skeleton className="h-6 w-full rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : tickets?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">No tickets found</p>
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
                    className="table-row group"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-semibold text-foreground">{ticket.ticket_number}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-foreground">{companyMap[ticket.company_id] || `#${ticket.company_id}`}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{ticket.category || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className={cn(
                        "text-xs font-semibold rounded-lg border",
                        statusStyles[ticket.status] || statusStyles["Open"]
                      )}>
                        {ticket.status || "Unknown"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "badge-status text-xs font-semibold rounded-lg",
                        priorityStyles[ticket.priority || "Medium"] || priorityStyles["Medium"]
                      )}>
                        {ticket.priority || "Medium"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{ticket.assigned_to || "Unassigned"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{formatDate(ticket.created_date_ts)}</span>
                    </td>
                    <td className="px-5 py-4">
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
        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{tickets?.length || 0}</span> tickets
          </p>
          <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-foreground px-3 py-1 rounded-lg bg-primary/10">
                {page + 1}
              </span>
            </div>
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
