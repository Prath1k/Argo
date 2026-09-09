import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Layers, 
  Leaf, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Coins 
} from 'lucide-react';
import type { CropScenario, SensorTelemetry, Language } from '../types';

interface AIFusionDiagnosticsProps {
  scenario: CropScenario;
  telemetry: SensorTelemetry;
  currentLang: Language;
}

export const AIFusionDiagnostics: React.FC<AIFusionDiagnosticsProps> = ({
  scenario,
  telemetry,
  currentLang
}) => {
  // Dynamically adjust confidence and severity if user altered telemetry via sliders
  const isHighHumidityFungalRisk = telemetry.humidity > 85;
  const isSevereNDeficit = telemetry.soilN < 50;

  let dynamicDiagnosis = scenario.diagnosis;
  let dynamicDiagnosisMr = scenario.diagnosisMr;
  let dynamicDiagnosisHi = scenario.diagnosisHi;
  let dynamicCategory = scenario.category;
  let dynamicConfidence = scenario.confidence;

  // Real-time multimodal fusion recalculation:
  // If user altered telemetry on Onion scenario:
  if (scenario.id === 'onion-nitrogen-disambiguation') {
    if (telemetry.soilN > 120 && telemetry.humidity > 85) {
      dynamicDiagnosis = 'Purple Blotch Fungal Infection (High Humidity & High Soil N)';
      dynamicDiagnosisMr = 'जांभळा करपा बुरशीजन्य प्रादुर्भाव (जास्त आर्द्रता व पुरेसा नत्र)';
      dynamicDiagnosisHi = 'बैंगनी झुलसा फंगल संक्रमण (उच्च आर्द्रता)';
      dynamicCategory = 'disease';
      dynamicConfidence = 93.5;
    }
  }

  // Multimodal attention weights
  const visionWeight = scenario.visionStressScore;
  const climateWeight = isHighHumidityFungalRisk ? Math.min(95, scenario.climateRiskScore + 10) : scenario.climateRiskScore;
  const soilWeight = isSevereNDeficit ? Math.min(95, scenario.soilNutrientScore + 15) : scenario.soilNutrientScore;
  const totalWeight = visionWeight + climateWeight + soilWeight;

  const visionPercent = Math.round((visionWeight / totalWeight) * 100);
  const climatePercent = Math.round((climateWeight / totalWeight) * 100);
  const soilPercent = 100 - visionPercent - climatePercent;

  // Translations
  const t = {
    fusionTitle: { en: 'Multimodal AI Fusion Diagnosis', mr: 'बहुआयामी एआय अचूक पीक निदान', hi: 'मल्टीमॉडल एआई फसल निदान' },
    earlyWarning: { en: 'Pre-Symptomatic Early Warning Window', mr: 'लक्षणे दिसण्यापूर्वी पूर्व-सूचना कालावधी', hi: 'पूर्व-लक्षण प्रारंभिक चेतावनी विंडो' },
    severity: { en: 'Estimated Canopy Damage Severity', mr: 'अंदाजे पीक नुकसान तीव्रता', hi: 'अनुमानित फसल क्षति' },
    disambiguationHeader: { en: 'Multimodal Disambiguation Engine (Why Hardware + Image Beats Vision-Only)', mr: 'अचूक निदान: कॅमेरा + सेन्सर्समुळे खोटा संशय टळला', hi: 'सटीक निदान: कैमरा + सेंसर का संयुक्त परिणाम' },
    attentionTitle: { en: 'Cross-Attention Feature Contribution Weights', mr: 'निदानासाठी विविध घटकांचे योगदान', hi: 'निदान में विभिन्न कारकों का योगदान' },
    visionFeat: { en: 'Multispectral Vision (NDVI/NDRE)', mr: 'स्पेक्ट्रल प्रतिमा (NDVI/NDRE)', hi: 'स्पेक्ट्रल इमेज (NDVI/NDRE)' },
    climateFeat: { en: 'Microclimate (Temp/Humidity/VPD)', mr: 'सूक्ष्म-हवामान (तापमान/आर्द्रता)', hi: 'सूक्ष्म-जलवायु (तापमान/नमी)' },
    soilFeat: { en: 'Soil Chemistry (NPK/Moisture/pH)', mr: 'मातीचे घटक (नत्र/स्फुरद/पालाश)', hi: 'मिट्टी रसायन (एनपीके/नमी)' }
  };

  const getSeverityBadgeClass = (category: string) => {
    if (category === 'nutrient_deficiency') return 'info';
    if (category === 'disease') return 'critical';
    return 'warning';
  };

  const bannerClass = getSeverityBadgeClass(dynamicCategory);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '8px', color: 'var(--cyan-400)' }}>
            <Zap size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px' }}>{t.fusionTitle[currentLang]}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Dual-Stream Neural Network: ConvNeXt Multispectral Backbone ⊕ Tabular Sensor Attention MLP
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} className="text-emerald-400" />
            <span>{t.earlyWarning[currentLang]}:</span>
          </span>
          <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {scenario.earlyWarningDays > 0 ? `${scenario.earlyWarningDays} Days in Advance` : 'Immediate Detection'}
          </span>
        </div>
      </div>

      {/* Main Diagnosis Banner */}
      <div className={`diagnosis-banner ${bannerClass}`}>
        <div className={`diagnosis-icon-wrap ${bannerClass}`}>
          {dynamicCategory === 'disease' && <ShieldAlert size={28} />}
          {dynamicCategory === 'pest' && <AlertTriangle size={28} />}
          {dynamicCategory === 'nutrient_deficiency' && <Leaf size={28} />}
          {dynamicCategory === 'healthy' && <CheckCircle size={28} />}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className="diagnosis-title">
              {currentLang === 'mr' ? dynamicDiagnosisMr : currentLang === 'hi' ? dynamicDiagnosisHi : dynamicDiagnosis}
            </h2>
            <span className="confidence-badge">
              {dynamicConfidence.toFixed(1)}% AI Confidence
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.6 }}>
            {scenario.symptomSummary[currentLang]}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={15} className="text-amber-400" />
              <span>{t.severity[currentLang]}: <strong style={{ color: '#fff' }}>{scenario.severityPercent}%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} className="text-cyan-400" />
              <span>NDRE Stress Index: <strong className="font-mono text-cyan-400">{scenario.ndreScore}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={15} className="text-emerald-400" />
              <span>NDVI Biomass: <strong className="font-mono text-emerald-400">{scenario.ndviScore}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Disambiguation Insight Box (SIH Winning Feature) */}
      <div style={{ 
        marginTop: '16px', 
        padding: '16px 20px', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        borderRadius: '12px', 
        border: '1px solid var(--border-active)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <div style={{ padding: '6px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: 'var(--emerald-400)', flexShrink: 0, marginTop: '2px' }}>
          <Coins size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              💡 {t.disambiguationHeader[currentLang]}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.6 }}>
            {scenario.disambiguationNote[currentLang]}
          </p>
        </div>
      </div>

      {/* Attention Contribution Breakdown */}
      <div className="attribution-bar-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {t.attentionTitle[currentLang]}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Total 100% Vector Fusion
          </span>
        </div>

        <div className="attribution-bar">
          <div 
            className="attr-segment vision" 
            style={{ width: `${visionPercent}%` }} 
            title={`Multispectral Vision: ${visionPercent}%`}
          />
          <div 
            className="attr-segment climate" 
            style={{ width: `${climatePercent}%` }} 
            title={`Microclimate: ${climatePercent}%`}
          />
          <div 
            className="attr-segment soil" 
            style={{ width: `${soilPercent}%` }} 
            title={`Soil Chemistry: ${soilPercent}%`}
          />
        </div>

        <div className="attribution-legend">
          <div className="legend-item">
            <span className="legend-dot vision"></span>
            <span>{t.visionFeat[currentLang]}: <strong>{visionPercent}%</strong></span>
          </div>
          <div className="legend-item">
            <span className="legend-dot climate"></span>
            <span>{t.climateFeat[currentLang]}: <strong>{climatePercent}%</strong></span>
          </div>
          <div className="legend-item">
            <span className="legend-dot soil"></span>
            <span>{t.soilFeat[currentLang]}: <strong>{soilPercent}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
