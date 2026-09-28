import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Target, Activity, ShieldAlert, Crosshair, Map } from 'lucide-react';
import { api } from '../../services/api';

function KpiCard({ title, value, trend, trendUp, color, icon: Icon }: any) {
  return (
    <div className={`glass-panel p-4 border-l-2`} style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md" style={{ backgroundColor: `${color}15`, color }}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm text-gray-300 font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-end justify-between mt-2">
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className={`text-xs flex items-center font-mono ${trendUp ? 'text-ntro-red' : 'text-ntro-green'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      </div>
    </div>
  );
}

export default function AttackForecast() {
  const [summary, setSummary] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [attackTypes, setAttackTypes] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Next 6 Hours');

  useEffect(() => {
    async function fetchData() {
      try {
        const [sum, tml, sec, types, evts] = await Promise.all([
          api.getForecastSummary(),
          api.getForecastTimeline(),
          api.getForecastSectors(),
          api.getForecastAttackTypes(),
          api.getForecastRiskEvents()
        ]);
        
        if (sum && !sum.error) setSummary(sum);
        setTimeline(tml || []);
        setSectors(sec || []);
        setAttackTypes(types || []);
        setEvents(evts || []);
      } catch (e) {
        console.error("Failed to load forecast data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-white flex items-center justify-center h-full">Loading Attack Forecast...</div>;
  }

  const kpis = summary?.kpis || [
    { title: "Predicted Attacks", value: "0", trend: "0%", trendUp: false, icon: Activity },
    { title: "High Risk", value: "0", trend: "0%", trendUp: false, icon: ShieldAlert },
    { title: "Medium Risk", value: "0", trend: "0%", trendUp: false, icon: ShieldAlert },
    { title: "Low Risk", value: "0", trend: "0%", trendUp: false, icon: ShieldAlert }
  ];

  const colors = ["#ff3b30", "#ff3b30", "#ff9500", "#34c759"];
  const icons = [Activity, ShieldAlert, ShieldAlert, ShieldAlert];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Target className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">03. ATTACK FORECAST</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Predict and visualize potential cyber attacks using ML.</p>
          {summary?.model_status && (
            <p className="text-xs text-ntro-blue pl-12 mt-1 font-mono">
              Model: {summary.model_status.name} v{summary.model_status.version} • Horizon: {summary.model_status.horizon} • MAE: {summary.model_status.validation_mae}
            </p>
          )}
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
          <p className="text-xs text-gray-400 italic font-serif mb-2">"Anticipate threats. Strengthen tomorrow."</p>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-navy border border-ntro-blue/30 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:border-ntro-blue w-full md:w-auto">
            <option>Next 6 Hours</option>
            <option>Next 12 Hours</option>
            <option>Next 24 Hours</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi: any, idx: number) => (
          <KpiCard 
            key={idx}
            title={kpi.title} 
            value={kpi.value === '-' ? '0' : kpi.value} 
            trend={kpi.trend} 
            trendUp={kpi.trendUp} 
            color={colors[idx]} 
            icon={icons[idx]} 
          />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Map & Banner) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col relative overflow-hidden min-h-[300px]">
            <h3 className="text-sm font-semibold text-white mb-2 z-10">Attack Risk Heatmap ({timeFilter})</h3>
            <div className="absolute inset-0 mt-10 bg-[url('/images/media_1788614033805.png')] bg-contain bg-center bg-no-repeat mix-blend-screen opacity-80" />
            
            {/* Some mock heat spots */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-[40%] left-[30%] w-8 h-8 rounded-full bg-ntro-red/20 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-ntro-red shadow-[0_0_10px_#ff3b30]"></div>
              </div>
              <div className="absolute top-[60%] left-[45%] w-6 h-6 rounded-full bg-ntro-amber/20 flex items-center justify-center animate-pulse delay-75">
                <div className="w-1.5 h-1.5 rounded-full bg-ntro-amber shadow-[0_0_10px_#ff9500]"></div>
              </div>
            </div>

            <div className="mt-auto z-10 bg-navy/80 p-2 rounded border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-ntro-red shadow-[0_0_8px_#ff3b30]"></div>
                <div className="text-xs">
                  <div className="text-gray-300">High Risk</div>
                  <div className="text-white font-bold text-sm">{kpis[1]?.value === '-' ? '0' : kpis[1]?.value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-ntro-amber shadow-[0_0_8px_#ff9500]"></div>
                <div className="text-xs">
                  <div className="text-gray-300">Medium Risk</div>
                  <div className="text-white font-bold text-sm">{kpis[2]?.value === '-' ? '0' : kpis[2]?.value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-ntro-green shadow-[0_0_8px_#34c759]"></div>
                <div className="text-xs">
                  <div className="text-gray-300">Low Risk</div>
                  <div className="text-white font-bold text-sm">{kpis[3]?.value === '-' ? '0' : kpis[3]?.value}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-0 border-ntro-blue/30 relative overflow-hidden group cursor-pointer min-h-[120px]">
            <div className="absolute inset-0 bg-[url('/images/media_1788614149583.png')] bg-cover bg-center mix-blend-screen opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent p-5 flex flex-col justify-center">
              <div className="text-white font-bold text-lg leading-tight mb-2 tracking-wider">PREDICTING TODAY.<br/>PROTECTING TOMORROW.</div>
              <button className="bg-ntro-blue hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded-md self-start font-medium transition-colors">
                Explore Forecast Models →
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column (Sectors & Vectors) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col min-w-0 min-h-[250px]">
            <h3 className="text-sm font-semibold text-white mb-4">Sector Risk Forecast</h3>
            <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-hide pr-2">
              {sectors.length > 0 ? sectors.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <Crosshair className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-300 truncate max-w-[120px]" title={s.name}>{s.name}</span>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded border ${s.color} ${s.bg}`}>
                    {s.risk}
                  </div>
                </div>
              )) : <div className="text-xs text-gray-500 italic mt-4">Loading model predictions...</div>}
            </div>
            <div className="mt-4 text-right">
              <a href="#" className="text-xs text-ntro-blue hover:underline">View Full Forecast →</a>
            </div>
          </div>
          
          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col min-w-0 min-h-[200px]">
            <h3 className="text-sm font-semibold text-white mb-4">Top Predicted Attack Vectors</h3>
            <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-hide pr-2">
              {attackTypes.length > 0 ? attackTypes.map((v, i) => (
                <div key={i} className="flex items-center text-xs py-1.5">
                  <div className="w-6 text-gray-500 font-mono shrink-0">0{i+1}</div>
                  <div className="flex-1 text-gray-300 truncate pr-2" title={v.name}>{v.name}</div>
                  <div className="w-12 text-right text-gray-400 font-mono shrink-0">{v.val}%</div>
                </div>
              )) : <div className="text-xs text-gray-500 italic mt-4">Loading...</div>}
            </div>
          </div>
        </div>

        {/* Right Column (Trends & Timeline) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5 border-ntro-blue/20 min-h-[250px] flex flex-col min-w-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Prediction Trends</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-ntro-blue rounded-full"></span> <span className="text-gray-400">Predicted</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-ntro-red rounded-full"></span> <span className="text-gray-400">Actual</span></div>
              </div>
            </div>
            <div className="flex-1 w-full -ml-4 min-w-0 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00a3ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00a3ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                  <YAxis tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                  <Area type="monotone" dataKey="predicted" stroke="#00a3ff" fillOpacity={1} fill="url(#colorPred)" strokeWidth={2} />
                  <Area type="monotone" dataKey="actual" stroke="#ff3b30" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col min-w-0 min-h-[250px] overflow-hidden">
            <h3 className="text-sm font-semibold text-white mb-4">Risk Timeline</h3>
            <div className="relative flex-1 pl-4 border-l border-white/10 ml-2 space-y-6 pt-2 overflow-y-auto scrollbar-hide">
              {events.length > 0 ? events.map((ev, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${ev.dot} ring-4 ring-[#0f172a] shadow-[0_0_8px_#ff3b30]`}></div>
                  <div className="text-xs text-gray-500 font-mono mb-1">{ev.date}</div>
                  <div className="text-sm text-gray-300 pr-2">{ev.title}</div>
                </div>
              )) : <div className="text-xs text-gray-500 italic mt-4">Loading timeline events...</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
