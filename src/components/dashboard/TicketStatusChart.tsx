import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Open", value: 45, color: "hsl(220, 70%, 50%)" },
  { name: "In Progress", value: 30, color: "hsl(38, 90%, 50%)" },
  { name: "Resolved", value: 85, color: "hsl(145, 65%, 40%)" },
  { name: "Closed", value: 120, color: "hsl(215, 15%, 55%)" },
];

export const TicketStatusChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-elevated p-5"
    >
      <h3 className="text-base font-semibold text-foreground mb-4">Tickets by Status</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={32}
              formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};