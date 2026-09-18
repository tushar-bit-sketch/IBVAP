"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Detection, Zone } from '@/types';
import { useSimulation } from '@/context/SimulationContext';
import { RealtimeVisionEngine } from '@/services/realtimeVisionEngine';
import { RealtimeDetectionResult, RealtimeFrameTelemetry, CustomVideoSource } from '@/types/ai';
import { 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Crosshair, 
  ZoomIn, 
  ZoomOut,
  Compass,
  Sliders,
  AlertTriangle,
  Play,
  Pause,
  Upload,
  Camera as CameraIcon,
  X,
  Radio,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Video
} from 'lucide-react';

interface CameraFeedProps {
  camera: Camera;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  showControls?: boolean;
}

export function CameraFeed({
  camera,
  isExpanded = false,
  onToggleExpand,
  showControls = true,
}: CameraFeedProps) {
  const { 
    playTacticalSound, 
    reportCameraPlaybackTime,
    cameraSeekRequests,
    highlightedTargetId,
    highlightedZoneId,
    playbackSpeed,
    isAllPaused,
    inferenceMode,
    setInferenceMode,
    activeModelId,
    aiModels,
    triggerRealtimeCVAlert,
    setCustomFeedForCamera,
    customFeeds
  } = useSimulation();

  const [showBoxes, setShowBoxes] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [filterMode, setFilterMode] = useState<'RAW' | 'IR_SIM' | 'NIGHT_VISION'>('RAW');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [isLocalPaused, setIsLocalPaused] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSeekIdRef = useRef<number>(0);

  // Ingestion Modal State
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customStreamError, setCustomStreamError] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Real-time Computer Vision Frame Processing State
  const [realtimeDetections, setRealtimeDetections] = useState<RealtimeDetectionResult[]>([]);
  const [realtimeTelemetry, setRealtimeTelemetry] = useState<RealtimeFrameTelemetry | null>(null);
  const visionEngineRef = useRef<RealtimeVisionEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastProcessTimeRef = useRef<number>(0);

  const activeModel = aiModels.find(m => m.id === activeModelId) || aiModels[0];
  const customSource = customFeeds[camera.id];

  const videoSrc = camera.videoUrl || camera.feedUrl;
  const isVideo = Boolean(videoSrc && (videoSrc.endsWith('.mp4') || videoSrc.includes('.mp4') || camera.videoUrl || isWebcamActive));

  const isTriggered = camera.activeZones.some(z => z.status === 'TRIGGERED') || 
    (inferenceMode === 'REALTIME_CV' && realtimeDetections.some(d => d.inSterileZone));

  // Initialize Real-time Computer Vision Engine
  useEffect(() => {
    visionEngineRef.current = new RealtimeVisionEngine({
      minConfidence: 0.65,
      motionSensitivity: 40,
      falseAlarmFilter: true,
      activeModelName: activeModel.name,
      sterileZones: camera.activeZones,
      onAlertTriggered: (detection, zoneName) => {
        triggerRealtimeCVAlert(camera.id, {
          objectId: detection.trackingId,
          objectClass: detection.class,
          confidence: detection.confidence,
          zoneName: zoneName,
          description: `REAL-TIME AI CORE: ${detection.class.toUpperCase()} ${detection.trackingId} crossed sterile perimeter zone "${zoneName}" at ${detection.velocityKmh} km/h`
        });
      }
    });

    return () => {
      if (visionEngineRef.current) {
        visionEngineRef.current.reset();
      }
    };
  }, [camera.id, camera.activeZones, activeModel, triggerRealtimeCVAlert]);

  // Real-time Frame Processing Loop
  useEffect(() => {
    if (inferenceMode !== 'REALTIME_CV') {
      setRealtimeDetections([]);
      return;
    }

    let isSubscribed = true;

    const runVisionProcessing = () => {
      if (!isSubscribed) return;

      const now = performance.now();
      // Throttle analysis to ~20 FPS for silky UI performance while maintaining high detection sensitivity
      if (now - lastProcessTimeRef.current > 50) {
        lastProcessTimeRef.current = now;

        if (videoRef.current && !isLocalPaused && !isAllPaused && visionEngineRef.current) {
          const telemetry = visionEngineRef.current.processFrame(videoRef.current, Date.now());
          setRealtimeTelemetry(telemetry);
          setRealtimeDetections(telemetry.detections);
        }
      }

      animFrameRef.current = requestAnimationFrame(runVisionProcessing);
    };

    animFrameRef.current = requestAnimationFrame(runVisionProcessing);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [inferenceMode, isLocalPaused, isAllPaused]);

  // Handle seek requests targeted to this camera
  useEffect(() => {
    const req = cameraSeekRequests?.[camera.id];
    if (req && req.id !== lastSeekIdRef.current && videoRef.current) {
      lastSeekIdRef.current = req.id;
      videoRef.current.currentTime = req.timeSec;
      setPlaybackTime(req.timeSec);
      if (req.pause) {
        videoRef.current.pause();
        setIsLocalPaused(true);
      } else {
        videoRef.current.play().catch(() => {});
        setIsLocalPaused(false);
      }
    }
  }, [cameraSeekRequests, camera.id]);

  // Synchronize playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Synchronize global pause state
  useEffect(() => {
    if (videoRef.current) {
      if (isAllPaused) {
        videoRef.current.pause();
        setIsLocalPaused(true);
      } else {
        videoRef.current.play().catch(() => {});
        setIsLocalPaused(false);
      }
    }
  }, [isAllPaused]);

  // Ensure autoplay starts cleanly
  useEffect(() => {
    if (isVideo && videoRef.current && !hasVideoError && !isAllPaused) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[IBVAP Feed ${camera.id}] Video autoplay awaiting interaction:`, err.message);
        });
      }
    }
  }, [isVideo, videoSrc, hasVideoError, camera.id, isAllPaused]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    playTacticalSound('click');
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsLocalPaused(false);
    } else {
      videoRef.current.pause();
      setIsLocalPaused(true);
    }
  };

  const handleZoom = (delta: number) => {
    playTacticalSound('click');
    setZoomLevel(prev => Math.max(1.0, Math.min(3.5, +(prev + delta).toFixed(1))));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playTacticalSound('click');
    setCustomFile(file);
    const objectUrl = URL.createObjectURL(file);

    const source: CustomVideoSource = {
      id: `custom_file_${Date.now()}`,
      name: file.name,
      type: 'UPLOADED_FILE',
      url: objectUrl,
      file,
      addedAt: new Date().toISOString()
    };

    setCustomFeedForCamera(camera.id, source);
    setIsWebcamActive(false);
    setIsIngestModalOpen(false);
    setHasVideoError(false);
  };

  const handleStartWebcam = async () => {
    try {
      playTacticalSound('click');
      setCustomStreamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      const source: CustomVideoSource = {
        id: `webcam_${Date.now()}`,
        name: 'Live WebCam / Tactical Sensor',
        type: 'LIVE_WEBCAM',
        url: '',
        addedAt: new Date().toISOString()
      };

      setCustomFeedForCamera(camera.id, source);
      setIsWebcamActive(true);
      setIsIngestModalOpen(false);
      setHasVideoError(false);
    } catch (err: any) {
      setCustomStreamError(err?.message || 'Unable to access video device');
    }
  };

  const handleResetToDefaultFeed = () => {
    playTacticalSound('click');
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCustomFeedForCamera(camera.id, null);
    setIsWebcamActive(false);
    setCustomFile(null);
    setIsIngestModalOpen(false);
    setHasVideoError(false);
  };

  const getFilterStyle = () => {
    if (filterMode === 'IR_SIM') {
      return 'filter invert-[85%] hue-rotate-180 contrast-200 brightness-110 saturate-200';
    }
    if (filterMode === 'NIGHT_VISION') {
      return 'filter sepia-[100%] hue-rotate-[90deg] saturate-[300%] contrast-150 brightness-90';
    }
    return 'filter grayscale-[30%] contrast-115 brightness-95';
  };

  return (
    <div 
      className={`group relative overflow-hidden bg-black border transition-all duration-300 flex flex-col ${
        isTriggered 
          ? 'border-red-900/90 shadow-[0_0_25px_rgba(239,68,68,0.25)]' 
          : 'border-neutral-800/80 hover:border-neutral-600'
      } ${isExpanded ? 'h-full w-full' : 'aspect-video w-full rounded-sm'}`}
    >
      {/* Background Camera Video/Image Frame with Zoom transform */}
      <div className="relative w-full h-full flex-1 overflow-hidden bg-black select-none">
        {hasVideoError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-stone-950/95 border border-stone-800 z-10 select-text">
            <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
            <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
              VIDEO SOURCE UNAVAILABLE
            </span>
            <span className="font-mono text-[10px] text-stone-400 mt-1 max-w-xs break-all">
              {videoSrc}
            </span>
            <button
              onClick={handleResetToDefaultFeed}
              className="mt-3 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono text-[10px]"
            >
              Reset to Standard CCTV
            </button>
          </div>
        ) : (
          <div 
            className="w-full h-full transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={isWebcamActive ? undefined : videoSrc}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                preload="auto"
                onTimeUpdate={(e) => {
                  const curr = e.currentTarget.currentTime;
                  setPlaybackTime(curr);
                  if (reportCameraPlaybackTime) {
                    reportCameraPlaybackTime(camera.id, curr);
                  }
                }}
                onError={(e) => {
                  console.error(`[IBVAP Feed] VIDEO SOURCE UNAVAILABLE for ${camera.id} at ${videoSrc}:`, e);
                  setHasVideoError(true);
                }}
                className={`w-full h-full object-cover pointer-events-none transition-all duration-500 ${getFilterStyle()}`}
              />
            ) : (
              <img
                src={camera.feedUrl}
                alt={camera.name}
                className={`w-full h-full object-cover pointer-events-none transition-all duration-500 ${getFilterStyle()}`}
              />
            )}
          </div>
        )}

        {/* Tactical Scanlines & Vignette */}
        <div className="absolute inset-0 scanline-layer opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* In NVG or Thermal Mode: Colored Tint Overlays */}
        {filterMode === 'NIGHT_VISION' && (
          <div className="absolute inset-0 bg-emerald-950/25 mix-blend-color-dodge pointer-events-none" />
        )}
        {filterMode === 'IR_SIM' && (
          <div className="absolute inset-0 bg-cyan-950/20 mix-blend-overlay pointer-events-none" />
        )}

        {/* SVG Overlay Layer: Zones, Bounding Boxes, Vectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Virtual Zones */}
          {showZones && camera.activeZones.map(zone => {
            const pointsStr = zone.points.map(p => `${p.x},${p.y}`).join(' ');
            const isHighlightedZone = zone.id === highlightedZoneId;
            const isBreached = zone.status === 'TRIGGERED' || isHighlightedZone;
            const zoneColor = isBreached ? '#ef4444' : isHighlightedZone ? '#f59e0b' : filterMode === 'NIGHT_VISION' ? '#22c55e' : '#06b6d4';

            return (
              <g key={zone.id}>
                <polygon
                  points={pointsStr}
                  fill={isBreached ? 'rgba(239, 68, 68, 0.28)' : isHighlightedZone ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.08)'}
                  stroke={zoneColor}
                  strokeWidth={isHighlightedZone ? '0.9' : '0.5'}
                  strokeDasharray={isBreached ? 'none' : '1.5 1'}
                  className={isBreached ? 'animate-pulse' : ''}
                />
                {zone.points[0] && (
                  <text
                    x={zone.points[0].x + 1}
                    y={zone.points[0].y + 3}
                    fill={zoneColor}
                    fontSize="2.2"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {zone.name} [{isHighlightedZone ? 'FOCUS' : zone.status}]
                  </text>
                )}
              </g>
            );
          })}

          {/* MODE A: REAL-TIME COMPUTER VISION INFERENCE DETECTIONS */}
          {inferenceMode === 'REALTIME_CV' && showBoxes && realtimeDetections.map((det) => {
            const isBreach = det.inSterileZone;
            const color = isBreach ? '#ef4444' : det.colorHex || '#10b981';

            return (
              <g key={det.id}>
                {/* Target Lock Reticle */}
                <circle
                  cx={det.bbox.x + det.bbox.w / 2}
                  cy={det.bbox.y + det.bbox.h / 2}
                  r={Math.max(det.bbox.w, det.bbox.h) * 0.7}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.4"
                  strokeDasharray="1.5 1"
                  className={isBreach ? 'animate-spin' : ''}
                />

                {/* Bounding Box Rect */}
                <rect
                  x={det.bbox.x}
                  y={det.bbox.y}
                  width={det.bbox.w}
                  height={det.bbox.h}
                  fill={isBreach ? 'rgba(239, 68, 68, 0.15)' : 'none'}
                  stroke={color}
                  strokeWidth="0.6"
                />

                {/* Corner Brackets */}
                <path
                  d={`
                    M ${det.bbox.x},${det.bbox.y + 2} L ${det.bbox.x},${det.bbox.y} L ${det.bbox.x + 2},${det.bbox.y}
                    M ${det.bbox.x + det.bbox.w - 2},${det.bbox.y} L ${det.bbox.x + det.bbox.w},${det.bbox.y} L ${det.bbox.x + det.bbox.w},${det.bbox.y + 2}
                    M ${det.bbox.x},${det.bbox.y + det.bbox.h - 2} L ${det.bbox.x},${det.bbox.y} L ${det.bbox.x + 2},${det.bbox.y + det.bbox.h}
                    M ${det.bbox.x + det.bbox.w - 2},${det.bbox.y + det.bbox.h} L ${det.bbox.x + det.bbox.w},${det.bbox.y + det.bbox.h} L ${det.bbox.x + det.bbox.w},${det.bbox.y + det.bbox.h - 2}
                  `}
                  stroke={color}
                  strokeWidth="0.9"
                  fill="none"
                />

                {/* Velocity & Heading Vector Arrow */}
                {showTrajectory && (
                  <line
                    x1={det.bbox.x + det.bbox.w / 2}
                    y1={det.bbox.y + det.bbox.h / 2}
                    x2={(det.bbox.x + det.bbox.w / 2) + Math.cos((det.headingDeg * Math.PI) / 180) * 5}
                    y2={(det.bbox.y + det.bbox.h / 2) + Math.sin((det.headingDeg * Math.PI) / 180) * 5}
                    stroke={color}
                    strokeWidth="0.5"
                    markerEnd="url(#arrow)"
                  />
                )}

                {/* Real-time Label Badge */}
                <rect
                  x={det.bbox.x}
                  y={Math.max(1, det.bbox.y - 3.8)}
                  width={Math.max(22, det.bbox.w * 1.6)}
                  height="3.6"
                  fill={isBreach ? 'rgba(239, 68, 68, 0.95)' : 'rgba(10, 10, 10, 0.90)'}
                  stroke={color}
                  strokeWidth="0.3"
                />
                <text
                  x={det.bbox.x + 0.8}
                  y={Math.max(3.2, det.bbox.y - 1.2)}
                  fill="#ffffff"
                  fontSize="2"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {isBreach ? 'BREACH ' : 'AI '}{det.class.toUpperCase()} {det.trackingId} {(det.confidence * 100).toFixed(0)}% · {det.velocityKmh}km/h
                </text>
              </g>
            );
          })}

          {/* MODE B: VIDEO-SYNCHRONIZED SCENARIO DETECTIONS */}
          {inferenceMode === 'VIDEO_SYNC' && showBoxes && camera.currentDetections.map((det) => {
            const isHighlighted = det.trackingId === highlightedTargetId;
            const isCritical = det.trackingId === 'P-01' || det.trackingId === 'PERSON-042';
            const color = isHighlighted ? '#f59e0b' : isCritical ? '#ef4444' : filterMode === 'NIGHT_VISION' ? '#22c55e' : '#10b981';

            return (
              <g key={det.id}>
                {isHighlighted && (
                  <g>
                    <circle
                      cx={det.bbox.x + det.bbox.w / 2}
                      cy={det.bbox.y + det.bbox.h / 2}
                      r={Math.max(det.bbox.w, det.bbox.h) * 0.75}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="0.6"
                      strokeDasharray="2 1.5"
                    />
                  </g>
                )}

                <rect
                  x={det.bbox.x}
                  y={det.bbox.y}
                  width={det.bbox.w}
                  height={det.bbox.h}
                  fill={isHighlighted ? 'rgba(245, 158, 11, 0.12)' : 'none'}
                  stroke={color}
                  strokeWidth={isHighlighted ? '0.7' : '0.4'}
                />

                <rect
                  x={det.bbox.x}
                  y={Math.max(1, det.bbox.y - 3.8)}
                  width={Math.max(20, det.bbox.w * 1.6)}
                  height="3.6"
                  fill={isHighlighted ? 'rgba(180, 83, 9, 0.95)' : isCritical ? 'rgba(239, 68, 68, 0.92)' : 'rgba(10, 10, 10, 0.88)'}
                  stroke={color}
                  strokeWidth="0.3"
                />
                <text
                  x={det.bbox.x + 0.8}
                  y={Math.max(3.2, det.bbox.y - 1.2)}
                  fill="#ffffff"
                  fontSize="2"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {isHighlighted ? 'LOCKED ' : ''}{det.class.toUpperCase()} {det.trackingId} {(det.confidence * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* HUD Top Left: Camera ID & Sensor Specs */}
        <div className="absolute top-2 left-2 flex items-center gap-2 pointer-events-none">
          <div className="px-1.5 py-0.5 bg-black/85 border border-neutral-700/80 rounded font-mono text-[10px] font-bold text-white flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isTriggered ? 'bg-tactical-red animate-ping' : 'bg-tactical-green'}`} />
            <span>{camera.id}</span>
          </div>

          <span className="font-mono text-[10px] text-neutral-300 drop-shadow hidden sm:inline">
            {customSource ? customSource.name : camera.name}
          </span>

          {inferenceMode === 'REALTIME_CV' ? (
            <span className="px-1.5 py-0.5 bg-emerald-950/90 border border-emerald-500 rounded font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>REAL-TIME AI [{activeModel.precision}]</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-stone-900/90 border border-stone-700/80 rounded font-mono text-[9px] text-amber-300 font-semibold">
              SCENARIO SYNC
            </span>
          )}

          {isTriggered && (
            <span className="px-1.5 py-0.5 bg-red-950/90 border border-red-700 rounded font-mono text-[9px] font-bold text-red-300 animate-pulse">
              PERIMETER BREACH
            </span>
          )}
        </div>

        {/* HUD Top Right: Telemetry & Optics Specs */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 pointer-events-none font-mono text-[9px] text-neutral-300">
          <span className="px-1.5 py-0.5 bg-black/85 border border-amber-600/70 rounded text-amber-400 font-mono font-bold">
            T+{playbackTime.toFixed(1)}s
          </span>
          <span className="px-1.5 py-0.5 bg-black/80 border border-neutral-800 rounded">
            {camera.resolution}
          </span>
          <span className="px-1.5 py-0.5 bg-black/80 border border-neutral-800 rounded text-tactical-green">
            {realtimeTelemetry?.fps || camera.fps} FPS
          </span>
          <span className="px-1.5 py-0.5 bg-black/80 border border-neutral-800 rounded text-tactical-cyan">
            {realtimeTelemetry?.inferenceLatencyMs ? `${realtimeTelemetry.inferenceLatencyMs}ms` : `${activeModel.latencyMs}ms`}
          </span>
          <span className="px-1.5 py-0.5 bg-black/80 border border-neutral-800 rounded text-stone-300 hidden md:inline">
            ZOOM: {zoomLevel.toFixed(1)}X
          </span>
        </div>

        {/* HUD Center Crosshair when expanded */}
        {isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <Crosshair className="w-16 h-16 text-neutral-300 stroke-1" />
          </div>
        )}

        {/* HUD Bottom Left: Active Neural Model & Spectrum Tag */}
        <div className="absolute bottom-2 left-2 font-mono text-[9px] text-neutral-400 pointer-events-none flex items-center gap-2">
          <span className="bg-black/85 px-2 py-0.5 rounded border border-neutral-800/80">
            MODEL: <span className="text-white font-bold">{activeModel.codeName}</span>
          </span>
          <span className="hidden lg:inline bg-black/85 px-2 py-0.5 rounded border border-neutral-800/80 text-neutral-300">
            SPECTRUM: {filterMode === 'IR_SIM' ? 'FLIR LWIR 8-14μm' : filterMode === 'NIGHT_VISION' ? 'NVG GEN-3' : 'OPTICAL 4K'}
          </span>
        </div>

        {/* HUD Bottom Right: Interactive Controls & Filters */}
        {showControls && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/85 border border-neutral-800 rounded p-0.5 backdrop-blur-sm">
            {/* Real-time AI vs Scenario Mode Toggle */}
            <button
              onClick={() => {
                playTacticalSound('click');
                setInferenceMode(inferenceMode === 'REALTIME_CV' ? 'VIDEO_SYNC' : 'REALTIME_CV');
              }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors font-bold ${
                inferenceMode === 'REALTIME_CV'
                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-600'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
              title="Switch between Real-Time Computer Vision Inference and Deterministic Scenario Mode"
            >
              {inferenceMode === 'REALTIME_CV' ? 'AI: REAL-TIME' : 'AI: SYNC'}
            </button>

            {/* Custom Feed Ingestion Button */}
            <button
              onClick={() => {
                playTacticalSound('click');
                setIsIngestModalOpen(true);
              }}
              className="px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors bg-stone-900 text-amber-400 hover:text-white border border-stone-700 flex items-center gap-0.5"
              title="Upload Custom Border Video or WebCam"
            >
              <Upload className="w-2.5 h-2.5" />
              <span>INGEST</span>
            </button>

            {/* Play/Pause Feed Toggle */}
            <button
              onClick={togglePlayPause}
              className="px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors mr-0.5 border-r border-neutral-800 pr-1.5 flex items-center gap-1 text-stone-300 hover:text-white"
              title={isLocalPaused ? 'Resume video playback' : 'Pause video playback'}
            >
              {isLocalPaused ? <Play className="w-2.5 h-2.5 text-emerald-400" /> : <Pause className="w-2.5 h-2.5 text-amber-400" />}
              <span>{isLocalPaused ? 'PAUSED' : 'LIVE'}</span>
            </button>

            {/* Filter Mode Selector */}
            <div className="flex items-center gap-0.5 mr-1 border-r border-neutral-800 pr-1">
              <button
                onClick={() => { playTacticalSound('click'); setFilterMode('RAW'); }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  filterMode === 'RAW' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Optical RGB Mode"
              >
                OPT
              </button>
              <button
                onClick={() => { playTacticalSound('click'); setFilterMode('IR_SIM'); }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  filterMode === 'IR_SIM' ? 'bg-cyan-900 text-cyan-200 font-bold border border-cyan-700' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Thermal FLIR Infrared Mode"
              >
                FLIR
              </button>
              <button
                onClick={() => { playTacticalSound('click'); setFilterMode('NIGHT_VISION'); }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                  filterMode === 'NIGHT_VISION' ? 'bg-emerald-900 text-emerald-200 font-bold border border-emerald-700' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Night Vision Phosphor Mode"
              >
                NVG
              </button>
            </div>

            {/* Overlays Toggles */}
            <button
              onClick={() => { playTacticalSound('click'); setShowBoxes(!showBoxes); }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                showBoxes ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Toggle AI Bounding Boxes"
            >
              BOX
            </button>
            <button
              onClick={() => { playTacticalSound('click'); setShowZones(!showZones); }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                showZones ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Toggle Intrusion Polygons"
            >
              ZONE
            </button>
            <button
              onClick={() => { playTacticalSound('click'); setShowTrajectory(!showTrajectory); }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors ${
                showTrajectory ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Toggle Motion Vectors"
            >
              TRAJ
            </button>

            {/* Optical Zoom Controls */}
            <div className="flex items-center gap-0.5 ml-1 border-l border-neutral-800 pl-1">
              <button
                onClick={() => handleZoom(0.5)}
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleZoom(-0.5)}
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
            </div>

            {onToggleExpand && (
              <button
                onClick={() => { playTacticalSound('click'); onToggleExpand(); }}
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-0.5"
                title={isExpanded ? 'Compress View' : 'Cinematic Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Custom Video Ingestion Modal */}
      {isIngestModalOpen && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex flex-col p-4 font-mono text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>INGEST CUSTOM SURVEILLANCE FEED [{camera.id}]</span>
            </div>
            <button
              onClick={() => setIsIngestModalOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-stone-400 text-[11px] mb-3 leading-relaxed">
            Test the real-time AI perimeter detection engine on your own surveillance video footage or connect an external camera / webcam.
          </p>

          <div className="flex flex-col gap-3">
            {/* File Upload Option */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded flex flex-col gap-2">
              <span className="text-stone-300 font-bold text-[11px]">Option 1: Upload Surveillance Video File (MP4/WebM)</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-white rounded font-bold text-center transition-colors"
              >
                Select Video File from Disk...
              </button>
            </div>

            {/* Live Camera Option */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded flex flex-col gap-2">
              <span className="text-stone-300 font-bold text-[11px]">Option 2: Connect Live Optical Camera / WebCam</span>
              <button
                onClick={handleStartWebcam}
                className="py-2 px-3 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 rounded font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <CameraIcon className="w-3.5 h-3.5" />
                <span>Initialize Live WebCam Feed</span>
              </button>
              {customStreamError && (
                <span className="text-red-400 text-[10px] mt-1">{customStreamError}</span>
              )}
            </div>

            {/* Restore Standard Feed */}
            {customSource && (
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded flex flex-col gap-2">
                <span className="text-stone-300 font-bold text-[11px]">Option 3: Restore Standard Border Footage</span>
                <button
                  onClick={handleResetToDefaultFeed}
                  className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded font-bold text-center transition-colors"
                >
                  Restore Default Feed
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
