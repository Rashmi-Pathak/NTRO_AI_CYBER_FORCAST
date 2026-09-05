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
    id: string;
    ip: string;
    type: string;
    department: string;
    user: string;
    location: string;
    zone: string;
    criticality: string;
    os: string;
    firstSeen: string;
  };
  destinationAsset: {
    id: string;
    ip: string;
    type: string;
    department: string;
    location: string;
    zone: string;
    criticality: string;
    service: string;
    classification: string;
    owner: string;
  };
  evidence: Array<{ label: string; text: string }>;
  behaviorDeviation: {
    normal: Array<{ label: string; text: string }>;
    current: Array<{ label: string; text: string; alert?: boolean }>;
  };
  timeline: Array<{ time: string; event: string; status?: string }>;
  mitre: Array<{ id: string; desc: string }>;
  blastRadius: {
    assets: number;
    departments: number;
    zones: number;
    criticalServices: number;
  };
  networkEvidence: Record<string, string>;
  recommendations: Array<{ text: string; level: string }>;
}

export const mockForecasts: Forecast[] = [
  {
    id: 'FCST-0021',
    detected: 'Sep 05, 14:28:12',
    attackType: 'Credential Compromise',
    sector: 'Government',
    currentStage: 'Initial Access',
    predictedStage: 'Lateral Movement',
    targetAsset: 'AUTH-SRV-04',
    probability: 87.4,
    risk: 'Critical',
    timeWindow: '8 - 14 min',
    status: 'Active',
    eventId: 'EVT-004219',
    sourceAsset: {
      id: 'WS-019', ip: '10.21.4.18', type: 'Workstation', department: 'Finance', user: 'admin_finance', location: 'New Delhi (HQ)', zone: 'Internal', criticality: 'High', os: 'Windows 11', firstSeen: 'Sep 01, 2026'
    },
    destinationAsset: {
      id: 'AUTH-SRV-04', ip: '10.21.4.12', type: 'Authentication Server', department: 'IT Infrastructure', location: 'New Delhi (Data Centre)', zone: 'DMZ', criticality: 'Critical', service: 'HTTPS (443)', classification: 'Restricted', owner: 'NTRO Govt, DC'
    },
    evidence: [
      { label: 'Login', text: '17 failed login attempts within 90 seconds' },
      { label: 'Login', text: 'Successful login after multiple failures' },
      { label: 'Device', text: 'Login from previously unseen device' },
      { label: 'Access', text: 'Accessed 11 servers (user normally accesses 3)' },
      { label: 'Time', text: 'Occurred outside normal working hours' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Login Rate', text: '3 login attempts / hour' },
        { label: 'Destinations', text: '2-4 destinations' },
        { label: 'Device', text: 'Known device' },
        { label: 'Hours', text: 'Working hours (09:00 - 18:00)' }
      ],
      current: [
        { label: 'Login Rate', text: '17 attempts / 90 sec (↑ 467%)', alert: true },
        { label: 'Destinations', text: '11 destinations (↑ 275%)', alert: true },
        { label: 'Device', text: 'Unknown device', alert: true },
        { label: 'Hours', text: 'Unusual time (22:28)', alert: true }
      ]
    },
    timeline: [
      { time: '13:57:21', event: 'Normal user authentication', status: 'normal' },
      { time: '14:26:03', event: 'Multiple failed login attempts', status: 'alert' },
      { time: '14:27:12', event: '17 failed login attempts detected', status: 'alert' },
      { time: '14:28:12', event: 'Successful authentication', status: 'critical' },
      { time: '14:28:16', event: 'New internal destination contacted', status: 'info' },
      { time: '14:28:22', event: 'Privilege-sensitive resource accessed', status: 'alert' },
      { time: '14:28:31', event: 'AI anomaly detection triggered', status: 'alert' },
      { time: '14:28:35', event: 'CURRENT STATE: Credential Compromise suspected', status: 'current' }
    ],
    mitre: [
      { id: 'T1078', desc: 'Valid Accounts' },
      { id: 'T1021', desc: 'Remote Services' },
      { id: 'T1087', desc: 'Account Discovery' },
      { id: 'T1046', desc: 'Network Service Scanning' }
    ],
    blastRadius: {
      assets: 7, departments: 3, zones: 2, criticalServices: 1
    },
    networkEvidence: {
      'Protocol': 'TCP',
      'Source IP': '10.21.4.18',
      'Destination IP': '10.21.4.12',
      'Destination Port': '443',
      'Session Duration': '42 sec',
      'Bytes Sent': '18.4 KB',
      'Bytes Received': '7.2 KB',
      'Total Connections': '11',
      'User Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Authentication': 'NTLM / Kerberos'
    },
    recommendations: [
      { text: 'Restrict communication from WS-019 to AUTH-SRV-04', level: 'Critical' },
      { text: 'Revalidate privileged account credentials', level: 'High' },
      { text: 'Investigate WS-019 for malware or persistence', level: 'High' },
      { text: 'Increase monitoring on AUTH-SRV-04', level: 'Medium' },
      { text: 'Check for lateral movement indicators in network', level: 'Medium' }
    ]
  },
  {
    id: 'FCST-0022',
    detected: 'Sep 05, 14:27:00',
    attackType: 'Malware Propagation',
    sector: 'Power & Energy',
    currentStage: 'Execution',
    predictedStage: 'Persistence',
    targetAsset: 'SCADA-01',
    probability: 82.1,
    risk: 'Critical',
    timeWindow: '12 - 18 min',
    status: 'Monitoring',
    eventId: 'EVT-004220',
    sourceAsset: {
      id: 'ENG-WS-02', ip: '10.50.2.14', type: 'Workstation', department: 'Engineering', user: 'eng_user2', location: 'Plant A', zone: 'OT Network', criticality: 'High', os: 'Windows 10', firstSeen: 'Jan 15, 2026'
    },
    destinationAsset: {
      id: 'SCADA-01', ip: '10.50.1.5', type: 'ICS Controller', department: 'Operations', location: 'Plant A', zone: 'Control System', criticality: 'Critical', service: 'Modbus (502)', classification: 'Restricted', owner: 'Plant Operations'
    },
    evidence: [
      { label: 'Process', text: 'Unusual PowerShell execution detected' },
      { label: 'Network', text: 'Scanning OT network segment on port 502' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Network', text: 'No port scanning' }
      ],
      current: [
        { label: 'Network', text: 'Sequential scanning of /24 subnet', alert: true }
      ]
    },
    timeline: [
      { time: '14:20:00', event: 'Suspicious payload downloaded', status: 'alert' },
      { time: '14:27:00', event: 'CURRENT STATE: Execution', status: 'current' }
    ],
    mitre: [
      { id: 'T1059', desc: 'Command and Scripting Interpreter' }
    ],
    blastRadius: {
      assets: 45, departments: 1, zones: 1, criticalServices: 2
    },
    networkEvidence: {
      'Protocol': 'TCP',
      'Source IP': '10.50.2.14',
      'Destination Port': '502',
    },
    recommendations: [
      { text: 'Isolate ENG-WS-02 from OT Network', level: 'Critical' }
    ]
  }
];

export const api = {
  getForecasts: async () => mockForecasts,
  getForecastById: async (id: string) => mockForecasts.find(f => f.id === id) || null,
};
