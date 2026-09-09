import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Leaf, 
  FlaskRound as Flask, 
  Sun, 
  BatteryCharging, 
  Sliders, 
  RefreshCw 
} from 'lucide-react';
import type { SensorTelemetry, Language } from '../types';

interface TelemetryGaugesProps {
  telemetry: SensorTelemetry;
  onUpdateTelemetry: (newTelemetry: Partial<SensorTelemetry>) => void;
  onResetTelemetry: () => void;
  currentLang: Language;
}

export const TelemetryGauges: React.FC<TelemetryGaugesProps> = ({
  telemetry,
  onUpdateTelemetry,
  onResetTelemetry,
  currentLang
}) => {
  // Localization text
  const t = {
    title: { en: 'In-Field IoT Telemetry (Live Stream)', mr: 'शेतजमिनीतील थेट आयओटी सेन्सर नोंदी', hi: 'खेत में आईओटी सेंसर की लाइव रीडिंग' },
    simLabel: { en: 'Hardware Telemetry Simulator', mr: 'हार्डवेअर सेन्सर सिम्युलेटर', hi: 'हार्डवेयर सेंसर सिम्युलेटर' },
    airTemp: { en: 'Air Temperature', mr: 'हवेचे तापमान', hi: 'हवा का तापमान' },
    humidity: { en: 'Relative Humidity', mr: 'हवेतील आर्द्रता', hi: 'सापेक्ष आर्द्रता' },
    soilN: { en: 'Soil Nitrogen (N)', mr: 'मातीतील नत्र (N)', hi: 'मिट्टी में नाइट्रोजन' },
    soilP: { en: 'Soil Phosphorus (P)', mr: 'मातीतील स्फुरद (P)', hi: 'मिट्टी में फास्फोरस' },
    soilK: { en: 'Soil Potassium (K)', mr: 'मातीतील पालाश (K)', hi: 'मिट्टी में पोटाश' },
    moisture: { en: 'Soil Moisture', mr: 'मातीतील ओलावा', hi: 'मिट्टी की नमी' },
    soilPh: { en: 'Soil Reaction (pH)', mr: 'जमिनीचा सामू (pH)', hi: 'मिट्टी का पीएच (pH)' },
    vpd: { en: 'Vapor Pressure Deficit', mr: 'बाष्प दाब तूट (VPD)', hi: 'वाष्प दबाव घाटा' },
    battery: { en: 'Solar Battery', mr: 'सौर बॅटरी', hi: 'सोलर बैटरी' },
    reset: { en: 'Reset to Field Baseline', mr: 'मूळ नोंदींवर रीसेट करा', hi: 'रीसेट करें' }
  };

  // Helper status evaluators
  const getHumidityStatus = (val: number) => {
    if (val > 85) return { text: 'High Risk (Spore Condensation)', class: 'critical' };
    if (val > 70) return { text: 'Elevated Pathogen Risk', class: 'warning' };
    return { text: 'Optimal Field Aeration', class: 'optimal' };
  };

  const getNitrogenStatus = (val: number) => {
    if (val < 50) return { text: 'Severe Chlorosis Deficit', class: 'critical' };
    if (val < 90) return { text: 'Sub-optimal Nitrogen', class: 'warning' };
    return { text: 'Healthy Vegetative Buffer', class: 'optimal' };
  };

  const getMoistureStatus = (val: number) => {
    if (val > 80) return { text: 'Root Waterlogging Risk', class: 'critical' };
    if (val < 30) return { text: 'Moisture Stress', class: 'warning' };
    return { text: 'Adequate Wafsa Zone', class: 'optimal' };
  };

  const humStatus = getHumidityStatus(telemetry.humidity);
  const nStatus = getNitrogenStatus(telemetry.soilN);
  const mStatus = getMoistureStatus(telemetry.soilMoisture);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: 'var(--emerald-400)' }}>
            <Sliders size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px' }}>{t.title[currentLang]}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              RS485 Modbus 7-in-1 Soil Probe & SHT31 Ambient Sensor • Sync: <span className="font-mono">{telemetry.timestamp}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Sun size={15} className="text-amber-400" />
            <BatteryCharging size={15} className="text-emerald-400" />
            <span className="font-mono">{telemetry.batteryLevel}% (Solar Charged)</span>
          </div>
          <button 
            onClick={onResetTelemetry}
            className="btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            <RefreshCw size={13} />
            {t.reset[currentLang]}
          </button>
        </div>
      </div>

      {/* Grid of Metric Boxes */}
      <div className="grid-telemetry">
        {/* Air Temperature */}
        <div className="metric-box">
          <div className="metric-header">
            <span>{t.airTemp[currentLang]}</span>
            <Thermometer size={16} className="text-cyan-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.airTemp.toFixed(1)}</span>
            <span className="metric-unit">°C</span>
          </div>
          <span className="metric-status-badge optimal">
            {telemetry.airTemp > 30 ? 'Thermal Canopy Stress' : 'Standard Transpiration'}
          </span>
        </div>

        {/* Air Humidity */}
        <div className={`metric-box ${humStatus.class === 'critical' ? 'danger' : humStatus.class === 'warning' ? 'warning' : 'good'}`}>
          <div className="metric-header">
            <span>{t.humidity[currentLang]}</span>
            <Droplets size={16} className="text-cyan-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.humidity.toFixed(0)}</span>
            <span className="metric-unit">% RH</span>
          </div>
          <span className={`metric-status-badge ${humStatus.class}`}>
            {humStatus.text}
          </span>
        </div>

        {/* Soil Nitrogen (N) */}
        <div className={`metric-box ${nStatus.class === 'critical' ? 'danger' : 'good'}`}>
          <div className="metric-header">
            <span>{t.soilN[currentLang]}</span>
            <Leaf size={16} className="text-emerald-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.soilN.toFixed(0)}</span>
            <span className="metric-unit">mg/kg</span>
          </div>
          <span className={`metric-status-badge ${nStatus.class}`}>
            {nStatus.text}
          </span>
        </div>

        {/* Soil Phosphorus (P) */}
        <div className="metric-box">
          <div className="metric-header">
            <span>{t.soilP[currentLang]}</span>
            <Flask size={16} className="text-amber-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.soilP.toFixed(0)}</span>
            <span className="metric-unit">mg/kg</span>
          </div>
          <span className="metric-status-badge optimal">Optimal Root Energy</span>
        </div>

        {/* Soil Potassium (K) */}
        <div className="metric-box">
          <div className="metric-header">
            <span>{t.soilK[currentLang]}</span>
            <Flask size={16} className="text-purple-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.soilK.toFixed(0)}</span>
            <span className="metric-unit">mg/kg</span>
          </div>
          <span className="metric-status-badge optimal">Cell Wall Turgor High</span>
        </div>

        {/* Soil Moisture */}
        <div className={`metric-box ${mStatus.class === 'critical' ? 'danger' : 'good'}`}>
          <div className="metric-header">
            <span>{t.moisture[currentLang]}</span>
            <Droplets size={16} className="text-cyan-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.soilMoisture.toFixed(0)}</span>
            <span className="metric-unit">%</span>
          </div>
          <span className={`metric-status-badge ${mStatus.class}`}>
            {mStatus.text}
          </span>
        </div>

        {/* Soil pH */}
        <div className="metric-box">
          <div className="metric-header">
            <span>{t.soilPh[currentLang]}</span>
            <Flask size={16} className="text-emerald-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.soilPh.toFixed(1)}</span>
            <span className="metric-unit">pH</span>
          </div>
          <span className="metric-status-badge optimal">
            {telemetry.soilPh >= 6.5 && telemetry.soilPh <= 7.5 ? 'Neutral Availability' : 'Alkaline Bind'}
          </span>
        </div>

        {/* Vapor Pressure Deficit (VPD) */}
        <div className="metric-box">
          <div className="metric-header">
            <span>{t.vpd[currentLang]}</span>
            <Droplets size={16} className="text-cyan-400" />
          </div>
          <div className="metric-value-row">
            <span className="metric-val">{telemetry.vpd.toFixed(2)}</span>
            <span className="metric-unit">kPa</span>
          </div>
          <span className="metric-status-badge optimal">
            {telemetry.vpd < 0.5 ? 'Fungal Spore Incubation Risk' : 'Normal Vapor Transpiration'}
          </span>
        </div>
      </div>

      {/* Interactive Simulation Controls (Great for SIH Hackathon Demos) */}
      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(2, 6, 16, 0.6)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            🎛️ {t.simLabel[currentLang]} (Drag to test how AI recalculates diagnosis live)
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Simulates real-time ESP32 / SHT31 / Modbus RS485 stream changes
          </span>
        </div>

        <div className="grid-3col">
          {/* Temperature Slider */}
          <div className="slider-control">
            <div className="slider-label">
              <span>{t.airTemp[currentLang]}</span>
              <span className="font-mono">{telemetry.airTemp.toFixed(1)} °C</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="45" 
              step="0.5"
              value={telemetry.airTemp}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                // Dynamically update VPD based on temp and humidity
                const svp = 0.61078 * Math.exp((17.27 * val) / (val + 237.3));
                const avp = svp * (telemetry.humidity / 100);
                const newVpd = Math.max(0.1, svp - avp);
                onUpdateTelemetry({ airTemp: val, vpd: newVpd, timestamp: 'Live Adjusted' });
              }}
            />
          </div>

          {/* Humidity Slider */}
          <div className="slider-control">
            <div className="slider-label">
              <span>{t.humidity[currentLang]}</span>
              <span className="font-mono">{telemetry.humidity.toFixed(0)} %</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              step="1"
              value={telemetry.humidity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const svp = 0.61078 * Math.exp((17.27 * telemetry.airTemp) / (telemetry.airTemp + 237.3));
                const avp = svp * (val / 100);
                const newVpd = Math.max(0.1, svp - avp);
                onUpdateTelemetry({ humidity: val, vpd: newVpd, timestamp: 'Live Adjusted' });
              }}
            />
          </div>

          {/* Soil Nitrogen Slider */}
          <div className="slider-control">
            <div className="slider-label">
              <span>{t.soilN[currentLang]}</span>
              <span className="font-mono">{telemetry.soilN.toFixed(0)} mg/kg</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="220" 
              step="2"
              value={telemetry.soilN}
              onChange={(e) => {
                onUpdateTelemetry({ soilN: parseFloat(e.target.value), timestamp: 'Live Adjusted' });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
