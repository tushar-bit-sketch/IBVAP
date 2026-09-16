# IBVAP REST API & Streaming Specification
**SIH26187 Edge Computing Interface**

---

## 1. System & Health Endpoints

### `GET /api/health`
Returns overall health status of the edge computing daemon and connected storage/broker subsystems.

### `GET /api/system/status`
Returns real-time hardware telemetry, inference queue depth, and memory consumption.

---

## 2. Camera Management Endpoints

### `GET /api/cameras`
Query active surveillance cameras. Supports optional query parameters: `sector`, `status`.

### `GET /api/cameras/:id`
Returns real-time stream health, resolution, FPS, active polygon zones, and detections for a camera.

### `POST /api/cameras`
Registers a new RTSP stream into the edge ingestion queue.

### `POST /api/cameras/:id/test`
Performs an active RTSP handshake and latency round-trip benchmark.

---

## 3. Alerts & Incident Endpoints

### `GET /api/alerts`
Query security alerts. Filters: `severity`, `status`, `cameraId`.

### `POST /api/alerts`
Emits a new security incident into the triage queue.

### `POST /api/alerts/:id/acknowledge`
Records operator acknowledgment into the tamper-evident audit ledger.

### `POST /api/alerts/:id/resolve`
Resolves an incident or flags it as a false positive, updating edge sensitivity algorithms.

---

## 4. Tracking & Intelligence Endpoints

### `GET /api/tracks`
Returns active tracked entities and spatiotemporal trajectory history.

### `GET /api/tracks/:id`
Returns cross-camera handoff waypoints and velocity analytics for an entity (e.g. `PERSON-042`).

### `GET /api/anpr`
Query license plate OCR readings, confidence values, and hotlist flags.

### `GET /api/faces`
Query synthetic face matching scores and 512-dim ArcFace embedding vectors.

---

## 5. Zones, Evidence & Reports

### `GET /api/zones` & `POST /api/zones`
Manage polygonal perimeter tripwires and dwell rules.

### `GET /api/evidence` & `GET /api/evidence/:id`
Inspect sealed forensic packages with SHA-256 cryptographic hashes and chain-of-custody logs.

### `POST /api/reports/generate`
Generates printable, digitally signed forensic dossiers.

---

## 6. Real-Time Streaming

### `GET /api/events/stream`
Server-Sent Events (SSE) real-time streaming endpoint for camera telemetry, breach events, and heartbeats.
