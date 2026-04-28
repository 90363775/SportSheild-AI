import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Youtube, 
  ExternalLink, 
  ShieldAlert, 
  BarChart3,
  MessageSquare,
  Clock,
  User,
  Zap,
  Loader2,
  Globe
} from 'lucide-react';
import { StatusBadge } from '@/src/components/ui/Cards';
import { cn } from '@/src/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

export default function ResultsPage() {
  const { id } = useParams();
  const [violation, setViolation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchViolation() {
      if (!id) return;
      try {
        const docRef = doc(db, 'violations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setViolation({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching violation:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchViolation();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Violation Not Found</h2>
        <Link to="/violations" className="text-blue-500 hover:underline">Return to list</Link>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in zoom-in-95 duration-500">
      <Link to="/violations" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-xs font-bold tracking-widest uppercase">Back to Violations</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match View Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative group">
             <div className="aspect-video bg-black flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
                <div className="w-20 h-20 bg-blue-600/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-all hover:scale-110 hover:bg-blue-600/40 cursor-pointer shadow-2xl group-hover:scale-125">
                   <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                {/* Simulated Metadata Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="px-3 py-1.5 bg-rose-500/80 backdrop-blur-md text-[10px] font-black text-white rounded-md tracking-widest">LIVE DETECTION</div>
                   <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-[10px] font-bold text-slate-200 rounded-md border border-white/10 uppercase tracking-widest">ID: {id}</div>
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] text-white/50 font-mono tracking-widest italic flex items-center gap-2">
                   <Clock className="w-3 h-3" /> 00:00 / 01:24
                </div>
             </div>
             <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-white tracking-tight italic">{violation.assetName}</h2>
                        <StatusBadge status="Critical" />
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                         {[
                           { label: 'PLATFORM', val: violation.platform, icon: Globe, color: 'text-blue-400' },
                           { label: 'STATUS', val: violation.status, icon: ShieldAlert, color: 'text-slate-400' },
                           { label: 'SCORE', val: `${violation.matchScore.toFixed(1)}%`, icon: BarChart3, color: 'text-emerald-400' },
                           { label: 'DETECTED', val: violation.detectedOn ? (violation.detectedOn.toDate ? violation.detectedOn.toDate().toLocaleDateString() : 'Recent') : 'N/A', icon: Clock, color: 'text-amber-400' }
                         ].map((item, i) => (
                           <div key={i} className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-slate-400 transition-colors cursor-default">
                                <item.icon className="w-3 h-3" />
                                {item.label}
                              </p>
                              <p className={cn("text-xs font-bold", item.color)}>{item.val}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                   <button className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl transition-all border border-slate-700 hover:-translate-y-1 active:scale-95 group">
                      <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                   </button>
                </div>

                <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4">
                   <h3 className="text-xs font-bold text-white tracking-widest uppercase">AI FINGERPRINT MATCH</h3>
                   <div className="space-y-4 mt-4">
                      {[
                        { label: 'Visual Match Confidence', val: 99.4, color: 'bg-rose-500' },
                        { label: 'Audio Descriptor Match', val: 96.2, color: 'bg-blue-500' },
                        { label: 'Metadata Fingerprint', val: 100, color: 'bg-emerald-500' },
                        { label: 'Optical Character (OCR)', val: 92.1, color: 'bg-amber-500' }
                      ].map((bar, i) => (
                        <div key={i} className="space-y-1 relative group">
                           <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-slate-400 font-medium group-hover:text-white transition-colors">{bar.label}</span>
                              <span className="text-white font-bold">{bar.val}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={cn("h-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]", bar.color.replace('bg-', 'text-'))} 
                                style={{ width: `${bar.val}%`, backgroundColor: bar.color.includes('rose') ? '#f43f5e' : bar.color.includes('blue') ? '#3b82f6' : bar.color.includes('emerald') ? '#10b981' : '#f59e0b' }} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20 mb-4 animate-pulse">
                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                 </div>
                 <h2 className="text-3xl font-black text-rose-400 italic tracking-tighter">{violation.matchScore.toFixed(1)}%</h2>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MATCH CONFIDENCE</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800">
                 <button className="w-full py-4 bg-blue-600 text-white font-bold text-[11px] rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95 tracking-widest uppercase flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-white" />
                    ISSUE INSTANT TAKEDOWN
                 </button>
                 <Link to="/legal" className="w-full py-4 bg-slate-800 text-slate-300 font-bold text-[11px] rounded-xl hover:bg-slate-700 transition-all border border-slate-700 inline-flex items-center justify-center tracking-widest uppercase">
                    GENERATE LEGAL NOTICE
                 </Link>
                 <button className="w-full py-4 text-slate-500 hover:text-white transition-colors font-bold text-[10px] tracking-widest uppercase">
                    MARK AS FAIR USE
                 </button>
              </div>
           </div>

           <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-6">
              <h3 className="text-blue-400 font-bold text-xs mb-4 tracking-widest uppercase italic">GEMINI AI INSIGHT</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                {violation.insights || "The system confirmed the unauthorized content matches the official asset's unique digital fingerprint using frame-by-frame analysis."}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
