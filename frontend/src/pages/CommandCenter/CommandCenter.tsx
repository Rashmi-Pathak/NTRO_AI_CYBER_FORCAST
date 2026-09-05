import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Grid, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, MapPin, ChevronRight, Activity, Globe } from 'lucide-react';

const mockTrendData = Array.from({length: 10}).map((_, i) => ({
  name: `Sep 0${i+1}`,
  network: Math.floor(Math.random() * 200) + 100,
  phishing: Math.floor(Math.random() * 150) + 50,
  ddos: Math.floor(Math.random() * 100) + 20,
  ransomware: Math.floor(Math.random() * 50) + 10,
}));

const mockMiniChart = Array.from({length: 10}).map(() => ({ val: Math.random() * 100 }));

function KpiCard({ title, value, trend, trendUp, color, icon: Icon, dataKey }: any) {
  return (
    <div className={`glass-panel p-4 border-l-4`} style={{ borderLeftColor: color }}>
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
            <LineChart data={mockMiniChart}>
              <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function CommandCenter() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Grid className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">01. COMMAND CENTER</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Global view of cyber threats, infrastructure and critical insights at a glance.</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-xs text-gray-400 italic font-serif mb-2">"Situational awareness today, a resilient tomorrow."</p>
          <button className="flex items-center gap-2 text-sm bg-navy border border-ntro-blue/30 px-4 py-1.5 rounded-md hover:bg-ntro-blue/10 transition-colors">
            <Globe className="w-4 h-4 text-ntro-blue" />
            Global View
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Active Threats" value="1,248" trend="12%" trendUp={false} color="#ff3b30" icon={Activity} />
        <KpiCard title="Monitored Assets" value="3,890" trend="5%" trendUp={true} color="#00a3ff" icon={Globe} />
        <KpiCard title="Critical Alerts" value="87" trend="34%" trendUp={false} color="#ff9500" icon={AlertTriangle} />
        <KpiCard title="Systems Online" value="99.7%" trend="0.2%" trendUp={true} color="#34c759" icon={ShieldCheck} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6 h-[400px]">
        {/* World Map - Left 7 cols */}
        <div className="col-span-7 glass-panel p-0 relative overflow-hidden flex flex-col border-ntro-blue/20">
          <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-50" />
          
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
            <h3 className="text-lg font-semibold text-white">Live Global Threat Map</h3>
            <p className="text-xs text-gray-400">Real-time cyber threats across the world.</p>
          </div>
          
          <div className="absolute top-6 right-6 z-10 glass-panel p-3 border-ntro-blue/30 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm mb-2"><span className="w-2 h-2 bg-ntro-red rounded-full shadow-[0_0_5px_#ff3b30]"></span> Malware</div>
            <div className="flex items-center gap-2 text-sm mb-2"><span className="w-2 h-2 bg-ntro-amber rounded-full shadow-[0_0_5px_#ff9500]"></span> DDoS</div>
            <div className="flex items-center gap-2 text-sm"><span className="w-2 h-2 bg-ntro-blue rounded-full shadow-[0_0_5px_#00a3ff]"></span> Ransomware</div>
          </div>
          
          <div className="absolute bottom-6 left-6 z-10 flex gap-8">
            <div>
              <div className="text-3xl font-bold text-white">32K</div>
              <div className="text-xs text-gray-400">Total Attacks (24H)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-xs text-gray-400">High-risk Regions</div>
            </div>
          </div>
          
          <button className="absolute bottom-6 right-6 z-10 text-xs text-ntro-blue border border-ntro-blue/50 rounded-md px-3 py-1 hover:bg-ntro-blue/10 backdrop-blur-md">
            View Full Map →
          </button>
        </div>

        {/* Live Activity Feed - Right 5 cols */}
        <div className="col-span-5 glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Live Activity Feed</h3>
            <a href="#" className="text-xs text-ntro-blue hover:underline">View All →</a>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
            {[
              { time: '14:32:01', type: 'Malware detected', detail: '192.168.10.22', icon: Activity, color: 'text-ntro-red', bg: 'bg-ntro-red/20' },
              { time: '14:31:45', type: 'Suspicious login', detail: 'admin@ntro.gov.in', icon: AlertTriangle, color: 'text-ntro-amber', bg: 'bg-ntro-amber/20' },
              { time: '14:30:12', type: 'Unusual data transfer', detail: '2.4 GB → Unknown IP', icon: Activity, color: 'text-ntro-blue', bg: 'bg-ntro-blue/20' },
              { time: '14:28:55', type: 'Phishing attempt', detail: 'Source: dop.gov.in', icon: Activity, color: 'text-ntro-red', bg: 'bg-ntro-red/20' },
              { time: '14:27:10', type: 'Threat contained', detail: 'Auto-response triggered', icon: ShieldCheck, color: 'text-ntro-green', bg: 'bg-ntro-green/20' },
            ].map((feed, i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className={`p-1.5 rounded-md mt-0.5 ${feed.bg}`}>
                  <feed.icon className={`w-3.5 h-3.5 ${feed.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${feed.color}`}>{feed.type}</span>
                    <span className="text-xs text-gray-500 font-mono">{feed.time}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{feed.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-6 h-[250px]">
        {/* Trends */}
        <div className="col-span-6 glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Threat Trends (Last 7 Days)</h3>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a3ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00a3ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPhish" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34c759" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34c759" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                <YAxis tick={{fill: '#6b7280', fontSize: 10}} stroke="#374151" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
                <Area type="monotone" dataKey="network" stroke="#00a3ff" fillOpacity={1} fill="url(#colorNet)" />
                <Area type="monotone" dataKey="phishing" stroke="#34c759" fillOpacity={1} fill="url(#colorPhish)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Targeted Sectors */}
        <div className="col-span-3 glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Top Targeted Sectors</h3>
          <div className="flex-1 flex flex-col justify-between">
            {[
              { label: 'Government', val: 38 },
              { label: 'Banking & Finance', val: 18 },
              { label: 'Power & Energy', val: 12 },
              { label: 'Healthcare', val: 10 },
              { label: 'Telecom', val: 8 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-gray-400 font-mono">{item.val}%</span>
                </div>
                <div className="w-full bg-navy border border-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-ntro-blue h-full rounded-full shadow-[0_0_5px_#00a3ff]" style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Intel Feed */}
        <div className="col-span-3 glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Threat Intelligence Feed</h3>
            <a href="#" className="text-xs text-ntro-blue hover:underline">View All →</a>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {[
              { time: '5 min ago', type: 'APT-C28 targeting Indian infra', level: 'High', color: 'bg-ntro-red' },
              { time: '12 min ago', type: 'New phishing campaign detected', level: 'Medium', color: 'bg-ntro-amber' },
              { time: '32 min ago', type: 'Critical vulnerability in VMWare', level: 'High', color: 'bg-ntro-red' },
              { time: '1 hr ago', type: 'Suspicious C2 traffic from RU', level: 'Medium', color: 'bg-ntro-amber' },
              { time: '2 hrs ago', type: 'New IOC added to database', level: 'Low', color: 'bg-ntro-green' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.color}`}></div>
                  <div className="truncate text-xs text-gray-300">{item.type}</div>
                </div>
                <div className="text-[10px] text-gray-500 font-mono shrink-0 ml-2">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
