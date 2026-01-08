import { motion } from "framer-motion";
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
  Sparkles
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
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar z-50 flex flex-col transition-all duration-300 border-r border-sidebar-border",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-lg glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className="font-bold text-sidebar-foreground text-lg tracking-tight">
                TicketFlow
              </span>
              <span className="block text-[10px] text-sidebar-muted font-medium uppercase tracking-wider">
                Management
              </span>
            </motion.div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-muted hover:text-sidebar-foreground flex-shrink-0"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-styled">
        {!isCollapsed && (
          <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
        )}
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.02 * index }}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "sidebar-link w-full group",
              activeTab === item.id && "active",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={cn(
              "w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200",
              activeTab !== item.id && "group-hover:scale-110"
            )} />
            {!isCollapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border/50">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors cursor-pointer",
          isCollapsed && "justify-center p-2"
        )}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0 shadow-md">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-sidebar-foreground truncate">
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-[11px] text-sidebar-muted truncate">
                {user?.email || 'admin@company.com'}
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 mt-2 text-[13px] text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
};
