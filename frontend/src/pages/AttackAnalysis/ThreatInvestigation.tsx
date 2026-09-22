import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Plus, AlertTriangle, ShieldAlert, Cpu, Crosshair, Network, GitBranch, MapPin, Activity, CheckCircle2, FileText, ChevronRight, Lock, Database, Target } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api, Forecast } from '@/services/api';

export default function ThreatInvestigation() {
  const { forecastId } = useParams();
  const navigate = useNavigate();
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (forecastId) {
      api.getForecastById(forecastId).then(data => {
        setForecast(data);
        setLoading(false);
      });
    }
  }, [forecastId]);

  if (loading) return <div className="text-white p-10">Loading forecast data...</div>;
  if (!forecast) return <div className="text-white p-10 flex flex-col gap-4">
    <h2 className="text-2xl font-bold">Forecast Not Found</h2>
    <button onClick={() => navigate('/attack-analysis')} className="text-ntro-blue underline w-max">Return to Attack Analysis</button>
  </div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header Row */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <button onClick={() => navigate('/attack-analysis')} className="hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Attack Analysis
          </button>
          <span>&gt;</span>
          <span className="text-white">{forecast.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 text-gray-300 flex items-center gap-2 transition-colors"><Share2 className="w-4 h-4"/> Share Report</button>
          <button className="px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 text-gray-300 flex items-center gap-2 transition-colors"><Download className="w-4 h-4"/> Export</button>
          <button className="px-3 py-1.5 rounded bg-ntro-blue hover:bg-blue-600 text-white flex items-center gap-2 transition-colors shadow-[0_0_10px_rgba(0,163,255,0.4)]">
            Create Incident <Plus className="w-4 h-4"/>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
         <button onClick={() => navigate('/attack-analysis')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3"/> Back to Attack Analysis</button>
      </div>

      {/* Main Threat Header */}
      <div className="flex justify-between items-start mb-2">
         <div className="flex items-start gap-4">
            <div className={`mt-1 px-3 py-1 rounded border flex items-center gap-2 font-bold tracking-widest text-xs ${forecast.risk === 'Critical' ? 'bg-ntro-red/10 border-ntro-red/50 text-ntro-red shadow-[0_0_15px_rgba(255,59,48,0.2)]' : 'bg-ntro-amber/10 border-ntro-amber/50 text-ntro-amber'}`}>
               <ShieldAlert className="w-4 h-4" /> {forecast.risk.toUpperCase()} RISK
            </div>
            <div>
               <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                 {forecast.id}
               </h1>
               <h2 className="text-xl text-gray-200">
                 {forecast.attackType} &rarr; <span className="text-ntro-blue">{forecast.predictedStage} (Predicted)</span>
               </h2>
               <p className="text-sm text-gray-400 mt-1">AI-detected suspicious authentication activity with high probability of lateral movement.</p>
            </div>
         </div>
         <div className="flex gap-6 items-center">
            <div className="flex flex-col items-center">
               <div className="w-14 h-14 relative flex items-center justify-center mb-1">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={[{v: forecast.probability}, {v: 100 - forecast.probability}]} innerRadius={22} outerRadius={28} dataKey="v" stroke="none">
                       <Cell fill="#ff3b30" />
                       <Cell fill="#1e293b" />
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <span className="absolute text-xs font-bold text-white">{forecast.probability}%</span>
               </div>
               <span className="text-[10px] text-gray-400">Prediction Probability</span>
            </div>
            
            <div className="flex flex-col border-l border-white/10 pl-6 h-full justify-center">
               <div className="flex items-center gap-2 text-white font-mono text-lg"><Activity className="w-5 h-5 text-gray-400"/> {forecast.timeWindow}</div>
               <span className="text-[10px] text-gray-400">Estimated Time Window</span>
            </div>

            <div className="flex flex-col border-l border-white/10 pl-6 h-full justify-center">
               <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${forecast.status === 'Active' ? 'bg-ntro-green/10 border-ntro-green text-ntro-green' : 'bg-ntro-blue/10 border-ntro-blue text-ntro-blue'}`}>
                 <div className={`w-2 h-2 rounded-full ${forecast.status === 'Active' ? 'bg-ntro-green animate-pulse' : 'bg-ntro-blue'}`}></div>
                 {forecast.status}
               </div>
               <span className="text-[10px] text-gray-400 text-center mt-1">Status</span>
            </div>
         </div>
      </div>

      {/* Info Strip */}
      <div className="grid grid-cols-6 gap-3 mb-2">
         {[
           { l: 'Detected', v: forecast.detected, ic: Activity },
           { l: 'Attack Type', v: forecast.attackType, ic: AlertTriangle, c: 'text-ntro-red' },
           { l: 'Sector', v: forecast.sector, ic: Crosshair, c: 'text-ntro-blue' },
           { l: 'Current Stage', v: forecast.currentStage, ic: Lock, c: 'text-purple-500' },
           { l: 'Predicted Next Stage', v: forecast.predictedStage, ic: ShieldAlert, c: 'text-ntro-amber' },
           { l: 'Target Asset', v: forecast.targetAsset, ic: Cpu, c: 'text-gray-300' }
         ].map((inf, i) => (
           <div key={i} className="bg-navy/80 border border-white/5 p-3 rounded-lg flex items-center gap-3">
             <div className={`p-2 rounded bg-white/5 ${inf.c || 'text-gray-400'}`}><inf.ic className="w-4 h-4"/></div>
             <div>
               <div className="text-[9px] text-gray-500 uppercase tracking-wider">{inf.l}</div>
               <div className="text-xs font-semibold text-gray-200 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-28">{inf.v}</div>
             </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Why this was detected & Behavior */}
        <div className="col-span-8 flex gap-4 h-[220px]">
           <div className="glass-panel p-4 flex-1 flex flex-col overflow-y-auto scrollbar-hide border-ntro-blue/20 shadow-[inset_0_0_20px_rgba(0,163,255,0.05)]">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-semibold text-white">Why This Was Detected</h3>
               <button className="text-[10px] px-2 py-0.5 bg-ntro-blue/20 text-ntro-blue border border-ntro-blue/30 rounded">Model Explanation</button>
             </div>
             <ul className="space-y-2 text-xs text-gray-300">
               {forecast.evidence.map((ev, i) => (
                 <li key={i} className="flex items-start gap-2">
                   <div className="w-4 h-4 rounded-full bg-ntro-blue/20 text-ntro-blue flex items-center justify-center shrink-0 mt-0.5">
                     <AlertTriangle className="w-2.5 h-2.5" />
                   </div>
                   {ev.text}
                 </li>
               ))}
             </ul>
           </div>
           
           <div className="glass-panel p-4 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
             <h3 className="text-sm font-semibold text-white mb-3">Behaviour Deviation</h3>
             <div className="flex gap-4 flex-1 text-xs">
                <div className="flex-1 bg-navy-light rounded border border-ntro-green/20 p-3">
                  <div className="text-ntro-green font-medium mb-3">Normal Behaviour</div>
                  <ul className="space-y-3 text-gray-400">
                    {forecast.behaviorDeviation.normal.map((b, i) => (
                      <li key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-ntro-green"></div>{b.text}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-navy-light rounded border border-ntro-red/20 p-3">
                  <div className="text-ntro-red font-medium mb-3">Current Behaviour</div>
                  <ul className="space-y-3 text-gray-300">
                    {forecast.behaviorDeviation.current.map((b, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-ntro-red"></div>{b.text.split('(')[0]}</div>
                        {b.text.includes('(') && <span className="text-ntro-red font-mono text-[10px]">{b.text.match(/\((.*?)\)/)?.[1]}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
             </div>
           </div>
        </div>

        {/* MITRE */}
        <div className="col-span-4 glass-panel p-4 h-[220px] flex flex-col">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-semibold text-white">MITRE ATT&CK Context</h3>
             <a href="#" className="text-[10px] text-ntro-blue hover:underline">View in framework &rarr;</a>
           </div>
           <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 text-xs">
             {forecast.mitre.map((m, i) => (
               <div key={i} className="flex items-center gap-3 p-2 bg-navy border border-white/5 rounded">
                 <div className="font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{m.id}</div>
                 <div className="text-gray-300">{m.desc}</div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Timeline */}
        <div className="col-span-3 glass-panel p-4 flex flex-col h-[380px]">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-semibold text-white">Event Timeline</h3>
             <a href="#" className="text-[10px] text-ntro-blue hover:underline">View Full Logs &rarr;</a>
           </div>
           <div className="flex-1 overflow-y-auto scrollbar-hide relative ml-2 pr-2">
             <div className="absolute top-2 bottom-6 left-[7px] w-[1px] bg-white/10 z-0 border-l border-dashed border-gray-600"></div>
             {forecast.timeline.map((t, i) => {
               const isAlert = t.status === 'alert';
               const isCritical = t.status === 'critical';
               const isCurrent = t.status === 'current';
               
               return (
                 <div key={i} className="flex gap-3 relative mb-4 z-10">
                   <div className="flex flex-col items-center">
                     <div className={`w-[15px] h-[15px] rounded-full flex items-center justify-center shrink-0 border-2 bg-navy ${isAlert || isCritical ? 'border-ntro-red' : isCurrent ? 'border-ntro-blue' : 'border-gray-500'}`}>
                       {(isAlert || isCritical) && <div className="w-1.5 h-1.5 rounded-full bg-ntro-red"></div>}
                       {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-ntro-blue"></div>}
                     </div>
                   </div>
                   <div className="-mt-1 flex-1">
                     <div className="flex justify-between items-start">
                       <div className="text-[9px] font-mono text-gray-500">{t.time}</div>
                       {isCritical && <span className="text-[9px] px-1 py-0.5 rounded bg-ntro-red/20 text-ntro-red border border-ntro-red/30">Suspicious</span>}
                     </div>
                     <div className={`text-xs mt-0.5 leading-tight ${isCurrent ? 'text-ntro-blue font-bold' : isAlert || isCritical ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
                       {t.event}
                     </div>
                     
                     {/* Add predicted next block if it's the current state */}
                     {isCurrent && (
                       <div className="mt-3 bg-ntro-blue/10 border border-ntro-blue/30 rounded p-2 text-[10px]">
                         <div className="text-ntro-blue font-semibold mb-1">PREDICTED NEXT</div>
                         <div className="text-white mb-0.5">{forecast.predictedStage} ({forecast.probability}%)</div>
                         <div className="text-gray-400">Estimated in {forecast.timeWindow}</div>
                       </div>
                     )}
                   </div>
                 </div>
               )
             })}
           </div>
        </div>

        <div className="col-span-9 flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4">
             {/* Source & Destination Details */}
             <div className="col-span-8 glass-panel p-4 flex flex-col h-[230px]">
               <h3 className="text-sm font-semibold text-white mb-3">Source & Destination Details</h3>
               <div className="flex gap-4 flex-1">
                  <div className="flex-1 bg-navy/50 border border-white/5 rounded-lg p-3 text-[10px]">
                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                       <div className="w-8 h-8 rounded bg-ntro-red/20 text-ntro-red flex items-center justify-center border border-ntro-red/50"><Cpu className="w-4 h-4"/></div>
                       <div>
                         <div className="text-ntro-red font-semibold">Source (Compromised)</div>
                         <div className="text-white text-sm font-mono">{forecast.sourceAsset.id}</div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-gray-500">IP Address</div><div className="text-gray-200 font-mono">{forecast.sourceAsset.ip}</div>
                      <div className="text-gray-500">Asset Type</div><div className="text-gray-200">{forecast.sourceAsset.type}</div>
                      <div className="text-gray-500">Department</div><div className="text-gray-200">{forecast.sourceAsset.department}</div>
                      <div className="text-gray-500">User</div><div className="text-ntro-blue font-mono">{forecast.sourceAsset.user}</div>
                      <div className="text-gray-500">Location</div><div className="text-gray-200">{forecast.sourceAsset.location}</div>
                      <div className="text-gray-500">Criticality</div><div className="text-ntro-amber font-semibold">{forecast.sourceAsset.criticality}</div>
                    </div>
                  </div>

                  <div className="flex-1 bg-navy/50 border border-white/5 rounded-lg p-3 text-[10px]">
                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                       <div className="w-8 h-8 rounded bg-ntro-blue/20 text-ntro-blue flex items-center justify-center border border-ntro-blue/50"><Database className="w-4 h-4"/></div>
                       <div>
                         <div className="text-ntro-blue font-semibold">Destination (Target)</div>
                         <div className="text-white text-sm font-mono">{forecast.destinationAsset.id}</div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-gray-500">IP Address</div><div className="text-gray-200 font-mono">{forecast.destinationAsset.ip}</div>
                      <div className="text-gray-500">Asset Type</div><div className="text-gray-200">{forecast.destinationAsset.type}</div>
                      <div className="text-gray-500">Department</div><div className="text-gray-200">{forecast.destinationAsset.department}</div>
                      <div className="text-gray-500">Location</div><div className="text-gray-200">{forecast.destinationAsset.location}</div>
                      <div className="text-gray-500">Criticality</div><div className="text-ntro-red font-semibold">{forecast.destinationAsset.criticality}</div>
                      <div className="text-gray-500">Service</div><div className="text-gray-200 font-mono">{forecast.destinationAsset.service}</div>
                    </div>
                  </div>
               </div>
             </div>

             {/* Geographic Location */}
             <div className="col-span-4 glass-panel p-0 relative overflow-hidden h-[230px] border-ntro-blue/30">
               <div className="absolute top-3 left-3 z-10"><h3 className="text-sm font-semibold text-white">Geographic Location</h3></div>
               <div className="absolute inset-0 bg-[url('/images/media_1788613908926.png')] bg-cover bg-center mix-blend-screen opacity-60 mt-10" />
               
               {/* Map overlay mock */}
               <svg className="absolute inset-0 w-full h-full z-10 mt-10 pointer-events-none">
                 <path d="M 50 100 Q 150 50 250 120" stroke="rgba(255,59,48,0.8)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
               </svg>

               <div className="absolute top-[40%] left-[10%] z-20 flex flex-col items-center">
                  <div className="w-3 h-3 bg-ntro-red rounded-full shadow-[0_0_10px_#ff3b30] flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <div className="text-[8px] bg-navy/80 px-1 py-0.5 rounded mt-1 border border-white/10 text-center">
                    <span className="font-bold text-white">{forecast.sourceAsset.id}</span><br/>New Delhi<br/>(Internal)
                  </div>
               </div>

               <div className="absolute top-[50%] left-[80%] z-20 flex flex-col items-center">
                  <div className="w-3 h-3 bg-ntro-blue rounded-full shadow-[0_0_10px_#00a3ff] flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <div className="text-[8px] bg-navy/80 px-1 py-0.5 rounded mt-1 border border-white/10 text-center">
                    <span className="font-bold text-white">{forecast.destinationAsset.id}</span><br/>New Delhi<br/>(Govt. Data Centre)
                  </div>
               </div>
               
               <div className="absolute bottom-2 left-2 flex gap-3 text-[8px] text-gray-400 bg-navy/80 px-2 py-1 rounded">
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-ntro-red rounded-full"></div>Source</div>
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-ntro-blue rounded-full"></div>Destination</div>
                 <div className="flex items-center gap-1"><div className="w-4 border-t border-dashed border-ntro-red"></div>Attack Path</div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
             {/* Attack Path */}
             <div className="col-span-8 glass-panel p-4 flex flex-col h-[134px]">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-semibold text-white">Attack Path (Simplified)</h3>
                 <a href="#" className="text-[10px] text-ntro-blue bg-ntro-blue/10 px-2 py-0.5 rounded border border-ntro-blue/20">View Full Path &rarr;</a>
               </div>
               <div className="flex-1 relative flex items-center justify-center gap-8">
                  {/* Source */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-lg bg-ntro-red/20 border-2 border-ntro-red flex items-center justify-center shadow-[0_0_15px_#ff3b30]">
                      <Cpu className="w-5 h-5 text-ntro-red" />
                    </div>
                    <div className="text-[9px] font-bold text-white mt-1">{forecast.sourceAsset.id}</div>
                    <div className="text-[8px] text-gray-400">(Compromised)</div>
                  </div>

                  {/* Arrow 1 */}
                  <div className="h-[2px] w-12 bg-ntro-red relative z-0">
                    <ChevronRight className="absolute -right-2 -top-[7px] w-4 h-4 text-ntro-red" />
                  </div>

                  {/* Target */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-10 h-10 rounded-lg bg-ntro-blue/20 border-2 border-ntro-blue flex items-center justify-center shadow-[0_0_15px_#00a3ff]">
                      <Database className="w-5 h-5 text-ntro-blue" />
                    </div>
                    <div className="text-[9px] font-bold text-white mt-1">{forecast.destinationAsset.id}</div>
                    <div className="text-[8px] text-gray-400">(Current Target)</div>
                  </div>

                  {/* Branches */}
                  <div className="relative w-8 h-16 ml-4">
                     <div className="absolute top-0 left-0 w-full h-[1px] border-t border-dashed border-ntro-amber rotate-[-30deg] origin-left"></div>
                     <div className="absolute top-1/2 left-0 w-full h-[1px] border-t border-dashed border-ntro-amber origin-left"></div>
                     <div className="absolute bottom-0 left-0 w-full h-[1px] border-t border-dashed border-ntro-amber rotate-[30deg] origin-left"></div>
                  </div>

                  {/* Next Targets */}
                  <div className="flex flex-col gap-2 z-10">
                     <div className="flex items-center gap-2 bg-navy border border-white/10 px-2 py-1 rounded">
                       <Database className="w-3 h-3 text-gray-400" /><span className="text-[9px] font-mono text-gray-300">DB-SRV-02</span>
                     </div>
                     <div className="flex items-center gap-2 bg-navy border border-white/10 px-2 py-1 rounded">
                       <Cpu className="w-3 h-3 text-gray-400" /><span className="text-[9px] font-mono text-gray-300">APP-SRV-07</span>
                     </div>
                     <div className="flex items-center gap-2 bg-navy border border-white/10 px-2 py-1 rounded">
                       <FileText className="w-3 h-3 text-gray-400" /><span className="text-[9px] font-mono text-gray-300">FILE-SRV-03</span>
                     </div>
                  </div>
               </div>
               <div className="flex justify-center gap-6 mt-1 text-[9px] text-gray-500">
                  <div className="flex items-center gap-1"><div className="w-4 h-[2px] bg-ntro-red"></div> Observed</div>
                  <div className="flex items-center gap-1"><div className="w-4 border-t border-dashed border-ntro-amber"></div> Predicted</div>
               </div>
             </div>

             {/* Attack Stage Lifecycle */}
             <div className="col-span-4 glass-panel p-4 h-[134px] overflow-y-auto scrollbar-hide">
               <h3 className="text-sm font-semibold text-white mb-2 sticky top-0 bg-[#06142a]">Attack Stage</h3>
               <div className="space-y-2 text-[10px] pl-2 relative">
                 <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-white/10"></div>
                 {[
                   'Reconnaissance', 'Initial Access', 'Execution', 'Persistence', 
                   'Privilege Escalation', 'Credential Access', 'Discovery', 
                   'Lateral Movement', 'Collection', 'Exfiltration', 'Impact'
                 ].map((stage, i) => {
                   const isCurrent = stage === forecast.currentStage;
                   const isPredicted = stage === forecast.predictedStage;
                   
                   return (
                     <div key={i} className="flex items-center gap-3 relative z-10">
                       <div className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center shrink-0 bg-navy ${isCurrent ? 'border-ntro-red' : isPredicted ? 'border-ntro-blue shadow-[0_0_8px_#00a3ff]' : 'border-gray-600'}`}>
                         {isCurrent && <div className="w-1 h-1 bg-ntro-red rounded-full"></div>}
                         {isPredicted && <div className="w-1 h-1 bg-ntro-blue rounded-full"></div>}
                       </div>
                       <div className={`flex-1 ${isCurrent ? 'text-white font-bold' : isPredicted ? 'text-ntro-blue font-medium' : 'text-gray-400'}`}>
                         {stage}
                       </div>
                       {isCurrent && <div className="text-[8px] px-1 py-0.5 rounded bg-ntro-red/20 text-ntro-red border border-ntro-red/30 mr-2">Current</div>}
                       {isPredicted && <div className="text-[8px] px-1 py-0.5 rounded bg-ntro-blue/20 text-ntro-blue border border-ntro-blue/30 mr-2">Predicted</div>}
                     </div>
                   )
                 })}
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Network Evidence */}
        <div className="col-span-3 glass-panel p-4 h-[200px]">
          <h3 className="text-sm font-semibold text-white mb-3">Network Evidence</h3>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-[10px]">
              <tbody className="divide-y divide-white/5">
                {Object.entries(forecast.networkEvidence).map(([key, value]) => (
                  <tr key={key}>
                    <td className="py-1.5 text-gray-500">{key}</td>
                    <td className="py-1.5 text-gray-200 font-mono text-right">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Forecast Panel */}
        <div className="col-span-6 glass-panel p-5 h-[200px] flex items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ntro-blue/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center shrink-0 z-10">
             <div className="w-32 h-32 relative flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={[{v: forecast.probability}, {v: 100 - forecast.probability}]} innerRadius={50} outerRadius={60} dataKey="v" stroke="none">
                     <Cell fill={forecast.probability > 80 ? '#ff3b30' : '#ff9500'} />
                     <Cell fill="#1e293b" />
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute flex flex-col items-center">
                 <div className="text-3xl font-bold text-white leading-none">{forecast.probability}%</div>
                 <div className="text-[9px] text-gray-400 mt-1 text-center leading-tight">Next Stage<br/>Probability</div>
               </div>
             </div>
          </div>

          <div className="flex-1 z-10">
             <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">AI Forecast & Risk Assessment</h3>
             
             <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                <div>
                  <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Predicted Next Stage</div>
                  <div className="text-lg font-semibold text-white">{forecast.predictedStage}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Estimated Time</div>
                  <div className="text-base text-gray-200 font-mono">{forecast.timeWindow}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Likely Target</div>
                  <div className="text-base text-gray-200 font-mono">{forecast.targetAsset}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Potential Blast Radius</div>
                  <div className="text-sm text-gray-200">{forecast.blastRadius.assets} assets<br/>{forecast.blastRadius.departments} departments</div>
                </div>
             </div>
          </div>
        </div>

        {/* Blast Radius Box */}
        <div className="col-span-3 glass-panel p-4 h-[200px] flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-3">Potential Blast Radius</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
             <div>
               <div className="text-2xl font-bold text-ntro-red">{forecast.blastRadius.assets}</div>
               <div className="text-[10px] text-gray-400">Affected Assets</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-ntro-amber">{forecast.blastRadius.departments}</div>
               <div className="text-[10px] text-gray-400">Departments</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-ntro-blue">{forecast.blastRadius.zones}</div>
               <div className="text-[10px] text-gray-400">Network Zones</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-ntro-red">{forecast.blastRadius.criticalServices}</div>
               <div className="text-[10px] text-gray-400">Critical Service</div>
             </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/10 text-[9px] text-gray-400">
             <span className="text-ntro-red font-semibold mb-1 block">Potential Impact</span>
             Disruption of authentication services. Access to sensitive government data.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Recommended Actions */}
        <div className="col-span-5 glass-panel p-4">
           <h3 className="text-sm font-semibold text-white mb-3">Recommended Actions</h3>
           <div className="space-y-2">
             {forecast.recommendations.map((rec, i) => (
               <div key={i} className="flex items-center justify-between bg-navy border border-white/5 p-2 rounded">
                 <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${rec.level === 'Critical' ? 'bg-ntro-red' : rec.level === 'High' ? 'bg-ntro-amber' : 'bg-ntro-blue'}`}></div>
                   <span className="text-xs text-gray-300">{rec.text}</span>
                 </div>
                 <span className={`text-[9px] px-1.5 py-0.5 rounded border ${rec.level === 'Critical' ? 'text-ntro-red border-ntro-red bg-ntro-red/10' : rec.level === 'High' ? 'text-ntro-amber border-ntro-amber bg-ntro-amber/10' : 'text-ntro-blue border-ntro-blue bg-ntro-blue/10'}`}>{rec.level}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Related Threat Intel */}
        <div className="col-span-4 glass-panel p-4 flex flex-col">
           <div className="flex justify-between items-center mb-3">
             <h3 className="text-sm font-semibold text-white">Related Threat Intelligence</h3>
             <a href="#" className="text-[10px] text-ntro-blue hover:underline">View Details &rarr;</a>
           </div>
           <div className="flex-1 space-y-3">
             <div className="flex items-start gap-3 bg-navy/50 p-2 rounded border border-white/5">
               <div className="p-1.5 rounded bg-purple-500/10 text-purple-500 shrink-0"><Activity className="w-3.5 h-3.5"/></div>
               <div>
                 <div className="text-xs text-white mb-0.5">Similar Campaigns</div>
                 <div className="text-[10px] text-gray-400">APT-C36 targeting government infra.<br/>3 similar incidents in last 30 days.</div>
               </div>
             </div>
             <div className="flex items-start gap-3 bg-navy/50 p-2 rounded border border-white/5">
               <div className="p-1.5 rounded bg-ntro-blue/10 text-ntro-blue shrink-0"><Target className="w-3.5 h-3.5"/></div>
               <div>
                 <div className="text-xs text-white mb-0.5">Known Indicators</div>
                 <div className="text-[10px] text-gray-400">Related IPs, domains and file hashes.<br/>12 matching indicators.</div>
               </div>
             </div>
           </div>
        </div>

        {/* Analyst Actions */}
        <div className="col-span-3 glass-panel p-4 flex flex-col">
           <h3 className="text-sm font-semibold text-white mb-3">Analyst Actions</h3>
           <div className="grid grid-cols-2 gap-2 mb-3">
             <button className="flex items-center justify-center gap-2 bg-ntro-red/10 hover:bg-ntro-red/20 text-ntro-red border border-ntro-red/30 p-2 rounded text-[10px] font-medium transition-colors"><Lock className="w-3.5 h-3.5"/> Contain Source</button>
             <button onClick={() => navigate('/incidents')} className="flex items-center justify-center gap-2 bg-ntro-blue/10 hover:bg-ntro-blue/20 text-ntro-blue border border-ntro-blue/30 p-2 rounded text-[10px] font-medium transition-colors"><Plus className="w-3.5 h-3.5"/> Create Incident</button>
             <button className="flex items-center justify-center gap-2 bg-navy hover:bg-white/5 text-gray-300 border border-white/10 p-2 rounded text-[10px] transition-colors"><CheckCircle2 className="w-3 h-3"/> Mark as False Positive</button>
             <button className="flex items-center justify-center gap-2 bg-navy hover:bg-white/5 text-gray-300 border border-white/10 p-2 rounded text-[10px] transition-colors"><ShieldAlert className="w-3 h-3"/> Add to Watchlist</button>
             <button className="flex items-center justify-center gap-2 bg-navy hover:bg-white/5 text-gray-300 border border-white/10 p-2 rounded text-[10px] transition-colors"><Download className="w-3 h-3"/> Export Report</button>
             <button className="flex items-center justify-center gap-2 bg-navy hover:bg-white/5 text-gray-300 border border-white/10 p-2 rounded text-[10px] transition-colors"><Share2 className="w-3 h-3"/> Share with Team</button>
           </div>
           <div className="mt-auto relative">
             <input type="text" placeholder="Add Analyst Notes..." className="w-full bg-navy border border-white/10 rounded py-2 px-3 text-[10px] text-white outline-none focus:border-ntro-blue" />
           </div>
        </div>
      </div>
    </div>
  );
}
