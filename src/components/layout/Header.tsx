import React from 'react';
import { 
  Bell, 
  Search,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const path = location.pathname.split('/').filter(Boolean);
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/upload': return 'Asset Protection';
      case '/violations': return 'Violations Monitoring';
      case '/analytics': return 'Risk Intelligence';
      case '/legal': return 'Legal Takedown Center';
      default: return 'SportShield AI';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{getPageTitle()}</h1>
        <span className="text-slate-300 dark:text-slate-600 hidden md:block">/</span>
        <span className="text-sm text-slate-500 dark:text-slate-400 hidden md:block">
          {path.length === 0 ? 'Command Center' : path[path.length - 1].charAt(0).toUpperCase() + path[path.length - 1].slice(1)}
        </span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative group hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <input 
            type="text" 
            placeholder="Search assets, IDs..." 
            className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all w-48 md:w-64"
          />
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 transition-all duration-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-500 overflow-hidden relative"
          aria-label="Toggle theme"
        >
          <div className="transition-transform duration-500 transform dark:translate-y-10">
             <Sun className="w-5 h-5" />
          </div>
          <div className="absolute top-0 left-0 p-2 transition-transform duration-500 transform -translate-y-10 dark:translate-y-0">
             <Moon className="w-5 h-5" />
          </div>
        </button>

        <div className="relative cursor-pointer group">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></div>
          <Bell className="w-5 h-5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" />
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">Alex Sterling</p>
            <p className="text-[10px] text-slate-500 italic">Head of Security</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-blue-500/50 transition-all overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/10">
            <User className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
