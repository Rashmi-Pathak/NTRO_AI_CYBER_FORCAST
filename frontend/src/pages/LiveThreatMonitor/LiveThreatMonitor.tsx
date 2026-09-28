import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldAlert, AlertOctagon, CheckCircle2, Play, Pause, Square } from 'lucide-react';
import { api } from '@/services/api';

const COLORS = ['#ff3b30', '#ff9500', '#00a3ff', '#34c759'];
const BASE_API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api';

function KpiCard({ title, value, trend, trendUp, color, icon: Icon }: any) {
  return (
    <div className={`glass-panel p-4 border-t-4`} style={{ borderTopColor: color }}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md" style={{ backgroundColor: `${color}15`, color }}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm text-gray-300 font-medium">{title}</span>
        </div>
      </div>
      <div className="mt-2 flex items-end gap-3">
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className={`text-xs flex items-center pb-1 ${trendUp ? 'text-ntro-red' : 'text-ntro-green'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      </div>
    </div>
  );
}

export default function LiveThreatMonitor() {
  const [threats, setThreats] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [pieData, setPieData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [protocolData, setProtocolData] = useState<any[]>([]);
  const [mapData, setMapData] = useState<any[]>([]);
  const [replayStatus, setReplayStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      const [sumRes, evRes, tdRes, pdRes, mapRes, repRes, ttRes] = await Promise.all([
        api.getLiveMonitorSummary(),
        api.getLiveThreats(),
        api.getThreatDistribution(),
        api.getProtocolDistribution(),
        api.getLiveThreatMap(),
        api.getReplayStatus(),
        api.getTopLiveThreats()
      ]);
      setSummary(sumRes);
      setThreats(evRes.events || evRes);
      setPieData([
        { name: 'Critical', value: tdRes.CRITICAL?.count || 0 },
        { name: 'High', value: tdRes.HIGH?.count || 0 },
        { name: 'Medium', value: tdRes.MEDIUM?.count || 0 },
        { name: 'Low', value: tdRes.LOW?.count || 0 },
      ]);
      setProtocolData(pdRes.protocols || pdRes);
      setMapData(mapRes.locations || mapRes);
      setReplayStatus(repRes);
      setBarData(ttRes.map((t: any) => ({ name: t.threatType, val: t.eventCount })));
      setLoading(false);
    } catch (err) {
      console.error("Failed to load initial live data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // Establish SSE
    const evtSource = new EventSource(`${BASE_API_URL}/live-monitor/events/stream`);
    
    evtSource.onmessage = (event) => {
      try {
        const newEvent = JSON.parse(event.data);
        setThreats(prev => [newEvent, ...prev].slice(0, 50));
        
        // Optimistically update counts if malicious
        if (newEvent.severity !== "LOW") {
           setSummary((prev: any) => prev ? {
             ...prev, 
             totalEvents: prev.totalEvents + 1,
             suspiciousEvents: prev.suspiciousEvents + 1,
             criticalThreats: newEvent.severity === 'CRITICAL' ? prev.criticalThreats + 1 : prev.criticalThreats
           } : prev);
        } else {
           setSummary((prev: any) => prev ? { ...prev, totalEvents: prev.totalEvents + 1 } : prev);
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    return () => {
      evtSource.close();
    };
  }, []);

  const handleReplayToggle = async () => {
    if (replayStatus?.status === "RUNNING") {
      await api.pauseReplay();
    } else if (replayStatus?.status === "PAUSED") {
      await api.resumeReplay();
    } else {
      await api.startReplay();
    }
    const st = await api.getReplayStatus();
    setReplayStatus(st);
  };

  const handleStopReplay = async () => {
    await api.stopReplay();
    const st = await api.getReplayStatus();
    setReplayStatus(st);
  };

  if (loading || !summary) {
    return <div className="p-10 text-white flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ntro-blue mb-4"></div>
      Connecting to threat stream...
    </div>;
  }

  const getSeverityStyles = (severity: string) => {
    if (severity === 'CRITICAL') return { color: 'text-ntro-red', border: 'border-ntro-red', bg: 'bg-ntro-red' };
    if (severity === 'HIGH') return { color: 'text-ntro-amber', border: 'border-ntro-amber', bg: 'bg-ntro-amber' };
    if (severity === 'MEDIUM') return { color: 'text-ntro-blue', border: 'border-ntro-blue', bg: 'bg-ntro-blue' };
    return { color: 'text-ntro-green', border: 'border-ntro-green', bg: 'bg-ntro-green' };
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">02. LIVE THREAT MONITOR</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Track and monitor cyber threats in real-time across all networks.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-3">
          <p className="text-xs text-gray-400 italic font-serif">
            {replayStatus?.status === "RUNNING" ? "Dataset Replay Engine Active" : "Dataset Replay Engine Paused"}
          </p>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 mr-2 font-mono">
              {replayStatus?.eventsProcessed} events | {summary.eventsPerSecond} EPS
            </div>
            <button onClick={handleReplayToggle} className="flex items-center gap-2 text-sm bg-ntro-green/10 text-ntro-green border border-ntro-green/30 px-4 py-1.5 rounded-md font-medium hover:bg-ntro-green/20 transition">
              {replayStatus?.status === "RUNNING" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {replayStatus?.status === "RUNNING" ? "Pause Stream" : "Start Replay"}
            </button>
            <button onClick={handleStopReplay} className="flex items-center gap-2 text-sm bg-ntro-red/10 text-ntro-red border border-ntro-red/30 px-3 py-1.5 rounded-md font-medium hover:bg-ntro-red/20 transition">
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Total Events" value={summary.totalEvents.toLocaleString()} trend={`${summary.eventsPerSecond} eps`} trendUp={true} color="#00a3ff" icon={Activity} />
        <KpiCard title="Malicious" value={summary.suspiciousEvents.toLocaleString()} trend="+5.2%" trendUp={true} color="#ff3b30" icon={ShieldAlert} />
        <KpiCard title="Critical" value={summary.criticalThreats.toLocaleString()} trend="-1.5%" trendUp={false} color="#ff9500" icon={AlertOctagon} />
        <KpiCard title="Affected Sectors" value={summary.affectedSectors.toLocaleString()} trend="Stable" trendUp={false} color="#34c759" icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* World Map - Left 5 cols */}
        <div className="col-span-5 glass-panel p-0 relative overflow-hidden h-[350px] border-ntro-blue/20">
          <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            {mapData.map((t: any, i: number) => {
              // Convert lat/lng to pseudo-percentages for the static map background
              // India roughly: Lat 8 to 37 (bottom to top), Lng 68 to 97 (left to right)
              const top = 100 - ((t.latitude - 8) / (37 - 8)) * 100;
              const left = ((t.longitude - 68) / (97 - 68)) * 100;
              
              const isCritical = t.severity === 'CRITICAL';
              return (
                <div 
                  key={t.location + i} 
                  className={`w-3 h-3 rounded-full absolute group ${isCritical ? 'bg-ntro-red shadow-[0_0_10px_#ff3b30] animate-pulse' : 'bg-ntro-amber shadow-[0_0_10px_#ff9500]'}`}
                  style={{ top: `${Math.max(10, Math.min(top, 90))}%`, left: `${Math.max(10, Math.min(left, 90))}%` }}
                >
                  <div className="hidden group-hover:block absolute bg-navy/90 border border-white/20 p-2 rounded text-xs text-white z-20 w-32 -top-10 -left-14">
                    <div className="font-bold">{t.location}</div>
                    <div className="text-gray-400">{t.sector}</div>
                    <div className="text-ntro-red">{t.eventCount} threats</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Origins & Targets - Mid 3 cols */}
        <div className="col-span-3 glass-panel p-5 border-ntro-blue/20 flex flex-col gap-6 h-[350px]">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Targeted Sectors</h3>
            <div className="space-y-2.5">
              {mapData.slice(0, 5).map((item: any) => {
                const max = Math.max(...mapData.map((d: any) => d.eventCount)) || 1;
                const pct = Math.round((item.eventCount / max) * 100);
                return (
                  <div key={item.sector} className="flex items-center text-xs">
                    <div className="w-20 text-gray-400 truncate pr-2">{item.sector}</div>
                    <div className="flex-1 bg-navy h-1.5 rounded-full overflow-hidden mr-3">
                      <div className="h-full bg-ntro-blue" style={{width: `${pct}%`}}></div>
                    </div>
                    <div className="w-8 text-right text-gray-500 font-mono">{item.eventCount}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Live Protocols</h3>
            <div className="space-y-2.5">
              {protocolData.slice(0, 5).map((item: any) => {
                const max = protocolData[0]?.value || 1;
                const pct = Math.round((item.value / max) * 100);
                return (
                  <div key={item.name} className="flex items-center text-xs">
                    <div className="w-20 text-gray-400">{item.name}</div>
                    <div className="flex-1 bg-navy h-1.5 rounded-full overflow-hidden mr-3">
                      <div className="h-full bg-ntro-amber" style={{width: `${pct}%`}}></div>
                    </div>
                    <div className="w-8 text-right text-gray-500 font-mono">{item.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Event Stream Table - Right 4 cols */}
        <div className="col-span-4 glass-panel p-5 border-ntro-blue/20 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Live Event Stream
              {replayStatus?.status === "RUNNING" && <span className="w-2 h-2 bg-ntro-green rounded-full animate-pulse"></span>}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-xs text-left text-gray-400">
              <thead className="text-gray-500 font-mono border-b border-white/10 sticky top-0 bg-navy/90 backdrop-blur z-10">
                <tr>
                  <th className="pb-2 font-normal">Time</th>
                  <th className="pb-2 font-normal">Source IP</th>
                  <th className="pb-2 font-normal">Event Type</th>
                  <th className="pb-2 font-normal text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {threats.map((row: any, idx: number) => {
                  const style = getSeverityStyles(row.severity);
                  return (
                    <tr 
                      key={`${row.eventId}-${idx}`} 
                      className="hover:bg-white/5 animate-in fade-in duration-300 cursor-pointer"
                      onClick={() => window.location.href = `/live-threats/${row.eventId}`}
                    >
                      <td className="py-2.5 font-mono">{new Date(row.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5 font-mono truncate max-w-[90px]">{row.sourceIp || '10.x.x.x'}</td>
                      <td className="py-2.5 capitalize">{row.threatType?.toLowerCase().replace(/_/g, ' ')}</td>
                      <td className="py-2.5 text-right">
                        <span className={`border rounded px-1.5 py-0.5 text-[10px] ${style.color} ${style.border}`}>
                          {row.severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row - 3 cols */}
      <div className="grid grid-cols-3 gap-6 h-[220px]">
        {/* Donut Chart */}
        <div className="glass-panel p-5 border-ntro-blue/20 flex items-center justify-between">
          <div className="h-full w-1/2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData.map(d => ({ ...d, value: d.value || 1 }))} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-xl font-bold text-white">{pieData.reduce((acc, curr) => acc + curr.value, 0)}</div>
              <div className="text-[10px] text-gray-400">Total Threats</div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-2 pl-4">
            <h3 className="text-sm font-semibold text-white mb-1">Event Severity</h3>
            {pieData.map((item, i) => (
              <div key={item.name} className="flex justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></span>
                  {item.name}
                </div>
                <div className="text-gray-500 font-mono">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-2">Event Types</h3>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData.length ? barData : [{name: 'Loading', val: 1}]} layout="vertical" margin={{top: 0, right: 0, left: 30, bottom: 0}}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{fill: '#9ca3af', fontSize: 10}} axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px'}} />
                <Bar dataKey="val" fill="#00a3ff" radius={[0, 4, 4, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Malicious IPs Table */}
        <div className="glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-white">Top Target Assets</h3>
          </div>
          <table className="w-full text-xs text-left text-gray-400">
            <thead className="text-gray-500 font-mono border-b border-white/10">
              <tr>
                <th className="pb-1.5 font-normal">Asset ID</th>
                <th className="pb-1.5 font-normal">Sector</th>
                <th className="pb-1.5 font-normal text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 overflow-y-auto">
              {threats.filter(t => t.severity !== 'LOW').slice(0, 5).map((row: any, i: number) => (
                <tr key={i}>
                  <td className="py-2 font-mono text-gray-300">{row.destinationAsset}</td>
                  <td className="py-2 text-ntro-blue truncate max-w-[100px]">{row.sector}</td>
                  <td className="py-2 text-right font-mono text-ntro-red">{row.riskScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

