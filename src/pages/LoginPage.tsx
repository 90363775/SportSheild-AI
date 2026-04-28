import React from 'react';
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/src/components/auth/AuthProvider';

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(244,63,94,0.05),transparent)] pointer-events-none"></div>
      
      {/* Left: Branding & Visuals */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-20 relative">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white italic">
            SPORTSHIELD <span className="text-blue-500">AI</span>
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-7xl font-black text-white italic leading-[0.9] tracking-tighter mb-8">
            PROTECT YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">DIGITAL LEGACY.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-md leading-relaxed font-medium">
            AI-powered digital asset protection engine for world-class sports organizations.
          </p>
          
          <div className="mt-12 flex gap-8">
            <div className="space-y-1">
               <p className="text-3xl font-black text-white italic">12K+</p>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assets Protected</p>
            </div>
            <div className="space-y-1">
               <p className="text-3xl font-black text-emerald-400 italic">98%</p>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Takedown Success</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">
           <CheckCircle2 className="w-4 h-4 text-blue-500" />
           Trusted by Top Tier Leagues
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative z-10">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-10 duration-1000">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight italic">Welcome Back.</h2>
            <p className="text-slate-500 font-medium">Access your global monitoring command center.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Enterprise Email</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="name@organization.com" 
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-600"
                  />
                  <div className="absolute inset-0 rounded-xl bg-blue-500/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Password</label>
                   <a href="#" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">Forgot Access?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-blue-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
               <span className="relative z-10">INITIALIZE COMMAND CENTER</span>
               <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center gap-4 text-slate-800">
               <div className="flex-1 h-px bg-slate-900"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">OAuth Integration</span>
               <div className="flex-1 h-px bg-slate-900"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button 
                 type="button"
                 onClick={login}
                 className="py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-2"
               >
                 Microsoft 365
               </button>
               <button 
                 type="button"
                 onClick={login}
                 className="py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-2"
               >
                 Google SSO
               </button>
            </div>
          </form>

          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Don't have an enterprise account? <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">Contact Sales</a>
          </p>
        </div>
      </div>
    </div>
  );
}
