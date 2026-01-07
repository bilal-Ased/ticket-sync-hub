import { motion } from "framer-motion";
import { Search, Bell, Moon, Sun, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-[22px] font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-[14px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-52 pl-9 h-9 text-[13px] bg-secondary/50 border-0 focus:bg-background focus:ring-1"
          />
        </div>

        <Button variant="outline" size="icon" className="h-9 w-9 border-0 bg-secondary/50 hover:bg-secondary">
          <Plus className="w-4 h-4" />
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9 border-0 bg-secondary/50 hover:bg-secondary"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button variant="outline" size="icon" className="h-9 w-9 border-0 bg-secondary/50 hover:bg-secondary relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-semibold">
            3
          </span>
        </Button>
      </div>
    </motion.header>
  );
};