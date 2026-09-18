import { 
  Camera, 
  Alert, 
  Zone, 
  LicensePlate, 
  FaceMatch, 
  BOPNode, 
  Evidence, 
  SystemMetrics,
  AnalyticsDataPoint,
  TrackedObject,
  EdgeNodeTelemetry,
  ScenarioDefinition,
  JuryDemoStep,
  AuditLogEntry,
  SystemDiagnostics,
  ReportItem,
  VideoSyncEvent
} from '../types';

// ============================================================================
// 1. INITIAL CAMERAS WITH STREAM HEALTH & PTZ
// ============================================================================

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'CAM-01',
    name: 'BORDER FENCE NORTH',
    sector: 'SECTOR-01 / NORTH',
    rtspUrl: 'rtsp://edge-node-01.bop17.internal:554/live/cam01_main',
    resolution: '1920x1080',
    fps: 28.8,
    targetFps: 30,
    status: 'ONLINE',
    aiStatus: 'OPTIMAL',
    feedType: 'OPTICAL',
    feedUrl: '/simulations/cam-01-footage.mp4',
    videoUrl: '/simulations/cam-01-footage.mp4',
    sourceType: 'RECORDED_DEMO',
    sourceLabel: 'RECORDED FEED // PERIMETER FOOTAGE',
    playbackTime: 0,
    duration: 10.01,
    model: 'YOLOv8x + DeepSORT v2.1',
    lastIncident: '14:30:45 IST',
    ptzSupport: true,
    edgeNodeId: 'edge-node-01',
    streamHealth: {
      fps: 28.8,
      targetFps: 30,
      latencyMs: 94,
      jitterMs: 4.2,
      packetLossPercent: 0.08,
      bitrateKbps: 4096,
      gpuUtilization: 68,
      cpuUtilization: 42,
      temperatureC: 61,
      queueDepth: 2,
      decoderState: 'HARDWARE'
    },
    currentDetections: [
      {
        id: 'det-101',
        trackingId: 'PERSON-042',
        class: 'person',
        confidence: 0.94,
        bbox: { x: 42, y: 38, w: 12, h: 28 },
        timestamp: '14:32:08 IST',
        cameraId: 'CAM-01',
        zone: 'BORDER FENCE 01',
        speedKmh: 4.2,
        loiterSeconds: 65,
        worldX: 45.2,
        worldY: 62.1
      },
      {
        id: 'det-102',
        trackingId: 'PERSON-017',
        class: 'person',
        confidence: 0.89,
        bbox: { x: 74, y: 52, w: 9, h: 22 },
        timestamp: '14:32:05 IST',
        cameraId: 'CAM-01',
        zone: 'RESTRICTED BUFFER',
        speedKmh: 2.1,
        worldX: 72.8,
        worldY: 54.0
      }
    ],
    activeZones: [
      {
        id: 'zone-01',
        name: 'BORDER FENCE 01',
        type: 'BORDER FENCE',
        cameraId: 'CAM-01',
        status: 'TRIGGERED',
        sensitivity: 0.95,
        points: [
          { x: 10, y: 65 },
          { x: 90, y: 65 },
          { x: 85, y: 88 },
          { x: 15, y: 88 }
        ],
        rule: {
          allowedClasses: [],
          dwellThresholdSeconds: 0,
          directionFilter: 'ENTRY',
          alertSeverity: 'CRITICAL'
        }
      },
      {
        id: 'zone-02',
        name: 'RESTRICTED BUFFER',
        type: 'RESTRICTED AREA',
        cameraId: 'CAM-01',
        status: 'ACTIVE',
        sensitivity: 0.90,
        points: [
          { x: 30, y: 25 },
          { x: 70, y: 25 },
          { x: 65, y: 55 },
          { x: 35, y: 55 }
        ],
        rule: {
          allowedClasses: ['person'],
          dwellThresholdSeconds: 45,
          alertSeverity: 'HIGH'
        }
      }
    ]
  },
  {
    id: 'CAM-02',
    name: 'BORDER FENCE EAST (THERMAL)',
    sector: 'SECTOR-02 / EAST',
    rtspUrl: 'rtsp://edge-node-01.bop17.internal:554/live/cam02_flir',
    resolution: '1920x1080',
    fps: 29.2,
    targetFps: 30,
    status: 'ONLINE',
    aiStatus: 'OPTIMAL',
    feedType: 'THERMAL_IR',
    feedUrl: '/simulations/cam-02-footage.mp4',
    videoUrl: '/simulations/cam-02-footage.mp4',
    sourceType: 'RECORDED_DEMO',
    sourceLabel: 'RECORDED FEED // THERMAL IR FOOTAGE',
    playbackTime: 0,
    duration: 10.01,
    model: 'YOLOv8-Thermal-v4 + FilterCore',
    lastIncident: '13:45:10 IST',
    ptzSupport: true,
    edgeNodeId: 'edge-node-01',
    streamHealth: {
      fps: 29.2,
      targetFps: 30,
      latencyMs: 88,
      jitterMs: 3.1,
      packetLossPercent: 0.02,
      bitrateKbps: 3840,
      gpuUtilization: 54,
      cpuUtilization: 38,
      temperatureC: 59,
      queueDepth: 1,
      decoderState: 'HARDWARE'
    },
    currentDetections: [
      {
        id: 'det-201',
        trackingId: 'PERSON-088',
        class: 'person',
        confidence: 0.91,
        bbox: { x: 55, y: 44, w: 8, h: 20 },
        timestamp: '14:31:55 IST',
        cameraId: 'CAM-02',
        zone: 'EAST PERIMETER',
        speedKmh: 1.8,
        worldX: 58.0,
        worldY: 46.2
      }
    ],
    activeZones: [
      {
        id: 'zone-03',
        name: 'EAST PERIMETER',
        type: 'BORDER FENCE',
        cameraId: 'CAM-02',
        status: 'ACTIVE',
        sensitivity: 0.92,
        points: [
          { x: 15, y: 40 },
          { x: 85, y: 45 },
          { x: 80, y: 85 },
          { x: 10, y: 80 }
        ],
        rule: {
          allowedClasses: [],
          directionFilter: 'ENTRY',
          alertSeverity: 'CRITICAL'
        }
      }
    ]
  },
  {
    id: 'CAM-03',
    name: 'CHECKPOINT ALPHA',
    sector: 'SECTOR-03 / CHECKPOINT',
    rtspUrl: 'rtsp://edge-node-01.bop17.internal:554/live/cam03_anpr',
    resolution: '1920x1080',
    fps: 28.4,
    targetFps: 30,
    status: 'ONLINE',
    aiStatus: 'OPTIMAL',
    feedType: 'ANPR_MACRO',
    feedUrl: '/simulations/cam-03-footage.mp4',
    videoUrl: '/simulations/cam-03-footage.mp4',
    sourceType: 'RECORDED_DEMO',
    sourceLabel: 'RECORDED FEED // CHECKPOINT VEHICLE FOOTAGE',
    playbackTime: 0,
    duration: 10.01,
    model: 'YOLOv8-Vehicle + LPRNet-v3 + FaceNet',
    lastIncident: '14:28:12 IST',
    ptzSupport: false,
    edgeNodeId: 'edge-node-01',
    streamHealth: {
      fps: 28.4,
      targetFps: 30,
      latencyMs: 102,
      jitterMs: 6.8,
      packetLossPercent: 0.12,
      bitrateKbps: 4400,
      gpuUtilization: 74,
      cpuUtilization: 49,
      temperatureC: 64,
      queueDepth: 3,
      decoderState: 'HARDWARE'
    },
    currentDetections: [
      {
        id: 'det-301',
        trackingId: 'VEHICLE-031',
        class: 'truck',
        confidence: 0.89,
        bbox: { x: 28, y: 40, w: 42, h: 42 },
        timestamp: '14:32:02 IST',
        cameraId: 'CAM-03',
        speedKmh: 18.5,
        worldX: 34.0,
        worldY: 60.0
      },
      {
        id: 'det-302',
        trackingId: 'PERSON-053',
        class: 'person',
        confidence: 0.93,
        bbox: { x: 76, y: 48, w: 10, h: 26 },
        timestamp: '14:32:00 IST',
        cameraId: 'CAM-03',
        speedKmh: 0.0,
        worldX: 78.5,
        worldY: 52.0
      }
    ],
    activeZones: [
      {
        id: 'zone-04',
        name: 'INSPECTION BAY',
        type: 'RESTRICTED AREA',
        cameraId: 'CAM-03',
        status: 'ACTIVE',
        sensitivity: 0.88,
        points: [
          { x: 20, y: 35 },
          { x: 75, y: 35 },
          { x: 80, y: 85 },
          { x: 15, y: 85 }
        ],
        rule: {
          allowedClasses: ['truck', 'vehicle', 'person'],
          dwellThresholdSeconds: 120,
          alertSeverity: 'HIGH'
        }
      }
    ]
  },
  {
    id: 'CAM-04',
    name: 'PATROL CORRIDOR SOUTH',
    sector: 'SECTOR-04 / PATROL',
    rtspUrl: 'rtsp://edge-node-01.bop17.internal:554/live/cam04_mast',
    resolution: '1920x1080',
    fps: 29.1,
    targetFps: 30,
    status: 'ONLINE',
    aiStatus: 'OPTIMAL',
    feedType: 'PERIMETER_WIDE',
    feedUrl: '/simulations/cam-04-footage.mp4',
    videoUrl: '/simulations/cam-04-footage.mp4',
    sourceType: 'RECORDED_DEMO',
    sourceLabel: 'RECORDED FEED // WIDE PERIMETER FOOTAGE',
    playbackTime: 0,
    duration: 10.01,
    model: 'YOLOv8x + AnomalyNet v1.9',
    lastIncident: '14:15:33 IST',
    ptzSupport: true,
    edgeNodeId: 'edge-node-01',
    streamHealth: {
      fps: 29.1,
      targetFps: 30,
      latencyMs: 91,
      jitterMs: 3.8,
      packetLossPercent: 0.04,
      bitrateKbps: 3950,
      gpuUtilization: 58,
      cpuUtilization: 39,
      temperatureC: 60,
      queueDepth: 1,
      decoderState: 'HARDWARE'
    },
    currentDetections: [
      {
        id: 'det-401',
        trackingId: 'PERSON-099',
        class: 'person',
        confidence: 0.87,
        bbox: { x: 38, y: 50, w: 8, h: 20 },
        timestamp: '14:32:07 IST',
        cameraId: 'CAM-04',
        zone: 'PATROL RUNWAY',
        speedKmh: 3.4,
        loiterSeconds: 18,
        worldX: 40.0,
        worldY: 65.0
      }
    ],
    activeZones: [
      {
        id: 'zone-05',
        name: 'PATROL RUNWAY',
        type: 'PATROL CORRIDOR',
        cameraId: 'CAM-04',
        status: 'ACTIVE',
        sensitivity: 0.85,
        points: [
          { x: 10, y: 50 },
          { x: 90, y: 50 },
          { x: 85, y: 92 },
          { x: 15, y: 92 }
        ],
        rule: {
          allowedClasses: ['person', 'vehicle'],
          dwellThresholdSeconds: 60,
          alertSeverity: 'MEDIUM'
        }
      }
    ]
  }
];

// ============================================================================
// 1b. VIDEO SYNCHRONIZATION TIMELINE EVENTS
// ============================================================================

export const VIDEO_TIMELINE_EVENTS: VideoSyncEvent[] = [
  // CAM-01: Perimeter Fence North (10.01s surveillance loop)
  {
    id: 'evt-cam01-01',
    cameraId: 'CAM-01',
    timestampSec: 1.2,
    eventType: 'PERSON_DETECTED',
    payload: { trackingId: 'PERSON-042', class: 'person', confidence: 0.92, bbox: { x: 42, y: 38, w: 12, h: 28 }, zone: 'BORDER FENCE 01' }
  },
  {
    id: 'evt-cam01-02',
    cameraId: 'CAM-01',
    timestampSec: 3.5,
    eventType: 'PERSON_TRACKED',
    payload: { trackingId: 'PERSON-042', class: 'person', confidence: 0.94, bbox: { x: 44, y: 40, w: 12, h: 28 }, speedKmh: 4.2 }
  },
  {
    id: 'evt-cam01-03',
    cameraId: 'CAM-01',
    timestampSec: 5.8,
    eventType: 'ZONE_ENTRY',
    payload: { trackingId: 'PERSON-042', class: 'person', zone: 'BORDER FENCE 01', confidence: 0.96 }
  },
  {
    id: 'evt-cam01-04',
    cameraId: 'CAM-01',
    timestampSec: 7.0,
    eventType: 'PERIMETER_BREACH',
    payload: { trackingId: 'PERSON-042', class: 'person', zone: 'BORDER FENCE 01', severity: 'CRITICAL', details: 'Tripwire crossed on Northern barrier' }
  },
  {
    id: 'evt-cam01-05',
    cameraId: 'CAM-01',
    timestampSec: 7.2,
    eventType: 'ALERT_TRIGGERED',
    payload: { trackingId: 'PERSON-042', zone: 'BORDER FENCE 01', severity: 'CRITICAL', details: 'Automated perimeter breach alert generated' }
  },
  {
    id: 'evt-cam01-06',
    cameraId: 'CAM-01',
    timestampSec: 7.5,
    eventType: 'INCIDENT_CREATED',
    payload: { trackingId: 'PERSON-042', zone: 'BORDER FENCE 01', severity: 'CRITICAL', details: 'Incident INC-8821 opened for interdiction team' }
  },

  // CAM-02: Thermal Multi-Person Feed (10.01s loop)
  {
    id: 'evt-cam02-01',
    cameraId: 'CAM-02',
    timestampSec: 0.8,
    eventType: 'PERSON_DETECTED',
    payload: { trackingId: 'PERSON-088', class: 'person', confidence: 0.89, bbox: { x: 55, y: 44, w: 8, h: 20 }, zone: 'EAST PERIMETER' }
  },
  {
    id: 'evt-cam02-02',
    cameraId: 'CAM-02',
    timestampSec: 3.8,
    eventType: 'PERSON_TRACKED',
    payload: { trackingId: 'PERSON-088', class: 'person', confidence: 0.91, bbox: { x: 57, y: 46, w: 8, h: 20 }, speedKmh: 1.8 }
  },
  {
    id: 'evt-cam02-03',
    cameraId: 'CAM-02',
    timestampSec: 6.9,
    eventType: 'ZONE_ENTRY',
    payload: { trackingId: 'PERSON-088', class: 'person', zone: 'EAST PERIMETER', confidence: 0.93 }
  },

  // CAM-03: Checkpoint Alpha Road / Vehicle Feed (10.01s loop)
  {
    id: 'evt-cam03-01',
    cameraId: 'CAM-03',
    timestampSec: 1.0,
    eventType: 'VEHICLE_DETECTED',
    payload: { trackingId: 'VEHICLE-031', class: 'truck', confidence: 0.91, bbox: { x: 28, y: 40, w: 42, h: 42 }, speedKmh: 18.5 }
  },
  {
    id: 'evt-cam03-02',
    cameraId: 'CAM-03',
    timestampSec: 3.2,
    eventType: 'VEHICLE_TRACKED',
    payload: { trackingId: 'VEHICLE-031', class: 'truck', confidence: 0.93, bbox: { x: 30, y: 42, w: 42, h: 42 }, speedKmh: 16.0 }
  },
  {
    id: 'evt-cam03-03',
    cameraId: 'CAM-03',
    timestampSec: 5.1,
    eventType: 'ANPR_DETECTED',
    payload: { trackingId: 'VEHICLE-031', plateNumber: 'PB-08-BT-4921', confidence: 0.97, details: 'Heavy commercial carrier recognized' }
  },
  {
    id: 'evt-cam03-04',
    cameraId: 'CAM-03',
    timestampSec: 7.8,
    eventType: 'ZONE_ENTRY',
    payload: { trackingId: 'VEHICLE-031', zone: 'INSPECTION BAY', confidence: 0.95 }
  },

  // CAM-04: Wide Perimeter / Patrol Corridor (10.01s loop)
  {
    id: 'evt-cam04-01',
    cameraId: 'CAM-04',
    timestampSec: 1.4,
    eventType: 'PERSON_DETECTED',
    payload: { trackingId: 'PERSON-099', class: 'person', confidence: 0.88, bbox: { x: 38, y: 50, w: 8, h: 20 }, zone: 'PATROL RUNWAY' }
  },
  {
    id: 'evt-cam04-02',
    cameraId: 'CAM-04',
    timestampSec: 4.6,
    eventType: 'PERSON_TRACKED',
    payload: { trackingId: 'PERSON-099', class: 'person', confidence: 0.90, bbox: { x: 40, y: 52, w: 8, h: 20 }, speedKmh: 3.4 }
  },
  {
    id: 'evt-cam04-03',
    cameraId: 'CAM-04',
    timestampSec: 7.6,
    eventType: 'ZONE_ENTRY',
    payload: { trackingId: 'PERSON-099', zone: 'PATROL RUNWAY', confidence: 0.92 }
  }
];

// ============================================================================
// 2. EXPLAINABLE ALERTS WITH THREAT FACTOR BREAKDOWNS
// ============================================================================

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALERT-001',
    severity: 'CRITICAL',
    type: 'PERIMETER_BREACH',
    status: 'NEW',
    cameraId: 'CAM-01',
    cameraName: 'BORDER FENCE NORTH',
    zoneId: 'zone-01',
    zoneName: 'BORDER FENCE 01',
    objectId: 'PERSON-042',
    objectClass: 'person',
    confidence: 0.94,
    timestamp: '14:30:45 IST',
    direction: 'ENTRY',
    description: 'Tripwire trigger: Subject crossed primary perimeter boundary polygon into buffer zone.',
    acknowledged: false,
    snapshotUrl: 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=800&q=80',
    relatedCameraIds: ['CAM-01', 'CAM-02'],
    evidenceId: 'EVD-2025-001',
    threatBreakdown: {
      score: 87,
      level: 'CRITICAL',
      factors: [
        { name: 'PERIMETER CROSSING', weight: 35, description: 'Subject crossed virtual fence tripwire' },
        { name: 'RESTRICTED ZONE ENTRY', weight: 20, description: 'Entry vector detected towards border buffer' },
        { name: 'LOITERING ANOMALY', weight: 12, description: 'Stationary dwell exceeded 60s baseline' },
        { name: 'CROSS-CAMERA CONTINUITY', weight: 10, description: 'Track validated from CAM-01 corridor' },
        { name: 'HIGH DETECTION CONFIDENCE', weight: 10, description: 'YOLOv8x certainty 94.2%' }
      ],
      reason: 'Subject entered restricted polygon and remained stationary beyond configured threshold with inbound trajectory.'
    },
    metadata: {
      dwellTime: '65s',
      vector: 'NW -> SE',
      speed: '4.2 km/h'
    }
  },
  {
    id: 'ALERT-002',
    severity: 'HIGH',
    type: 'WATCHLIST_MATCH',
    status: 'NEW',
    cameraId: 'CAM-03',
    cameraName: 'CHECKPOINT ALPHA',
    zoneId: 'zone-04',
    zoneName: 'INSPECTION BAY',
    objectId: 'PERSON-053',
    objectClass: 'person',
    confidence: 0.91,
    timestamp: '14:28:12 IST',
    description: 'Simulated watchlist hit for synthetic record DEMO-042. Biometric facial match exceeds 90% threshold.',
    acknowledged: false,
    snapshotUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    relatedCameraIds: ['CAM-03'],
    evidenceId: 'EVD-2025-002',
    threatBreakdown: {
      score: 78,
      level: 'HIGH',
      factors: [
        { name: 'WATCHLIST HIT', weight: 45, description: 'ArcFace embedding distance < 0.15' },
        { name: 'CRITICAL CHECKPOINT ENTRY', weight: 15, description: 'Subject at vehicle inspection barrier' },
        { name: 'HIGH BIOMETRIC CONFIDENCE', weight: 18, description: 'Synthetic biometric similarity 91.4%' }
      ],
      reason: 'Synthetic subject profile matched against local edge watchlist registry. Operator verification required.'
    },
    metadata: {
      matchScore: '91.4%',
      targetDatabase: 'SYNTHETIC_WATCHLIST_04',
      subjectRef: 'DEMO-042'
    }
  },
  {
    id: 'ALERT-003',
    severity: 'MEDIUM',
    type: 'LOITERING',
    status: 'ACKNOWLEDGED',
    cameraId: 'CAM-01',
    cameraName: 'BORDER FENCE NORTH',
    zoneId: 'zone-02',
    zoneName: 'RESTRICTED BUFFER',
    objectId: 'PERSON-042',
    objectClass: 'person',
    confidence: 0.92,
    timestamp: '14:24:00 IST',
    description: 'Stationary anomaly alert. Subject sustained in restricted buffer zone beyond 60-second limit (64s elapsed).',
    acknowledged: true,
    acknowledgedBy: 'OP-ALPHA-07',
    snapshotUrl: 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=800&q=80',
    relatedCameraIds: ['CAM-01'],
    evidenceId: 'EVD-2025-003',
    threatBreakdown: {
      score: 54,
      level: 'ELEVATED',
      factors: [
        { name: 'DWELL THRESHOLD EXCEEDED', weight: 30, description: 'Stationary in buffer for 64s (>45s rule)' },
        { name: 'RESTRICTED POLYGON', weight: 14, description: 'Secondary buffer zone presence' },
        { name: 'LOW MOBILITY', weight: 10, description: 'Speed < 2.0 km/h for 45s' }
      ],
      reason: 'Subject entered buffer polygon and halted for over 60 seconds without patrol clearance.'
    },
    metadata: {
      dwellTime: '64s',
      thresholdLimit: '60s'
    }
  },
  {
    id: 'ALERT-004',
    severity: 'INFO',
    type: 'UNAUTHORIZED_VEHICLE',
    status: 'RESOLVED',
    cameraId: 'CAM-03',
    cameraName: 'CHECKPOINT ALPHA',
    objectId: 'VEHICLE-031',
    objectClass: 'truck',
    confidence: 0.89,
    timestamp: '14:21:30 IST',
    description: 'Commercial logistics carrier TN01AB1234 identified at Checkpoint Alpha inspection threshold.',
    acknowledged: true,
    acknowledgedBy: 'OP-ALPHA-07',
    resolvedBy: 'COMMANDER-BOP17',
    resolutionNotes: 'Commercial logistics transport cleared for scheduled border crossing transit.',
    snapshotUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    relatedCameraIds: ['CAM-03'],
    threatBreakdown: {
      score: 22,
      level: 'LOW',
      factors: [
        { name: 'VEHICLE ENTRY', weight: 12, description: 'Approached checkpoint corridor' },
        { name: 'SCHEDULED LOGISTICS', weight: 10, description: 'Manifest pre-registered' }
      ],
      reason: 'Standard vehicle inspection event with valid plate OCR extraction.'
    },
    metadata: {
      plate: 'TN01AB1234',
      speed: '18.5 km/h'
    }
  }
];

// ============================================================================
// 3. CROSS-CAMERA TRACKING & RE-IDENTIFICATION DATA (PERSON-042)
// ============================================================================

export const INITIAL_TRACKS: TrackedObject[] = [
  {
    trackingId: 'PERSON-042',
    class: 'person',
    firstSeen: '14:21:04 IST',
    lastSeen: '14:32:08 IST',
    confidence: 0.94,
    status: 'ANOMALOUS',
    anomalies: ['PERIMETER_BREACH', 'LOITERING_65S', 'CROSS_CORRIDOR_TRANSIT'],
    speedKmh: 4.2,
    dwellSeconds: 664,
    threatScore: 87,
    currentCameraId: 'CAM-01',
    currentZone: 'BORDER FENCE 01',
    trajectory: [
      { x: 18, y: 82, timestamp: '14:21:04', speedKmh: 4.8 },
      { x: 25, y: 74, timestamp: '14:23:11', speedKmh: 4.5 },
      { x: 34, y: 62, timestamp: '14:25:30', speedKmh: 3.9 },
      { x: 38, y: 45, timestamp: '14:28:40', speedKmh: 1.2 },
      { x: 42, y: 38, timestamp: '14:32:08', speedKmh: 4.2 }
    ],
    crossCameraPath: [
      { timestamp: '14:21:04 IST', cameraId: 'CAM-01', cameraName: 'BORDER FENCE NORTH', location: 'OUTER PERIMETER', event: 'OBJECT_INITIALIZED', dwellSeconds: 120 },
      { timestamp: '14:24:00 IST', cameraId: 'CAM-01', cameraName: 'BORDER FENCE NORTH', location: 'RESTRICTED BUFFER', event: 'LOITERING_ALERT_TRIGGERED', dwellSeconds: 64 },
      { timestamp: '14:27:15 IST', cameraId: 'CAM-02', cameraName: 'BORDER FENCE EAST (THERMAL)', location: 'THERMAL OVERLAP SECTOR', event: 'CROSS_CAMERA_HANDOFF', dwellSeconds: 110 },
      { timestamp: '14:30:45 IST', cameraId: 'CAM-01', cameraName: 'BORDER FENCE NORTH', location: 'BORDER FENCE 01', event: 'PERIMETER_TRIPWIRE_BREACH', dwellSeconds: 83 }
    ]
  },
  {
    trackingId: 'VEHICLE-031',
    class: 'truck',
    firstSeen: '14:18:10 IST',
    lastSeen: '14:32:02 IST',
    confidence: 0.89,
    status: 'ACTIVE',
    anomalies: [],
    speedKmh: 18.5,
    dwellSeconds: 832,
    threatScore: 22,
    currentCameraId: 'CAM-03',
    currentZone: 'INSPECTION BAY',
    trajectory: [
      { x: 12, y: 20, timestamp: '14:18:10', speedKmh: 24.0 },
      { x: 20, y: 32, timestamp: '14:25:00', speedKmh: 19.5 },
      { x: 28, y: 40, timestamp: '14:32:02', speedKmh: 18.5 }
    ],
    crossCameraPath: [
      { timestamp: '14:18:10 IST', cameraId: 'CAM-03', cameraName: 'CHECKPOINT ALPHA', location: 'APPROACH CORRIDOR', event: 'ANPR_PLATE_CAPTURED', dwellSeconds: 240 },
      { timestamp: '14:28:00 IST', cameraId: 'CAM-03', cameraName: 'CHECKPOINT ALPHA', location: 'INSPECTION BAY', event: 'GATE_INSPECTION_HOLD', dwellSeconds: 242 }
    ]
  },
  {
    trackingId: 'PERSON-099',
    class: 'person',
    firstSeen: '14:26:00 IST',
    lastSeen: '14:32:07 IST',
    confidence: 0.87,
    status: 'ACTIVE',
    anomalies: ['SLOW_TRANSIT'],
    speedKmh: 3.4,
    dwellSeconds: 367,
    threatScore: 42,
    currentCameraId: 'CAM-04',
    currentZone: 'PATROL RUNWAY',
    trajectory: [
      { x: 22, y: 40, timestamp: '14:26:00', speedKmh: 3.8 },
      { x: 30, y: 45, timestamp: '14:29:15', speedKmh: 3.5 },
      { x: 38, y: 50, timestamp: '14:32:07', speedKmh: 3.4 }
    ],
    crossCameraPath: [
      { timestamp: '14:26:00 IST', cameraId: 'CAM-04', cameraName: 'PATROL CORRIDOR SOUTH', location: 'RUNWAY APPROACH', event: 'PATROL_MONITORING', dwellSeconds: 367 }
    ]
  }
];

// ============================================================================
// 4. ANPR INTELLIGENCE DATA
// ============================================================================

export const INITIAL_PLATES: LicensePlate[] = [
  {
    id: 'lpr-001',
    plateNumber: 'TN01AB1234',
    vehicleType: 'TRUCK',
    confidence: 0.89,
    ocrConfidence: 0.88,
    formatValid: true,
    status: 'NORMAL',
    cameraId: 'CAM-03',
    timestamp: '14:32:02 IST',
    cropUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
    direction: 'INBOUND',
    speedKmh: 18.5,
    characterConfidences: [
      { char: 'T', confidence: 0.96 },
      { char: 'N', confidence: 0.95 },
      { char: '0', confidence: 0.92 },
      { char: '1', confidence: 0.88 },
      { char: 'A', confidence: 0.85 },
      { char: 'B', confidence: 0.89 },
      { char: '1', confidence: 0.84 },
      { char: '2', confidence: 0.82 },
      { char: '3', confidence: 0.86 },
      { char: '4', confidence: 0.87 }
    ]
  },
  {
    id: 'lpr-002',
    plateNumber: 'DL04CC9821',
    vehicleType: 'CAR',
    confidence: 0.94,
    ocrConfidence: 0.92,
    formatValid: true,
    status: 'REVIEW',
    cameraId: 'CAM-03',
    timestamp: '14:26:40 IST',
    cropUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80',
    direction: 'OUTBOUND',
    speedKmh: 32.0,
    characterConfidences: [
      { char: 'D', confidence: 0.98 },
      { char: 'L', confidence: 0.97 },
      { char: '0', confidence: 0.94 },
      { char: '4', confidence: 0.91 },
      { char: 'C', confidence: 0.92 },
      { char: 'C', confidence: 0.89 },
      { char: '9', confidence: 0.88 },
      { char: '8', confidence: 0.90 },
      { char: '2', confidence: 0.91 },
      { char: '1', confidence: 0.92 }
    ]
  },
  {
    id: 'lpr-003',
    plateNumber: 'PB08XY4419',
    vehicleType: 'TRUCK',
    confidence: 0.91,
    ocrConfidence: 0.86,
    formatValid: true,
    status: 'NORMAL',
    cameraId: 'CAM-03',
    timestamp: '14:12:15 IST',
    direction: 'INBOUND',
    speedKmh: 21.0
  },
  {
    id: 'lpr-004',
    plateNumber: 'GJ01KM7763',
    vehicleType: 'CAR',
    confidence: 0.85,
    ocrConfidence: 0.74,
    formatValid: true,
    status: 'REVIEW',
    cameraId: 'CAM-03',
    timestamp: '13:58:04 IST',
    direction: 'OUTBOUND',
    speedKmh: 28.5
  }
];

// ============================================================================
// 5. SYNTHETIC FACE INTELLIGENCE DATA
// ============================================================================

export const INITIAL_FACES: FaceMatch[] = [
  {
    id: 'face-001',
    databaseId: 'DEMO-042',
    subjectName: 'SIMULATED TEST SUBJECT #42',
    matchScore: 0.914,
    threshold: 0.85,
    watchlistStatus: 'WATCHLIST MATCH',
    status: 'SIMULATED TEST IDENTITY',
    cameraId: 'CAM-03',
    timestamp: '14:28:12 IST',
    snapshotUrl: '',
    notes: 'Synthetic subject vector flagged under simulated watchlist criteria. Operator confirmation required.',
    embeddingHexSample: '0x3F81A0B2C948... (512-dim ArcFace normalized vector)'
  },
  {
    id: 'face-002',
    databaseId: 'DEMO-108',
    subjectName: 'SIMULATED TEST SUBJECT #108',
    matchScore: 0.732,
    threshold: 0.85,
    watchlistStatus: 'CLEAR',
    status: 'SIMULATED TEST IDENTITY',
    cameraId: 'CAM-03',
    timestamp: '14:19:04 IST',
    snapshotUrl: '',
    notes: 'Driver credential verified at Checkpoint Alpha barrier.',
    embeddingHexSample: '0x7B10E45F12AA... (512-dim ArcFace normalized vector)'
  },
  {
    id: 'face-003',
    databaseId: 'DEMO-255',
    subjectName: 'SIMULATED PATROL OFFICER #255',
    matchScore: 0.684,
    threshold: 0.85,
    watchlistStatus: 'CLEAR',
    status: 'SIMULATED TEST IDENTITY',
    cameraId: 'CAM-01',
    timestamp: '13:45:30 IST',
    snapshotUrl: '',
    notes: 'Border Security Force patrol personnel authorized in corridor.',
    embeddingHexSample: '0x992B45CC881F... (512-dim ArcFace normalized vector)'
  }
];

// ============================================================================
// 6. BOP NODES & EDGE TELEMETRY
// ============================================================================

export const INITIAL_BOP_NODES: BOPNode[] = [
  {
    id: 'bop-01',
    code: 'BOP-01',
    name: 'VALLEY PASS OUTPOST',
    sector: 'NORTH-WEST SECTOR',
    coordinates: { lat: 34.12, lng: 74.83 },
    status: 'ONLINE',
    cameraCount: 8,
    activeAlerts: 0,
    edgeLoad: 42,
    lastSync: '10s ago',
    threatLevel: 'LOW'
  },
  {
    id: 'bop-17',
    code: 'BOP-17',
    name: 'NORTH SECTOR HEADQUARTERS',
    sector: 'NORTH SECTOR / ACTIVE FOCUS',
    coordinates: { lat: 34.35, lng: 74.95 },
    status: 'ALERT',
    cameraCount: 16,
    activeAlerts: 3,
    edgeLoad: 68,
    lastSync: 'LIVE (Edge Direct)',
    threatLevel: 'CRITICAL'
  },
  {
    id: 'bop-23',
    code: 'BOP-23',
    name: 'RIDGE RANGER FORWARD BASE',
    sector: 'EAST MOUNTAIN SECTOR',
    coordinates: { lat: 34.42, lng: 75.18 },
    status: 'ONLINE',
    cameraCount: 6,
    activeAlerts: 1,
    edgeLoad: 55,
    lastSync: '32s ago',
    threatLevel: 'ELEVATED'
  },
  {
    id: 'bop-41',
    code: 'BOP-41',
    name: 'RIVERINE CHECKPOINT DELTA',
    sector: 'SOUTH RIVER SECTOR',
    coordinates: { lat: 33.98, lng: 74.62 },
    status: 'ONLINE',
    cameraCount: 12,
    activeAlerts: 0,
    edgeLoad: 39,
    lastSync: '14s ago',
    threatLevel: 'LOW'
  }
];

export const INITIAL_EDGE_NODE: EdgeNodeTelemetry = {
  id: 'edge-node-01',
  name: 'BOP-17 TACTICAL EDGE DAEMON',
  bopId: 'bop-17',
  bopCode: 'BOP-17',
  cpuLoadPercent: 42,
  gpuLoadPercent: 68,
  ramUsageGb: 9.4,
  ramTotalGb: 16.0,
  vramUsageGb: 7.2,
  vramTotalGb: 12.0,
  temperatureC: 61,
  activeStreams: 4,
  inferenceQueueDepth: 2,
  uptimeHours: 348,
  redisStatus: 'HEALTHY',
  postgresStatus: 'HEALTHY',
  networkMode: 'ONLINE',
  pendingSyncCount: 0,
  lastSyncTimestamp: '14:32:48 IST'
};

// ============================================================================
// 7. FORENSIC EVIDENCE WITH SHA-256 SEALS & DIGITAL SIGNATURES
// ============================================================================

export const INITIAL_EVIDENCE: Evidence[] = [
  {
    id: 'EVD-2025-001',
    eventId: 'ALERT-001',
    alertType: 'PERIMETER_BREACH',
    severity: 'CRITICAL',
    timestamp: '2026-09-13 14:30:45 IST',
    cameraId: 'CAM-01',
    cameraName: 'BORDER FENCE NORTH',
    zoneName: 'BORDER FENCE 01',
    objectId: 'PERSON-042',
    confidence: 0.94,
    frameUrl: 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=1200&q=80',
    cryptographicHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    digitalSignature: 'ED25519-SIG-8492-BOP17-SHA256-AUTHENTICATED',
    retainedUntil: '2027-09-13 (365 Days)',
    integrityVerified: true,
    preBufferFrames: 90,
    postBufferFrames: 90,
    manifestUrl: '/evidence/manifest-001.json',
    chainOfCustody: [
      { actor: 'EDGE_VISION_DAEMON', action: 'Tripwire Breach Frame Captured & Sealed', timestamp: '14:30:45 IST' },
      { actor: 'IBVAP_CORE_PIPELINE', action: 'SHA-256 Cryptographic Hash Generated', timestamp: '14:30:46 IST' },
      { actor: 'OP-ALPHA-07', action: 'Forensic Package Initialized & Verified', timestamp: '14:31:10 IST' }
    ]
  },
  {
    id: 'EVD-2025-002',
    eventId: 'ALERT-002',
    alertType: 'WATCHLIST_MATCH',
    severity: 'HIGH',
    timestamp: '2026-09-13 14:28:12 IST',
    cameraId: 'CAM-03',
    cameraName: 'CHECKPOINT ALPHA',
    zoneName: 'INSPECTION BAY',
    objectId: 'PERSON-053',
    confidence: 0.91,
    frameUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    cryptographicHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    digitalSignature: 'ED25519-SIG-1102-BOP17-FACENET-AUTHENTICATED',
    retainedUntil: '2027-09-13 (365 Days)',
    integrityVerified: true,
    preBufferFrames: 60,
    postBufferFrames: 60,
    chainOfCustody: [
      { actor: 'EDGE_FACENET_MODULE', action: 'Biometric Vector Extracted from Checkpoint Stream', timestamp: '14:28:12 IST' },
      { actor: 'IBVAP_CORE_PIPELINE', action: 'SHA-256 Hash Generated & Watchlist Logged', timestamp: '14:28:13 IST' }
    ]
  },
  {
    id: 'EVD-2025-003',
    eventId: 'ALERT-003',
    alertType: 'LOITERING',
    severity: 'MEDIUM',
    timestamp: '2026-09-13 14:24:00 IST',
    cameraId: 'CAM-01',
    cameraName: 'BORDER FENCE NORTH',
    zoneName: 'RESTRICTED BUFFER',
    objectId: 'PERSON-042',
    confidence: 0.92,
    frameUrl: 'https://images.unsplash.com/photo-1566847936715-5e147ef9caec?auto=format&fit=crop&w=1200&q=80',
    cryptographicHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    digitalSignature: 'ED25519-SIG-3391-BOP17-ANOMALY-AUTHENTICATED',
    retainedUntil: '2027-09-13 (365 Days)',
    integrityVerified: true,
    preBufferFrames: 90,
    postBufferFrames: 90,
    chainOfCustody: [
      { actor: 'EDGE_ANOMALY_ENGINE', action: '60s Loiter Condition Satisfied in Buffer Polygon', timestamp: '14:24:00 IST' },
      { actor: 'OP-ALPHA-07', action: 'Incident Acknowledged and Archived', timestamp: '14:25:20 IST' }
    ]
  }
];

// ============================================================================
// 8. SYSTEM METRICS & TELEMETRY
// ============================================================================

export const INITIAL_METRICS: SystemMetrics = {
  activeCameras: 4,
  totalCameras: 4,
  fpsAverage: 28.8,
  inferenceLatencyMs: 91,
  alertLatencyMs: 412,
  uptimePercentage: 99.98,
  activePersons: 5,
  activeVehicles: 2,
  activeFaces: 3,
  activeAlerts: 3,
  edgeNodeStatus: 'ONLINE',
  networkMode: 'ONLINE',
  pendingSyncEvents: 0,
  lastSyncTimestamp: '14:32:48 IST',
  systemHealth: 'ELEVATED_THREAT'
};

export const INITIAL_DIAGNOSTICS: SystemDiagnostics = {
  apiLatencyMs: 14,
  wsLatencyMs: 22,
  eventThroughputPerSec: 142,
  queueDepth: 2,
  inferenceLatencyMs: 91,
  dbLatencyMs: 8,
  redisHealth: 'OPTIMAL',
  edgeSyncStatus: 'SYNCHRONIZED',
  errorRatePercent: 0.01,
  connectedClients: 3,
  lastHeartbeat: '14:32:58 IST'
};

// ============================================================================
// 9. 14 COORDINATED SCENARIOS (SECTION 12 OF DIRECTIVE)
// ============================================================================

export const OPERATIONAL_SCENARIOS: ScenarioDefinition[] = [
  {
    id: '01_NORMAL_OPERATIONS',
    name: '01 NORMAL OPERATIONS',
    category: 'PERIMETER',
    description: 'Nominal border patrol activity. Regular optical & thermal streams, low inference queue, zero open breaches.',
    initialAlertCount: 0,
    targetCameraId: 'CAM-01',
    targetEntityId: 'PATROL-01'
  },
  {
    id: '02_PERIMETER_BREACH',
    name: '02 PERIMETER BREACH',
    category: 'PERIMETER',
    description: 'High-speed physical breach across Zone 01 outer perimeter fence. Tripwire triggers instant CRITICAL alert & evidence seal.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-01',
    targetEntityId: 'PERSON-042'
  },
  {
    id: '03_NIGHT_MOVEMENT',
    name: '03 NIGHT-TIME MOVEMENT',
    category: 'ANOMALY',
    description: 'Thermal LWIR spectrum detection of crawl signature in zero-lux sector. FLIR sensor triggers weighted night anomaly score.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-02',
    targetEntityId: 'PERSON-088'
  },
  {
    id: '04_LOITERING',
    name: '04 LOITERING ANOMALY',
    category: 'ANOMALY',
    description: 'Subject stationary in restricted runway buffer beyond configured 60-second dwell ceiling.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-04',
    targetEntityId: 'PERSON-099'
  },
  {
    id: '05_VEHICLE_WATCHLIST',
    name: '05 VEHICLE WATCHLIST INTERCEPT',
    category: 'WATCHLIST',
    description: 'ANPR camera extracts license plate JK02BB1001 matching national contraband alert registry.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-03',
    targetEntityId: 'VEHICLE-1001'
  },
  {
    id: '06_FACE_WATCHLIST',
    name: '06 FACE WATCHLIST MATCH',
    category: 'WATCHLIST',
    description: 'Checkpoint macro camera detects facial biometric vector matching synthetic watchlist entry with 91.4% score.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-03',
    targetEntityId: 'DEMO-042'
  },
  {
    id: '07_MULTI_CAMERA_TRACK',
    name: '07 MULTI-CAMERA TRACK (ReID)',
    category: 'PERIMETER',
    description: 'Subject PERSON-042 transitions across CAM-01 (Fence), CAM-02 (Thermal Overlap), and CAM-03 (Checkpoint Corridor).',
    initialAlertCount: 1,
    targetCameraId: 'CAM-01',
    targetEntityId: 'PERSON-042'
  },
  {
    id: '08_CAMERA_TAMPER',
    name: '08 CAMERA TAMPER / OCCLUSION',
    category: 'SYSTEM_FAIL',
    description: 'Simulated lens occlusion or optical redirect on CAM-04 triggering immediate tamper alert and edge pipeline failover.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-04',
    targetEntityId: 'CAM-04'
  },
  {
    id: '09_COMMUNICATION_LOSS',
    name: '09 COMMUNICATION LOSS (OFFLINE MODE)',
    category: 'SYSTEM_FAIL',
    description: 'Uplink to central command severed. Edge node activates autonomous local mode, queuing all alerts in persistent storage.',
    initialAlertCount: 0,
    targetCameraId: 'CAM-01',
    targetEntityId: 'edge-node-01'
  },
  {
    id: '10_EDGE_NODE_DEGRADED',
    name: '10 EDGE NODE DEGRADED',
    category: 'SYSTEM_FAIL',
    description: 'High inference queue depth causes temporary frame-drop mitigation and alerts operator of degraded processing.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-01',
    targetEntityId: 'edge-node-01'
  },
  {
    id: '11_MASS_ACTIVITY',
    name: '11 MASS ACTIVITY / CROWD FORMATION',
    category: 'ANOMALY',
    description: 'Unusual gathering of 8+ synthetic entities near buffer boundary triggering crowd density anomaly.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-01',
    targetEntityId: 'CROWD-GROUP'
  },
  {
    id: '12_FALSE_POSITIVE_REVIEW',
    name: '12 FALSE POSITIVE REVIEW LOOP',
    category: 'ANOMALY',
    description: 'Wildlife/swaying branch detection marked as false positive by operator, automatically adjusting edge zone sensitivity.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-01',
    targetEntityId: 'OBJ-FALSE-01'
  },
  {
    id: '13_SENSOR_DISAGREEMENT',
    name: '13 SENSOR DISAGREEMENT (OPT vs FLIR)',
    category: 'SYSTEM_FAIL',
    description: 'Optical feed obscured by fog while thermal sensor maintains clear target track. System highlights multi-modal fusion.',
    initialAlertCount: 1,
    targetCameraId: 'CAM-02',
    targetEntityId: 'PERSON-088'
  },
  {
    id: '14_MULTI_EVENT_INCIDENT',
    name: '14 MULTI-EVENT COMPLEX INCIDENT',
    category: 'PERIMETER',
    description: 'Coordinated perimeter breach combined with vehicle hotlist intercept, creating an incident cluster across multiple outposts.',
    initialAlertCount: 2,
    targetCameraId: 'CAM-01',
    targetEntityId: 'INCIDENT-CLUSTER'
  }
];

// ============================================================================
// 10. JURY DEMO 12-STEP SCRIPT (SECTION 74 OF DIRECTIVE)
// ============================================================================

export const JURY_DEMO_STEPS: JuryDemoStep[] = [
  {
    stepIndex: 1,
    title: '1. SYSTEM NOMINAL',
    description: 'BOP-17 Edge Node operating at 28.8 FPS. All 4 video streams live, zero active security incidents.',
    durationMs: 4000,
    cameraFocus: 'CAM-01'
  },
  {
    stepIndex: 2,
    title: '2. TARGET DETECTED',
    description: 'YOLOv8x detects person signature with 94.2% confidence in outer perimeter sector.',
    durationMs: 4500,
    cameraFocus: 'CAM-01',
    highlightedEntity: 'PERSON-042'
  },
  {
    stepIndex: 3,
    title: '3. TRACK INITIALIZED',
    description: 'DeepSORT assigns continuous ID PERSON-042, calculating directional velocity at 4.2 km/h.',
    durationMs: 4500,
    cameraFocus: 'CAM-01',
    highlightedEntity: 'PERSON-042'
  },
  {
    stepIndex: 4,
    title: '4. PERIMETER APPROACH',
    description: 'Subject enters intermediate buffer zone. Dwell timer commences loitering evaluation.',
    durationMs: 5000,
    cameraFocus: 'CAM-01',
    highlightedEntity: 'PERSON-042'
  },
  {
    stepIndex: 5,
    title: '5. VIRTUAL FENCE BREACH',
    description: 'Subject crosses calibrated polygon tripwire. Zone 01 triggers into pulsed breach state.',
    durationMs: 5000,
    cameraFocus: 'CAM-01',
    actionRequired: 'BREACH_TRIGGERED'
  },
  {
    stepIndex: 6,
    title: '6. EXPLAINABLE THREAT SCORE',
    description: 'Threat Engine evaluates factors (+35 Tripwire, +20 Zone, +12 Dwell, +10 Confidence) = 87 / 100.',
    durationMs: 5000,
    cameraFocus: 'CAM-01'
  },
  {
    stepIndex: 7,
    title: '7. CRITICAL ALERT EMITTED',
    description: 'CRITICAL Alert generated with audio annunciator, routing to Operator ALPHA-07 triage console.',
    durationMs: 5000,
    cameraFocus: 'CAM-01'
  },
  {
    stepIndex: 8,
    title: '8. MULTI-CAMERA CORRELATION',
    description: 'Hand-off tracking links CAM-01 visual detection with CAM-02 Thermal FLIR cross-sector sensor.',
    durationMs: 5000,
    cameraFocus: 'CAM-02',
    highlightedEntity: 'PERSON-042'
  },
  {
    stepIndex: 9,
    title: '9. OPERATOR ACKNOWLEDGEMENT',
    description: 'Operator acknowledges alert. Action recorded into tamper-evident local audit ledger.',
    durationMs: 4500,
    cameraFocus: 'CAM-01',
    actionRequired: 'ACKNOWLEDGE'
  },
  {
    stepIndex: 10,
    title: '10. EVIDENCE CAPTURE & SEAL',
    description: '90-frame pre/post buffer sealed with SHA-256 cryptographic hash and ED25519 signature.',
    durationMs: 5000,
    cameraFocus: 'CAM-01'
  },
  {
    stepIndex: 11,
    title: '11. INCIDENT RESOLUTION',
    description: 'Field patrol dispatched and interdiction completed. Operator marks incident RESOLVED.',
    durationMs: 4500,
    cameraFocus: 'CAM-01',
    actionRequired: 'RESOLVE'
  },
  {
    stepIndex: 12,
    title: '12. TELEMETRY & RETURN TO NOMINAL',
    description: 'Analytics, incident count, and BOP threat level automatically recalculate to nominal state.',
    durationMs: 4000,
    cameraFocus: 'CAM-01'
  }
];

// ============================================================================
// 11. AUDIT LOG LEDGER (TAMPER-EVIDENT)
// ============================================================================

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'AUD-901',
    timestamp: '14:31:10 IST',
    actor: 'OP-ALPHA-07',
    role: 'OPERATOR',
    action: 'ALERT_ACKNOWLEDGED',
    resource: 'ALERT-001 (PERSON-042)',
    result: 'SUCCESS',
    details: 'Operator reviewed frame snapshot and confirmed critical perimeter tripwire breach.',
    ipAddress: '10.14.0.12'
  },
  {
    id: 'AUD-902',
    timestamp: '14:28:15 IST',
    actor: 'SYSTEM_DAEMON',
    role: 'SUPER_ADMIN',
    action: 'WATCHLIST_QUERY',
    resource: 'LPRNet / FaceNet',
    result: 'SUCCESS',
    details: 'Automated 512-dim embedding similarity match computed against local edge database.',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'AUD-903',
    timestamp: '14:25:20 IST',
    actor: 'OP-ALPHA-07',
    role: 'OPERATOR',
    action: 'ALERT_ACKNOWLEDGED',
    resource: 'ALERT-003 (Loitering)',
    result: 'SUCCESS',
    details: 'Stationary buffer dwell noted; secondary corridor patrol unit notified.',
    ipAddress: '10.14.0.12'
  },
  {
    id: 'AUD-904',
    timestamp: '14:10:00 IST',
    actor: 'COMMANDER-BOP17',
    role: 'COMMANDER',
    action: 'ZONE_RULE_UPDATE',
    resource: 'ZONE-01 (Border Fence)',
    result: 'SUCCESS',
    details: 'Sensitivity calibrated to 0.95; zero-tolerance entry vector rule enforced.',
    ipAddress: '10.14.0.2'
  },
  {
    id: 'AUD-905',
    timestamp: '14:00:00 IST',
    actor: 'OP-ALPHA-07',
    role: 'OPERATOR',
    action: 'USER_LOGIN',
    resource: 'IBVAP_TERMINAL_01',
    result: 'SUCCESS',
    details: 'Authenticated via biometric smartcard token at BOP-17 console.',
    ipAddress: '10.14.0.12'
  }
];

// ============================================================================
// 12. SECURITY REPORTS
// ============================================================================

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'REP-2026-0913-01',
    title: 'BOP-17 DAILY OPERATIONAL SURVEILLANCE SUMMARY',
    type: 'DAILY_SUMMARY',
    generatedAt: '2026-09-13 14:00:00 IST',
    generatedBy: 'COMMANDER-BOP17',
    sector: 'NORTH SECTOR (BOP-17)',
    eventCount: 48,
    integrityHash: 'a7b9c3f2d1e0... (SHA-256 Verified)',
    classification: 'RESTRICTED / DEMO SIMULATION'
  },
  {
    id: 'REP-2026-0913-02',
    title: 'INCIDENT DOSSIER: INCIDENT-00041 (PERSON-042 TRIPWIRE BREACH)',
    type: 'INCIDENT_DOSSIER',
    generatedAt: '2026-09-13 14:31:30 IST',
    generatedBy: 'OP-ALPHA-07',
    sector: 'NORTH SECTOR / CAM-01',
    eventCount: 4,
    integrityHash: 'e3b0c44298fc... (SHA-256 Verified)',
    classification: 'CONFIDENTIAL / FORENSIC EVIDENCE'
  },
  {
    id: 'REP-2026-0913-03',
    title: 'CHECKPOINT ALPHA ANPR & WATCHLIST ACTIVITY REPORT',
    type: 'ANPR_WATCHLIST',
    generatedAt: '2026-09-13 13:00:00 IST',
    generatedBy: 'OP-ALPHA-07',
    sector: 'CHECKPOINT ALPHA (CAM-03)',
    eventCount: 32,
    integrityHash: '9f86d081884c... (SHA-256 Verified)',
    classification: 'RESTRICTED / DEMO SIMULATION'
  }
];

// ============================================================================
// 13. 24-HOUR ANALYTICS TIME SERIES
// ============================================================================

export const ANALYTICS_SERIES_24H: AnalyticsDataPoint[] = [
  { time: '00:00', detections: 14, alerts: 1, fps: 29.4, inferenceMs: 88, persons: 2, vehicles: 0 },
  { time: '02:00', detections: 9, alerts: 0, fps: 29.5, inferenceMs: 87, persons: 1, vehicles: 0 },
  { time: '04:00', detections: 12, alerts: 1, fps: 29.2, inferenceMs: 89, persons: 2, vehicles: 1 },
  { time: '06:00', detections: 28, alerts: 2, fps: 28.9, inferenceMs: 92, persons: 6, vehicles: 4 },
  { time: '08:00', detections: 45, alerts: 3, fps: 28.6, inferenceMs: 95, persons: 12, vehicles: 7 },
  { time: '10:00', detections: 62, alerts: 4, fps: 28.4, inferenceMs: 96, persons: 16, vehicles: 9 },
  { time: '12:00', detections: 58, alerts: 3, fps: 28.7, inferenceMs: 93, persons: 14, vehicles: 8 },
  { time: '14:00', detections: 71, alerts: 5, fps: 28.8, inferenceMs: 91, persons: 18, vehicles: 11 },
  { time: '16:00', detections: 54, alerts: 3, fps: 28.9, inferenceMs: 90, persons: 13, vehicles: 7 },
  { time: '18:00', detections: 49, alerts: 2, fps: 29.0, inferenceMs: 92, persons: 11, vehicles: 6 },
  { time: '20:00', detections: 38, alerts: 3, fps: 29.1, inferenceMs: 91, persons: 8, vehicles: 4 },
  { time: '22:00', detections: 24, alerts: 2, fps: 29.3, inferenceMs: 89, persons: 5, vehicles: 2 },
];
