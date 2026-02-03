import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TicketsList } from "@/components/tickets/TicketsList";
import { OpportunitiesList } from "@/components/opportunities/OpportunitiesList";
import { QueueMetrics } from "@/components/queuemetrics/QueueMetrics";
import { CompaniesList } from "@/components/companies/CompaniesList";
import { ImportTickets } from "@/components/import/ImportTickets";
import { CronJobs } from "@/components/cron/CronJobs";
import { EmailSettings } from "@/components/email/EmailSettings";
import { SettingsPage } from "@/components/settings/SettingsPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "tickets":
        return <TicketsList />;
      case "opportunities":
        return <OpportunitiesList />;
      case "queuemetrics":
        return <QueueMetrics />;
      case "companies":
        return <CompaniesList />;
      case "import":
        return <ImportTickets />;
      case "cron":
        return <CronJobs />;
      case "email":
        return <EmailSettings />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: isSidebarCollapsed ? 72 : 260,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="min-h-screen p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </motion.main>
    </div>
  );
};

export default Index;
