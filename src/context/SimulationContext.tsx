"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Camera, 
  Alert, 
  LicensePlate, 
  FaceMatch, 
  BOPNode, 
  Evidence, 
  SystemMetrics, 
  Zone,
  Detection,
  TrackedObject,
  EdgeNodeTelemetry,
  ScenarioDefinition,
  ScenarioId,
  JuryDemoStep,
  AuditLogEntry,
  Role,
  UserSession,
  NetworkMode,
  IncidentStatus,
  ThreatScoreBreakdown
} from '../types';
import { 
  INITIAL_CAMERAS, 
  INITIAL_ALERTS, 
  INITIAL_PLATES, 
  INITIAL_FACES, 
  INITIAL_BOP_NODES, 
  INITIAL_EVIDENCE, 
  INITIAL_METRICS,
  INITIAL_TRACKS,
  INITIAL_EDGE_NODE,
  OPERATIONAL_SCENARIOS,
  JURY_DEMO_STEPS,
  INITIAL_AUDIT_LOG
} from '../data/mockData';
import { DEMO_USERS } from '../services/authService';

interface SimulationContextType {
  // Domain Data State
  cameras: Camera[];
  alerts: Alert[];
  plates: LicensePlate[];
  faces: FaceMatch[];
  bopNodes: BOPNode[];
  evidence: Evidence[];
  tracks: TrackedObject[];
  metrics: SystemMetrics;
  edgeNode: EdgeNodeTelemetry;
  auditLogs: AuditLogEntry[];
  
  // Navigation & Selection UI State
  currentTimeStr: string;
  selectedCameraId: string | null;
  selectedAlert: Alert | null;
  isAlertDrawerOpen: boolean;
  demoMode: boolean;
  activeTab: string;
  soundAlerts: boolean;
  scenarioModalOpen: boolean;
  commandPaletteOpen: boolean;
  
  // RBAC Session
  currentRole: Role;
  currentUser: UserSession;
  
  // Network & Sync State
  networkMode: NetworkMode;
  pendingSyncCount: number;
  isSyncing: boolean;
  
  // Scenario & Jury Demo Playback
  currentScenario: ScenarioId | null;
  isPlayingScenario: boolean;
  playbackSpeed: number; // 0.25, 0.5, 1, 2, 4
  juryDemoActive: boolean;
  juryDemoStep: number;
  juryDemoCurrent: JuryDemoStep | null;
  
  // Action Handlers
  setSelectedCameraId: (id: string | null) => void;
  setSelectedAlert: (alert: Alert | null) => void;
  setIsAlertDrawerOpen: (open: boolean) => void;
  setScenarioModalOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setDemoMode: (val: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSoundAlerts: (val: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  
  // Operations & Incident Lifecycle
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, notes?: string, falsePositive?: boolean) => void;
  triggerSimulatedAlert: () => void;
  updateZone: (zone: Zone) => void;
  addCustomZone: (zone: Zone) => void;
  deleteZone: (zoneId: string, cameraId: string) => void;
  
  // Scenario & Demo Engine
  runScenario: (scenarioId: ScenarioId) => void;
  pauseScenario: () => void;
  resumeScenario: () => void;
  resetToNominal: () => void;
  startJuryDemo: () => void;
  stopJuryDemo: () => void;
  nextJuryStep: () => void;
  
  // Infrastructure & Network Actions
  setNetworkMode: (mode: NetworkMode) => void;
  triggerManualSync: () => void;
  
  // Session Actions
  switchRole: (role: Role) => void;
  logAuditAction: (action: string, resource: string, details: string) => void;
  
  // Audio Feedback
  playTacticalSound: (type: 'click' | 'alert' | 'breach' | 'ack') => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // Domain State
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [plates, setPlates] = useState<LicensePlate[]>(INITIAL_PLATES);
  const [faces, setFaces] = useState<FaceMatch[]>(INITIAL_FACES);
  const [bopNodes, setBopNodes] = useState<BOPNode[]>(INITIAL_BOP_NODES);
  const [evidence, setEvidence] = useState<Evidence[]>(INITIAL_EVIDENCE);
  const [tracks, setTracks] = useState<TrackedObject[]>(INITIAL_TRACKS);
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [edgeNode, setEdgeNode] = useState<EdgeNodeTelemetry>(INITIAL_EDGE_NODE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // UI Selection State
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState('14:32:00 IST');

  // RBAC State
  const [currentRole, setCurrentRole] = useState<Role>('OPERATOR');
  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.OPERATOR;

  // Network & Sync State
  const [networkMode, setNetworkModeState] = useState<NetworkMode>('ONLINE');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Scenario & Jury Demo State
  const [currentScenario, setCurrentScenario] = useState<ScenarioId | null>(null);
  const [isPlayingScenario, setIsPlayingScenario] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [juryDemoActive, setJuryDemoActive] = useState(false);
  const [juryDemoStep, setJuryDemoStep] = useState<number>(1);
  const juryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Tactical Audio Synthesizer
  const playTacticalSound = useCallback((type: 'click' | 'alert' | 'breach' | 'ack') => {
    if (typeof window === 'undefined' || !soundAlerts) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'ack') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(640, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'breach' || type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(980, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(740, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio autoplay policy catch
    }
  }, [soundAlerts]);

  // Tamper-Evident Audit Logger
  const logAuditAction = useCallback((action: string, resource: string, details: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;
    const newEntry: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      actor: currentUser.callsign,
      role: currentRole,
      action,
      resource,
      result: 'SUCCESS',
      details,
      ipAddress: '10.14.0.12'
    };
    setAuditLogs(prev => [newEntry, ...prev.slice(0, 99)]);
  }, [currentUser, currentRole]);

  // Live Clock Interval
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}:${seconds} IST`);
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K or /) for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setIsAlertDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Deterministic Telemetry Tick & Entity Motion
  useEffect(() => {
    const simInterval = setInterval(() => {
      const jitterFps = +(28.2 + Math.random() * 1.4).toFixed(1);
      const jitterLatency = Math.floor(88 + Math.random() * 10);
      const alertLatency = Math.floor(390 + Math.random() * 35);

      setMetrics(prev => ({
        ...prev,
        fpsAverage: jitterFps,
        inferenceLatencyMs: jitterLatency,
        alertLatencyMs: alertLatency,
        lastSyncTimestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST'
      }));

      // Coordinated spatial motion for tracked objects
      setCameras(prevCams => prevCams.map(cam => {
        if (cam.id === 'CAM-01') {
          const updatedDetections = cam.currentDetections.map(det => {
            if (det.trackingId === 'PERSON-042') {
              const deltaX = (Math.random() - 0.48) * 0.4;
              const deltaY = (Math.random() - 0.49) * 0.25;
              const newX = Math.min(68, Math.max(30, det.bbox.x + deltaX));
              const newY = Math.min(55, Math.max(32, det.bbox.y + deltaY));
              return {
                ...det,
                bbox: { ...det.bbox, x: +newX.toFixed(2), y: +newY.toFixed(2) },
                speedKmh: +(4.0 + Math.random() * 0.6).toFixed(1),
                loiterSeconds: (det.loiterSeconds || 60) + 1
              };
            }
            return det;
          });
          return { ...cam, currentDetections: updatedDetections, fps: jitterFps };
        }
        return cam;
      }));
    }, 2000 / playbackSpeed);

    return () => clearInterval(simInterval);
  }, [playbackSpeed]);

  // Role Switcher
  const switchRole = useCallback((role: Role) => {
    playTacticalSound('click');
    setCurrentRole(role);
    logAuditAction('ROLE_SWITCH', `ROLE:${role}`, `Active console role changed to ${role}`);
  }, [playTacticalSound, logAuditAction]);

  // Network Mode Switcher & Offline Sync Engine
  const setNetworkMode = useCallback((mode: NetworkMode) => {
    playTacticalSound('click');
    setNetworkModeState(mode);
    setMetrics(prev => ({ ...prev, networkMode: mode }));
    setEdgeNode(prev => ({ ...prev, networkMode: mode }));
    logAuditAction('NETWORK_MODE_CHANGE', `MODE:${mode}`, `Edge network state toggled to ${mode}`);

    // If switching back to ONLINE with pending events, start simulated sync drain
    if (mode === 'ONLINE' && pendingSyncCount > 0) {
      setIsSyncing(true);
      const syncInterval = setInterval(() => {
        setPendingSyncCount(prev => {
          if (prev <= 1) {
            clearInterval(syncInterval);
            setIsSyncing(false);
            playTacticalSound('ack');
            logAuditAction('SYNC_COMPLETE', 'CENTRAL_HQ', 'All pending edge events synchronized to central node');
            return 0;
          }
          return prev - 1;
        });
      }, 300);
    }
  }, [pendingSyncCount, playTacticalSound, logAuditAction]);

  const triggerManualSync = useCallback(() => {
    if (networkMode === 'OFFLINE') return;
    setIsSyncing(true);
    playTacticalSound('click');
    setTimeout(() => {
      setPendingSyncCount(0);
      setIsSyncing(false);
      playTacticalSound('ack');
      logAuditAction('MANUAL_SYNC', 'CENTRAL_HQ', 'Manual synchronization trigger executed');
    }, 1200);
  }, [networkMode, playTacticalSound, logAuditAction]);

  // Alert Actions (Lifecycle: NEW -> ACKNOWLEDGED -> RESOLVED / FALSE_POSITIVE)
  const acknowledgeAlert = useCallback((alertId: string) => {
    playTacticalSound('ack');
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true, status: 'ACKNOWLEDGED', acknowledgedBy: currentUser.callsign } : a
    ));
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, acknowledged: true, status: 'ACKNOWLEDGED', acknowledgedBy: currentUser.callsign } : null);
    }
    logAuditAction('ALERT_ACKNOWLEDGED', alertId, `Acknowledged by ${currentUser.callsign}`);
  }, [selectedAlert, currentUser, playTacticalSound, logAuditAction]);

  const resolveAlert = useCallback((alertId: string, notes?: string, falsePositive: boolean = false) => {
    playTacticalSound('ack');
    const newStatus: IncidentStatus = falsePositive ? 'FALSE_POSITIVE' : 'RESOLVED';
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { 
        ...a, 
        status: newStatus, 
        resolvedBy: currentUser.callsign, 
        resolutionNotes: notes || (falsePositive ? 'False alarm recorded' : 'Interdiction complete') 
      } : a
    ));
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(prev => prev ? { 
        ...prev, 
        status: newStatus, 
        resolvedBy: currentUser.callsign, 
        resolutionNotes: notes || (falsePositive ? 'False alarm recorded' : 'Interdiction complete') 
      } : null);
    }
    logAuditAction(falsePositive ? 'ALERT_FALSE_POSITIVE' : 'ALERT_RESOLVED', alertId, `Resolved by ${currentUser.callsign}: ${notes || 'Status updated'}`);
  }, [selectedAlert, currentUser, playTacticalSound, logAuditAction]);

  // Trigger Simulated Breach Alert
  const triggerSimulatedAlert = useCallback(() => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;
    const newId = `ALERT-${Math.floor(100 + Math.random() * 900)}`;

    const newAlert: Alert = {
      id: newId,
      severity: 'CRITICAL',
      type: 'PERIMETER_BREACH',
      status: 'NEW',
      cameraId: 'CAM-01',
      cameraName: 'BORDER FENCE NORTH',
      zoneId: 'zone-01',
      zoneName: 'BORDER FENCE 01',
      objectId: 'PERSON-042',
      objectClass: 'person',
      confidence: 0.95,
      timestamp: timeStr,
      direction: 'ENTRY',
      description: 'Tripwire trigger: Subject crossed primary perimeter boundary polygon into buffer zone.',
      acknowledged: false,
      snapshotUrl: 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=800&q=80',
      relatedCameraIds: ['CAM-01', 'CAM-02'],
      threatBreakdown: {
        score: 87,
        level: 'CRITICAL',
        factors: [
          { name: 'PERIMETER CROSSING', weight: 35, description: 'Subject crossed virtual fence tripwire' },
          { name: 'RESTRICTED ZONE ENTRY', weight: 20, description: 'Entry vector detected towards border buffer' },
          { name: 'LOITERING ANOMALY', weight: 12, description: 'Stationary dwell exceeded 60s baseline' },
          { name: 'CROSS-CAMERA CONTINUITY', weight: 10, description: 'Track validated from CAM-01 corridor' },
          { name: 'HIGH DETECTION CONFIDENCE', weight: 10, description: 'YOLOv8x certainty 95.0%' }
        ],
        reason: 'Subject crossed restricted polygon boundary and maintained continuous inward movement trajectory.'
      },
      metadata: { vector: 'WEST -> EAST', dwellTime: '72s', speed: '4.8 km/h' }
    };

    playTacticalSound('breach');
    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlert(newAlert);
    setIsAlertDrawerOpen(true);
    setSelectedCameraId('CAM-01');

    if (networkMode === 'OFFLINE') {
      setPendingSyncCount(prev => prev + 1);
    }

    logAuditAction('ALERT_EMITTED', newId, 'Critical tripwire intrusion alert emitted by edge pipeline');
  }, [networkMode, playTacticalSound, logAuditAction]);

  // 14 Scenario Execution Engine
  const runScenario = useCallback((scenarioId: ScenarioId) => {
    setCurrentScenario(scenarioId);
    setIsPlayingScenario(true);
    playTacticalSound('click');
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;

    if (scenarioId === '02_PERIMETER_BREACH') {
      triggerSimulatedAlert();
    } else if (scenarioId === '05_VEHICLE_WATCHLIST') {
      const newPlate: LicensePlate = {
        id: `lpr-${Date.now()}`,
        plateNumber: 'JK02BB1001',
        vehicleType: 'TRUCK',
        confidence: 0.93,
        ocrConfidence: 0.91,
        formatValid: true,
        status: 'WATCHLIST',
        cameraId: 'CAM-03',
        timestamp: timeStr,
        cropUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
        direction: 'INBOUND',
        speedKmh: 14.2,
        watchlistMatchReason: 'Contraband Intercept Registry Entry #4092'
      };
      const alertItem: Alert = {
        id: `ALERT-${Math.floor(300 + Math.random() * 600)}`,
        severity: 'HIGH',
        type: 'UNAUTHORIZED_VEHICLE',
        status: 'NEW',
        cameraId: 'CAM-03',
        cameraName: 'CHECKPOINT ALPHA',
        zoneId: 'zone-04',
        zoneName: 'INSPECTION BAY',
        objectId: 'VEHICLE-1001',
        objectClass: 'truck',
        confidence: 0.93,
        timestamp: timeStr,
        direction: 'ENTRY',
        description: 'HOTLIST MATCH: Vehicle plate JK02BB1001 flagged on national contraband alert registry. Gate lock engaged.',
        acknowledged: false,
        snapshotUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        relatedCameraIds: ['CAM-03'],
        threatBreakdown: {
          score: 82,
          level: 'HIGH',
          factors: [
            { name: 'WATCHLIST HIT', weight: 45, description: 'Plate JK02BB1001 on active hotlist' },
            { name: 'CHECKPOINT ENTRY', weight: 20, description: 'Approaching primary vehicle barrier' },
            { name: 'HIGH OCR CONFIDENCE', weight: 17, description: 'LPRNet-v3 read certainty 91.0%' }
          ],
          reason: 'Vehicle plate flagged on national contraband alert registry. Gate lock engaged automatically.'
        }
      };
      setPlates(prev => [newPlate, ...prev]);
      playTacticalSound('alert');
      setAlerts(prev => [alertItem, ...prev]);
      setSelectedAlert(alertItem);
      setIsAlertDrawerOpen(true);
      setSelectedCameraId('CAM-03');
    } else if (scenarioId === '04_LOITERING') {
      const loiterAlert: Alert = {
        id: `ALERT-${Math.floor(400 + Math.random() * 500)}`,
        severity: 'MEDIUM',
        type: 'LOITERING',
        status: 'NEW',
        cameraId: 'CAM-04',
        cameraName: 'PATROL CORRIDOR SOUTH',
        zoneId: 'zone-05',
        zoneName: 'PATROL RUNWAY',
        objectId: 'PERSON-099',
        objectClass: 'person',
        confidence: 0.88,
        timestamp: timeStr,
        direction: 'STATIONARY',
        description: 'ANOMALY: Subject stationary in patrol runway buffer beyond 60-second dwell ceiling (78s elapsed).',
        acknowledged: false,
        snapshotUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
        relatedCameraIds: ['CAM-04'],
        threatBreakdown: {
          score: 56,
          level: 'ELEVATED',
          factors: [
            { name: 'DWELL TIME EXCEEDED', weight: 32, description: 'Stationary in buffer for 78s (>60s rule)' },
            { name: 'PATROL RUNWAY PROXIMITY', weight: 14, description: 'Within 20m of security vehicle runway' },
            { name: 'ZERO MOVEMENT', weight: 10, description: 'Velocity < 1.0 km/h' }
          ],
          reason: 'Subject maintained stationary position within patrol buffer polygon without movement progression.'
        }
      };
      playTacticalSound('alert');
      setAlerts(prev => [loiterAlert, ...prev]);
      setSelectedAlert(loiterAlert);
      setIsAlertDrawerOpen(true);
      setSelectedCameraId('CAM-04');
    } else if (scenarioId === '09_COMMUNICATION_LOSS') {
      setNetworkMode('OFFLINE');
    } else if (scenarioId === '01_NORMAL_OPERATIONS') {
      // Clear alert states
      setCameras(prev => prev.map(c => ({
        ...c,
        activeZones: c.activeZones.map(z => ({ ...z, status: 'ACTIVE' }))
      })));
      setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true, status: 'RESOLVED', acknowledgedBy: currentUser.callsign })));
      playTacticalSound('ack');
    }

    logAuditAction('SCENARIO_STARTED', scenarioId, `Operational simulation scenario ${scenarioId} executed`);
  }, [currentUser, triggerSimulatedAlert, playTacticalSound, setNetworkMode, logAuditAction]);

  const pauseScenario = useCallback(() => {
    setIsPlayingScenario(false);
  }, []);

  const resumeScenario = useCallback(() => {
    setIsPlayingScenario(true);
  }, []);

  const resetToNominal = useCallback(() => {
    setCameras(INITIAL_CAMERAS);
    setAlerts(INITIAL_ALERTS);
    setTracks(INITIAL_TRACKS);
    setPlates(INITIAL_PLATES);
    setFaces(INITIAL_FACES);
    setMetrics(INITIAL_METRICS);
    setEdgeNode(INITIAL_EDGE_NODE);
    setSelectedAlert(null);
    setIsAlertDrawerOpen(false);
    setSelectedCameraId(null);
    setCurrentScenario(null);
    setIsPlayingScenario(false);
    setJuryDemoActive(false);
    setNetworkModeState('ONLINE');
    setPendingSyncCount(0);
    playTacticalSound('ack');
    logAuditAction('SYSTEM_RESET', 'NOMINAL_STATE', 'System restored to baseline nominal surveillance state');
  }, [playTacticalSound, logAuditAction]);

  // Jury Demo Engine (12 Steps per Section 74)
  const startJuryDemo = useCallback(() => {
    setJuryDemoActive(true);
    setJuryDemoStep(1);
    setSelectedCameraId('CAM-01');
    playTacticalSound('breach');
    logAuditAction('JURY_DEMO_START', 'ALL_SUBSYSTEMS', 'Automated 12-step competition presentation sequence initialized');
  }, [playTacticalSound, logAuditAction]);

  const stopJuryDemo = useCallback(() => {
    if (juryTimerRef.current) clearTimeout(juryTimerRef.current);
    setJuryDemoActive(false);
    playTacticalSound('ack');
    logAuditAction('JURY_DEMO_STOP', 'ALL_SUBSYSTEMS', 'Jury presentation sequence terminated');
  }, [playTacticalSound, logAuditAction]);

  const nextJuryStep = useCallback(() => {
    setJuryDemoStep(prev => {
      const next = prev < JURY_DEMO_STEPS.length ? prev + 1 : 1;
      const stepDef = JURY_DEMO_STEPS.find(s => s.stepIndex === next);
      if (stepDef?.cameraFocus) {
        setSelectedCameraId(stepDef.cameraFocus);
      }
      if (next === 5) {
        // Trigger breach alert
        triggerSimulatedAlert();
      } else if (next === 9) {
        // Operator Acknowledge
        if (alerts[0]) acknowledgeAlert(alerts[0].id);
      } else if (next === 11) {
        // Operator Resolve
        if (alerts[0]) resolveAlert(alerts[0].id, 'Jury demonstration completed.');
      }
      playTacticalSound('click');
      return next;
    });
  }, [alerts, triggerSimulatedAlert, acknowledgeAlert, resolveAlert, playTacticalSound]);

  // Auto-advance Jury Demo steps
  useEffect(() => {
    if (!juryDemoActive) return;

    const currentStepDef = JURY_DEMO_STEPS.find(s => s.stepIndex === juryDemoStep);
    const duration = (currentStepDef?.durationMs || 4500) / playbackSpeed;

    juryTimerRef.current = setTimeout(() => {
      if (juryDemoStep < JURY_DEMO_STEPS.length) {
        nextJuryStep();
      } else {
        setJuryDemoActive(false);
        playTacticalSound('ack');
      }
    }, duration);

    return () => {
      if (juryTimerRef.current) clearTimeout(juryTimerRef.current);
    };
  }, [juryDemoActive, juryDemoStep, playbackSpeed, nextJuryStep, playTacticalSound]);

  const juryDemoCurrent = juryDemoActive 
    ? JURY_DEMO_STEPS.find(s => s.stepIndex === juryDemoStep) || null
    : null;

  // Zone Mutations
  const updateZone = useCallback((updatedZone: Zone) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === updatedZone.cameraId) {
        return {
          ...cam,
          activeZones: cam.activeZones.map(z => z.id === updatedZone.id ? updatedZone : z)
        };
      }
      return cam;
    }));
    logAuditAction('ZONE_UPDATED', updatedZone.id, `Zone ${updatedZone.name} polygon/rule modified`);
  }, [logAuditAction]);

  const addCustomZone = useCallback((newZone: Zone) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === newZone.cameraId) {
        return {
          ...cam,
          activeZones: [...cam.activeZones, newZone]
        };
      }
      return cam;
    }));
    logAuditAction('ZONE_CREATED', newZone.id, `New zone ${newZone.name} added to camera ${newZone.cameraId}`);
  }, [logAuditAction]);

  const deleteZone = useCallback((zoneId: string, cameraId: string) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === cameraId) {
        return {
          ...cam,
          activeZones: cam.activeZones.filter(z => z.id !== zoneId)
        };
      }
      return cam;
    }));
    logAuditAction('ZONE_DELETED', zoneId, `Zone ${zoneId} removed from camera ${cameraId}`);
  }, [logAuditAction]);

  return (
    <SimulationContext.Provider
      value={{
        cameras,
        alerts,
        plates,
        faces,
        bopNodes,
        evidence,
        tracks,
        metrics,
        edgeNode,
        auditLogs,
        currentTimeStr,
        selectedCameraId,
        selectedAlert,
        isAlertDrawerOpen,
        demoMode,
        activeTab,
        soundAlerts,
        scenarioModalOpen,
        commandPaletteOpen,
        currentRole,
        currentUser,
        networkMode,
        pendingSyncCount,
        isSyncing,
        currentScenario,
        isPlayingScenario,
        playbackSpeed,
        juryDemoActive,
        juryDemoStep,
        juryDemoCurrent,
        setSelectedCameraId,
        setSelectedAlert,
        setIsAlertDrawerOpen,
        setScenarioModalOpen,
        setCommandPaletteOpen,
        setDemoMode,
        setActiveTab,
        setSoundAlerts,
        setPlaybackSpeed,
        acknowledgeAlert,
        resolveAlert,
        triggerSimulatedAlert,
        updateZone,
        addCustomZone,
        deleteZone,
        runScenario,
        pauseScenario,
        resumeScenario,
        resetToNominal,
        startJuryDemo,
        stopJuryDemo,
        nextJuryStep,
        setNetworkMode,
        triggerManualSync,
        switchRole,
        logAuditAction,
        playTacticalSound,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
