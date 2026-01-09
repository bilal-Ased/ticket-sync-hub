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
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-48 pl-9 h-10 bg-card border-border rounded-xl input-focus"
          />
        </div>

        {onRefresh && (
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl"
            onClick={onRefresh}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
        )}

        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-xl"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-xl relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
            3
          </span>
        </Button>
      </div>
    </motion.header>
  );
};
