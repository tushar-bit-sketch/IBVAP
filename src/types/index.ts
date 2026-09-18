// ============================================================================
// IBVAP — INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM
// SIH26187 — DOMAIN ARCHITECTURE & TYPE SYSTEM
// ============================================================================

// ----------------------------------------------------------------------------
// 1. Core Enumerations & Literals
// ----------------------------------------------------------------------------

export type DetectionClass = 'person' | 'vehicle' | 'truck' | 'motorcycle' | 'face';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AlertType = 
  | 'INTRUSION' 
  | 'LOITERING' 
  | 'WATCHLIST_MATCH' 
  | 'UNAUTHORIZED_VEHICLE' 
  | 'CROWD_FORMATION' 
  | 'PERIMETER_BREACH'
  | 'LINE_CROSSING'
  | 'CAMERA_TAMPER'
  | 'ABANDONED_OBJECT'
  | 'RAPID_MOVEMENT'
  | 'ANPR_DETECTED'
  | 'ZONE_INTRUSION';

export type IncidentStatus = 
  | 'NEW' 
  | 'ACKNOWLEDGED' 
  | 'INVESTIGATING' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'FALSE_POSITIVE' 
  | 'ARCHIVED';

export type NodeStatus = 'ONLINE' | 'WARNING' | 'ALERT' | 'OFFLINE';

export type NetworkMode = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export type ZoneType = 'BORDER FENCE' | 'RESTRICTED AREA' | 'PATROL CORRIDOR' | 'BUFFER ZONE';

export type CameraStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';

export type AIModelStatus = 'OPTIMAL' | 'DEGRADED' | 'OFFLINE';

export type CameraFeedType = 'OPTICAL' | 'THERMAL_IR' | 'ANPR_MACRO' | 'PERIMETER_WIDE';

export type OpticalSpectrum = 'OPT' | 'FLIR' | 'NVG';

export type Role = 'SUPER_ADMIN' | 'COMMANDER' | 'OPERATOR' | 'ANALYST' | 'AUDITOR';

export type Permission = 
  | 'VIEW_CAMERA'
  | 'CONTROL_CAMERA'
  | 'VIEW_ALERT'
  | 'ACK_ALERT'
  | 'RESOLVE_ALERT'
  | 'MANAGE_ZONES'
  | 'VIEW_EVIDENCE'
  | 'EXPORT_EVIDENCE'
  | 'MANAGE_USERS'
  | 'VIEW_AUDIT'
  | 'MANAGE_SYSTEM';

// ----------------------------------------------------------------------------
// 2. Detection Domain
// ----------------------------------------------------------------------------

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w: number; // percentage 0-100
  h: number; // percentage 0-100
}

export interface Detection {
  id: string;
  trackingId: string;
  class: DetectionClass;
  confidence: number;
  bbox: BoundingBox;
  timestamp: string;
  cameraId: string;
  zone?: string;
  speedKmh?: number;
  loiterSeconds?: number;
  worldX?: number; // 0-100 normalized coordinate
  worldY?: number;
}

// ----------------------------------------------------------------------------
// 3. Tracking & Re-Identification Domain
// ----------------------------------------------------------------------------

export interface TrajectoryPoint {
  x: number;
  y: number;
  timestamp: string;
  speedKmh?: number;
}

export interface CrossCameraWaypoint {
  timestamp: string;
  cameraId: string;
  cameraName: string;
  location: string;
  event: string;
  dwellSeconds?: number;
}

export interface TrackedObject {
  trackingId: string;
  class: DetectionClass;
  firstSeen: string;
  lastSeen: string;
  trajectory: TrajectoryPoint[];
  currentCameraId: string;
  currentZone: string;
  confidence: number;
  status: 'ACTIVE' | 'LOST' | 'ANOMALOUS';
  anomalies: string[];
  crossCameraPath: CrossCameraWaypoint[];
  speedKmh: number;
  dwellSeconds: number;
  threatScore: number;
}

// ----------------------------------------------------------------------------
// 4. Intelligence & Explainable Threat Scoring
// ----------------------------------------------------------------------------

export interface ThreatFactor {
  name: string;
  weight: number;
  description: string;
}

export interface ThreatScoreBreakdown {
  score: number; // 0 - 100
  level: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  factors: ThreatFactor[];
  reason: string;
}

// ----------------------------------------------------------------------------
// 5. ANPR & Vehicle Intelligence Domain
// ----------------------------------------------------------------------------

export interface LicensePlate {
  id: string;
  plateNumber: string;
  vehicleType: 'TRUCK' | 'CAR' | 'BUS' | 'MOTORCYCLE';
  confidence: number;
  ocrConfidence: number;
  formatValid: boolean;
  status: 'NORMAL' | 'FLAGGED' | 'WATCHLIST' | 'REVIEW';
  cameraId: string;
  timestamp: string;
  cropUrl?: string;
  direction: 'INBOUND' | 'OUTBOUND';
  speedKmh: number;
  characterConfidences?: { char: string; confidence: number }[];
  watchlistMatchReason?: string;
}

// ----------------------------------------------------------------------------
// 6. Face & Biometric Intelligence Domain
// ----------------------------------------------------------------------------

export interface FaceMatch {
  id: string;
  databaseId: string;
  subjectName: string;
  matchScore: number;
  threshold: number;
  watchlistStatus: 'WATCHLIST MATCH' | 'CLEAR' | 'UNDER_REVIEW';
  status: 'SIMULATED TEST IDENTITY';
  cameraId: string;
  timestamp: string;
  snapshotUrl: string;
  notes?: string;
  embeddingHexSample?: string;
}

// ----------------------------------------------------------------------------
// 7. Zone Domain
// ----------------------------------------------------------------------------

export interface PolygonPoint {
  x: number;
  y: number;
}

export interface ZoneRule {
  allowedClasses: DetectionClass[];
  dwellThresholdSeconds?: number;
  speedThresholdKmh?: number;
  directionFilter?: 'ENTRY' | 'EXIT' | 'BOTH';
  alertSeverity: AlertSeverity;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  cameraId: string;
  points: PolygonPoint[];
  status: 'ACTIVE' | 'TRIGGERED' | 'DISABLED';
  color?: string;
  allowedClasses?: DetectionClass[];
  sensitivity: number;
  rule?: ZoneRule;
}

// ----------------------------------------------------------------------------
// 8. Alert & Incident Domain
// ----------------------------------------------------------------------------

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  status: IncidentStatus;
  cameraId: string;
  cameraName: string;
  zoneId?: string;
  zoneName?: string;
  objectId: string;
  objectClass: DetectionClass;
  confidence: number;
  timestamp: string;
  videoTimestamp?: number;
  description: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  snapshotUrl?: string;
  direction?: 'ENTRY' | 'EXIT' | 'STATIONARY' | string;
  threatBreakdown: ThreatScoreBreakdown;
  metadata?: Record<string, string | number | boolean>;
  relatedCameraIds?: string[];
  evidenceId?: string;
}

// ----------------------------------------------------------------------------
// 9. Camera Domain
// ----------------------------------------------------------------------------

export interface StreamHealthMetrics {
  fps: number;
  targetFps: number;
  latencyMs: number;
  jitterMs: number;
  packetLossPercent: number;
  bitrateKbps: number;
  gpuUtilization: number;
  cpuUtilization: number;
  temperatureC: number;
  queueDepth: number;
  decoderState: 'HARDWARE' | 'SOFTWARE' | 'DEGRADED';
}

export interface Camera {
  id: string;
  name: string;
  sector: string;
  rtspUrl: string;
  resolution: string;
  fps: number;
  targetFps: number;
  status: CameraStatus;
  aiStatus: AIModelStatus;
  feedType: CameraFeedType;
  feedUrl: string;
  videoUrl?: string;
  sourceType?: 'RECORDED_DEMO' | 'LIVE_RTSP' | 'SIMULATION';
  sourceLabel?: string;
  playbackTime?: number;
  duration?: number;
  model: string;
  currentDetections: Detection[];
  activeZones: Zone[];
  lastIncident?: string;
  streamHealth: StreamHealthMetrics;
  ptzSupport: boolean;
  edgeNodeId: string;
}

// ----------------------------------------------------------------------------
// 9b. Video-Synchronized Event Domain
// ----------------------------------------------------------------------------

export type VideoSimulationEventType = 
  | 'PERSON_DETECTED'
  | 'PERSON_TRACKED'
  | 'VEHICLE_DETECTED'
  | 'VEHICLE_TRACKED'
  | 'ZONE_ENTRY'
  | 'PERIMETER_BREACH'
  | 'ANPR_DETECTED'
  | 'INCIDENT_CREATED'
  | 'ALERT_TRIGGERED'
  | 'LOITERING';

export interface VideoSyncEvent {
  id: string;
  cameraId: string;
  timestampSec: number;
  eventType: VideoSimulationEventType;
  payload: {
    trackingId?: string;
    class?: DetectionClass;
    confidence?: number;
    bbox?: BoundingBox;
    zone?: string;
    speedKmh?: number;
    details?: string;
    plateNumber?: string;
    severity?: AlertSeverity;
  };
}

export interface TrajectoryKeyframe {
  time: number; // seconds
  x: number; // 0 - 1 normalized horizontal
  y: number; // 0 - 1 normalized vertical
  w: number; // 0 - 1 normalized width
  h: number; // 0 - 1 normalized height
  confidence: number;
  speedKmh?: number;
}

export interface ScenarioTarget {
  id: string; // e.g. "P-01", "V-01"
  type: DetectionClass;
  label: string;
  appearance: {
    startTime: number;
    endTime: number;
  };
  trajectory: TrajectoryKeyframe[];
}

export interface ScenarioEvent {
  id: string;
  timestamp: number; // video seconds
  eventType: VideoSimulationEventType;
  targetId: string;
  cameraId: string;
  zoneId?: string;
  zoneName?: string;
  severity?: AlertSeverity;
  details: string;
  alert?: Partial<Alert>;
  evidence?: Partial<Evidence>;
}

export interface CameraScenario {
  cameraId: string;
  videoSource: string;
  duration: number;
  targets: ScenarioTarget[];
  events: ScenarioEvent[];
  zones: Zone[];
}

export interface CameraSeekRequest {
  id: number;
  timeSec: number;
  pause?: boolean;
}

// ----------------------------------------------------------------------------
// 10. Evidence & Chain of Custody Domain
// ----------------------------------------------------------------------------

export interface ChainOfCustodyRecord {
  actor: string;
  action: string;
  timestamp: string;
  notes?: string;
}

export interface Evidence {
  id: string;
  eventId: string;
  incidentId?: string;
  alertId?: string;
  alertType: AlertType;
  severity: AlertSeverity;
  timestamp: string;
  videoTimestamp?: number;
  cameraId: string;
  cameraName: string;
  zoneName: string;
  objectId: string;
  confidence: number;
  frameUrl: string;
  mediaUrl?: string;
  mediaType?: string;
  fileHash?: string;
  durationSeconds?: number;
  sizeMb?: number;
  notes?: string;
  status?: string;
  cryptographicHash: string; // SHA-256 integrity simulation
  digitalSignature: string; // ED25519-SIG simulation
  retainedUntil: string;
  integrityVerified: boolean;
  chainOfCustody: ChainOfCustodyRecord[];
  preBufferFrames?: number;
  postBufferFrames?: number;
  manifestUrl?: string;
}

// ----------------------------------------------------------------------------
// 11. Infrastructure, Edge Node & Sync Domain
// ----------------------------------------------------------------------------

export interface EdgeNodeTelemetry {
  id: string;
  name: string;
  bopId: string;
  bopCode: string;
  cpuLoadPercent: number;
  gpuLoadPercent: number;
  ramUsageGb: number;
  ramTotalGb: number;
  vramUsageGb: number;
  vramTotalGb: number;
  temperatureC: number;
  activeStreams: number;
  inferenceQueueDepth: number;
  uptimeHours: number;
  redisStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  postgresStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  networkMode: NetworkMode;
  pendingSyncCount: number;
  lastSyncTimestamp: string;
}

export interface BOPNode {
  id: string;
  code: string;
  name: string;
  sector: string;
  coordinates: { lat: number; lng: number };
  status: NodeStatus;
  cameraCount: number;
  activeAlerts: number;
  edgeLoad: number; // percentage
  lastSync: string;
  threatLevel: 'LOW' | 'ELEVATED' | 'CRITICAL';
}

export interface SystemMetrics {
  activeCameras: number;
  totalCameras: number;
  fpsAverage: number;
  inferenceLatencyMs: number;
  alertLatencyMs: number;
  uptimePercentage: number;
  activePersons: number;
  activeVehicles: number;
  activeFaces: number;
  activeAlerts: number;
  edgeNodeStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  networkMode: NetworkMode;
  pendingSyncEvents: number;
  lastSyncTimestamp: string;
  systemHealth: 'NOMINAL' | 'ELEVATED_THREAT' | 'WARNING';
}

export interface SystemDiagnostics {
  apiLatencyMs: number;
  wsLatencyMs: number;
  eventThroughputPerSec: number;
  queueDepth: number;
  inferenceLatencyMs: number;
  dbLatencyMs: number;
  redisHealth: 'OPTIMAL' | 'DEGRADED';
  edgeSyncStatus: 'SYNCHRONIZED' | 'SYNCING' | 'OFFLINE_QUEUED';
  errorRatePercent: number;
  connectedClients: number;
  lastHeartbeat: string;
}

// ----------------------------------------------------------------------------
// 12. Operator, RBAC & Audit Domain
// ----------------------------------------------------------------------------

export interface UserSession {
  userId: string;
  username: string;
  fullName: string;
  role: Role;
  permissions: Permission[];
  callsign: string;
  station: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  details: string;
  ipAddress: string;
}

// ----------------------------------------------------------------------------
// 13. Operational Scenario Engine & Jury Demo
// ----------------------------------------------------------------------------

export type ScenarioId = 
  | '01_NORMAL_OPERATIONS'
  | '02_PERIMETER_BREACH'
  | '03_NIGHT_MOVEMENT'
  | '04_LOITERING'
  | '05_VEHICLE_WATCHLIST'
  | '06_FACE_WATCHLIST'
  | '07_MULTI_CAMERA_TRACK'
  | '08_CAMERA_TAMPER'
  | '09_COMMUNICATION_LOSS'
  | '10_EDGE_NODE_DEGRADED'
  | '11_MASS_ACTIVITY'
  | '12_FALSE_POSITIVE_REVIEW'
  | '13_SENSOR_DISAGREEMENT'
  | '14_MULTI_EVENT_INCIDENT';

export interface ScenarioDefinition {
  id: ScenarioId;
  name: string;
  category: 'PERIMETER' | 'WATCHLIST' | 'ANOMALY' | 'SYSTEM_FAIL';
  description: string;
  initialAlertCount: number;
  targetCameraId: string;
  targetEntityId: string;
}

export interface JuryDemoStep {
  stepIndex: number;
  title: string;
  description: string;
  durationMs: number;
  cameraFocus: string;
  highlightedEntity?: string;
  actionRequired?: string;
}

// ----------------------------------------------------------------------------
// 14. Analytics Domain
// ----------------------------------------------------------------------------

export interface AnalyticsDataPoint {
  time: string;
  detections: number;
  alerts: number;
  fps: number;
  inferenceMs: number;
  persons: number;
  vehicles: number;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'DAILY_SUMMARY' | 'INCIDENT_DOSSIER' | 'ANPR_WATCHLIST' | 'CAMERA_HEALTH';
  generatedAt: string;
  generatedBy: string;
  sector: string;
  eventCount: number;
  integrityHash: string;
  classification: string;
}
