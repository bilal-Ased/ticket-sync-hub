import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TicketsList } from "@/components/tickets/TicketsList";
import { CompaniesList } from "@/components/companies/CompaniesList";
import { ImportTickets } from "@/components/import/ImportTickets";
import { CronJobs } from "@/components/cron/CronJobs";
import { EmailSettings } from "@/components/email/EmailSettings";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "tickets":
        return <TicketsList />;
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
      {/* Gradient background overlay */}
      <div className="fixed inset-0 gradient-bg pointer-events-none" />
      
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative transition-all duration-300 p-6 lg:p-8",
          isSidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        )}
      >
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </motion.main>
    </div>
  );
};

export default Index;
