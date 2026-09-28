import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Grid, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, MapPin, ChevronRight, Activity, Globe } from 'lucide-react';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';

function KpiCard({ title, value, trend, trendUp, color, icon: Icon, data }: any) {
  const chartData = data || Array.from({length: 10}).map(() => ({ val: Math.random() * 100 }));
  return (
    <div className={`glass-panel p-4 border-l-4 flex flex-col justify-between`} style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md" style={{ backgroundColor: `${color}20`, color }}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm text-gray-300 font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
          <div className={`text-xs flex items-center mt-1 ${trendUp ? 'text-ntro-green' : 'text-ntro-red'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend}
          </div>
        </div>
        <div className="w-24 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const [data, setData] = useState<any>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    Promise.all([
      api.getDashboardSummary().catch(e => null),
      api.getLiveThreatMap().catch(e => null)
    ]).then(([res, mapRes]) => {
      if (res) setData(res);
      if (mapRes) setMapData(mapRes);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000); // Poll every 5s for real-time feel
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-white p-10 flex justify-center items-center h-full">Loading Command Center...</div>;
  }

  if (!data) {
    return <div className="text-white p-10">Error loading dashboard data.</div>;
  }

  const { summary = {}, attack_distribution = [], sector_distribution = [], protocol_distribution = [], recent_threats = [], trend_data = [] } = data;

  // Format trend data for AreaChart
  const formattedTrendData = trend_data.map((d: any) => ({
    name: d.date ? d.date.split('-').slice(1).join('/') : '',
    total: d.total || 0,
    threats: d.threats || 0,
  }));

  // Helper for icons and colors based on severity
  const getSeverityStyles = (severity: string) => {
    if (severity === 'CRITICAL') return { color: 'text-ntro-red', bg: 'bg-ntro-red/20', icon: AlertTriangle, hex: '#ff3b30' };
    if (severity === 'HIGH') return { color: 'text-ntro-amber', bg: 'bg-ntro-amber/20', icon: AlertTriangle, hex: '#ff9500' };
    if (severity === 'MEDIUM') return { color: 'text-ntro-blue', bg: 'bg-ntro-blue/20', icon: Activity, hex: '#00a3ff' };
    return { color: 'text-ntro-green', bg: 'bg-ntro-green/20', icon: ShieldCheck, hex: '#34c759' };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Grid className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">01. COMMAND CENTER</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Global view of cyber threats, infrastructure and critical insights at a glance.</p>
        </div>
        <div className="md:text-right flex flex-col items-start md:items-end">
          <p className="text-xs text-gray-400 italic font-serif mb-2">"Situational awareness today, a resilient tomorrow."</p>
          <Link to="/live-monitor" className="flex items-center gap-2 text-sm bg-navy border border-ntro-blue/30 px-4 py-1.5 rounded-md hover:bg-ntro-blue/10 transition-colors">
            <Globe className="w-4 h-4 text-ntro-blue" />
            Global View
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Active Threats" value={summary.suspicious_events?.toLocaleString() || 0} trend="+2.4%" trendUp={false} color="#f23b4d" icon={Activity} data={formattedTrendData.map((d: any) => ({val: d.threats}))} />
        <KpiCard title="Monitored Assets" value={summary.total_assets?.toLocaleString() || 0} trend="Stable" trendUp={true} color="#1683e8" icon={Globe} />
        <KpiCard title="Critical Alerts" value={summary.critical_threats?.toLocaleString() || 0} trend="-5.1%" trendUp={true} color="#f59e0b" icon={AlertTriangle} data={formattedTrendData.map((d: any) => ({val: d.threats * 0.2}))} />
        <KpiCard title="Systems Online" value="99.7%" trend="Optimal" trendUp={true} color="#16b86a" icon={ShieldCheck} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[400px]">
        {/* World Map - Left 7 cols */}
        <div className="col-span-1 md:col-span-7 glass-panel p-6 border-ntro-blue/20 flex flex-col relative bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen bg-no-repeat">
          <div className="flex justify-between items-start z-10 w-full mb-auto">
            <div>
              <h3 className="text-lg font-semibold text-white">Live Global Threat Map</h3>
              <p className="text-xs text-gray-400">Real-time cyber threats across the world.</p>
            </div>
            <div className="glass-panel p-3 border-ntro-blue/30 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm mb-2"><span className="w-2 h-2 bg-ntro-red rounded-full shadow-[0_0_5px_#ff3b30]"></span> Critical</div>
              <div className="flex items-center gap-2 text-sm mb-2"><span className="w-2 h-2 bg-ntro-amber rounded-full shadow-[0_0_5px_#ff9500]"></span> High Risk</div>
              <div className="flex items-center gap-2 text-sm"><span className="w-2 h-2 bg-ntro-blue rounded-full shadow-[0_0_5px_#00a3ff]"></span> Monitoring</div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative z-10 w-full my-4">
             {!mapData || !mapData.locations || mapData.locations.length === 0 ? (
               <div className="text-gray-400 bg-navy/80 px-4 py-2 rounded-md">Location unavailable</div>
             ) : (
               <div className="w-full h-full relative">
                 {/* Map markers would go here if we were using a real map library, but for a static bg, we just show a few dots based on mapData */}
                 {mapData.locations.map((loc: any, idx: number) => (
                    <div key={idx} className="absolute w-3 h-3 rounded-full bg-ntro-red shadow-[0_0_10px_#ff3b30]" style={{ left: `${loc.x || 50}%`, top: `${loc.y || 50}%` }} title={loc.name} />
                 ))}
               </div>
             )}
          </div>
          
          <div className="flex justify-between items-end z-10 w-full mt-auto">
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-white">{summary.total_events > 1000 ? (summary.total_events/1000).toFixed(1) + 'K' : summary.total_events || 0}</div>
                <div className="text-xs text-gray-400">Total Events Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{summary.affected_sectors || 0}</div>
                <div className="text-xs text-gray-400">Targeted Sectors</div>
              </div>
            </div>
            <Link to="/live-monitor" className="text-xs text-ntro-blue border border-ntro-blue/50 rounded-md px-3 py-1 hover:bg-ntro-blue/10 backdrop-blur-md">
              View Full Map →
            </Link>
          </div>
        </div>

        {/* Live Activity Feed - Right 5 cols */}
        <div className="col-span-1 md:col-span-5 glass-panel p-5 border-ntro-blue/20 flex flex-col h-full min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Live Activity Feed</h3>
            <Link to="/live-monitor" className="text-xs text-ntro-blue hover:underline">View All →</Link>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
            {recent_threats.length === 0 ? (
              <div className="text-sm text-gray-400">No recent activity.</div>
            ) : (
              recent_threats.slice(0, 7).map((threat: any, i: number) => {
                const styles = getSeverityStyles(threat.severity);
                const Icon = styles.icon;
                return (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className={`p-1.5 rounded-md mt-0.5 ${styles.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${styles.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className={`text-sm font-medium ${styles.color}`}>{threat.attack_label || threat.threat_type || 'Unknown'}</span>
                        <span className="text-xs text-gray-500 font-mono">{threat.timestamp ? new Date(threat.timestamp).toLocaleTimeString() : ''}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">IP: {threat.source_ip || 'Unknown'} → {threat.sector || 'Unknown'}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[250px]">
        {/* Trends */}
        <div className="col-span-1 md:col-span-6 glass-panel p-5 border-ntro-blue/20 flex flex-col h-full min-h-[250px]">
          <h3 className="text-sm font-semibold text-white mb-4">Threat Trends (Last 7 Days)</h3>
          <div className="flex-1 w-full -ml-4 min-w-0">
            {formattedTrendData.length === 0 ? (
              <div className="text-sm text-gray-400 h-full flex items-center justify-center ml-4">No trend data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedTrendData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#087cf0" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#087cf0" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f23b4d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f23b4d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                  <YAxis tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#0b1b46', border: '1px solid #1683e8', color: '#fff'}} />
                  <Area type="monotone" dataKey="total" stroke="#087cf0" fillOpacity={1} fill="url(#colorTotal)" name="Total Events" />
                  <Area type="monotone" dataKey="threats" stroke="#f23b4d" fillOpacity={1} fill="url(#colorThreats)" name="Threats" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        {/* Targeted Sectors */}
        <div className="col-span-1 md:col-span-3 glass-panel p-5 border-ntro-blue/20 flex flex-col h-full min-h-[250px]">
          <h3 className="text-sm font-semibold text-white mb-4">Top Targeted Sectors</h3>
          <div className="flex-1 flex flex-col justify-start overflow-y-auto pr-2 scrollbar-hide">
            {sector_distribution.length === 0 ? (
              <div className="text-sm text-gray-400">No sector data.</div>
            ) : (
              sector_distribution.slice(0, 5).map((item: any) => {
                // calculate percentage relative to max
                const maxCount = sector_distribution[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.sector} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-300">{item.sector}</span>
                      <span className="text-gray-400 font-mono">{item.count?.toLocaleString() || 0} alerts</span>
                    </div>
                    <div className="w-full bg-navy border border-white/5 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-ntro-blue h-full rounded-full shadow-[0_0_5px_#00a3ff]" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Attack Types */}
        <div className="col-span-1 md:col-span-3 glass-panel p-5 border-ntro-blue/20 flex flex-col h-full min-h-[250px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Top Attack Types</h3>
            <Link to="/attack-forecast" className="text-xs text-ntro-blue hover:underline">View Predictions →</Link>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {attack_distribution.length === 0 ? (
              <div className="text-sm text-gray-400">No attack type data.</div>
            ) : (
              attack_distribution.filter((a: any) => a.label !== 'NORMAL').slice(0, 5).map((item: any, i: number) => {
                const styles = i === 0 ? 'bg-ntro-red text-ntro-red' : i === 1 ? 'bg-ntro-amber text-ntro-amber' : 'bg-ntro-blue text-ntro-blue';
                return (
                  <div key={item.label} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.split(' ')[0]}`}></div>
                      <div className="truncate text-xs text-gray-300 capitalize">{item.label?.replace(/_/g, ' ').toLowerCase() || 'Unknown'}</div>
                    </div>
                    <div className={`text-[10px] font-mono shrink-0 ml-2 ${styles.split(' ')[1]}`}>{item.count?.toLocaleString() || 0}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
