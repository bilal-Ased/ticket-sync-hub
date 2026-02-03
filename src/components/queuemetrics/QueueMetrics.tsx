import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQueueMetricsRealtime, useQueueMetricsPreset, useAgentPerformance, useQueuePerformance } from "@/hooks/useApi";
import { Activity, Users, Phone, Clock, TrendingUp, RefreshCw } from "lucide-react";
import { format, subDays } from "date-fns";

const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
] as const;

export const QueueMetrics = () => {
  const [queues, setQueues] = useState("*");
  const [datePreset, setDatePreset] = useState<typeof DATE_PRESETS[number]["value"]>("today");
  
  const today = new Date();
  const defaultFromDate = format(subDays(today, 7), "yyyy-MM-dd'T'00:00:00");
  const defaultToDate = format(today, "yyyy-MM-dd'T'23:59:59");
  
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  const { data: realtimeData, isLoading: realtimeLoading, refetch: refetchRealtime, isFetching } = useQueueMetricsRealtime(queues);
  
  const { data: agentData, isLoading: agentLoading } = useAgentPerformance({
    from_date: fromDate,
    to_date: toDate,
    queues,
  });
  
  const { data: queuePerfData, isLoading: queuePerfLoading } = useQueuePerformance({
    from_date: fromDate,
    to_date: toDate,
    queues,
  });

  const presetMutation = useQueueMetricsPreset();

  const handlePresetQuery = () => {
    presetMutation.mutate({
      queues,
      date_range: datePreset,
      block: "DetailsDO.CallsOK",
    });
  };

  // Extract metrics from realtime data
  const realtimeMetrics = realtimeData?.data || {};

  return (
    <div className="page-container">
      <Header
        title="Queue Metrics"
        subtitle="Real-time call center analytics and performance"
        onRefresh={() => refetchRealtime()}
        isRefreshing={isFetching}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Queues</Label>
              <Input
                value={queues}
                onChange={(e) => setQueues(e.target.value)}
                placeholder="* for all, or comma-separated"
              />
            </div>
            <div className="space-y-2">
              <Label>Date Preset</Label>
              <Select value={datePreset} onValueChange={(v: typeof datePreset) => setDatePreset(v)}>
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
          <div className="flex justify-end mt-4">
            <Button onClick={handlePresetQuery} disabled={presetMutation.isPending}>
              {presetMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4 mr-2" />
              )}
              Query Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Status</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realtimeLoading ? "—" : realtimeData?.success ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-muted-foreground">
              Queues: {queues}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents Online</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realtimeLoading ? "—" : String((realtimeMetrics as Record<string, unknown>).agents_online ?? "N/A")}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls in Queue</CardTitle>
            <Phone className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realtimeLoading ? "—" : String((realtimeMetrics as Record<string, unknown>).calls_waiting ?? "N/A")}
            </div>
            <p className="text-xs text-muted-foreground">
              Waiting to be answered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realtimeLoading ? "—" : String((realtimeMetrics as Record<string, unknown>).avg_wait_time ?? "N/A")}
            </div>
            <p className="text-xs text-muted-foreground">
              Current average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Tabs defaultValue="agent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agent">Agent Performance</TabsTrigger>
          <TabsTrigger value="queue">Queue Performance</TabsTrigger>
          <TabsTrigger value="stats">Query Results</TabsTrigger>
        </TabsList>

        <TabsContent value="agent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Agent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agentLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : agentData?.data ? (
                <div className="overflow-x-auto">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(agentData.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No agent performance data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Queue Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queuePerfLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : queuePerfData?.data ? (
                <div className="overflow-x-auto">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(queuePerfData.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No queue performance data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Query Results
                {presetMutation.isSuccess && (
                  <Badge variant="secondary" className="ml-2">
                    {datePreset.replace(/_/g, " ")}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {presetMutation.isPending ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : presetMutation.data?.data ? (
                <div className="overflow-x-auto">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(presetMutation.data.data, null, 2)}
                  </pre>
                </div>
              ) : presetMutation.isError ? (
                <p className="text-destructive text-center py-8">
                  Error: {presetMutation.error?.message || "Failed to fetch stats"}
                </p>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Click "Query Stats" to fetch data with the selected preset
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
