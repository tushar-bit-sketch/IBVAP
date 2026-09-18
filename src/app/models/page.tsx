"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CommandTopBar } from '@/components/common/CommandTopBar';
import { CommandSidebar } from '@/components/common/CommandSidebar';
import { useSimulation } from '@/context/SimulationContext';
import {
  DATASET_CATALOG,
  generateInitialEpochMetrics,
  computeNextEpochMetric,
  generateConfusionMatrix,
  generatePRCurve,
  formatTerminalLog,
  computeQuantizationBenchmark
} from '@/services/aiTrainingService';
import {
  AIModelRecord,
  DatasetCorpus,
  TrainingJob,
  TrainingHyperparameters,
  EpochMetric,
  QuantizationPrecision,
  EdgeDeviceTarget
} from '@/types/ai';
import {
  Cpu,
  Zap,
  Play,
  Square,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  Activity,
  Layers,
  Shield,
  BarChart3,
  Terminal,
  Sliders,
  Flame,
  Binary,
  ArrowRight,
  Database,
  Eye,
  Crosshair,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function ModelsPage() {
  const {
    aiModels,
    activeModelId,
    setActiveModelId,
    deployModelWeights,
    playTacticalSound,
    logAuditAction
  } = useSimulation();

  // Selected model for inspection and tuning
  const [selectedModelId, setSelectedModelId] = useState<string>(activeModelId);
  const selectedModel = aiModels.find(m => m.id === selectedModelId) || aiModels[0];

  // Active view tab
  const [activeTab, setActiveTab] = useState<'MODELS' | 'TRAINING' | 'BENCHMARK' | 'DEPLOY'>('TRAINING');

  // Training Hyperparameters state
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('sih-border-cctv-14k');
  const [epochs, setEpochs] = useState<number>(30);
  const [batchSize, setBatchSize] = useState<number>(16);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [optimizer, setOptimizer] = useState<'AdamW' | 'SGD' | 'Lion'>('AdamW');
  const [augmentations, setAugmentations] = useState({
    mosaic: true,
    mixup: 0.15,
    borderDustHaze: true,
    thermalInversion: false,
    randomErasing: 0.2
  });

  // Training Job Execution State
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(10);
  const [epochHistory, setEpochHistory] = useState<EpochMetric[]>(generateInitialEpochMetrics());
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] PyTorch 2.3.0+cu121 & TensorRT 10.1 backend initialized.',
    '[INFO] Loading dataset SIH-Perimeter-CCTV-14k (14,820 frames, 42,190 annotations).',
    '[INFO] Transfer learning backbone: CSPDarknet53 with PANet neck initialized from border checkpoint.',
    '[TRAIN] Epoch 10/30: 100%|██████████| 462/462 [00:18, 25.1it/s, box_loss=0.780, cls_loss=0.530, dfl_loss=0.830, mAP50=0.942, P=0.94, R=0.93]',
    '[CHECKPOINT] Saved best weights: /models/weights/yolov8x_borderguard_epoch10.pt (mAP50=0.942)'
  ]);

  // Quantization & Deployment State
  const [selectedPrecision, setSelectedPrecision] = useState<QuantizationPrecision>('INT8');
  const [selectedEdgeTarget, setSelectedEdgeTarget] = useState<EdgeDeviceTarget>('JETSON_AGX_ORIN_64GB');
  const [deploySuccessMessage, setDeploySuccessMessage] = useState<string | null>(null);

  // Terminal scroll ref
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal on log update
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollTop = terminalBottomRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Live Training Simulator Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTraining && currentEpoch < epochs) {
      interval = setInterval(() => {
        setCurrentEpoch(prevEpoch => {
          const nextEpoch = prevEpoch + 1;
          const lastMetric = epochHistory[epochHistory.length - 1];
          const newMetric = computeNextEpochMetric(lastMetric, nextEpoch, epochs);

          setEpochHistory(prev => [...prev, newMetric]);

          const logLine = formatTerminalLog(nextEpoch, epochs, newMetric);
          setTerminalLogs(prev => [...prev.slice(-40), logLine]);

          if (nextEpoch >= epochs) {
            setIsTraining(false);
            playTacticalSound('ack');
            const doneLog = `[COMPLETE] Training session completed successfully across ${epochs} epochs. Best mAP@0.5: ${newMetric.mAP50.toFixed(3)}. Weights exported.`;
            setTerminalLogs(prev => [...prev, doneLog]);
            logAuditAction('MODEL_TRAINED', selectedModel.id, `Training completed: ${epochs} epochs, mAP50: ${newMetric.mAP50.toFixed(3)}`);
          }

          return nextEpoch;
        });
      }, 1200); // 1.2s per epoch for responsive presentation
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining, currentEpoch, epochs, epochHistory, selectedModel, playTacticalSound, logAuditAction]);

  const handleStartTraining = () => {
    playTacticalSound('click');
    setIsTraining(true);
    setDeploySuccessMessage(null);
    const startMsg = `[START] Starting fine-tuning run on ${selectedDatasetId} (${epochs} epochs, batch=${batchSize}, lr=${learningRate}, opt=${optimizer})...`;
    setTerminalLogs(prev => [...prev, startMsg]);
  };

  const handleStopTraining = () => {
    playTacticalSound('click');
    setIsTraining(false);
    setTerminalLogs(prev => [...prev, '[ABORT] Training cycle stopped by operator command. Checkpoint saved.']);
  };

  const handleDeployToEdge = () => {
    playTacticalSound('breach');
    deployModelWeights(selectedModel.id, 'BOP-17', selectedPrecision);
    setDeploySuccessMessage(`Model ${selectedModel.name} successfully compiled to TensorRT ${selectedPrecision} and deployed to BOP-17 Sector Alpha!`);
    setTimeout(() => {
      setDeploySuccessMessage(null);
    }, 6000);
  };

  const currentMap50 = epochHistory[epochHistory.length - 1]?.mAP50 || selectedModel.mAP50;
  const currentBoxLoss = epochHistory[epochHistory.length - 1]?.boxLoss || 0.78;
  const currentPrecision = epochHistory[epochHistory.length - 1]?.precision || 0.94;
  const currentRecall = epochHistory[epochHistory.length - 1]?.recall || 0.93;

  const benchmark = computeQuantizationBenchmark(
    selectedModel.latencyMs,
    currentMap50,
    selectedPrecision,
    selectedEdgeTarget
  );

  const confusionData = generateConfusionMatrix(currentMap50);
  const prCurve = generatePRCurve(currentPrecision, currentRecall);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-obsidian text-stone-900 font-sans">
      <CommandTopBar />

      <div className="flex flex-1 overflow-hidden">
        <CommandSidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 font-mono">
          {/* Top Status & Heading */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-sandal-200 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-white border border-sandal-200 text-sandal-700 shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-stone-950 tracking-wider">
                    AI MODEL TRAINING &amp; NEURAL ARCHITECTURE STUDIO
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[9px] text-emerald-800 font-bold">
                    EDGE JETSON DAEMON ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  SIH26187 Defense Vision Core — Fine-tune perimeter detection models, tune hyperparameters, optimize TensorRT INT8 weights, and deploy to active BOP nodes.
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-sandal-50 border border-sandal-200 p-1 rounded">
              <button
                onClick={() => { playTacticalSound('click'); setActiveTab('TRAINING'); }}
                className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                  activeTab === 'TRAINING' ? 'bg-stone-900 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Model Training
              </button>
              <button
                onClick={() => { playTacticalSound('click'); setActiveTab('MODELS'); }}
                className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                  activeTab === 'MODELS' ? 'bg-stone-900 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Model Registry ({aiModels.length})
              </button>
              <button
                onClick={() => { playTacticalSound('click'); setActiveTab('BENCHMARK'); }}
                className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                  activeTab === 'BENCHMARK' ? 'bg-stone-900 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Hardware Benchmarks
              </button>
              <button
                onClick={() => { playTacticalSound('click'); setActiveTab('DEPLOY'); }}
                className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                  activeTab === 'DEPLOY' ? 'bg-stone-900 text-white font-bold shadow-xs' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Edge Deployment
              </button>
            </div>
          </div>

          {/* Success Banner if Deployed */}
          {deploySuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 flex items-center justify-between text-xs shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="font-bold">{deploySuccessMessage}</span>
              </div>
              <span className="text-[10px] text-emerald-700 uppercase tracking-widest font-semibold">
                HARDWARE SYNCHRONIZED
              </span>
            </div>
          )}

          {/* TAB 1: MODEL TRAINING & METRICS */}
          {activeTab === 'TRAINING' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1">
              {/* Left Column: Hyperparameters & Training Controls (4 cols) */}
              <div className="xl:col-span-4 flex flex-col gap-4">
                {/* Active Model Selector Card */}
                <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-sandal-200 pb-2">
                    <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">
                      Target Neural Backbone
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-sandal-100 border border-sandal-200 text-[9px] text-sandal-800 font-bold">
                      {selectedModel.version}
                    </span>
                  </div>

                  <select
                    value={selectedModelId}
                    onChange={(e) => {
                      playTacticalSound('click');
                      setSelectedModelId(e.target.value);
                    }}
                    className="w-full bg-sandal-50 border border-sandal-200 rounded px-2.5 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-stone-400"
                  >
                    {aiModels.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.backbone} · {m.parametersCountM}M params)
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-3 gap-2 text-[10px] bg-sandal-50 p-2 rounded border border-sandal-200">
                    <div>
                      <span className="text-stone-500 block">PARAMS</span>
                      <span className="text-stone-900 font-bold">{selectedModel.parametersCountM}M</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">GFLOPS</span>
                      <span className="text-stone-900 font-bold">{selectedModel.gflops}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">PRECISION</span>
                      <span className="text-emerald-700 font-bold">{selectedModel.precision}</span>
                    </div>
                  </div>
                </div>

                {/* Training Dataset Selector */}
                <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col gap-3">
                  <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider border-b border-sandal-200 pb-2">
                    Training Dataset Corpus
                  </span>

                  <div className="flex flex-col gap-2">
                    {DATASET_CATALOG.map(ds => (
                      <div
                        key={ds.id}
                        onClick={() => { playTacticalSound('click'); setSelectedDatasetId(ds.id); }}
                        className={`p-2 rounded border cursor-pointer transition-all text-xs ${
                          selectedDatasetId === ds.id
                            ? 'border-stone-900 bg-sandal-100/70 font-semibold'
                            : 'border-sandal-200 bg-white hover:bg-sandal-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-stone-950 font-bold">{ds.name}</span>
                          <span className="text-[9px] text-stone-500">{ds.frameCount.toLocaleString()} frames</span>
                        </div>
                        <p className="text-[10px] text-stone-600 mt-1 leading-tight">
                          {ds.environment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hyperparameter Controls */}
                <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col gap-3">
                  <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider border-b border-sandal-200 pb-2 flex items-center justify-between">
                    <span>Hyperparameter Tuning</span>
                    <Sliders className="w-3.5 h-3.5 text-stone-500" />
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-stone-500 block mb-1">EPOCHS: {epochs}</label>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={epochs}
                        disabled={isTraining}
                        onChange={(e) => setEpochs(Number(e.target.value))}
                        className="w-full accent-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-500 block mb-1">BATCH SIZE: {batchSize}</label>
                      <select
                        value={batchSize}
                        disabled={isTraining}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        className="w-full bg-sandal-50 border border-sandal-200 rounded px-2 py-1 text-xs"
                      >
                        <option value={8}>8 (Edge Memory Safe)</option>
                        <option value={16}>16 (Balanced)</option>
                        <option value={32}>32 (Multi-GPU)</option>
                        <option value={64}>64 (Datacenter A100)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-500 block mb-1">LEARNING RATE</label>
                      <select
                        value={learningRate}
                        disabled={isTraining}
                        onChange={(e) => setLearningRate(Number(e.target.value))}
                        className="w-full bg-sandal-50 border border-sandal-200 rounded px-2 py-1 text-xs"
                      >
                        <option value={0.01}>0.01 (Warmup)</option>
                        <option value={0.001}>0.001 (Standard AdamW)</option>
                        <option value={0.0001}>0.0001 (Fine-tune)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-stone-500 block mb-1">OPTIMIZER</label>
                      <select
                        value={optimizer}
                        disabled={isTraining}
                        onChange={(e) => setOptimizer(e.target.value as any)}
                        className="w-full bg-sandal-50 border border-sandal-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="AdamW">AdamW (Cosine Decay)</option>
                        <option value="SGD">SGD (Momentum 0.937)</option>
                        <option value="Lion">Lion (Auto-Regressive)</option>
                      </select>
                    </div>
                  </div>

                  {/* Border Defense Augmentation Toggles */}
                  <div className="pt-2 border-t border-sandal-200 flex flex-col gap-1.5">
                    <span className="text-[9px] text-stone-500 uppercase font-bold">
                      Tactical Augmentation Pipeline
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={augmentations.mosaic}
                          onChange={(e) => setAugmentations(prev => ({ ...prev, mosaic: e.target.checked }))}
                          className="accent-stone-900"
                        />
                        <span>Mosaic 4-Way</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={augmentations.borderDustHaze}
                          onChange={(e) => setAugmentations(prev => ({ ...prev, borderDustHaze: e.target.checked }))}
                          className="accent-stone-900"
                        />
                        <span>Dust / Haze Filter</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={augmentations.thermalInversion}
                          onChange={(e) => setAugmentations(prev => ({ ...prev, thermalInversion: e.target.checked }))}
                          className="accent-stone-900"
                        />
                        <span>Thermal IR Invert</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={augmentations.mixup > 0}
                          onChange={(e) => setAugmentations(prev => ({ ...prev, mixup: e.target.checked ? 0.15 : 0 }))}
                          className="accent-stone-900"
                        />
                        <span>MixUp (α=0.15)</span>
                      </label>
                    </div>
                  </div>

                  {/* Start / Stop Execution Button */}
                  <div className="pt-2">
                    {isTraining ? (
                      <button
                        onClick={handleStopTraining}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>ABORT TRAINING CYCLE</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStartTraining}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>START FINE-TUNING CYCLE</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Training Telemetry, Convergence Curves & Console (8 cols) */}
              <div className="xl:col-span-8 flex flex-col gap-4">
                {/* Live Training Metric Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">mAP@0.5 SCORE</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-emerald-700">{(currentMap50 * 100).toFixed(1)}%</span>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[9px] text-stone-500 mt-1">Target threshold: 92.0%</span>
                  </div>

                  <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">BOX LOSS (L_BOX)</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-stone-950">{currentBoxLoss.toFixed(3)}</span>
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[9px] text-stone-500 mt-1">Converging exponentially</span>
                  </div>

                  <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">PRECISION / RECALL</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-sandal-700">
                        {(currentPrecision * 100).toFixed(0)}% / {(currentRecall * 100).toFixed(0)}%
                      </span>
                      <Shield className="w-4 h-4 text-sandal-600" />
                    </div>
                    <span className="text-[9px] text-stone-500 mt-1">F1 Harmonic Mean: 0.935</span>
                  </div>

                  <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">EPOCH PROGRESS</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xl font-bold text-stone-900">
                        {currentEpoch}/{epochs}
                      </span>
                      {isTraining && <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />}
                    </div>
                    <span className="text-[9px] text-stone-500 mt-1">
                      {isTraining ? 'Training active on GPU cluster' : 'Ready / Standing by'}
                    </span>
                  </div>
                </div>

                {/* Interactive Recharts Loss & mAP Curves */}
                <div className="bg-white border border-sandal-200 rounded p-3 shadow-2xs flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-sandal-200 pb-2">
                    <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-stone-700" />
                      <span>REAL-TIME LOSS CONVERGENCE &amp; mAP VALIDATION CURVES</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {epochHistory.length} checkpoints logged
                    </span>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={epochHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="epoch" tick={{ fontSize: 10 }} label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 3.5]} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="boxLoss" name="Box Loss" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="clsLoss" name="Cls Loss" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="mAP50" name="mAP@0.5" stroke="#10b981" strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Tactical Terminal Logs */}
                <div className="bg-stone-950 text-stone-100 rounded border border-stone-800 p-3 flex flex-col gap-2 font-mono text-[10px] shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 text-stone-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-stone-200 tracking-wider">PYTORCH / ULTRALYTICS ENGINE STDOUT</span>
                    </div>
                    <span className="text-[9px] text-stone-500">CUDA 12.1 // TENSORRT BACKEND</span>
                  </div>

                  <div ref={terminalBottomRef} className="h-36 overflow-y-auto flex flex-col gap-1 select-text scrollbar-thin scrollbar-thumb-stone-700">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="leading-tight">
                        {log.includes('[COMPLETE]') ? (
                          <span className="text-emerald-400 font-bold">{log}</span>
                        ) : log.includes('[CHECKPOINT]') ? (
                          <span className="text-cyan-400">{log}</span>
                        ) : log.includes('[ABORT]') ? (
                          <span className="text-red-400 font-bold">{log}</span>
                        ) : (
                          <span className="text-stone-300">{log}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MODEL REGISTRY */}
          {activeTab === 'MODELS' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {aiModels.map(model => {
                  const isCurrentActive = activeModelId === model.id;

                  return (
                    <div
                      key={model.id}
                      className={`bg-white border rounded p-4 shadow-2xs flex flex-col justify-between transition-all ${
                        isCurrentActive ? 'border-stone-950 ring-1 ring-stone-950' : 'border-sandal-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-stone-500 uppercase font-bold tracking-widest">
                            {model.task.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            isCurrentActive
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-sandal-50 border-sandal-200 text-stone-600'
                          }`}>
                            {isCurrentActive ? 'ACTIVE PRODUCTION' : 'STANDBY'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-stone-950 mt-1">{model.name}</h3>
                        <p className="text-[10px] text-stone-500 font-medium">{model.codeName} · v{model.version}</p>
                        <p className="text-xs text-stone-600 mt-2 leading-snug">{model.description}</p>

                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-sandal-200 text-xs">
                          <div>
                            <span className="text-[10px] text-stone-500 block">BACKBONE</span>
                            <span className="font-bold text-stone-900">{model.backbone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block">PARAMETERS</span>
                            <span className="font-bold text-stone-900">{model.parametersCountM}M</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block">EDGE LATENCY</span>
                            <span className="font-bold text-emerald-700">{model.latencyMs} ms ({model.edgeFps} FPS)</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block">mAP@0.5</span>
                            <span className="font-bold text-sandal-800">{(model.mAP50 * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-sandal-200 flex items-center gap-2 mt-4">
                        {isCurrentActive ? (
                          <div className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Currently Serving BOP-17</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              playTacticalSound('click');
                              setActiveModelId(model.id);
                            }}
                            className="w-full py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
                          >
                            Activate on Edge
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: HARDWARE BENCHMARKS & CONFUSION MATRIX */}
          {activeTab === 'BENCHMARK' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* Left: Quantization Benchmark Card (6 cols) */}
              <div className="xl:col-span-6 bg-white border border-sandal-200 rounded p-4 shadow-2xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-sandal-200 pb-2">
                  <span className="text-xs font-bold text-stone-950 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sandal-700" />
                    <span>Edge Hardware Precision Benchmarks</span>
                  </span>
                  <span className="text-[10px] text-stone-500">NVIDIA TensorRT 10.1</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-1">TARGET EDGE HARDWARE</label>
                    <select
                      value={selectedEdgeTarget}
                      onChange={(e) => setSelectedEdgeTarget(e.target.value as any)}
                      className="w-full bg-sandal-50 border border-sandal-200 rounded px-2.5 py-1.5 text-xs text-stone-900 font-bold"
                    >
                      <option value="JETSON_AGX_ORIN_64GB">Jetson AGX Orin 64GB (BOP-17)</option>
                      <option value="JETSON_ORIN_NX_16GB">Jetson Orin NX 16GB (BOP-04)</option>
                      <option value="ADVANTECH_MIC715_INDUSTRIAL">Advantech MIC-715 (BOP-09)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-500 block mb-1">QUANTIZATION PRECISION</label>
                    <div className="flex items-center gap-1">
                      {(['FP32', 'FP16', 'INT8'] as QuantizationPrecision[]).map(p => (
                        <button
                          key={p}
                          onClick={() => setSelectedPrecision(p)}
                          className={`flex-1 py-1.5 rounded text-xs transition-colors font-bold ${
                            selectedPrecision === p
                              ? 'bg-stone-950 text-white'
                              : 'bg-sandal-50 border border-sandal-200 text-stone-600 hover:text-stone-950'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-sandal-50 rounded border border-sandal-200 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">ESTIMATED LATENCY</span>
                    <span className="text-base font-bold text-emerald-700">{benchmark.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">INFERENCE FPS</span>
                    <span className="text-base font-bold text-stone-950">{benchmark.fps} FPS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">VRAM CONSUMPTION</span>
                    <span className="text-base font-bold text-sandal-800">{benchmark.vramMb} MB</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 leading-relaxed bg-white p-3 rounded border border-sandal-200">
                  <p className="font-bold text-stone-900 mb-1">Quantization Analysis:</p>
                  INT8 quantization utilizes an entropy calibration dataset to quantize FP32 neural activations to 8-bit integers, yielding a ~3.9x speedup on TensorRT tensor cores with an imperceptible 0.4% mAP loss, well within border operational tolerances.
                </div>
              </div>

              {/* Right: Confusion Matrix (6 cols) */}
              <div className="xl:col-span-6 bg-white border border-sandal-200 rounded p-4 shadow-2xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-sandal-200 pb-2">
                  <span className="text-xs font-bold text-stone-950 uppercase tracking-wider flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-emerald-700" />
                    <span>Tactical Confusion Matrix &amp; False-Positive Suppression</span>
                  </span>
                  <span className="text-[10px] text-stone-500">14k Validation Set</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-sandal-200 text-stone-500">
                        <th className="p-1.5 text-left">ACTUAL \ PREDICTED</th>
                        {confusionData.labels.map((lbl, idx) => (
                          <th key={idx} className="p-1.5 text-center">{lbl.split(' ')[0]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {confusionData.matrix.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-sandal-100 hover:bg-sandal-50/50">
                          <td className="p-1.5 font-bold text-stone-900">{confusionData.labels[rIdx]}</td>
                          {row.map((val, cIdx) => {
                            const isDiagonal = rIdx === cIdx;
                            return (
                              <td
                                key={cIdx}
                                className={`p-1.5 text-center font-mono ${
                                  isDiagonal
                                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                                    : val > 2 ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-stone-400'
                                }`}
                              >
                                {val}%
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900">
                  <span className="font-bold">Zero-False-Alarm Guarantee:</span> Wildlife and vegetation false alarms are suppressed with 96% accuracy via spatial-temporal aspect ratio gating, preventing guard fatigue during nocturnal surveillance.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDGE DEPLOYMENT */}
          {activeTab === 'DEPLOY' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-8 bg-white border border-sandal-200 rounded p-4 shadow-2xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-sandal-200 pb-2">
                  <span className="text-xs font-bold text-stone-950 uppercase tracking-wider flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-stone-800" />
                    <span>Edge Hardware Deployment Pipeline</span>
                  </span>
                  <span className="text-[10px] text-stone-500">Autonomous BOP Cluster</span>
                </div>

                <div className="p-4 bg-sandal-50 rounded border border-sandal-200 flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-950">BOP-17 Sector Alpha Edge Hub</h4>
                      <p className="text-[10px] text-stone-500">NVIDIA Jetson AGX Orin 64GB · 275 TOPS · 8x Cortex-A78AE</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ACTIVE UPLINK
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sandal-200 text-[11px]">
                    <div>
                      <span className="text-stone-500 block">CURRENT MODEL</span>
                      <span className="font-bold text-stone-900">{selectedModel.codeName}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">QUANTIZATION</span>
                      <span className="font-bold text-emerald-700">{selectedPrecision} TensorRT</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">INFERENCE LATENCY</span>
                      <span className="font-bold text-stone-900">{benchmark.latencyMs} ms ({benchmark.fps} FPS)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Generated Deployment Artifacts</span>
                  <div className="p-2.5 rounded bg-stone-900 text-stone-200 font-mono text-[10px] flex flex-col gap-1">
                    <div>✓ weights/yolov8x_borderguard_int8.engine (64.2 MB)</div>
                    <div>✓ weights/calibration.cache (1.4 MB)</div>
                    <div>✓ manifest/model_spec_bop17.json (SHA-256: 4f8b91a...c7)</div>
                    <div>✓ scripts/daemon_hot_reload.sh [EXECUTABLE]</div>
                  </div>
                </div>

                <button
                  onClick={handleDeployToEdge}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>DEPLOY COMPILED WEIGHTS TO BOP-17 EDGE NODE</span>
                </button>
              </div>

              <div className="xl:col-span-4 bg-white border border-sandal-200 rounded p-4 shadow-2xs flex flex-col gap-3 text-xs">
                <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider border-b border-sandal-200 pb-2">
                  Edge Deployment Checklist
                </span>

                <div className="flex flex-col gap-2.5 text-[11px] text-stone-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>TensorRT engine compiled with FP16/INT8 kernel fusions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>RTSP direct memory ringbuffer connected to Jetson V4L2 decoder</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cryptographic SHA-256 weight integrity verified</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Fallback baseline model cached locally for zero-cloud resilience</span>
                  </div>
                </div>

                <div className="p-3 bg-sandal-50 rounded border border-sandal-200 text-[10px] text-stone-600 mt-auto">
                  <span className="font-bold text-stone-900 block mb-1">Hot-Reload Support:</span>
                  Edge nodes swap neural weights in memory within 42 milliseconds without dropping RTSP surveillance frames.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
