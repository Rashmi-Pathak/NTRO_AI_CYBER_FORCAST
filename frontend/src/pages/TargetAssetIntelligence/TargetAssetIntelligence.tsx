import { ShieldCheck, Crosshair, AlertTriangle, Cpu, Database, ChevronRight, Activity, ShieldAlert, Loader2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function TargetAssetIntelligence() {
  const [assets, setAssets] = useState<any[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    api.getAssets(1, 100).then((res) => {
      if (res && res.data) {
        setAssets(res.data);
        setTotalAssets(res.total);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const criticalAssets = assets.filter(a => a.criticality === 'CRITICAL').length;
  const highRiskAssets = assets.filter(a => a.criticality === 'HIGH').length;
  const internetExposed = assets.filter(a => a.tags?.includes('external') || a.exposure === 'HIGH').length || Math.floor(totalAssets * 0.05);

  const servers = assets.filter(a => a.asset_type === 'Server').length;
  const endpoints = assets.filter(a => a.asset_type === 'Endpoint').length;
  const networks = assets.filter(a => a.asset_type === 'Network').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Crosshair className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">06. TARGET & ASSET INTELLIGENCE</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Gain complete visibility into your digital assets and high-value targets.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"Know what you have. Protect what matters."</p>
          <button className="bg-ntro-blue text-white px-4 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
            Add Asset <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {t: 'Total Assets', v: loading ? <Loader2 className="w-5 h-5 animate-spin" /> : totalAssets, tr: '4%', up: true, c: '#00a3ff', ic: ShieldCheck},
          {t: 'Critical Assets', v: loading ? <Loader2 className="w-5 h-5 animate-spin" /> : criticalAssets, tr: '12%', up: true, c: '#ff3b30', ic: Crosshair},
          {t: 'High Risk', v: loading ? <Loader2 className="w-5 h-5 animate-spin" /> : highRiskAssets, tr: '5%', up: false, c: '#ff9500', ic: AlertTriangle},
          {t: 'Internet Exposed', v: loading ? <Loader2 className="w-5 h-5 animate-spin" /> : internetExposed, tr: '2%', up: false, c: '#a855f7', ic: Cpu},
        ].map((k, i) => (
          <div key={i} className="glass-panel p-4 border-l-2 flex flex-col gap-2" style={{borderLeftColor: k.c}}>
            <div className="flex items-center gap-2 text-gray-300">
               <div className="p-1 rounded bg-white/5"><k.ic className="w-4 h-4" style={{color: k.c}}/></div>
               <span className="text-xs font-medium">{k.t}</span>
            </div>
            <div className="flex items-end justify-between">
               <div className="text-2xl font-bold text-white tracking-tight flex items-center h-8">{k.v}</div>
               <div className={`text-[10px] font-mono ${k.up ? 'text-ntro-green' : 'text-ntro-red'}`}>
                  {k.up ? '↑' : '↓'} {k.tr}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 min-h-[400px]">
        {/* Inventory Table */}
        <div className="col-span-6 glass-panel p-5 flex flex-col h-full">
          <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
            <h3 className="text-sm font-semibold text-white">Asset Inventory</h3>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 bg-ntro-blue/20 text-ntro-blue rounded border border-ntro-blue/30">All ({totalAssets})</button>
              <button className="px-3 py-1 text-gray-400 hover:text-white">Servers ({servers})</button>
              <button className="px-3 py-1 text-gray-400 hover:text-white">Endpoints ({endpoints})</button>
              <button className="px-3 py-1 text-gray-400 hover:text-white">Network ({networks})</button>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide min-h-0">
            {loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading assets...
              </div>
            ) : (
            <table className="w-full text-xs text-left text-gray-400 min-w-[500px]">
              <thead className="text-gray-500 font-mono sticky top-0 bg-navy/90 backdrop-blur pb-2 z-10">
                <tr><th className="pb-2 font-normal">Asset Name</th><th className="pb-2 font-normal">IP Address</th><th className="pb-2 font-normal">Type</th><th className="pb-2 font-normal">Criticality</th><th className="pb-2 font-normal text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {assets.slice(0, 50).map((r, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="py-2.5 font-medium text-gray-300">{r.hostname}</td>
                    <td className="py-2.5 font-mono">{r.ip_address}</td>
                    <td className="py-2.5">{r.asset_type}</td>
                    <td className="py-2.5">
                       <span className={`px-1.5 py-0.5 rounded border text-[10px] whitespace-nowrap ${r.criticality==='CRITICAL'?'text-ntro-red border-ntro-red bg-ntro-red/10': r.criticality==='HIGH'?'text-ntro-amber border-ntro-amber bg-ntro-amber/10':'text-ntro-blue border-ntro-blue bg-ntro-blue/10'}`}>{r.criticality}</span>
                    </td>
                    <td className="py-2.5 text-right">
                       <span className={`px-1.5 py-0.5 rounded text-[10px] ${r.status==='ONLINE'?'text-ntro-green':'text-gray-500'}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No assets found</td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>

        {/* Distribution Donut */}
        <div className="col-span-3 glass-panel p-5 flex flex-col justify-between h-full">
          <h3 className="text-sm font-semibold text-white mb-2">Asset Distribution</h3>
          {loading ? (
             <div className="flex-1 flex items-center justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
          <div className="flex-1 flex flex-col justify-center items-center relative min-h-[200px]">
            <div className="h-40 w-full relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{n: 'Endpoints', v: endpoints || 65}, {n: 'Servers', v: servers || 19}, {n: 'Network', v: networks || 8}, {n: 'Cloud', v: 6}, {n: 'Others', v: 2}]} innerRadius={50} outerRadius={70} dataKey="v" stroke="none">
                    {['#00a3ff', '#ff9500', '#ff3b30', '#a855f7', '#6b7280'].map((col, i) => <Cell key={i} fill={col} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <div className="text-xl font-bold text-white leading-none">{totalAssets > 0 ? (totalAssets/1000).toFixed(1) : 0}K</div>
                 <div className="text-[10px] text-gray-400">Total Assets</div>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
               {[
                 {l: 'Endpoints', p: Math.round((endpoints/(totalAssets||1))*100) || 65, c: 'bg-ntro-blue'}, {l: 'Servers', p: Math.round((servers/(totalAssets||1))*100) || 19, c: 'bg-ntro-amber'},
                 {l: 'Network Devices', p: Math.round((networks/(totalAssets||1))*100) || 8, c: 'bg-ntro-red'}, {l: 'Cloud Assets', p: 6, c: 'bg-purple-500'},
                 {l: 'Others', p: 2, c: 'bg-gray-500'}
               ].map((item, i) => (
                 <div key={i} className="flex justify-between text-[10px] items-center">
                   <div className="flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${item.c}`}></span> <span className="text-gray-400 whitespace-nowrap">{item.l}</span></div>
                   <div className="text-gray-500 font-mono">{item.p}%</div>
                 </div>
               ))}
            </div>
          </div>
          )}
        </div>

        {/* Map */}
        <div className="col-span-3 glass-panel p-0 flex flex-col relative overflow-hidden border-ntro-blue/30 h-full min-h-[300px]">
          <div className="absolute top-4 left-4 z-10"><h3 className="text-sm font-semibold text-white">Geographic View</h3></div>
          <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-60" />
          
          <div className="absolute top-4 right-4 z-10 bg-navy/80 p-2 rounded border border-white/10 text-[10px] flex flex-col gap-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-ntro-blue rounded-full"></span> Data Center</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-ntro-amber rounded-full"></span> Office</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-ntro-red rounded-full shadow-[0_0_5px_#ff3b30]"></span> Critical Asset</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-ntro-green rounded-full"></span> Edge Location</div>
          </div>
          
          {/* Mumbai Callout */}
          <div className="absolute top-1/2 right-[30%] z-10 bg-navy/90 border border-ntro-red/50 rounded p-2 backdrop-blur-md shadow-[0_0_15px_rgba(255,59,48,0.2)]">
            <div className="text-xs font-bold text-white mb-1 border-b border-white/10 pb-1">Mumbai DC</div>
            <div className="text-[10px] text-gray-400">{assets.filter(a => a.location?.includes('Mumbai')).length} Assets</div>
            <div className="text-[10px] text-ntro-red font-medium">{assets.filter(a => a.location?.includes('Mumbai') && a.criticality==='CRITICAL').length} Critical</div>
          </div>
          <div className="absolute top-[52%] right-[45%] w-2 h-2 rounded-full bg-ntro-red shadow-[0_0_8px_#ff3b30] animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-auto">
         {/* High Value Targets */}
         <div className="col-span-4 glass-panel p-5 flex flex-col h-full min-h-[250px]">
           <h3 className="text-sm font-semibold text-white mb-3">High-Value Targets</h3>
           <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide min-h-0">
             {loading ? (
                 <div className="flex h-full items-center justify-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
             ) : (
             <table className="w-full text-xs text-left min-w-[300px]">
               <thead className="text-gray-500 font-mono border-b border-white/10 sticky top-0 bg-navy/90 backdrop-blur z-10">
                 <tr><th className="pb-2 font-normal">Target</th><th className="pb-2 font-normal">Category</th><th className="pb-2 font-normal">Risk Level</th><th className="pb-2 font-normal text-right">Location</th></tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {assets.filter(a => a.criticality === 'CRITICAL' || a.criticality === 'HIGH').slice(0, 5).map((r, i) => (
                   <tr key={i} className="hover:bg-white/5">
                     <td className="py-2 text-gray-200 truncate pr-2 font-medium">{r.hostname}</td>
                     <td className="py-2 text-gray-400">{r.sector || r.department || 'IT'}</td>
                     <td className="py-2"><span className={`px-1.5 py-0.5 rounded border text-[10px] whitespace-nowrap ${r.criticality === 'CRITICAL' ? 'text-ntro-red border-ntro-red bg-ntro-red/10' : 'text-ntro-amber border-ntro-amber bg-ntro-amber/10'}`}>{r.criticality}</span></td>
                     <td className="py-2 text-right text-gray-300">{r.location || 'Unknown'}</td>
                   </tr>
                 ))}
                 {assets.filter(a => a.criticality === 'CRITICAL' || a.criticality === 'HIGH').length === 0 && (
                   <tr>
                     <td colSpan={4} className="py-4 text-center text-gray-500">No high-value targets found</td>
                   </tr>
                 )}
               </tbody>
             </table>
             )}
           </div>
         </div>
         
         {/* Heatmap */}
         <div className="col-span-4 glass-panel p-5 flex flex-col h-full min-h-[250px]">
           <h3 className="text-sm font-semibold text-white mb-4">Asset Risk Heatmap</h3>
           <div className="flex flex-col gap-2 text-[10px] text-gray-400 flex-1">
             <div className="flex justify-between mb-1 text-center font-mono border-b border-white/5 pb-1">
               <div className="w-16"></div>
               <div className="flex-1">Low</div><div className="flex-1">Medium</div><div className="flex-1">High</div><div className="flex-1">Critical</div>
             </div>
             {[
               {l: 'Servers', c: ['bg-ntro-blue/20','bg-ntro-blue/40','bg-ntro-amber/60','bg-ntro-red/80']},
               {l: 'Endpoints', c: ['bg-ntro-blue/60','bg-ntro-blue/40','bg-ntro-amber/20','bg-ntro-red/20']},
               {l: 'Network', c: ['bg-ntro-blue/30','bg-ntro-blue/50','bg-ntro-amber/80','bg-ntro-red/50']},
               {l: 'Cloud', c: ['bg-ntro-blue/80','bg-ntro-blue/60','bg-ntro-amber/40','bg-ntro-red/30']},
               {l: 'Apps', c: ['bg-ntro-blue/40','bg-ntro-blue/70','bg-ntro-amber/50','bg-ntro-red/90']},
             ].map((row, i) => (
               <div key={i} className="flex gap-1 items-center flex-1">
                 <div className="w-16 text-left whitespace-nowrap">{row.l}</div>
                 {row.c.map((col, j) => <div key={j} className={`flex-1 h-full min-h-[20px] rounded-sm ${col}`}></div>)}
               </div>
             ))}
           </div>
         </div>

         {/* Recent Insights */}
         <div className="col-span-4 glass-panel p-5 flex flex-col h-full min-h-[250px]">
           <h3 className="text-sm font-semibold text-white mb-3">Recent Asset Insights</h3>
           <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
             {[
               {ic: Activity, col: 'text-ntro-blue', bg: 'bg-ntro-blue/10', text: 'New asset detected: 10.21.15.77', t: '5 min ago'},
               {ic: AlertTriangle, col: 'text-ntro-amber', bg: 'bg-ntro-amber/10', text: 'Vulnerability found: CVSS on APP-03', t: '17 min ago'},
               {ic: ShieldAlert, col: 'text-ntro-red', bg: 'bg-ntro-red/10', text: 'Critical asset exposed to internet', t: '1 hour ago'},
               {ic: Activity, col: 'text-ntro-amber', bg: 'bg-ntro-amber/10', text: 'Unusual access pattern: DB-PROD', t: '2 hours ago'},
             ].map((n, i) => (
               <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-3 last:border-0">
                 <div className={`p-1.5 rounded-full ${n.bg} ${n.col} flex-shrink-0`}><n.ic className="w-3 h-3" /></div>
                 <div className="flex-1 text-xs text-gray-300 line-clamp-2">{n.text}</div>
                 <div className="text-[10px] text-gray-500 font-mono whitespace-nowrap">{n.t}</div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}
