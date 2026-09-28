import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Shield, Clock, MapPin, Activity } from 'lucide-react';

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Mock data for the event detail
  const event = {
    id: eventId,
    timestamp: new Date().toISOString(),
    sourceIp: '192.168.1.105',
    destIp: '10.0.0.50',
    severity: 'Critical',
    detectionReason: 'Suspicious payload matching known ransomware signatures (WannaCry variant)',
    status: 'Active',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 border border-ntro-blue/30 text-ntro-blue hover:bg-ntro-blue/10 rounded-md transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
          <AlertTriangle className="text-ntro-red w-6 h-6" />
          Event Details <span className="text-ntro-blue/50">/</span> {event.id}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border-ntro-red/30 md:col-span-2 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-ntro-red flex items-center gap-2 text-lg font-semibold">
              <Shield className="w-5 h-5" /> Threat Summary
            </h3>
          </div>
          <div className="space-y-4 text-slate-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-navy/50 rounded-lg border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Source IP</p>
                <p className="font-mono text-lg text-white">{event.sourceIp}</p>
              </div>
              <div className="p-4 bg-navy/50 rounded-lg border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Destination IP</p>
                <p className="font-mono text-lg text-white">{event.destIp}</p>
              </div>
              <div className="p-4 bg-navy/50 rounded-lg border border-white/10">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Timestamp
                </p>
                <p className="text-sm text-white">{new Date(event.timestamp).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-navy/50 rounded-lg border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Severity</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-ntro-red/20 text-ntro-red border border-ntro-red/50 text-xs font-medium">
                  {event.severity}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-ntro-red/10 rounded-lg border border-ntro-red/20 mt-4">
              <p className="text-sm text-ntro-red/80 mb-2 font-semibold">Detection Reason</p>
              <p className="text-gray-300">{event.detectionReason}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel border-ntro-blue/20 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-ntro-blue flex items-center gap-2 text-lg font-semibold">
              <MapPin className="w-5 h-5" /> Geolocation
            </h3>
          </div>
          <div>
            <div className="h-[200px] w-full bg-navy/80 rounded-lg border border-white/10 flex items-center justify-center">
              <span className="text-gray-500 text-sm">[Map Visualization Placeholder]</span>
            </div>
          </div>
        </div>

        <div className="glass-panel border-ntro-blue/20 md:col-span-3 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-ntro-blue flex items-center gap-2 text-lg font-semibold">
              <Activity className="w-5 h-5" /> Event Timeline
            </h3>
          </div>
          <div>
            <div className="space-y-4">
              <div className="flex gap-4 items-start relative before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-0.5 before:bg-white/10">
                <div className="w-6 h-6 rounded-full bg-ntro-red/20 border border-ntro-red flex items-center justify-center shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-ntro-red" />
                </div>
                <div className="pb-4">
                  <p className="text-sm text-ntro-red font-semibold">Initial Access Detected</p>
                  <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-1">Suspicious login attempt from {event.sourceIp}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start relative">
                <div className="w-6 h-6 rounded-full bg-ntro-blue/20 border border-ntro-blue flex items-center justify-center shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-ntro-blue" />
                </div>
                <div>
                  <p className="text-sm text-ntro-blue font-semibold">Event Correlated</p>
                  <p className="text-xs text-gray-500">Just now</p>
                  <p className="text-sm text-gray-400 mt-1">System correlated event with active threat campaign.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
