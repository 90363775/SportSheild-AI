import React from 'react';
import DashboardPage from './DashboardPage';
import UploadPage from './UploadPage';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  Download,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '@/src/components/ui/Cards';
import { cn } from '@/src/lib/utils';

export default function LegalNoticesPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-8 border-b border-slate-800 bg-slate-900/50">
              <h2 className="text-xl font-bold text-white mb-2">Generate Takedown Notice</h2>
              <p className="text-slate-500 text-xs">Automated legal documentation for DMCA / Intellectual Property rights.</p>
              
              {/* Stepper */}
              <div className="flex items-center mt-8 gap-4">
                {[
                  { n: 1, l: 'Violation', active: true },
                  { n: 2, l: 'Details', active: true },
                  { n: 3, l: 'Preview', active: false },
                  { n: 4, l: 'Finalize', active: false },
                ].map((s, i, arr) => (
                  <React.Fragment key={s.n}>
                    <div className="flex flex-col items-center gap-2">
                       <div className={cn(
                         "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                         s.active ? "bg-blue-600 text-white ring-4 ring-blue-500/10" : "bg-slate-800 text-slate-500"
                       )}>
                         {s.n}
                       </div>
                       <span className={cn("text-[9px] font-bold uppercase tracking-widest", s.active ? "text-white" : "text-slate-600")}>{s.l}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={cn("flex-1 h-0.5 mb-4", s.active ? "bg-blue-600/50" : "bg-slate-800")}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notice Type</label>
                  <select className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors">
                    <option>DMCA Takedown Request</option>
                    <option>IP Infringement Notice</option>
                    <option>Cease & Desist</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Infringer Platform</label>
                  <select className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors">
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Meta (FB/IG)</option>
                    <option>Twitter (X)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Infringing Content URL</label>
                <div className="relative group">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="https://platform.com/v/..." 
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal Arguments / AI Context</label>
                <textarea 
                  rows={4}
                  placeholder="Additional context about the infringement..." 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                 <button className="px-6 py-2.5 text-slate-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">Save Draft</button>
                 <button className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-all flex items-center gap-2 group">
                   GENERATE PREVIEW
                   <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden border-dashed border-2">
              <div className="p-6 border-b border-slate-800 bg-slate-950/40">
                 <h3 className="text-white font-bold text-sm tracking-widest">LIVE PREVIEW</h3>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                 <FileCode className="w-12 h-12 text-slate-700 mb-4 animate-pulse" />
                 <p className="text-slate-500 text-xs italic">
                   Fill in the details to generate the legal notice draft in real-time.
                 </p>
              </div>
           </div>

           <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                 <AlertCircle className="w-5 h-5 text-rose-500" />
                 <h3 className="text-white font-bold text-sm tracking-widest uppercase">STATISTICS</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Notices Issued</span>
                    <span className="text-sm font-bold text-white">1,102</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Response Rate</span>
                    <span className="text-sm font-bold text-emerald-400">98.4%</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Avg Resolution</span>
                    <span className="text-sm font-bold text-blue-400">4.2 hrs</span>
                 </div>
              </div>
              <button className="w-full mt-6 py-2.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-xl hover:bg-slate-700 transition-colors uppercase tracking-widest border border-slate-700">
                DOWNLOAD HISTORY
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
