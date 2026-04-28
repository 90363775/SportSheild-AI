import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, ListFilter } from 'lucide-react';
import { MetricCard } from '@/src/components/ui/Cards';
import { cn } from '@/src/lib/utils';

const TREND_DATA = [
  { day: 'May 06', high: 45, medium: 30, low: 20 },
  { day: 'May 07', high: 52, medium: 25, low: 18 },
  { day: 'May 08', high: 48, medium: 35, low: 22 },
  { day: 'May 09', high: 61, medium: 40, low: 25 },
  { day: 'May 10', high: 55, medium: 32, low: 28 },
  { day: 'May 11', high: 65, medium: 38, low: 20 },
  { day: 'May 12', high: 72, medium: 42, low: 22 },
];

const PLATFORM_DATA = [
  { name: 'YouTube', value: 45, color: '#3b82f6' },
  { name: 'Instagram', value: 28, color: '#3b82f6' },
  { name: 'Twitter (X)', value: 20, color: '#3b82f6' },
  { name: 'Facebook', value: 15, color: '#3b82f6' },
  { name: 'Websites', value: 10, color: '#3b82f6' },
];

export function RiskTrendChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={TREND_DATA}>
          <defs>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            dy={10}
          />
          <YAxis 
             axisLine={false} 
             tickLine={false} 
             tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Area type="monotone" dataKey="high" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHigh)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Average Risk Score" value="72/100" accent="rose" isHighPriority trend="up" change="5%" />
        <MetricCard label="Total Platforms Monitored" value="18" accent="blue" trend="up" change="30%" />
        <MetricCard label="Total Content Scanned" value="15,620" accent="emerald" trend="up" change="12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold tracking-widest uppercase text-sm">RISK DETECTION TREND</h3>
              <p className="text-slate-500 text-xs mt-1 italic">High priority violations detected weekly.</p>
            </div>
            <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
          <RiskTrendChart />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center">
             <div>
              <h3 className="text-white font-bold tracking-widest uppercase text-sm">TOP PLATFORMS BY VOLUME</h3>
              <p className="text-slate-500 text-xs mt-1 italic">Distribution of unauthorized content sources.</p>
            </div>
            <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLATFORM_DATA} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {PLATFORM_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              INTELLIGENT INSIGHTS
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-black">Filtered by: Priority</span>
              <button className="p-1 px-2.5 bg-slate-800 rounded-md text-slate-400 border border-slate-700">
                <ListFilter className="w-3.5 h-3.5" />
              </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'YouTube Success', val: '92%', color: 'text-blue-400' },
              { label: 'TikTok Takedowns', val: '88%', color: 'text-rose-400' },
              { label: 'IG Compliance', val: '95%', color: 'text-emerald-400' },
              { label: 'Global Reach', val: '142', color: 'text-white' }
            ].map((insight, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl group hover:border-blue-500/30 transition-all">
                 <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">{insight.label}</p>
                 <p className={cn("text-3xl font-black italic tracking-tighter transition-all group-hover:scale-110", insight.color)}>{insight.val}</p>
                 <div className="mt-4 h-1 w-12 bg-slate-800 rounded-full group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
