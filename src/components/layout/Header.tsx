import { motion } from "framer-motion";
import { Search, Bell, Moon, Sun, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header = ({ title, subtitle, onRefresh, isRefreshing }: HeaderProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            className="text-sm text-muted-foreground mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-48 sm:w-56 pl-10 h-10 text-sm bg-card border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {onRefresh && (
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-border/50 bg-card hover:bg-accent"
            onClick={onRefresh}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
        )}

        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-xl border-border/50 bg-card hover:bg-accent"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-xl border-border/50 bg-card hover:bg-accent relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold shadow-lg">
            3
          </span>
        </Button>
      </motion.div>
    </motion.header>
  );
};
