import { Database, Play, Activity, CheckCircle2, ChevronRight, Server, Shield, Network, Zap } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const mockTrendData = Array.from({length: 6}).map((_, i) => ({
  name: `Sep ${10+i}`,
  val: Math.random() * 40 + 40,
}));

export default function DataSimulationLab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">11. DATA & SIMULATION LAB</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Explore datasets, run simulations, and test threat scenarios.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"Simulate today. Stay prepared tomorrow."</p>
          <button className="bg-ntro-blue hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2">
            Run New Simulator +
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          {t: 'Total Datasets', v: '48', tr: '22%', up: true, c: '#00a3ff', ic: Database},
          {t: 'Simulations Run', v: '126', tr: '10%', up: false, c: '#ff3b30', ic: Play},
          {t: 'Active Scenarios', v: '12', tr: '32%', up: true, c: '#ff9500', ic: Activity},
          {t: 'Storage Usage', v: '3.2 TB', tr: '12%', up: true, c: '#a855f7', ic: Server},
          {t: 'Stored with Alerts', v: '8', tr: '14%', up: true, c: '#34c759', ic: Shield},
        ].map((k, i) => (
          <div key={i} className="glass-panel p-4 flex gap-4 items-center border-t-2" style={{borderTopColor: k.c}}>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${k.c}15`, color: k.c }}>
              <k.ic className="w-6 h-6" />
            </div>
            <div>
               <div className="text-[10px] text-gray-400 font-medium">{k.t}</div>
               <div className="text-xl font-bold text-white tracking-tight">{k.v}</div>
               <div className={`text-[9px] font-mono mt-0.5 ${k.up ? 'text-ntro-green' : 'text-ntro-red'}`}>
                 {k.up ? '↑ ' : '↓ '}{k.tr}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[400px]">
        {/* Dataset Library */}
        <div className="col-span-5 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Dataset Library</h3>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-xs text-left text-gray-400">
              <thead className="text-gray-500 font-mono sticky top-0 bg-navy/90 backdrop-blur pb-2">
                <tr><th className="pb-2 font-normal">Dataset Name</th><th className="pb-2 font-normal">Type</th><th className="pb-2 font-normal">Records</th><th className="pb-2 font-normal">Last Updated</th><th className="pb-2 font-normal text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {n: 'Indian Bank Transactions', ty: 'Financial', r: '12.8M', d: 'Sep 04, 2026', s: 'Ready', c: 'text-ntro-green border-ntro-green bg-ntro-green/10'},
                  {n: 'UPI Fraud Patterns', ty: 'Financial', r: '8.5M', d: 'Sep 03, 2026', s: 'Ready', c: 'text-ntro-green border-ntro-green bg-ntro-green/10'},
                  {n: 'Malware Samples', ty: 'Security', r: '2.3M', d: 'Aug 28, 2026', s: 'Processing', c: 'text-ntro-blue border-ntro-blue bg-ntro-blue/10'},
                  {n: 'Phishing URLs', ty: 'Security', r: '1.5M', d: 'Sep 05, 2026', s: 'Ready', c: 'text-ntro-green border-ntro-green bg-ntro-green/10'},
                  {n: 'Network Traffic (Telecom)', ty: 'Network', r: '82M', d: 'Aug 29, 2026', s: 'Ready', c: 'text-ntro-green border-ntro-green bg-ntro-green/10'},
                  {n: 'Government Infra Logs', ty: 'Infrastructure', r: '18.4M', d: 'Sep 01, 2026', s: 'Ready', c: 'text-ntro-green border-ntro-green bg-ntro-green/10'},
                  {n: 'IoT Device Telemetry', ty: 'IoT', r: '4.2M', d: 'Aug 29, 2026', s: 'Processing', c: 'text-ntro-blue border-ntro-blue bg-ntro-blue/10'},
                  {n: 'Dark Web Intelligence', ty: 'Threat Intel', r: '6.8M', d: 'Sep 01, 2026', s: 'Ready', c: 'text-ntro-green border-ntro-green bg-ntro-green/10'},
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-white/5 cursor-pointer">
                     <td className="py-2.5 font-medium text-gray-200">{r.n}</td>
                     <td className="py-2.5">{r.ty}</td>
                     <td className="py-2.5 font-mono text-gray-300">{r.r}</td>
                     <td className="py-2.5 text-gray-500">{r.d}</td>
                     <td className="py-2.5 text-right"><span className={`px-1.5 py-0.5 rounded border text-[9px] ${r.c}`}>{r.s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulation Scenarios */}
        <div className="col-span-4 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Simulation Scenarios</h3>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {[
              {t: 'Ransomware Outbreak', d: 'Simulate ransomware spread across government infra.', c: 'text-ntro-red bg-ntro-red/10'},
              {t: 'DDoS Attack Simulation', d: 'Model large-scale DDoS on telecom network.', c: 'text-ntro-red bg-ntro-red/10'},
              {t: 'Fraud Transaction Simulation', d: 'Generate synthetic financial fraud scenarios.', c: 'text-ntro-red bg-ntro-red/10'},
              {t: 'Insider Threat Simulation', d: 'Simulate anomalous data exfiltration behavior.', c: 'text-ntro-red bg-ntro-red/10'},
              {t: 'APT Campaign Simulation', d: 'End-to-end APT attack lifecycle simulation.', c: 'text-ntro-red bg-ntro-red/10'},
            ].map((s, i) => (
              <div key={i} className="bg-navy border border-white/5 p-3 rounded-lg flex items-center justify-between group hover:border-ntro-blue/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded flex items-center justify-center ${s.c}`}><Activity className="w-4 h-4"/></div>
                  <div>
                    <div className="text-xs font-semibold text-white">{s.t}</div>
                    <div className="text-[9px] text-gray-400 w-44 truncate">{s.d}</div>
                  </div>
                </div>
                <button className="bg-ntro-blue/20 text-ntro-blue border border-ntro-blue/30 px-3 py-1 rounded text-[10px] group-hover:bg-ntro-blue group-hover:text-white transition-colors">Run &gt;</button>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Results */}
        <div className="col-span-3 flex flex-col gap-6">
           <div className="glass-panel p-5 flex flex-col flex-1">
             <h3 className="text-sm font-semibold text-white mb-2">Simulation Results</h3>
             <div className="flex items-center justify-center gap-2 text-[10px] text-ntro-blue mb-2"><span className="w-1.5 h-1.5 bg-ntro-blue rounded-full"></span> Threat Impact Score</div>
             <div className="flex-1 w-full -ml-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={mockTrendData}>
                   <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} />
                   <YAxis tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} domain={[0, 100]} />
                   <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px'}} />
                   <Line type="monotone" dataKey="val" stroke="#00a3ff" strokeWidth={2} dot={{r: 3, fill: '#00a3ff'}} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="glass-panel p-4 flex justify-between items-center bg-navy/80">
              <div className="text-center">
                <div className="text-lg font-bold text-white">12</div>
                <div className="text-[9px] text-gray-400">Scenarios</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-ntro-red">8</div>
                <div className="text-[9px] text-gray-400">High Risk</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-ntro-amber">3</div>
                <div className="text-[9px] text-gray-400">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-ntro-green">1</div>
                <div className="text-[9px] text-gray-400">Low</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[180px]">
         {/* Controls */}
         <div className="col-span-4 glass-panel p-5 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-4">Environmental Controls</h3>
           <div className="grid grid-cols-4 gap-3 flex-1">
             {[
               {l: 'Virtual Network\nIsolated Environment', ic: Network},
               {l: 'Custom Topologies\nBuild custom setups', ic: Database},
               {l: 'Scenario Editor\nCreate custom attacks', ic: Zap},
               {l: 'Real-time Actions\nBlock & Isolate', ic: Shield},
             ].map((c, i) => (
               <div key={i} className="bg-navy border border-white/5 rounded-lg flex flex-col items-center justify-center p-2 text-center hover:border-ntro-blue/30 cursor-pointer transition-colors group">
                 <c.ic className="w-5 h-5 text-gray-400 mb-2 group-hover:text-ntro-blue" />
                 <div className="text-[9px] text-gray-300 leading-tight whitespace-pre-line">{c.l}</div>
               </div>
             ))}
           </div>
         </div>

         {/* Recent */}
         <div className="col-span-5 glass-panel p-5 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-3">Recent Simulations</h3>
           <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide text-xs">
              {[
                {id: 'SIM-2026-047', n: 'Ransomware (Gov)', r: 'High', rc: 'text-ntro-red border-ntro-red bg-ntro-red/10', s: 'Completed', sc: 'text-ntro-green', t: '1 hour ago'},
                {id: 'SIM-2026-028', n: 'UPI Fraud (Synthetic)', r: 'Medium', rc: 'text-ntro-amber border-ntro-amber bg-ntro-amber/10', s: 'Completed', sc: 'text-ntro-green', t: '2 hours ago'},
                {id: 'SIM-2026-051', n: 'DDoS (Telecom)', r: 'High', rc: 'text-ntro-red border-ntro-red bg-ntro-red/10', s: 'Completed', sc: 'text-ntro-green', t: '4 hours ago'},
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-gray-500">{s.id}</div>
                    <div className="text-gray-200">{s.n}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] ${s.rc}`}>{s.r}</span>
                    <span className={`px-1.5 py-0.5 rounded border border-white/10 text-[9px] ${s.sc} bg-white/5`}>{s.s}</span>
                    <span className="font-mono text-gray-500 w-16 text-right">{s.t}</span>
                  </div>
                </div>
              ))}
           </div>
         </div>

         {/* CTA */}
         <div className="col-span-3 glass-panel p-0 relative overflow-hidden group border-ntro-blue/30">
            <div className="absolute inset-0 bg-[url('/images/media_1788617709386.jpg')] bg-cover bg-center opacity-40 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-transparent" />
            <div className="relative z-10 flex flex-col justify-center h-full p-6">
              <h3 className="text-xl font-bold text-white leading-tight uppercase tracking-widest drop-shadow-[0_0_10px_#00a3ff]">
                TEST.<br/>LEARN.<br/>STAY AHEAD.
              </h3>
              <p className="text-[10px] text-gray-400 mt-2 font-mono">Simulate for a more<br/>resilient India.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
