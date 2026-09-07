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
  },
  {
    id: 'FCST-0023',
    detected: 'Sep 05, 14:27:00',
    attackType: 'Phishing Campaign',
    sector: 'Telecom',
    currentStage: 'Reconnaissance',
    predictedStage: 'Initial Access',
    targetAsset: 'VPN-GW-01',
    probability: 76.8,
    risk: 'High',
    timeWindow: '10 - 20 min',
    status: 'Active',
    eventId: 'EVT-004221',
    sourceAsset: {
      id: 'External-IP', ip: '185.15.2.4', type: 'External Network', department: 'N/A', user: 'N/A', location: 'Unknown', zone: 'External', criticality: 'Low', os: 'Unknown', firstSeen: 'Sep 05, 2026'
    },
    destinationAsset: {
      id: 'VPN-GW-01', ip: '203.0.113.12', type: 'VPN Gateway', department: 'IT Security', location: 'Data Center B', zone: 'DMZ', criticality: 'Critical', service: 'HTTPS (443)', classification: 'Restricted', owner: 'Telecom SecOps'
    },
    evidence: [
      { label: 'Email', text: 'Mass influx of suspicious emails with identical payloads' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Email', text: 'Normal traffic volume' }
      ],
      current: [
        { label: 'Email', text: 'Spike in inbound emails with malicious attachments', alert: true }
      ]
    },
    timeline: [
      { time: '14:15:00', event: 'Suspicious domain registration detected', status: 'info' },
      { time: '14:27:00', event: 'CURRENT STATE: Reconnaissance', status: 'current' }
    ],
    mitre: [
      { id: 'T1566', desc: 'Phishing' }
    ],
    blastRadius: {
      assets: 15, departments: 4, zones: 3, criticalServices: 1
    },
    networkEvidence: {
      'Protocol': 'SMTP',
      'Source IP': '185.15.2.4',
    },
    recommendations: [
      { text: 'Block sender domain at email gateway', level: 'High' }
    ]
  },
  {
    id: 'FCST-0024',
    detected: 'Sep 05, 14:26:00',
    attackType: 'Data Exfiltration',
    sector: 'Healthcare',
    currentStage: 'Execution',
    predictedStage: 'Collection',
    targetAsset: 'EHR-SRV-02',
    probability: 71.5,
    risk: 'High',
    timeWindow: '15 - 25 min',
    status: 'Investigating',
    eventId: 'EVT-004222',
    sourceAsset: {
      id: 'CLINIC-PC-12', ip: '10.10.5.22', type: 'Workstation', department: 'Cardiology', user: 'dr_smith', location: 'City Hospital', zone: 'Internal', criticality: 'Medium', os: 'Windows 10', firstSeen: 'Feb 10, 2026'
    },
    destinationAsset: {
      id: 'EHR-SRV-02', ip: '10.10.1.50', type: 'Database Server', department: 'Records', location: 'City Hospital', zone: 'Secure Enclave', criticality: 'Critical', service: 'SQL (1433)', classification: 'Confidential', owner: 'Health Dept'
    },
    evidence: [
      { label: 'Network', text: 'Large outbound data transfer to unknown IP' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Data', text: 'Minimal external transfers' }
      ],
      current: [
        { label: 'Data', text: '2GB transferred externally in 5 mins', alert: true }
      ]
    },
    timeline: [
      { time: '14:20:00', event: 'Unusual database queries detected', status: 'alert' },
      { time: '14:26:00', event: 'CURRENT STATE: Execution', status: 'current' }
    ],
    mitre: [
      { id: 'T1048', desc: 'Exfiltration Over Alternative Protocol' }
    ],
    blastRadius: {
      assets: 2, departments: 1, zones: 2, criticalServices: 1
    },
    networkEvidence: {
      'Protocol': 'HTTPS',
      'Destination IP': '10.10.1.50',
    },
    recommendations: [
      { text: 'Block outbound traffic from CLINIC-PC-12', level: 'Critical' }
    ]
  },
  {
    id: 'FCST-0025',
    detected: 'Sep 05, 14:25:00',
    attackType: 'DDoS Attack',
    sector: 'Finance & Banking',
    currentStage: 'Impact',
    predictedStage: 'Service Disruption',
    targetAsset: 'WEB-CLUSTER-01',
    probability: 68.3,
    risk: 'High',
    timeWindow: '5 - 12 min',
    status: 'Active',
    eventId: 'EVT-004223',
    sourceAsset: {
      id: 'Botnet-Swarm', ip: 'Multiple', type: 'External Network', department: 'N/A', user: 'N/A', location: 'Global', zone: 'External', criticality: 'Low', os: 'Various', firstSeen: 'Sep 05, 2026'
    },
    destinationAsset: {
      id: 'WEB-CLUSTER-01', ip: '203.0.113.80', type: 'Load Balancer', department: 'Online Banking', location: 'Data Center A', zone: 'DMZ', criticality: 'Critical', service: 'HTTPS (443)', classification: 'Public', owner: 'Bank IT'
    },
    evidence: [
      { label: 'Traffic', text: 'Massive spike in SYN packets from globally distributed IPs' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Traffic', text: '10k requests/min' }
      ],
      current: [
        { label: 'Traffic', text: '500k requests/min (↑ 4900%)', alert: true }
      ]
    },
    timeline: [
      { time: '14:22:00', event: 'Initial traffic spike detected', status: 'info' },
      { time: '14:25:00', event: 'CURRENT STATE: Impact', status: 'current' }
    ],
    mitre: [
      { id: 'T1498', desc: 'Network Denial of Service' }
    ],
    blastRadius: {
      assets: 12, departments: 2, zones: 1, criticalServices: 3
    },
    networkEvidence: {
      'Protocol': 'TCP/SYN',
      'Destination Port': '443',
    },
    recommendations: [
      { text: 'Activate DDoS mitigation scrubbing center', level: 'Critical' }
    ]
  },
  {
    id: 'FCST-0026',
    detected: 'Sep 05, 14:24:00',
    attackType: 'Insider Threat',
    sector: 'IT & SaaS',
    currentStage: 'Collection',
    predictedStage: 'Exfiltration',
    targetAsset: 'DB-SRV-07',
    probability: 64.7,
    risk: 'Medium',
    timeWindow: '20 - 40 min',
    status: 'Monitoring',
    eventId: 'EVT-004224',
    sourceAsset: {
      id: 'DEV-LAPTOP-44', ip: '10.0.8.15', type: 'Laptop', department: 'Engineering', user: 'dev_john', location: 'Remote', zone: 'VPN', criticality: 'Medium', os: 'macOS', firstSeen: 'Mar 12, 2025'
    },
    destinationAsset: {
      id: 'DB-SRV-07', ip: '10.0.1.100', type: 'Database', department: 'Core Services', location: 'Cloud AWS', zone: 'Private Subnet', criticality: 'High', service: 'PostgreSQL (5432)', classification: 'Restricted', owner: 'Data Team'
    },
    evidence: [
      { label: 'Access', text: 'Unusual bulk download of customer records by developer' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Access', text: 'Querying specific records' }
      ],
      current: [
        { label: 'Access', text: 'SELECT * without limits', alert: true }
      ]
    },
    timeline: [
      { time: '14:15:00', event: 'User logged in via VPN', status: 'normal' },
      { time: '14:24:00', event: 'CURRENT STATE: Collection', status: 'current' }
    ],
    mitre: [
      { id: 'T1530', desc: 'Data from Cloud Storage Object' }
    ],
    blastRadius: {
      assets: 1, departments: 1, zones: 1, criticalServices: 1
    },
    networkEvidence: {
      'Protocol': 'PostgreSQL',
      'Source IP': '10.0.8.15',
    },
    recommendations: [
      { text: 'Temporarily revoke database access for dev_john', level: 'High' }
    ]
  },
  {
    id: 'FCST-0027',
    detected: 'Sep 05, 14:22:00',
    attackType: 'Ransomware',
    sector: 'Manufacturing',
    currentStage: 'Initial Access',
    predictedStage: 'Execution',
    targetAsset: 'FILE-SRV-03',
    probability: 61.2,
    risk: 'Medium',
    timeWindow: '18 - 35 min',
    status: 'Active',
    eventId: 'EVT-004225',
    sourceAsset: {
      id: 'HR-PC-01', ip: '192.168.1.50', type: 'Workstation', department: 'HR', user: 'hr_manager', location: 'Branch Office', zone: 'Internal', criticality: 'Medium', os: 'Windows 10', firstSeen: 'Jun 22, 2024'
    },
    destinationAsset: {
      id: 'FILE-SRV-03', ip: '192.168.10.10', type: 'File Server', department: 'Corporate', location: 'HQ', zone: 'Internal', criticality: 'High', service: 'SMB (445)', classification: 'Confidential', owner: 'IT'
    },
    evidence: [
      { label: 'File', text: 'Multiple file renaming events with suspicious extensions' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'File I/O', text: 'Low volume of modifications' }
      ],
      current: [
        { label: 'File I/O', text: 'High volume encryption behavior', alert: true }
      ]
    },
    timeline: [
      { time: '14:20:00', event: 'Suspicious email attachment opened', status: 'alert' },
      { time: '14:22:00', event: 'CURRENT STATE: Initial Access', status: 'current' }
    ],
    mitre: [
      { id: 'T1486', desc: 'Data Encrypted for Impact' }
    ],
    blastRadius: {
      assets: 25, departments: 3, zones: 2, criticalServices: 2
    },
    networkEvidence: {
      'Protocol': 'SMB',
      'Destination Port': '445',
    },
    recommendations: [
      { text: 'Isolate HR-PC-01 and FILE-SRV-03 from network', level: 'Critical' }
    ]
  },
  {
    id: 'FCST-0028',
    detected: 'Sep 05, 14:21:00',
    attackType: 'Supply Chain Attack',
    sector: 'Education',
    currentStage: 'Reconnaissance',
    predictedStage: 'Initial Access',
    targetAsset: 'EDU-PORTAL-01',
    probability: 58.9,
    risk: 'Medium',
    timeWindow: '25 - 50 min',
    status: 'Monitoring',
    eventId: 'EVT-004226',
    sourceAsset: {
      id: 'Vendor-Update-Srv', ip: 'External', type: '3rd Party Server', department: 'Vendor', user: 'N/A', location: 'Cloud', zone: 'External', criticality: 'Low', os: 'Linux', firstSeen: 'N/A'
    },
    destinationAsset: {
      id: 'EDU-PORTAL-01', ip: '172.16.0.20', type: 'Web Server', department: 'IT', location: 'Campus Data Center', zone: 'DMZ', criticality: 'High', service: 'HTTPS (443)', classification: 'Public', owner: 'University IT'
    },
    evidence: [
      { label: 'Update', text: 'Software update downloaded with mismatched hash' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Update Hash', text: 'Matches vendor signature' }
      ],
      current: [
        { label: 'Update Hash', text: 'Signature mismatch', alert: true }
      ]
    },
    timeline: [
      { time: '14:10:00', event: 'Scheduled update initiated', status: 'normal' },
      { time: '14:21:00', event: 'CURRENT STATE: Reconnaissance', status: 'current' }
    ],
    mitre: [
      { id: 'T1195', desc: 'Supply Chain Compromise' }
    ],
    blastRadius: {
      assets: 10, departments: 5, zones: 2, criticalServices: 1
    },
    networkEvidence: {
      'Protocol': 'HTTPS',
    },
    recommendations: [
      { text: 'Halt update installation process immediately', level: 'High' }
    ]
  },
  {
    id: 'FCST-0029',
    detected: 'Sep 05, 14:20:00',
    attackType: 'Web Exploitation',
    sector: 'Transport',
    currentStage: 'Initial Access',
    predictedStage: 'Privilege Escalation',
    targetAsset: 'APP-SRV-09',
    probability: 55.6,
    risk: 'Low',
    timeWindow: '30 - 60 min',
    status: 'Active',
    eventId: 'EVT-004227',
    sourceAsset: {
      id: 'Unknown-IP', ip: '203.0.113.45', type: 'External Network', department: 'N/A', user: 'N/A', location: 'Unknown', zone: 'External', criticality: 'Low', os: 'Unknown', firstSeen: 'Sep 05, 2026'
    },
    destinationAsset: {
      id: 'APP-SRV-09', ip: '10.20.1.15', type: 'Application Server', department: 'Logistics', location: 'Data Center C', zone: 'DMZ', criticality: 'High', service: 'HTTPS (443)', classification: 'Confidential', owner: 'Transport Auth'
    },
    evidence: [
      { label: 'Web', text: 'SQL Injection patterns detected in HTTP requests' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Requests', text: 'Standard API calls' }
      ],
      current: [
        { label: 'Requests', text: 'Malformed SQL queries in payload', alert: true }
      ]
    },
    timeline: [
      { time: '14:15:00', event: 'Vulnerability scan detected', status: 'info' },
      { time: '14:20:00', event: 'CURRENT STATE: Initial Access', status: 'current' }
    ],
    mitre: [
      { id: 'T1190', desc: 'Exploit Public-Facing Application' }
    ],
    blastRadius: {
      assets: 3, departments: 1, zones: 1, criticalServices: 1
    },
    networkEvidence: {
      'Protocol': 'HTTPS',
      'Destination Port': '443',
    },
    recommendations: [
      { text: 'Update WAF rules to block source IP', level: 'Medium' }
    ]
  },
  {
    id: 'FCST-0030',
    detected: 'Sep 05, 14:18:00',
    attackType: 'Brute Force',
    sector: 'Others',
    currentStage: 'Reconnaissance',
    predictedStage: 'Credential Access',
    targetAsset: 'MAIL-SRV-02',
    probability: 52.1,
    risk: 'Low',
    timeWindow: '40 - 70 min',
    status: 'Investigating',
    eventId: 'EVT-004228',
    sourceAsset: {
      id: 'Tor-Node', ip: '198.51.100.12', type: 'External Network', department: 'N/A', user: 'N/A', location: 'Unknown', zone: 'External', criticality: 'Low', os: 'Unknown', firstSeen: 'Sep 05, 2026'
    },
    destinationAsset: {
      id: 'MAIL-SRV-02', ip: '10.5.1.10', type: 'Mail Server', department: 'IT', location: 'HQ Data Center', zone: 'DMZ', criticality: 'High', service: 'IMAP (143)', classification: 'Confidential', owner: 'IT'
    },
    evidence: [
      { label: 'Auth', text: 'Continuous failed login attempts across multiple accounts' }
    ],
    behaviorDeviation: {
      normal: [
        { label: 'Failed Logins', text: '< 5 per hour' }
      ],
      current: [
        { label: 'Failed Logins', text: '200 per minute', alert: true }
      ]
    },
    timeline: [
      { time: '14:10:00', event: 'First failed login detected', status: 'info' },
      { time: '14:18:00', event: 'CURRENT STATE: Reconnaissance', status: 'current' }
    ],
    mitre: [
      { id: 'T1110', desc: 'Brute Force' }
    ],
    blastRadius: {
      assets: 1, departments: 0, zones: 1, criticalServices: 1
    },
    networkEvidence: {
      'Protocol': 'IMAP',
      'Destination Port': '143',
    },
    recommendations: [
      { text: 'Enforce account lockout policies and block source IP', level: 'Medium' }
    ]
  }
];

export const api = {
  getForecasts: async () => mockForecasts,
  getForecastById: async (id: string) => mockForecasts.find(f => f.id === id) || null,
};
