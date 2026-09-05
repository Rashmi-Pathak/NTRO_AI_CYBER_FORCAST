import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Search, Bell, Grid, Activity, Target, ShieldAlert, GitBranch, Crosshair, Globe2, AlertOctagon, FileText, Cpu, Database, Settings } from 'lucide-react';

const navItems = [
  { path: '/command-center', icon: Grid, label: 'Command Center' },
  { path: '/live-monitor', icon: Activity, label: 'Live Threat Monitor' },
  { path: '/attack-forecast', icon: Target, label: 'Attack Forecast' },
  { path: '/attack-analysis', icon: ShieldAlert, label: 'Attack Analysis' },
  { path: '/attack-path', icon: GitBranch, label: 'Attack Path / Kill Chain' },
  { path: '/assets', icon: Crosshair, label: 'Target & Asset Intel' },
  { path: '/sectors', icon: Globe2, label: 'Sector Intelligence' },
  { path: '/threat-intelligence', icon: AlertOctagon, label: 'Threat Intelligence' },
  { path: '/incidents', icon: FileText, label: 'Incident Management' },
  { path: '/model-intelligence', icon: Cpu, label: 'Model Intelligence' },
  { path: '/data-lab', icon: Database, label: 'Data & Simulation Lab' },
  { path: '/configuration', icon: Settings, label: 'System Configuration' },
];

export default function DashboardLayout() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020813] text-white flex overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-ntro-blue/20 bg-navy-lighter/30 flex flex-col relative z-20 shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-ntro-blue/10 shrink-0">
          <img src="/images/media_1788614184995.png" alt="NTRO Logo" className="h-10 object-contain" />
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive 
                      ? 'bg-ntro-blue/20 text-white border-l-2 border-ntro-blue font-medium shadow-[inset_0_0_15px_rgba(0,163,255,0.15)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* India Map footer in Sidebar */}
        <div className="p-6 border-t border-ntro-blue/10 relative shrink-0 overflow-hidden mt-auto">
          <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center opacity-30 mix-blend-screen" />
          <div className="relative z-10 text-xs">
            <div className="font-bold text-white mb-1">A SAFER,</div>
            <div className="font-bold text-ntro-blue glow-text mb-2">MORE RESILIENT INDIA</div>
            <div className="text-gray-500 font-mono text-[10px] tracking-widest">PREDICT | PREVENT | PROTECT</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-ntro-blue/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Topbar */}
        <header className="h-20 border-b border-ntro-blue/10 bg-navy-lighter/30 flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search threats, IPs, domains, assets..." 
              className="w-full bg-navy border border-ntro-blue/30 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ntro-blue transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-400 font-mono">Ctrl + K</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ntro-red rounded-full shadow-[0_0_5px_#ff3b30]" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-navy border border-ntro-blue/30 flex items-center justify-center text-xs font-medium text-ntro-blue">
                JS
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-tight">Analyst</span>
                <span className="text-xs text-gray-400 leading-tight">NTRO SOC</span>
              </div>
            </div>

            <div className="flex flex-col items-end pl-6 border-l border-white/10 font-mono">
              <span className="text-xs text-gray-400">{time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-sm text-white font-medium">{time.toLocaleTimeString('en-GB')}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
