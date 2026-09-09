import React from 'react';
import { 
  Sprout, 
  Activity, 
  Wifi, 
  Camera, 
  Cpu, 
  ShieldAlert, 
  Radio, 
  FlaskConical,
  Wrench,
  Languages
} from 'lucide-react';
import type { AppMode, Language } from '../types';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  currentLang,
  onLangChange
}) => {
  const modeLabels = {
    farmer: { en: 'Farmer App', mr: 'शेतकरी अॅप', hi: 'किसान ऐप' },
    fusion: { en: 'AI Fusion Engine', mr: 'एआय अचूक निदान', hi: 'एआई फ्यूजन इंजन' },
    lab: { en: 'Multispectral & IoT', mr: 'स्पेक्ट्रल व सेन्सर्स', hi: 'स्पेक्ट्रल व सेंसर' },
    govt: { en: 'Govt Surveillance', mr: 'शासकीय संसर्ग नियंत्रण', hi: 'सरकारी निगरानी' },
    hardware: { en: 'Hardware Blueprint', mr: 'हार्डवेअर ब्ल्यूप्रिंट', hi: 'हार्डवेयर ब्लूप्रिंट' }
  };

  return (
    <header className="header-wrapper">
      <div className="header-content">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="logo-badge">
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-title">
              ARGO AgriVision
              <span className="brand-tag">SIH26131</span>
            </div>
            <div className="brand-sub">
              {currentLang === 'mr' && 'महाराष्ट्र शासन: बहुआयामी स्पेक्ट्रल व आयओटी आधारित पीक रोग व कीड निदान'}
              {currentLang === 'hi' && 'महाराष्ट्र सरकार: मल्टीस्पेक्ट्रल व आईओटी आधारित फसल रोग एवं कीट निदान'}
              {currentLang === 'en' && 'Govt of Maharashtra: Multimodal Multispectral & IoT Agro-Diagnostic System'}
            </div>
          </div>
        </div>

        {/* Live IoT & Hardware Status Indicators */}
        <div className="status-pill-group">
          <div className="status-chip" title="ESP32-S3 IoT Node connected via 4G-LTE / LoRa">
            <span className="pulse-dot green"></span>
            <Cpu size={14} />
            <span className="font-mono">ESP32: LIVE</span>
          </div>
          <div className="status-chip" title="RS485 Modbus 7-in-1 Soil NPK Sensor Polling">
            <Activity size={14} className="text-emerald-400" />
            <span className="font-mono">NPK: 1s POLL</span>
          </div>
          <div className="status-chip" title="Multispectral NoIR Camera Band Stream">
            <Camera size={14} />
            <span className="font-mono">NIR/NDRE: SYNC</span>
          </div>
          <div className="status-chip" title={isSupabaseConfigured() ? "Connected to live Supabase cloud backend" : "Local mode active. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to connect live Supabase"}>
            <span className={`pulse-dot ${isSupabaseConfigured() ? 'green' : 'amber'}`}></span>
            <Wifi size={14} />
            <span className="font-mono">
              {isSupabaseConfigured() ? 'SUPABASE: LIVE' : 'SUPABASE: LOCAL'}
            </span>
          </div>
        </div>

        {/* Language & Mode Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Language Switcher */}
          <div className="lang-switcher">
            <Languages size={15} style={{ marginLeft: '6px', color: 'var(--text-secondary)' }} />
            <button 
              className={`lang-btn ${currentLang === 'mr' ? 'active' : ''}`}
              onClick={() => onLangChange('mr')}
            >
              मराठी
            </button>
            <button 
              className={`lang-btn ${currentLang === 'hi' ? 'active' : ''}`}
              onClick={() => onLangChange('hi')}
            >
              हिंदी
            </button>
            <button 
              className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
              onClick={() => onLangChange('en')}
            >
              English
            </button>
          </div>

          {/* Role Navigation Pills */}
          <nav className="nav-pills">
            <button 
              className={`nav-pill-btn ${currentMode === 'farmer' ? 'active' : ''}`}
              onClick={() => onModeChange('farmer')}
            >
              <Sprout size={15} />
              {modeLabels.farmer[currentLang]}
            </button>
            <button 
              className={`nav-pill-btn ${currentMode === 'fusion' ? 'active' : ''}`}
              onClick={() => onModeChange('fusion')}
            >
              <FlaskConical size={15} />
              {modeLabels.fusion[currentLang]}
            </button>
            <button 
              className={`nav-pill-btn ${currentMode === 'lab' ? 'active' : ''}`}
              onClick={() => onModeChange('lab')}
            >
              <Radio size={15} />
              {modeLabels.lab[currentLang]}
            </button>
            <button 
              className={`nav-pill-btn ${currentMode === 'govt' ? 'active' : ''}`}
              onClick={() => onModeChange('govt')}
            >
              <ShieldAlert size={15} />
              {modeLabels.govt[currentLang]}
            </button>
            <button 
              className={`nav-pill-btn ${currentMode === 'hardware' ? 'active' : ''}`}
              onClick={() => onModeChange('hardware')}
            >
              <Wrench size={15} />
              {modeLabels.hardware[currentLang]}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
