// ============================================================================
// IBVAP — AI MODEL TRAINING & EDGE COMPILER SERVICE
// SIH26187 — PRODUCTION COMPUTER VISION LIFECYCLE MANAGEMENT
// ============================================================================

import {
  AIModelRecord,
  DatasetCorpus,
  TrainingJob,
  TrainingHyperparameters,
  EpochMetric,
  ConfusionMatrixData,
  PrecisionRecallPoint,
  QuantizationPrecision,
  EdgeDeviceTarget
} from '@/types/ai';

// ----------------------------------------------------------------------------
// 1. Military & Border Defense Datasets Catalog
// ----------------------------------------------------------------------------

export const DATASET_CATALOG: DatasetCorpus[] = [
  {
    id: 'sih-border-cctv-14k',
    name: 'SIH-Perimeter-CCTV-14k',
    category: 'PERIMETER',
    frameCount: 14820,
    annotationsCount: 42190,
    classes: ['person', 'vehicle', 'truck', 'motorcycle', 'wildlife', 'crawling_intruder'],
    resolution: '1920x1080 & 3840x2160',
    environment: 'Barbed Wire Fencing, Arid Border Scrub, Checkpoint Perimeter',
    description: 'Gold-standard annotated dataset captured across border fence sectors. Includes crawling posture, wire tampering, group approach, and false-positive wildlife rejection.'
  },
  {
    id: 'thar-desert-thermal-ir',
    name: 'Thar-Desert-Thermal-LWIR-9k',
    category: 'THERMAL',
    frameCount: 9240,
    annotationsCount: 26800,
    classes: ['thermal_human', 'vehicle_heat_bloom', 'false_alarm_animal'],
    resolution: '640x512 Uncooled FLIR',
    environment: 'Zero-Lux Pitch Black Desert, Camouflaged Crawlers, Temperature Inversion',
    description: 'Long-Wave Infrared (8-14μm) dataset capturing human thermal gradients against hot sand, heat haze, and nocturnal temperature drops.'
  },
  {
    id: 'checkpoint-alpha-anpr',
    name: 'Checkpoint-HighSpeed-ANPR-6k',
    category: 'ANPR',
    frameCount: 6410,
    annotationsCount: 6410,
    classes: ['ind_high_security_plate', 'military_arrow_plate', 'obscured_dirty_plate'],
    resolution: '1920x1080 Macro Checkpoint',
    environment: 'Direct Headlight Glare, Dust Encrusted, High Velocity Inbound',
    description: 'Annotated Indian standard high-security registration plates (HSRP) and armed forces upward-arrow military vehicle plates under adverse angle and lighting.'
  },
  {
    id: 'himalayan-fog-adverse',
    name: 'Himalayan-Dense-Fog-Adverse-8k',
    category: 'ADVERSE_WEATHER',
    frameCount: 8150,
    annotationsCount: 19400,
    classes: ['person', 'vehicle', 'patrol'],
    resolution: '1920x1080 Optical & IR',
    environment: 'Sub-50m Visibility Fog, Snow Flurries, Dense Haze',
    description: 'Challenging adverse weather corpus synthetically and optically augmented with Mie scattering to train contrast-invariant feature pyramids.'
  }
];

// ----------------------------------------------------------------------------
// 2. Production Neural Model Architecture Registry
// ----------------------------------------------------------------------------

export const INITIAL_AI_MODELS: AIModelRecord[] = [
  {
    id: 'yolov8x-borderguard-v3',
    name: 'YOLOv8x BorderGuard Extreme',
    codeName: 'BORDERGUARD-X34',
    version: '3.4.2-PROD',
    task: 'OBJECT_DETECTION',
    backbone: 'YOLOv8x',
    parametersCountM: 68.2,
    layersCount: 365,
    gflops: 258.4,
    status: 'ACTIVE_PRODUCTION',
    deployedBopNodeId: 'BOP-17',
    precision: 'INT8',
    latencyMs: 11.4,
    edgeFps: 87.7,
    mAP50: 0.948,
    mAP50_95: 0.782,
    f1Score: 0.936,
    weightsPath: '/models/weights/yolov8x_borderguard_int8.engine',
    lastTrainedAt: '2026-09-17 19:45:00 IST',
    trainingDatasetId: 'sih-border-cctv-14k',
    description: 'Primary perimeter intrusion detection engine. Optimized for crawling postures, fence breaching, and rapid group detection with false-alarm suppression.'
  },
  {
    id: 'flir-thermal-lwir-v2',
    name: 'FLIR Thermal LWIR FilterCore',
    codeName: 'THERMAL-LWIR-CORE',
    version: '2.1.0-STABLE',
    task: 'THERMAL_INFRARED',
    backbone: 'Thermal-ResNet50',
    parametersCountM: 42.1,
    layersCount: 284,
    gflops: 142.6,
    status: 'ACTIVE_PRODUCTION',
    deployedBopNodeId: 'BOP-17',
    precision: 'FP16',
    latencyMs: 9.8,
    edgeFps: 102.0,
    mAP50: 0.932,
    mAP50_95: 0.741,
    f1Score: 0.924,
    weightsPath: '/models/weights/flir_thermal_lwir_fp16.engine',
    lastTrainedAt: '2026-09-16 11:20:00 IST',
    trainingDatasetId: 'thar-desert-thermal-ir',
    description: 'Infrared night vision network operating in 8-14μm wavelength. Penetrates camouflage, brush, and total darkness with thermal gradient contouring.'
  },
  {
    id: 'lprnet-defense-ocr',
    name: 'LPRNet Checkpoint Defense OCR',
    codeName: 'LPRNET-MIL-OCR',
    version: '2.4.1-PROD',
    task: 'ANPR_OCR',
    backbone: 'LPRNet-BLSTM',
    parametersCountM: 14.5,
    layersCount: 112,
    gflops: 34.2,
    status: 'ACTIVE_PRODUCTION',
    deployedBopNodeId: 'BOP-17',
    precision: 'INT8',
    latencyMs: 4.8,
    edgeFps: 208.3,
    mAP50: 0.974,
    mAP50_95: 0.886,
    f1Score: 0.971,
    weightsPath: '/models/weights/lprnet_defense_int8.engine',
    lastTrainedAt: '2026-09-15 08:30:00 IST',
    trainingDatasetId: 'checkpoint-alpha-anpr',
    description: 'High-speed license plate detection and sequence recognition with CTC loss. Decodes dusty, damaged, and military upward-arrow registration plates.'
  },
  {
    id: 'deepsort-reid-512',
    name: 'DeepSORT v2.1 Multi-BOP ReID',
    codeName: 'DEEPSORT-REID-512',
    version: '2.1.4',
    task: 'MULTI_CAM_REID',
    backbone: 'DeepSORT-ReID-512',
    parametersCountM: 25.6,
    layersCount: 178,
    gflops: 68.0,
    status: 'STANDBY',
    deployedBopNodeId: 'BOP-04',
    precision: 'FP16',
    latencyMs: 6.2,
    edgeFps: 161.2,
    mAP50: 0.918,
    mAP50_95: 0.712,
    f1Score: 0.910,
    weightsPath: '/models/weights/deepsort_reid_512_fp16.engine',
    lastTrainedAt: '2026-09-14 16:15:00 IST',
    trainingDatasetId: 'sih-border-cctv-14k',
    description: 'Generates 512-dimensional visual embedding vectors to re-identify and track suspects moving across non-overlapping camera sectors and outposts.'
  },
  {
    id: 'border-anomaly-transformer',
    name: 'Perimeter Anomaly Video Transformer',
    codeName: 'ANOMALYNET-VIT',
    version: '1.2.0-EXP',
    task: 'ANOMALY_TRACKING',
    backbone: 'BorderAnomaly-Transformer',
    parametersCountM: 38.4,
    layersCount: 220,
    gflops: 184.0,
    status: 'STANDBY',
    deployedBopNodeId: 'BOP-17',
    precision: 'FP16',
    latencyMs: 18.5,
    edgeFps: 54.0,
    mAP50: 0.895,
    mAP50_95: 0.684,
    f1Score: 0.887,
    weightsPath: '/models/weights/anomalynet_vit_fp16.engine',
    lastTrainedAt: '2026-09-12 14:00:00 IST',
    trainingDatasetId: 'sih-border-cctv-14k',
    description: 'Spatio-temporal attention mechanism analyzing 16-frame window clips to identify crawling, fence scaling, wire snips, and loitering gestures.'
  }
];

// ----------------------------------------------------------------------------
// 3. Mathematical Helpers for Training Convergence
// ----------------------------------------------------------------------------

export function generateInitialEpochMetrics(): EpochMetric[] {
  return [
    { epoch: 1, boxLoss: 2.84, clsLoss: 3.12, dflLoss: 2.15, mAP50: 0.421, mAP50_95: 0.210, precision: 0.48, recall: 0.39, learningRate: 0.001 },
    { epoch: 2, boxLoss: 2.31, clsLoss: 2.45, dflLoss: 1.88, mAP50: 0.534, mAP50_95: 0.295, precision: 0.59, recall: 0.49, learningRate: 0.00098 },
    { epoch: 3, boxLoss: 1.95, clsLoss: 1.98, dflLoss: 1.62, mAP50: 0.642, mAP50_95: 0.380, precision: 0.67, recall: 0.61, learningRate: 0.00095 },
    { epoch: 4, boxLoss: 1.64, clsLoss: 1.58, dflLoss: 1.41, mAP50: 0.725, mAP50_95: 0.468, precision: 0.74, recall: 0.70, learningRate: 0.00090 },
    { epoch: 5, boxLoss: 1.41, clsLoss: 1.29, dflLoss: 1.25, mAP50: 0.789, mAP50_95: 0.542, precision: 0.80, recall: 0.77, learningRate: 0.00085 },
    { epoch: 6, boxLoss: 1.22, clsLoss: 1.05, dflLoss: 1.12, mAP50: 0.835, mAP50_95: 0.610, precision: 0.84, recall: 0.82, learningRate: 0.00078 },
    { epoch: 7, boxLoss: 1.07, clsLoss: 0.88, dflLoss: 1.02, mAP50: 0.871, mAP50_95: 0.665, precision: 0.87, recall: 0.86, learningRate: 0.00070 },
    { epoch: 8, boxLoss: 0.95, clsLoss: 0.74, dflLoss: 0.94, mAP50: 0.898, mAP50_95: 0.710, precision: 0.90, recall: 0.89, learningRate: 0.00060 },
    { epoch: 9, boxLoss: 0.86, clsLoss: 0.62, dflLoss: 0.88, mAP50: 0.921, mAP50_95: 0.745, precision: 0.92, recall: 0.91, learningRate: 0.00050 },
    { epoch: 10, boxLoss: 0.78, clsLoss: 0.53, dflLoss: 0.83, mAP50: 0.942, mAP50_95: 0.776, precision: 0.94, recall: 0.93, learningRate: 0.00038 },
  ];
}

export function computeNextEpochMetric(prev: EpochMetric, epochNumber: number, totalEpochs: number): EpochMetric {
  // Realistic exponential decay with tiny stochastic noise
  const decayFactor = 0.92 + (Math.random() * 0.04 - 0.02);
  const nextBoxLoss = Math.max(0.45, +(prev.boxLoss * decayFactor).toFixed(3));
  const nextClsLoss = Math.max(0.28, +(prev.clsLoss * decayFactor).toFixed(3));
  const nextDflLoss = Math.max(0.65, +(prev.dflLoss * decayFactor).toFixed(3));

  // Asymptotic rise towards 0.965 mAP50
  const maxMap = 0.965;
  const mapDelta = (maxMap - prev.mAP50) * (0.12 + Math.random() * 0.05);
  const nextMap50 = Math.min(0.972, +(prev.mAP50 + mapDelta).toFixed(3));
  const nextMap50_95 = Math.min(0.810, +(nextMap50 * 0.82).toFixed(3));

  const nextPrecision = Math.min(0.96, +(prev.precision + (0.97 - prev.precision) * 0.1).toFixed(2));
  const nextRecall = Math.min(0.95, +(prev.recall + (0.96 - prev.recall) * 0.1).toFixed(2));

  // Cosine annealing learning rate
  const initialLr = 0.001;
  const minLr = 1e-5;
  const currentLr = minLr + 0.5 * (initialLr - minLr) * (1 + Math.cos((Math.PI * epochNumber) / totalEpochs));

  return {
    epoch: epochNumber,
    boxLoss: nextBoxLoss,
    clsLoss: nextClsLoss,
    dflLoss: nextDflLoss,
    mAP50: nextMap50,
    mAP50_95: nextMap50_95,
    precision: nextPrecision,
    recall: nextRecall,
    learningRate: +currentLr.toExponential(2)
  };
}

export function generateConfusionMatrix(map50: number): ConfusionMatrixData {
  // Accuracy scales with mAP
  const truePositivePct = Math.min(96, Math.floor(map50 * 100));
  const falseAlarmPct = 100 - truePositivePct;

  return {
    labels: ['Intruder (Person)', 'Patrol / Guard', 'Border Vehicle', 'Wildlife (Filter)', 'Background Noise'],
    matrix: [
      [Math.floor(truePositivePct * 0.95), 2, 1, 1, 1],
      [1, 94, 2, 1, 2],
      [2, 1, 95, 0, 2],
      [2, 1, 0, 96, 1], // Wildlife correctly rejected
      [1, 2, 1, 1, 95]
    ]
  };
}

export function generatePRCurve(precision: number, recall: number): PrecisionRecallPoint[] {
  const points: PrecisionRecallPoint[] = [];
  for (let r = 0; r <= 10; r++) {
    const rec = r / 10;
    // PR curve naturally slopes downward
    const prec = Math.max(0.3, precision - Math.pow(rec, 2.5) * 0.28 + (Math.random() * 0.02 - 0.01));
    points.push({ recall: rec, precision: +prec.toFixed(3) });
  }
  return points;
}

export function formatTerminalLog(epoch: number, total: number, metric: EpochMetric, batchCount = 462): string {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  const itPerSec = (24 + Math.random() * 8).toFixed(1);
  return `[${timestamp}] Epoch ${epoch.toString().padStart(2, '0')}/${total}: 100%|██████████| ${batchCount}/${batchCount} [00:18, ${itPerSec}it/s, box_loss=${metric.boxLoss.toFixed(3)}, cls_loss=${metric.clsLoss.toFixed(3)}, dfl_loss=${metric.dflLoss.toFixed(3)}, mAP50=${metric.mAP50.toFixed(3)}, P=${metric.precision.toFixed(2)}, R=${metric.recall.toFixed(2)}]`;
}

// ----------------------------------------------------------------------------
// 4. Edge Hardware Quantization & Benchmark Simulation
// ----------------------------------------------------------------------------

export function computeQuantizationBenchmark(
  baseLatencyMs: number,
  baseMap: number,
  precision: QuantizationPrecision,
  device: EdgeDeviceTarget
) {
  let speedup = 1.0;
  let mapDelta = 0.0;
  let memoryReduction = 1.0;

  if (precision === 'FP16') {
    speedup = 2.1;
    mapDelta = -0.001; // virtually 0 loss
    memoryReduction = 0.5;
  } else if (precision === 'INT8') {
    speedup = 3.9;
    mapDelta = -0.004; // 0.4% mAP loss with calibration cache
    memoryReduction = 0.25;
  }

  // Device modifier
  let deviceMultiplier = 1.0;
  if (device === 'JETSON_AGX_ORIN_64GB') deviceMultiplier = 1.0;
  else if (device === 'JETSON_ORIN_NX_16GB') deviceMultiplier = 1.65;
  else if (device === 'ADVANTECH_MIC715_INDUSTRIAL') deviceMultiplier = 1.25;

  const finalLatency = +(baseLatencyMs / speedup * deviceMultiplier).toFixed(1);
  const finalFps = +(1000 / finalLatency).toFixed(1);
  const finalMap = +(baseMap + mapDelta).toFixed(3);

  return {
    latencyMs: finalLatency,
    fps: finalFps,
    mAP50: finalMap,
    vramMb: Math.round(4200 * memoryReduction)
  };
}
