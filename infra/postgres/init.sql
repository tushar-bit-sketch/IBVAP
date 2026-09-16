-- ============================================================================
-- IBVAP — INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM
-- SIH26187 EDGE DATABASE DDL SPECIFICATION (PostgreSQL 16 + TimescaleDB)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Operator RBAC & Sessions
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    callsign VARCHAR(64) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) REFERENCES roles(id),
    station VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Border Outpost (BOP) & Edge Nodes
CREATE TABLE IF NOT EXISTS bop_nodes (
    id VARCHAR(32) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    sector VARCHAR(128) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    status VARCHAR(32) DEFAULT 'ONLINE',
    threat_level VARCHAR(32) DEFAULT 'LOW',
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS edge_nodes (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    bop_id VARCHAR(32) REFERENCES bop_nodes(id),
    cpu_cores INT DEFAULT 12,
    ram_gb DOUBLE PRECISION DEFAULT 16.0,
    vram_gb DOUBLE PRECISION DEFAULT 12.0,
    network_mode VARCHAR(32) DEFAULT 'ONLINE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cameras & Stream Telemetry
CREATE TABLE IF NOT EXISTS cameras (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    sector VARCHAR(128) NOT NULL,
    edge_node_id VARCHAR(32) REFERENCES edge_nodes(id),
    rtsp_url TEXT NOT NULL,
    feed_type VARCHAR(32) NOT NULL,
    resolution VARCHAR(32) DEFAULT '1920x1080',
    target_fps INT DEFAULT 30,
    status VARCHAR(32) DEFAULT 'ONLINE',
    ai_status VARCHAR(32) DEFAULT 'OPTIMAL',
    model VARCHAR(128) NOT NULL,
    ptz_support BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS camera_health (
    id BIGSERIAL PRIMARY KEY,
    camera_id VARCHAR(32) REFERENCES cameras(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fps DOUBLE PRECISION NOT NULL,
    latency_ms INT NOT NULL,
    jitter_ms DOUBLE PRECISION NOT NULL,
    packet_loss_percent DOUBLE PRECISION NOT NULL,
    bitrate_kbps INT NOT NULL,
    gpu_utilization INT NOT NULL,
    decoder_state VARCHAR(32) DEFAULT 'HARDWARE'
);
CREATE INDEX IF NOT EXISTS idx_cam_health_ts ON camera_health(camera_id, timestamp DESC);

-- 4. Virtual Perimeter Zones & Rules
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(64) PRIMARY KEY,
    camera_id VARCHAR(32) REFERENCES cameras(id),
    name VARCHAR(128) NOT NULL,
    zone_type VARCHAR(64) NOT NULL,
    sensitivity DOUBLE PRECISION DEFAULT 0.90,
    polygon_points JSONB NOT NULL,
    dwell_threshold_seconds INT DEFAULT 45,
    direction_filter VARCHAR(32) DEFAULT 'ENTRY',
    alert_severity VARCHAR(32) DEFAULT 'CRITICAL',
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Detections & Trajectories
CREATE TABLE IF NOT EXISTS detections (
    id VARCHAR(64) PRIMARY KEY,
    camera_id VARCHAR(32) REFERENCES cameras(id),
    tracking_id VARCHAR(64) NOT NULL,
    class VARCHAR(32) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    bbox JSONB NOT NULL,
    speed_kmh DOUBLE PRECISION,
    loiter_seconds INT DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_detections_ts ON detections(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_detections_track ON detections(tracking_id);

CREATE TABLE IF NOT EXISTS tracks (
    tracking_id VARCHAR(64) PRIMARY KEY,
    class VARCHAR(32) NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    confidence DOUBLE PRECISION NOT NULL,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_camera_id VARCHAR(32) REFERENCES cameras(id),
    current_zone VARCHAR(128),
    speed_kmh DOUBLE PRECISION DEFAULT 0.0,
    dwell_seconds INT DEFAULT 0,
    threat_score INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS track_waypoints (
    id BIGSERIAL PRIMARY KEY,
    tracking_id VARCHAR(64) REFERENCES tracks(tracking_id),
    camera_id VARCHAR(32) REFERENCES cameras(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(128) NOT NULL,
    event VARCHAR(64) NOT NULL,
    dwell_seconds INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_track_wp_track ON track_waypoints(tracking_id, timestamp ASC);

-- 6. ANPR & Vehicle Registry
CREATE TABLE IF NOT EXISTS license_plates (
    id VARCHAR(64) PRIMARY KEY,
    camera_id VARCHAR(32) REFERENCES cameras(id),
    plate_number VARCHAR(32) NOT NULL,
    vehicle_type VARCHAR(32) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    ocr_confidence DOUBLE PRECISION NOT NULL,
    format_valid BOOLEAN DEFAULT TRUE,
    status VARCHAR(32) DEFAULT 'NORMAL',
    direction VARCHAR(32) DEFAULT 'INBOUND',
    speed_kmh DOUBLE PRECISION DEFAULT 0.0,
    crop_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_plate_num ON license_plates(plate_number);

-- 7. Face Biometrics & Watchlists (Synthetic Identities)
CREATE TABLE IF NOT EXISTS synthetic_faces (
    id VARCHAR(64) PRIMARY KEY,
    database_id VARCHAR(64) NOT NULL,
    subject_name VARCHAR(128) NOT NULL,
    match_score DOUBLE PRECISION NOT NULL,
    watchlist_status VARCHAR(64) DEFAULT 'CLEAR',
    embedding_hex TEXT NOT NULL,
    camera_id VARCHAR(32) REFERENCES cameras(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Alerts & Security Incidents
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    severity VARCHAR(32) NOT NULL,
    type VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'NEW',
    camera_id VARCHAR(32) REFERENCES cameras(id),
    zone_id VARCHAR(64) REFERENCES zones(id),
    object_id VARCHAR(64) NOT NULL,
    object_class VARCHAR(32) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    threat_score INT NOT NULL,
    threat_factors JSONB NOT NULL,
    threat_reason TEXT NOT NULL,
    description TEXT NOT NULL,
    snapshot_url TEXT,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(64),
    resolved_by VARCHAR(64),
    resolution_notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status, timestamp DESC);

-- 9. Forensic Evidence & Cryptographic Chain of Custody
CREATE TABLE IF NOT EXISTS evidence (
    id VARCHAR(64) PRIMARY KEY,
    alert_id VARCHAR(64) REFERENCES alerts(id),
    camera_id VARCHAR(32) REFERENCES cameras(id),
    object_id VARCHAR(64) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    frame_url TEXT NOT NULL,
    cryptographic_hash VARCHAR(128) NOT NULL, -- SHA-256
    digital_signature VARCHAR(128) NOT NULL, -- ED25519
    retained_until DATE NOT NULL,
    integrity_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chain_of_custody (
    id BIGSERIAL PRIMARY KEY,
    evidence_id VARCHAR(64) REFERENCES evidence(id),
    actor VARCHAR(128) NOT NULL,
    action VARCHAR(128) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_coc_ev ON chain_of_custody(evidence_id, timestamp ASC);

-- 10. Tamper-Evident Audit Ledger
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    result VARCHAR(32) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_logs(timestamp DESC);

-- 11. Offline Sync Queue (Edge -> Central Synchronization)
CREATE TABLE IF NOT EXISTS sync_queue (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING',
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_sync_pending ON sync_queue(status, created_at ASC);
