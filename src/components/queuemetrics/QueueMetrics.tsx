import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQueueMetricsStats } from "@/hooks/useApi";
import { Activity, TrendingUp, RefreshCw, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

// Valid blocks based on your curl example - these work with QueueMetrics API
const VALID_BLOCKS = [
  { value: "DetailsDO.CallsOK", label: "Calls OK (Answered)" },
  { value: "DetailsDO.CallsKO", label: "Calls KO (Missed/Abandoned)" },
  { value: "DetailsDO.AllCalls", label: "All Calls" },
  { value: "DetailsDO.AgentsOnQueue", label: "Agents on Queue" },
  { value: "DetailsDO.AgentSession", label: "Agent Sessions" },
  { value: "DetailsDO.AgentPause", label: "Agent Pauses" },
] as const;

// Results table component
interface ResultsTableProps {
  data: Record<string, unknown>;
  block: string;
}

const ResultsTable = ({ data, block }: ResultsTableProps) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  
  // Extract the array from the data object based on block name
  const blockData = data[block] as Record<string, unknown>[] | undefined;
  
  if (!blockData || !Array.isArray(blockData)) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No tabular data found for this block</p>
      </div>
    );
  }

  if (blockData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No records returned</p>
      </div>
    );
  }

  // Get column names from first record
  const columns = Object.keys(blockData[0] || {});
  
  // Key columns to prioritize display
  const priorityColumns = ['Date', 'Queue', 'Caller', 'Handled by', 'Duration', 'Wait', 'Code', 'Disconnection'];
  const sortedColumns = [
    ...priorityColumns.filter(col => columns.includes(col)),
    ...columns.filter(col => !priorityColumns.includes(col) && col !== '...'),
  ].filter(col => col !== '...');

  const totalPages = Math.ceil(blockData.length / itemsPerPage);
  const paginatedData = blockData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {sortedColumns.map((col) => (
                <th key={col} className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className={cn(
                "border-b hover:bg-muted/50 transition-colors",
                idx % 2 === 0 ? "" : "bg-muted/20"
              )}>
                {sortedColumns.map((col) => (
                  <td key={col} className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-foreground">
                    {String(row[col] || "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{paginatedData.length}</span> of{" "}
          <span className="font-medium text-foreground">{blockData.length}</span> records
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm font-medium px-2">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
] as const;

// Helper to calculate date ranges for presets
const getPresetDates = (preset: string): { from: string; to: string } => {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");
  const todayEnd = `${today}T23:59:59`;
  const todayStart = `${today}T00:00:00`;
  
  switch (preset) {
    case "today":
      return { from: todayStart, to: todayEnd };
    case "yesterday": {
      const yesterday = format(subDays(now, 1), "yyyy-MM-dd");
      return { from: `${yesterday}T00:00:00`, to: `${yesterday}T23:59:59` };
    }
    case "last_7_days":
      return { from: `${format(subDays(now, 7), "yyyy-MM-dd")}T00:00:00`, to: todayEnd };
    case "last_30_days":
      return { from: `${format(subDays(now, 30), "yyyy-MM-dd")}T00:00:00`, to: todayEnd };
    default:
      return { from: `${format(subDays(now, 7), "yyyy-MM-dd")}T00:00:00`, to: todayEnd };
  }
};

export const QueueMetrics = () => {
  const [queues, setQueues] = useState("*");
  const [block, setBlock] = useState<string>("DetailsDO.CallsOK");
  const [datePreset, setDatePreset] = useState<string>("last_7_days");
  
  const today = new Date();
  const defaultFromDate = format(subDays(today, 7), "yyyy-MM-dd'T'00:00:00");
  const defaultToDate = format(today, "yyyy-MM-dd'T'23:59:59");
  
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  const statsMutation = useQueueMetricsStats();

  const handleQuery = () => {
    const dates = datePreset === "custom" 
      ? { from: fromDate, to: toDate }
      : getPresetDates(datePreset);
    
    statsMutation.mutate({
      queues,
      from_date: dates.from,
      to_date: dates.to,
      block,
      json_format: "simple",
    });
  };

  // Check if the response contains an error from QueueMetrics
  const responseData = statsMutation.data?.data as Record<string, unknown> | undefined;
  const result = responseData?.result as Record<string, unknown> | undefined;
  const hasQmError = result?.Status === "ERR";
  const qmErrorDesc = hasQmError ? String(result?.Description || "Unknown error") : null;

  return (
    <div className="page-container">
      <Header
        title="Queue Metrics"
        subtitle="Query call center analytics using valid data blocks"
      />

      {/* Query Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Query Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Queues</Label>
              <Input
                value={queues}
                onChange={(e) => setQueues(e.target.value)}
                placeholder="* for all, or comma-separated"
              />
            </div>
            <div className="space-y-2">
              <Label>Data Block</Label>
              <Select value={block} onValueChange={setBlock}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VALID_BLOCKS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={datePreset} onValueChange={setDatePreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-end">
              <Button onClick={handleQuery} disabled={statsMutation.isPending} className="w-full">
                {statsMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TrendingUp className="w-4 h-4 mr-2" />
                )}
                Query Stats
              </Button>
            </div>
          </div>

          {/* Custom date inputs */}
          {datePreset === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="datetime-local"
                  value={fromDate.slice(0, 16)}
                  onChange={(e) => setFromDate(e.target.value + ":00")}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="datetime-local"
                  value={toDate.slice(0, 16)}
                  onChange={(e) => setToDate(e.target.value + ":59")}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Query Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline">Queues: {queues}</Badge>
        <Badge variant="outline">Block: {block}</Badge>
        <Badge variant="outline">
          Range: {DATE_PRESETS.find(p => p.value === datePreset)?.label || datePreset}
        </Badge>
      </div>

      {/* Error State */}
      {statsMutation.isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Request Failed</AlertTitle>
          <AlertDescription>
            {statsMutation.error?.message || "Failed to fetch queue metrics"}
          </AlertDescription>
        </Alert>
      )}

      {/* QueueMetrics API Error */}
      {hasQmError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>QueueMetrics Error</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap text-xs max-h-32 overflow-auto">
            {qmErrorDesc?.split('\n').slice(0, 3).join('\n')}
          </AlertDescription>
        </Alert>
      )}

      {/* Success State */}
      {statsMutation.isSuccess && !hasQmError && (
        <Alert className="mb-4 border-success/50 bg-success/5">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Query Successful</AlertTitle>
          <AlertDescription>
            Retrieved data for block: {block}
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {statsMutation.data && !hasQmError && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Query Results ({block})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsTable data={statsMutation.data.data} block={block} />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!statsMutation.data && !statsMutation.isPending && !statsMutation.isError && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No data yet</p>
              <p className="text-sm mt-1">
                Select a block and date range, then click "Query Stats" to fetch metrics
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
