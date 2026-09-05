import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldAlert, AlertOctagon, CheckCircle2 } from 'lucide-react';

const COLORS = ['#ff3b30', '#ff9500', '#00a3ff', '#34c759'];
const pieData = [
  { name: 'Critical', value: 9 },
  { name: 'High', value: 24 },
  { name: 'Medium', value: 32 },
  { name: 'Low', value: 35 },
];

const barData = [
  { name: 'Malware', val: 38 },
  { name: 'Phishing', val: 27 },
  { name: 'DDoS', val: 14 },
  { name: 'Suspicious Login', val: 12 },
  { name: 'Data Exfiltration', val: 9 },
];

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
          ↑ {trend}
        </div>
      </div>
    </div>
  );
}

export default function LiveThreatMonitor() {
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
        <div className="text-right flex flex-col items-end">
          <p className="text-xs text-gray-400 italic font-serif mb-2">"See the unseen. Stop the unseen."</p>
          <button className="flex items-center gap-2 text-sm bg-ntro-green/10 text-ntro-green border border-ntro-green/30 px-4 py-1.5 rounded-md font-medium">
            <span className="w-2 h-2 bg-ntro-green rounded-full animate-pulse"></span>
            Real-time
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Total Events" value="12,438" trend="18%" trendUp={true} color="#00a3ff" icon={Activity} />
        <KpiCard title="Malicious" value="842" trend="28%" trendUp={true} color="#ff3b30" icon={ShieldAlert} />
        <KpiCard title="Suspicious" value="1,206" trend="12%" trendUp={true} color="#ff9500" icon={AlertOctagon} />
        <KpiCard title="Benign" value="10,390" trend="5%" trendUp={false} color="#34c759" icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* World Map - Left 5 cols */}
        <div className="col-span-5 glass-panel p-0 relative overflow-hidden h-[350px] border-ntro-blue/20">
          <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Some static glowing dots for the map */}
            <div className="w-2 h-2 bg-ntro-red rounded-full absolute top-[30%] left-[20%] shadow-[0_0_10px_#ff3b30]"></div>
            <div className="w-2 h-2 bg-ntro-red rounded-full absolute top-[40%] left-[50%] shadow-[0_0_10px_#ff3b30]"></div>
            <div className="w-2 h-2 bg-ntro-red rounded-full absolute top-[60%] left-[60%] shadow-[0_0_10px_#ff3b30] animate-pulse"></div>
          </div>
        </div>

        {/* Origins & Targets - Mid 3 cols */}
        <div className="col-span-3 glass-panel p-5 border-ntro-blue/20 flex flex-col gap-6 h-[350px]">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Attack Origins</h3>
            <div className="space-y-2.5">
              {[ {c: 'Russia', v: 38, col: 'bg-ntro-red'}, {c: 'China', v: 32, col: 'bg-ntro-red'}, {c: 'USA', v: 12, col: 'bg-ntro-blue'}, {c: 'Unknown', v: 10, col: 'bg-ntro-blue'}, {c: 'Others', v: 8, col: 'bg-gray-600'} ].map((item) => (
                <div key={item.c} className="flex items-center text-xs">
                  <div className="w-20 text-gray-400">{item.c}</div>
                  <div className="flex-1 bg-navy h-1.5 rounded-full overflow-hidden mr-3"><div className={`h-full ${item.col}`} style={{width: `${item.v}%`}}></div></div>
                  <div className="w-6 text-right text-gray-500 font-mono">{item.v}%</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Target Countries</h3>
            <div className="space-y-2.5">
              {[ {c: 'India', v: 48, col: 'bg-ntro-blue'}, {c: 'USA', v: 18, col: 'bg-ntro-blue'}, {c: 'Germany', v: 12, col: 'bg-ntro-blue'}, {c: 'UK', v: 8, col: 'bg-ntro-blue'}, {c: 'Others', v: 14, col: 'bg-gray-600'} ].map((item) => (
                <div key={item.c} className="flex items-center text-xs">
                  <div className="w-20 text-gray-400">{item.c}</div>
                  <div className="flex-1 bg-navy h-1.5 rounded-full overflow-hidden mr-3"><div className={`h-full ${item.col}`} style={{width: `${item.v}%`}}></div></div>
                  <div className="w-6 text-right text-gray-500 font-mono">{item.v}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Event Stream Table - Right 4 cols */}
        <div className="col-span-4 glass-panel p-5 border-ntro-blue/20 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Live Event Stream</h3>
            <a href="#" className="text-xs text-ntro-blue hover:underline">View All →</a>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-xs text-left text-gray-400">
              <thead className="text-gray-500 font-mono border-b border-white/10 sticky top-0 bg-navy/90 backdrop-blur">
                <tr><th className="pb-2 font-normal">Time</th><th className="pb-2 font-normal">Source IP</th><th className="pb-2 font-normal">Event Type</th><th className="pb-2 font-normal text-right">Severity</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { t: '14:38:21', ip: '192.168.10.22', type: 'Malware', sev: 'High', col: 'text-ntro-red border-ntro-red' },
                  { t: '14:36:08', ip: '91.198.88.12', type: 'Suspicious Login', sev: 'Medium', col: 'text-ntro-amber border-ntro-amber' },
                  { t: '14:35:02', ip: '203.0.113.5', type: 'Port Scan', sev: 'High', col: 'text-ntro-red border-ntro-red' },
                  { t: '14:32:18', ip: '194.21.15.77', type: 'DDoS Attempt', sev: 'Critical', col: 'text-white bg-ntro-red px-2 rounded font-bold border-transparent' },
                  { t: '14:30:21', ip: '45.105.22.4', type: 'Data Exfiltration', sev: 'High', col: 'text-ntro-red border-ntro-red' },
                  { t: '14:28:44', ip: '8.8.8.8', type: 'Unusual DNS', sev: 'Low', col: 'text-ntro-green border-ntro-green' },
                  { t: '14:25:11', ip: '110.43.2.45', type: 'Phishing', sev: 'Medium', col: 'text-ntro-amber border-ntro-amber' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="py-2.5 font-mono">{row.t}</td>
                    <td className="py-2.5 font-mono">{row.ip}</td>
                    <td className="py-2.5">{row.type}</td>
                    <td className="py-2.5 text-right"><span className={`border rounded px-1.5 py-0.5 text-[10px] ${row.col}`}>{row.sev}</span></td>
                  </tr>
                ))}
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
                <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-xl font-bold text-white">12.4K</div>
              <div className="text-[10px] text-gray-400">Total Events</div>
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
                <div className="text-gray-500 font-mono">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-2">Event Types</h3>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{top: 0, right: 0, left: 30, bottom: 0}}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{fill: '#9ca3af', fontSize: 10}} axisLine={false} tickLine={false} width={90} />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px'}} />
                <Bar dataKey="val" fill="#00a3ff" radius={[0, 4, 4, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Malicious IPs Table */}
        <div className="glass-panel p-5 border-ntro-blue/20 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-white">Top Malicious IPs</h3>
            <a href="#" className="text-xs text-ntro-blue hover:underline">View All →</a>
          </div>
          <table className="w-full text-xs text-left text-gray-400">
            <thead className="text-gray-500 font-mono border-b border-white/10">
              <tr><th className="pb-1.5 font-normal">IP Address</th><th className="pb-1.5 font-normal">Reputation</th><th className="pb-1.5 font-normal text-right">Events</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { ip: '185.199.110.22', rep: 'Malicious', ev: 248, col: 'text-ntro-red' },
                { ip: '203.0.113.5', rep: 'Malicious', ev: 184, col: 'text-ntro-red' },
                { ip: '91.198.88.12', rep: 'Suspicious', ev: 142, col: 'text-ntro-amber' },
                { ip: '194.21.15.77', rep: 'Malicious', ev: 121, col: 'text-ntro-red' },
                { ip: '5.188.10.2', rep: 'Suspicious', ev: 98, col: 'text-ntro-amber' },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-2 font-mono text-gray-300">{row.ip}</td>
                  <td className={`py-2 ${row.col}`}>{row.rep}</td>
                  <td className="py-2 text-right font-mono">{row.ev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
