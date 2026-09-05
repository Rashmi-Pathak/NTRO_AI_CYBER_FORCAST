import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing/Landing';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CommandCenter from '@/pages/CommandCenter/CommandCenter';
import LiveThreatMonitor from '@/pages/LiveThreatMonitor/LiveThreatMonitor';
import AttackForecast from '@/pages/AttackForecast/AttackForecast';
import AttackAnalysis from '@/pages/AttackAnalysis/AttackAnalysis';
import ThreatInvestigation from '@/pages/AttackAnalysis/ThreatInvestigation';
import AttackPath from '@/pages/AttackPath/AttackPath';
import TargetAssetIntelligence from '@/pages/TargetAssetIntelligence/TargetAssetIntelligence';
import SectorIntelligence from '@/pages/SectorIntelligence/SectorIntelligence';
import ThreatIntelligence from '@/pages/ThreatIntelligence/ThreatIntelligence';
import IncidentManagement from '@/pages/IncidentManagement/IncidentManagement';
import ModelIntelligence from '@/pages/ModelIntelligence/ModelIntelligence';
import DataSimulationLab from '@/pages/DataSimulationLab/DataSimulationLab';
import SystemConfiguration from '@/pages/SystemConfiguration/SystemConfiguration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Authenticated Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/live-monitor" element={<LiveThreatMonitor />} />
          <Route path="/attack-forecast" element={<AttackForecast />} />
          <Route path="/attack-analysis" element={<AttackAnalysis />} />
          <Route path="/attack-analysis/:forecastId" element={<ThreatInvestigation />} />
          <Route path="/attack-path" element={<AttackPath />} />
          <Route path="/assets" element={<TargetAssetIntelligence />} />
          <Route path="/sectors" element={<SectorIntelligence />} />
          <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
          <Route path="/incidents" element={<IncidentManagement />} />
          <Route path="/model-intelligence" element={<ModelIntelligence />} />
          <Route path="/data-lab" element={<DataSimulationLab />} />
          <Route path="/configuration" element={<SystemConfiguration />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
