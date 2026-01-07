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
  LogOut
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
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar z-50 flex flex-col transition-all duration-200",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.span 
              className="font-semibold text-sidebar-foreground text-sm whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              TicketFlow
            </motion.span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-sidebar-accent transition-colors text-sidebar-muted hover:text-sidebar-foreground flex-shrink-0"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform duration-200", isCollapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 * index }}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "sidebar-link w-full",
              activeTab === item.id && "active"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <span>{item.label}</span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-2.5 mb-2",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-medium flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                {user?.email || 'admin@company.com'}
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
};