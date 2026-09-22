import { Settings, Heart, Link, Database, Cpu, HardDrive, Clock, Search, ChevronRight, ShieldAlert, Activity } from 'lucide-react';

export default function SystemConfiguration() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">12. SYSTEM CONFIGURATION</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Manage system settings, data sources, models, users, and integrations.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"Configure smarter. Operate stronger."</p>
          <button className="bg-ntro-blue hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2">
            Save Changes
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-4">
        {[
          {t: 'System Health', v: 'Healthy', tr: '100%', up: true, c: '#34c759', ic: Heart},
          {t: 'Active Integrations', v: '12 / 14', tr: '9%', up: true, c: '#a855f7', ic: Link},
          {t: 'Data Pipelines', v: '8 / 8', tr: 'Online', up: true, c: '#00a3ff', ic: Database},
          {t: 'Model Services', v: '6 / 6', tr: 'Running', up: true, c: '#34c759', ic: Cpu},
          {t: 'Storage Usage', v: '3.2 TB', tr: '12%', up: true, c: '#a855f7', ic: HardDrive},
          {t: 'Uptime', v: '99.97%', tr: '0.02%', up: true, c: '#34c759', ic: Clock},
        ].map((k, i) => (
          <div key={i} className="glass-panel p-4 flex gap-4 items-center border-t-2" style={{borderTopColor: k.c}}>
            <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${k.c}15`, color: k.c }}>
              <k.ic className="w-5 h-5" />
            </div>
            <div>
               <div className="text-[9px] text-gray-400 font-medium whitespace-nowrap">{k.t}</div>
               <div className="text-lg font-bold text-white tracking-tight">{k.v}</div>
               <div className={`text-[9px] font-mono mt-0.5 ${k.up ? 'text-ntro-green' : 'text-gray-400'}`}>
                 {k.tr === 'Online' || k.tr === 'Running' ? k.tr : <>↑ {k.tr}</>}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[550px]">
        {/* System Architecture */}
        <div className="col-span-7 glass-panel p-5 flex flex-col relative overflow-hidden">
           <h3 className="text-sm font-semibold text-white mb-8 relative z-10">System Architecture</h3>
           
           <div className="absolute inset-0 bg-[url('/images/media_1788618016749.png')] bg-cover bg-center opacity-10 mix-blend-screen" />
           
           <div className="flex-1 relative flex items-center justify-between px-4 z-10 pb-10">
              
              {/* Left Column (Inputs) */}
              <div className="flex flex-col justify-between h-full space-y-4">
                 {[
                   {n: 'Threat Feeds', d: 'Global & Regional', ic: ShieldAlert},
                   {n: 'Internal Data', d: 'Logs, Assets, Incidents', ic: Database},
                   {n: 'Simulations', d: 'Synthetic & Real-world', ic: Activity},
                   {n: 'User Inputs', d: 'Analyst Queries', ic: Search},
                 ].map((node, i) => (
                   <div key={i} className="w-48 bg-navy border border-ntro-blue/30 rounded-lg p-3 flex items-center gap-3 relative z-10 shadow-[0_0_15px_rgba(0,163,255,0.1)] group hover:border-ntro-blue transition-colors cursor-pointer">
                     <div className="p-2 rounded bg-ntro-blue/10 text-ntro-blue"><node.ic className="w-4 h-4"/></div>
                     <div>
                       <div className="text-xs font-semibold text-white">{node.n}</div>
                       <div className="text-[9px] text-gray-400">{node.d}</div>
                     </div>
                   </div>
                 ))}
              </div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
                 <path d="M 210 50 C 280 50, 320 180, 390 180" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
                 <path d="M 210 130 C 280 130, 320 180, 390 180" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
                 <path d="M 210 210 C 280 210, 320 180, 390 180" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
                 <path d="M 210 290 C 280 290, 320 180, 390 180" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
                 
                 <path d="M 570 180 C 640 180, 680 50, 750 50" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
                 <path d="M 570 180 C 640 180, 680 130, 750 130" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
                 <path d="M 570 180 C 640 180, 680 210, 750 210" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
                 <path d="M 570 180 C 640 180, 680 290, 750 290" stroke="rgba(0,163,255,0.3)" strokeWidth="2" fill="none" />
              </svg>

              {/* Center Core (NTRO) */}
              <div className="w-56 h-32 bg-navy border-2 border-ntro-blue rounded-xl flex flex-col items-center justify-center relative z-10 shadow-[0_0_40px_rgba(121,183,194,0.12)]">
                <div className="absolute inset-0 bg-ntro-blue/5 rounded-xl animate-pulse" />
                <h2 className="text-xl font-bold text-white tracking-widest mb-1 relative z-10">NTRO</h2>
                <div className="text-xs text-ntro-blue font-mono tracking-widest relative z-10">AI CYBER FORECAST</div>
              </div>

              {/* Right Column (Outputs) */}
              <div className="flex flex-col justify-between h-full space-y-4">
                 {[
                   {n: 'AI/ML Models', d: 'Detection, Prediction', ic: Cpu},
                   {n: 'Analytics Engine', d: 'Correlation & Risk Scoring', ic: Activity},
                   {n: 'Storage Layer', d: 'Data Lake & Metadata', ic: Database},
                   {n: 'Visualization', d: 'Dashboards & Reports', ic: Settings},
                 ].map((node, i) => (
                   <div key={i} className="w-48 bg-navy border border-ntro-blue/30 rounded-lg p-3 flex items-center gap-3 relative z-10 shadow-[0_0_15px_rgba(0,163,255,0.1)] group hover:border-ntro-blue transition-colors cursor-pointer">
                     <div className="p-2 rounded bg-ntro-blue/10 text-ntro-blue"><node.ic className="w-4 h-4"/></div>
                     <div>
                       <div className="text-xs font-semibold text-white">{node.n}</div>
                       <div className="text-[9px] text-gray-400">{node.d}</div>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Service Status */}
        <div className="col-span-5 glass-panel p-5 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-4">Service Status</h3>
           <div className="flex-1 overflow-y-auto scrollbar-hide">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-500 font-mono sticky top-0 bg-navy/90 backdrop-blur pb-2">
                  <tr><th className="pb-2 font-normal">Service</th><th className="pb-2 font-normal">Status</th><th className="pb-2 font-normal">Uptime</th><th className="pb-2 font-normal text-center">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    {s: 'Threat Ingestion Service', st: 'Running', u: '99.98%'},
                    {s: 'ML Model Service', st: 'Running', u: '99.95%'},
                    {s: 'Analytics Engine', st: 'Running', u: '99.97%'},
                    {s: 'Simulation Engine', st: 'Running', u: '99.92%'},
                    {s: 'Database (Primary)', st: 'Running', u: '99.99%'},
                    {s: 'Database (Replica)', st: 'Running', u: '99.96%'},
                    {s: 'API Gateway', st: 'Running', u: '99.98%'},
                    {s: 'Notification Service', st: 'Running', u: '99.93%'},
                    {s: 'Auth Service', st: 'Running', u: '99.99%'},
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="py-3 font-medium text-gray-200">{r.s}</td>
                      <td className="py-3 flex items-center gap-2 text-ntro-green">
                        <span className="w-2 h-2 bg-ntro-green rounded-full shadow-[0_0_5px_#34c759]"></span> {r.st}
                      </td>
                      <td className="py-3 font-mono text-gray-400">{r.u}</td>
                      <td className="py-3">
                         <div className="flex justify-center gap-2">
                            <button className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400"><Play className="w-3 h-3" /></button>
                            <button className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400"><Settings className="w-3 h-3" /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}

// Inline Play icon since it wasn't imported from lucide-react in the top block
const Play = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
