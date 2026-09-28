import { useState, useEffect } from 'react';
import { Globe2, Building2, Zap, HeartPulse, Activity, Train, GraduationCap, Factory, Cloud, ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../../services/api';

const SECTOR_ICONS: Record<string, any> = {
  'Government': Building2,
  'Banking & Finance': Building2,
  'Power & Energy': Zap,
  'Healthcare': HeartPulse,
  'Telecom': Activity,
  'Transport': Train,
  'Education': GraduationCap,
  'Manufacturing': Factory,
  'IT & SaaS': Cloud,
};

export default function SectorIntelligence() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [sectorDetail, setSectorDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getSectors();
        if (res.data) {
          setSectors(res.data);
          if (res.data.length > 0) {
            setSelectedSector(res.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSector) {
      async function loadDetail() {
        try {
          const detail = await api.getSectorById(selectedSector.sector_id);
          setSectorDetail(detail);
        } catch (err) {
          console.error(err);
        }
      }
      loadDetail();
    }
  }, [selectedSector]);

  if (loading) return <div className="p-8 text-white">Loading sector intelligence...</div>;
  if (!sectors.length) return <div className="p-8 text-white">No sector data available.</div>;

  const handleSelect = (s: any) => setSelectedSector(s);

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
          <select 
             className="bg-navy border border-ntro-blue/30 text-white text-sm rounded-md px-3 py-1.5 outline-none"
             value={selectedSector?.sector_id}
             onChange={(e) => {
               const s = sectors.find(x => x.sector_id === e.target.value);
               if (s) setSelectedSector(s);
             }}
          >
            {sectors.map(s => <option key={s.sector_id} value={s.sector_id}>{s.sector}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {sectors.map((s, i) => {
          const Icon = SECTOR_ICONS[s.sector] || Globe2;
          const active = selectedSector?.sector_id === s.sector_id;
          const r = s.threat_count > 100 ? 'High Risk' : s.threat_count > 50 ? 'Medium' : 'Low';
          const c = r.includes('High') ? 'text-ntro-red bg-ntro-red/10 border-ntro-red' : r === 'Medium' ? 'text-ntro-amber bg-ntro-amber/10 border-white/5' : 'text-ntro-green bg-ntro-green/10 border-white/5';
          return (
            <div key={i} onClick={() => handleSelect(s)} className={`flex flex-col items-center justify-center p-4 rounded-xl min-w-[120px] cursor-pointer transition-colors ${active ? 'bg-navy-lighter/80 border-t-2 border-b border-x border-t-ntro-blue border-white/10 shadow-[0_0_20px_rgba(0,163,255,0.15)]' : 'bg-navy/40 border border-white/5 hover:bg-white/5'}`}>
              <Icon className={`w-6 h-6 mb-2 ${active ? 'text-ntro-blue' : 'text-gray-400'}`} />
              <div className="text-xs font-semibold text-white mb-2 text-center">{s.sector}</div>
              <div className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${c}`}>
                {r.includes('High') ? '↑' : r === 'Medium' ? '↑' : '↓'} {r}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[500px]">
        {/* Left Col - Landscape & Threats */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-0 border-ntro-blue/30 relative flex-1 overflow-hidden group cursor-pointer">
            <div className="absolute top-4 left-4 z-10"><h3 className="text-sm font-semibold text-white">Sector Threat Landscape</h3></div>
            <img src="/images/media_1788617186344.png" alt="Gov" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent p-5 flex flex-col justify-end">
               <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-1">{selectedSector?.sector} Sector</h2>
               <p className="text-xs text-gray-300 font-mono">Critical Infrastructure. Critical responsibility.</p>
            </div>
          </div>
          
          <div className="glass-panel p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Key Threats</h3>
            <div className="grid grid-cols-2 gap-3">
              {selectedSector?.top_attack_types?.slice(0, 4).map((k: any, i: number) => {
                const c = i % 2 === 0 ? 'text-ntro-red border-ntro-red' : 'text-ntro-blue border-ntro-blue';
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-2">
                    <div className={`w-10 h-10 rounded bg-navy-lighter flex items-center justify-center border-b-2 ${c}`}><AlertTriangle className="w-5 h-5"/></div>
                    <div className="text-[10px] text-gray-300 leading-tight">{k.label}</div>
                    <div className={`text-[10px] font-mono ${c.split(' ')[0]}`}>{k.count} events</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle Col - Trends & Actors */}
        <div className="col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-5 h-[280px] flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-2">Sector Attack Trends (Last 30 Days)</h3>
            <div className="flex-1 w-full -ml-4 mt-2">
              {sectorDetail?.trend ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sectorDetail.trend}>
                    <XAxis dataKey="date" tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                    <YAxis tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                    <Line type="monotone" dataKey="threats" stroke="#ff3b30" strokeWidth={2} dot={false} name="Threats" />
                    <Line type="monotone" dataKey="total" stroke="#00a3ff" strokeWidth={2} dot={false} name="Total Events" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 text-xs flex items-center justify-center h-full">Loading trend...</div>
              )}
            </div>
          </div>
          
          <div className="glass-panel p-5 flex-1 flex flex-col justify-between">
            <h3 className="text-sm font-semibold text-white mb-2">Top Attack Types</h3>
            {sectorDetail?.attack_distribution?.slice(0, 4).map((a: any, i: number) => {
              const maxCount = sectorDetail.attack_distribution[0].count;
              const pct = (a.count / maxCount) * 100;
              const c = i === 0 ? 'bg-ntro-red' : i === 1 ? 'bg-ntro-amber' : 'bg-ntro-blue';
              return (
                <div key={i} className="flex items-center gap-4 text-xs py-1">
                  <div className="p-1.5 rounded bg-white/5"><Globe2 className="w-4 h-4 text-gray-400" /></div>
                  <div className="w-32">
                    <div className="text-white font-medium truncate">{a.label}</div>
                  </div>
                  <div className="flex-1 bg-navy h-2 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full rounded-full ${c}`} style={{width: `${pct}%`}}></div>
                  </div>
                  <div className="text-gray-400 font-mono w-10 text-right">{a.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col - Map & Incidents */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-0 h-[220px] relative overflow-hidden border-ntro-blue/30">
            <div className="absolute top-4 left-4 z-10"><h3 className="text-sm font-semibold text-white">Sector Risk Map</h3></div>
            <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-70" />
            <div className="absolute top-[40%] right-[35%] w-3 h-3 bg-ntro-red/50 rounded-full animate-ping z-10"></div>
            <div className="absolute top-[40%] right-[35%] w-1.5 h-1.5 bg-ntro-red rounded-full z-10 shadow-[0_0_10px_#ff3b30]"></div>
            <div className="absolute top-[45%] right-[5%] z-20 bg-navy/90 border border-ntro-red/50 rounded p-2 backdrop-blur shadow-[0_0_15px_rgba(255,59,48,0.2)] w-36">
              <div className="text-xs font-bold text-white mb-1 border-b border-white/10 pb-1">{selectedSector?.sector} Hub</div>
              <div className="text-[10px] text-ntro-red font-medium">High Risk</div>
              <div className="text-[9px] text-gray-400 mt-1">{selectedSector?.threat_count} active threats</div>
            </div>
          </div>
          
          <div className="glass-panel p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Sector Incidents</h3>
              <a href="#" className="text-xs text-ntro-blue hover:underline">View All →</a>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
               {sectorDetail?.incidents?.length ? sectorDetail.incidents.map((inc: any, i: number) => {
                 const l = inc.severity === 'CRITICAL' ? 'High' : inc.severity === 'HIGH' ? 'High' : 'Medium';
                 const c = l === 'High' ? 'text-ntro-red bg-ntro-red/10' : 'text-ntro-amber bg-ntro-amber/10';
                 return (
                   <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-3 last:border-0">
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${c}`}>!</div>
                     <div className="flex-1">
                       <div className="text-xs text-gray-300 truncate w-40">{inc.title || inc.incident_type}</div>
                       <div className="text-[9px] text-gray-500 font-mono mt-0.5">{new Date(inc.created_at).toLocaleString()}</div>
                     </div>
                   </div>
                 );
               }) : (
                 <div className="text-xs text-gray-500">No recent incidents</div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
