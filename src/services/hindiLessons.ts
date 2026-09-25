import { Lesson } from '../types/typing';

/**
 * Structured Hindi Devanagari Typing Lessons
 *
 * Implements the 1-to-4 progressive alphabet motor-learning method:
 * - Step 1: Single alphabet isolation & rhythmic repetition (e.g. क क कक ककक)
 * - Step 2: 2 alphabets pairing & alternating flow (e.g. क र कर रक करकर)
 * - Step 3: 3 alphabets tri-key combination & word formation (e.g. क र म कम मर करम कमर)
 * - Step 4: 4 alphabets quad-key expansion (e.g. क र म न मन नम करन मनन नमक)
 *
 * Progresses seamlessly through:
 * 1. Home row 1-to-4 progressive drills
 * 2. Upper row 1-to-4 progressive drills
 * 3. Bottom row 1-to-4 progressive drills
 * 4. Vowels & Matras 1-to-4 progressive drills
 * 5. Halant conjuncts & word flow
 * 6. Natural sentences & rich literature paragraphs
 */
export const HINDI_LESSONS: Lesson[] = [
  // =========================================================================
  // STAGE 7: 1-TO-4 PROGRESSIVE ALPHABET DRILLS (1 से 4 अक्षर क्रमिक अभ्यास)
  // =========================================================================

  // --- HOME ROW PROGRESSION (1 -> 2 -> 3 -> 4 -> 5 -> 6 Alphabets) ---
  {
    id: 'hindi-step1-k',
    stage: 7,
    title: '1 अक्षर अभ्यास: केवल "क" (Single Alphabet Anchor - K=क)',
    category: '1-to-4 Progressive Drills',
    description: 'Master the primary anchor key (K=क, right middle finger). Repeat single, double, and triple tap rhythms to build muscle memory.',
    targetKeys: ['क', ' '],
    primaryFinger: 'rightMiddle',
    content: 'क क क कक कक कक ककक ककक क कक ककक क क कक ककक कक ककक क कक ककक क कक ककक क क कक ककक क',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-step2-kr',
    stage: 7,
    title: '2 अक्षर अभ्यास: "क" और "र" (2 Alphabets Pairing - K=क, J=र)',
    category: '1-to-4 Progressive Drills',
    description: 'Add the second key (J=र, right index finger). Practice isolated repetition, alternating taps, and bidirectional pairs (कर, रक).',
    targetKeys: ['क', 'र', ' '],
    primaryFinger: 'rightIndex',
    content: 'र र र रर रर क र क र कर कर रक रक कर कर रक रक कक रर करकर रकरक कर रक कर रक कर रर कक कर रक कर',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-step3-krm',
    stage: 7,
    title: '3 अक्षर अभ्यास: "क", "र", और "म" (3 Alphabets Word Formation - C=म)',
    category: '1-to-4 Progressive Drills',
    description: 'Add the third key (C=म, left middle finger). Practice cross-hand rhythm and 3-letter Hindi roots (करम, कमर, मकर).',
    targetKeys: ['क', 'र', 'म', ' '],
    primaryFinger: 'leftMiddle',
    content: 'म म म मम मम कम कम मर मर रम रम कम कम मर मर करम करम कमर कमर मकर मकर करम कमर कर मर कम रम करम कमर मकर करम',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-step4-krmn',
    stage: 7,
    title: '4 अक्षर अभ्यास: "क, र, म, न" (4 Alphabets Flow - V=न)',
    category: '1-to-4 Progressive Drills',
    description: 'Add the fourth key (V=न, left index finger). Practice 4-key fluid combinations and realistic vocabulary (मन, नम, करन, मनन, नमक).',
    targetKeys: ['क', 'र', 'म', 'न', ' '],
    primaryFinger: 'leftIndex',
    content: 'न न न नन नन मन मन नम नम नर नर रन रन करन करन मनन मनन नमक नमक करमन नकमर करम मनन करन नमक मन नम नर करन मनन नमक',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-step5-krmns',
    stage: 7,
    title: '5 अक्षर अभ्यास: "क, र, म, न, स" (5 Alphabets Consolidation - M=स)',
    category: '1-to-4 Progressive Drills',
    description: 'Integrate the fifth key (M=स, right index reach). Practice sibilant patterns and balanced words (रस, सर, सनम, सरस, समर).',
    targetKeys: ['क', 'र', 'म', 'न', 'स', ' '],
    primaryFinger: 'rightIndex',
    content: 'स स स सस सस रस रस सर सर सन सन सम सम सरस सरस सनम सनम समर समर रस सर सनम सरस करम कमर सनम सरस समर रस सर सनम',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-step6-krmnst',
    stage: 7,
    title: '6 अक्षर अभ्यास: "क, र, म, न, स, त" (Full Home Row Master - L=त)',
    category: '1-to-4 Progressive Drills',
    description: 'Complete the home row by adding L=त (right ring finger). Practice all 6 keys in rhythmic flow and word endings (मत, तन, तर, करत, तरस).',
    targetKeys: ['क', 'र', 'म', 'न', 'स', 'त', ' '],
    primaryFinger: 'rightRing',
    content: 'त त त तत तत मत मत तन तन तर तर तक तक करत करत तरस तरस कतर कतर मत तन तर तक करत तरस कतर मत तन तर तक करत तरस कतर',
    difficulty: 'intermediate',
    language: 'hi',
  },

  // --- UPPER ROW PROGRESSION (1 -> 2 -> 3 -> 4 Alphabets) ---
  {
    id: 'hindi-upper-step1-p',
    stage: 7,
    title: 'ऊपरी पंक्ति 1 अक्षर: केवल "प" (Upper Reach Isolation - H=प)',
    category: '1-to-4 Progressive Drills',
    description: 'Extend left index finger upward to H=प, immediately returning to the home anchor.',
    targetKeys: ['प', ' '],
    primaryFinger: 'leftIndex',
    content: 'प प प पप पप पप पपप पपप प पप पपप प प पप पपप प पप पपप प पप पपप प',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-upper-step2-pb',
    stage: 7,
    title: 'ऊपरी पंक्ति 2 अक्षर: "प" और "ब" (Upper Dual Keys - H=प, Y=ब)',
    category: '1-to-4 Progressive Drills',
    description: 'Coordinate left and right index upward reaches: H=प and Y=ब.',
    targetKeys: ['प', 'ब', ' '],
    primaryFinger: 'rightIndex',
    content: 'ब ब ब बब बब प ब प ब पब बप पब बप बब पप पबप बपब पब बप पब बप पब बप बब पप पब बप',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-upper-step3-pbh',
    stage: 7,
    title: 'ऊपरी पंक्ति 3 अक्षर: "प, ब, ह" (Upper Tri-Keys - U=ह)',
    category: '1-to-4 Progressive Drills',
    description: 'Add U=ह (right index). Practice alternating three upper row consonants.',
    targetKeys: ['प', 'ब', 'ह', ' '],
    primaryFinger: 'rightIndex',
    content: 'ह ह ह हह हह पह बह हप हब पह बह हप हब बहप पहब पह बह हप हब पह बह हप हब बहप पहब',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-upper-step4-all',
    stage: 7,
    title: 'ऊपरी पंक्ति 4 अक्षर: "प, ब, ह, ग, द, ज" (Upper Row Word Integration)',
    category: '1-to-4 Progressive Drills',
    description: 'Add I=ग, O=द, P=ज and combine with home row anchors for full word flow (पर, बस, हल, गज, दल, जब, पद, दम).',
    targetKeys: ['प', 'ब', 'ह', 'ग', 'द', 'ज', ' '],
    primaryFinger: 'rightMiddle',
    content: 'ग ग ग गग गग पग बग गज दल पग बग गज हल पग बग गज दल पर बस हल गज पद दम पग बग गज हल पर बस जब पद दम हल',
    difficulty: 'intermediate',
    language: 'hi',
  },

  // --- BOTTOM ROW PROGRESSION (1 -> 2 -> 3 -> 4 Alphabets) ---
  {
    id: 'hindi-lower-step1-v',
    stage: 7,
    title: 'निचली पंक्ति 1 अक्षर: केवल "व" (Bottom Reach Isolation - B=व)',
    category: '1-to-4 Progressive Drills',
    description: 'Curl left index finger down to B=व, anchoring on F.',
    targetKeys: ['व', ' '],
    primaryFinger: 'leftIndex',
    content: 'व व व वव वव वव ववव ववव व वव ववव व व वव ववव व वव ववव व वव ववव व',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-lower-step2-vl',
    stage: 7,
    title: 'निचली पंक्ति 2 अक्षर: "व" और "ल" (Bottom Dual Keys - B=व, N=ल)',
    category: '1-to-4 Progressive Drills',
    description: 'Practice the adjacent bottom row keys B=व and N=ल with finger independence.',
    targetKeys: ['व', 'ल', ' '],
    primaryFinger: 'rightIndex',
    content: 'ल ल ल लल लल व ल व ल वल लव वल लव वल लव वव लल वलल लवव वल लव वल लव वल लव वव लल वल लव',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-lower-step3-vly',
    stage: 7,
    title: 'निचली पंक्ति 3 अक्षर: "व, ल, य" (Bottom Tri-Keys - Slash=य)',
    category: '1-to-4 Progressive Drills',
    description: 'Reach right pinky down to Slash=य, forming pairs with व and ल.',
    targetKeys: ['व', 'ल', 'य', ' '],
    primaryFinger: 'rightPinky',
    content: 'य य य यय यय वय लय यव यल वय लय यव यल लयव वयल वय लय यव यल लयव वयल वय लय यव यल',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-lower-step4-all',
    stage: 7,
    title: 'निचली पंक्ति 4 अक्षर: "व, ल, य, श" (Bottom Row Word Integration - Shift+M=श)',
    category: '1-to-4 Progressive Drills',
    description: 'Complete the lower row with sibilant Shift+M=श and combine into authentic Hindi words (वन, वर, यश, शव, यम, लय, वश).',
    targetKeys: ['व', 'ल', 'य', 'श', ' '],
    primaryFinger: 'rightRing',
    content: 'श श श शश शश शव यश शल शम शव यश शल शम वन वर यश वल शव यम पल सब लय वश वन वर यश वल शव यम लय वश वर सब',
    difficulty: 'intermediate',
    language: 'hi',
  },

  // --- VOWEL & RETROFLEX PROGRESSION ---
  {
    id: 'hindi-vowels-step1-primary',
    stage: 7,
    title: 'स्वर क्रमिक अभ्यास: अ, आ, इ, ई, उ, ऊ (Independent Vowels)',
    category: '1-to-4 Progressive Drills',
    description: 'Step-by-step independent vowels: start with D-shift=अ, add E-shift=आ, F-shift=इ, R-shift=ई, G-shift=उ, T-shift=ऊ.',
    targetKeys: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', ' '],
    primaryFinger: 'leftMiddle',
    content: 'अ अ अ आ आ आ इ इ इ ई ई ई उ उ उ ऊ ऊ ऊ अब आज इस ईख उस ऊपर अगर आग इतर ऊन आम अमर आज उस ईख आम अब अगर ऊन',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-vowels-step2-extended',
    stage: 7,
    title: 'उच्च स्वर क्रमिक अभ्यास: ए, ऐ, ओ, औ, ऋ (Extended Vowels)',
    category: '1-to-4 Progressive Drills',
    description: 'Extended vowels: S-shift=ए, W-shift=ऐ, A-shift=ओ, Q-shift=औ, Equal-shift=ऋ.',
    targetKeys: ['ए', 'ऐ', 'ओ', 'औ', 'ऋ', ' '],
    primaryFinger: 'leftRing',
    content: 'ए ए ए ऐ ऐ ऐ ओ ओ ओ औ औ औ ऋ ऋ ऋ एक ऐनक ओस और ऋषि ऐसा ओज एकता औरत ऋण एक ओस ऐसा और एकता ऐनक ओज औरत ऋषि',
    difficulty: 'intermediate',
    language: 'hi',
  },
  {
    id: 'hindi-retroflex-step',
    stage: 7,
    title: 'मूर्धन्य एवं महाप्राण: ट, ठ, ड, ढ, ख, थ, ध, फ (Shift Drill)',
    category: '1-to-4 Progressive Drills',
    description: 'Practice retroflex consonants and aspirated shifts (ट ठ ड ढ ख थ ध फ) through structured word pairs.',
    targetKeys: ['ट', 'ठ', 'ड', 'ढ', 'ख', 'थ', 'ध', 'फ', ' '],
    primaryFinger: 'rightPinky',
    content: 'ट ठ ड ढ ख थ ध फ खत फल धन थन डर ठग घट खट मठ खग डफ थल पथ धन फल खत डर घट खत धन फल मठ पथ',
    difficulty: 'intermediate',
    language: 'hi',
  },

  // =========================================================================
  // STAGE 8: MATRAS & HALANT PROGRESSION (मात्राएं, अनुस्वार एवं हलन्त)
  // =========================================================================
  {
    id: 'hindi-matra-step1-aa',
    stage: 8,
    title: 'मात्रा 1: आ की मात्रा "ा" (Single Matra Repetition - E=ा)',
    category: 'Hindi Matras',
    description: 'Attach the "आ" matra to consonants. Repeat basic syllables (का, रा, मा, ना) then form dual and triple syllable words.',
    targetKeys: ['ा', 'क', 'र', 'म', 'न', ' '],
    primaryFinger: 'leftMiddle',
    content: 'का का का रा रा रा मा मा मा ना ना ना काम काम नाम नाम रात रात लाल लाल काका मामा नाना राजा काम नाम रात लाल',
    difficulty: 'beginner',
    language: 'hi',
  },
  {
    id: 'hindi-matra-step2-i-ee',
    stage: 8,
    title: 'मात्रा 2: इ (ि) और ई (ी) की मात्राएं (Short & Long I - F=ि, R=ी)',
    category: 'Hindi Matras',
    description: 'Practice short "ि" (left of consonant) and long "ी" (right of consonant) in repetitive pairs.',
    targetKeys: ['ि', 'ी', 'क', 'म', 'न', 'स', ' '],
    primaryFinger: 'leftIndex',
    content: 'कि की कि की किक कीक दिन दीन मिल मील किसान किताब सीमा पानी माली रानी मीना दीदी गीत तीर नदी दीपक मीठी कहानी',
    difficulty: 'intermediate',
    language: 'hi',
  },
  {
    id: 'hindi-matra-step3-u-oo',
    stage: 8,
    title: 'मात्रा 3: उ (ु), ऊ (ू), और ऋ (ृ) की मात्राएं (G=ु, T=ू, Equal=ृ)',
    category: 'Hindi Matras',
    description: 'Bottom diacritics attached under consonants for short u, long oo, and vocalic ri.',
    targetKeys: ['ु', 'ू', 'ृ', 'प', 'ब', 'स', 'ध', ' '],
    primaryFinger: 'leftIndex',
    content: 'कु कू कु कू पुल सुख धुप फूल दूध धूप गुलाब सुमन सूरज तराजू चूहा कृपा गृह मधुर मुकुट खुश गुरु सुंदर रूप',
    difficulty: 'intermediate',
    language: 'hi',
  },
  {
    id: 'hindi-matra-step4-e-ai-o-au',
    stage: 8,
    title: 'मात्रा 4: े, ै, ो, ौ की मात्राएं (Upper Diacritics - S=े, W=ै, A=ो, Q=ौ)',
    category: 'Hindi Matras',
    description: 'Upper matras attached above the shirorekha line for E, Ai, O, and Au.',
    targetKeys: ['े', 'ै', 'ो', 'ौ', 'क', 'म', 'स', ' '],
    primaryFinger: 'leftRing',
    content: 'के कै को कौ केला मेला पैसा बैल मोर तोता पौधा नौका शेर पेड़ कैसा कौन देश सेवा मौसम जैसा नौकर तैयार भोजन',
    difficulty: 'intermediate',
    language: 'hi',
  },
  {
    id: 'hindi-halant-conjuncts',
    stage: 8,
    title: 'हलन्त एवं संयुक्त अक्षर: ् (हलन्त), ं (अनुस्वार), ँ, । (पूर्णविराम)',
    category: 'Hindi Matras',
    description: 'Construct half consonants using halant (D=्), nasal anusvara (X=ं, X-shift=ँ), and Devanagari full stop (Period-shift=।).',
    targetKeys: ['्', 'ं', 'ँ', '।', 'क', 'त', 'स', ' '],
    primaryFinger: 'leftMiddle',
    content: 'सत्य प्यार क्या ध्यान पत्ता दिल्ली बच्चा रंग पतंग चांद आंख संत हंस कष्ट स्पष्ट न्याय राष्ट्र धर्म कर्म।',
    difficulty: 'advanced',
    language: 'hi',
  },

  // =========================================================================
  // STAGE 9: WORDS & SENTENCE FLOW (शब्द एवं सरल वाक्य)
  // =========================================================================
  {
    id: 'hindi-words-daily',
    stage: 9,
    title: 'हिन्दी दैनिक शब्दावली: उच्च आवृत्ति शब्द (Word Building)',
    category: 'Hindi Vocabulary',
    description: 'Fluid typing of high-frequency Hindi words from everyday communication.',
    targetKeys: ['all'],
    content: 'घर पानी चाय खाना मित्र पुस्तक समय सूरज विद्यालय भारत नगर सड़क परिवार जीवन स्वास्थ्य प्रकाश आनंद कर्तव्य',
    difficulty: 'intermediate',
    language: 'hi',
  },
  {
    id: 'hindi-sentences-simple',
    stage: 9,
    title: 'हिन्दी सरल वाक्य अभ्यास: शुद्ध विराम चिह्न (Punctuation Flow)',
    category: 'Hindi Sentences',
    description: 'Type fluent natural Hindi sentences with proper spacing and purnaviram (पूर्णविराम)।',
    targetKeys: ['all'],
    content: 'सत्य की हमेशा विजय होती है। हमें प्रतिदिन नया ज्ञान सीखना चाहिए। समय बहुत मूल्यवान धन है। परिश्रम से ही सभी कार्य सिद्ध होते हैं। माता-पिता का सम्मान करना चाहिए।',
    difficulty: 'intermediate',
    language: 'hi',
  },
  {
    id: 'hindi-sentences-quotes',
    stage: 9,
    title: 'हिन्दी प्रेरक सुविचार एवं सूक्तियां (Inspiring Thoughts)',
    category: 'Hindi Sentences',
    description: 'Inspiring philosophical quotes and proverbs in authentic Hindi.',
    targetKeys: ['all'],
    content: 'उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए। निरंतर अभ्यास से ही साधारण व्यक्ति असाधारण कार्य कर पाता है। खुद पर विश्वास रखें और आगे बढ़ें। जहां चाह होती है, वहीं राह निकलती है।',
    difficulty: 'intermediate',
    language: 'hi',
  },

  // =========================================================================
  // STAGE 10: FULL PARAGRAPHS & LITERATURE (विस्तृत अनुच्छेद एवं कहानियां)
  // =========================================================================
  {
    id: 'hindi-para-hardwork',
    stage: 10,
    title: 'हिन्दी अनुच्छेद: परिश्रम और सफलता की कुंजी',
    category: 'Hindi Paragraphs',
    description: 'A comprehensive motivational paragraph in Devanagari Hindi for rhythm, accuracy, and sustained endurance.',
    targetKeys: ['all'],
    content: 'परिश्रम ही मानव जीवन की सच्ची पहचान और सफलता की सबसे बड़ी कुंजी है। जो व्यक्ति निरंतर निष्ठा से मेहनत करता है, वह जीवन में हर कठिन चुनौती को सरलता से पार कर लेता है। आलस्य मनुष्य का सबसे घातक शत्रु है जबकि लगन और अनुशासन उसके सबसे सच्चे मित्र हैं। ज्ञान और परिश्रम के बल पर ही हम अपने समाज और राष्ट्र को नई ऊंचाइयों तक पहुंचा सकते हैं।',
    difficulty: 'advanced',
    isParagraph: true,
    language: 'hi',
  },
  {
    id: 'hindi-para-culture',
    stage: 10,
    title: 'हिन्दी अनुच्छेद: भारतीय संस्कृति और अनेकता में एकता',
    category: 'Hindi Paragraphs',
    description: 'A rich narrative paragraph celebrating the diversity, heritage, and unity of Indian culture.',
    targetKeys: ['all'],
    content: 'भारत की संस्कृति संसार की प्राचीनतम और सबसे समृद्ध संस्कृतियों में से एक है। अनेकता में एकता हमारे देश की सबसे विशिष्ट और गौरवमयी पहचान है। विभिन्न भाषाएं, रीति-रिवाज, पर्व और परंपराएं मिलकर एक सुंदर उपवन की तरह इस पावन भूमि को सुशोभित करते हैं। आपसी सद्भाव, प्रेम और बंधुत्व की भावना ही हमारे राष्ट्र की सबसे मजबूत नींव है।',
    difficulty: 'advanced',
    isParagraph: true,
    language: 'hi',
  },
  {
    id: 'hindi-para-nature',
    stage: 10,
    title: 'हिन्दी अनुच्छेद: प्रकृति का सौंदर्य एवं पर्यावरण संरक्षण',
    category: 'Hindi Paragraphs',
    description: 'Lyrical Hindi prose describing mountains, forests, rivers, and the duty of ecological stewardship.',
    targetKeys: ['all'],
    content: 'प्रकृति हमारे जीवन का सबसे अनमोल और कल्याणकारी उपहार है। कलकल बहती नदियां, हरे-भरे सघन वन और गगनचुंबी पर्वत मन को अपार शांति और नवजीवन प्रदान करते हैं। आधुनिक युग में प्रकृति का अंधाधुंध दोहन विनाशकारी सिद्ध हो सकता है। पर्यावरण की रक्षा करना केवल हमारा कर्तव्य ही नहीं, बल्कि आने वाली पीढ़ियों के प्रति हमारा सबसे पवित्र दायित्व है।',
    difficulty: 'master',
    isParagraph: true,
    language: 'hi',
  },
  {
    id: 'hindi-para-space-isro',
    stage: 10,
    title: 'हिन्दी अनुच्छेद: विज्ञान, नवाचार और अंतरिक्ष की यात्रा',
    category: 'Hindi Paragraphs',
    description: 'Technical and scientific Hindi prose covering technological innovation and space exploration.',
    targetKeys: ['all'],
    content: 'भारत ने अंतरिक्ष अनुसंधान और आधुनिक विज्ञान के क्षेत्र में विश्व पटल पर अपनी एक सशक्त पहचान बनाई है। चंद्रयान और मंगलयान जैसे ऐतिहासिक अभियानों ने यह सिद्ध कर दिया कि नवाचार और अटूट दृढ़ संकल्प से असंभव लक्ष्य भी प्राप्त किए जा सकते हैं। हमारे वैज्ञानिकों की निष्ठा और डिजिटल क्रांति ने युवाओं में शोध और जिज्ञासा की नई उमंग भर दी है।',
    difficulty: 'master',
    isParagraph: true,
    language: 'hi',
  },
  {
    id: 'hindi-para-story-panchtantra',
    stage: 10,
    title: 'हिन्दी कथा: पंचतंत्र की नीति कथा - संगठन में शक्ति',
    category: 'Hindi Paragraphs',
    description: 'A complete moral fable from the Panchatantra on solidarity, team harmony, and collective strength.',
    targetKeys: ['all'],
    content: 'एक सघन वन में कबूतरों का एक विशाल झुंड भोजन की खोज में आकाश में उड़ रहा था। एक चतुर शिकारी ने नीचे भूमि पर दाना बिखेर कर एक मजबूत जाल बिछा रखा था। कबूतरों ने जैसे ही नीचे उतरकर दाना चुगना आरंभ किया, वे सभी शिकारी के जाल में बुरी तरह फंस गए। संकट की इस घड़ी में उनके बुद्धिमान मुखिया ने धैर्य बंधाया और कहा कि घबराने से कुछ नहीं होगा। मुखिया के संकेत पर सभी कबूतरों ने एक साथ अपने पंख फड़फड़ाए और पूरे जाल को ही लेकर गगन में उड़ चले। यह नीति कथा हमें सिखाती है कि एकता और संगठन में अपार शक्ति होती है।',
    difficulty: 'master',
    isParagraph: true,
    language: 'hi',
  },
  {
    id: 'hindi-para-swami-vivekananda',
    stage: 10,
    title: 'हिन्दी अनुच्छेद: स्वामी विवेकानंद का ओजस्वी संदेश',
    category: 'Hindi Paragraphs',
    description: 'Inspiring philosophical prose based on Swami Vivekananda’s address to youth and humankind.',
    targetKeys: ['all'],
    content: 'स्वामी विवेकानंद ने संपूर्ण विश्व को मानवता, सहिष्णुता और अध्यात्म का अमर संदेश दिया। उनका प्रसिद्ध आह्वान था—उठो, जागो और तब तक मत रुको जब तक कि लक्ष्य प्राप्त न हो जाए। उन्होंने युवाओं को निर्भय होकर अपने चरित्र का निर्माण करने और राष्ट्र निर्माण में सक्रिय योगदान देने के लिए निरंतर प्रेरित किया। सत्य, प्रेम और सेवा ही मानव का सर्वोत्तम धर्म है।',
    difficulty: 'master',
    isParagraph: true,
    language: 'hi',
  },
];

// Structured subsets for granular curriculum filtering
export const HINDI_PROGRESSIVE_1_TO_4_DRILLS = HINDI_LESSONS.filter(
  (l) => l.category === '1-to-4 Progressive Drills'
);
export const HINDI_CHARACTER_DRILLS = HINDI_LESSONS.filter((l) => l.stage === 7);
export const HINDI_MATRA_LESSONS = HINDI_LESSONS.filter((l) => l.stage === 8);
export const HINDI_WORD_LESSONS = HINDI_LESSONS.filter((l) => l.stage === 9);
export const HINDI_PARAGRAPH_LESSONS = HINDI_LESSONS.filter((l) => l.stage === 10 || l.isParagraph);

export const HINDI_STAGES = [
  { num: 7, title: '1 से 4 अक्षर क्रमिक अभ्यास (1-to-4 Progressive Drills)', icon: '🇮🇳' },
  { num: 8, title: 'हिन्दी मात्राएं एवं हलन्त (Matras & Diacritics)', icon: '✨' },
  { num: 9, title: 'हिन्दी शब्द एवं सुविचार (Words & Sentences)', icon: '💬' },
  { num: 10, title: 'हिन्दी विस्तृत अनुच्छेद (Full Literature & Stories)', icon: '📜' },
];

export default HINDI_LESSONS;
