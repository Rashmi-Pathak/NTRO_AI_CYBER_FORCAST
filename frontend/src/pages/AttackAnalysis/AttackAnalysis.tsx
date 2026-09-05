import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, AlertTriangle, Target, Search, Filter, Download, MoreHorizontal, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { api, Forecast } from '@/services/api';

const trendData = Array.from({length: 7}).map((_, i) => ({
  name: `Sep 0${i+1}`,
  high: Math.random() * 20 + 20,
  med: Math.random() * 30 + 40,
  low: Math.random() * 10 + 20,
}));

export default function AttackAnalysis() {
  const navigate = useNavigate();
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getForecasts().then(setForecasts);
  }, []);

  const filtered = forecasts.filter(f => f.id.toLowerCase().includes(search.toLowerCase()) || f.targetAsset.toLowerCase().includes(search.toLowerCase()) || f.attackType.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">04. ATTACK ANALYSIS</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Analyze AI-generated threat predictions, attack patterns, and emerging risks.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"Turn data into action."</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        {[
          {t: 'Total Predicted Attacks', v: '148', tr: '12%', up: true, c: '#00a3ff', ic: Activity},
          {t: 'High Risk Predictions', v: '37', tr: '24%', up: true, c: '#ff3b30', ic: AlertTriangle},
          {t: 'Medium Risk', v: '68', tr: '8%', up: true, c: '#ff9500', ic: ShieldCheck},
          {t: 'Low Risk', v: '43', tr: '11%', up: false, c: '#34c759', ic: ShieldCheck},
          {t: 'Avg. Prediction Confidence', v: '78.6%', tr: '6.2%', up: true, c: '#a855f7', ic: Target},
        ].map((k, i) => (
          <div key={i} className="glass-panel p-4 flex gap-4 items-center border-t-2" style={{borderTopColor: k.c}}>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${k.c}15`, color: k.c }}>
              <k.ic className="w-6 h-6" />
            </div>
            <div>
               <div className="text-[10px] text-gray-400 font-medium">{k.t}</div>
               <div className="text-xl font-bold text-white tracking-tight">{k.v}</div>
               <div className={`text-[9px] font-mono mt-0.5 ${k.up ? (k.c==='#ff3b30'?'text-ntro-red':'text-ntro-green') : 'text-ntro-green'}`}>
                 {k.up ? '↑ ' : '↓ '} {k.tr} vs last 24h
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
         <select className="flex-1 bg-navy border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none"><option>All Sectors</option></select>
         <select className="flex-1 bg-navy border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none"><option>All Risk Levels</option></select>
         <select className="flex-1 bg-navy border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none"><option>All Attack Types</option></select>
         <select className="flex-1 bg-navy border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none"><option>All Stages</option></select>
         <select className="flex-1 bg-navy border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none"><option>All Status</option></select>
         <div className="flex-1 bg-navy border border-white/10 rounded-md px-3 py-2 text-sm text-white flex items-center justify-center font-mono">Aug 30, 2026 - Sep 05, 2026</div>
         <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-md text-sm transition-colors">Reset</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Prediction Table */}
        <div className="glass-panel p-5 flex flex-col h-[500px]">
          <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
            <h3 className="text-sm font-semibold text-white">Predicted Attack Scenarios ({filtered.length})</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by ID, source, target..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-navy border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white outline-none focus:border-ntro-blue w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-md text-sm"><Download className="w-4 h-4"/> Export</button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-md text-sm"><Filter className="w-4 h-4"/> Columns</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-500 font-mono sticky top-0 bg-navy/90 backdrop-blur pb-2 z-10">
                <tr>
                  <th className="pb-2 font-normal pl-2 w-8"><input type="checkbox" className="rounded border-gray-600 bg-navy" /></th>
                  <th className="pb-2 font-normal">ID</th>
                  <th className="pb-2 font-normal">Detected</th>
                  <th className="pb-2 font-normal">Attack Type</th>
                  <th className="pb-2 font-normal">Sector</th>
                  <th className="pb-2 font-normal">Current Stage</th>
                  <th className="pb-2 font-normal">Predicted Next Stage</th>
                  <th className="pb-2 font-normal">Target Asset</th>
                  <th className="pb-2 font-normal">Probability</th>
                  <th className="pb-2 font-normal">Risk</th>
                  <th className="pb-2 font-normal">Time Window</th>
                  <th className="pb-2 font-normal">Status</th>
                  <th className="pb-2 font-normal text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((r, i) => (
                  <tr 
                    key={r.id} 
                    onClick={() => navigate(`/attack-analysis/${r.id}`)}
                    className="hover:bg-ntro-blue/10 hover:border-ntro-blue/50 cursor-pointer transition-colors group relative"
                  >
                     <td className="py-3 pl-2"><input type="checkbox" className="rounded border-gray-600 bg-navy" onClick={e => e.stopPropagation()} /></td>
                     <td className="py-3 font-mono text-ntro-blue group-hover:text-blue-400">{r.id}</td>
                     <td className="py-3 text-gray-400">{r.detected}</td>
                     <td className="py-3 font-medium text-gray-200">{r.attackType}</td>
                     <td className="py-3 text-gray-400">{r.sector}</td>
                     <td className="py-3 text-gray-300">{r.currentStage}</td>
                     <td className="py-3 font-medium text-white">{r.predictedStage}</td>
                     <td className="py-3 font-mono text-gray-300">{r.targetAsset}</td>
                     <td className="py-3 font-mono text-gray-300">{r.probability}%</td>
                     <td className="py-3">
                       <span className={`px-2 py-0.5 rounded-full border text-[10px] flex items-center w-max gap-1 ${r.risk==='Critical'?'text-ntro-red border-ntro-red/50 bg-ntro-red/10': r.risk==='High'?'text-ntro-amber border-ntro-amber/50 bg-ntro-amber/10': r.risk==='Medium'?'text-yellow-500 border-yellow-500/50 bg-yellow-500/10' : 'text-ntro-green border-ntro-green/50 bg-ntro-green/10'}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${r.risk==='Critical'?'bg-ntro-red': r.risk==='High'?'bg-ntro-amber': r.risk==='Medium'?'bg-yellow-500':'bg-ntro-green'}`}></span>
                         {r.risk}
                       </span>
                     </td>
                     <td className="py-3 text-gray-400 whitespace-nowrap">{r.timeWindow}</td>
                     <td className="py-3">
                       <span className={`px-2 py-0.5 rounded-full border text-[10px] flex items-center w-max gap-1 ${r.status==='Active'?'text-ntro-green border-ntro-green/50 bg-ntro-green/10': r.status==='Monitoring'?'text-ntro-blue border-ntro-blue/50 bg-ntro-blue/10': 'text-ntro-amber border-ntro-amber/50 bg-ntro-amber/10'}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${r.status==='Active'?'bg-ntro-green': r.status==='Monitoring'?'bg-ntro-blue': 'bg-ntro-amber'}`}></span>
                         {r.status}
                       </span>
                     </td>
                     <td className="py-3 text-right pr-2 text-gray-500 group-hover:text-white" onClick={e => e.stopPropagation()}>
                       <MoreHorizontal className="w-4 h-4 ml-auto cursor-pointer" />
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
             <div className="flex items-center gap-1">
               <button className="p-1 hover:text-white"><ChevronLeft className="w-4 h-4"/></button>
               <button className="w-6 h-6 bg-ntro-blue text-white rounded flex items-center justify-center">1</button>
               <button className="w-6 h-6 hover:text-white flex items-center justify-center">2</button>
               <button className="w-6 h-6 hover:text-white flex items-center justify-center">3</button>
               <span>...</span>
               <button className="w-6 h-6 hover:text-white flex items-center justify-center">15</button>
               <button className="p-1 hover:text-white"><ChevronRight className="w-4 h-4"/></button>
             </div>
             <div>Showing 1-{filtered.length} of 148 results</div>
          </div>
        </div>

        {/* Bottom Analytics Row */}
        <div className="grid grid-cols-3 gap-6 h-[250px]">
           <div className="glass-panel p-5 flex flex-col">
             <h3 className="text-sm font-semibold text-white mb-2">Attack Type Distribution</h3>
             <div className="flex items-center justify-between flex-1">
               <div className="w-32 h-32 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={[{v:28},{v:18},{v:16},{v:12},{v:10},{v:8},{v:8}]} innerRadius={40} outerRadius={60} dataKey="v" stroke="none">
                       {['#00a3ff', '#ff3b30', '#ff9500', '#34c759', '#a855f7', '#64748b', '#cbd5e1'].map(c => <Cell key={c} fill={c} />)}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <div className="text-xl font-bold text-white">148</div>
                   <div className="text-[9px] text-gray-400">Predictions</div>
                 </div>
               </div>
               <div className="flex flex-col gap-1.5 text-[10px] w-32">
                 {[
                   {l: 'Malware', v: '28%', c: 'bg-[#00a3ff]'},
                   {l: 'Phishing', v: '18%', c: 'bg-[#ff3b30]'},
                   {l: 'Credential Attack', v: '16%', c: 'bg-[#ff9500]'},
                   {l: 'DDoS', v: '12%', c: 'bg-[#34c759]'},
                   {l: 'Web Exploitation', v: '10%', c: 'bg-[#a855f7]'},
                   {l: 'Insider Threat', v: '8%', c: 'bg-[#64748b]'},
                   {l: 'Others', v: '8%', c: 'bg-[#cbd5e1]'}
                 ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${t.c}`}></span> <span className="text-gray-300">{t.l}</span></div>
                     <span className="font-mono text-gray-500">{t.v}</span>
                   </div>
                 ))}
               </div>
             </div>
           </div>

           <div className="glass-panel p-5 flex flex-col">
             <h3 className="text-sm font-semibold text-white mb-2">Prediction Trend (Last 7 Days)</h3>
             <div className="flex gap-3 text-[9px] text-gray-400 mb-2 justify-center">
               <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-blue rounded-full"></span> Total</div>
               <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-red rounded-full"></span> High Risk</div>
               <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-amber rounded-full"></span> Medium Risk</div>
             </div>
             <div className="flex-1 w-full -ml-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={trendData}>
                   <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} />
                   <YAxis tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} />
                   <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px'}} />
                   <Line type="monotone" dataKey="high" stroke="#ff3b30" strokeWidth={2} dot={{r: 2, fill: '#ff3b30'}} />
                   <Line type="monotone" dataKey="med" stroke="#ff9500" strokeWidth={2} dot={{r: 2, fill: '#ff9500'}} />
                   <Line type="monotone" dataKey="low" stroke="#00a3ff" strokeWidth={2} dot={{r: 2, fill: '#00a3ff'}} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="glass-panel p-5 flex flex-col">
             <h3 className="text-sm font-semibold text-white mb-4">Top Targeted Sectors</h3>
             <div className="flex-1 flex flex-col justify-between">
                {[
                  {l: 'Government', v: 28},
                  {l: 'Finance & Banking', v: 22},
                  {l: 'Healthcare', v: 18},
                  {l: 'Telecom', v: 16},
                  {l: 'Power & Energy', v: 12}
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <div className="w-32 text-gray-300">{s.l}</div>
                    <div className="flex-1 h-3 bg-navy rounded-sm overflow-hidden"><div className="h-full bg-ntro-blue" style={{width: `${s.v * 3}%`}}></div></div>
                    <div className="w-6 text-right font-mono text-gray-500">{s.v}</div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
