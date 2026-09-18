import { 
  CameraScenario, 
  Detection, 
  Alert, 
  Zone,
  BoundingBox,
  ScenarioTarget,
  ScenarioEvent,
  TrajectoryKeyframe
} from '../types';

/**
 * Deterministic Camera Scenarios for IBVAP Mode B (Simulated Video Detection Engine)
 * Synchronized with the 10.01s prerecorded CCTV footage files.
 */
export const CAMERA_SCENARIOS: Record<string, CameraScenario> = {
  'CAM-01': {
    cameraId: 'CAM-01',
    videoSource: '/simulations/cam-01-footage.mp4',
    duration: 10.01,
    zones: [
      {
        id: 'zone-01',
        name: 'BORDER FENCE 01',
        type: 'BORDER FENCE',
        cameraId: 'CAM-01',
        status: 'ACTIVE',
        sensitivity: 0.95,
        points: [
          { x: 10, y: 65 },
          { x: 90, y: 65 },
          { x: 85, y: 92 },
          { x: 15, y: 92 }
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
          { x: 25, y: 30 },
          { x: 75, y: 30 },
          { x: 70, y: 62 },
          { x: 30, y: 62 }
        ],
        rule: {
          allowedClasses: ['person'],
          dwellThresholdSeconds: 45,
          alertSeverity: 'HIGH'
        }
      }
    ],
    targets: [
      {
        id: 'P-01',
        type: 'person',
        label: 'SUBJECT P-01',
        appearance: { startTime: 1.2, endTime: 10.01 },
        trajectory: [
          { time: 1.2, x: 24, y: 34, w: 9, h: 23, confidence: 0.91, speedKmh: 4.2 },
          { time: 2.8, x: 33, y: 41, w: 9.5, h: 24, confidence: 0.93, speedKmh: 4.6 },
          { time: 4.2, x: 44, y: 52, w: 10.5, h: 26, confidence: 0.96, speedKmh: 5.1 },
          { time: 6.2, x: 55, y: 64, w: 11.5, h: 27, confidence: 0.97, speedKmh: 4.9 },
          { time: 8.2, x: 67, y: 72, w: 12.5, h: 28, confidence: 0.95, speedKmh: 4.0 },
          { time: 10.01, x: 76, y: 76, w: 13, h: 29, confidence: 0.93, speedKmh: 3.2 }
        ]
      }
    ],
    events: [
      {
        id: 'evt-cam01-01',
        timestamp: 1.2,
        eventType: 'PERSON_DETECTED',
        targetId: 'P-01',
        cameraId: 'CAM-01',
        zoneId: 'zone-02',
        zoneName: 'RESTRICTED BUFFER',
        severity: 'LOW',
        details: 'Initial subject tracking acquired in northern perimeter approach corridor'
      },
      {
        id: 'evt-cam01-02',
        timestamp: 2.8,
        eventType: 'PERSON_TRACKED',
        targetId: 'P-01',
        cameraId: 'CAM-01',
        zoneId: 'zone-02',
        zoneName: 'RESTRICTED BUFFER',
        severity: 'MEDIUM',
        details: 'Continuous vector confirmed towards border fence buffer boundary'
      },
      {
        id: 'evt-cam01-03',
        timestamp: 4.2,
        eventType: 'PERIMETER_BREACH',
        targetId: 'P-01',
        cameraId: 'CAM-01',
        zoneId: 'zone-01',
        zoneName: 'BORDER FENCE 01',
        severity: 'CRITICAL',
        details: 'CRITICAL: Subject crossed virtual tripwire polygon into restricted border barrier zone.',
        alert: {
          id: 'ALERT-001',
          severity: 'CRITICAL',
          type: 'PERIMETER_BREACH',
          status: 'NEW',
          cameraId: 'CAM-01',
          cameraName: 'BORDER FENCE NORTH',
          zoneId: 'zone-01',
          zoneName: 'BORDER FENCE 01',
          objectId: 'P-01',
          objectClass: 'person',
          confidence: 0.96,
          timestamp: '14:30:45 IST',
          videoTimestamp: 4.2,
          direction: 'NORTH -> SOUTH',
          description: 'CRITICAL: Subject P-01 breached Border Fence 01 tripwire boundary polygon at 4.2s.',
          acknowledged: false,
          snapshotUrl: '/simulations/cam-01-footage.mp4',
          relatedCameraIds: ['CAM-01', 'CAM-02'],
          threatBreakdown: {
            score: 94,
            level: 'CRITICAL',
            factors: [
              { name: 'TRIPWIRE BREACH', weight: 40, description: 'Direct crossing of virtual fence polygon line' },
              { name: 'ENTRY VECTOR', weight: 25, description: 'Rapid perpendicular approach to restricted barrier' },
              { name: 'TEMPORAL CONTINUITY', weight: 15, description: 'Uninterrupted trajectory confirmed over 3.0s' },
              { name: 'DETECTION CONFIDENCE', weight: 14, description: 'High YOLOv8x visual certainty (96%)' }
            ],
            reason: 'Subject crossed high-priority border tripwire at high speed towards internal cordon.'
          },
          metadata: { vector: 'INBOUND', dwellTime: '3.0s', speed: '5.1 km/h' }
        },
        evidence: {
          id: 'EVD-101',
          eventId: 'EVT-101',
          incidentId: 'INC-8821',
          alertId: 'ALERT-001',
          alertType: 'PERIMETER_BREACH',
          severity: 'CRITICAL',
          timestamp: '14:30:45 IST',
          videoTimestamp: 4.2,
          cameraId: 'CAM-01',
          cameraName: 'BORDER FENCE NORTH',
          zoneName: 'BORDER FENCE 01',
          objectId: 'P-01',
          confidence: 0.96,
          frameUrl: '/simulations/cam-01-footage.mp4',
          mediaType: 'CLIP',
          mediaUrl: '/simulations/cam-01-footage.mp4',
          fileHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          durationSeconds: 10.01,
          sizeMb: 4.2,
          notes: 'Full forensic video packet: Subject P-01 tripwire crossing at 4.2s',
          status: 'SEALED',
          cryptographicHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          digitalSignature: 'ED25519:7f81a02938bfe4c029481102948',
          retainedUntil: '2026-12-31',
          integrityVerified: true,
          chainOfCustody: [
            { timestamp: '14:30:45 IST', actor: 'IBVAP Edge Node 01', action: 'SEALED_EVIDENCE', notes: 'Automated video buffer cut & SHA-256 seal' }
          ]
        }
      }
    ]
  },

  'CAM-02': {
    cameraId: 'CAM-02',
    videoSource: '/simulations/cam-02-footage.mp4',
    duration: 10.01,
    zones: [
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
          { x: 80, y: 88 },
          { x: 10, y: 82 }
        ],
        rule: {
          allowedClasses: [],
          directionFilter: 'ENTRY',
          alertSeverity: 'CRITICAL'
        }
      }
    ],
    targets: [
      {
        id: 'P-02',
        type: 'person',
        label: 'THERMAL SUBJECT P-02',
        appearance: { startTime: 0.8, endTime: 10.01 },
        trajectory: [
          { time: 0.8, x: 46, y: 42, w: 8, h: 20, confidence: 0.89, speedKmh: 1.4 },
          { time: 3.0, x: 50, y: 44, w: 8, h: 20, confidence: 0.91, speedKmh: 0.8 },
          { time: 5.5, x: 52, y: 46, w: 8.5, h: 21, confidence: 0.94, speedKmh: 0.3 },
          { time: 7.5, x: 54, y: 47, w: 8.5, h: 21, confidence: 0.92, speedKmh: 1.0 },
          { time: 10.01, x: 57, y: 49, w: 8.5, h: 21, confidence: 0.90, speedKmh: 1.3 }
        ]
      },
      {
        id: 'P-03',
        type: 'person',
        label: 'THERMAL SUBJECT P-03',
        appearance: { startTime: 2.0, endTime: 9.8 },
        trajectory: [
          { time: 2.0, x: 78, y: 38, w: 7, h: 18, confidence: 0.86, speedKmh: 4.8 },
          { time: 4.5, x: 67, y: 52, w: 7.5, h: 19, confidence: 0.90, speedKmh: 4.9 },
          { time: 7.0, x: 56, y: 65, w: 8, h: 20, confidence: 0.92, speedKmh: 4.6 },
          { time: 9.8, x: 44, y: 78, w: 8.5, h: 21, confidence: 0.89, speedKmh: 4.2 }
        ]
      }
    ],
    events: [
      {
        id: 'evt-cam02-01',
        timestamp: 0.8,
        eventType: 'PERSON_DETECTED',
        targetId: 'P-02',
        cameraId: 'CAM-02',
        zoneId: 'zone-03',
        zoneName: 'EAST PERIMETER',
        severity: 'LOW',
        details: 'Thermal signature acquired on East Sector LWIR sensor'
      },
      {
        id: 'evt-cam02-02',
        timestamp: 2.0,
        eventType: 'PERSON_DETECTED',
        targetId: 'P-03',
        cameraId: 'CAM-02',
        zoneId: 'zone-03',
        zoneName: 'EAST PERIMETER',
        severity: 'LOW',
        details: 'Second thermal signature P-03 acquired entering transit sector'
      },
      {
        id: 'evt-cam02-03',
        timestamp: 5.5,
        eventType: 'LOITERING',
        targetId: 'P-02',
        cameraId: 'CAM-02',
        zoneId: 'zone-03',
        zoneName: 'EAST PERIMETER',
        severity: 'HIGH',
        details: 'LOITERING ANOMALY: Subject P-02 stationary dwell duration exceeded baseline threshold.',
        alert: {
          id: 'ALERT-002',
          severity: 'HIGH',
          type: 'LOITERING',
          status: 'NEW',
          cameraId: 'CAM-02',
          cameraName: 'BORDER FENCE EAST (THERMAL)',
          zoneId: 'zone-03',
          zoneName: 'EAST PERIMETER',
          objectId: 'P-02',
          objectClass: 'person',
          confidence: 0.94,
          timestamp: '14:31:12 IST',
          videoTimestamp: 5.5,
          direction: 'STATIONARY',
          description: 'LOITERING: Subject P-02 dwelled in East Perimeter zone with speed < 1 km/h for over 4.5s.',
          acknowledged: false,
          snapshotUrl: '/simulations/cam-02-footage.mp4',
          relatedCameraIds: ['CAM-02', 'CAM-01'],
          threatBreakdown: {
            score: 78,
            level: 'HIGH',
            factors: [
              { name: 'PROLONGED DWELL', weight: 40, description: 'Subject velocity below movement baseline for >4.5s' },
              { name: 'SENSITIVE SECTOR', weight: 25, description: 'East Perimeter restricted fence zone' },
              { name: 'THERMAL INTEGRITY', weight: 13, description: 'FLIR contrast heat profile confirmed human body 37C' }
            ],
            reason: 'Subject halted movement near perimeter fence line with low spatial displacement.'
          },
          metadata: { vector: 'STATIONARY', dwellTime: '55s', speed: '0.3 km/h' }
        },
        evidence: {
          id: 'EVD-102',
          eventId: 'EVT-102',
          incidentId: 'INC-8822',
          alertId: 'ALERT-002',
          alertType: 'LOITERING',
          severity: 'HIGH',
          timestamp: '14:31:12 IST',
          videoTimestamp: 5.5,
          cameraId: 'CAM-02',
          cameraName: 'BORDER FENCE EAST (THERMAL)',
          zoneName: 'EAST PERIMETER',
          objectId: 'P-02',
          confidence: 0.94,
          frameUrl: '/simulations/cam-02-footage.mp4',
          mediaType: 'CLIP',
          mediaUrl: '/simulations/cam-02-footage.mp4',
          fileHash: 'sha256:b4a92c819df946e3b87910248c8996fb92427ae41e4649b934ca495991b78912',
          durationSeconds: 10.01,
          sizeMb: 3.8,
          notes: 'Thermal evidence record: Subject P-02 loitering threshold exceeded at 5.5s',
          status: 'SEALED',
          cryptographicHash: 'sha256:b4a92c819df946e3b87910248c8996fb92427ae41e4649b934ca495991b78912',
          digitalSignature: 'ED25519:3b194ac0924e4c0294822019283',
          retainedUntil: '2026-12-31',
          integrityVerified: true,
          chainOfCustody: [
            { timestamp: '14:31:12 IST', actor: 'IBVAP FLIR Daemon', action: 'SEALED_EVIDENCE', notes: 'Thermal frame extraction and cryptographic hash verified' }
          ]
        }
      }
    ]
  },

  'CAM-03': {
    cameraId: 'CAM-03',
    videoSource: '/simulations/cam-03-footage.mp4',
    duration: 10.01,
    zones: [
      {
        id: 'zone-04',
        name: 'INSPECTION BAY',
        type: 'RESTRICTED AREA',
        cameraId: 'CAM-03',
        status: 'ACTIVE',
        sensitivity: 0.88,
        points: [
          { x: 18, y: 35 },
          { x: 78, y: 35 },
          { x: 82, y: 88 },
          { x: 14, y: 88 }
        ],
        rule: {
          allowedClasses: ['truck', 'vehicle', 'person'],
          dwellThresholdSeconds: 120,
          alertSeverity: 'HIGH'
        }
      }
    ],
    targets: [
      {
        id: 'V-01',
        type: 'truck',
        label: 'CARRIER V-01',
        appearance: { startTime: 0.5, endTime: 10.01 },
        trajectory: [
          { time: 0.5, x: 22, y: 36, w: 34, h: 35, confidence: 0.90, speedKmh: 21.0 },
          { time: 2.5, x: 27, y: 39, w: 37, h: 37, confidence: 0.93, speedKmh: 17.5 },
          { time: 3.5, x: 30, y: 42, w: 39, h: 39, confidence: 0.97, speedKmh: 14.0 },
          { time: 6.0, x: 35, y: 47, w: 42, h: 42, confidence: 0.96, speedKmh: 8.5 },
          { time: 8.5, x: 39, y: 52, w: 44, h: 45, confidence: 0.95, speedKmh: 4.2 },
          { time: 10.01, x: 41, y: 54, w: 45, h: 46, confidence: 0.94, speedKmh: 0.5 }
        ]
      }
    ],
    events: [
      {
        id: 'evt-cam03-01',
        timestamp: 0.5,
        eventType: 'VEHICLE_DETECTED',
        targetId: 'V-01',
        cameraId: 'CAM-03',
        zoneId: 'zone-04',
        zoneName: 'INSPECTION BAY',
        severity: 'LOW',
        details: 'Commercial transport vehicle V-01 approaching checkpoint barrier'
      },
      {
        id: 'evt-cam03-02',
        timestamp: 3.5,
        eventType: 'ANPR_DETECTED',
        targetId: 'V-01',
        cameraId: 'CAM-03',
        zoneId: 'zone-04',
        zoneName: 'INSPECTION BAY',
        severity: 'HIGH',
        details: 'ANPR OCR VERIFIED: Plate TN01AB1234 identified on vehicle V-01.',
        alert: {
          id: 'ALERT-003',
          severity: 'HIGH',
          type: 'ANPR_DETECTED',
          status: 'NEW',
          cameraId: 'CAM-03',
          cameraName: 'CHECKPOINT ALPHA',
          zoneId: 'zone-04',
          zoneName: 'INSPECTION BAY',
          objectId: 'V-01',
          objectClass: 'truck',
          confidence: 0.97,
          timestamp: '14:31:35 IST',
          videoTimestamp: 3.5,
          direction: 'APPROACHING',
          description: 'ANPR OCR MATCH: Heavy vehicle plate TN01AB1234 read at Checkpoint Alpha inspection bay.',
          acknowledged: false,
          snapshotUrl: '/simulations/cam-03-footage.mp4',
          relatedCameraIds: ['CAM-03'],
          threatBreakdown: {
            score: 72,
            level: 'HIGH',
            factors: [
              { name: 'CHECKPOINT ENTRY', weight: 35, description: 'Vehicle entering secured inspection bay zone' },
              { name: 'OCR CONFIDENCE', weight: 25, description: 'LPRNet dual-pass OCR match 97.4%' },
              { name: 'COMMERCIAL CLASS', weight: 12, description: 'Heavy goods vehicle requires mandatory cargo manifest check' }
            ],
            reason: 'Heavy carrier entered checkpoint lane; ANPR optical scan successfully registered plate.'
          },
          metadata: { plateNumber: 'TN01AB1234', vector: 'INSPECTION LANE', speed: '14.0 km/h' }
        },
        evidence: {
          id: 'EVD-103',
          eventId: 'EVT-103',
          incidentId: 'INC-8823',
          alertId: 'ALERT-003',
          alertType: 'ANPR_DETECTED',
          severity: 'HIGH',
          timestamp: '14:31:35 IST',
          videoTimestamp: 3.5,
          cameraId: 'CAM-03',
          cameraName: 'CHECKPOINT ALPHA',
          zoneName: 'INSPECTION BAY',
          objectId: 'V-01',
          confidence: 0.97,
          frameUrl: '/simulations/cam-03-footage.mp4',
          mediaType: 'CLIP',
          mediaUrl: '/simulations/cam-03-footage.mp4',
          fileHash: 'sha256:7f902ac91834e3b87910248c8996fb92427ae41e4649b934ca495991b7834bc1',
          durationSeconds: 10.01,
          sizeMb: 4.5,
          notes: 'Checkpoint ANPR optical frame: Plate TN01AB1234 at 3.5s',
          status: 'SEALED',
          cryptographicHash: 'sha256:7f902ac91834e3b87910248c8996fb92427ae41e4649b934ca495991b7834bc1',
          digitalSignature: 'ED25519:9a01f4c2810e4c0294833019842',
          retainedUntil: '2026-12-31',
          integrityVerified: true,
          chainOfCustody: [
            { timestamp: '14:31:35 IST', actor: 'IBVAP LPRNet Service', action: 'SEALED_EVIDENCE', notes: 'ANPR OCR confidence 97.4% logged and hashed' }
          ]
        }
      },
      {
        id: 'evt-cam03-03',
        timestamp: 6.0,
        eventType: 'ZONE_ENTRY',
        targetId: 'V-01',
        cameraId: 'CAM-03',
        zoneId: 'zone-04',
        zoneName: 'INSPECTION BAY',
        severity: 'MEDIUM',
        details: 'Vehicle V-01 entered Inspection Bay perimeter polygon'
      }
    ]
  },

  'CAM-04': {
    cameraId: 'CAM-04',
    videoSource: '/simulations/cam-04-footage.mp4',
    duration: 10.01,
    zones: [
      {
        id: 'zone-05',
        name: 'PATROL RUNWAY',
        type: 'PATROL CORRIDOR',
        cameraId: 'CAM-04',
        status: 'ACTIVE',
        sensitivity: 0.85,
        points: [
          { x: 10, y: 48 },
          { x: 90, y: 48 },
          { x: 85, y: 92 },
          { x: 15, y: 92 }
        ],
        rule: {
          allowedClasses: ['person', 'vehicle'],
          dwellThresholdSeconds: 60,
          alertSeverity: 'MEDIUM'
        }
      }
    ],
    targets: [
      {
        id: 'P-04',
        type: 'person',
        label: 'PATROL SUBJECT P-04',
        appearance: { startTime: 0.8, endTime: 10.01 },
        trajectory: [
          { time: 0.8, x: 26, y: 49, w: 7, h: 19, confidence: 0.88, speedKmh: 3.5 },
          { time: 4.0, x: 33, y: 53, w: 7.5, h: 20, confidence: 0.91, speedKmh: 3.7 },
          { time: 7.0, x: 41, y: 57, w: 8, h: 21, confidence: 0.90, speedKmh: 3.5 },
          { time: 10.01, x: 49, y: 61, w: 8, h: 21, confidence: 0.89, speedKmh: 3.4 }
        ]
      },
      {
        id: 'P-05',
        type: 'person',
        label: 'PATROL SUBJECT P-05',
        appearance: { startTime: 1.5, endTime: 10.01 },
        trajectory: [
          { time: 1.5, x: 53, y: 47, w: 7, h: 18, confidence: 0.86, speedKmh: 4.0 },
          { time: 4.8, x: 59, y: 51, w: 7.5, h: 20, confidence: 0.90, speedKmh: 4.2 },
          { time: 8.0, x: 66, y: 56, w: 8, h: 20, confidence: 0.92, speedKmh: 4.1 },
          { time: 10.01, x: 71, y: 59, w: 8, h: 21, confidence: 0.88, speedKmh: 3.8 }
        ]
      },
      {
        id: 'P-06',
        type: 'person',
        label: 'PATROL SUBJECT P-06',
        appearance: { startTime: 2.5, endTime: 9.5 },
        trajectory: [
          { time: 2.5, x: 76, y: 51, w: 6.5, h: 17, confidence: 0.84, speedKmh: 3.0 },
          { time: 5.5, x: 73, y: 57, w: 7, h: 18, confidence: 0.88, speedKmh: 3.1 },
          { time: 8.0, x: 69, y: 64, w: 7, h: 19, confidence: 0.90, speedKmh: 3.0 },
          { time: 9.5, x: 65, y: 69, w: 7.5, h: 19, confidence: 0.87, speedKmh: 2.8 }
        ]
      }
    ],
    events: [
      {
        id: 'evt-cam04-01',
        timestamp: 0.8,
        eventType: 'PERSON_DETECTED',
        targetId: 'P-04',
        cameraId: 'CAM-04',
        zoneId: 'zone-05',
        zoneName: 'PATROL RUNWAY',
        severity: 'LOW',
        details: 'Patrol Subject P-04 movement acquired in South sector'
      },
      {
        id: 'evt-cam04-02',
        timestamp: 1.5,
        eventType: 'PERSON_DETECTED',
        targetId: 'P-05',
        cameraId: 'CAM-04',
        zoneId: 'zone-05',
        zoneName: 'PATROL RUNWAY',
        severity: 'LOW',
        details: 'Patrol Subject P-05 entering center lane of South sector'
      },
      {
        id: 'evt-cam04-03',
        timestamp: 2.5,
        eventType: 'PERSON_DETECTED',
        targetId: 'P-06',
        cameraId: 'CAM-04',
        zoneId: 'zone-05',
        zoneName: 'PATROL RUNWAY',
        severity: 'LOW',
        details: 'Patrol Subject P-06 detected on eastern flank'
      },
      {
        id: 'evt-cam04-04',
        timestamp: 4.8,
        eventType: 'ZONE_ENTRY',
        targetId: 'P-05',
        cameraId: 'CAM-04',
        zoneId: 'zone-05',
        zoneName: 'PATROL RUNWAY',
        severity: 'MEDIUM',
        details: 'Multi-person convergence: P-04, P-05, P-06 active inside Patrol Runway corridor.',
        alert: {
          id: 'ALERT-004',
          severity: 'MEDIUM',
          type: 'ZONE_INTRUSION',
          status: 'NEW',
          cameraId: 'CAM-04',
          cameraName: 'PATROL CORRIDOR SOUTH',
          zoneId: 'zone-05',
          zoneName: 'PATROL RUNWAY',
          objectId: 'P-05',
          objectClass: 'person',
          confidence: 0.90,
          timestamp: '14:31:48 IST',
          videoTimestamp: 4.8,
          direction: 'MULTI-TARGET CONVERGENCE',
          description: 'GROUP ACTIVITY: Three concurrent subjects (P-04, P-05, P-06) tracked in Patrol Runway corridor.',
          acknowledged: false,
          snapshotUrl: '/simulations/cam-04-footage.mp4',
          relatedCameraIds: ['CAM-04'],
          threatBreakdown: {
            score: 65,
            level: 'HIGH',
            factors: [
              { name: 'GROUP COHESION', weight: 30, description: '3 subjects maintaining concurrent velocity in corridor' },
              { name: 'PATROL RUNWAY CROSSING', weight: 20, description: 'Entry into restricted patrol transit lane' },
              { name: 'MULTI-TRACK CERTAINTY', weight: 15, description: 'DeepSORT tracking persistence > 3.0s without ID swap' }
            ],
            reason: 'Cluster of 3 individuals identified moving through designated patrol runway corridor.'
          },
          metadata: { vector: 'CROSS-SECTOR', groupSize: '3 persons', speed: '4.2 km/h' }
        },
        evidence: {
          id: 'EVD-104',
          eventId: 'EVT-104',
          incidentId: 'INC-8824',
          alertId: 'ALERT-004',
          alertType: 'ZONE_INTRUSION',
          severity: 'MEDIUM',
          timestamp: '14:31:48 IST',
          videoTimestamp: 4.8,
          cameraId: 'CAM-04',
          cameraName: 'PATROL CORRIDOR SOUTH',
          zoneName: 'PATROL RUNWAY',
          objectId: 'P-05',
          confidence: 0.90,
          frameUrl: '/simulations/cam-04-footage.mp4',
          mediaType: 'CLIP',
          mediaUrl: '/simulations/cam-04-footage.mp4',
          fileHash: 'sha256:3c8091819df946e3b87910248c8996fb92427ae41e4649b934ca495991b789ff',
          durationSeconds: 10.01,
          sizeMb: 4.1,
          notes: 'Multi-person convergence recording: P-04, P-05, P-06 at 4.8s',
          status: 'SEALED',
          cryptographicHash: 'sha256:3c8091819df946e3b87910248c8996fb92427ae41e4649b934ca495991b789ff',
          digitalSignature: 'ED25519:1a48c90281be4c0294844018291',
          retainedUntil: '2026-12-31',
          integrityVerified: true,
          chainOfCustody: [
            { timestamp: '14:31:48 IST', actor: 'IBVAP AnomalyNet Daemon', action: 'SEALED_EVIDENCE', notes: 'Multi-target trajectory bundle signed and stored' }
          ]
        }
      }
    ]
  }
};

/**
 * Point-in-polygon ray casting algorithm
 * Tests whether a point (x, y) in 0-100 coordinates falls within polygon points
 */
export function isPointInPolygon(px: number, py: number, polygon: { x: number; y: number }[]): boolean {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > py) !== (yj > py)) && (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Interpolates bounding box and state for a target at an exact video playback timestamp
 */
export function interpolateTargetAtTime(
  target: ScenarioTarget,
  videoTimeSec: number
): { bbox: BoundingBox; confidence: number; speedKmh: number } | null {
  const normTime = videoTimeSec % 10.01;
  if (normTime < target.appearance.startTime || normTime > target.appearance.endTime) {
    return null;
  }

  const traj = target.trajectory;
  if (traj.length === 0) return null;

  // Before first keyframe
  if (normTime <= traj[0].time) {
    const k = traj[0];
    return {
      bbox: { x: k.x, y: k.y, w: k.w, h: k.h },
      confidence: k.confidence,
      speedKmh: k.speedKmh || 3.5
    };
  }

  // After last keyframe
  if (normTime >= traj[traj.length - 1].time) {
    const k = traj[traj.length - 1];
    return {
      bbox: { x: k.x, y: k.y, w: k.w, h: k.h },
      confidence: k.confidence,
      speedKmh: k.speedKmh || 3.5
    };
  }

  // Interpolate between keyframes
  for (let i = 0; i < traj.length - 1; i++) {
    const k1 = traj[i];
    const k2 = traj[i + 1];
    if (normTime >= k1.time && normTime <= k2.time) {
      const dt = k2.time - k1.time;
      const factor = dt > 0 ? (normTime - k1.time) / dt : 0;

      const x = +(k1.x + factor * (k2.x - k1.x)).toFixed(2);
      const y = +(k1.y + factor * (k2.y - k1.y)).toFixed(2);
      const w = +(k1.w + factor * (k2.w - k1.w)).toFixed(2);
      const h = +(k1.h + factor * (k2.h - k1.h)).toFixed(2);
      const confidence = +(k1.confidence + factor * (k2.confidence - k1.confidence)).toFixed(2);
      const speedKmh = +( (k1.speedKmh || 3.5) + factor * ((k2.speedKmh || 3.5) - (k1.speedKmh || 3.5)) ).toFixed(1);

      return {
        bbox: { x, y, w, h },
        confidence,
        speedKmh
      };
    }
  }

  return null;
}

/**
 * Computes active detections for a camera based purely on its video timestamp
 */
export function getActiveDetectionsForCamera(
  cameraId: string,
  videoTimeSec: number,
  baseTimestampStr: string = '14:32:00 IST'
): Detection[] {
  const scenario = CAMERA_SCENARIOS[cameraId];
  if (!scenario) return [];

  const detections: Detection[] = [];

  for (const target of scenario.targets) {
    const interpolated = interpolateTargetAtTime(target, videoTimeSec);
    if (!interpolated) continue;

    // Check which zone target center is inside
    const centerX = interpolated.bbox.x + interpolated.bbox.w / 2;
    const footY = interpolated.bbox.y + interpolated.bbox.h;
    
    let activeZoneName: string | undefined = undefined;
    for (const zone of scenario.zones) {
      if (isPointInPolygon(centerX, footY, zone.points)) {
        activeZoneName = zone.name;
        break;
      }
    }

    detections.push({
      id: `det-${cameraId}-${target.id}`,
      trackingId: target.id,
      class: target.type,
      confidence: interpolated.confidence,
      bbox: interpolated.bbox,
      timestamp: baseTimestampStr,
      cameraId: cameraId,
      zone: activeZoneName,
      speedKmh: interpolated.speedKmh,
      worldX: +(centerX).toFixed(1),
      worldY: +(footY).toFixed(1)
    });
  }

  return detections;
}

/**
 * Computes active target counts across all cameras based on their individual video playback clocks.
 * If a camera is paused, its active counts remain frozen at its current time.
 */
export function getTargetCountsFromClocks(
  cameraPlaybackTimes: Record<string, number>
): { persons: number; vehicles: number; total: number } {
  let persons = 0;
  let vehicles = 0;

  for (const [cameraId, timeSec] of Object.entries(cameraPlaybackTimes)) {
    const scenario = CAMERA_SCENARIOS[cameraId];
    if (!scenario) continue;

    const normTime = timeSec % 10.01;
    for (const target of scenario.targets) {
      if (normTime >= target.appearance.startTime && normTime <= target.appearance.endTime) {
        if (target.type === 'person') {
          persons++;
        } else if (target.type === 'truck' || target.type === 'vehicle') {
          vehicles++;
        }
      }
    }
  }

  return { persons, vehicles, total: persons + vehicles };
}

/**
 * Returns triggered zones for a camera at its current playback timestamp
 */
export function getTriggeredZonesForCamera(
  cameraId: string,
  videoTimeSec: number
): string[] {
  const scenario = CAMERA_SCENARIOS[cameraId];
  if (!scenario) return [];

  const normTime = videoTimeSec % 10.01;
  const triggeredZoneIds: string[] = [];

  for (const event of scenario.events) {
    if (event.severity === 'CRITICAL' || event.eventType === 'PERIMETER_BREACH') {
      // If past breach event timestamp, mark zone triggered
      if (normTime >= event.timestamp && normTime <= event.timestamp + 4.0) {
        if (event.zoneId) triggeredZoneIds.push(event.zoneId);
      }
    }
  }

  return triggeredZoneIds;
}

/**
 * Gets alerts that should be active up to the current camera playback times
 */
export function getSynchronizedAlertsForClocks(
  cameraPlaybackTimes: Record<string, number>
): Alert[] {
  const synchronizedAlerts: Alert[] = [];

  for (const [cameraId, timeSec] of Object.entries(cameraPlaybackTimes)) {
    const scenario = CAMERA_SCENARIOS[cameraId];
    if (!scenario) continue;

    const normTime = timeSec % 10.01;

    for (const event of scenario.events) {
      if (event.alert && normTime >= event.timestamp) {
        synchronizedAlerts.push(event.alert as Alert);
      }
    }
  }

  return synchronizedAlerts;
}
