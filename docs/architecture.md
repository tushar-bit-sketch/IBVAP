# IBVAP Technical Architecture Specification
**SIH26187 — AI-BASED INTELLIGENT VIDEO ANALYTICS PLATFORM FOR BORDER SURVEILLANCE USING EXISTING CCTV INFRASTRUCTURE**

---

## 1. End-to-End Surveillance Pipeline

IBVAP transforms legacy analogue and digital border CCTV cameras into a decentralized, edge-first tactical intelligence network.

```
┌─────────────────┐
│ EXISTING CCTV   │ (Analog via IP encoder, IP RTSP, Thermal FLIR, Night Vision NVG)
└────────┬────────┘
         │ RTSP / ONVIF Stream Ingestion
         ▼
┌─────────────────┐
│ NVDEC INGESTION │ Hardware-accelerated frame buffer with 90-frame circular cache
└────────┬────────┘
         │ 1080p @ 30 FPS Sampling
         ▼
┌─────────────────┐
│ YOLOv8x INFERENCE│ TensorRT FP16: Person, Vehicle, Truck, Motorcycle, Vessel (22ms)
└────────┬────────┘
         │ Bounding Boxes & Classes
         ▼
┌─────────────────┐
│ DEEPSORT ReID   │ Spatiotemporal Kalman filter, cross-camera ReID embeddings
└────────┬────────┘
         │ Continuous Identity: PERSON-042 (CAM-01 -> CAM-02 -> CAM-03)
         ▼
┌─────────────────┐
│ POLYGON ZONES   │ Geometric tripwire & restricted buffer intersection test
└────────┬────────┘
         │ Violation event emitted
         ▼
┌─────────────────┐
│ THREAT SCORING  │ Explainable factor engine (+35 Tripwire, +20 Zone, +12 Night, +10 Dwell)
└────────┬────────┘
         │ Score 87 / 100 (CRITICAL)
         ▼
┌─────────────────┐
│ REAL-TIME ALERT │ Local Redis broadcast (<420ms end-to-end latency)
└────────┬────────┘
         │ Operator Acknowledges / Resolves
         ▼
┌─────────────────┐
│ EVIDENCE SEAL   │ SHA-256 hash + ED25519 digital signature of pre/post incident buffer
└────────┬────────┘
         │
         ▼
┌────────────────────────────────────────────────────────┐
│ OFFLINE-FIRST SYNCHRONIZATION ENGINE                    │
│ - Online: Instant async sync to Central Command HQ     │
│ - Offline: Local TimescaleDB queue; drains on restore   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Key Subsystems

### A. Explainable Artificial Intelligence (XAI)
Every alert provides a granular mathematical justification of its threat classification:
* **Perimeter Crossing Factor**: `+35`
* **Restricted Zone Buffer Entry**: `+20`
* **Night-Time / Thermal Crawl Signature**: `+12`
* **Loitering / Dwell Ceiling Exceeded**: `+10`
* **Cross-Camera Continuity Verified**: `+10`

### B. Cross-Camera Entity Continuity
Rather than treating feeds in isolation, IBVAP computes deep appearance embeddings and spatiotemporal graphs, maintaining target tracking across non-overlapping camera handoffs (e.g. `CAM-01` North Fence → `CAM-02` Thermal East).

### C. Cryptographic Evidence Chain of Custody
Every breach snapshot and video clip is sealed with an immediate SHA-256 hash and signed with the outpost edge key (`ED25519-SIG-8492-BOP17`). Any subsequent inspection or export verifies tamper status in real-time.

### D. Offline-First Autonomous Edge Operation
In border areas subject to electronic warfare, terrain obstruction, or fiber cuts, the edge daemon runs fully autonomously on NVIDIA Jetson / Orin hardware. Telemetry and incidents queue locally in TimescaleDB and flush automatically when uplink connectivity is restored.
