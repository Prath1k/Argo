import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Languages, 
  MessageSquare 
} from 'lucide-react';
import { VOICE_QUERIES } from '../data/voiceQueries';
import type { Language } from '../types';

interface VoiceAssistantProps {
  currentLang: Language;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ currentLang }) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeQueryId, setActiveQueryId] = useState<string>('vq-1');
  const [customInput, setCustomInput] = useState<string>('');

  const currentItem = VOICE_QUERIES.find(q => q.id === activeQueryId) || VOICE_QUERIES[0];

  // Translations
  const t = {
    title: { en: 'Bhashini Vernacular AI Voice Assistant', mr: 'भाषिणी बहुभाषिक एआय व्हॉईस सहाय्यक', hi: 'भाषिणी बहुभाषी एआई वॉयस सहायक' },
    sub: { en: 'Speak or tap common farmer questions in Marathi, Hindi, or English', mr: 'मराठी किंवा हिंदीत बोला अथवा खालील प्रश्नांवर टॅप करा', hi: 'मराठी या हिंदी में बोलें अथवा नीचे दिए प्रश्नों पर टैप करें' },
    speakAnswer: { en: 'Audio Output (Reading in Natural Voice)', mr: 'ऑडिओ उत्तर (आवाजात ऐका)', hi: 'ऑडियो उत्तर (आवाज में सुनें)' },
    quickQueries: { en: 'Quick Farmer Queries (Tap to Listen)', mr: 'शेतकऱ्यांचे नेहमीचे प्रश्न (ऐकण्यासाठी टॅप करा)', hi: 'किसानों के आम प्रश्न (सुनने के लिए टैप करें)' },
    placeholder: { en: 'Ask any question about your crop...', mr: 'पिकाविषयी काहीही विचारा...', hi: 'फसल के बारे में कुछ भी पूछें...' },
    askBtn: { en: 'Ask Voice AI', mr: 'विचारा', hi: 'पूछें' }
  };

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak using Web Speech API
  const handleSpeak = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // Try to pick appropriate locale
    if (currentLang === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (currentLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.92; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const currentAnswerText = currentItem.answer[currentLang];
  const currentQueryText = currentItem.query[currentLang];

  return (
    <div className="glass-card voice-assistant-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: 'var(--emerald-400)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px' }}>{t.title[currentLang]}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.sub[currentLang]}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <Languages size={14} />
          <span>Indic NLP & Whisper Enabled</span>
        </div>
      </div>

      {/* Voice Mic Hero Box */}
      <div className="voice-mic-hero">
        <button 
          className={`mic-circle-btn ${isSpeaking ? 'speaking' : ''}`}
          onClick={() => handleSpeak(currentAnswerText)}
          title="Tap to play or stop audio narration"
        >
          {isSpeaking ? <VolumeX size={26} /> : <Volume2 size={26} />}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Q: "{currentQueryText}"
            </span>
            {isSpeaking && (
              <div className="soundwave-box">
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
                <div className="soundwave-bar"></div>
              </div>
            )}
          </div>

          <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.6, background: 'rgba(6, 12, 24, 0.6)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            {currentAnswerText}
          </p>
        </div>
      </div>

      {/* Freeform Voice Input Simulator */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder={t.placeholder[currentLang]}
          style={{ 
            flex: 1, 
            padding: '10px 14px', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.06)', 
            border: '1px solid var(--border-subtle)',
            color: '#fff',
            fontSize: '14px'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && customInput.trim()) {
              handleSpeak(customInput);
            }
          }}
        />
        <button 
          className="btn-primary"
          onClick={() => {
            if (customInput.trim()) {
              handleSpeak(customInput);
            }
          }}
        >
          <Mic size={16} />
          {t.askBtn[currentLang]}
        </button>
      </div>

      {/* Preset Farmer Queries */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <MessageSquare size={14} className="text-cyan-400" />
          <span>{t.quickQueries[currentLang]}</span>
        </div>

        <div className="voice-preset-list">
          {VOICE_QUERIES.map((vq) => (
            <div 
              key={vq.id}
              className={`voice-preset-item ${activeQueryId === vq.id ? 'active' : ''}`}
              onClick={() => {
                setActiveQueryId(vq.id);
                handleSpeak(vq.answer[currentLang]);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--emerald-400)' }}>💬</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>
                  {vq.query[currentLang]}
                </span>
              </div>
              <Volume2 size={16} className="text-cyan-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
