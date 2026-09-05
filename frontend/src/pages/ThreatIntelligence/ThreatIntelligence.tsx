import { AlertOctagon, MapPin, Target, ShieldAlert, AlertTriangle, FileText, Globe2, ChevronRight, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function ThreatIntelligence() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">08. THREAT INTELLIGENCE</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Actionable intelligence from global and regional threat sources.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"Know the threats. Stay ahead."</p>
          <select className="bg-navy border border-ntro-blue/30 text-white text-sm rounded-md px-3 py-1.5 outline-none">
            <option>Global + India</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          {t: 'Threat Feeds', v: '1.5M+', tr: 'Indicators', sub: true, c: '#00a3ff', ic: MapPin},
          {t: 'Malicious IPs', v: '248K', tr: '18%', up: true, c: '#ff3b30', ic: Target},
          {t: 'Malicious Domains', v: '324K', tr: '12%', up: true, c: '#ff9500', ic: Globe2},
          {t: 'Malware Hashes', v: '892K', tr: '24%', up: true, c: '#a855f7', ic: ShieldAlert},
          {t: 'Active Campaigns', v: '142', tr: '8%', up: true, c: '#34c759', ic: AlertTriangle},
        ].map((k, i) => (
          <div key={i} className="glass-panel p-4 flex gap-4 items-center border-t-2" style={{borderTopColor: k.c}}>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${k.c}15`, color: k.c }}>
              <k.ic className="w-6 h-6" />
            </div>
            <div>
               <div className="text-[10px] text-gray-400 uppercase tracking-wider">{k.t}</div>
               <div className="text-xl font-bold text-white tracking-tight">{k.v}</div>
               <div className={`text-[9px] font-mono mt-0.5 ${k.sub ? 'text-gray-500' : k.up ? 'text-ntro-red' : 'text-ntro-green'}`}>
                 {!k.sub && (k.up ? '↑ ' : '↓ ')}{k.tr}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[380px]">
        {/* Live Feed Table */}
        <div className="col-span-5 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-3">Live Threat Feed</h3>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-500 font-mono sticky top-0 bg-navy/90 backdrop-blur pb-2">
                <tr><th className="pb-2 font-normal">Time</th><th className="pb-2 font-normal">Indicator</th><th className="pb-2 font-normal">Type</th><th className="pb-2 font-normal">Source</th><th className="pb-2 font-normal text-right">Risk</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {t: '14:48:12', i: '185.199.110.22', ty: 'IP', s: 'AbuseIPDB', r: 'High', c: 'text-ntro-red border-ntro-red'},
                  {t: '14:47:56', i: 'malware-update.com', ty: 'Domain', s: 'AlienVault', r: 'High', c: 'text-ntro-red border-ntro-red'},
                  {t: '14:47:33', i: 'e37f...9b2a', ty: 'Hash', s: 'VirusTotal', r: 'Medium', c: 'text-ntro-amber border-ntro-amber'},
                  {t: '14:46:58', i: 'trojan-loader.exe', ty: 'File', s: 'Hybrid-Analysis', r: 'High', c: 'text-ntro-red border-ntro-red'},
                  {t: '14:46:21', i: '203.0.113.5', ty: 'IP', s: 'MISP', r: 'Medium', c: 'text-ntro-amber border-ntro-amber'},
                  {t: '14:45:49', i: 'suspicious-script.ps1', ty: 'File', s: 'OTX', r: 'High', c: 'text-ntro-red border-ntro-red'},
                  {t: '14:45:12', i: 'darkmode.net', ty: 'Domain', s: 'CrowdStrike', r: 'Medium', c: 'text-ntro-amber border-ntro-amber'},
                  {t: '14:44:57', i: 'c2-panel.top', ty: 'Domain', s: 'Internal', r: 'Low', c: 'text-ntro-green border-ntro-green'},
                  {t: '14:44:01', i: '110.43.2.45', ty: 'IP', s: 'Recorded Future', r: 'High', c: 'text-ntro-red border-ntro-red'},
                  {t: '14:43:28', i: '742b...df19', ty: 'Hash', s: 'ANY.RUN', r: 'Medium', c: 'text-ntro-amber border-ntro-amber'},
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="py-2 font-mono text-gray-500">{r.t}</td>
                    <td className="py-2 font-mono text-gray-300 truncate max-w-[100px] pr-2">{r.i}</td>
                    <td className="py-2">{r.ty}</td>
                    <td className="py-2 text-gray-400">{r.s}</td>
                    <td className="py-2 text-right"><span className={`px-1.5 py-0.5 rounded border text-[10px] ${r.c}`}>{r.r}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Map */}
        <div className="col-span-4 glass-panel p-0 relative overflow-hidden border-ntro-blue/30 flex flex-col">
          <div className="absolute top-4 left-4 z-10"><h3 className="text-sm font-semibold text-white">Global Threat Map (Live)</h3></div>
          <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-50 mt-10" />
          
          <div className="absolute top-4 right-4 z-10 bg-navy/80 p-1.5 rounded border border-white/10 text-[9px] flex flex-col gap-1.5 backdrop-blur">
             <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-ntro-red rounded-full"></span> High</div>
             <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-ntro-amber rounded-full"></span> Medium</div>
             <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-ntro-blue rounded-full"></span> Low</div>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none mt-10 z-10">
            <path d="M100,100 Q150,50 200,100" stroke="rgba(255,59,48,0.4)" strokeWidth="1" fill="none" />
            <path d="M100,100 Q200,150 250,150" stroke="rgba(255,149,0,0.4)" strokeWidth="1" fill="none" />
            <path d="M200,100 Q250,50 300,100" stroke="rgba(255,59,48,0.4)" strokeWidth="1" fill="none" />
          </svg>

          <div className="absolute top-[40%] left-[20%] w-2 h-2 bg-ntro-red rounded-full shadow-[0_0_8px_#ff3b30] animate-pulse z-20"></div>
          <div className="absolute top-[50%] left-[50%] w-2 h-2 bg-ntro-amber rounded-full shadow-[0_0_8px_#ff9500] z-20"></div>
          <div className="absolute top-[35%] left-[70%] w-2 h-2 bg-ntro-red rounded-full shadow-[0_0_8px_#ff3b30] z-20"></div>

          <div className="absolute bottom-4 left-4 z-20 bg-navy/90 border border-white/10 rounded p-2 backdrop-blur max-w-[150px]">
            <div className="text-xs font-bold text-white mb-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-red rounded-full"></span> Active C2 Node</div>
            <div className="text-[9px] text-gray-400">Moscow, Russia<br/>APT-C36</div>
          </div>
          
          <div className="absolute bottom-4 right-4 z-20 flex gap-4 text-[9px] font-mono text-gray-500">
             <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-red rounded-full"></span> High</div>
             <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-amber rounded-full"></span> Medium</div>
             <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-blue rounded-full"></span> Low</div>
          </div>
        </div>

        {/* Right Bars */}
        <div className="col-span-3 flex flex-col gap-4">
           <div className="glass-panel p-4 flex-1 flex flex-col">
             <h3 className="text-sm font-semibold text-white mb-2">Top Threat Types</h3>
             <div className="flex-1 flex flex-col justify-between">
               {[
                 {l: 'Malware', v: 38, c: 'bg-ntro-blue'},
                 {l: 'Phishing', v: 22, c: 'bg-ntro-blue'},
                 {l: 'C2 Communication', v: 16, c: 'bg-ntro-blue'},
                 {l: 'Data Exfiltration', v: 12, c: 'bg-ntro-blue'},
                 {l: 'Ransomware', v: 10, c: 'bg-ntro-blue'},
                 {l: 'Exploit Attempts', v: 8, c: 'bg-ntro-amber'},
                 {l: 'Botnet Activity', v: 4, c: 'bg-gray-500'},
               ].map((b, i) => (
                 <div key={i} className="flex items-center gap-2 text-[10px]">
                   <div className="w-2.5 h-2.5 rounded-full bg-white/10 flex items-center justify-center shrink-0"></div>
                   <div className="w-24 text-gray-400 truncate">{b.l}</div>
                   <div className="flex-1 h-1.5 bg-navy rounded-full overflow-hidden"><div className={`h-full ${b.c}`} style={{width: `${b.v}%`}}></div></div>
                   <div className="w-6 text-right font-mono text-gray-500">{b.v}%</div>
                 </div>
               ))}
             </div>
           </div>
           
           <div className="glass-panel p-4 flex-1 flex flex-col">
             <h3 className="text-sm font-semibold text-white mb-2">Top Source Countries</h3>
             <div className="flex-1 flex flex-col justify-between">
               {[
                 {l: 'Russia', v: 38, c: 'bg-ntro-blue'},
                 {l: 'China', v: 22, c: 'bg-ntro-blue'},
                 {l: 'USA', v: 16, c: 'bg-ntro-blue'},
                 {l: 'North Korea', v: 12, c: 'bg-ntro-blue'},
                 {l: 'Iran', v: 8, c: 'bg-ntro-red'},
                 {l: 'Others', v: 24, c: 'bg-gray-500'},
               ].map((b, i) => (
                 <div key={i} className="flex items-center gap-2 text-[10px]">
                   <div className="w-3.5 h-2.5 bg-white/10 shrink-0 border border-white/20"></div>
                   <div className="w-16 text-gray-400 truncate">{b.l}</div>
                   <div className="flex-1 h-1.5 bg-navy rounded-full overflow-hidden"><div className={`h-full ${b.c}`} style={{width: `${b.v}%`}}></div></div>
                   <div className="w-6 text-right font-mono text-gray-500">{b.v}%</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-12 gap-6 h-[140px]">
         <div className="col-span-9 glass-panel p-5 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-3">Threat Intelligence Insights</h3>
           <div className="grid grid-cols-3 gap-4 h-full">
              <div className="bg-navy border border-white/5 rounded-lg p-3 flex gap-3">
                <div className="p-2 rounded bg-ntro-red/10 text-ntro-red shrink-0 self-start"><ShieldAlert className="w-4 h-4"/></div>
                <div>
                  <div className="text-xs font-semibold text-white mb-1">Emerging Campaign</div>
                  <div className="text-[10px] text-gray-400 leading-relaxed">New phishing campaign targeting Indian government officials using AI-generated lures.</div>
                </div>
              </div>
              <div className="bg-navy border border-white/5 rounded-lg p-3 flex gap-3">
                <div className="p-2 rounded bg-ntro-amber/10 text-ntro-amber shrink-0 self-start"><AlertTriangle className="w-4 h-4"/></div>
                <div>
                  <div className="text-xs font-semibold text-white mb-1">Rising Malware</div>
                  <div className="text-[10px] text-gray-400 leading-relaxed">New variant of AsyncRAT detected in South Asia.</div>
                </div>
              </div>
              <div className="bg-navy border border-white/5 rounded-lg p-3 flex gap-3">
                <div className="p-2 rounded bg-ntro-blue/10 text-ntro-blue shrink-0 self-start"><FileText className="w-4 h-4"/></div>
                <div>
                  <div className="text-xs font-semibold text-white mb-1">TTP Update</div>
                  <div className="text-[10px] text-gray-400 leading-relaxed">APT-C36 now using living-off-the-land binaries (LOLBins) for lateral movement.</div>
                </div>
              </div>
           </div>
         </div>
         
         <div className="col-span-3 glass-panel p-5 relative overflow-hidden group flex flex-col justify-center">
            <div className="absolute inset-0 bg-[url('/images/media_1788614089743.png')] bg-cover bg-right opacity-30 mix-blend-screen group-hover:opacity-50 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">STAY INFORMED.<br/>STAY PREPARED.</h3>
              <p className="text-[9px] text-gray-400 mb-4 font-mono">Real global intelligence feed.</p>
              <button className="bg-ntro-blue hover:bg-blue-600 text-white text-xs px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors">
                Explore Threat Reports <ChevronRight className="w-3 h-3" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
