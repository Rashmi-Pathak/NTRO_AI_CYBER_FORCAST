import { Globe2, Building2, Zap, HeartPulse, Activity, Train, GraduationCap, Factory, Cloud, ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const mockTrends = Array.from({length: 10}).map((_, i) => ({
  name: `Aug ${27+i}`,
  gov: Math.random()*200 + 100,
  fin: Math.random()*150 + 50,
  health: Math.random()*100 + 20,
  tel: Math.random()*80 + 10,
}));

export default function SectorIntelligence() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Globe2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">07. SECTOR INTELLIGENCE</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Sector-specific threat insights, trends, and risk analysis.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"Different sectors. A stronger India."</p>
          <select className="bg-navy border border-ntro-blue/30 text-white text-sm rounded-md px-3 py-1.5 outline-none">
            <option>All Sectors</option>
          </select>
        </div>
      </div>

      {/* Sector Carousel */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {[
          {n: 'Government', ic: Building2, r: 'High Risk', c: 'text-ntro-red bg-ntro-red/10 border-ntro-red', active: true},
          {n: 'Banking & Finance', ic: Building2, r: 'Medium', c: 'text-ntro-amber bg-ntro-amber/10 border-white/5'},
          {n: 'Power & Energy', ic: Zap, r: 'High', c: 'text-ntro-red bg-ntro-red/10 border-white/5'},
          {n: 'Healthcare', ic: HeartPulse, r: 'Medium', c: 'text-ntro-amber bg-ntro-amber/10 border-white/5'},
          {n: 'Telecom', ic: Activity, r: 'Medium', c: 'text-ntro-amber bg-ntro-amber/10 border-white/5'},
          {n: 'Transport', ic: Train, r: 'Low', c: 'text-ntro-green bg-ntro-green/10 border-white/5'},
          {n: 'Education', ic: GraduationCap, r: 'Low', c: 'text-ntro-green bg-ntro-green/10 border-white/5'},
          {n: 'Manufacturing', ic: Factory, r: 'Medium', c: 'text-ntro-amber bg-ntro-amber/10 border-white/5'},
          {n: 'IT & SaaS', ic: Cloud, r: 'High', c: 'text-ntro-red bg-ntro-red/10 border-white/5'},
          {n: 'Others', ic: Globe2, r: 'Low', c: 'text-ntro-green bg-ntro-green/10 border-white/5'},
        ].map((s, i) => (
          <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-xl min-w-[120px] cursor-pointer transition-colors ${s.active ? 'bg-navy-lighter/80 border-t-2 border-b border-x border-t-ntro-blue border-white/10 shadow-[0_0_20px_rgba(0,163,255,0.15)]' : 'bg-navy/40 border border-white/5 hover:bg-white/5'}`}>
            <s.ic className={`w-6 h-6 mb-2 ${s.active ? 'text-ntro-blue' : 'text-gray-400'}`} />
            <div className="text-xs font-semibold text-white mb-2 text-center">{s.n}</div>
            <div className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${s.c}`}>
              {s.r === 'High Risk' || s.r === 'High' ? '↑' : s.r === 'Medium' ? '↑' : '↓'} {s.r}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[500px]">
        {/* Left Col - Landscape & Threats */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-0 border-ntro-blue/30 relative flex-1 overflow-hidden group cursor-pointer">
            <div className="absolute top-4 left-4 z-10"><h3 className="text-sm font-semibold text-white">Sector Threat Landscape</h3></div>
            <img src="/images/media_1788617186344.png" alt="Gov" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent p-5 flex flex-col justify-end">
               <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-1">Government Sector</h2>
               <p className="text-xs text-gray-300 font-mono">Critical Infrastructure. Critical responsibility.</p>
            </div>
          </div>
          
          <div className="glass-panel p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Key Threats</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                {t: 'APT Attacks', val: '32%', ic: ShieldAlert, c: 'text-ntro-red border-ntro-red shadow-[0_0_10px_#ff3b30]'},
                {t: 'Data Exfil', val: '18%', ic: Cloud, c: 'text-ntro-blue border-ntro-blue shadow-[0_0_10px_#00a3ff]'},
                {t: 'Insider Threats', val: '12%', ic: Building2, c: 'text-ntro-blue border-ntro-blue'},
                {t: 'Ransomware', val: '27%', ic: AlertTriangle, c: 'text-ntro-red border-ntro-red'}
              ].map((k, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded bg-navy-lighter flex items-center justify-center border-b-2 ${k.c}`}><k.ic className="w-5 h-5"/></div>
                  <div className="text-[10px] text-gray-300 leading-tight">{k.t}</div>
                  <div className={`text-[10px] font-mono ${k.val.includes('2')||k.val.includes('3')?'text-ntro-red':'text-ntro-blue'}`}>↑ {k.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Col - Trends & Actors */}
        <div className="col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-5 h-[280px] flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-2">Sector Attack Trends (Last 30 Days)</h3>
            <div className="flex gap-4 text-[10px] mb-4 pl-8">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ntro-red"></span> Government</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ntro-blue"></span> Finance</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ntro-amber"></span> Healthcare</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ntro-green"></span> Telecom</div>
            </div>
            <div className="flex-1 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrends}>
                  <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                  <YAxis tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                  <Line type="monotone" dataKey="gov" stroke="#ff3b30" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="fin" stroke="#00a3ff" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="health" stroke="#ff9500" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="tel" stroke="#34c759" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-panel p-5 flex-1 flex flex-col justify-between">
            <h3 className="text-sm font-semibold text-white mb-2">Top Threat Actors Targeting Sector</h3>
            {[
              {n: 'APT-C36', s: 'State-sponsored', v: 42, c: 'bg-ntro-red shadow-[0_0_5px_#ff3b30]'},
              {n: 'Lazarus Group', s: 'Financially motivated', v: 28, c: 'bg-ntro-red'},
              {n: 'DarkHydra', s: 'Cyber criminal', v: 18, c: 'bg-ntro-amber'},
              {n: 'Unknown', s: 'Unattributed', v: 12, c: 'bg-gray-500'}
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-4 text-xs py-1">
                <div className="p-1.5 rounded bg-white/5"><Globe2 className="w-4 h-4 text-gray-400" /></div>
                <div className="w-32">
                  <div className="text-white font-medium">{a.n}</div>
                  <div className="text-[9px] text-gray-500">{a.s}</div>
                </div>
                <div className="flex-1 bg-navy h-2 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full rounded-full ${a.c}`} style={{width: `${a.v}%`}}></div>
                </div>
                <div className="text-gray-400 font-mono w-6 text-right">{a.v}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col - Map & Incidents */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-0 h-[220px] relative overflow-hidden border-ntro-blue/30">
            <div className="absolute top-4 left-4 z-10"><h3 className="text-sm font-semibold text-white">Sector Risk Map - India</h3></div>
            <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-70" />
            
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 text-[9px] bg-navy/80 p-1.5 rounded border border-white/10 backdrop-blur">
               <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-ntro-red rounded-full"></span> Critical</div>
               <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-ntro-amber rounded-full"></span> High</div>
               <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Medium</div>
               <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-ntro-green rounded-full"></span> Low</div>
            </div>
            
            <div className="absolute top-[40%] right-[35%] w-3 h-3 bg-ntro-red/50 rounded-full animate-ping z-10"></div>
            <div className="absolute top-[40%] right-[35%] w-1.5 h-1.5 bg-ntro-red rounded-full z-10 shadow-[0_0_10px_#ff3b30]"></div>
            
            <div className="absolute top-[45%] right-[5%] z-20 bg-navy/90 border border-ntro-red/50 rounded p-2 backdrop-blur shadow-[0_0_15px_rgba(255,59,48,0.2)] w-36">
              <div className="text-xs font-bold text-white mb-1 border-b border-white/10 pb-1">Delhi NCR</div>
              <div className="text-[10px] text-ntro-red font-medium">High Risk</div>
              <div className="text-[9px] text-gray-400 mt-1">28 active threats</div>
            </div>
          </div>
          
          <div className="glass-panel p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Sector Incidents</h3>
              <a href="#" className="text-xs text-ntro-blue hover:underline">View All →</a>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
               {[
                 {t: 'Phishing campaign targeting gov in...', time: '12 min ago', l: 'High', c: 'text-ntro-red bg-ntro-red/10'},
                 {t: 'Unauthorized access in power grid server', time: '42 min ago', l: 'Medium', c: 'text-ntro-amber bg-ntro-amber/10'},
                 {t: 'Sensitive data exfiltration detected', time: '2 hours ago', l: 'High', c: 'text-ntro-red bg-ntro-red/10'},
                 {t: 'DDoS attack on telecom provider', time: '5 hours ago', l: 'Low', c: 'text-ntro-green bg-ntro-green/10'},
               ].map((inc, i) => (
                 <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-3 last:border-0">
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${inc.c}`}>!</div>
                   <div className="flex-1">
                     <div className="text-xs text-gray-300 truncate w-40">{inc.t}</div>
                     <div className="text-[9px] text-gray-500 font-mono mt-0.5">{inc.time}</div>
                   </div>
                   <div className={`text-[9px] px-1.5 py-0.5 rounded border ${inc.c.replace('bg-', 'border-').split(' ')[0]} ${inc.c}`}>{inc.l}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
