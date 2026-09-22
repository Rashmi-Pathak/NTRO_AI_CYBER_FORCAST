import { Cpu, Target, ShieldAlert, CheckCircle2, ChevronRight, Activity, Database, Network, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const mockTrends = Array.from({length: 8}).map((_, i) => ({
  name: `Aug ${27 + i}`,
  fraud: Math.random() * 5 + 90,
  phish: Math.random() * 5 + 85,
  anom: Math.random() * 10 + 75,
  nlp: Math.random() * 5 + 88,
}));

export default function ModelIntelligence() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">10. MODEL INTELLIGENCE</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Monitor, train, and evaluate AI/ML models for threat detection.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"Smarter models. Safer tomorrow."</p>
          <button className="bg-ntro-blue hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2">
            Train New Model +
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          {t: 'Total Models', v: '24', tr: '20%', up: true, c: '#00a3ff', ic: Target},
          {t: 'Active Models', v: '18', tr: '12%', up: true, c: '#ff3b30', ic: Activity},
          {t: 'Model Accuracy (Avg)', v: '94.2%', tr: '2.4%', up: true, c: '#ff9500', ic: ShieldAlert},
          {t: 'Drift Detected', v: '3', tr: '50%', up: true, c: '#ff3b30', ic: AlertTriangle},
          {t: 'Retraining Due', v: '5', tr: '20%', up: false, c: '#34c759', ic: Database},
        ].map((k, i) => (
          <div key={i} className="glass-panel p-4 flex gap-4 items-center border-t-2" style={{borderTopColor: k.c}}>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${k.c}15`, color: k.c }}>
              <k.ic className="w-6 h-6" />
            </div>
            <div>
               <div className="text-[10px] text-gray-400 font-medium">{k.t}</div>
               <div className="text-xl font-bold text-white tracking-tight">{k.v}</div>
               <div className={`text-[9px] font-mono mt-0.5 ${k.up ? (k.c==='#ff3b30'?'text-ntro-red':'text-ntro-green') : 'text-ntro-red'}`}>
                 {k.up ? '↑ ' : '↓ '}{k.tr}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[400px]">
        {/* Model Performance */}
        <div className="col-span-5 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Model Performance</h3>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-xs text-left text-gray-400">
              <thead className="text-gray-500 font-mono sticky top-0 bg-navy/90 backdrop-blur pb-2">
                <tr><th className="pb-2 font-normal">Model Name</th><th className="pb-2 font-normal">Type</th><th className="pb-2 font-normal">Accuracy</th><th className="pb-2 font-normal">Status</th><th className="pb-2 font-normal text-right">Last Trained</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {n: 'FraudNet', t: 'Transaction Fraud', a: '96.2%', s: 'Active', l: '2 days ago', c: 'text-ntro-green'},
                  {n: 'PhishGuard', t: 'Phishing Detection', a: '92.5%', s: 'Active', l: '3 days ago', c: 'text-ntro-green'},
                  {n: 'RansomDet', t: 'Malware Classification', a: '95.1%', s: 'Active', l: '1 day ago', c: 'text-ntro-green'},
                  {n: 'Anomaly', t: 'Anomaly Detection', a: '82.7%', s: 'Drift', l: '8 days ago', c: 'text-ntro-amber'},
                  {n: 'GraphShield', t: 'Attack Graph Analysis', a: '90.4%', s: 'Active', l: '3 days ago', c: 'text-ntro-green'},
                  {n: 'NLPThreat', t: 'Threat Intel NLP', a: '91.2%', s: 'Retraining', l: '7 days ago', c: 'text-ntro-amber'},
                  {n: 'VisionScan', t: 'Document/Image Analysis', a: '93.8%', s: 'Active', l: '4 days ago', c: 'text-ntro-green'},
                  {n: 'RiskPredict', t: 'Risk Scoring', a: '94.1%', s: 'Active', l: '2 days ago', c: 'text-ntro-green'},
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-white/5 cursor-pointer">
                     <td className="py-2.5 font-medium text-gray-200">{r.n}</td>
                     <td className="py-2.5">{r.t}</td>
                     <td className="py-2.5 font-mono text-gray-300">{r.a}</td>
                     <td className="py-2.5"><span className={`px-1.5 py-0.5 rounded border text-[10px] ${r.s==='Active'?'text-ntro-green border-ntro-green bg-ntro-green/10': r.s==='Drift'?'text-ntro-red border-ntro-red bg-ntro-red/10': 'text-ntro-amber border-ntro-amber bg-ntro-amber/10'}`}>{r.s}</span></td>
                     <td className="py-2.5 text-right font-mono text-gray-500">{r.l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="col-span-4 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-2">Model Accuracy Trend</h3>
          <div className="flex flex-wrap gap-3 text-[9px] mb-4 text-gray-400 pl-4">
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-red rounded-full"></span> FraudNet</div>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-blue rounded-full"></span> PhishGuard</div>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-amber rounded-full"></span> Anomaly</div>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-ntro-green rounded-full"></span> NLPThreat</div>
          </div>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrends}>
                <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} />
                <YAxis tick={{fill: '#6b7280', fontSize: 9}} stroke="#374151" tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px'}} />
                <Line type="monotone" dataKey="fraud" stroke="#ff3b30" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="phish" stroke="#00a3ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="anom" stroke="#ff9500" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="nlp" stroke="#34c759" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="col-span-3 glass-panel p-5 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-4">Feature Importance <span className="text-gray-500 font-mono text-[10px]">(FraudNet)</span></h3>
           <div className="flex-1 flex flex-col justify-between">
               {[
                 {l: 'Transaction Amount', v: 38, c: 'bg-ntro-blue'},
                 {l: 'Merchant Category', v: 16, c: 'bg-ntro-blue'},
                 {l: 'Transaction Time', v: 14, c: 'bg-ntro-blue'},
                 {l: 'Device Fingerprint', v: 12, c: 'bg-ntro-blue'},
                 {l: 'Geolocation', v: 10, c: 'bg-ntro-blue'},
                 {l: 'User Behavior', v: 9, c: 'bg-ntro-blue'},
                 {l: 'Account Age', v: 4, c: 'bg-ntro-blue'},
                 {l: 'Others', v: 3, c: 'bg-purple-500'},
               ].map((b, i) => (
                 <div key={i} className="flex items-center gap-2 text-[10px]">
                   <div className="w-24 text-gray-400 truncate">{b.l}</div>
                   <div className="flex-1 h-2.5 bg-navy rounded-sm overflow-hidden"><div className={`h-full ${b.c} opacity-80`} style={{width: `${b.v*2}%`}}></div></div>
                   <div className="w-8 text-right font-mono text-gray-500">0.{b.v}</div>
                 </div>
               ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[160px]">
        {/* Model Insights */}
        <div className="col-span-7 glass-panel p-5 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-3">Model Insights</h3>
           <div className="grid grid-cols-4 gap-4 flex-1">
              {[
                {t: 'New Pattern Detected', d: 'Unusual transaction behavior in tier-3 cities.', ic: Target, c: 'text-ntro-green bg-ntro-green/10 border-ntro-green/30'},
                {t: 'Performance Improvement', d: 'FraudNet accuracy increased by 2.4%.', ic: Activity, c: 'text-ntro-blue bg-ntro-blue/10 border-ntro-blue/30'},
                {t: 'Drift Alert', d: 'Anomaly model showing drift for evening logins.', ic: AlertTriangle, c: 'text-ntro-red bg-ntro-red/10 border-ntro-red/30'},
                {t: 'Resource Usage', d: 'NLPThreat is at 85% VRAM in normal range.', ic: Cpu, c: 'text-purple-500 bg-purple-500/10 border-purple-500/30'},
              ].map((k, i) => (
                <div key={i} className={`bg-navy border p-3 rounded-lg flex flex-col gap-2 ${k.c.split(' ')[2]}`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${k.c.split(' ').slice(0,2).join(' ')}`}><k.ic className="w-3 h-3"/></div>
                    <div className="text-[10px] font-semibold text-white leading-tight">{k.t}</div>
                  </div>
                  <div className="text-[9px] text-gray-400">{k.d}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Model Lifecycle */}
        <div className="col-span-5 glass-panel p-5 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-4">Model Lifecycle</h3>
           <div className="flex items-center justify-between flex-1 relative px-4">
             <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-white/10 z-0 border-t border-dashed border-white/20 -translate-y-1/2"></div>
             {[
               {l: 'Data Ingestion', ic: Database, c: 'bg-ntro-green/20 text-ntro-green border border-ntro-green'},
               {l: 'Training', ic: Cpu, c: 'bg-ntro-blue/20 text-ntro-blue border border-ntro-blue'},
               {l: 'Validation', ic: CheckCircle2, c: 'bg-ntro-blue/20 text-ntro-blue border border-ntro-blue'},
               {l: 'Deployment', ic: Network, c: 'bg-ntro-green/20 text-ntro-green border border-ntro-green shadow-[0_0_10px_#34c759]'},
               {l: 'Monitoring', ic: Activity, c: 'bg-ntro-amber/20 text-ntro-amber border border-ntro-amber'},
             ].map((w, i) => (
               <div key={i} className="flex flex-col items-center gap-2 z-10 bg-navy-lighter p-1">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${w.c}`}><w.ic className="w-4 h-4"/></div>
                 <div className="text-[9px] text-gray-300 font-medium">{w.l}</div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
