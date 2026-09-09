import React from 'react';
import { 
  Cpu, 
  Camera, 
  Sun, 
  Zap, 
  FileCode 
} from 'lucide-react';
import type { Language } from '../types';

interface HardwareSchematicProps {
  currentLang: Language;
}

export const HardwareSchematic: React.FC<HardwareSchematicProps> = ({ currentLang }) => {
  const t = {
    title: { en: 'IoT Hardware Engineering Blueprint & Edge Architecture', mr: 'आयओटी हार्डवेअर ब्ल्यूप्रिंट व रचना', hi: 'आईओटी हार्डवेयर ब्लूप्रिंट एवं आर्किटेक्चर' },
    sub: { en: 'Low-power field telemetry node, RS485 Modbus registers, multispectral optical assembly, and MQTT schema', mr: 'कमी ऊर्जेवर चालणारा सेन्सर नोड, मॉडबस रजिस्टर्स आणि स्पेक्ट्रल ऑप्टिक्स', hi: 'कम बिजली की खपत वाला सेंसर नोड, मॉडबस रजिस्टर्स एवं स्पेक्ट्रल ऑप्टिक्स' }
  };

  const sampleMqttPayload = `{
  "gateway_id": "ARGO_NODE_MH_042",
  "taluka": "Niphad",
  "district": "Nashik",
  "gps": {"lat": 20.0768, "lng": 74.1082},
  "timestamp": "2026-09-09T14:30:00Z",
  "telemetry": {
    "air_temp_c": 31.5,
    "air_humidity_pct": 78.0,
    "soil_n_mg_kg": 110.0,
    "soil_p_mg_kg": 24.0,
    "soil_k_mg_kg": 180.0,
    "soil_moisture_pct": 42.0,
    "soil_ph": 7.2,
    "vpd_kpa": 1.12
  },
  "multispectral_indices": {
    "mean_ndvi": 0.52,
    "mean_ndre": 0.38,
    "anomaly_flag": true
  },
  "battery_pct": 94,
  "solar_mv": 5120
}`;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', color: '#818cf8' }}>
          <Cpu size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px' }}>{t.title[currentLang]}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.sub[currentLang]}</p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Hardware Specifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Edge Node Card */}
          <div style={{ background: 'rgba(12, 18, 32, 0.8)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Cpu size={18} className="text-emerald-400" />
              <h4 style={{ fontSize: '15px', color: '#fff' }}>1. Edge Microcontroller & Gateway</h4>
            </div>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>ESP32-S3 DevKit</strong> (Dual-Core Xtensa LX7 @ 240MHz, 8MB PSRAM, 16MB Flash).</li>
              <li><strong>Ultra-Low Power Duty Cycle</strong>: Deep sleep mode consuming <strong>&lt;15 µA</strong>. Wakes up once every 15 minutes, samples I2C & Modbus sensors, transmits payload, and re-enters sleep.</li>
              <li><strong>RS485 Bus Interface</strong>: MAX485 transceiver module with auto-direction flow control.</li>
            </ul>
          </div>

          {/* Sensor Modbus Registers Card */}
          <div style={{ background: 'rgba(12, 18, 32, 0.8)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Zap size={18} className="text-amber-400" />
              <h4 style={{ fontSize: '15px', color: '#fff' }}>2. RS485 Modbus 7-in-1 Soil Sensor Registers</h4>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: '#fff' }}>
                    <th style={{ padding: '6px 8px' }}>Register</th>
                    <th style={{ padding: '6px 8px' }}>Parameter</th>
                    <th style={{ padding: '6px 8px' }}>Range</th>
                    <th style={{ padding: '6px 8px' }}>Precision</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="font-mono text-cyan-400" style={{ padding: '6px 8px' }}>0x001E</td>
                    <td style={{ padding: '6px 8px' }}>Nitrogen (N)</td>
                    <td style={{ padding: '6px 8px' }}>0 - 1999 mg/kg</td>
                    <td style={{ padding: '6px 8px' }}>1 mg/kg</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="font-mono text-cyan-400" style={{ padding: '6px 8px' }}>0x001F</td>
                    <td style={{ padding: '6px 8px' }}>Phosphorus (P)</td>
                    <td style={{ padding: '6px 8px' }}>0 - 1999 mg/kg</td>
                    <td style={{ padding: '6px 8px' }}>1 mg/kg</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="font-mono text-cyan-400" style={{ padding: '6px 8px' }}>0x0020</td>
                    <td style={{ padding: '6px 8px' }}>Potassium (K)</td>
                    <td style={{ padding: '6px 8px' }}>0 - 1999 mg/kg</td>
                    <td style={{ padding: '6px 8px' }}>1 mg/kg</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="font-mono text-cyan-400" style={{ padding: '6px 8px' }}>0x0012</td>
                    <td style={{ padding: '6px 8px' }}>Soil Moisture</td>
                    <td style={{ padding: '6px 8px' }}>0 - 100%</td>
                    <td style={{ padding: '6px 8px' }}>0.1%</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-cyan-400" style={{ padding: '6px 8px' }}>0x0006</td>
                    <td style={{ padding: '6px 8px' }}>Soil pH</td>
                    <td style={{ padding: '6px 8px' }}>3.0 - 10.0 pH</td>
                    <td style={{ padding: '6px 8px' }}>0.1 pH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Camera Optics Card */}
          <div style={{ background: 'rgba(12, 18, 32, 0.8)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Camera size={18} className="text-cyan-400" />
              <h4 style={{ fontSize: '15px', color: '#fff' }}>3. Multispectral Dual-Band Optical Assembly</h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Uses a modified <strong>Raspberry Pi NoIR Camera (No Infrared Cut Filter)</strong> paired with a <strong>Roscolux #2007 Dual-Band optical filter</strong>. The camera sensor captures visible Blue (450nm) on the blue channel, and Near-Infrared (850nm) on the red channel, allowing real-time NDVI and NDRE extraction from a single, inexpensive camera module without costly commercial 5-lens rigs!
            </p>
          </div>
        </div>

        {/* Right Column: Communication, Power & MQTT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Power & Comms Card */}
          <div style={{ background: 'rgba(12, 18, 32, 0.8)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sun size={18} className="text-amber-400" />
              <h4 style={{ fontSize: '15px', color: '#fff' }}>4. Solar Energy & Wireless Topology</h4>
            </div>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>15W Monocrystalline Solar Panel</strong> + CN3791 MPPT Solar Charger.</li>
              <li><strong>Battery Pack</strong>: 2x 18650 Li-ion cells in parallel (3.7V, 6000mAh) giving <strong>14 days of autonomous operation</strong> even during cloudy monsoon weather.</li>
              <li><strong>Long-Range Connectivity</strong>: SIM7600 4G-LTE Cat-1 module or LoRa SX1278 (868MHz) transmitting up to 10 km to a village KVK gateway.</li>
            </ul>
          </div>

          {/* MQTT JSON Telemetry Schema */}
          <div style={{ background: 'rgba(12, 18, 32, 0.8)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCode size={18} className="text-emerald-400" />
                <h4 style={{ fontSize: '15px', color: '#fff' }}>5. Ingestion MQTT JSON Payload</h4>
              </div>
              <span className="font-mono text-emerald-400" style={{ fontSize: '11px' }}>
                Topic: argo/cropsap/v1/telemetry
              </span>
            </div>
            <pre className="code-box" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {sampleMqttPayload}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
