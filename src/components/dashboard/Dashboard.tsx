import { Header } from "@/components/layout/Header";
import { StatCard } from "./StatCard";
import { TicketStatusChart } from "./TicketStatusChart";
import { RecentActivity } from "./RecentActivity";
import { Ticket, Building2, Clock, TrendingUp } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Header 
        title="Dashboard" 
        subtitle="Overview of your ticket management system"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value="2,847"
          change="+12.5% from last month"
          changeType="positive"
          icon={Ticket}
          delay={0}
        />
        <StatCard
          title="Active Companies"
          value="24"
          change="+2 this week"
          changeType="positive"
          icon={Building2}
          delay={0.05}
        />
        <StatCard
          title="Pending Imports"
          value="5"
          change="3 scheduled for today"
          changeType="neutral"
          icon={Clock}
          delay={0.1}
        />
        <StatCard
          title="Avg. Resolution"
          value="4.2h"
          change="-18% improvement"
          changeType="positive"
          icon={TrendingUp}
          delay={0.15}
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketStatusChart />
        <RecentActivity />
      </div>
    </div>
  );
};
