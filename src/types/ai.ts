// ============================================================================
// IBVAP — AI MODEL TRAINING, INFERENCE & EDGE OPTIMIZATION TYPES
// SIH26187 — HIGH-PERFORMANCE COMPUTER VISION TYPE SYSTEM
// ============================================================================

import { DetectionClass, BoundingBox, AlertSeverity } from './index';

export type ModelBackbone = 
  | 'YOLOv8n'
  | 'YOLOv8s'
  | 'YOLOv8m'
  | 'YOLOv8l'
  | 'YOLOv8x'
  | 'Thermal-ResNet50'
  | 'LPRNet-BLSTM'
  | 'DeepSORT-ReID-512'
  | 'BorderAnomaly-Transformer';

export type OptimizerType = 'AdamW' | 'SGD' | 'Lion' | 'RMSprop';

export type QuantizationPrecision = 'FP32' | 'FP16' | 'INT8';

export type EdgeDeviceTarget = 
  | 'JETSON_AGX_ORIN_64GB'
  | 'JETSON_ORIN_NX_16GB'
  | 'ADVANTECH_MIC715_INDUSTRIAL'
  | 'GENERIC_CUDA_EDGE';

export type ModelDeploymentStatus = 'ACTIVE_PRODUCTION' | 'STANDBY' | 'TRAINING' | 'ARCHIVED';

export interface ModelAugmentationConfig {
  mosaic: boolean; // 4-image mosaic mix
  mixup: number; // 0.0 - 1.0
  borderDustHaze: boolean; // Synthetic Thar desert dust / haze filter
  thermalInversion: boolean; // FLIR LWIR inverted spectrum simulation
  perspectiveDistortion: number; // 0.0 - 0.5
  randomErasing: number; // 0.0 - 0.5 (occlusion simulation)
}

export interface TrainingHyperparameters {
  backbone: ModelBackbone;
  epochs: number;
  batchSize: number;
  imageSize: number; // e.g. 640 or 1280
  learningRate: number; // e.g. 0.001
  optimizer: OptimizerType;
  weightDecay: number;
  iouThreshold: number; // NMS threshold e.g. 0.45
  confThreshold: number; // Min confidence e.g. 0.25
  augmentations: ModelAugmentationConfig;
}

export interface EpochMetric {
  epoch: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
  mAP50: number;
  mAP50_95: number;
  precision: number;
  recall: number;
  learningRate: number;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][]; // Row: true, Col: predicted
}

export interface PrecisionRecallPoint {
  recall: number;
  precision: number;
}

export interface DatasetCorpus {
  id: string;
  name: string;
  category: 'PERIMETER' | 'THERMAL' | 'ANPR' | 'ADVERSE_WEATHER';
  frameCount: number;
  annotationsCount: number;
  classes: string[];
  resolution: string;
  environment: string;
  description: string;
}

export interface AIModelRecord {
  id: string;
  name: string;
  codeName: string;
  version: string;
  task: 'OBJECT_DETECTION' | 'THERMAL_INFRARED' | 'ANPR_OCR' | 'MULTI_CAM_REID' | 'ANOMALY_TRACKING';
  backbone: ModelBackbone;
  parametersCountM: number;
  layersCount: number;
  gflops: number;
  status: ModelDeploymentStatus;
  deployedBopNodeId: string;
  precision: QuantizationPrecision;
  latencyMs: number; // on Jetson AGX Orin
  edgeFps: number;
  mAP50: number;
  mAP50_95: number;
  f1Score: number;
  weightsPath: string;
  lastTrainedAt: string;
  trainingDatasetId: string;
  description: string;
}

export interface TrainingJob {
  id: string;
  modelId: string;
  datasetId: string;
  hyperparameters: TrainingHyperparameters;
  currentEpoch: number;
  totalEpochs: number;
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED' | 'ABORTED';
  startedAt: string;
  completedAt?: string;
  epochHistory: EpochMetric[];
  confusionMatrix: ConfusionMatrixData;
  prCurve: PrecisionRecallPoint[];
  currentLoss: number;
  bestMap50: number;
  logs: string[];
  edgeDeploymentTarget: EdgeDeviceTarget;
}

// ----------------------------------------------------------------------------
// Real-Time Computer Vision & Detection Types
// ----------------------------------------------------------------------------

export interface RealtimeDetectionResult {
  id: string;
  trackingId: string;
  class: DetectionClass;
  confidence: number;
  bbox: BoundingBox;
  velocityKmh: number;
  headingDeg: number;
  centroid: { x: number; y: number };
  loiteringSeconds: number;
  inSterileZone: boolean;
  zoneBreached?: string;
  colorHex: string;
}

export interface RealtimeFrameTelemetry {
  frameIndex: number;
  fps: number;
  inferenceLatencyMs: number;
  detectedCount: number;
  activeTracksCount: number;
  activeModel: string;
  detections: RealtimeDetectionResult[];
  rawDetections: number;
  filteredFalseAlarms: number;
}

export interface CustomVideoSource {
  id: string;
  name: string;
  type: 'UPLOADED_FILE' | 'LIVE_WEBCAM' | 'CUSTOM_RTSP' | 'PRESET_DEMO';
  url: string;
  file?: File;
  resolution?: string;
  duration?: number;
  addedAt: string;
}
