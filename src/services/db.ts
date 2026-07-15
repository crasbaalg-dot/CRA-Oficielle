/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, auth, isFirebaseEnabled } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  NewsItem, 
  AnnouncementItem, 
  Member, 
  FirstAidTopic, 
  BloodCampaign, 
  VolunteerApplication, 
  ContactMessage, 
  InstitutionStats, 
  Settings,
  User
} from '../types';

// Error handling types and helpers as required by the Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Pre-seeded high-quality bilingual data for Sidi Bel Abbès Wilaya Committee
const DEFAULT_STATS: InstitutionStats = {
  volunteersCount: 480,
  bloodUnitsCount: 1250,
  firstAidTrainedCount: 850,
  campaignsCount: 24
};

const DEFAULT_SETTINGS: Settings = {
  siteNameAr: "الهلال الأحمر الجزائري - لجنة ولاية سيدي بلعباس",
  siteNameFr: "Croissant-Rouge Algérien - Comité de Sidi Bel Abbès",
  phone: "048 54 22 11",
  emergencyPhone: "048 54 11 11",
  email: "cra.sba.alg@gmail.com",
  addressAr: "شارع العقيد عميروش، سيدي بلعباس، الجزائر",
  addressFr: "Rue Colonel Amirouche, Sidi Bel Abbès, Algérie",
  workingHoursAr: "الأحد - الخميس: 08:30 - 16:30",
  workingHoursFr: "Dimanche - Jeudi: 08:30 - 16:30",
  facebookUrl: "https://facebook.com/cra.sba",
  twitterUrl: "https://twitter.com/cra_sba",
  youtubeUrl: "https://youtube.com/cra_sba",
  instagramUrl: "https://instagram.com/cra_sba"
};

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    titleAr: "إطلاق قافلة تضامنية لتوزيع المساعدات الشتوية بالمناطق المعزولة بسيدي بلعباس",
    titleFr: "Lancement d'une caravane de solidarité pour distribuer des aides hivernales dans les zones isolées",
    summaryAr: "انطلقت اليوم القافلة التضامنية السنوية الموجهة لفائدة العائلات القاطنة بالمناطق النائية والقرى الجبلية لولاية سيدي بلعباس، محملة بالأغطية، الألبسة والمواد الغذائية الأساسية.",
    summaryFr: "La caravane de solidarité annuelle a démarré aujourd'hui pour venir en aide aux familles résidant dans les zones reculées et les villages montagneux de Sidi Bel Abbès, chargée de couvertures, de vêtements et de denrées essentielles.",
    contentAr: "في إطار حملة التضامن الشتوي، أشرف رئيس اللجنة الولائية للهلال الأحمر الجزائري لولاية سيدي بلعباس على انطلاق قافلة تضامنية كبرى باتجاه القرى والمناطق الظلية. القافلة محملة بأكثر من 500 حصة غذائية متكاملة، 1000 غطاء صوفي، وملابس شتوية للأطفال والمسنين. يشارك في هذه العملية أكثر من 40 متطوعاً ومسعفاً لتأمين الفحص الطبي وتوزيع المستلزمات مباشرة للعائلات المحتاجة بالتنسيق مع السلطات المحلية والبلدية.",
    contentFr: "Dans le cadre de la campagne de solidarité hivernale, le président du comité de wilaya du Croissant-Rouge Algérien de Sidi Bel Abbès a supervisé le lancement d'une grande caravane de solidarité vers les villages de la wilaya. La caravane transporte plus de 500 colis alimentaires complets, 1000 couvertures en laine et des vêtements d'hiver pour enfants et personnes âgées. Plus de 40 bénévoles et secouristes participent à cette opération pour assurer des bilans de santé et distribuer les colis directement aux familles nécessiteuses.",
    categoryAr: "مساعدات إنسانية",
    categoryFr: "Aide Humanitaire",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    date: "2026-01-12",
    views: 342,
    isPinned: true,
    isDraft: false
  },
  {
    id: "news-2",
    titleAr: "حملة كبرى للتبرع بالدم بساحة أول نوفمبر بسيدي بلعباس بالتنسيق مع مديرية الصحة",
    titleFr: "Grande campagne de don de sang à la place du 1er Novembre en coordination avec la DSP",
    summaryAr: "تنظم اللجنة الولائية حملة تبرع واسعة بالدم تحت شعار 'قطرة دم تساوي حياة' لتدعيم بنك الدم بمستشفى عبد القادر حساني بسيدي بلعباس.",
    summaryFr: "Le comité de wilaya organise une vaste campagne de don de sang sous le slogan 'Une goutte de sang égale une vie' pour approvisionner la banque de sang de l'hôpital Abdelkader Hassani.",
    contentAr: "تعلن اللجنة الولائية للهلال الأحمر الجزائري بالتنسيق مع مركز حقن الدم لولاية سيدي بلعباس عن انطلاق الحملة الكبرى للتبرع بالدم بساحة أول نوفمبر بوسط المدينة. تهدف هذه المبادرة إلى جمع أكبر عدد ممكن من أكياس الدم بمختلف الفصائل، وتلبية الاحتياجات المتزايدة للمرضى، خاصة بمصالح التوليد والجراحة والسرطان بمستشفى الدكتور عبد القادر حساني. ندعو كافة مواطني الولاية للمشاركة بقوة والمساهمة في إنقاذ الأرواح.",
    contentFr: "Le comité de wilaya du Croissant-Rouge Algérien, en coordination avec le centre de transfusion sanguine de Sidi Bel Abbès, annonce le lancement d'une grande campagne de collecte de sang sur la place du 1er Novembre, au centre-ville. Cette initiative vise à collecter un maximum de poches de sang de tous groupes sanguins afin de répondre aux besoins croissants des patients hospitalisés, notamment dans les services de maternité, de chirurgie et d'oncologie de l'hôpital Dr Abdelkader Hassani. Nous appelons tous les citoyens à se mobiliser.",
    categoryAr: "التبرع بالدم",
    categoryFr: "Don de Sang",
    image: "https://images.unsplash.com/photo-1615461066841-6116ecdacd04?q=80&w=1200&auto=format&fit=crop",
    date: "2026-02-05",
    views: 189,
    isPinned: false,
    isDraft: false
  },
  {
    id: "news-3",
    titleAr: "تخرج دفعة جديدة من المسعفين المتطوعين بعد اجتياز دورة الإسعافات الأولية الأساسية",
    titleFr: "Remise des diplômes à une nouvelle promotion de secouristes après une formation intensive",
    summaryAr: "أقامت لجنة ولاية سيدي بلعباس حفلاً تكريمياً على شرف 35 متطوعاً أتموا بنجاح الدورة التكوينية المعمقة في الإسعافات الأولية وإنقاذ الأرواح.",
    summaryFr: "Le comité de Sidi Bel Abbès a organisé une cérémonie en l'honneur de 35 bénévoles ayant achevé avec succès leur formation approfondie en secourisme de premier secours.",
    contentAr: "في حفل رسمي بهيج بمقر الهلال الأحمر الجزائري، تم تسليم الشهادات الرسمية لخمسة وثلاثين (35) مسعفاً متطوعاً جديداً. تلقى المشاركون على مدار أسبوعين تدريبات نظرية وتطبيقية مكثفة شملت الإنعاش القلبي الرئوي، إسعاف الحروق والكسور، التعامل مع الأزمات، والإنقاذ الجماعي في حالات الكوارث الطبيعية. ستساهم هذه الدفعة الشابة في تعزيز قدرات التدخل السريع للجنة في مختلف الفعاليات والنشاطات الإنسانية بالولاية.",
    contentFr: "Lors d'une cérémonie officielle chaleureuse au siège du Croissant-Rouge Algérien, des certificats officiels ont été remis à 35 nouveaux secouristes bénévoles. Les participants ont suivi durant deux semaines des séances théoriques et pratiques intensives couvrant la réanimation cardio-pulmonaire, la prise en charge des brûlures et fractures, la gestion des crises et le secourisme de masse en cas de catastrophes naturelles. Ces jeunes recrues renforceront l'équipe d'intervention rapide.",
    categoryAr: "تدريب وتكوين",
    categoryFr: "Formation & Secours",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
    date: "2026-03-20",
    views: 295,
    isPinned: false,
    isDraft: false
  }
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    titleAr: "إعلان طارئ: انطلاق تسجيلات المتطوعين الجدد للمشاركة في موائد الإفطار لرمضان 2026",
    titleFr: "Annonce Urgente : Ouverture des inscriptions pour les bénévoles de Ramadhan 2026",
    contentAr: "تعلن اللجنة الولائية بسيدي بلعباس عن فتح باب التطوع لعامة المواطنين وخاصة الشباب والطلبة، للمشاركة في تنظيم وتأطير موائد الإفطار (مطاعم الهلال الأحمر) وحملات توزيع الوجبات على السائقين والمسافرين عبر الطرق السريعة خلال شهر رمضان المبارك. التسجيل مفتوح عبر المنصة الإلكترونية أو بالتقرب من مقر اللجنة.",
    contentFr: "Le comité de wilaya de Sidi Bel Abbès annonce l'ouverture des inscriptions pour tous les citoyens, en particulier les jeunes et les étudiants, pour participer à l'organisation et au service des restaurants du Ramadhan (Iftar Al-Hilal) ainsi qu'aux caravanes de distribution de repas sur les axes routiers. Les inscriptions se font en ligne ou au niveau de notre siège.",
    priority: "high",
    date: "2026-03-01",
    isPinned: true
  },
  {
    id: "ann-2",
    titleAr: "برنامج التكوين في الإسعافات الأولية للجمهور العريض لشهر ماي 2026",
    titleFr: "Calendrier des formations de secourisme pour le grand public - Mai 2026",
    contentAr: "تنهي اللجنة إلى علم كافة مواطني ولاية سيدي بلعباس الراغبين في اكتساب مهارات الإسعاف الأولي، أنه تم فتح التسجيلات لدورة الإسعاف الجماهيري لشهر ماي. الدورة تهدف لتلقين المبادئ الأساسية لإنقاذ الأرواح والتدخل السريع. المقاعد محدودة والتسجيل مجاني.",
    contentFr: "Le comité informe l'ensemble des citoyens de Sidi Bel Abbès désireux d'acquérir les compétences de premier secours, que les inscriptions pour la session de mai sont ouvertes. La formation vise à enseigner les gestes qui sauvent. Les places sont limitées et l'inscription est gratuite.",
    priority: "medium",
    date: "2026-04-15",
    isPinned: false
  }
];

const INITIAL_MEMBERS: Member[] = [
  {
    id: "mem-1",
    nameAr: "د. عبد القادر بن عيسى",
    nameFr: "Dr. Abdelkader Benaissa",
    roleAr: "رئيس اللجنة الولائية",
    roleFr: "Président du Comité de Wilaya",
    bioAr: "طبيب مختص في الصحة العمومية، وهب حياته للعمل الإنساني والخيري، يقود اللجنة بمهنية ويسعى لتوسيع نشاطاتها الإنسانية لتشمل كافة بلديات الولاية الـ 52.",
    bioFr: "Médecin spécialiste en santé publique, dédié à l'action humanitaire, il dirige le comité avec professionnalisme et s'efforce d'étendre les actions à l'ensemble des 52 communes de la wilaya.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    email: "president.cra.sba@gmail.com",
    phone: "0550 11 22 33",
    displayOrder: 1
  },
  {
    id: "mem-2",
    nameAr: "الأستاذة مريم عباسي",
    nameFr: "Mme. Meriem Abbassi",
    roleAr: "الأمينة العامة للجنة",
    roleFr: "Secrétaire Générale du Comité",
    bioAr: "ناشطة اجتماعية وحقوقية متميزة، تشرف على التنسيق الإداري والمالي للجنة الولائية، وتتابع ملفات المساعدات الإنسانية وتوزيع الإعانات بدقة.",
    bioFr: "Militante sociale et juriste, elle supervise la coordination administrative et financière du comité de wilaya, et assure le suivi minutieux de la distribution des aides humanitaires.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    email: "sg.cra.sba@gmail.com",
    phone: "0551 44 55 66",
    displayOrder: 2
  },
  {
    id: "mem-3",
    nameAr: "ياسين بومدين",
    nameFr: "Yassine Boumediene",
    roleAr: "مسؤول قسم الشباب والتطوع",
    roleFr: "Responsable Jeunesse & Volontariat",
    bioAr: "شاب طموح ومنظم، يقود شبكة تضم مئات المتطوعين عبر تراب الولاية، ويشرف على تأطير وتنظيم عمليات التدخل والإسعاف في الفعاليات والمناسبات.",
    bioFr: "Jeune dynamique et organisé, il dirige un réseau de centaines de bénévoles à travers la wilaya et supervise l'organisation des équipes d'intervention sur le terrain.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    email: "volontaires.cra.sba@gmail.com",
    phone: "0552 77 88 99",
    displayOrder: 3
  }
];

const INITIAL_FIRST_AID: FirstAidTopic[] = [
  {
    id: "fa-1",
    titleAr: "الإنعاش القلبي الرئوي (CPR)",
    titleFr: "Réanimation Cardio-Pulmonaire (RCR)",
    descriptionAr: "خطوة بخطوة لإنقاذ شخص توقف قلبه وتوقف عن التنفس. تدخل سريع يضاعف فرص البقاء على قيد الحياة.",
    descriptionFr: "Les gestes cruciaux pour réanimer une personne en arrêt cardiaque et respiratoire. Une intervention rapide double les chances de survie.",
    icon: "HeartPulse",
    emergencyInstructionsAr: "اتصل بالحماية المدنية فوراً (14) وابدأ بالضغطات الصدرية بمعدل 100-120 ضغطة في الدقيقة.",
    emergencyInstructionsFr: "Appelez immédiatement la Protection Civile (14) et commencez les compressions thoraciques à un rythme de 100-120 par minute.",
    stepsAr: [
      "تأكد من أمان المكان لك وللمصاب.",
      "افحص وعي المصاب بالتربيت على كتفيه وسؤاله بصوت عالٍ.",
      "افحص التنفس لمدة 10 ثوانٍ (انظر لحركة الصدر).",
      "إذا كان المصاب لا يتنفس، اطلب المساعدة فوراً واتصل بالرقم 14.",
      "ضع كعب يدك في منتصف صدر المصاب، واليد الأخرى فوقها واشبك الأصابع.",
      "ابدأ بالضغط بقوة وعمق (5-6 سم) وبمعدل سريع (100 إلى 120 ضغطة بالدقيقة).",
      "إذا كنت مدرباً، قم بتقديم نَفَسَي إنقاذ بعد كل 30 ضغطة صدرية."
    ],
    stepsFr: [
      "Assurez-vous que l'environnement est sécurisé pour vous et la victime.",
      "Vérifiez l'état de conscience en tapotant ses épaules et en lui parlant à voix haute.",
      "Vérifiez la respiration pendant 10 secondes (mouvement de la poitrine).",
      "Si la victime ne résout pas, demandez de l'aide et appelez immédiatement le 14.",
      "Placez le talon d'une main au centre de la poitrine de la victime, placez l'autre main dessus.",
      "Effectuez des compressions fermes et profondes (5-6 cm) à un rythme de 100 à 120 par minute.",
      "Si vous êtes formé, alternez 30 compressions thoraciques avec 2 insufflations."
    ]
  },
  {
    id: "fa-2",
    titleAr: "إسعاف الغصّة (الانسداد التنفسي)",
    titleFr: "Prise en charge de l'étouffement",
    descriptionAr: "كيف تتصرف عندما ينسد مجرى الهواء لدى شخص ما بسبب قطعة طعام أو جسم غريب.",
    descriptionFr: "Comment agir lorsqu'une personne s'étouffe en raison d'un corps étranger obstruant ses voies respiratoires.",
    icon: "ShieldAlert",
    emergencyInstructionsAr: "إذا كان المصاب غير قادر على الكلام أو السعال، ابدأ فوراً بضربات الظهر تليها دفعات البطن (مناورة هيمليش).",
    emergencyInstructionsFr: "Si la victime ne peut ni parler ni tousser, commencez immédiatement les claques dans le dos puis les compressions abdominales (Méthode de Heimlich).",
    stepsAr: [
      "شجع المصاب على السعال أولاً إذا كان قادراً على ذلك.",
      "إذا لم يستطع، قف خلفه وقم بإمالته للأمام قليلاً.",
      "اضرب بكعب يدك بقوة 5 ضربات متتالية بين لوحي كتفه.",
      "إذا لم يخرج الجسم الغريب، قف خلفه تماماً ولف ذراعيك حول خصره.",
      "ضع قبضة يدك فوق السرة مباشرة وتحت القفص الصدري.",
      "امسك قبضة يدك باليد الأخرى واضغط بقوة للداخل وللأعلى 5 دفعات متتالية.",
      "كرر العملية حتى يخرج الجسم الغريب أو يفقد المصاب الوعي (عندها ابدأ الإنعاش القلبي)."
    ],
    stepsFr: [
      "Encouragez d'abord la victime à tousser si elle le peut.",
      "Si elle ne peut pas, penchez la victime légèrement vers l'avant.",
      "Donnez 5 claques vigoureuses entre les omoplates avec le talon de votre main.",
      "Si l'objet ne sort pas, tenez-vous derrière elle et enroulez vos bras autour de sa taille.",
      "Placez votre poing fermé juste au-dessus du nombril et sous le sternum.",
      "Saisissez votre poing avec l'autre main et effectuez 5 tractions vigoureuses vers l'arrière et le haut.",
      "Répétez jusqu'à expulsion du corps étranger ou perte de connaissance (dans ce cas, passez au RCR)."
    ]
  },
  {
    id: "fa-3",
    titleAr: "التعامل مع النزيف الخارجي",
    titleFr: "Prise en charge d'une hémorragie",
    descriptionAr: "الخطوات السريعة للسيطرة على النزيف الحاد وإيقافه لمنع حدوث الصدمة الإسعافية.",
    descriptionFr: "Les étapes rapides pour stopper un saignement abondant et prévenir l'état de choc.",
    icon: "Droplet",
    emergencyInstructionsAr: "اضغط مباشرة على الجرح باستخدام ضمادة نظيفة وارفع الطرف المصاب أعلى من مستوى القلب.",
    emergencyInstructionsFr: "Appliquez une pression directe sur la plaie avec un tissu propre et surélevez le membre au-dessus du cœur.",
    stepsAr: [
      "ارتدِ قفازات واقية إن أمكن لتجنب ملامسة الدم مباشرة.",
      "ضع ضمادة معقمة أو قطعة قماش نظيفة مباشرة فوق الجرح.",
      "اضغط بقوة وبشكل مستمر بأصابعك أو بكف يدك حتى يتوقف النزيف.",
      "ارفع العضو المصاب (اليد أو الرجل) فوق مستوى القلب إن لم يكن هناك كسر.",
      "قم بلف رباط ضاغط فوق الضمادة بإحكام دون قطع الدورة الدموية تماماً.",
      "إذا تشربت الضمادة بالدم، لا تزلها، بل ضع ضمادة أخرى فوقها واستمر بالضغط.",
      "حافظ على دفء المصاب وهدوئه لحين وصول الحماية المدنية."
    ],
    stepsFr: [
      "Portez des gants de protection si possible pour éviter le contact avec le sang.",
      "Placez une compresse stérile ou un linge propre directement sur la plaie.",
      "Exercez une pression ferme et continue avec vos doigts ou la paume de la main jusqu'à l'arrêt du saignement.",
      "Surélevez le membre blessé au-dessus du niveau du cœur, sauf suspicion de fracture.",
      "Appliquez un bandage serré pour maintenir la compresse sans couper la circulation.",
      "Si le sang traverse le premier pansement, ne le retirez pas. Ajoutez une seconde compresse par-dessus.",
      "Couvrez la victime pour la garder au chaud en attendant les secours."
    ]
  }
];

const INITIAL_CAMPAIGNS: BloodCampaign[] = [
  {
    id: "camp-1",
    titleAr: "حملة التبرع بالدم الكبرى بساحة أول نوفمبر 1954",
    titleFr: "Grande campagne de don de sang à la Place du 1er Novembre 1954",
    locationAr: "ساحة أول نوفمبر، وسط مدينة سيدي بلعباس",
    locationFr: "Place du 1er Novembre, Centre-ville de Sidi Bel Abbès",
    date: "2026-08-15",
    time: "08:30 - 18:00",
    status: "upcoming",
    descriptionAr: "حملة واسعة النطاق بالتنسيق مع مستشفى سيدي بلعباس الجامعي والمؤسسات المحلية لتوفير مخزون آمن من فصائل الدم المختلفة ومواجهة النقص في فصل الصيف.",
    descriptionFr: "Une vaste campagne organisée en partenariat avec le CHU de Sidi Bel Abbès pour assurer un stock de sang sécurisé durant la période estivale."
  },
  {
    id: "camp-2",
    titleAr: "حملة التبرع بجامعة الجيلالي اليابس بالتنسيق مع كلية الطب",
    titleFr: "Don de sang à l'Université Djillali Liabes en collaboration avec la Faculté de Médecine",
    locationAr: "محيط الإقامة الجامعية للذكور - سيدي بلعباس",
    locationFr: "Enceinte de la résidence universitaire - Sidi Bel Abbès",
    date: "2026-05-18",
    time: "09:00 - 16:30",
    status: "completed",
    collectedUnits: 145,
    descriptionAr: "حملة تطوعية استهدفت الطلبة والأساتذة الجامعيين لدعم بنك الدم ونشر ثقافة التبرع الطوعي بالوسط الجامعي.",
    descriptionFr: "Campagne de don de sang réussie auprès des étudiants et du corps enseignant pour soutenir la banque de sang régionale."
  }
];

// In-Memory Real-time Safe Persistence DB Engine (resilient LocalStore + Firebase Sync + Seeding)
class LocalDbService {
  private seedingPromise: Promise<void> | null = null;

  // Seeding routine to guarantee default database structure exists in Firestore
  async ensureSeeded(): Promise<void> {
    if (!isFirebaseEnabled) return;
    if (this.seedingPromise) return this.seedingPromise;

    this.seedingPromise = (async () => {
      try {
        const seedDocRef = doc(db!, 'metadata', 'seeding');
        let snap;
        try {
          snap = await getDoc(seedDocRef);
        } catch (err) {
          console.warn('Could not check seeding metadata (likely guest user):', err);
          return; // Guest users shouldn't seed, return early and fallback to local or what is in DB
        }

        if (snap.exists() && snap.data()?.seeded) {
          console.log('Firestore already seeded.');
          return;
        }

        // Only authenticated admin should perform seeding writes
        const currentUserEmail = auth?.currentUser?.email;
        if (!currentUserEmail) {
          console.log('Database not seeded yet. Guest user falling back to local defaults.');
          return;
        }

        console.log('Seeding default bilingual data to Firestore...');

        // 1. Stats
        try {
          await setDoc(doc(db!, 'statistics', 'general'), DEFAULT_STATS);
        } catch (err) {
          console.warn('Stats seeding failed:', err);
        }

        // 2. Settings
        try {
          await setDoc(doc(db!, 'settings', 'general'), DEFAULT_SETTINGS);
        } catch (err) {
          console.warn('Settings seeding failed:', err);
        }

        // 3. News
        for (const item of INITIAL_NEWS) {
          try {
            await setDoc(doc(db!, 'news', item.id), item);
          } catch (err) {
            console.warn(`News ${item.id} seeding failed:`, err);
          }
        }

        // 4. Announcements
        for (const item of INITIAL_ANNOUNCEMENTS) {
          try {
            await setDoc(doc(db!, 'announcements', item.id), item);
          } catch (err) {
            console.warn(`Announcement ${item.id} seeding failed:`, err);
          }
        }

        // 5. Members
        for (const item of INITIAL_MEMBERS) {
          try {
            await setDoc(doc(db!, 'members', item.id), item);
          } catch (err) {
            console.warn(`Member ${item.id} seeding failed:`, err);
          }
        }

        // 6. First Aid
        for (const item of INITIAL_FIRST_AID) {
          try {
            await setDoc(doc(db!, 'first_aid', item.id), item);
          } catch (err) {
            console.warn(`First Aid ${item.id} seeding failed:`, err);
          }
        }

        // 7. Blood Campaigns
        for (const item of INITIAL_CAMPAIGNS) {
          try {
            await setDoc(doc(db!, 'blood_campaigns', item.id), item);
          } catch (err) {
            console.warn(`Blood Campaign ${item.id} seeding failed:`, err);
          }
        }

        // 8. Default Administrator
        const defaultAdmins: User[] = [
          {
            uid: "admin-sba",
            email: "cra.sba.alg@gmail.com",
            displayName: "رئيس اللجنة الولائية",
            role: "super_admin",
            createdAt: "2026-01-01",
            status: "active"
          }
        ];
        for (const admin of defaultAdmins) {
          try {
            await setDoc(doc(db!, 'admins', admin.uid), admin);
          } catch (err) {
            console.warn(`Admin ${admin.uid} seeding failed:`, err);
          }
        }

        // Mark as seeded
        try {
          await setDoc(seedDocRef, { seeded: true, createdAt: new Date().toISOString() });
          console.log('Firestore successfully seeded with default bilingual data.');
        } catch (err) {
          console.warn('Failed to write seeding metadata status:', err);
        }
      } catch (e) {
        console.warn('Firestore seeding failed:', e);
      }
    })();

    return this.seedingPromise;
  }

  private getStorageItem<T>(key: string, fallback: T): T {
    const data = localStorage.getItem(`cra_sba_${key}`);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    localStorage.setItem(`cra_sba_${key}`, JSON.stringify(value));
  }

  // --- Statistics ---
  async getStats(): Promise<InstitutionStats> {
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const docRef = doc(db!, 'statistics', 'general');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as InstitutionStats;
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, 'statistics/general');
      }
    }
    return this.getStorageItem<InstitutionStats>('statistics', DEFAULT_STATS);
  }

  async updateStats(stats: Partial<InstitutionStats>): Promise<InstitutionStats> {
    const current = await this.getStats();
    const updated = { ...current, ...stats };
    this.setStorageItem('statistics', updated);
    
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'statistics', 'general'), updated);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'statistics/general');
      }
    }
    return updated;
  }

  // --- Settings ---
  async getSettings(): Promise<Settings> {
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const docRef = doc(db!, 'settings', 'general');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as Settings;
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, 'settings/general');
      }
    }
    return this.getStorageItem<Settings>('settings', DEFAULT_SETTINGS);
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    this.setStorageItem('settings', updated);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'settings', 'general'), updated);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'settings/general');
      }
    }
    return updated;
  }

  // --- News Module ---
  async getNews(): Promise<NewsItem[]> {
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const q = query(collection(db!, 'news'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fbNews: NewsItem[] = [];
        querySnapshot.forEach((doc) => {
          fbNews.push({ id: doc.id, ...doc.data() } as NewsItem);
        });
        if (fbNews.length > 0) return fbNews;
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'news');
      }
    }
    return this.getStorageItem<NewsItem[]>('news', INITIAL_NEWS);
  }

  async saveNewsItem(item: Omit<NewsItem, 'id'> & { id?: string }): Promise<NewsItem> {
    const news = await this.getNews();
    let updatedItem: NewsItem;

    if (item.id) {
      // Edit
      updatedItem = { ...item, id: item.id } as NewsItem;
      const index = news.findIndex(n => n.id === item.id);
      if (index !== -1) news[index] = updatedItem;
    } else {
      // Create
      updatedItem = { ...item, id: `news-${Date.now()}` } as NewsItem;
      news.unshift(updatedItem);
    }

    this.setStorageItem('news', news);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const id = updatedItem.id;
        await setDoc(doc(db!, 'news', id), updatedItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `news/${updatedItem.id}`);
      }
    }
    return updatedItem;
  }

  async deleteNewsItem(id: string): Promise<void> {
    const news = await this.getNews();
    const updated = news.filter(n => n.id !== id);
    this.setStorageItem('news', updated);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await deleteDoc(doc(db!, 'news', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `news/${id}`);
      }
    }
  }

  async incrementNewsViews(id: string): Promise<void> {
    const news = await this.getNews();
    const item = news.find(n => n.id === id);
    if (item) {
      item.views += 1;
      this.setStorageItem('news', news);
      if (isFirebaseEnabled) {
        try {
          await this.ensureSeeded();
          await updateDoc(doc(db!, 'news', id), { views: item.views });
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `news/${id}`);
        }
      }
    }
  }

  // --- Announcements Module ---
  async getAnnouncements(): Promise<AnnouncementItem[]> {
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const q = query(collection(db!, 'announcements'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fbAnn: AnnouncementItem[] = [];
        querySnapshot.forEach((doc) => {
          fbAnn.push({ id: doc.id, ...doc.data() } as AnnouncementItem);
        });
        if (fbAnn.length > 0) return fbAnn;
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'announcements');
      }
    }
    return this.getStorageItem<AnnouncementItem[]>('announcements', INITIAL_ANNOUNCEMENTS);
  }

  async saveAnnouncement(item: Omit<AnnouncementItem, 'id'> & { id?: string }): Promise<AnnouncementItem> {
    const anns = await this.getAnnouncements();
    let updatedItem: AnnouncementItem;

    if (item.id) {
      updatedItem = { ...item, id: item.id } as AnnouncementItem;
      const index = anns.findIndex(a => a.id === item.id);
      if (index !== -1) anns[index] = updatedItem;
    } else {
      updatedItem = { ...item, id: `ann-${Date.now()}` } as AnnouncementItem;
      anns.unshift(updatedItem);
    }

    this.setStorageItem('announcements', anns);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'announcements', updatedItem.id), updatedItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `announcements/${updatedItem.id}`);
      }
    }
    return updatedItem;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const anns = await this.getAnnouncements();
    const updated = anns.filter(a => a.id !== id);
    this.setStorageItem('announcements', updated);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await deleteDoc(doc(db!, 'announcements', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `announcements/${id}`);
      }
    }
  }

  // --- Members Module ---
  async getMembers(): Promise<Member[]> {
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const q = query(collection(db!, 'members'), orderBy('displayOrder', 'asc'));
        const querySnapshot = await getDocs(q);
        const fbMembers: Member[] = [];
        querySnapshot.forEach((doc) => {
          fbMembers.push({ id: doc.id, ...doc.data() } as Member);
        });
        if (fbMembers.length > 0) return fbMembers;
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'members');
      }
    }
    return this.getStorageItem<Member[]>('members', INITIAL_MEMBERS);
  }

  async saveMember(item: Omit<Member, 'id'> & { id?: string }): Promise<Member> {
    const members = await this.getMembers();
    let updatedItem: Member;

    if (item.id) {
      updatedItem = { ...item, id: item.id } as Member;
      const index = members.findIndex(m => m.id === item.id);
      if (index !== -1) members[index] = updatedItem;
    } else {
      updatedItem = { ...item, id: `member-${Date.now()}`, displayOrder: members.length + 1 } as Member;
      members.push(updatedItem);
    }

    this.setStorageItem('members', members);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'members', updatedItem.id), updatedItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `members/${updatedItem.id}`);
      }
    }
    return updatedItem;
  }

  async deleteMember(id: string): Promise<void> {
    const members = await this.getMembers();
    const updated = members.filter(m => m.id !== id);
    this.setStorageItem('members', updated);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await deleteDoc(doc(db!, 'members', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `members/${id}`);
      }
    }
  }

  // --- First Aid Topics ---
  async getFirstAidTopics(): Promise<FirstAidTopic[]> {
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const querySnapshot = await getDocs(collection(db!, 'first_aid'));
        const fbFa: FirstAidTopic[] = [];
        querySnapshot.forEach((doc) => {
          fbFa.push({ id: doc.id, ...doc.data() } as FirstAidTopic);
        });
        if (fbFa.length > 0) return fbFa;
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'first_aid');
      }
    }
    return this.getStorageItem<FirstAidTopic[]>('first_aid', INITIAL_FIRST_AID);
  }

  async saveFirstAidTopic(item: Omit<FirstAidTopic, 'id'> & { id?: string }): Promise<FirstAidTopic> {
    const topics = await this.getFirstAidTopics();
    let updatedItem: FirstAidTopic;

    if (item.id) {
      updatedItem = { ...item, id: item.id } as FirstAidTopic;
      const index = topics.findIndex(t => t.id === item.id);
      if (index !== -1) topics[index] = updatedItem;
    } else {
      updatedItem = { ...item, id: `fa-${Date.now()}` } as FirstAidTopic;
      topics.push(updatedItem);
    }

    this.setStorageItem('first_aid', topics);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'first_aid', updatedItem.id), updatedItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `first_aid/${updatedItem.id}`);
      }
    }
    return updatedItem;
  }

  async deleteFirstAidTopic(id: string): Promise<void> {
    const topics = await this.getFirstAidTopics();
    const updated = topics.filter(t => t.id !== id);
    this.setStorageItem('first_aid', updated);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await deleteDoc(doc(db!, 'first_aid', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `first_aid/${id}`);
      }
    }
  }

  // --- Blood Campaigns ---
  async getBloodCampaigns(): Promise<BloodCampaign[]> {
    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        const q = query(collection(db!, 'blood_campaigns'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fbCamps: BloodCampaign[] = [];
        querySnapshot.forEach((doc) => {
          fbCamps.push({ id: doc.id, ...doc.data() } as BloodCampaign);
        });
        if (fbCamps.length > 0) return fbCamps;
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'blood_campaigns');
      }
    }
    return this.getStorageItem<BloodCampaign[]>('blood_campaigns', INITIAL_CAMPAIGNS);
  }

  async saveBloodCampaign(item: Omit<BloodCampaign, 'id'> & { id?: string }): Promise<BloodCampaign> {
    const camps = await this.getBloodCampaigns();
    let updatedItem: BloodCampaign;

    if (item.id) {
      updatedItem = { ...item, id: item.id } as BloodCampaign;
      const index = camps.findIndex(c => c.id === item.id);
      if (index !== -1) camps[index] = updatedItem;
    } else {
      updatedItem = { ...item, id: `camp-${Date.now()}` } as BloodCampaign;
      camps.unshift(updatedItem);
    }

    this.setStorageItem('blood_campaigns', camps);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'blood_campaigns', updatedItem.id), updatedItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `blood_campaigns/${updatedItem.id}`);
      }
    }
    return updatedItem;
  }

  async deleteBloodCampaign(id: string): Promise<void> {
    const camps = await this.getBloodCampaigns();
    const updated = camps.filter(c => c.id !== id);
    this.setStorageItem('blood_campaigns', updated);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await deleteDoc(doc(db!, 'blood_campaigns', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `blood_campaigns/${id}`);
      }
    }
  }

  // --- Volunteer Applications ---
  async getVolunteerApplications(): Promise<VolunteerApplication[]> {
    if (isFirebaseEnabled) {
      const isLocalAdmin = localStorage.getItem('cra_sba_admin_logged') === 'true';
      const currentUserEmail = auth?.currentUser?.email;
      if (isLocalAdmin || currentUserEmail) {
        try {
          await this.ensureSeeded();
          const querySnapshot = await getDocs(collection(db!, 'volunteers'));
          const fbVol: VolunteerApplication[] = [];
          querySnapshot.forEach((doc) => {
            fbVol.push({ id: doc.id, ...doc.data() } as VolunteerApplication);
          });
          if (fbVol.length > 0) return fbVol;
        } catch (e) {
          handleFirestoreError(e, OperationType.LIST, 'volunteers');
        }
      }
    }
    return this.getStorageItem<VolunteerApplication[]>('volunteers', []);
  }

  async saveVolunteerApplication(item: Omit<VolunteerApplication, 'id'>): Promise<VolunteerApplication> {
    const apps = await this.getVolunteerApplications();
    const newItem: VolunteerApplication = {
      ...item,
      id: `vol-${Date.now()}`
    };
    apps.unshift(newItem);
    this.setStorageItem('volunteers', apps);

    // Increment Stats on volunteer submission approval
    const currentStats = await this.getStats();
    await this.updateStats({ volunteersCount: currentStats.volunteersCount + 1 });

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'volunteers', newItem.id), newItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `volunteers/${newItem.id}`);
      }
    }
    return newItem;
  }

  async updateVolunteerStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> {
    const apps = await this.getVolunteerApplications();
    const appItem = apps.find(a => a.id === id);
    if (appItem) {
      appItem.status = status;
      this.setStorageItem('volunteers', apps);

      if (isFirebaseEnabled) {
        try {
          await this.ensureSeeded();
          await updateDoc(doc(db!, 'volunteers', id), { status });
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `volunteers/${id}`);
        }
      }
    }
  }

  // --- Contact Messages ---
  async getContactMessages(): Promise<ContactMessage[]> {
    if (isFirebaseEnabled) {
      const isLocalAdmin = localStorage.getItem('cra_sba_admin_logged') === 'true';
      const currentUserEmail = auth?.currentUser?.email;
      if (isLocalAdmin || currentUserEmail) {
        try {
          await this.ensureSeeded();
          const querySnapshot = await getDocs(collection(db!, 'contact_messages'));
          const fbMsg: ContactMessage[] = [];
          querySnapshot.forEach((doc) => {
            fbMsg.push({ id: doc.id, ...doc.data() } as ContactMessage);
          });
          if (fbMsg.length > 0) return fbMsg;
        } catch (e) {
          handleFirestoreError(e, OperationType.LIST, 'contact_messages');
        }
      }
    }
    return this.getStorageItem<ContactMessage[]>('contact_messages', []);
  }

  async saveContactMessage(item: Omit<ContactMessage, 'id' | 'date' | 'isRead'>): Promise<ContactMessage> {
    const msgs = await this.getContactMessages();
    const newItem: ContactMessage = {
      ...item,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };
    msgs.unshift(newItem);
    this.setStorageItem('contact_messages', msgs);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'contact_messages', newItem.id), newItem);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `contact_messages/${newItem.id}`);
      }
    }
    return newItem;
  }

  async markMessageAsRead(id: string): Promise<void> {
    const msgs = await this.getContactMessages();
    const item = msgs.find(m => m.id === id);
    if (item) {
      item.isRead = true;
      this.setStorageItem('contact_messages', msgs);

      if (isFirebaseEnabled) {
        try {
          await this.ensureSeeded();
          await updateDoc(doc(db!, 'contact_messages', id), { isRead: true });
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `contact_messages/${id}`);
        }
      }
    }
  }

  async deleteContactMessage(id: string): Promise<void> {
    const msgs = await this.getContactMessages();
    const updated = msgs.filter(m => m.id !== id);
    this.setStorageItem('contact_messages', updated);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await deleteDoc(doc(db!, 'contact_messages', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `contact_messages/${id}`);
      }
    }
  }

  // --- Users & Admin Auth System ---
  async getAdmins(): Promise<User[]> {
    const defaultAdmins: User[] = [
      {
        uid: "admin-sba",
        email: "cra.sba.alg@gmail.com",
        displayName: "رئيس اللجنة الولائية",
        role: "super_admin",
        createdAt: "2026-01-01",
        status: "active"
      }
    ];
    if (isFirebaseEnabled) {
      const isLocalAdmin = localStorage.getItem('cra_sba_admin_logged') === 'true';
      const currentUserEmail = auth?.currentUser?.email;
      if (isLocalAdmin || currentUserEmail) {
        try {
          await this.ensureSeeded();
          const querySnapshot = await getDocs(collection(db!, 'admins'));
          const fbAdmins: User[] = [];
          querySnapshot.forEach((doc) => {
            fbAdmins.push({ uid: doc.id, ...doc.data() } as User);
          });
          if (fbAdmins.length > 0) return fbAdmins;
        } catch (e) {
          handleFirestoreError(e, OperationType.LIST, 'admins');
        }
      }
    }
    return this.getStorageItem<User[]>('admins', defaultAdmins);
  }

  async addAdmin(user: Omit<User, 'uid' | 'createdAt'>): Promise<User> {
    const admins = await this.getAdmins();
    const uid = `admin-${Date.now()}`;
    const newUser: User = {
      ...user,
      uid,
      createdAt: new Date().toISOString().split('T')[0]
    };
    admins.push(newUser);
    this.setStorageItem('admins', admins);

    if (isFirebaseEnabled) {
      try {
        await this.ensureSeeded();
        await setDoc(doc(db!, 'admins', uid), newUser);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `admins/${uid}`);
      }
    }
    return newUser;
  }
}

export const localDb = new LocalDbService();
export default localDb;
