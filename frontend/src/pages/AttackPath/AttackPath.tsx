import { GitBranch, Activity, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AttackPath() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-ntro-blue/20 text-ntro-blue rounded-lg border border-ntro-blue/30">
              <GitBranch className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">05. ATTACK PATH / KILL CHAIN</h1>
          </div>
          <p className="text-sm text-gray-400 pl-12">Visualize the full attack path from entry to impact.</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-xs text-gray-400 italic font-serif">"See the bigger picture. Stop the next move."</p>
          <div className="flex gap-3">
             <select className="bg-navy border border-ntro-blue/30 text-white text-sm rounded-md px-3 py-1.5 outline-none">
               <option>APT-C36 Kill Chain</option>
             </select>
             <button className="bg-ntro-blue text-white px-4 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors">
               Simulate Path
             </button>
          </div>
        </div>
      </div>

      {/* Chevron Steps */}
      <div className="flex w-full h-14 overflow-hidden rounded-lg border border-white/10 bg-navy-lighter/50">
        {[
          {num: 1, label: 'Reconnaissance', sub: 'Target identified', active: false},
          {num: 2, label: 'Weaponization', sub: 'Malicious payload', active: false},
          {num: 3, label: 'Delivery', sub: 'Phishing / Exploit', active: false},
          {num: 4, label: 'Exploitation', sub: 'Initial Access', active: true},
          {num: 5, label: 'Installation', sub: 'Backdoor / Malware', active: false},
          {num: 6, label: 'C2 Communication', sub: 'Beaconing', active: false},
          {num: 7, label: 'Action on Objectives', sub: 'Data Exfil / Disruption', active: false},
        ].map((step, i) => (
          <div key={i} className={`flex-1 flex flex-col justify-center px-4 relative ${step.active ? 'bg-ntro-blue/20 border-b-2 border-ntro-blue' : 'border-r border-white/5 opacity-70'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step.active ? 'bg-ntro-blue text-white' : 'bg-navy border border-white/20 text-gray-400'}`}>
                {step.num}
              </div>
              <div className="text-xs font-semibold text-gray-200">{step.label}</div>
            </div>
            <div className="text-[10px] text-gray-500 pl-7">{step.sub}</div>
            {i !== 6 && <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 translate-x-1/2" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[400px]">
        {/* Main Graph Visualization */}
        <div className="col-span-8 glass-panel p-5 relative overflow-hidden flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-2 z-10 absolute top-5 left-5">Attack Path Visualization</h3>
          
          <div className="absolute top-5 right-5 z-20 glass-panel p-2 text-xs flex flex-col gap-1.5 border-white/10 backdrop-blur-md">
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ntro-red"></span> Malicious</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ntro-amber"></span> Compromised</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-ntro-blue"></span> Internal</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500"></span> External</div>
          </div>

          <div className="absolute bottom-5 left-5 z-20 flex flex-col bg-navy border border-white/10 rounded overflow-hidden text-gray-400">
             <button className="px-2 py-1 hover:bg-white/10 border-b border-white/10">+</button>
             <button className="px-2 py-1 hover:bg-white/10 border-b border-white/10">-</button>
             <button className="px-2 py-1 hover:bg-white/10">[]</button>
          </div>

          <div className="flex-1 relative mt-12">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 0}}>
              {/* Simplified curves for mockup */}
              <path d="M50,150 Q150,50 250,150 T450,150 T650,150" stroke="rgba(255,59,48,0.5)" strokeWidth="2" fill="none" />
              <path d="M250,150 Q350,250 450,150" stroke="rgba(255,149,0,0.5)" strokeWidth="2" fill="none" strokeDasharray="4" />
            </svg>
            
            {/* Sequence of Nodes */}
            <div className="absolute top-[130px] left-[30px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-red/20 border-2 border-ntro-red flex items-center justify-center shadow-[0_0_15px_#ff3b30]"><Activity className="w-6 h-6 text-ntro-red"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">External Attacker</div>
            </div>
            <div className="absolute top-[50px] left-[150px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-blue/20 border-2 border-ntro-blue flex items-center justify-center"><Activity className="w-6 h-6 text-ntro-blue"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">Phishing Email</div>
            </div>
            <div className="absolute top-[230px] left-[150px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-blue/20 border-2 border-ntro-blue flex items-center justify-center"><Activity className="w-6 h-6 text-ntro-blue"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">Malicious Attachment</div>
            </div>
            <div className="absolute top-[130px] left-[250px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-red/20 border-2 border-ntro-red flex items-center justify-center"><Activity className="w-6 h-6 text-ntro-red"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">User Workstation</div>
            </div>
            <div className="absolute top-[230px] left-[350px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-amber/20 border-2 border-ntro-amber flex items-center justify-center shadow-[0_0_15px_#ff9500]"><Activity className="w-6 h-6 text-ntro-amber"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">Lateral Movement</div>
            </div>
            <div className="absolute top-[130px] left-[450px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-amber/20 border-2 border-ntro-amber flex items-center justify-center"><Activity className="w-6 h-6 text-ntro-amber"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">Domain Controller</div>
            </div>
            <div className="absolute top-[50px] left-[550px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-blue/20 border-2 border-ntro-blue flex items-center justify-center"><Activity className="w-6 h-6 text-ntro-blue"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">Internal Server</div>
            </div>
            <div className="absolute top-[230px] left-[550px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-blue/20 border-2 border-ntro-blue flex items-center justify-center"><Activity className="w-6 h-6 text-ntro-blue"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">Database Server</div>
            </div>
            <div className="absolute top-[130px] left-[650px] flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-ntro-red/20 border-2 border-ntro-red flex items-center justify-center shadow-[0_0_15px_#ff3b30]"><Activity className="w-6 h-6 text-ntro-red"/></div>
              <div className="text-[10px] mt-1 text-gray-300 text-center">Data Exfiltration</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-4">Path Details</h3>
          
          <div className="flex gap-2 border-b border-white/10 pb-2 mb-4 text-xs">
            <button className="px-3 py-1 bg-ntro-blue/20 text-ntro-blue rounded border border-ntro-blue/30">Overview</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">Nodes (12)</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">Edges (11)</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">Risk Score</button>
          </div>
          
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            This attack path shows how an external attacker gained initial access through a phishing email, and gradually moved laterally to reach critical assets.
          </p>

          <h4 className="text-xs font-semibold text-white mb-4">Attack Path Risk Score</h4>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 relative shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={[{value: 87}, {value: 13}]} innerRadius={35} outerRadius={45} dataKey="value" stroke="none">
                     <Cell fill="#ff3b30" />
                     <Cell fill="#1a2c4d" />
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <div className="text-xl font-bold text-white leading-none">87</div>
                 <div className="text-[9px] text-ntro-red font-medium">High Risk</div>
               </div>
            </div>
            
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Lateral Movement</span>
                <span className="text-white font-mono">92</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Privilege Escalation</span>
                <span className="text-white font-mono">85</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data Access</span>
                <span className="text-white font-mono">74</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Defense Evasion</span>
                <span className="text-white font-mono">78</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-300">Overall Impact</span>
                <span className="text-ntro-red font-mono">93</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 glass-panel p-5">
           <h3 className="text-sm font-semibold text-white mb-4">Attack Simulation (What If?)</h3>
           <div className="flex items-end gap-4">
             <div className="flex-1">
               <label className="text-xs text-gray-400 block mb-1">Block at:</label>
               <select className="w-full bg-navy border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-ntro-blue">
                 <option>Initial Access</option>
                 <option>Lateral Movement</option>
               </select>
             </div>
             <div className="flex-1">
               <label className="text-xs text-gray-400 block mb-1">Simulation Result:</label>
               <div className="flex items-center gap-2 text-ntro-green text-sm font-medium py-1">
                 <CheckCircle2 className="w-4 h-4"/> Attack Contained
               </div>
             </div>
           </div>
           <button className="mt-4 w-full bg-ntro-blue/10 border border-ntro-blue/30 text-ntro-blue hover:bg-ntro-blue/20 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2">
             Run Simulation <Play className="w-3 h-3" />
           </button>
        </div>
        
        <div className="col-span-4 glass-panel p-5">
           <h3 className="text-sm font-semibold text-white mb-3">Recommended Actions</h3>
           <div className="space-y-2 text-xs">
             <div className="flex items-start gap-2">
               <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400 mt-0.5 shrink-0">1</div>
               <div className="text-gray-300">Block phishing emails with similar indicators</div>
             </div>
             <div className="flex items-start gap-2">
               <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400 mt-0.5 shrink-0">2</div>
               <div className="text-gray-300">Implement MFA for privileged accounts</div>
             </div>
             <div className="flex items-start gap-2">
               <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400 mt-0.5 shrink-0">3</div>
               <div className="text-gray-300">Monitor lateral movement using EDR</div>
             </div>
             <div className="flex items-start gap-2">
               <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400 mt-0.5 shrink-0">4</div>
               <div className="text-gray-300">Isolate compromised hosts immediately</div>
             </div>
           </div>
        </div>

        <div className="col-span-4 glass-panel p-5 bg-[url('/images/media_1788614159404.png')] bg-cover bg-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-navy/80 group-hover:bg-navy/70 transition-colors" />
          <div className="relative z-10 flex flex-col h-full justify-center">
            <h3 className="text-lg font-bold text-white mb-2 leading-tight uppercase tracking-wider">
              Break The Chain<br/>Before It Reaches<br/>What Matters.
            </h3>
            <div className="text-ntro-blue text-xs tracking-[0.2em] uppercase font-mono mt-2">
              Predict. Prevent. Protect.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
