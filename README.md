# ARGO AgriVision (SIH26131)
> **Smart India Hackathon 2026** | **Problem Statement ID: SIH26131**  
> **Organization:** Government of Maharashtra (Department of Agriculture)  
> **Theme:** Agriculture, FoodTech & Rural Development  
> **Title:** Early detection and management of crop diseases and pest infestations

---

## 🌟 Overview
**ARGO AgriVision** is a next-generation agro-diagnostic and surveillance platform. It bridges in-field **multispectral camera imaging** (RGB + NIR 850nm + Red Edge 720nm) with real-time **IoT ground sensor telemetry** (Temperature, Relative Humidity, Soil NPK nutrients, Soil Moisture, and Soil pH).

By correlating environmental stress indicators with sub-visual spectral reflectance changes, ARGO detects crop diseases and pest infestations **48 to 72 hours before visible symptoms manifest**, and reliably differentiates nutrient deficiencies (e.g., Nitrogen chlorosis) from pathogen attacks, eliminating unnecessary chemical pesticide costs.

---

## 🚀 Key Features

### 1. 🔬 Multimodal AI Fusion Engine
- **Dual-Stream Neural Fusion**: Combines ConvNeXt visual/spectral embeddings with tabular environmental feature vectors via cross-attention.
- **Pre-Symptomatic Detection**: Flags fungal spore incubation windows (e.g. Asian Soybean Rust) days ahead of macroscopic leaf lesions.
- **Disambiguation Engine**: Distinguishes between visual yellowing caused by true pathogens vs. low soil Nitrogen, saving farmers input costs.

### 2. 🛰️ Multispectral Canopy Viewer
- **Interactive Band Switcher**: View crops in **RGB True Color**, **NIR 850nm**, **NDVI False-Color**, and **NDRE Red Edge**.
- **Point-and-Click Reticle**: Sample live pixel coordinates, spectral reflectance, and health classification.
- **Temporal Historical Comparison**: Compare Day 1 vs. Day 3 vs. Day 7 cloud data to track disease progression.

### 3. 🌿 In-Field IoT Telemetry & Hardware Simulator
- Real-time gauge meters for Air Temp, Humidity, Soil N, P, K, Moisture, pH, and Vapor Pressure Deficit (VPD).
- Interactive parameter sliders allowing judges and users to simulate changing field conditions on the fly.

### 4. 📋 3-Tier Integrated Pest Management (IPM) & Safe Dosage Calculator
- **Hierarchy**: Cultural/Mechanical $\to$ Bio-control & Predators $\to$ Targeted CIBRC-Approved Chemicals.
- **Field Spray Dilution Calculator**: Automatically calculates required knapsack pumps (15L), total water volume, and chemical dilution based on land area in **Acres** or **Gunthas**.
- **KVK Tele-Referral**: One-click case sheet referral to Krishi Vigyan Kendra scientists.

### 5. 🗣️ Bhashini Vernacular AI Voice Assistant
- Two-way voice and text interaction in **Marathi (`मराठी`)**, **Hindi (`हिंदी`)**, and English.
- Natural speech synthesis via Web Speech API with dynamic audio wave animation.

### 6. 🏛️ Maharashtra Govt CROPSAP 2.0 Outbreak GIS Portal
- State-wide interactive Leaflet map displaying active agricultural outbreak clusters (Niphad, Ausa, Achalpur, Raver, Shirol, Pandharpur, etc.).
- Real-time Economic Threshold Level (ETL) tracking.
- One-click Emergency SMS / WhatsApp advisory broadcast dispatch.

### 7. ⚙️ Hardware Engineering Blueprint
- **Microcontroller**: ESP32-S3 DevKit (<15 µA deep sleep, 15-minute duty cycle).
- **Soil Probe**: RS485 Modbus 7-in-1 Soil Sensor (N, P, K, Moisture, Temp, EC, pH).
- **Optical Filter**: Dual-band Blue/NIR filter with Raspberry Pi NoIR camera.
- **Power**: 15W Monocrystalline Solar Panel + MPPT + 18650 Li-ion battery pack.
- **Protocol**: MQTT JSON telemetry over cellular 4G-LTE / LoRaWAN (`argo/cropsap/v1/telemetry`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Custom Vanilla CSS Glassmorphism Design System
- **Mapping & GIS**: Leaflet, OpenStreetMap
- **Icons**: Lucide React
- **Voice / Speech**: Web Speech API (Indic Localization)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/Prath1k/Argo.git
cd Argo

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 👥 Authors
Developed for **Smart India Hackathon 2026** (SIH26131).
