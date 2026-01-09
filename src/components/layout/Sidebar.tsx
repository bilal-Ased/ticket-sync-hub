import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Ticket, 
  Building2, 
  Download, 
  Clock, 
  Mail, 
  Settings,
  ChevronLeft,
  LogOut,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "import", label: "Import", icon: Download },
  { id: "cron", label: "Cron Jobs", icon: Clock },
  { id: "email", label: "Email", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) => {
  const { user, signOut } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar z-50 flex flex-col border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 glow-primary">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <h1 className="font-bold text-sidebar-foreground text-lg whitespace-nowrap">
                  TicketFlow
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onToggleCollapse}
          className="icon-btn flex-shrink-0"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 transition-transform duration-200",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-semibold text-sidebar-muted uppercase tracking-widest px-4 mb-3"
            >
              Menu
            </motion.p>
          )}
        </AnimatePresence>
        
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "nav-item w-full",
                activeTab === item.id && "active",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent",
          isCollapsed && "justify-center p-2"
        )}>
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-sidebar-muted truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.button
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => signOut()}
              className="flex items-center gap-2 w-full px-4 py-2.5 mt-2 text-sm text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
