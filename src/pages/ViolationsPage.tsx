import React, { useState, useEffect } from 'react';
import { MetricCard, StatusBadge } from '@/src/components/ui/Cards';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ExternalLink,
  ChevronRight,
  Globe,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { ViolationService } from '@/src/lib/firebaseService';

export default function ViolationsPage() {
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    const data = await ViolationService.getViolations();
    if (data) setViolations(data);
    setLoading(false);
  };

  const criticalCount = violations.filter(v => v.riskLevel === 'Critical').length;
  const underReviewCount = violations.filter(v => v.status === 'Under Review').length;
  const resolvedCount = violations.filter(v => v.status === 'Resolved').length;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight italic">Active Violations</h2>
          <p className="text-slate-500 text-xs font-medium italic">Monitoring 18 platforms across global networks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter by Asset ID..." 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
            <Download className="w-4 h-4" />
            EXPORT REPORT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Total Violations" value={violations.length} accent="slate" trend="up" change="18%" />
        <MetricCard label="Under Review" value={underReviewCount} accent="blue" trend="down" change="5%" />
        <MetricCard label="Resolved" value={resolvedCount} accent="emerald" trend="up" change="12%" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none min-h-[400px] flex flex-col transition-colors">
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-widest text-slate-400 dark:text-slate-500">Asset / ID</th>
                  <th className="px-6 py-4 font-bold tracking-widest text-slate-400 dark:text-slate-500">Platform</th>
                  <th className="px-6 py-4 font-bold tracking-widest text-center text-slate-400 dark:text-slate-500">Match %</th>
                  <th className="px-6 py-4 font-bold tracking-widest text-slate-400 dark:text-slate-500">Risk Level</th>
                  <th className="px-6 py-4 font-bold tracking-widest text-center text-slate-400 dark:text-slate-500">Status</th>
                  <th className="px-6 py-4 font-bold tracking-widest text-right text-slate-400 dark:text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/40">
                {violations.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                       <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">No violations detected yet. Upload assets to start monitoring.</p>
                       <Link to="/upload" className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                         <Plus className="w-4 h-4" /> Go to Upload
                       </Link>
                    </td>
                  </tr>
                ) : violations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200 group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-blue-500/50 transition-colors relative overflow-hidden">
                          <Plus className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{v.assetName}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono tracking-tighter uppercase">ID: {v.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        <span className="italic font-medium">{v.platform}</span>
                       </div>
                       <p className="text-[9px] text-slate-600 mt-0.5">{v.detectedOn}</p>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col items-center gap-1">
                         <span className={cn(
                           "font-black italic tracking-tighter",
                           v.matchScore > 90 ? "text-rose-400" : "text-amber-400"
                         )}>{v.matchScore.toFixed(1)}%</span>
                         <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                           <div className={cn("h-full", v.matchScore > 90 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-amber-500")} style={{ width: `${v.matchScore}%` }} />
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <StatusBadge status={v.riskLevel} />
                    </td>
                    <td className="px-6 py-5 text-center">
                       <StatusBadge status={v.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Link to={`/violations/${v.id}`} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-blue-400 transition-all">
                            <ChevronRight className="w-4 h-4" />
                         </Link>
                         <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
         <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Showing {violations.length} of {violations.length} violations</span>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all cursor-not-allowed opacity-50 shadow-sm">PREV</button>
               <button className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all shadow-sm">NEXT</button>
            </div>
         </div>
      </div>
    </div>
  );
}
