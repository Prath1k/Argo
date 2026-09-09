import type { VoiceQueryItem } from '../types';

export const VOICE_QUERIES: VoiceQueryItem[] = [
  {
    id: 'vq-1',
    query: {
      en: 'What is attacking my cotton crop?',
      mr: 'माझ्या कपाशीवर कोणत्या किडीचा प्रादुर्भाव झाला आहे?',
      hi: 'मेरे कपास की फसल पर किस कीट का प्रकोप हुआ है?'
    },
    answer: {
      en: 'Pink bollworm larvae detected inside young bolls. Soil nitrogen is good, but Red Edge index shows tissue damage. Install pheromone traps and spray 5% Neem extract.',
      mr: 'कपाशीच्या पात्यांमध्ये गुलाबी बोंडअळीचा शिरकाव झाला आहे. एकरी ५ कामगंध सापळे लावा आणि निंबोळी अर्क ५% फवारा.',
      hi: 'कपास की कलियों में गुलाबी सुंडी का प्रकोप है। प्रति एकड़ ५ फेरोमोन ट्रैप लगाएं और ५% नीम अर्क का छिड़काव करें।'
    },
    actionAudio: 'cotton_bollworm'
  },
  {
    id: 'vq-2',
    query: {
      en: 'Why are my onion leaf tips turning yellow? Is it blight?',
      mr: 'माझ्या कांद्याची पात शेंड्याकडून पिवळी का पडत आहे? हा करपा आहे का?',
      hi: 'मेरे प्याज की पत्तियां सिरों से पीली क्यों हो रही हैं? क्या यह झुलसा रोग है?'
    },
    answer: {
      en: 'No! Multimodal analysis confirms this is NOT fungal blight. Your soil nitrogen is very low at 38 mg/kg. Do not spray expensive fungicides! Apply 19:19:19 soluble fertilizer.',
      mr: 'नाही! हा करपा रोग नाही. मातीतील नत्र (नायट्रोजन) फक्त ३८ mg/kg इतके कमी आहे. महागडी बुरशीनाशके फवारू नका! १९:१९:१९ विद्राव्य खत फवारा.',
      hi: 'नहीं! यह कोई फफूंद रोग नहीं है। आपकी मिट्टी में नाइट्रोजन की भारी कमी है। फफूंदनाशक पर पैसे खर्च न करें! १९:१९:१९ खाद का छिड़काव करें।'
    },
    actionAudio: 'onion_nitrogen'
  },
  {
    id: 'vq-3',
    query: {
      en: 'What is the risk of soybean rust in my field right now?',
      mr: 'माझ्या सोयाबीन पिकावर सध्या तांबेरा रोगाचा किती धोका आहे?',
      hi: 'मेरी सोयाबीन की फसल पर रस्ट रोग का कितना खतरा है?'
    },
    answer: {
      en: 'Critical risk! Air humidity is 93% and Red Edge sensor detected cellular collapse. Apply preventive Hexaconazole or Trichoderma within 48 hours before visible spots appear.',
      mr: 'धोकादायक पातळी! हवेतील आर्द्रता ९३% असून पेशीय घट आढळली आहे. डोळ्यांना डाग दिसण्यापूर्वी पुढील ४८ तासांत हेक्झाकोनॅझोल किंवा ट्रायकोडर्मा फवारा.',
      hi: 'गंभीर खतरा! हवा में नमी ९३% है और स्पेक्ट्रल कैमरे ने फंगल संक्रमण पकड़ लिया है। अगले ४८ घंटों में निवारक छिड़काव अवश्य करें।'
    },
    actionAudio: 'soybean_rust'
  },
  {
    id: 'vq-4',
    query: {
      en: 'How much pesticide should I put in my 15-liter spray pump?',
      mr: 'माझ्या १५ लिटरच्या फवारणी पंपात किती औषध टाकावे?',
      hi: 'मेरे १५ लीटर के स्प्रे पंप में कितनी दवा डालनी चाहिए?'
    },
    answer: {
      en: 'For current pest stage, mix exactly 6 ml of Chlorantraniliprole (Coragen) in a 15-liter pump. Use flood-jet nozzle and spray in late afternoon.',
      mr: 'सध्याच्या किडीसाठी १५ लिटरच्या पंपात बरोबर ६ मिली कोराजन औषध टाका. संध्याकाळच्या वेळी फवारणी करा.',
      hi: 'वर्तमान कीट के लिए १५ लीटर के पंप में ठीक ६ मिली कोराजेन दवा मिलाएं। शाम के समय छिड़काव करें।'
    },
    actionAudio: 'dosage_guide'
  }
];
