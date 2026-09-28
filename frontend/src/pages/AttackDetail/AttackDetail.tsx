import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Target, ShieldAlert, GitMerge, PlusCircle, 
  Loader2, Activity, Map, ArrowRight, Monitor, Server, AlertTriangle, Crosshair 
} from 'lucide-react';
import { api, AttackDetail } from '../../services/api';

const ALL_STAGES = [
  'RECONNAISSANCE',
  'WEAPONIZATION',
  'DELIVERY',
  'EXPLOITATION',
  'INSTALLATION',
  'COMMAND_AND_CONTROL',
  'ACTIONS_ON_OBJECTIVES'
];

export default function AttackDetailView() {
  const { attackId } = useParams<{ attackId: string }>();
  const navigate = useNavigate();

  const [attack, setAttack] = useState<AttackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attackId) return;
    
    setLoading(true);
    api.getAttackDetail(attackId)
      .then(data => {
        setAttack(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load attack details');
        setLoading(false);
      });
  }, [attackId]);

  if (loading) {
    return (
      <div className="p-6 h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-ntro-blue">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading Attack Analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !attack) {
    return (
      <div className="p-6 h-[80vh] flex items-center justify-center">
        <div className="glass-panel p-8 text-center max-w-md border-ntro-red/30">
          <AlertTriangle className="w-12 h-12 text-ntro-red mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-gray-400 mb-6">{error || 'Attack not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-navy border border-ntro-blue/30 text-ntro-blue hover:bg-ntro-blue/10 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const prediction = attack.prediction;
  const sourceIp = attack.source_asset?.ip_address || prediction.source_asset_id || 'Unknown IP';
  const targetIp = attack.target_asset?.ip_address || prediction.target_asset_id || 'Unknown IP';
  const currentStageIndex = ALL_STAGES.findIndex(s => s === prediction.current_stage);
  
  // Try to parse forecast/next path
  let nextPaths: string[] = [];
  if (Array.isArray(attack.forecast)) {
    nextPaths = attack.forecast.map(f => typeof f === 'string' ? f : f.stage || JSON.stringify(f));
  } else if (attack.forecast?.next_stages) {
    nextPaths = Array.isArray(attack.forecast.next_stages) ? attack.forecast.next_stages : [String(attack.forecast.next_stages)];
  } else if (prediction.predicted_stage) {
    nextPaths = [prediction.predicted_stage];
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 border border-ntro-blue/30 text-ntro-blue hover:bg-ntro-blue/10 rounded-md transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
            <Target className="text-ntro-amber w-6 h-6" />
            Attack Analysis <span className="text-ntro-blue/50">/</span> {prediction.prediction_id || attackId}
          </h1>
        </div>
        <button className="flex items-center px-4 py-2 bg-ntro-red hover:bg-red-600 text-white rounded-md shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-colors text-sm font-medium">
          <PlusCircle className="w-4 h-4 mr-2" /> Create Incident
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="glass-panel border-ntro-amber/30 md:col-span-2 p-5 flex flex-col gap-6">
          
          <div>
            <h3 className="text-ntro-amber flex items-center gap-2 text-lg font-semibold mb-4">
              <ShieldAlert className="w-5 h-5" /> Threat Details
            </h3>
            <div className="flex gap-4 mb-4 flex-wrap">
              <span className="px-2.5 py-0.5 border border-ntro-amber/50 text-ntro-amber bg-ntro-amber/10 rounded-full text-xs font-medium uppercase">
                {prediction.sector || 'Unknown Sector'}
              </span>
              <span className="px-2.5 py-0.5 border border-ntro-red/50 text-ntro-red bg-ntro-red/10 rounded-full text-xs font-medium uppercase">
                {prediction.status || 'Active'}
              </span>
              <span className="px-2.5 py-0.5 border border-purple-500/50 text-purple-400 bg-purple-500/10 rounded-full text-xs font-medium uppercase">
                Risk Score: {attack.risk_score}
              </span>
              <span className="px-2.5 py-0.5 border border-blue-500/50 text-blue-400 bg-blue-500/10 rounded-full text-xs font-medium uppercase">
                Confidence: {(attack.confidence * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="text-gray-300 bg-navy/50 p-4 rounded-lg border border-white/10 space-y-2">
              <p><strong>Risk Level:</strong> <span className="text-ntro-amber">{attack.risk_level}</span></p>
              {attack.why_flagged && attack.why_flagged.length > 0 && (
                <div className="mt-2">
                  <strong className="text-gray-400">Why Flagged:</strong>
                  <ul className="list-disc list-inside mt-1 text-sm">
                    {attack.why_flagged.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-ntro-blue" /> Network Path Analysis
            </h3>
            
            <div className="flex items-center justify-between p-6 border border-white/10 bg-navy/30 rounded-lg relative overflow-hidden">
              <div className="text-center z-10 w-1/3">
                <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                   <Monitor className="text-red-500 w-6 h-6" />
                </div>
                <p className="text-sm text-gray-400 mb-1">Source Asset</p>
                <p className="font-mono text-white text-sm bg-black/30 px-2 py-1 rounded inline-block">
                  {sourceIp}
                </p>
                {attack.source_asset?.name && <p className="text-xs text-gray-500 mt-1">{attack.source_asset.name}</p>}
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 mx-4">
                <div className="w-full flex items-center">
                   <div className="h-px bg-red-500/50 w-1/2"></div>
                   <Crosshair className="w-5 h-5 text-ntro-amber mx-2 animate-pulse" />
                   <div className="h-px bg-ntro-amber/50 w-1/2"></div>
                </div>
                <div className="mt-3 bg-ntro-amber/20 px-3 py-1 rounded-full border border-ntro-amber/30 text-xs text-ntro-amber font-mono">
                   {prediction.current_stage || 'IN TRANSIT'}
                </div>
              </div>
              
              <div className="text-center z-10 w-1/3">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                   <Server className="text-blue-500 w-6 h-6" />
                </div>
                <p className="text-sm text-gray-400 mb-1">Target Asset</p>
                <p className="font-mono text-white text-sm bg-black/30 px-2 py-1 rounded inline-block">
                  {targetIp}
                </p>
                {attack.target_asset?.name && <p className="text-xs text-gray-500 mt-1">{attack.target_asset.name}</p>}
              </div>
            </div>
          </div>
          
          {(attack.indicators?.length > 0 || attack.vulnerabilities?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {attack.indicators?.length > 0 && (
                <div className="bg-navy/40 border border-white/10 p-4 rounded-lg overflow-hidden">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Indicators of Compromise</h4>
                  <ul className="space-y-2">
                    {attack.indicators.map((ioc: any, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-ntro-red mt-0.5">•</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[11px] break-all">{ioc.indicator || ioc.value || JSON.stringify(ioc)}</span>
                          <span className="text-[10px] text-gray-500 uppercase">{ioc.indicator_type || ioc.type || 'Unknown'} {ioc.threat_actor && `- ${ioc.threat_actor}`}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {attack.vulnerabilities?.length > 0 && (
                <div className="bg-navy/40 border border-white/10 p-4 rounded-lg overflow-hidden">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vulnerabilities Exploited</h4>
                  <ul className="space-y-2">
                    {attack.vulnerabilities.map((vuln: any, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-ntro-amber mt-0.5">•</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[11px] text-ntro-amber">{vuln.cve_id || vuln.name || JSON.stringify(vuln)}</span>
                          {vuln.severity && <span className="text-[10px] text-gray-500 uppercase">Severity: {vuln.severity}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel border-purple-500/20 p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-purple-400 flex items-center gap-2 text-lg font-semibold">
                <GitMerge className="w-5 h-5" /> Kill Chain Progression
              </h3>
            </div>
            <div className="space-y-2">
              {ALL_STAGES.map((stage, i) => {
                const isCurrent = stage === prediction.current_stage;
                const isPast = currentStageIndex >= 0 && i < currentStageIndex;
                return (
                  <div 
                    key={i} 
                    className={`p-2.5 text-sm rounded border flex justify-between items-center ${
                      isCurrent ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-medium' : 
                      isPast ? 'bg-navy/50 border-white/10 text-gray-400' :
                      'bg-navy/20 border-white/5 text-gray-600'
                    }`}
                  >
                    <span>{i + 1}. {stage.replace(/_/g, ' ')}</span>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel border-ntro-blue/30 p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-ntro-blue flex items-center gap-2 text-lg font-semibold">
                <Map className="w-5 h-5" /> Next Attack Path
              </h3>
            </div>
            {nextPaths.length > 0 ? (
              <div className="space-y-3">
                {nextPaths.map((path, i) => (
                  <div key={i} className="bg-navy/40 border border-ntro-blue/20 p-3 rounded-lg flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-ntro-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-200 font-medium">{path.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-500 mt-1">Predicted next action</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No forecast available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
