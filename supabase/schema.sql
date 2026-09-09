-- =====================================================================
-- ARGO AgriVision - Supabase Database Schema (SIH26131)
-- Government of Maharashtra: Early Detection of Crop Diseases & Pests
-- =====================================================================
-- Run this complete script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table: In-Field IoT Telemetry Readings (ESP32 + RS485 Modbus + SHT31)
CREATE TABLE IF NOT EXISTS telemetry_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gateway_id VARCHAR(64) NOT NULL DEFAULT 'ARGO_NODE_MH_001',
  taluka VARCHAR(64) NOT NULL,
  district VARCHAR(64) NOT NULL,
  air_temp NUMERIC(5, 2) NOT NULL,            -- Air Temp in °C
  humidity NUMERIC(5, 2) NOT NULL,            -- Relative Humidity %
  soil_n NUMERIC(6, 2) NOT NULL,              -- Soil Nitrogen (mg/kg)
  soil_p NUMERIC(6, 2) NOT NULL,              -- Soil Phosphorus (mg/kg)
  soil_k NUMERIC(6, 2) NOT NULL,              -- Soil Potassium (mg/kg)
  soil_moisture NUMERIC(5, 2) NOT NULL,       -- Soil Moisture %
  soil_ph NUMERIC(4, 2) NOT NULL,             -- Soil pH (0-14)
  vpd NUMERIC(5, 2) NOT NULL,                 -- Vapor Pressure Deficit (kPa)
  mean_ndvi NUMERIC(4, 2) DEFAULT 0.55,       -- NDVI vegetative index (-1.0 to 1.0)
  mean_ndre NUMERIC(4, 2) DEFAULT 0.40,       -- NDRE Red Edge cellular stress index
  anomaly_flag BOOLEAN DEFAULT FALSE,         -- True if ETL or stress threshold crossed
  battery_level INT DEFAULT 95,               -- Battery percentage %
  solar_charging BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast time-series filtering
CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON telemetry_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_taluka ON telemetry_readings(taluka, district);

-- 3. Table: Multispectral Camera Scans & Vegetative Rasters
CREATE TABLE IF NOT EXISTS multispectral_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id VARCHAR(64) NOT NULL DEFAULT 'MH_PLOT_442',
  crop_name VARCHAR(64) NOT NULL,
  band_type VARCHAR(32) NOT NULL,             -- 'rgb', 'nir', 'ndvi', 'ndre'
  image_storage_path TEXT,                    -- Path in Supabase Storage bucket 'multispectral-canopies'
  mean_ndvi NUMERIC(4, 2),
  mean_ndre NUMERIC(4, 2),
  temporal_day INT DEFAULT 1,                 -- Day 1, Day 3, Day 7
  stress_detected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: Multimodal AI Crop Diagnoses
CREATE TABLE IF NOT EXISTS crop_diagnoses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telemetry_id UUID REFERENCES telemetry_readings(id) ON DELETE SET NULL,
  crop_name VARCHAR(64) NOT NULL,
  diagnosis TEXT NOT NULL,
  diagnosis_mr TEXT,
  category VARCHAR(32) NOT NULL,              -- 'disease', 'pest', 'nutrient_deficiency', 'healthy'
  confidence NUMERIC(5, 2) NOT NULL,          -- e.g. 96.4%
  severity_percent INT NOT NULL,              -- 0 - 100%
  early_warning_days INT DEFAULT 0,           -- e.g. 3 days before visible symptoms
  ndvi_score NUMERIC(4, 2),
  ndre_score NUMERIC(4, 2),
  disambiguation_note TEXT,
  ipm_advice JSONB,                           -- Structured cultural, biological, and chemical advice
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: Maharashtra Outbreak Clusters (CROPSAP 2.0 GIS Surveillance)
CREATE TABLE IF NOT EXISTS outbreak_clusters (
  id VARCHAR(64) PRIMARY KEY,
  taluka VARCHAR(64) NOT NULL,
  district VARCHAR(64) NOT NULL,
  crop VARCHAR(64) NOT NULL,
  threat TEXT NOT NULL,
  threat_mr TEXT,
  risk_level VARCHAR(16) NOT NULL DEFAULT 'Low', -- 'Low', 'Moderate', 'Critical'
  cases_reported INT DEFAULT 0,
  lat NUMERIC(9, 6) NOT NULL,
  lng NUMERIC(9, 6) NOT NULL,
  etl_exceeded BOOLEAN DEFAULT FALSE,
  advisory_sent BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: Government SMS & WhatsApp Broadcast Advisories
CREATE TABLE IF NOT EXISTS advisory_broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_id VARCHAR(64) REFERENCES outbreak_clusters(id) ON DELETE CASCADE,
  taluka VARCHAR(64) NOT NULL,
  district VARCHAR(64) NOT NULL,
  recipient_count INT DEFAULT 0,
  message_mr TEXT NOT NULL,
  channel VARCHAR(32) DEFAULT 'SMS_AND_WHATSAPP',
  sent_by VARCHAR(64) DEFAULT 'Agricultural Officer (CROPSAP)',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
-- Enable RLS on all tables
ALTER TABLE telemetry_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE multispectral_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbreak_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_broadcasts ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for hackathon prototype testing
CREATE POLICY "Allow public read telemetry" ON telemetry_readings FOR SELECT USING (true);
CREATE POLICY "Allow public insert telemetry" ON telemetry_readings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read multispectral" ON multispectral_scans FOR SELECT USING (true);
CREATE POLICY "Allow public insert multispectral" ON multispectral_scans FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read diagnoses" ON crop_diagnoses FOR SELECT USING (true);
CREATE POLICY "Allow public insert diagnoses" ON crop_diagnoses FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read clusters" ON outbreak_clusters FOR SELECT USING (true);
CREATE POLICY "Allow public update clusters" ON outbreak_clusters FOR UPDATE USING (true);

CREATE POLICY "Allow public read broadcasts" ON advisory_broadcasts FOR SELECT USING (true);
CREATE POLICY "Allow public insert broadcasts" ON advisory_broadcasts FOR INSERT WITH CHECK (true);

-- =====================================================================
-- REALTIME SUBSCRIPTIONS
-- =====================================================================
-- Enable Supabase Realtime for live IoT telemetry & outbreak alerts
ALTER PUBLICATION supabase_realtime ADD TABLE telemetry_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE outbreak_clusters;
ALTER PUBLICATION supabase_realtime ADD TABLE crop_diagnoses;

-- =====================================================================
-- INITIAL SEED DATA (Maharashtra Clusters)
-- =====================================================================
INSERT INTO outbreak_clusters (id, taluka, district, crop, threat, threat_mr, risk_level, cases_reported, lat, lng, etl_exceeded, advisory_sent)
VALUES
  ('cluster-nashik', 'Niphad', 'Nashik', 'Onion & Grape', 'Stemphylium & Nitrogen Deficiency Stress', 'स्टेमफिलियम व नत्र कमतरता ताण', 'Moderate', 84, 20.0768, 74.1082, false, true),
  ('cluster-latur', 'Ausa', 'Latur', 'Soybean', 'Asian Rust Fungal Inoculation (Pre-symptomatic)', 'सोयाबीन तांबेरा बुरशी पूर्व-लक्षण संसर्ग', 'Critical', 142, 18.2536, 76.5028, true, true),
  ('cluster-amravati', 'Achalpur', 'Amravati', 'Cotton', 'Pink Bollworm & Whitefly Swarm', 'गुलाबी बोंडअळी व पांढरी माशी प्रादुर्भाव', 'Critical', 198, 21.2589, 77.5097, true, true),
  ('cluster-jalgaon', 'Raver', 'Jalgaon', 'Banana & Cotton', 'Sigatoka Leaf Spot & Aphid Vectors', 'सिगाटोका पानावरील ठिपके व मावा कीड', 'Moderate', 67, 21.2464, 76.0311, false, false),
  ('cluster-kolhapur', 'Shirol', 'Kolhapur', 'Sugarcane', 'Red Rot Vascular Wilt & Waterlogging Stress', 'ऊस तांबडे कुज (रेड रॉट) व पाणथळ ताण', 'Moderate', 53, 16.7483, 74.5969, false, true),
  ('cluster-solapur', 'Pandharpur', 'Solapur', 'Pomegranate', 'Bacterial Blight (Telya)', 'डाळिंब तेल्या (बॅक्टेरियल ब्लाइट)', 'Critical', 118, 17.6775, 75.3262, true, true),
  ('cluster-akola', 'Murtizapur', 'Akola', 'Cotton & Pigeonpea', 'Fusarium Wilt & Pod Borer', 'मर रोग व शेंगा पोखरणारी अळी', 'Low', 26, 20.7319, 77.3621, false, false),
  ('cluster-chhatrapati-sambhajinagar', 'Paithan', 'Chhatrapati Sambhajinagar', 'Sweet Orange & Cotton', 'Citrus Dieback & Leaf Miner', 'मोसंबी डायबॅक व पाने कुरतडणारी अळी', 'Low', 19, 19.4828, 75.3853, false, false)
ON CONFLICT (id) DO UPDATE 
SET 
  cases_reported = EXCLUDED.cases_reported,
  risk_level = EXCLUDED.risk_level,
  etl_exceeded = EXCLUDED.etl_exceeded;

-- Seed initial telemetry reading
INSERT INTO telemetry_readings (gateway_id, taluka, district, air_temp, humidity, soil_n, soil_p, soil_k, soil_moisture, soil_ph, vpd, mean_ndvi, mean_ndre, anomaly_flag)
VALUES 
  ('ARGO_NODE_MH_042', 'Ausa', 'Latur', 23.8, 93.0, 95.0, 28.0, 210.0, 78.0, 6.8, 0.28, 0.61, 0.32, true);
