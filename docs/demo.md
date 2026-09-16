# IBVAP Jury Presentation & Demo Protocol
**SIH26187 Evaluation Walkthrough (3–5 Minute Guided Flow)**

---

## Presentation Sequence

### Step 1: The Problem & Editorial Architecture (0:00 – 1:00)
1. Open `http://localhost:3000`.
2. Emphasize that India's thousands of border kilometers already have cameras, but operators suffer from visual fatigue.
3. IBVAP converts existing analogue and digital CCTV into an autonomous perception network without replacing cameras.
4. Click **INITIALIZE COMMAND CENTER** and observe the cinematic initialization sequence.

### Step 2: Live Tactical Command Matrix (1:00 – 2:00)
1. In the Command Center, observe 4 live channels (`CAM-01` North Optical, `CAM-02` Thermal FLIR, `CAM-03` Checkpoint Alpha, `CAM-04` Patrol Corridor).
2. Toggle optical modes (`OPT`, `FLIR`, `NVG`) and optical zoom (`1.0x`–`3.5x`).
3. Point out real-time hardware telemetry: `28.8 FPS`, `91ms Inference`, `Uptime 99.98%`.

### Step 3: The 12-Step Automated Jury Demo (2:00 – 3:30)
1. In the top bar, click **START JURY DEMO**.
2. Watch the coordinated progression:
   - Target `PERSON-042` initialized.
   - DeepSORT tracking breadcrumb generated.
   - Subject approaches Zone 01 outer fence.
   - Tripwire breach triggers pulsed red perimeter.
   - Threat Engine calculates explainable score: **`87 / 100`** (`+35 Tripwire`, `+20 Buffer`, `+12 Dwell`, `+10 Confidence`).
   - Cross-camera handoff transitions to `CAM-02` (Thermal LWIR).
   - Operator acknowledges alert.
   - 90-frame incident buffer sealed with SHA-256 cryptographic hash.
   - Incident resolved and recorded in the audit ledger.

### Step 4: Edge-First & Offline Resilience (3:30 – 4:15)
1. Switch the network badge from `ONLINE` to `OFFLINE`.
2. Notice that local camera feeds, bounding boxes, and alert detection continue with zero disruption.
3. Trigger a breach alert — notice the sync queue increments (`1 QUEUED`).
4. Switch back to `ONLINE` — watch the animated sync queue drain automatically (`SYNCING 1/1 → SYNCHRONIZED`).

### Step 5: Forensic Vault & Audit Ledger (4:15 – 5:00)
1. Open `/evidence` to show the sealed cryptographic incident record (`ED25519-SIG-8492-BOP17`).
2. Open `/audit` to verify the immutable ledger of operator decisions.
3. Open `/reports` and preview a printable official dossier.
