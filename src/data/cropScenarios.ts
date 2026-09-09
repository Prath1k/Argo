import type { CropScenario } from '../types';

export const CROP_SCENARIOS: CropScenario[] = [
  {
    id: 'cotton-bollworm',
    cropName: 'Cotton',
    cropNameMr: 'कापूस',
    cropNameHi: 'कपास',
    diagnosis: 'Pink Bollworm & Early Cellular Necrosis',
    diagnosisMr: 'गुलाबी बोंडअळी व पेशीय क्षती (प्रारंभिक अवस्था)',
    diagnosisHi: 'गुलाबी सुंडी एवं प्रारंभिक कोशिकीय क्षति',
    category: 'pest',
    confidence: 96.4,
    severityPercent: 38,
    earlyWarningDays: 3,
    ndviScore: 0.52,
    ndreScore: 0.38, // Noticeable drop in red edge reflectance
    visionStressScore: 78,
    climateRiskScore: 84,
    soilNutrientScore: 65,
    defaultTelemetry: {
      airTemp: 31.5,
      humidity: 78,
      soilN: 110,
      soilP: 24,
      soilK: 180,
      soilMoisture: 42,
      soilPh: 7.2,
      vpd: 1.12,
      batteryLevel: 94,
      solarCharging: true,
      timestamp: 'Just now'
    },
    symptomSummary: {
      en: 'Rosetted flowers detected. Red Edge spectral drop indicates larval tunneling inside young squares before visual boll puncture.',
      mr: 'फुलांचे नुकसान व पात्यांमध्ये अळीचा प्रादुर्भाव. डोळ्यांना छिद्र दिसण्यापूर्वीच रेड-एज स्पेक्ट्रल परावर्तनात घट आढळली.',
      hi: 'गुलाब के फूल जैसे मुड़े हुए फूल और कलियों में सुंडी का प्रवेश। दृश्य क्षति से पहले स्पेक्ट्रल गिरावट।'
    },
    disambiguationNote: {
      en: 'Microclimate temperature (31.5°C) & high evening humidity are optimal for adult moth oviposition. Pheromone trap catch exceeded ETL (8 moths/trap/night).',
      mr: 'हवामानातील तापमान (३१.५° से) आणि आर्द्रता पतंगांच्या अंडी घालण्यासाठी अनुकूल आहे. कामगंध सापळ्यात पतंगांची संख्या आर्थिक नुकसान पातळीपेक्षा (ETL) जास्त.',
      hi: 'तापमान और शाम की नमी पतंगों के अंडे देने के लिए अनुकूल है। फेरोमोन जाल में कीट संख्या ईटीएल स्तर पार कर चुकी है।'
    },
    ipmAdvice: {
      cultural: {
        en: 'Install 5 Pheromone Traps per acre with Gossyplure septa at canopy height. Destroy rosetted flowers manually.',
        mr: 'एकर प्रति ५ कामगंध सापळे (फेरोमोन ट्रॅप) लावा. प्रादुर्भाव झालेली पात्या व फुले वेचून नष्ट करा.',
        hi: 'प्रति एकड़ ५ फेरोमोन ट्रैप लगाएं। प्रभावित फूलों और कलियों को तोड़कर नष्ट करें।'
      },
      biological: {
        en: 'Release Trichogramma bactrae egg parasitoids @ 60,000/acre at weekly intervals. Spray NSKE 5% (Neem Seed Kernel Extract).',
        mr: 'ट्रायकोग्रामा बॅक्टरी परजीवी प्रति एकरी ६०,००० सोडा. ५% निंबोळी अर्काची (NSKE) फवारणी करा.',
        hi: 'ट्राइकोग्रामा बैक्टरी परजीवी प्रति एकड़ ६०,००० छोड़ें। ५% नीम अर्क का छिड़काव करें।'
      },
      chemical: {
        activeIngredient: 'Chlorantraniliprole 18.5% SC',
        commercialBrand: 'Coragen / Ampligo',
        dosePer15LPump: '6 ml per 15L Knapsack Pump',
        dosePerAcre: '60 ml in 150-200 L Water',
        cibrcApproved: true,
        waitingPeriodDays: 20
      }
    },
    spectralDetails: {
      rgbDescription: 'Subtle rosette deformity on 3 flower buds; canopy looks largely green to naked eye.',
      nirDescription: '850nm reflectance drops 22% in upper terminal shoots due to internal tissue dehydration from boring.',
      ndviDescription: 'NDVI 0.52 (Moderate vigor, spotty density in mid-canopy).',
      ndreDescription: 'NDRE 0.38 (Sharp deviation from healthy baseline 0.65, identifying early pest feeding).'
    }
  },
  {
    id: 'soybean-rust',
    cropName: 'Soybean',
    cropNameMr: 'सोयाबीन',
    cropNameHi: 'सोयाबीन',
    diagnosis: 'Pre-Symptomatic Asian Soybean Rust (Fungal Inoculation)',
    diagnosisMr: 'सोयाबीन तांबेरा बुरशीचा पूर्व-लक्षण प्रादुर्भाव (स्पोर संक्रमण)',
    diagnosisHi: 'सोयाबीन गेरुआ (रस्ट) फंगल संक्रमण की प्रारंभिक अवस्था',
    category: 'disease',
    confidence: 97.8,
    severityPercent: 24,
    earlyWarningDays: 4,
    ndviScore: 0.61,
    ndreScore: 0.32, // Massive early NDRE drop before chlorosis
    visionStressScore: 62,
    climateRiskScore: 96,
    soilNutrientScore: 82,
    defaultTelemetry: {
      airTemp: 23.8,
      humidity: 93,
      soilN: 95,
      soilP: 28,
      soilK: 210,
      soilMoisture: 78,
      soilPh: 6.8,
      vpd: 0.28, // High moisture condensation
      batteryLevel: 88,
      solarCharging: false,
      timestamp: 'Just now'
    },
    symptomSummary: {
      en: 'Fungal spore germination active on abaxial leaf surfaces. Persistent high humidity (>90%) for 32 hours triggered epidemiological alarm.',
      mr: 'पानांच्या खालच्या बाजूवर बुरशीचे बीजाणू अंकुरित होत आहेत. सलग ३२ तास ९०% पेक्षा जास्त आर्द्रता राहिल्याने तांबेरा धोक्याचा इशारा.',
      hi: 'पत्तियों की निचली सतह पर फंगल बीजाणु सक्रिय। लगातार ९०% से अधिक आर्द्रता से संक्रमण की पुष्टि।'
    },
    disambiguationNote: {
      en: 'No visible brown pustules to the naked eye yet. Near-Infrared absorption shows spongy mesophyll collapse 48-72h ahead of visual yellowing.',
      mr: 'उघड्या डोळ्यांना अद्याप तपकिरी डाग दिसत नाहीत. परंतु स्पेक्ट्रल कॅमेरा पेशींची अंतर्गत हानी स्पष्टपणे दाखवतो. तातडीने प्रतिबंधात्मक फवारणी आवश्यक.',
      hi: 'आंखों से अभी कोई भूरे धब्बे दिखाई नहीं दे रहे हैं। स्पेक्ट्रल कैमरा कोशिकाओं का क्षरण दिखा रहा है।'
    },
    ipmAdvice: {
      cultural: {
        en: 'Ensure drainage in waterlogged furrows. Avoid excessive overhead irrigation and avoid walking in wet field to stop spore dispersal.',
        mr: 'शेतात पाणी साचू देऊ नका, पाण्याचा निचरा करा. पाने ओले असताना शेतात फिरणे टाळा जेणेकरून बुरशीचा प्रसार होणार नाही.',
        hi: 'खेत में जल निकासी की व्यवस्था करें। पत्तियां गीली होने पर खेत में जाने से बचें।'
      },
      biological: {
        en: 'Foliar spray of Trichoderma harzianum @ 5g/L or Pseudomonas fluorescens @ 5ml/L as a protective biological shield.',
        mr: 'ट्रायकोडर्मा व्हिरीडी ५ ग्रॅम/लिटर किंवा स्युडोमोनास फ्लुरोसन्स ५ मिली/लिटर प्रतिबंधात्मक फवारणी करा.',
        hi: 'ट्राइकोडर्मा ५ ग्राम/लीटर या स्यूडोमोनास ५ मिली/लीटर का सुरक्षात्मक छिड़काव करें।'
      },
      chemical: {
        activeIngredient: 'Hexaconazole 5% SC or Tebuconazole 25.9% EC',
        commercialBrand: 'Contaf Plus / Folicur',
        dosePer15LPump: '15 ml per 15L Knapsack Pump',
        dosePerAcre: '150-200 ml in 200 L Water',
        cibrcApproved: true,
        waitingPeriodDays: 30
      }
    },
    spectralDetails: {
      rgbDescription: 'Leaves appear uniformly dark green with microscopic translucent pinhead flecks under 10x lens.',
      nirDescription: 'Early intercellular fungal hyphae absorb NIR scattering, dropping reflectance from 48% to 29%.',
      ndviDescription: 'NDVI 0.61 (Appears healthy on conventional satellite broadband).',
      ndreDescription: 'NDRE 0.32 (Critical Red Edge dip, unmasking fungal germination before leaf chlorosis).'
    }
  },
  {
    id: 'onion-nitrogen-disambiguation',
    cropName: 'Onion (Disambiguation Demo)',
    cropNameMr: 'कांदा (अचूक निदान प्रात्यक्षिक)',
    cropNameHi: 'प्याज (सटीक निदान डेमो)',
    diagnosis: 'Severe Nitrogen Nutrient Deficiency (NOT Purple Blotch Fungal Disease)',
    diagnosisMr: 'तीव्र नत्र (नायट्रोजन) खताची कमतरता (हा करपा किंवा बुरशीजन्य रोग नाही!)',
    diagnosisHi: 'गंभीर नाइट्रोजन पोषक तत्व की कमी (यह झुलसा या फंगल रोग नहीं है!)',
    category: 'nutrient_deficiency',
    confidence: 98.6,
    severityPercent: 45,
    earlyWarningDays: 0,
    ndviScore: 0.44,
    ndreScore: 0.42,
    visionStressScore: 70,
    climateRiskScore: 18, // Low climate disease risk!
    soilNutrientScore: 22, // Critically low soil N
    defaultTelemetry: {
      airTemp: 29.2,
      humidity: 41, // Dry air - fungal blight impossible
      soilN: 38,   // Optimal is 140-200 mg/kg
      soilP: 64,
      soilK: 195,
      soilMoisture: 36,
      soilPh: 7.9,
      vpd: 2.34,
      batteryLevel: 98,
      solarCharging: true,
      timestamp: 'Just now'
    },
    symptomSummary: {
      en: 'Foliage shows yellowing from leaf tips downward. Standard visual vision models falsely classify this as Purple Blotch / Stemphylium Blight.',
      mr: 'पाने शेंड्यापासून खाली पिवळी पडत आहेत. केवळ कॅमेरा वापरल्यास हा करपा वाटतो, परंतु सेन्सर्सनुसार नत्र अत्यंत कमी आहे.',
      hi: 'पत्तियों के सिरे से पीलापन नीचे की ओर बढ़ रहा है। केवल कैमरे से देखने पर यह झुलसा जैसा लगता है।'
    },
    disambiguationNote: {
      en: 'MULTIMODAL DISAMBIGUATION: Soil sensor reveals Nitrogen is critically low (38 mg/kg) while air humidity is only 41% (suppressing fungal sporulation). Do NOT buy chemical fungicides! Save ₹1,800/acre input cost.',
      mr: 'बहुआयामी अचूकता: माती सेन्सरनुसार नत्र (N) फक्त ३८ mg/kg आहे आणि आर्द्रता ४१% आहे. हा बुरशी रोग नसून खताची कमतरता आहे. महागडी बुरशीनाशके फवारू नका! एकरी ₹१,८०० ची बचत.',
      hi: 'मल्टीमॉडल सटीकता: मिट्टी में नाइट्रोजन सिर्फ ३८ मिलीग्राम/किग्रा है। यह फफूंद रोग नहीं बल्कि पोषक तत्व की कमी है। महंगे फफूंदनाशक न खरीदें! प्रति एकड़ ₹१८०० बचाएं।'
    },
    ipmAdvice: {
      cultural: {
        en: 'Apply well-decomposed Farmyard Manure (FYM) or vermicompost. Check soil electrical conductivity and aeration.',
        mr: 'चांगले कुजलेले शेणखत किंवा गांडूळ खत द्या. जमिनीत वाफसा राखा.',
        hi: 'अच्छी तरह सड़ी हुई गोबर की खाद या केंचुआ खाद डालें।'
      },
      biological: {
        en: 'Soil drenching with Azotobacter / Azospirillum biofertilizers @ 2.5 kg/acre to boost biological atmospheric nitrogen fixation.',
        mr: 'अॅझोटोबॅक्टर किंवा अॅझोस्पिरिलम जैविक खत २.५ किलो प्रति एकर जमिनीत सोडा.',
        hi: 'एज़ोटोबैक्टर जैव उर्वरक २.५ किग्रा प्रति एकड़ मिट्टी में दें।'
      },
      chemical: {
        activeIngredient: 'Foliar 19:19:19 (Water Soluble NPK) + Urea Top Dressing',
        commercialBrand: 'Mahadhan 19:19:19',
        dosePer15LPump: '75-100 g per 15L Knapsack Pump',
        dosePerAcre: '25 kg Urea top dressed with light irrigation',
        cibrcApproved: true,
        waitingPeriodDays: 0
      }
    },
    spectralDetails: {
      rgbDescription: 'Uniform apical chlorosis (yellow tips) without concentric purple rings or water-soaked lesions.',
      nirDescription: 'Canopy cellular integrity remains intact; uniform reflection attenuation without necrotic lesions.',
      ndviDescription: 'NDVI 0.44 (Depressed chlorophyll content across entire plot, not localized fungal patches).',
      ndreDescription: 'NDRE 0.42 (Proportional to total nitrogen content; responds positively to nitrogen fertilization).'
    }
  },
  {
    id: 'sugarcane-red-rot',
    cropName: 'Sugarcane',
    cropNameMr: 'ऊस',
    cropNameHi: 'गन्ना',
    diagnosis: 'Early Red Rot Vascular Wilt (Early Stalk Infection)',
    diagnosisMr: 'ऊस तांबडे कुज (रेड रॉट) - प्राथमिक खोड संसर्ग',
    diagnosisHi: 'गन्ने का लाल सड़न रोग (रेड रॉट) - प्रारंभिक संवहन संक्रमण',
    category: 'disease',
    confidence: 94.2,
    severityPercent: 32,
    earlyWarningDays: 5,
    ndviScore: 0.58,
    ndreScore: 0.35,
    visionStressScore: 74,
    climateRiskScore: 88,
    soilNutrientScore: 71,
    defaultTelemetry: {
      airTemp: 32.8,
      humidity: 86,
      soilN: 130,
      soilP: 35,
      soilK: 240,
      soilMoisture: 88, // Excessive waterlogging
      soilPh: 6.4,
      vpd: 0.65,
      batteryLevel: 91,
      solarCharging: true,
      timestamp: 'Just now'
    },
    symptomSummary: {
      en: 'Loss of spindle leaf turgor and third leaf midrib discoloration. High soil moisture (>85%) combined with high temp favors vascular spread.',
      mr: 'शेंड्याची पाने कोमेजणे व पानाच्या मुख्य शिरेवर लालसर डाग. जास्त पाणी साचल्यामुळे व उष्ण तापमानामुळे रोगाचा झपाट्याने प्रसार.',
      hi: 'शीर्ष पत्तियों का मुरझाना और मध्य शिरा पर लालिमा। अधिक नमी से रोग में तेजी।'
    },
    disambiguationNote: {
      en: 'Internal sucrose inversion detected early. Multispectral thermal-NIR ratio reveals vascular xylem blockage before complete stalk drying.',
      mr: 'स्पेक्ट्रल विश्लेषणानुसार उसाच्या आत अन्नवाहिन्या बंद पडत असल्याचे प्राथमिक अवस्थेत स्पष्ट झाले आहे.',
      hi: 'स्पेक्ट्रल विश्लेषण से गन्ने के अंदर संवहन नलिकाओं में रुकावट का पता चला।'
    },
    ipmAdvice: {
      cultural: {
        en: 'Drain standing water immediately. Rogue out and incinerate infected stools along with roots.',
        mr: 'चर काढून साचलेले पाणी तातडीने बाहेर काढा. बाधित उसाची बेटे मुळासकट उपटून नष्ट करा.',
        hi: 'खेत से जल निकासी करें। रोगी पौधों को जड़ सहित उखाड़कर जला दें।'
      },
      biological: {
        en: 'Soil application of Trichoderma viride culture enriched with FYM @ 5 kg/acre around plant base.',
        mr: 'ट्रायकोडर्मा व्हिरीडी ५ किलो शेणखतात मिसळून उसाच्या बुंध्याभोवती टाका.',
        hi: 'ट्राइकोडर्मा ५ किग्रा गोबर की खाद में मिलाकर पौधों की जड़ों में दें।'
      },
      chemical: {
        activeIngredient: 'Carbendazim 50% WP or Thiophanate Methyl 70% WP',
        commercialBrand: 'Bavistin / Roko',
        dosePer15LPump: '30 g per 15L Knapsack Pump (Root Drenching)',
        dosePerAcre: '500 g in 300 L Water per acre',
        cibrcApproved: true,
        waitingPeriodDays: 45
      }
    },
    spectralDetails: {
      rgbDescription: 'Third leaf from crown shows subtle yellow-reddish stripe along the lower midrib.',
      nirDescription: 'Water-stress signature in upper canopy due to fungal vascular blockage preventing transpiration.',
      ndviDescription: 'NDVI 0.58 (Gradual decline from 0.76 over 7 days).',
      ndreDescription: 'NDRE 0.35 (Signals vascular xylem damage long before stalk rind collapse).'
    }
  },
  {
    id: 'pomegranate-telya',
    cropName: 'Pomegranate',
    cropNameMr: 'डाळिंब',
    cropNameHi: 'अनार',
    diagnosis: 'Bacterial Blight (Telya / तेल्या रोग)',
    diagnosisMr: 'बॅक्टेरियल ब्लाइट (तेल्या रोग) - प्राथमिक अवस्था',
    diagnosisHi: 'जीवाणु झुलसा (तेल्या रोग) - प्रारंभिक संक्रमण',
    category: 'disease',
    confidence: 96.9,
    severityPercent: 28,
    earlyWarningDays: 4,
    ndviScore: 0.55,
    ndreScore: 0.36,
    visionStressScore: 82,
    climateRiskScore: 92,
    soilNutrientScore: 68,
    defaultTelemetry: {
      airTemp: 28.5,
      humidity: 89,
      soilN: 105,
      soilP: 42,
      soilK: 260,
      soilMoisture: 65,
      soilPh: 7.4,
      vpd: 0.42,
      batteryLevel: 95,
      solarCharging: true,
      timestamp: 'Just now'
    },
    symptomSummary: {
      en: 'Water-soaked translucent angular spots on foliage and twigs. High humidity following drizzle created ideal bacterial multiplication conditions.',
      mr: 'पानांवर आणि फांद्यांवर तेलकट, पाण्यासारखे त्रिकोणी डाग. पाऊस व दमट हवेमुळे जिवाणूंची झपाट्याने वाढ.',
      hi: 'पत्तियों और टहनियों पर तेलीय, पारदर्शी कोणीय धब्बे। उच्च आर्द्रता से जीवाणु संक्रमण।'
    },
    disambiguationNote: {
      en: 'Bacterial exudates on leaf cuticle alter specular optical scattering under polarized multispectral lighting. Prompt treatment prevents fruit cracking.',
      mr: 'पानावरील तेलकट थरामुळे स्पेक्ट्रल प्रकाशाचे विकिरण बदलते. वेळीच उपाय केल्यास फळांवर काळे डाग व तडे पडणे रोखता येते.',
      hi: 'पत्तियों पर तेलीय स्राव से स्पेक्ट्रल रीडिंग में बदलाव। समय पर उपचार से फलों को फटने से बचाया जा सकता है।'
    },
    ipmAdvice: {
      cultural: {
        en: 'Prune infected twigs 5 cm below lesion using sterilized secateurs; paste cut ends with Bordeaux paste (10%).',
        mr: 'बाधित फांद्या डागाच्या २ इंच खालून निर्जंतुक कात्रीने छाटा. छाटलेल्या भागावर १०% बोर्डो पेस्ट लावा.',
        hi: 'संक्रमित टहनियों को छांटें और कटे हुए स्थान पर बोर्डो पेस्ट लगाएं।'
      },
      biological: {
        en: 'Foliar spray of Bacillus subtilis or Pseudomonas fluorescens @ 5 ml/L at 7-day intervals.',
        mr: 'बॅसिलस सबटायलीस किंवा स्युडोमोनास फ्लुरोसन्स ५ मिली/लिटर दर आठवड्याला फवारणी करा.',
        hi: 'बैसिलस सबटिलिस ५ मिली/लीटर का साप्ताहिक छिड़काव करें।'
      },
      chemical: {
        activeIngredient: 'Streptocycline 90:10 (9% w/w) + Copper Oxychloride 50% WP',
        commercialBrand: 'Plantomycin + Blitox',
        dosePer15LPump: '3 g Streptocycline + 35 g Blitox per 15L Pump',
        dosePerAcre: '30 g Streptocycline + 400 g COC in 200 L Water',
        cibrcApproved: true,
        waitingPeriodDays: 25
      }
    },
    spectralDetails: {
      rgbDescription: 'Small angular dark spots surrounded by yellow halos on mature leaves and green stems.',
      nirDescription: 'Cell wall pectin dissolution causes localized NIR attenuation in leaf lamina.',
      ndviDescription: 'NDVI 0.55 (Cluster degradation visible in lower quadrant of orchard canopy).',
      ndreDescription: 'NDRE 0.36 (Accurate early indicator of bacterial vascular penetration).'
    }
  }
];
