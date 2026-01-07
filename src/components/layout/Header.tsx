import { motion } from "framer-motion";
import { Search, Bell, RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between pb-8"
    >
      <div>
        <h1 className="text-3xl font-bold">
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-72 pl-11 h-11 glass-subtle border-0 rounded-xl"
          />
        </div>

        {onRefresh && (
          <Button 
            variant="outline" 
            size="icon" 
            className="h-11 w-11 glass-subtle border-0 rounded-xl"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}

        <Button 
          variant="outline" 
          size="icon" 
          className="h-11 w-11 glass-subtle border-0 rounded-xl"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button variant="outline" size="icon" className="h-11 w-11 glass-subtle border-0 rounded-xl relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-accent rounded-full text-[10px] text-white flex items-center justify-center font-medium">
            3
          </span>
        </Button>
      </div>
    </motion.header>
  );
};
