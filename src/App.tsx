import React, { useState } from 'react';
import { Header } from './components/Header';
import { TelemetryGauges } from './components/TelemetryGauges';
import { MultispectralViewer } from './components/MultispectralViewer';
import { AIFusionDiagnostics } from './components/AIFusionDiagnostics';
import { IPMRecommendation } from './components/IPMRecommendation';
import { VoiceAssistant } from './components/VoiceAssistant';
import { GovtGISDashboard } from './components/GovtGISDashboard';
import { HardwareSchematic } from './components/HardwareSchematic';
import { CROP_SCENARIOS } from './data/cropScenarios';
import type { AppMode, Language, CropScenario, SensorTelemetry } from './types';
import { Sprout } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('farmer');
  const [currentLang, setCurrentLang] = useState<Language>('mr'); // Default to Marathi for Maharashtra SIH PS
  const [selectedScenario, setSelectedScenario] = useState<CropScenario>(CROP_SCENARIOS[0]); // Cotton default
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(CROP_SCENARIOS[0].defaultTelemetry);

  // When scenario changes, update default telemetry
  const handleSelectScenario = (sc: CropScenario) => {
    setSelectedScenario(sc);
    setTelemetry(sc.defaultTelemetry);
  };

  // Update telemetry partially from sliders
  const handleUpdateTelemetry = (updates: Partial<SensorTelemetry>) => {
    setTelemetry(prev => ({ ...prev, ...updates }));
  };

  // Reset telemetry to current scenario default
  const handleResetTelemetry = () => {
    setTelemetry(selectedScenario.defaultTelemetry);
  };

  // Translations
  const t = {
    scenarioSelect: {
      en: 'Select Field Test Case / Crop Scenario',
      mr: 'प्रात्यक्षिक पीक चाचणी निवडा',
      hi: 'प्रायोगिक फसल परिदृश्य चुनें'
    },
    demoNotice: {
      en: 'SIH26131 Solution Prototype • Developed for Department of Agriculture, Government of Maharashtra',
      mr: 'स्मार्ट इंडिया हॅकेथॉन (SIH26131) • महाराष्ट्र शासन कृषी विभाग विशेष प्रकल्प',
      hi: 'स्मार्ट इंडिया हैकाथॉन (SIH26131) • महाराष्ट्र शासन कृषि विभाग विशेष परियोजना'
    }
  };

  return (
    <div className="app-layout">
      {/* Universal Sticky Header */}
      <Header 
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
      />

      <main className="app-container">
        {/* Quick Scenario Selector Bar (Shown on Farmer, Fusion, and Lab modes) */}
        {currentMode !== 'govt' && currentMode !== 'hardware' && (
          <div className="scenario-bar">
            <div className="scenario-label">
              <Sprout size={16} />
              <span>{t.scenarioSelect[currentLang]}</span>
            </div>

            <div className="scenario-chips">
              {CROP_SCENARIOS.map((sc) => {
                const isSelected = sc.id === selectedScenario.id;
                let cropIcon = '🌱';
                if (sc.id === 'cotton-bollworm') cropIcon = '🌸';
                if (sc.id === 'soybean-rust') cropIcon = '🌿';
                if (sc.id === 'onion-nitrogen-disambiguation') cropIcon = '🧅';
                if (sc.id === 'sugarcane-red-rot') cropIcon = '🎋';
                if (sc.id === 'pomegranate-telya') cropIcon = '🍎';

                const cropDisplayName = currentLang === 'mr' ? sc.cropNameMr : currentLang === 'hi' ? sc.cropNameHi : sc.cropName;

                return (
                  <button
                    key={sc.id}
                    className={`scenario-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectScenario(sc)}
                  >
                    <span>{cropIcon}</span>
                    <span>{cropDisplayName}</span>
                    {sc.id === 'onion-nitrogen-disambiguation' && (
                      <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.3)', color: 'var(--amber-400)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        DISAMBIGUATION
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 1. FARMER APP MODE (Clean, intuitive, voice-assisted, actionable) */}
        {currentMode === 'farmer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Row: AI Fusion Diagnosis */}
            <AIFusionDiagnostics 
              scenario={selectedScenario}
              telemetry={telemetry}
              currentLang={currentLang}
            />

            {/* Middle Grid: Multispectral Camera View + IoT Telemetry */}
            <div className="grid-2col">
              <MultispectralViewer 
                scenario={selectedScenario}
                currentLang={currentLang}
              />
              <TelemetryGauges 
                telemetry={telemetry}
                onUpdateTelemetry={handleUpdateTelemetry}
                onResetTelemetry={handleResetTelemetry}
                currentLang={currentLang}
              />
            </div>

            {/* Bottom Grid: 3-Tier IPM Advice & Dilution Calculator + Vernacular Voice Assistant */}
            <div className="grid-2col">
              <IPMRecommendation 
                scenario={selectedScenario}
                currentLang={currentLang}
              />
              <VoiceAssistant 
                currentLang={currentLang}
              />
            </div>
          </div>
        )}

        {/* 2. MULTIMODAL AI FUSION ENGINE VIEW (Technical focus on how sensor + image fusion operates) */}
        {currentMode === 'fusion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AIFusionDiagnostics 
              scenario={selectedScenario}
              telemetry={telemetry}
              currentLang={currentLang}
            />

            <TelemetryGauges 
              telemetry={telemetry}
              onUpdateTelemetry={handleUpdateTelemetry}
              onResetTelemetry={handleResetTelemetry}
              currentLang={currentLang}
            />

            <div className="grid-2col">
              <MultispectralViewer 
                scenario={selectedScenario}
                currentLang={currentLang}
              />
              <IPMRecommendation 
                scenario={selectedScenario}
                currentLang={currentLang}
              />
            </div>
          </div>
        )}

        {/* 3. MULTISPECTRAL & IOT LAB VIEW (In-depth optical and hardware telemetry) */}
        {currentMode === 'lab' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <MultispectralViewer 
              scenario={selectedScenario}
              currentLang={currentLang}
            />

            <TelemetryGauges 
              telemetry={telemetry}
              onUpdateTelemetry={handleUpdateTelemetry}
              onResetTelemetry={handleResetTelemetry}
              currentLang={currentLang}
            />

            <AIFusionDiagnostics 
              scenario={selectedScenario}
              telemetry={telemetry}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* 4. GOVT OUTBREAK SURVEILLANCE GIS VIEW (CROPSAP 2.0 Taluka Map) */}
        {currentMode === 'govt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GovtGISDashboard 
              currentLang={currentLang}
            />
          </div>
        )}

        {/* 5. HARDWARE BLUEPRINT VIEW (ESP32, RS485 Modbus, Optical Filter, MQTT Schema) */}
        {currentMode === 'hardware' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <HardwareSchematic 
              currentLang={currentLang}
            />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="app-footer">
        <p>{t.demoNotice[currentLang]}</p>
        <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
          ARGO AgriVision Platform • Multi-Modal In-Field Edge AI & Satellite Crop Surveillance
        </p>
      </footer>
    </div>
  );
};

export default App;
