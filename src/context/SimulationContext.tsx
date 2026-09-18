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
  ThreatScoreBreakdown,
  VideoSyncEvent,
  CameraSeekRequest
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
  INITIAL_AUDIT_LOG,
  VIDEO_TIMELINE_EVENTS
} from '../data/mockData';
import {
  CAMERA_SCENARIOS,
  getActiveDetectionsForCamera,
  getTargetCountsFromClocks,
  getTriggeredZonesForCamera
} from '../data/videoScenarios';
import { DEMO_USERS } from '../services/authService';
import { AIModelRecord, CustomVideoSource } from '@/types/ai';
import { INITIAL_AI_MODELS } from '@/services/aiTrainingService';

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

  // Video-Synchronized Engine
  cameraPlaybackTimes: Record<string, number>;
  reportCameraPlaybackTime: (cameraId: string, currentTime: number) => void;
  timelineEvents: VideoSyncEvent[];
  cameraSeekRequests: Record<string, CameraSeekRequest>;
  seekCamera: (cameraId: string, timeSec: number, pause?: boolean) => void;
  highlightedTargetId: string | null;
  highlightedZoneId: string | null;
  setHighlightedTargetId: (id: string | null) => void;
  setHighlightedZoneId: (id: string | null) => void;
  selectAlertAndSeek: (alert: Alert) => void;
  isAllPaused: boolean;
  setIsAllPaused: (paused: boolean) => void;

  // Real-Time Computer Vision & AI Training Engine
  aiModels: AIModelRecord[];
  activeModelId: string;
  inferenceMode: 'REALTIME_CV' | 'VIDEO_SYNC';
  customFeeds: Record<string, CustomVideoSource>;
  setInferenceMode: (mode: 'REALTIME_CV' | 'VIDEO_SYNC') => void;
  setActiveModelId: (modelId: string) => void;
  setCustomFeedForCamera: (cameraId: string, source: CustomVideoSource | null) => void;
  deployModelWeights: (modelId: string, bopId: string, precision: 'FP32' | 'FP16' | 'INT8') => void;
  triggerRealtimeCVAlert: (cameraId: string, alertData: Partial<Alert>) => void;
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

  // Video-Synchronized Timeline State
  const [cameraPlaybackTimes, setCameraPlaybackTimes] = useState<Record<string, number>>({
    'CAM-01': 0,
    'CAM-02': 0,
    'CAM-03': 0,
    'CAM-04': 0,
  });
  const [cameraSeekRequests, setCameraSeekRequests] = useState<Record<string, CameraSeekRequest>>({});
  const [highlightedTargetId, setHighlightedTargetId] = useState<string | null>(null);
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null);
  const [isAllPaused, setIsAllPaused] = useState<boolean>(false);
  const seekCounterRef = useRef<number>(1);

  // AI Models & Real-Time Computer Vision State
  const [aiModels, setAiModels] = useState<AIModelRecord[]>(INITIAL_AI_MODELS);
  const [activeModelId, setActiveModelIdState] = useState<string>('yolov8x-borderguard-v3');
  const [inferenceMode, setInferenceModeState] = useState<'REALTIME_CV' | 'VIDEO_SYNC'>('REALTIME_CV');
  const [customFeeds, setCustomFeeds] = useState<Record<string, CustomVideoSource>>({});

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

  // Video-Synchronized Deterministic Seeking & Clock Control
  const seekCamera = useCallback((cameraId: string, timeSec: number, pause: boolean = false) => {
    const newId = ++seekCounterRef.current;
    setCameraSeekRequests(prev => ({
      ...prev,
      [cameraId]: { id: newId, timeSec, pause }
    }));
    setCameraPlaybackTimes(prev => {
      const next = { ...prev, [cameraId]: timeSec };
      const counts = getTargetCountsFromClocks(next);
      setMetrics(m => ({
        ...m,
        activePersons: counts.persons,
        activeVehicles: counts.vehicles,
      }));
      return next;
    });

    // Directly recompute deterministic detections and zone states at sought timestamp
    const newDets = getActiveDetectionsForCamera(cameraId, timeSec, currentTimeStr);
    const triggeredZones = getTriggeredZonesForCamera(cameraId, timeSec);

    setCameras(prevCams => prevCams.map(cam => {
      if (cam.id === cameraId) {
        const updatedZones = cam.activeZones.map(z => ({
          ...z,
          status: triggeredZones.includes(z.id) ? ('TRIGGERED' as const) : ('ACTIVE' as const)
        }));
        return {
          ...cam,
          playbackTime: timeSec,
          currentDetections: newDets,
          activeZones: updatedZones
        };
      }
      return cam;
    }));
  }, [currentTimeStr]);

  const reportCameraPlaybackTime = useCallback((cameraId: string, currentTime: number) => {
    setCameraPlaybackTimes(prev => {
      if (Math.abs((prev[cameraId] || 0) - currentTime) < 0.1) return prev;
      const next = { ...prev, [cameraId]: currentTime };
      const counts = getTargetCountsFromClocks(next);
      setMetrics(m => ({
        ...m,
        activePersons: counts.persons,
        activeVehicles: counts.vehicles,
      }));
      return next;
    });

    const newDetections = getActiveDetectionsForCamera(cameraId, currentTime, currentTimeStr);
    const triggeredZones = getTriggeredZonesForCamera(cameraId, currentTime);

    setCameras(prevCams => prevCams.map(cam => {
      if (cam.id === cameraId) {
        const updatedZones = cam.activeZones.map(z => ({
          ...z,
          status: triggeredZones.includes(z.id) ? ('TRIGGERED' as const) : ('ACTIVE' as const)
        }));
        return {
          ...cam,
          playbackTime: currentTime,
          currentDetections: newDetections,
          activeZones: updatedZones
        };
      }
      return cam;
    }));
  }, [currentTimeStr]);

  // Select alert, focus camera, seek to video timestamp, pause feed & highlight target
  const selectAlertAndSeek = useCallback((alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertDrawerOpen(true);
    setSelectedCameraId(alert.cameraId);
    setHighlightedTargetId(alert.objectId || null);
    setHighlightedZoneId(alert.zoneId || null);

    const targetTime = alert.videoTimestamp ?? 0;
    seekCamera(alert.cameraId, targetTime, true);
    playTacticalSound('click');
    logAuditAction('SEEK_ALERT_EVENT', alert.id, `Jumped to T+${targetTime.toFixed(1)}s on ${alert.cameraId} (Target: ${alert.objectId})`);
  }, [seekCamera, playTacticalSound, logAuditAction]);

  // Deterministic Telemetry Tick (Mode B: Grounded in edge pipeline metrics, no random jitter)
  useEffect(() => {
    const simInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        fpsAverage: 29.4,
        inferenceLatencyMs: 88,
        alertLatencyMs: 385,
        lastSyncTimestamp: currentTimeStr
      }));
    }, 1000);

    return () => clearInterval(simInterval);
  }, [currentTimeStr]);

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
    // Reset all video feeds to 0.0s
    ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04'].forEach(id => {
      seekCamera(id, 0.0, false);
    });
    setHighlightedTargetId(null);
    setHighlightedZoneId(null);
    setIsAllPaused(false);
    setCameraPlaybackTimes({
      'CAM-01': 0,
      'CAM-02': 0,
      'CAM-03': 0,
      'CAM-04': 0,
    });
    setCameras(INITIAL_CAMERAS.map(cam => ({
      ...cam,
      playbackTime: 0,
      currentDetections: getActiveDetectionsForCamera(cam.id, 0)
    })));
    const counts0 = getTargetCountsFromClocks({ 'CAM-01': 0, 'CAM-02': 0, 'CAM-03': 0, 'CAM-04': 0 });
    setMetrics(prev => ({
      ...prev,
      ...INITIAL_METRICS,
      activePersons: counts0.persons,
      activeVehicles: counts0.vehicles,
    }));
    setAlerts(INITIAL_ALERTS);
    setTracks(INITIAL_TRACKS);
    setPlates(INITIAL_PLATES);
    setFaces(INITIAL_FACES);
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
  }, [seekCamera, playTacticalSound, logAuditAction]);

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

  // AI Model & Real-Time Computer Vision Handlers
  const setInferenceMode = useCallback((mode: 'REALTIME_CV' | 'VIDEO_SYNC') => {
    playTacticalSound('click');
    setInferenceModeState(mode);
    logAuditAction('INFERENCE_MODE_CHANGE', `MODE:${mode}`, `Vision engine switched to ${mode}`);
  }, [playTacticalSound, logAuditAction]);

  const setActiveModelId = useCallback((modelId: string) => {
    playTacticalSound('click');
    setActiveModelIdState(modelId);
    const model = aiModels.find(m => m.id === modelId);
    logAuditAction('MODEL_SWITCH', `MODEL:${modelId}`, `Active edge vision model switched to ${model?.name || modelId}`);
  }, [aiModels, playTacticalSound, logAuditAction]);

  const setCustomFeedForCamera = useCallback((cameraId: string, source: CustomVideoSource | null) => {
    playTacticalSound('click');
    if (source) {
      setCustomFeeds(prev => ({ ...prev, [cameraId]: source }));
      setCameras(prev => prev.map(c => c.id === cameraId ? {
        ...c,
        videoUrl: source.url,
        feedUrl: source.url,
        sourceLabel: source.name,
        sourceType: source.type === 'LIVE_WEBCAM' ? 'SIMULATION' : 'RECORDED_DEMO'
      } : c));
      logAuditAction('FEED_INGESTED', cameraId, `Custom video source "${source.name}" bound to channel ${cameraId}`);
    } else {
      setCustomFeeds(prev => {
        const next = { ...prev };
        delete next[cameraId];
        return next;
      });
      // Restore default camera video
      const defaultCam = INITIAL_CAMERAS.find(c => c.id === cameraId);
      if (defaultCam) {
        setCameras(prev => prev.map(c => c.id === cameraId ? {
          ...c,
          videoUrl: defaultCam.videoUrl,
          feedUrl: defaultCam.feedUrl,
          sourceLabel: defaultCam.sourceLabel,
          sourceType: defaultCam.sourceType
        } : c));
      }
      logAuditAction('FEED_RESET', cameraId, `Restored standard border camera feed for channel ${cameraId}`);
    }
  }, [playTacticalSound, logAuditAction]);

  const deployModelWeights = useCallback((modelId: string, bopId: string, precision: 'FP32' | 'FP16' | 'INT8') => {
    playTacticalSound('breach');
    setAiModels(prev => prev.map(m => {
      if (m.id === modelId) {
        return {
          ...m,
          status: 'ACTIVE_PRODUCTION' as const,
          deployedBopNodeId: bopId,
          precision,
          lastTrainedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST'
        };
      }
      return m;
    }));
    setActiveModelIdState(modelId);
    logAuditAction('WEIGHTS_DEPLOYED', `${modelId}:${bopId}`, `Model weights deployed to edge node ${bopId} with ${precision} quantization`);
  }, [playTacticalSound, logAuditAction]);

  const triggerRealtimeCVAlert = useCallback((cameraId: string, alertData: Partial<Alert>) => {
    const cam = cameras.find(c => c.id === cameraId) || cameras[0];
    const alertId = `ALT-${Date.now()}`;
    const timestampStr = new Date().toISOString().split('T')[1].slice(0, 8) + ' IST';

    const newAlert: Alert = {
      id: alertId,
      severity: alertData.severity || 'CRITICAL',
      type: alertData.type || 'PERIMETER_BREACH',
      status: 'NEW',
      cameraId: cam.id,
      cameraName: cam.name,
      zoneId: alertData.zoneId || 'ZONE-STERILE',
      zoneName: alertData.zoneName || 'STERILE PERIMETER BUFFER',
      objectId: alertData.objectId || 'INTRUDER-REALTIME',
      objectClass: alertData.objectClass || 'person',
      confidence: alertData.confidence || 0.94,
      timestamp: timestampStr,
      videoTimestamp: cameraPlaybackTimes[cameraId] || 0,
      description: alertData.description || `Real-time CV detected sterile perimeter intrusion on channel ${cam.id}`,
      acknowledged: false,
      direction: 'ENTRY',
      threatBreakdown: alertData.threatBreakdown || {
        score: 88,
        level: 'CRITICAL',
        factors: [
          { name: 'REALTIME STERILE ZONE PENETRATION', weight: 45, description: 'Live CV confirmed entry into restricted polygon' },
          { name: 'TARGET VELOCITY VECTOR', weight: 25, description: 'Direct heading towards international border line' },
          { name: 'YOLOV8x CONFIDENCE > 90%', weight: 18, description: 'High-confidence bounding box match' }
        ],
        reason: 'Real-time video analytics confirmed rapid unauthorized crossing of the zero-tolerance buffer line.'
      }
    };

    playTacticalSound('alert');
    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlert(newAlert);
    setIsAlertDrawerOpen(true);
    setSelectedCameraId(cam.id);

    // Create evidence item
    const evidenceId = `EVD-${Date.now()}`;
    const newEvidence: Evidence = {
      id: evidenceId,
      eventId: alertId,
      alertId: alertId,
      alertType: newAlert.type,
      severity: newAlert.severity,
      timestamp: timestampStr,
      videoTimestamp: cameraPlaybackTimes[cameraId] || 0,
      cameraId: cam.id,
      cameraName: cam.name,
      zoneName: newAlert.zoneName || 'RESTRICTED AREA',
      objectId: newAlert.objectId,
      confidence: newAlert.confidence,
      frameUrl: cam.feedUrl,
      cryptographicHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      digitalSignature: 'ED25519-SIG-BOP17-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      retainedUntil: '2026-10-18',
      integrityVerified: true,
      chainOfCustody: [
        { actor: 'YOLOv8x Edge Real-time Core', action: 'EVIDENCE_INGESTED', timestamp: timestampStr }
      ]
    };
    setEvidence(prev => [newEvidence, ...prev]);
    logAuditAction('REALTIME_ALERT_FIRED', alertId, `Real-time alert triggered on camera ${cameraId} by AI vision engine`);
  }, [cameras, cameraPlaybackTimes, playTacticalSound, logAuditAction]);

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
        cameraPlaybackTimes,
        reportCameraPlaybackTime,
        timelineEvents: VIDEO_TIMELINE_EVENTS,
        cameraSeekRequests,
        seekCamera,
        highlightedTargetId,
        highlightedZoneId,
        setHighlightedTargetId,
        setHighlightedZoneId,
        selectAlertAndSeek,
        isAllPaused,
        setIsAllPaused,
        aiModels,
        activeModelId,
        inferenceMode,
        customFeeds,
        setInferenceMode,
        setActiveModelId,
        setCustomFeedForCamera,
        deployModelWeights,
        triggerRealtimeCVAlert,
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
