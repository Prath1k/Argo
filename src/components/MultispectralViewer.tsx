import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  Layers, 
  Clock, 
  MousePointerClick, 
  HelpCircle 
} from 'lucide-react';
import type { SpectralBand, CropScenario, Language } from '../types';

interface MultispectralViewerProps {
  scenario: CropScenario;
  currentLang: Language;
}

export const MultispectralViewer: React.FC<MultispectralViewerProps> = ({
  scenario,
  currentLang
}) => {
  const [activeBand, setActiveBand] = useState<SpectralBand>('ndvi');
  const [temporalDay, setTemporalDay] = useState<number>(3); // Day 1, Day 3, Day 7
  const [inspectPixel, setInspectPixel] = useState<{ x: number; y: number; ndvi: number; status: string } | null>({
    x: 240,
    y: 190,
    ndvi: scenario.ndviScore,
    status: scenario.category === 'healthy' ? 'Vigorous Chlorophyll' : 'Early Cellular Stress'
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Translations
  const t = {
    title: { en: 'Multispectral Camera Stream & Optical Spectral Bands', mr: 'मल्टीस्पेक्ट्रल कॅमेरा व स्पेक्ट्रल बँड्स', hi: 'मल्टीस्पेक्ट्रल कैमरा एवं ऑप्टिकल स्पेक्ट्रल बैंड्स' },
    sub: { en: 'RPi NoIR / Dual-Band Optical Filter Stream (Visible + NIR 850nm + Red Edge 720nm)', mr: 'आर-पीआय नोआयआर कॅमेरा थेट दृश्य (८५०nm व ७२०nm रेड-एज)', hi: 'आरपीआई नोआईआर कैमरा लाइव व्यू (८५०nm एवं ७२०nm रेड-एज)' },
    rgb: { en: 'RGB Visible', mr: 'आरजीबी (डोळ्यांना दिसणारे)', hi: 'आरजीबी (दृश्य)' },
    nir: { en: 'NIR (850nm)', mr: 'एनआयआर (इन्फ्रारेड)', hi: 'एनआईआर (इन्फ्रारेड)' },
    ndvi: { en: 'NDVI Index Map', mr: 'एनडीव्हीआय नकाशा', hi: 'एनडीवीआई मैप' },
    ndre: { en: 'NDRE Red Edge', mr: 'एनडीआरई रेड-एज', hi: 'एनडीआरई रेड-एज' },
    historicalTitle: { en: 'Cloud Temporal Comparison (Next-Day Trend)', mr: 'क्लाउड साठवणूक: दिवसनिहाय तुलना', hi: 'क्लाउड स्टोरेज: दिन-प्रतिदिन तुलना' },
    day1: { en: 'Day 1 (Healthy Baseline)', mr: 'दिवस १ (निरोगी)', hi: 'दिन १ (स्वस्थ)' },
    day3: { en: 'Day 3 (Pre-Symptomatic Stress)', mr: 'दिवस ३ (प्राथमिक ताण)', hi: 'दिन ३ (प्रारंभिक तनाव)' },
    day7: { en: 'Day 7 (Visible Damage)', mr: 'दिवस ७ (दिसणारे नुकसान)', hi: 'दिन ७ (दृश्य क्षति)' },
    clickTip: { en: 'Click anywhere on canopy to inspect live pixel spectral reflectance', mr: 'स्पेक्ट्रल मूल्य तपासण्यासाठी पानाच्या कोणत्याही भागावर क्लिक करा', hi: 'स्पेक्ट्रल मान देखने के लिए पत्ती पर कहीं भी क्लिक करें' }
  };

  // Draw procedural multispectral canopy on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Render simulated crop canopy based on active band and temporalDay
    const centerX = width / 2;
    const centerY = height / 2;

    // Background soil / shadow tone
    const soilGradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 320);
    if (activeBand === 'rgb') {
      soilGradient.addColorStop(0, '#1c2814');
      soilGradient.addColorStop(1, '#0c1209');
    } else if (activeBand === 'nir') {
      soilGradient.addColorStop(0, '#383838');
      soilGradient.addColorStop(1, '#1a1a1a');
    } else if (activeBand === 'ndvi') {
      soilGradient.addColorStop(0, '#2e1005');
      soilGradient.addColorStop(1, '#110602');
    } else {
      // ndre
      soilGradient.addColorStop(0, '#301804');
      soilGradient.addColorStop(1, '#0e0802');
    }
    ctx.fillStyle = soilGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw main crop foliage leaves
    const drawLeaf = (
      x: number, 
      y: number, 
      radiusX: number, 
      radiusY: number, 
      rotation: number, 
      isStressedLeaf: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);

      // Color selection based on Band & Stress
      if (activeBand === 'rgb') {
        if (isStressedLeaf) {
          if (temporalDay === 1) {
            ctx.fillStyle = '#2d6a2a'; // looks healthy early
          } else if (temporalDay === 3) {
            ctx.fillStyle = '#426829'; // slight dull green
          } else {
            ctx.fillStyle = '#8a7824'; // chlorotic yellow/brown necrosis
          }
        } else {
          ctx.fillStyle = '#22c55e'; // vibrant healthy green
        }
      } else if (activeBand === 'nir') {
        // NIR: healthy leaves reflect massive light (bright grey/white); damaged cells absorb (dark grey/black)
        if (isStressedLeaf) {
          if (temporalDay === 1) {
            ctx.fillStyle = '#d4d4d4';
          } else if (temporalDay === 3) {
            ctx.fillStyle = '#6b7280'; // distinct early cellular drop
          } else {
            ctx.fillStyle = '#262626'; // complete cellular death
          }
        } else {
          ctx.fillStyle = '#f3f4f6'; // high reflectance 850nm
        }
      } else if (activeBand === 'ndvi') {
        // NDVI: Green = high (>0.7), Yellow/Orange = moderate (0.4-0.6), Red/Brown = low (<0.3)
        if (isStressedLeaf) {
          if (temporalDay === 1) {
            ctx.fillStyle = '#65a30d'; // NDVI ~0.65
          } else if (temporalDay === 3) {
            ctx.fillStyle = '#eab308'; // NDVI ~0.45 (Early Warning)
          } else {
            ctx.fillStyle = '#dc2626'; // NDVI ~0.22 (Severe Damage)
          }
        } else {
          ctx.fillStyle = '#15803d'; // Healthy NDVI ~0.82
        }
      } else {
        // NDRE: Red Edge (Very sensitive to early cellular and nitrogen changes)
        if (isStressedLeaf) {
          if (temporalDay === 1) {
            ctx.fillStyle = '#a3e635';
          } else if (temporalDay === 3) {
            ctx.fillStyle = '#f97316'; // Immediate alarm on Day 3
          } else {
            ctx.fillStyle = '#b91c1c';
          }
        } else {
          ctx.fillStyle = '#047857';
        }
      }

      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = activeBand === 'nir' ? '#9ca3af' : 'rgba(255,255,255,0.15)';
      ctx.stroke();

      // Leaf veins
      ctx.beginPath();
      ctx.moveTo(-radiusX * 0.7, 0);
      ctx.lineTo(radiusX * 0.7, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    // Draw cluster of canopy leaves
    drawLeaf(centerX - 100, centerY - 40, 110, 50, -0.4, false);
    drawLeaf(centerX + 110, centerY - 50, 120, 55, 0.35, false);
    drawLeaf(centerX - 80, centerY + 80, 115, 52, 0.5, true); // Stressed leaf 1
    drawLeaf(centerX + 85, centerY + 70, 125, 58, -0.3, true); // Stressed leaf 2
    drawLeaf(centerX, centerY - 10, 130, 60, 0.05, true);      // Center focus leaf

    // If day 3 or 7, draw cellular lesion hotspots in false color
    if (temporalDay >= 3 && (activeBand === 'ndvi' || activeBand === 'ndre')) {
      const drawLesionSpot = (x: number, y: number, rad: number) => {
        const radGrad = ctx.createRadialGradient(x, y, 2, x, y, rad);
        radGrad.addColorStop(0, '#ef4444');
        radGrad.addColorStop(0.6, '#f59e0b');
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      };

      drawLesionSpot(centerX - 25, centerY + 15, temporalDay === 7 ? 35 : 18);
      drawLesionSpot(centerX + 60, centerY + 50, temporalDay === 7 ? 28 : 14);
      drawLesionSpot(centerX - 70, centerY + 65, temporalDay === 7 ? 32 : 15);
    }

    // Reticle for inspected pixel
    if (inspectPixel) {
      ctx.save();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(inspectPixel.x, inspectPixel.y, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair ticks
      ctx.beginPath();
      ctx.moveTo(inspectPixel.x - 14, inspectPixel.y);
      ctx.lineTo(inspectPixel.x + 14, inspectPixel.y);
      ctx.moveTo(inspectPixel.x, inspectPixel.y - 14);
      ctx.lineTo(inspectPixel.x, inspectPixel.y + 14);
      ctx.stroke();
      ctx.restore();
    }
  }, [activeBand, temporalDay, inspectPixel, scenario]);

  // Handle canvas click to sample spectral data
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Calculate simulated NDVI based on distance from center stress zone
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

    let sampledNdvi = 0.78;
    let status = 'Healthy Chlorophyll Vigour';

    if (distFromCenter < 90) {
      sampledNdvi = scenario.ndviScore - (temporalDay === 7 ? 0.2 : 0.05);
      status = 'Early Cellular Spore Inoculation';
      if (scenario.category === 'nutrient_deficiency') {
        status = 'Nitrogen Deficiency Chlorosis';
      }
    }

    setInspectPixel({
      x,
      y,
      ndvi: Math.max(0.12, parseFloat(sampledNdvi.toFixed(2))),
      status
    });
  };

  return (
    <div className="glass-card spectral-viewer-card">
      <div className="spectral-toolbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} className="text-cyan-400" />
            <h3 style={{ fontSize: '18px' }}>{t.title[currentLang]}</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.sub[currentLang]}</p>
        </div>

        {/* Band Switcher Tabs */}
        <div className="band-selector-tabs">
          <button 
            className={`band-tab ${activeBand === 'rgb' ? 'active' : ''}`}
            onClick={() => setActiveBand('rgb')}
          >
            <Eye size={14} />
            {t.rgb[currentLang]}
          </button>
          <button 
            className={`band-tab ${activeBand === 'nir' ? 'active' : ''}`}
            onClick={() => setActiveBand('nir')}
          >
            <Layers size={14} />
            {t.nir[currentLang]}
          </button>
          <button 
            className={`band-tab ndvi ${activeBand === 'ndvi' ? 'active' : ''}`}
            onClick={() => setActiveBand('ndvi')}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-400)' }}></span>
            {t.ndvi[currentLang]}
          </button>
          <button 
            className={`band-tab ndre ${activeBand === 'ndre' ? 'active' : ''}`}
            onClick={() => setActiveBand('ndre')}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber-400)' }}></span>
            {t.ndre[currentLang]}
          </button>
        </div>
      </div>

      {/* Main Multispectral Canopy Canvas */}
      <div className="canopy-viewport">
        <canvas 
          ref={canvasRef} 
          width={680} 
          height={380} 
          className="canopy-canvas"
          onClick={handleCanvasClick}
        />

        {/* Live Pixel Inspector HUD */}
        {inspectPixel && (
          <div className="canopy-overlay-info">
            <MousePointerClick size={14} className="text-cyan-400" />
            <span>X: {inspectPixel.x} Y: {inspectPixel.y}</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span className="font-mono" style={{ color: inspectPixel.ndvi < 0.5 ? 'var(--red-400)' : 'var(--emerald-400)' }}>
              {activeBand.toUpperCase()}: {inspectPixel.ndvi}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontWeight: 600, color: inspectPixel.ndvi < 0.5 ? 'var(--amber-400)' : 'var(--emerald-400)' }}>
              {inspectPixel.status}
            </span>
          </div>
        )}

        {/* Color Scale Legend */}
        {(activeBand === 'ndvi' || activeBand === 'ndre') && (
          <div className="canopy-legend">
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {activeBand.toUpperCase()} False-Color Scale
            </span>
            <div className="ndvi-bar"></div>
            <div className="ndvi-bar-labels">
              <span>0.0 (Dead/Bare)</span>
              <span>0.5 (Stress)</span>
              <span>1.0 (Vigorous)</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HelpCircle size={14} className="text-cyan-400" />
          <span>{t.clickTip[currentLang]}</span>
        </div>
        <div className="font-mono text-cyan-400">
          Camera: Dual-Band NoIR 1080p @ 30fps • Storage: Cloud S3 Bucket Synced
        </div>
      </div>

      {/* Temporal Comparison Control (Next-Day Trend Tracking) */}
      <div style={{ padding: '14px 18px', background: 'rgba(2, 6, 16, 0.65)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={16} className="text-emerald-400" />
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
              {t.historicalTitle[currentLang]}
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Demonstrates historical data stored in the cloud for multi-day anomaly progression
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className={`btn-secondary ${temporalDay === 1 ? 'active' : ''}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px',
              borderColor: temporalDay === 1 ? 'var(--emerald-400)' : 'var(--border-subtle)',
              color: temporalDay === 1 ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setTemporalDay(1)}
          >
            {t.day1[currentLang]}
          </button>
          <button 
            className={`btn-secondary ${temporalDay === 3 ? 'active' : ''}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px',
              borderColor: temporalDay === 3 ? 'var(--amber-400)' : 'var(--border-subtle)',
              color: temporalDay === 3 ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setTemporalDay(3)}
          >
            {t.day3[currentLang]}
          </button>
          <button 
            className={`btn-secondary ${temporalDay === 7 ? 'active' : ''}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px',
              borderColor: temporalDay === 7 ? 'var(--red-400)' : 'var(--border-subtle)',
              color: temporalDay === 7 ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setTemporalDay(7)}
          >
            {t.day7[currentLang]}
          </button>
        </div>
      </div>
    </div>
  );
};
