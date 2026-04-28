import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  Upload, 
  AlertTriangle, 
  FileText, 
  Settings, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Upload, label: 'Upload Media', path: '/upload' },
  { icon: AlertTriangle, label: 'Violations', path: '/violations' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Legal Notices', path: '/legal' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 overflow-hidden transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white italic">
          SPORTSHIELD <span className="text-blue-500">AI</span>
        </span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
              isActive 
                ? "bg-slate-100 dark:bg-slate-800/50 text-blue-600 dark:text-white border border-slate-200 dark:border-slate-700/50" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-blue-500 -ml-1"></div>
                )}
                <item.icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "group-hover:text-slate-200")} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.label === 'Violations' && (
                  <span className="ml-auto bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    42
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
        
        <div className="pt-4 mt-4 border-t border-slate-800/50">
           <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all transition-colors",
              isActive ? "text-white bg-slate-800/50" : "text-slate-400 hover:text-white"
            )}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-100 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 mb-6 transition-colors">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 text-[8px]">Enterprise Status</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">AI Engine Active</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 w-[88%] h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">88% Capacity utilized</p>
        </div>

        <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-rose-400 transition-colors w-full group">
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
