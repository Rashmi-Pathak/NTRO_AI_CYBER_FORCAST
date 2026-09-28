// NTRO AI Cyber Forecast - Frontend API Service
// Connects to FastAPI backend at http://localhost:8000

const BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000/api';

// ─── Generic fetch helper ─────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Existing Forecast interface (kept for ThreatInvestigation compatibility) ─
export interface Forecast {
  id: string;
  detected: string;
  attackType: string;
  sector: string;
  currentStage: string;
  predictedStage: string;
  targetAsset: string;
  probability: number;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  timeWindow: string;
  status: 'Active' | 'Monitoring' | 'Investigating' | 'Resolved';
  eventId: string;
  sourceAsset: {
    id: string; ip: string; type: string; department: string;
    user: string; location: string; zone: string;
    criticality: string; os: string; firstSeen: string;
  };
  destinationAsset: {
    id: string; ip: string; type: string; department: string;
    location: string; zone: string; criticality: string;
    service: string; classification: string; owner: string;
  };
  evidence: Array<{ label: string; text: string }>;
  behaviorDeviation: {
    normal: Array<{ label: string; text: string }>;
    current: Array<{ label: string; text: string; alert?: boolean }>;
  };
  timeline: Array<{ time: string; event: string; status?: string }>;
  mitre: Array<{ id: string; desc: string }>;
  blastRadius: { assets: number; departments: number; zones: number; criticalServices: number };
  networkEvidence: Record<string, string>;
  recommendations: Array<{ text: string; level: string }>;
}

// ─── Backend response types ───────────────────────────────────────────────────
export interface AttackPrediction {
  prediction_id: string;
  timestamp: string;
  source_asset_id: string;
  target_asset_id: string;
  sector: string;
  current_stage: string;
  predicted_stage: string;
  confidence: number;
  risk_score: number;
  estimated_time: string;
  status: string;
}

export interface AttackDetail {
  prediction: AttackPrediction;
  confidence: number;
  risk_score: number;
  risk_level: string;
  risk_reasons: string[];
  risk_components: Record<string, number>;
  source_asset: Record<string, any> | null;
  target_asset: Record<string, any> | null;
  sector: Record<string, any> | null;
  location: { latitude: number | null; longitude: number | null; city: string | null };
  timeline: Array<Record<string, any>>;
  attack_stages: Array<Record<string, any>>;
  indicators: Array<Record<string, any>>;
  vulnerabilities: Array<Record<string, any>>;
  related_events: Array<Record<string, any>>;
  forecast: Record<string, any>;
  why_flagged: string[];
  recommended_actions: Array<{ text: string; level: string }>;
}

// ─── Adapter: map backend AttackDetail → frontend Forecast ───────────────────
function adaptAttackDetailToForecast(detail: AttackDetail): Forecast {
  const pred = detail.prediction;
  const src = detail.source_asset;
  const tgt = detail.target_asset;

  const riskMap: Record<string, Forecast['risk']> = {
    CRITICAL: 'Critical', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low',
  };
  const statusMap: Record<string, Forecast['status']> = {
    ACTIVE: 'Active', MONITORING: 'Monitoring',
    INVESTIGATING: 'Investigating', RESOLVED: 'Resolved',
  };

  return {
    id: pred.prediction_id,
    detected: new Date(pred.timestamp).toLocaleString(),
    attackType: pred.current_stage?.replace(/_/g, ' ') ?? 'Unknown',
    sector: pred.sector ?? 'Unknown',
    currentStage: pred.current_stage ?? 'NORMAL',
    predictedStage: pred.predicted_stage ?? 'NORMAL',
    targetAsset: tgt?.hostname ?? pred.target_asset_id ?? 'Unknown',
    probability: Math.round((pred.confidence ?? 0) * 100),
    risk: riskMap[detail.risk_level] ?? 'Medium',
    timeWindow: pred.estimated_time ?? '15–30 min',
    status: statusMap[pred.status?.toUpperCase()] ?? 'Active',
    eventId: pred.prediction_id,
    sourceAsset: {
      id: src?.asset_id ?? pred.source_asset_id ?? 'Unknown',
      ip: src?.ip_address ?? 'Unknown',
      type: src?.asset_type ?? 'Unknown',
      department: src?.department ?? 'Unknown',
      user: 'N/A',
      location: src?.location ?? 'Unknown',
      zone: 'Internal',
      criticality: src?.criticality ?? 'MEDIUM',
      os: src?.os ?? 'Unknown',
      firstSeen: src ? new Date(pred.timestamp).toLocaleDateString() : 'Unknown',
    },
    destinationAsset: {
      id: tgt?.asset_id ?? pred.target_asset_id ?? 'Unknown',
      ip: tgt?.ip_address ?? 'Unknown',
      type: tgt?.asset_type ?? 'Unknown',
      department: tgt?.department ?? 'Unknown',
      location: tgt?.location ?? 'Unknown',
      zone: 'Internal',
      criticality: tgt?.criticality ?? 'MEDIUM',
      service: 'N/A',
      classification: 'Restricted',
      owner: tgt?.sector ?? 'Unknown',
    },
    evidence: detail.why_flagged.map(r => ({ label: 'AI', text: r })),
    behaviorDeviation: {
      normal: [{ label: 'Baseline', text: 'Normal network behaviour' }],
      current: detail.risk_reasons.map(r => ({ label: 'Alert', text: r, alert: true })),
    },
    timeline: detail.timeline.map(t => ({
      time: new Date(t.timestamp).toLocaleTimeString(),
      event: t.event ?? t.stage,
      status: t.classification?.toLowerCase() === 'observed' ? 'alert'
            : t.classification?.toLowerCase() === 'predicted' ? 'current'
            : 'info',
    })),
    mitre: [],
    blastRadius: { assets: 0, departments: 0, zones: 0, criticalServices: 0 },
    networkEvidence: {
      'Source Asset': pred.source_asset_id ?? 'N/A',
      'Target Asset': pred.target_asset_id ?? 'N/A',
      'Current Stage': pred.current_stage ?? 'N/A',
      'Predicted Stage': pred.predicted_stage ?? 'N/A',
      'Confidence': `${Math.round((pred.confidence ?? 0) * 100)}%`,
      'Risk Score': String(detail.risk_score),
      'Estimated Window': pred.estimated_time ?? 'N/A',
    },
    recommendations: detail.recommended_actions,
  };
}

// ─── Adapter: map backend list item → frontend Forecast (lightweight) ─────────
function adaptPredictionToForecast(pred: AttackPrediction): Forecast {
  const riskLevel =
    pred.risk_score >= 80 ? 'Critical'
    : pred.risk_score >= 60 ? 'High'
    : pred.risk_score >= 40 ? 'Medium'
    : 'Low';

  const statusMap: Record<string, Forecast['status']> = {
    ACTIVE: 'Active', MONITORING: 'Monitoring',
    INVESTIGATING: 'Investigating', RESOLVED: 'Resolved',
  };

  return {
    id: pred.prediction_id,
    detected: new Date(pred.timestamp).toLocaleString(),
    attackType: pred.current_stage?.replace(/_/g, ' ') ?? 'Unknown',
    sector: pred.sector ?? 'Unknown',
    currentStage: pred.current_stage ?? 'NORMAL',
    predictedStage: pred.predicted_stage ?? 'NORMAL',
    targetAsset: pred.target_asset_id ?? 'Unknown',
    probability: Math.round((pred.confidence ?? 0) * 100),
    risk: riskLevel as Forecast['risk'],
    timeWindow: pred.estimated_time ?? '15–30 min',
    status: statusMap[pred.status?.toUpperCase()] ?? 'Active',
    eventId: pred.prediction_id,
    sourceAsset: {
      id: pred.source_asset_id, ip: 'N/A', type: 'Unknown',
      department: 'Unknown', user: 'N/A', location: pred.sector,
      zone: 'Internal', criticality: 'MEDIUM', os: 'Unknown', firstSeen: 'N/A',
    },
    destinationAsset: {
      id: pred.target_asset_id, ip: 'N/A', type: 'Unknown',
      department: 'Unknown', location: pred.sector, zone: 'Internal',
      criticality: 'MEDIUM', service: 'N/A', classification: 'Restricted', owner: pred.sector,
    },
    evidence: [],
    behaviorDeviation: { normal: [], current: [] },
    timeline: [],
    mitre: [],
    blastRadius: { assets: 0, departments: 0, zones: 0, criticalServices: 0 },
    networkEvidence: {},
    recommendations: [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const api = {
  // Attack Forecast (Page 3)
  getForecastSummary: () => apiFetch<any>('/attack-forecast/summary'),
  getForecastTimeline: () => apiFetch<any>('/attack-forecast/timeline'),
  getForecastSectors: () => apiFetch<any>('/attack-forecast/sectors'),
  getForecastAttackTypes: () => apiFetch<any>('/attack-forecast/attack-types'),
  getForecastRiskEvents: () => apiFetch<any>('/attack-forecast/events'),

  // System Configuration (Page 12)
  getSystemStatus: () => apiFetch<any>('/system/status'),
  getSystemLogs: () => apiFetch<any[]>('/system/logs'),

  // Data Lab (Page 11)
  getDataSummary: () => apiFetch<any>('/data/summary'),
  getDatasets: () => apiFetch<any[]>('/data/datasets'),
  getSimulations: () => apiFetch<any>('/data/simulations'),

  // Health
  health: () => apiFetch<Record<string, any>>('/health'),

  // Dashboard
  getDashboardSummary: () => apiFetch<Record<string, any>>('/dashboard/summary'),

  // Attack predictions (Attack Analysis list)
  getForecasts: async (): Promise<Forecast[]> => {
    try {
      const res = await apiFetch<{ data: AttackPrediction[] }>('/attacks?limit=100');
      return res.data.map(adaptPredictionToForecast);
    } catch (e) {
      console.warn('Backend unavailable, returning empty list', e);
      return [];
    }
  },

  // Full attack detail (ThreatInvestigation page)
  getForecastById: async (id: string): Promise<Forecast | null> => {
    try {
      const detail = await apiFetch<AttackDetail>(`/attacks/${id}`);
      return adaptAttackDetailToForecast(detail);
    } catch (e) {
      console.warn(`Could not load attack detail for ${id}`, e);
      return null;
    }
  },

  // Raw attack detail (for pages that need full backend response)
  getAttackDetail: (id: string) =>
    apiFetch<AttackDetail>(`/attacks/${id}`),

  getAttackPaths: () => apiFetch<Array<{attack_id: string}>>('/attack-path'),
  getAttackPathDetail: (id: string) => apiFetch<Record<string, any>>(`/attack-path/${id}`),

  getAttackTimeline: (id: string) =>
    apiFetch<Record<string, any>>(`/attacks/${id}/timeline`),

  getAttackGraph: (id: string) =>
    apiFetch<Record<string, any>>(`/attacks/${id}/graph`),

  // Threats / Live Monitor
  getLiveThreats: () => apiFetch<Record<string, any>>('/live-monitor/events'),
  
  // Replay Controls
  startReplay: () => apiFetch<Record<string, any>>('/live-monitor/replay/start', { method: 'POST' }),
  pauseReplay: () => apiFetch<Record<string, any>>('/live-monitor/replay/pause', { method: 'POST' }),
  resumeReplay: () => apiFetch<Record<string, any>>('/live-monitor/replay/resume', { method: 'POST' }),
  stopReplay: () => apiFetch<Record<string, any>>('/live-monitor/replay/stop', { method: 'POST' }),
  getReplayStatus: () => apiFetch<Record<string, any>>('/live-monitor/replay/status'),
  
  // Live Monitor Data
  getLiveMonitorSummary: () => apiFetch<Record<string, any>>('/live-monitor/summary'),
  getTopLiveThreats: () => apiFetch<Record<string, any>>('/live-monitor/top-threats'),
  getThreatDistribution: () => apiFetch<Record<string, any>>('/live-monitor/threat-distribution'),
  getProtocolDistribution: () => apiFetch<Record<string, any>>('/live-monitor/protocol-distribution'),
  getLiveThreatMap: () => apiFetch<Record<string, any>>('/live-monitor/map'),

  getThreats: (page = 1, limit = 50, params?: Record<string, string>) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit), ...params }).toString();
    return apiFetch<Record<string, any>>(`/threats?${qs}`);
  },
  getThreatById: (id: string) => apiFetch<Record<string, any>>(`/threats/${id}`),

  // Events
  getEvents: (page = 1, limit = 50, params?: Record<string, string>) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit), ...params }).toString();
    return apiFetch<Record<string, any>>(`/events?${qs}`);
  },
  getEventById: (id: string) => apiFetch<Record<string, any>>(`/events/${id}`),

  // Assets
  getAssets: (page = 1, limit = 50, params?: Record<string, string>) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit), ...params }).toString();
    return apiFetch<Record<string, any>>(`/assets?${qs}`);
  },
  getAssetById: (id: string) => apiFetch<Record<string, any>>(`/assets/${id}`),

  // Sectors
  getSectors: () => apiFetch<Record<string, any>>('/sectors'),
  getSectorById: (id: string) => apiFetch<Record<string, any>>(`/sectors/${id}`),

  // Threat Intelligence
  getIntelligence: (page = 1, limit = 50, params?: Record<string, string>) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit), ...params }).toString();
    return apiFetch<Record<string, any>>(`/intelligence?${qs}`);
  },
  searchIoC: (indicator: string) =>
    apiFetch<Record<string, any>>(`/intelligence/ioc/${encodeURIComponent(indicator)}`),

  // Incidents
  getIncidents: (page = 1, limit = 50, params?: Record<string, string>) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit), ...params }).toString();
    return apiFetch<Record<string, any>>(`/incidents?${qs}`);
  },
  getIncidentById: (id: string) => apiFetch<Record<string, any>>(`/incidents/${id}`),
  updateIncident: (id: string, body: { status?: string; title?: string }) =>
    apiFetch<Record<string, any>>(`/incidents/${id}`, {
      method: 'PATCH', body: JSON.stringify(body),
    }),

  // Models
  getModels: () => apiFetch<Record<string, any>>('/models'),

  // Simulation
  getSimulationStatus: () => apiFetch<Record<string, any>>('/simulation/status'),
  startSimulation: (scenario?: string) =>
    apiFetch<Record<string, any>>('/simulation/start', {
      method: 'POST',
      body: JSON.stringify({ scenario: scenario ?? 'full_kill_chain' }),
    }),
  stopSimulation: () =>
    apiFetch<Record<string, any>>('/simulation/stop', { method: 'POST' }),
  getSimulationEvents: () => apiFetch<Record<string, any>>('/simulation/events'),
};





export const eventApi = { getEventDetail: (id: string) => apiFetch<any>(`/events/${id}`), getEventRelated: (id: string) => apiFetch<any[]>(`/events/${id}/related`), getAttackDetail: (id: string) => apiFetch<any>(`/attacks/${id}`), getAttackTimeline: (id: string) => apiFetch<any[]>(`/attacks/${id}/timeline`) };
