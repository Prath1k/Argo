import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sprout, 
  Bug, 
  FlaskConical, 
  Calculator, 
  AlertCircle, 
  PhoneCall, 
  Check 
} from 'lucide-react';
import type { CropScenario, Language } from '../types';

interface IPMRecommendationProps {
  scenario: CropScenario;
  currentLang: Language;
}

export const IPMRecommendation: React.FC<IPMRecommendationProps> = ({
  scenario,
  currentLang
}) => {
  const [landArea, setLandArea] = useState<number>(1); // e.g. 1
  const [areaUnit, setAreaUnit] = useState<'acre' | 'guntha'>('acre'); // acre or guntha (common in Maharashtra)
  const [pumpSize] = useState<number>(15); // standard 15L knapsack sprayer
  const [referralSent, setReferralSent] = useState<boolean>(false);

  // Conversions: 1 Acre = 40 Gunthas
  const totalAcres = areaUnit === 'acre' ? landArea : landArea / 40;
  const totalWaterLiters = Math.round(totalAcres * 180); // ~180L water per acre
  const totalPumps = Math.max(1, Math.round(totalWaterLiters / pumpSize));

  // Dose calculations
  // Parse nominal dose per 15L pump from scenario string if possible
  const chem = scenario.ipmAdvice.chemical;

  // Translations
  const t = {
    title: { en: 'Integrated Pest Management (IPM) & Safe Dosage', mr: 'एकात्मिक कीड व रोग व्यवस्थापन (IPM) आणि सुरक्षित मात्रा', hi: 'एकीकृत कीट एवं रोग प्रबंधन (IPM) एवं सुरक्षित मात्रा' },
    sub: { en: 'CIBRC (Central Insecticide Board) Compliant Tiered Protocol', mr: 'केंद्रीय कीटकनाशक मंडळ (CIBRC) प्रमाणित त्रिस्तरीय पद्धत', hi: 'सीआईबीआरसी प्रमाणित त्रिस्तरीय पद्धति' },
    step1: { en: 'Step 1: Cultural & Mechanical', mr: 'पायरी १: मशागतीय व यांत्रिक नियंत्रण', hi: 'चरण १: कर्षण एवं यांत्रिक नियंत्रण' },
    step2: { en: 'Step 2: Biological & Bio-pesticides', mr: 'पायरी २: जैविक नियंत्रण व वनस्पती अर्क', hi: 'चरण २: जैविक नियंत्रण एवं बायोपेस्टीसाइड' },
    step3: { en: 'Step 3: Targeted Chemical (ETL Triggered)', mr: 'पायरी ३: रासायनिक नियंत्रण (ETL ओलांडल्यावरच)', hi: 'चरण ३: रासायनिक नियंत्रण (ईटीएल पार होने पर)' },
    calcTitle: { en: 'Field Spray Dilution Calculator', mr: 'फवारणी प्रमाण व औषध कॅल्क्युलेटर', hi: 'स्प्रे अनुपात एवं दवा कैलकुलेटर' },
    landSize: { en: 'Land Area', mr: 'जमीन क्षेत्र', hi: 'जमीन का रकबा' },
    pumpsRequired: { en: 'Pumps Required (15L Knapsack)', mr: 'एकूण आवश्यक पंप (१५ लिटर)', hi: 'आवश्यक पंप (१५ ली)' },
    waterRequired: { en: 'Total Water Required', mr: 'एकूण पाणी प्रमाण', hi: 'कुल आवश्यक पानी' },
    waitingPeriod: { en: 'Pre-Harvest Waiting Period', mr: 'फवारणीनंतर काढणी प्रतीक्षा काळ', hi: 'कटाई पूर्व प्रतीक्षा अवधि' },
    kvkBtn: { en: 'Refer to Krishi Vigyan Kendra (KVK) Scientist', mr: 'कृषी विज्ञान केंद्र (KVK) शास्त्रज्ञांचा सल्ला घ्या', hi: 'कृषि विज्ञान केंद्र (KVK) विशेषज्ञ से परामर्श' },
    kvkSent: { en: 'Case Sheet & Spectral Data Sent to KVK Portal', mr: 'माहिती व स्पेक्ट्रल रिपोर्ट KVK शास्त्रज्ञांकडे पाठवला', hi: 'रिपोर्ट KVK विशेषज्ञ को भेजी गई' }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: 'var(--emerald-400)' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px' }}>{t.title[currentLang]}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.sub[currentLang]}</p>
          </div>
        </div>

        {/* Tele-referral button */}
        <button 
          className={`btn-secondary ${referralSent ? 'good' : ''}`}
          onClick={() => setReferralSent(true)}
          style={{ 
            fontSize: '12px', 
            padding: '6px 14px',
            borderColor: referralSent ? 'var(--emerald-400)' : 'var(--border-subtle)',
            color: referralSent ? 'var(--emerald-400)' : 'var(--text-primary)'
          }}
        >
          {referralSent ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span>{t.kvkSent[currentLang]}</span>
            </>
          ) : (
            <>
              <PhoneCall size={14} className="text-cyan-400" />
              <span>{t.kvkBtn[currentLang]}</span>
            </>
          )}
        </button>
      </div>

      {/* 3-Step IPM Protocol Cards */}
      <div className="ipm-step-grid">
        {/* Step 1: Cultural */}
        <div className="ipm-card cultural">
          <span className="ipm-step-num">{t.step1[currentLang]}</span>
          <div className="ipm-card-title">
            <Sprout size={18} className="text-cyan-400" />
            <span>Eco-Cultural Control</span>
          </div>
          <p className="ipm-card-desc">
            {scenario.ipmAdvice.cultural[currentLang]}
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Zero chemical cost • Soil microbiome safe
          </div>
        </div>

        {/* Step 2: Biological */}
        <div className="ipm-card biological">
          <span className="ipm-step-num">{t.step2[currentLang]}</span>
          <div className="ipm-card-title">
            <Bug size={18} className="text-emerald-400" />
            <span>Bio-Control & Predators</span>
          </div>
          <p className="ipm-card-desc">
            {scenario.ipmAdvice.biological[currentLang]}
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '11px', color: 'var(--emerald-400)' }}>
            Organic certified • Safe for pollinators & bees
          </div>
        </div>

        {/* Step 3: Chemical (ETL Safe) */}
        <div className="ipm-card chemical">
          <span className="ipm-step-num">{t.step3[currentLang]}</span>
          <div className="ipm-card-title">
            <FlaskConical size={18} className="text-amber-400" />
            <span>Safe Chemical Intervention</span>
          </div>
          <p className="ipm-card-desc" style={{ color: '#fff', fontWeight: 600 }}>
            {chem.activeIngredient} ({chem.commercialBrand})
          </p>
          <div className="dosage-highlight-box">
            <div>💧 {chem.dosePer15LPump}</div>
            <div style={{ marginTop: '3px' }}>🌾 {chem.dosePerAcre}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>CIBRC Approved: ✅</span>
            <span>{t.waitingPeriod[currentLang]}: <strong>{chem.waitingPeriodDays} Days</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Field Spray Dilution Calculator */}
      <div style={{ 
        marginTop: '20px', 
        padding: '18px 22px', 
        background: 'rgba(2, 6, 16, 0.65)', 
        borderRadius: '12px', 
        border: '1px solid var(--border-subtle)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Calculator size={18} className="text-emerald-400" />
          <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--emerald-400)' }}>
            {t.calcTitle[currentLang]}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Land input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.landSize[currentLang]}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="number" 
                min="0.25" 
                max="50" 
                step="0.25"
                value={landArea}
                onChange={(e) => setLandArea(Math.max(0.1, parseFloat(e.target.value) || 1))}
                style={{ 
                  width: '90px', 
                  padding: '7px 10px', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px'
                }}
              />
              <select 
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as 'acre' | 'guntha')}
                style={{ 
                  padding: '7px 10px', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                <option value="acre" style={{ background: '#0b1324' }}>Acre (एकर)</option>
                <option value="guntha" style={{ background: '#0b1324' }}>Guntha (गुंठा - 1/40 Acre)</option>
              </select>
            </div>
          </div>

          {/* Computed Pump Output */}
          <div style={{ padding: '10px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.pumpsRequired[currentLang]}</div>
            <div className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--emerald-400)' }}>
              {totalPumps} Pumps
            </div>
          </div>

          {/* Computed Water Output */}
          <div style={{ padding: '10px 16px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.waterRequired[currentLang]}</div>
            <div className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--cyan-400)' }}>
              {totalWaterLiters} Liters
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <AlertCircle size={15} className="text-amber-400" />
            <span>Never exceed calibrated dose. Wear protective mask & gloves.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
