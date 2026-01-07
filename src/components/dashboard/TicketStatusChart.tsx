import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Open", value: 45, color: "#3B82F6" },
  { name: "In Progress", value: 30, color: "#F59E0B" },
  { name: "Resolved", value: 85, color: "#10B981" },
  { name: "Closed", value: 120, color: "#6B7280" },
];

export const TicketStatusChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-soft p-5"
    >
      <h3 className="text-[15px] font-semibold text-foreground mb-1">Tickets by Status</h3>
      <p className="text-[13px] text-muted-foreground mb-4">Distribution of current tickets</p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
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
              formatter={(value) => <span className="text-[12px] text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};