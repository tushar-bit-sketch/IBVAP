# IBVAP — Intelligent Border Video Analytics Platform
### SIH26187 — AI-Based Intelligent Video Analytics Platform for Border Surveillance Using Existing CCTV Infrastructure

> **Notice**: Prototype demonstration and simulated defense telemetry for the Smart India Hackathon. All biometric profiles, vehicle registration numbers, and operational coordinates are synthetic test data.

---

## 1. Overview
The **Intelligent Border Video Analytics Platform (IBVAP)** transforms legacy analogue and digital border CCTV cameras into a decentralized, edge-first tactical intelligence network. Operating without mandatory cloud connectivity, IBVAP executes real-time object detection, cross-camera DeepSORT tracking, virtual intrusion tripwire analysis, ANPR, synthetic face intelligence, and cryptographic evidence archiving directly at Border Outposts (BOPs).

---

## 2. Core Capabilities

* **Multi-Spectrum Edge Perception**: Live ingestion of optical (visible light), thermal (FLIR LWIR), and night vision (NVG Gen-3) RTSP video streams with software/hardware decoder metrics.
* **Continuous Cross-Camera ReID**: Deep appearance embedding association tracking target entities (`PERSON-042`) across camera boundaries and terrain corridors.
* **Explainable Threat Engine (XAI)**: Mathematical scoring of intrusion severity (+35 Perimeter Breach, +20 Restricted Zone, +12 Night Crawl, +10 Loitering Dwell).
* **Offline-First Resilience & Sync Queue**: Operates completely autonomously during network severed conditions. Queues incidents locally in TimescaleDB and synchronizes automatically upon uplink recovery.
* **Forensic Evidence Vault**: SHA-256 integrity sealing and ED25519 digital signature generation with chain-of-custody logging.
* **14 Coordinated Operational Scenarios**: Deterministic simulation of perimeter breaches, vehicle hotlist intercepts, camera tampering, communication loss, and sensor disagreement.
* **12-Step Automated Jury Presentation Mode**: One-click end-to-end demonstration sequence for competition evaluation.

---

## 3. Technology Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, GSAP.
* **Backend & APIs**: Next.js Route Handlers + RESTful Service Abstraction layer with Server-Sent Events (SSE) streaming.
* **Persistence & Infrastructure**: PostgreSQL 16 (TimescaleDB-ready DDL schema), Redis 7 (In-Memory Broker), Docker Compose.
* **Audio Telemetry**: Web Audio API tactical multi-frequency synthesizer.

---

## 4. Operational Route Hierarchy

* `/` — Mode A: Cinematic Editorial Architecture & Problem Breakdown
* `/command-center` — Mode B: Mission Control Command Matrix & Tactical Radar Map
* `/cameras` & `/cameras/[id]` — Camera Grid, PTZ Controls & Multi-Spectrum View
* `/incidents` — Incident Lifecycle Triage Board (New, Acknowledged, Investigating, Escalated, Resolved, False Positive)
* `/alerts` — Real-Time Breach & Threat Alert Management
* `/detections` — AI Perception Stream & Bounding Box Confidence Metrics
* `/tracking` — Cross-Camera DeepSORT ReID & Spatiotemporal Trajectory Timeline
* `/anpr` — Automatic Number Plate Extraction, OCR Validation & Hotlist Queries
* `/faces` — Synthetic Biometric Mesh & 512-dim ArcFace Embedding Visualizer
* `/zones` — Interactive Polygonal Intrusion Zone Editor & Dwell Threshold Rules
* `/edge-nodes` — BOP-17 Hardware Telemetry, GPU/CPU Load & Sync Queue
* `/system` — Technical Diagnostics, Observability & Performance Benchmarks
* `/evidence` — Sealed Forensic Packages & Cryptographic Hash Verification
* `/reports` — Printable Official Security Dossier Compiler
* `/audit` — Tamper-Evident Chronological Action Ledger
* `/analytics` — 24-Hour Spatiotemporal Trend Charts
* `/settings` — Edge Computer Vision Confidence & Sensitivity Configuration
* `/login` — Role-Based Access Control Terminal (Commander, Operator, Analyst, Auditor, Super Admin)

---

## 5. Quick Start

### Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Production Build
```bash
npm run build
npm run start
```

### Dockerized Deployment
```bash
docker-compose up -d
```

### Keyboard Shortcuts
* `Ctrl + K` or `/`: Open Global Command Palette to search cameras, alerts, plates, and triggers.
* `Esc`: Close drawers, modals, and spotlight search.

---

## 6. Verification & Credibility Disclaimer
IBVAP is designed strictly adhering to defense-tech credibility principles:
* No fabricated claims of real live BSF/SSB connectivity.
* Target metrics (>24 FPS, <100ms latency, <500ms alert time) are explicitly labeled as targets or simulated benchmarks.
* All facial recognition representations utilize synthetic test profiles and Delaunay wireframes.
