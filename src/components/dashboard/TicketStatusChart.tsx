import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTicketStats } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#6B7280", "#EF4444"];

export const TicketStatusChart = () => {
  const { data: stats, isLoading, error } = useTicketStats();

  const chartData = stats?.by_status 
    ? Object.entries(stats.by_status).map(([name, value], index) => ({ 
        name, 
        value,
        color: COLORS[index % COLORS.length]
      }))
    : [];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-surface p-5"
      >
        <h3 className="text-[15px] font-semibold text-foreground mb-1">Tickets by Status</h3>
        <p className="text-[13px] text-muted-foreground mb-4">Distribution of current tickets</p>
        <div className="h-52 flex items-center justify-center">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
      </motion.div>
    );
  }

  if (error || !chartData || chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-surface p-5"
      >
        <h3 className="text-[15px] font-semibold text-foreground mb-1">Tickets by Status</h3>
        <p className="text-[13px] text-muted-foreground mb-4">Distribution of current tickets</p>
        <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
          {error ? "Failed to load data" : "No ticket data available"}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-surface p-5"
    >
      <h3 className="text-[15px] font-semibold text-foreground mb-1">Tickets by Status</h3>
      <p className="text-[13px] text-muted-foreground mb-4">Distribution of current tickets</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={28}
              payload={chartData.map((item) => ({
                value: item.name,
                type: 'circle',
                color: item.color,
              }))}
              formatter={(value) => <span className="text-[12px] text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
