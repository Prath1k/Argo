import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Send, 
  Users, 
  CheckCircle2, 
  Radio, 
  ChevronRight, 
  X 
} from 'lucide-react';
import L from 'leaflet';
import { MAHARASHTRA_CLUSTERS } from '../data/maharashtraClusters';
import type { OutbreakCluster, Language } from '../types';
import { cropsapService } from '../services/cropsapService';

interface GovtGISDashboardProps {
  currentLang: Language;
}

export const GovtGISDashboard: React.FC<GovtGISDashboardProps> = ({ currentLang }) => {
  const [clusters, setClusters] = useState<OutbreakCluster[]>(MAHARASHTRA_CLUSTERS);
  const [selectedCluster, setSelectedCluster] = useState<OutbreakCluster>(MAHARASHTRA_CLUSTERS[1]); // Latur
  const [broadcastModalOpen, setBroadcastModalOpen] = useState<boolean>(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    const loadClusters = async () => {
      const data = await cropsapService.getClusters();
      setClusters(data);
      if (data.length > 0) {
        setSelectedCluster(data[1] || data[0]);
      }
    };
    loadClusters();

    // Subscribe to realtime cluster updates
    const unsubscribe = cropsapService.subscribeToClusters(() => {
      loadClusters();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Translations
  const t = {
    title: { en: 'Maharashtra State CROPSAP 2.0 Outbreak Surveillance', mr: 'महाराष्ट्र शासन: क्रॉपसॅप २.० कीड व रोग प्रादुर्भाव देखरेख प्रणाली', hi: 'महाराष्ट्र शासन: क्रॉपसैप २.० प्रकोप निगरानी प्रणाली' },
    sub: { en: 'Real-time spatial clustering & Economic Threshold Level (ETL) early warnings across Talukas', mr: 'तालुकानिहाय थेट प्रादुर्भाव नकाशे व आर्थिक नुकसान पातळी (ETL) पूर्व-सूचना', hi: 'तालुका स्तर पर वास्तविक समय प्रकोप क्लस्टर एवं ईटीएल अलर्ट' },
    activeHotspots: { en: 'Monitored Taluka Clusters', mr: 'देखरेखीखालील तालुके', hi: 'निगरानी अधीन तालुका क्लस्टर' },
    broadcastBtn: { en: 'Broadcast Emergency Advisory', mr: 'तातडीचा शेतकरी सल्ला प्रसारित करा', hi: 'आपातकालीन किसान परामर्श जारी करें' },
    etlExceeded: { en: 'ETL Exceeded', mr: 'ETL पातळी ओलांडली', hi: 'ईटीएल पार' },
    reports: { en: 'Verified Ground Cases', mr: 'नोंदणीकृत केसेस', hi: 'सत्यापित मामले' },
    broadcastModalTitle: { en: 'Broadcast SMS & WhatsApp Advisory', mr: 'शेतकऱ्यांना एसएमएस व व्हॉट्सअॅप संदेश पाठवा', hi: 'किसानों को एसएमएस व व्हाट्सएप परामर्श भेजें' }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Center roughly around Maharashtra (19.75, 75.71)
      const map = L.map(mapContainerRef.current).setView([19.25, 75.8], 7);

      // OpenStreetMap dark-matter tiles (or standard OSM tiles)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add cluster markers
    clusters.forEach((cl) => {
      const color = cl.riskLevel === 'Critical' ? '#ef4444' : cl.riskLevel === 'Moderate' ? '#f59e0b' : '#10b981';
      
      const circle = L.circleMarker([cl.lat, cl.lng], {
        radius: cl.riskLevel === 'Critical' ? 14 : 10,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.75
      }).addTo(map);

      circle.bindTooltip(
        `<strong>${cl.taluka} (${cl.district})</strong><br/>Crop: ${cl.crop}<br/>Risk: ${cl.riskLevel}<br/>Cases: ${cl.casesReported}`,
        { permanent: false, direction: 'top' }
      );

      circle.on('click', () => {
        setSelectedCluster(cl);
      });
    });
  }, [clusters]);

  const handleSendBroadcast = async () => {
    setBroadcastSuccess(true);
    const msg = `[महाराष्ट्र कृषी विभाग - सावधतेचा इशारा]\nतालुका ${selectedCluster.taluka} मधील शेतकरी बांधवांनो, आपल्या भागात ${selectedCluster.crop} पिकावर ${selectedCluster.threatMr} चे प्रमाण आर्थिक नुकसान पातळीच्या (ETL) वर गेले आहे.\nतातडीने शेताची पाहणी करा व ARGO AgriVision ॲपमध्ये सुचवल्यानुसार जैविक/रासायनिक प्रतिबंधात्मक फवारणी सुरू करा.`;
    
    // Record in Supabase
    await cropsapService.dispatchAdvisory(
      selectedCluster.id,
      selectedCluster.taluka,
      selectedCluster.district,
      msg,
      1480
    );

    // Mark cluster as advisorySent locally
    setClusters(prev => prev.map(c => c.id === selectedCluster.id ? { ...c, advisorySent: true } : c));
    setTimeout(() => {
      setBroadcastModalOpen(false);
      setBroadcastSuccess(false);
    }, 1800);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', color: 'var(--red-400)' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px' }}>{t.title[currentLang]}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.sub[currentLang]}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn-danger"
            style={{ fontSize: '13px', padding: '8px 16px' }}
            onClick={() => setBroadcastModalOpen(true)}
          >
            <Send size={15} />
            {t.broadcastBtn[currentLang]}
          </button>
        </div>
      </div>

      {/* Grid: Interactive Map + Cluster List */}
      <div className="grid-2col" style={{ alignItems: 'stretch' }}>
        {/* Leaflet Map Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(2, 6, 16, 0.6)', padding: '8px 14px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span> Critical Risk (ETL Cross)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></span> Moderate Alert
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> Baseline Normal
              </span>
            </div>
            <span className="font-mono text-cyan-400">DBSCAN Spatial Cluster Active</span>
          </div>
        </div>

        {/* Selected Cluster Details & Hotspots List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Active Highlight Card */}
          <div style={{ 
            padding: '16px', 
            background: selectedCluster.riskLevel === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.8)',
            border: `1px solid ${selectedCluster.riskLevel === 'Critical' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)'}`,
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} className={selectedCluster.riskLevel === 'Critical' ? 'text-red-400' : 'text-amber-400'} />
                <h4 style={{ fontSize: '16px', color: '#fff' }}>
                  Taluka {selectedCluster.taluka}, Dist. {selectedCluster.district}
                </h4>
              </div>
              <span className={`metric-status-badge ${selectedCluster.riskLevel === 'Critical' ? 'critical' : 'warning'}`}>
                {selectedCluster.riskLevel} Outbreak
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Crop: <strong style={{ color: '#fff' }}>{selectedCluster.crop}</strong> • Threat: <span style={{ color: 'var(--red-400)', fontWeight: 600 }}>{selectedCluster.threat}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{t.reports[currentLang]}: <strong className="font-mono" style={{ color: '#fff' }}>{selectedCluster.casesReported}</strong></span>
              <span>ETL Status: <strong style={{ color: selectedCluster.etlExceeded ? 'var(--red-400)' : 'var(--emerald-400)' }}>{selectedCluster.etlExceeded ? '⚠️ EXCEEDED' : 'Normal'}</strong></span>
              <span>Updated: {selectedCluster.lastUpdated}</span>
            </div>
          </div>

          {/* List of Other Clusters */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
            {clusters.map((cl) => (
              <div 
                key={cl.id}
                onClick={() => {
                  setSelectedCluster(cl);
                  if (leafletMapRef.current) {
                    leafletMapRef.current.flyTo([cl.lat, cl.lng], 9);
                  }
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: selectedCluster.id === cl.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(12, 18, 32, 0.6)',
                  border: `1px solid ${selectedCluster.id === cl.id ? 'var(--emerald-400)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {cl.taluka} ({cl.district})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {cl.crop} • {cl.threat}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`metric-status-badge ${cl.riskLevel === 'Critical' ? 'critical' : cl.riskLevel === 'Moderate' ? 'warning' : 'optimal'}`}>
                    {cl.riskLevel}
                  </span>
                  <ChevronRight size={14} className="text-text-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {broadcastModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Radio size={20} className="text-red-400" />
                <h3 style={{ fontSize: '18px' }}>{t.broadcastModalTitle[currentLang]}</h3>
              </div>
              <button 
                onClick={() => setBroadcastModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(2, 6, 16, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Target Audience:</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} className="text-cyan-400" />
                <span>All 1,480 registered farmers in Taluka {selectedCluster.taluka}, Dist. {selectedCluster.district}</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Marathi SMS Advisory Preview:
              </label>
              <div className="code-box" style={{ whiteSpace: 'pre-wrap' }}>
                {`[महाराष्ट्र कृषी विभाग - सावधतेचा इशारा]
तालुका ${selectedCluster.taluka} मधील शेतकरी बांधवांनो, आपल्या भागात ${selectedCluster.crop} पिकावर ${selectedCluster.threatMr} चे प्रमाण आर्थिक नुकसान पातळीच्या (ETL) वर गेले आहे.
तातडीने शेताची पाहणी करा व ARGO AgriVision ॲपमध्ये सुचवल्यानुसार जैविक/रासायनिक प्रतिबंधात्मक फवारणी सुरू करा.`}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn-secondary"
                onClick={() => setBroadcastModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleSendBroadcast}
                disabled={broadcastSuccess}
              >
                {broadcastSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Sent via Govt SMS Gateway!</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Broadcast Alert Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
