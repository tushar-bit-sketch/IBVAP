# IBVAP Deployment & Edge Configuration Guide
**SIH26187 Autonomous Border Outpost Deployment**

---

## 1. Hardware Architecture Requirements

### Edge Node (Per Border Outpost / BOP)
* **Compute Unit**: NVIDIA Jetson AGX Orin 64GB / Industrial Rugged PC with RTX 4000 Ada
* **Host OS**: Ubuntu 22.04 LTS (Kernel 5.15 / JetPack 5.1.2)
* **Acceleration**: CUDA 12.2, cuDNN 8.9, TensorRT 8.6
* **Memory**: Minimum 16 GB unified RAM/VRAM
* **Storage**: 512 GB NVMe SSD (Encrypted with LUKS)
* **Connectivity**: Dual Gigabit LAN (Internal Camera VLAN + Isolated Command Uplink)

---

## 2. Dockerized Orchestration

### Launch Services
```bash
docker-compose up -d
```

### Verify Container Health
```bash
docker-compose ps
```

Expected output:
* `ibvap-web`: Port 3000 (Healthy)
* `ibvap-postgres`: Port 5432 (Healthy)
* `ibvap-redis`: Port 6379 (Healthy)
* `ibvap-inference`: Running

---

## 3. Local Development & Simulation
```bash
npm install
npm run build
npm run start
```
Open `http://localhost:3000` in Chrome or Edge.
