import { Header } from "@/components/layout/Header";
import { StatCard } from "./StatCard";
import { TicketStatusChart } from "./TicketStatusChart";
import { RecentActivity } from "./RecentActivity";
import { Ticket, Building2, Layers, Clock } from "lucide-react";
import { useTicketStats, useCompanies } from "@/hooks/useApi";

export const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats, isFetching } = useTicketStats();
  const { data: companies, isLoading: companiesLoading } = useCompanies();

  const totalTickets = stats?.total ?? 0;
  const activeCompanies = companies?.length ?? 0;
  const avgAgeDays = stats?.avg_age_days ?? 0;
  const categoriesCount = stats?.by_category ? Object.keys(stats.by_category).length : 0;

  return (
    <div className="space-y-8">
      <Header 
        title="Dashboard" 
        subtitle="Overview of your ticket management system"
        onRefresh={() => refetchStats()}
        isRefreshing={isFetching}
      />

      {/* Stats Grid */}
      <div className="feature-grid">
        <StatCard
          title="Total Tickets"
          value={statsLoading ? "..." : totalTickets.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          icon={Ticket}
          iconColor="primary"
          delay={0}
        />
        <StatCard
          title="Active Companies"
          value={companiesLoading ? "..." : activeCompanies.toString()}
          change={`${activeCompanies} connected`}
          changeType="positive"
          icon={Building2}
          iconColor="success"
          delay={0.05}
        />
        <StatCard
          title="Categories"
          value={categoriesCount.toString()}
          change="ticket types"
          changeType="neutral"
          icon={Layers}
          iconColor="warning"
          delay={0.1}
        />
        <StatCard
          title="Avg. Age"
          value={avgAgeDays ? `${avgAgeDays.toFixed(1)}d` : "N/A"}
          change="per ticket"
          changeType="neutral"
          icon={Clock}
          iconColor="info"
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
