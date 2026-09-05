import { ShieldCheck, ShieldAlert, CheckCircle2, ChevronRight, MessageSquare, AlertTriangle, Activity, Lock, Users, FileText, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const mockTrendData = Array.from({length: 7}).map((_, i) => ({
  name: `Sep 0${i+1}`,
  val: Math.random() * 6 + 2,
}));

export default function IncidentManagement() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">09. INCIDENT / CASE MANAGEMENT</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Track, investigate, and respond to cyber incidents efficiently.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"From detection to resolution."</p>
          <button className="bg-ntro-blue hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2">
            Create Incident +
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          {t: 'Active Incidents', v: '42', tr: '12%', up: true, c: '#ff3b30', ic: ShieldAlert},
          {t: 'Under Investigation', v: '18', tr: '', up: null, c: '#00a3ff', ic: ShieldCheck},
          {t: 'Containment In Progress', v: '8', tr: '', up: null, c: '#ff9500', ic: Lock},
          {t: 'Resolved (7 Days)', v: '27', tr: '35%', up: true, c: '#34c759', ic: CheckCircle2},
          {t: 'Avg. Response Time', v: '2.4 hrs', tr: '18%', up: false, c: '#a855f7', ic: Activity},
        ].map((k, i) => (
          <div key={i} className="glass-panel p-4 flex gap-4 items-center border-t-2" style={{borderTopColor: k.c}}>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${k.c}15`, color: k.c }}>
              <k.ic className="w-6 h-6" />
            </div>
            <div>
               <div className="text-[10px] text-gray-400 font-medium">{k.t}</div>
               <div className="text-xl font-bold text-white tracking-tight">{k.v}</div>
               {k.tr && (
                 <div className={`text-[9px] font-mono mt-0.5 ${k.up ? (k.c==='#ff3b30'?'text-ntro-red':'text-ntro-green') : 'text-ntro-green'}`}>
                   {k.up ? '↑ ' : '↓ '}{k.tr}
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[400px]">
        {/* Incident List */}
        <div className="col-span-7 glass-panel p-5 flex flex-col">
          <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
            <h3 className="text-sm font-semibold text-white">Incident List</h3>
            <div className="flex gap-3 text-xs">
              <select className="bg-navy border border-white/10 rounded px-2 py-1 outline-none"><option>All Severity</option></select>
              <select className="bg-navy border border-white/10 rounded px-2 py-1 outline-none"><option>All Status</option></select>
              <div className="relative">
                <input type="text" placeholder="Search incidents..." className="bg-navy border border-white/10 rounded px-2 py-1 pl-6 w-40 outline-none" />
                <span className="absolute left-1.5 top-1.5 text-gray-400">🔍</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-500 font-mono sticky top-0 bg-navy/90 backdrop-blur pb-2">
                <tr><th className="pb-2 font-normal">ID</th><th className="pb-2 font-normal">Title</th><th className="pb-2 font-normal">Severity</th><th className="pb-2 font-normal">Status</th><th className="pb-2 font-normal">Assigned To</th><th className="pb-2 font-normal text-right">Last Updated</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {id: 'INC-2026-1042', t: 'Phishing campaign (Govt)', sev: 'High', st: 'Investigating', a: 'R. Sharma', time: '12 min ago'},
                  {id: 'INC-2026-1041', t: 'Malware infection (Endpoint)', sev: 'Medium', st: 'Containment', a: 'A. Verma', time: '45 min ago'},
                  {id: 'INC-2026-1039', t: 'Data exfiltration (Finance)', sev: 'Critical', st: 'Investigating', a: 'K. Mehta', time: '2 hours ago'},
                  {id: 'INC-2026-1038', t: 'DDoS attack (Telecom)', sev: 'High', st: 'Mitigated', a: 'P. Iyer', time: '3 hours ago'},
                  {id: 'INC-2026-1035', t: 'Unauthorized access (Power)', sev: 'Medium', st: 'Resolved', a: 'S. Nair', time: '5 hours ago'},
                  {id: 'INC-2026-1031', t: 'Suspicious login activity', sev: 'Low', st: 'Monitoring', a: 'T. Khan', time: '6 hours ago'},
                  {id: 'INC-2026-1028', t: 'Ransomware (Healthcare)', sev: 'Critical', st: 'Containment', a: 'M. Desai', time: '8 hours ago'},
                  {id: 'INC-2026-1024', t: 'Insider threat (Govt)', sev: 'High', st: 'Resolved', a: 'A. Rao', time: '1 day ago'},
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-white/5 cursor-pointer">
                     <td className="py-2.5 font-mono text-gray-400">{r.id}</td>
                     <td className="py-2.5 font-medium text-gray-200">{r.t}</td>
                     <td className="py-2.5"><span className={`px-1.5 py-0.5 rounded border text-[10px] ${r.sev==='Critical'||r.sev==='High'?'text-ntro-red border-ntro-red bg-ntro-red/10': r.sev==='Medium'?'text-ntro-amber border-ntro-amber bg-ntro-amber/10':'text-ntro-green border-ntro-green bg-ntro-green/10'}`}>{r.sev}</span></td>
                     <td className="py-2.5"><span className={`px-1.5 py-0.5 rounded border text-[10px] ${r.st==='Resolved'?'text-ntro-green border-ntro-green bg-ntro-green/10': r.st==='Investigating'?'text-ntro-blue border-ntro-blue bg-ntro-blue/10': 'text-ntro-amber border-ntro-amber bg-ntro-amber/10'}`}>{r.st}</span></td>
                     <td className="py-2.5 text-gray-400">{r.a}</td>
                     <td className="py-2.5 text-right font-mono text-gray-500">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center gap-1 mt-2 text-xs text-gray-400">
             <button className="px-2 py-1 hover:text-white">&lt;</button>
             <button className="px-2 py-1 bg-ntro-blue text-white rounded">1</button>
             <button className="px-2 py-1 hover:text-white">2</button>
             <button className="px-2 py-1 hover:text-white">3</button>
             <button className="px-2 py-1 hover:text-white">4</button>
             <button className="px-2 py-1 hover:text-white">5</button>
             <button className="px-2 py-1 hover:text-white">&gt;</button>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-5 flex flex-col gap-6">
           {/* Workflow */}
           <div className="glass-panel p-5 flex flex-col justify-center">
             <h3 className="text-sm font-semibold text-white mb-4">Incident Workflow</h3>
             <div className="flex items-center justify-between relative">
               <div className="absolute top-4 left-6 right-6 h-[1px] bg-white/10 z-0 border-t border-dashed border-white/20"></div>
               {[
                 {l: 'Detection', c: 'bg-ntro-red text-white shadow-[0_0_10px_#ff3b30]', ic: ShieldAlert},
                 {l: 'Analysis', c: 'bg-ntro-blue text-white shadow-[0_0_10px_#00a3ff]', ic: Activity},
                 {l: 'Containment', c: 'bg-navy border border-ntro-amber text-ntro-amber', ic: Lock},
                 {l: 'Eradication', c: 'bg-navy border border-purple-500 text-purple-500', ic: Target},
                 {l: 'Recovery', c: 'bg-navy border border-ntro-green text-ntro-green', ic: CheckCircle2},
               ].map((w, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 z-10">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${w.c}`}><w.ic className="w-4 h-4"/></div>
                   <div className="text-[10px] text-gray-300">{w.l}</div>
                 </div>
               ))}
             </div>
           </div>

           <div className="flex gap-6 h-full">
             {/* Severity Donut */}
             <div className="glass-panel p-5 flex-1 flex flex-col">
               <h3 className="text-sm font-semibold text-white mb-2">Incident Severity Distribution</h3>
               <div className="flex items-center justify-between flex-1">
                 <div className="w-24 h-24 relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={[{v:14},{v:38},{v:31},{v:17}]} innerRadius={30} outerRadius={45} dataKey="v" stroke="none">
                         <Cell fill="#ff3b30"/>
                         <Cell fill="#ff9500"/>
                         <Cell fill="#00a3ff"/>
                         <Cell fill="#34c759"/>
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <div className="text-lg font-bold text-white">42</div>
                     <div className="text-[8px] text-gray-400 text-center leading-tight">Total<br/>Incidents</div>
                   </div>
                 </div>
                 <div className="flex flex-col gap-1.5 text-[10px]">
                   <div className="flex items-center gap-4 justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-ntro-red rounded-full"></span><span className="text-gray-300">Critical</span></div> <span className="font-mono text-gray-400">14%</span></div>
                   <div className="flex items-center gap-4 justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-ntro-amber rounded-full"></span><span className="text-gray-300">High</span></div> <span className="font-mono text-gray-400">38%</span></div>
                   <div className="flex items-center gap-4 justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-ntro-blue rounded-full"></span><span className="text-gray-300">Medium</span></div> <span className="font-mono text-gray-400">31%</span></div>
                   <div className="flex items-center gap-4 justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-ntro-green rounded-full"></span><span className="text-gray-300">Low</span></div> <span className="font-mono text-gray-400">17%</span></div>
                 </div>
               </div>
             </div>
             
             {/* Response Time Trend */}
             <div className="glass-panel p-5 flex-1 flex flex-col">
               <h3 className="text-sm font-semibold text-white mb-2">Response Time Trend</h3>
               <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2 pl-4"><span className="w-1.5 h-1.5 bg-ntro-blue rounded-full"></span> Avg. Response (hrs)</div>
               <div className="flex-1 w-full -ml-6">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={mockTrendData}>
                     <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} />
                     <YAxis tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} domain={[0, 8]} />
                     <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px'}} />
                     <Line type="monotone" dataKey="val" stroke="#00a3ff" strokeWidth={2} dot={{r: 3, fill: '#00a3ff'}} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[180px]">
        {/* Recent Activity */}
        <div className="col-span-4 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {[
              {ic: AlertTriangle, c: 'text-ntro-red bg-ntro-red/10', t: 'Incident INC-2026-1039 escalated to Critical', time: '8 min ago'},
              {ic: FileText, c: 'text-ntro-blue bg-ntro-blue/10', t: 'Forensic analysis report uploaded (INC-2026-1038)', time: '32 min ago'},
              {ic: MessageSquare, c: 'text-gray-400 bg-white/10', t: 'New comment added by R. Sharma (INC-2026-1042)', time: '1 hour ago'},
            ].map((a, i) => (
              <div key={i} className="flex gap-3 border-b border-white/5 pb-2 last:border-0 items-start">
                <div className={`p-1.5 rounded-full ${a.c}`}><a.ic className="w-3 h-3" /></div>
                <div>
                  <div className="text-xs text-gray-300">{a.t}</div>
                  <div className="text-[9px] text-gray-500 font-mono mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration */}
        <div className="col-span-4 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-3">Collaboration</h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border border-navy overflow-hidden bg-gray-500 flex items-center justify-center text-xs"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=A`} /></div>
              <div className="w-8 h-8 rounded-full border border-navy overflow-hidden bg-ntro-blue flex items-center justify-center text-xs text-white">AK</div>
              <div className="w-8 h-8 rounded-full border border-navy overflow-hidden bg-ntro-amber flex items-center justify-center text-xs text-white">PM</div>
              <div className="w-8 h-8 rounded-full border border-navy overflow-hidden bg-gray-700 flex items-center justify-center text-xs text-white font-mono">+4</div>
            </div>
          </div>
          <div className="bg-navy border border-white/5 p-3 rounded-lg flex-1 relative">
             <div className="absolute -left-2 top-4 w-4 h-4 bg-navy border-l border-t border-white/5 rotate-[-45deg]"></div>
             <p className="text-[11px] text-gray-300 leading-relaxed relative z-10">
               "Team, let's prioritize the Finance sector incident. Collect memory dumps ASAP."
             </p>
             <div className="text-[9px] text-gray-500 font-mono mt-2 relative z-10">— R. Sharma (Incident Lead)</div>
          </div>
        </div>

        {/* Hacker Banner */}
        <div className="col-span-4 glass-panel p-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/images/media_1788618195248.png')] bg-cover bg-center opacity-40 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
          <div className="relative z-10 p-6 flex flex-col h-full justify-center">
            <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-wider leading-tight">
              RESPOND TODAY.<br/>A STRONGER TOMORROW.
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">Unified incident management for a resilient India.</p>
            <button className="bg-ntro-blue hover:bg-blue-600 text-white text-xs px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors self-start shadow-[0_0_15px_rgba(0,163,255,0.4)]">
              View Incident Reports <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
