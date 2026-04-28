import React, { useState, useEffect } from 'react';
import { MetricCard, StatusBadge } from '@/src/components/ui/Cards';
import { cn } from '@/src/lib/utils';
import { 
  Plus, 
  ChevronRight, 
  ArrowRight,
  Globe,
  Zap,
  ExternalLink,
  BarChart3,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ViolationService, AssetService } from '@/src/lib/firebaseService';
import { useTheme } from '../components/ThemeContext';

export default function DashboardPage() {
  const { theme } = useTheme();
  const [violations, setViolations] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [v, a] = await Promise.all([
          ViolationService.getViolations(),
          AssetService.getMyAssets()
        ]);
        if (v) setViolations(v);
        if (a) setAssets(a);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const criticalViolations = violations.filter(v => v.riskLevel === 'Critical');
  const openCount = violations.filter(v => v.status === 'Open').length;
  
  const riskGroups = violations.reduce((acc: any, v) => {
    acc[v.riskLevel] = (acc[v.riskLevel] || 0) + 1;
    return acc;
  }, {});

  const RISK_DISTRIBUTION = [
    { name: 'Critical/High', value: (riskGroups['Critical'] || 0) + (riskGroups['High'] || 0), color: '#f43f5e' },
    { name: 'Medium', value: riskGroups['Medium'] || 0, color: '#f59e0b' },
    { name: 'Low/Review', value: (riskGroups['Low'] || 0) + (riskGroups['Review'] || 0), color: '#10b981' },
  ];

  if (loading) {
    return (
      <div className="p-8 h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Protected Assets" 
          value={assets.length.toLocaleString()} 
          change="+1" 
          trend="up" 
          accent="slate" 
        />
        <MetricCard 
          label="Active Violations" 
          value={openCount.toString()} 
          accent="rose" 
          isHighPriority 
        />
        <MetricCard 
          label="Avg Risk Score" 
          value={violations.length > 0 ? (violations.reduce((acc, v) => acc + (v.matchScore || 0), 0) / violations.length).toFixed(1) : "0"} 
          change="0.0%" 
          trend="down" 
          accent="slate" 
        />
        <MetricCard 
          label="Monitoring Platforms" 
          value="18" 
          change="+2" 
          trend="up" 
          accent="emerald" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm dark:shadow-none transition-colors">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">REAL-TIME DETECTION FEED</h2>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">All Platforms</button>
                <button className="px-3 py-1.5 bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/20 dark:border-blue-500/30 text-[11px] rounded-lg text-blue-600 dark:text-blue-400 font-bold">Priority Only</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Asset / ID</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Platform</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Match Confidence</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Risk Level</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/40">
                  {violations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No violations detected lately.</td>
                    </tr>
                  ) : violations.slice(0, 5).map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-blue-500 transition-colors overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 dark:from-blue-500/10 to-transparent"></div>
                            <Plus className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{v.assetName}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {v.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 italic">
                          <Globe className="w-3 h-3 text-slate-500" />
                          {v.platform}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "font-mono font-bold",
                             v.matchScore > 90 ? "text-rose-400" : "text-amber-400"
                           )}>{v.matchScore?.toFixed(1)}%</span>
                           <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                             <div 
                               className={cn("h-full", v.matchScore > 90 ? "bg-rose-500" : "bg-amber-500")}
                               style={{ width: `${v.matchScore}%` }}
                             />
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={v.riskLevel} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link to={`/violations/${v.id}`} className="text-blue-400 font-bold hover:text-white inline-flex items-center gap-1 transition-colors">
                          Inspect <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-950/20 flex justify-center">
              <button className="text-[11px] font-bold text-slate-500 hover:text-white flex items-center gap-2 group tracking-widest transition-colors">
                VIEW ALL VIOLATIONS
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-blue-500/10"></div>
            
            <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              RISK DISTRIBUTION
            </h2>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RISK_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {RISK_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0', borderRadius: '8px' }}
                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#0f172a', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{violations.length}</p>
                <p className="text-[8px] uppercase tracking-tighter text-slate-400 dark:text-slate-500 font-bold">Total Scanned</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {RISK_DISTRIBUTION.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      {item.name} Risk
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">{item.value} Assets</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${violations.length > 0 ? (item.value / violations.length) * 100 : 0}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 shadow-xl shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] transition-all group-hover:scale-110"></div>
            <div className="flex items-start justify-between mb-4 relative z-10">
              <Zap className="w-8 h-8 text-white/50 fill-white/10" />
              <span className="text-[10px] font-black bg-white/20 px-2.5 py-1 rounded-md text-white tracking-widest backdrop-blur-sm">PREMIUM</span>
            </div>
            <h3 className="text-white text-lg font-bold leading-tight relative z-10">Shield Automation Active</h3>
            <p className="text-blue-100 text-xs mt-2 mb-6 relative z-10 leading-relaxed font-medium">
              Gemini AI identified 12 high-priority violations that bypass normal filters. Deploy the automated legal notice engine now.
            </p>
            <button className="w-full py-3 bg-white text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-white/10 relative z-10">
              ACTIVATE SHIELD ENGINE
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
