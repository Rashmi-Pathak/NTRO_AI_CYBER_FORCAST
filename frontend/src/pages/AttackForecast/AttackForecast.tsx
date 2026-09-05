import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Target, Activity, ShieldAlert, Crosshair, Map } from 'lucide-react';

const mockForecastData = Array.from({length: 12}).map((_, i) => ({
  name: `Sep ${15+i}`,
  predicted: Math.floor(Math.random() * 200) + 200,
  actual: Math.floor(Math.random() * 200) + 150,
}));

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
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <Target className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">03. ATTACK FORECAST</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Predict and visualize potential cyber attacks using ML.</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-xs text-gray-400 italic font-serif mb-2">"Anticipate threats. Strengthen tomorrow."</p>
          <select className="bg-navy border border-ntro-blue/30 text-white text-sm rounded-md px-3 py-1.5 outline-none focus:border-ntro-blue">
            <option>Next 30 Days</option>
            <option>Next 7 Days</option>
            <option>Next 24 Hours</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Predicted Attacks" value="328" trend="48%" trendUp={true} color="#ff3b30" icon={Activity} />
        <KpiCard title="High Risk" value="74" trend="64%" trendUp={true} color="#ff3b30" icon={ShieldAlert} />
        <KpiCard title="Medium Risk" value="162" trend="29%" trendUp={true} color="#ff9500" icon={ShieldAlert} />
        <KpiCard title="Low Risk" value="92" trend="12%" trendUp={false} color="#34c759" icon={ShieldAlert} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 h-[450px]">
        
        {/* Left Column (Map & Banner) - 4 cols */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col relative overflow-hidden">
            <h3 className="text-sm font-semibold text-white mb-2 z-10">Attack Risk Heatmap (Next 30 Days)</h3>
            <div className="absolute inset-0 mt-10 bg-[url('/images/media_1788614033805.png')] bg-contain bg-center bg-no-repeat mix-blend-screen opacity-80" />
            
            {/* Map Legends */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 glass-panel p-3 border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-ntro-red shadow-[0_0_8px_#ff3b30]"></div>
                <div className="text-xs">
                  <div className="text-gray-300">High Risk</div>
                  <div className="text-white font-bold text-sm">4</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-ntro-amber shadow-[0_0_8px_#ff9500]"></div>
                <div className="text-xs">
                  <div className="text-gray-300">Medium Risk</div>
                  <div className="text-white font-bold text-sm">7</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-ntro-green shadow-[0_0_8px_#34c759]"></div>
                <div className="text-xs">
                  <div className="text-gray-300">Low Risk</div>
                  <div className="text-white font-bold text-sm">11</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-28 glass-panel p-0 border-ntro-blue/30 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-[url('/images/media_1788614149583.png')] bg-cover bg-center mix-blend-screen opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent p-5 flex flex-col justify-center">
              <div className="text-white font-bold text-lg leading-tight mb-2 tracking-wider">PREDICTING TODAY.<br/>PROTECTING TOMORROW.</div>
              <button className="bg-ntro-blue hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded-md self-start font-medium transition-colors">
                Explore Forecast Models →
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column (Sectors & Vectors) - 4 cols */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Sector Risk Forecast</h3>
            <div className="flex-1 flex flex-col justify-between">
              {[
                { name: 'Power & Energy', risk: 'High', color: 'text-ntro-red', bg: 'bg-ntro-red/10 border-ntro-red/30' },
                { name: 'Government', risk: 'High', color: 'text-ntro-red', bg: 'bg-ntro-red/10 border-ntro-red/30' },
                { name: 'Banking & Finance', risk: 'Medium', color: 'text-ntro-amber', bg: 'bg-ntro-amber/10 border-ntro-amber/30' },
                { name: 'Telecom', risk: 'Medium', color: 'text-ntro-amber', bg: 'bg-ntro-amber/10 border-ntro-amber/30' },
                { name: 'Healthcare', risk: 'Low', color: 'text-ntro-green', bg: 'bg-ntro-green/10 border-ntro-green/30' },
                { name: 'Transport', risk: 'Low', color: 'text-ntro-green', bg: 'bg-ntro-green/10 border-ntro-green/30' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <Crosshair className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{s.name}</span>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded border ${s.color} ${s.bg}`}>
                    {s.risk}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <a href="#" className="text-xs text-ntro-blue hover:underline">View Full Forecast →</a>
            </div>
          </div>
          
          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Top Predicted Attack Vectors</h3>
            <div className="flex-1 flex flex-col justify-between">
              {[
                { name: 'Phishing Campaigns', val: 32 },
                { name: 'Ransomware', val: 18 },
                { name: 'DDoS Attacks', val: 14 },
                { name: 'Zero-Day Exploits', val: 12 },
                { name: 'Insider Threats', val: 8 },
                { name: 'Others', val: 16 },
              ].map((v, i) => (
                <div key={i} className="flex items-center text-xs py-1.5">
                  <div className="w-6 text-gray-500 font-mono">0{i+1}</div>
                  <div className="flex-1 text-gray-300">{v.name}</div>
                  <div className="w-12 text-right text-gray-400 font-mono">{v.val}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Trends & Timeline) - 4 cols */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5 border-ntro-blue/20 h-[220px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Prediction Trends</h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-ntro-blue rounded-full"></span> <span className="text-gray-400">Predicted</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-ntro-red rounded-full"></span> <span className="text-gray-400">Actual</span></div>
              </div>
            </div>
            <div className="flex-1 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockForecastData}>
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

          <div className="glass-panel p-5 border-ntro-blue/20 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4">Risk Timeline</h3>
            <div className="relative flex-1 pl-4 border-l border-white/10 ml-2 space-y-6 pt-2">
              {[
                { date: 'Sep 06, 2026', title: 'High chance of phishing campaign', dot: 'bg-ntro-red' },
                { date: 'Sep 12, 2026', title: 'Increased DDoS activity expected', dot: 'bg-ntro-red' },
                { date: 'Sep 18, 2026', title: 'Potential ransomware wave', dot: 'bg-ntro-red' },
                { date: 'Sep 21, 2026', title: 'Targeted attacks on government sector', dot: 'bg-ntro-red' },
                { date: 'Sep 28, 2026', title: 'Elevated risk across telecom networks', dot: 'bg-ntro-red' },
              ].map((ev, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${ev.dot} ring-4 ring-[#0f172a] shadow-[0_0_8px_#ff3b30]`}></div>
                  <div className="text-xs text-gray-500 font-mono mb-1">{ev.date}</div>
                  <div className="text-sm text-gray-300">{ev.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
