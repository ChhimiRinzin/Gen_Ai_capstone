import { AuditCriterion } from '../types';

export interface DzongkhagInfo {
  name: string;
  center_lat: number;
  center_lon: number;
  region: string;
  description: string;
}

export const BHUTAN_DZONGKHAGS: Record<string, DzongkhagInfo> = {
  Thimphu: {
    name: 'Thimphu',
    center_lat: 27.4728,
    center_lon: 89.6393,
    region: 'Western',
    description: 'Capital district with heavy urban and arterial traffic, Thimphu Expressway.'
  },
  Paro: {
    name: 'Paro',
    center_lat: 27.4287,
    center_lon: 89.4164,
    region: 'Western',
    description: 'Location of Bhutan International Airport, vital tourism and trade link.'
  },
  Punakha: {
    name: 'Punakha',
    center_lat: 27.5924,
    center_lon: 89.8797,
    region: 'Central',
    description: 'Subtropical valley with arterial roads connecting to Wangdue and Trongsa.'
  },
  'Wangdue Phodrang': {
    name: 'Wangdue Phodrang',
    center_lat: 27.4862,
    center_lon: 89.8996,
    region: 'Central',
    description: 'Gateway to Central and Eastern Bhutan via Pelela Pass (3,420m).'
  },
  Chukha: {
    name: 'Chukha',
    center_lat: 27.0673,
    center_lon: 89.5847,
    region: 'South-Western',
    description: 'Critical economic lifeline corridor (Phuntsholing-Thimphu PNH-1), prone to monsoon washouts.'
  },
  Haa: {
    name: 'Haa',
    center_lat: 27.3875,
    center_lon: 89.2807,
    region: 'Western',
    description: 'High-altitude alpine valley connected via Chelela Pass (3,988m).'
  },
  Samtse: {
    name: 'Samtse',
    center_lat: 26.899,
    center_lon: 89.0995,
    region: 'Southern',
    description: 'Southern border belt with mining traffic and cross-border transport routes.'
  },
  Gasa: {
    name: 'Gasa',
    center_lat: 27.9037,
    center_lon: 89.7269,
    region: 'Northern',
    description: 'Remote northern district with rugged terrain and hot spring access roads.'
  },
  Trongsa: {
    name: 'Trongsa',
    center_lat: 27.5026,
    center_lon: 90.5072,
    region: 'Central',
    description: 'Historic central hub connecting East-West and North-South highways.'
  },
  Bumthang: {
    name: 'Bumthang',
    center_lat: 27.5492,
    center_lon: 90.7339,
    region: 'Central',
    description: 'Cultural heartland connected by high passes (Yotongla 3,425m, Rodungla).'
  },
  Zhemgang: {
    name: 'Zhemgang',
    center_lat: 27.2171,
    center_lon: 90.6558,
    region: 'South-Central',
    description: 'Forested hilly terrain connected to Gelephu and Trongsa corridors.'
  },
  Sarpang: {
    name: 'Sarpang',
    center_lat: 26.864,
    center_lon: 90.4998,
    region: 'Southern',
    description: 'Home to Gelephu Special Administrative Region (SAR) and major southern border corridor.'
  },
  Tsirang: {
    name: 'Tsirang',
    center_lat: 27.0219,
    center_lon: 90.1229,
    region: 'South-Central',
    description: 'Agricultural center connecting Sarpang to Wangdue Phodrang.'
  },
  Dagana: {
    name: 'Dagana',
    center_lat: 27.0754,
    center_lon: 89.8804,
    region: 'South-Western',
    description: 'Southern hillside district with newly established secondary highway links.'
  },
  Mongar: {
    name: 'Mongar',
    center_lat: 27.2747,
    center_lon: 91.2396,
    region: 'Eastern',
    description: 'Major eastern commercial hub connecting to Lhuntse, Trashigang, and Nganglam.'
  },
  Lhuntse: {
    name: 'Lhuntse',
    center_lat: 27.6586,
    center_lon: 91.1839,
    region: 'North-Eastern',
    description: 'Rugged northeastern valley with cliffside roads and river crossings.'
  },
  Trashigang: {
    name: 'Trashigang',
    center_lat: 27.3331,
    center_lon: 91.5542,
    region: 'Eastern',
    description: 'Easternmost terminus of the East-West Highway and Yonphula domestic airport.'
  },
  'Trashi Yangtse': {
    name: 'Trashi Yangtse',
    center_lat: 27.6116,
    center_lon: 91.498,
    region: 'Eastern',
    description: 'Northeastern border district renowned for Chorten Kora and handicrafts.'
  },
  Pemagatshel: {
    name: 'Pemagatshel',
    center_lat: 26.9385,
    center_lon: 91.4385,
    region: 'South-Eastern',
    description: 'Southern gypsum and mining freight corridor connecting to Nganglam.'
  },
  'Samdrup Jongkhar': {
    name: 'Samdrup Jongkhar',
    center_lat: 26.8007,
    center_lon: 91.5052,
    region: 'South-Eastern',
    description: 'Major commercial trade gateway between eastern Bhutan and Assam, India.'
  }
};

export const BHUTAN_ROAD_CLASSES = {
  PNH: {
    code: 'PNH',
    name: 'Primary National Highway',
    speed_limit_kmh: 50,
    weight_factor: 1.5,
    description: 'Strategic arterial links connecting Dzongkhag capitals and international borders.'
  },
  SNH: {
    code: 'SNH',
    name: 'Secondary National Highway',
    speed_limit_kmh: 40,
    weight_factor: 1.25,
    description: 'Major connectors between primary corridors and regional economic hubs.'
  },
  DR: {
    code: 'DR',
    name: 'Dzongkhag Road',
    speed_limit_kmh: 30,
    weight_factor: 1.1,
    description: 'Distributor roads connecting Dzongkhag headquarters to Gewog administrative centers.'
  },
  FR: {
    code: 'FR',
    name: 'Farm Road',
    speed_limit_kmh: 20,
    weight_factor: 0.9,
    description: 'Rural access roads connecting agricultural communities to market hubs.'
  },
  UR: {
    code: 'UR',
    name: 'Urban Road',
    speed_limit_kmh: 30,
    weight_factor: 1.3,
    description: 'Municipal streets in Thimphu, Phuntsholing, Gelephu, Paro, and other thromdes.'
  }
};

export const DEFAULT_AUDIT_CRITERIA: AuditCriterion[] = [
  {
    id: 'CRIT-01',
    ref: 'DoST Standard Spec Clause 402.3',
    title: 'Pothole Remediation Tolerance',
    criterion: 'Potholes exceeding 25mm in depth or 150mm in diameter on Primary National Highways shall be marked within 24 hours and permanently repaired within 48 hours using approved hot/cold bituminous premix.',
    tolerance: 'Max depth: 25mm; Resolution time: 48 hours',
    sourceDoc: 'DoST Road Maintenance Manual (DoST-RMM-2023.pdf)'
  },
  {
    id: 'CRIT-02',
    ref: 'DoST Standard Spec Clause 308.1',
    title: 'Alligator Fatigue Cracking Control',
    criterion: 'Interconnected fatigue cracking (alligator patterns) exceeding 1.0 m² continuous area indicates pavement subbase degradation and shall require immediate structural core sampling and deep-patch restoration.',
    tolerance: 'Max continuous area: 1.0 m²',
    sourceDoc: 'DoST Road Maintenance Manual (DoST-RMM-2023.pdf)'
  },
  {
    id: 'CRIT-03',
    ref: 'IRC:SP:72 Guidelines Section 6.4',
    title: 'Monsoon Mountain Side Drain Clearance',
    criterion: 'Unlined and lined roadside side drains on mountain gradients shall remain free from rockfall scree, silt, and vegetative debris to prevent cross-highway surface sheet flooding.',
    tolerance: '100% freeflow clearance required before June monsoon onset',
    sourceDoc: 'Indian Roads Congress Mountain Guidelines (IRC-SP-72.pdf)'
  },
  {
    id: 'CRIT-04',
    ref: 'FIDIC Red Book Clause 11.1',
    title: 'Contractor Defect Liability Period',
    criterion: 'The contractor shall execute all work of amendment, reconstruction, and remedying defects within the Defect Notification Period at the contractor’s own expense where defect arises from workmanship or materials.',
    tolerance: 'Immediate rectification within 14 days of written notice',
    sourceDoc: 'FIDIC Conditions of Contract (FIDIC-RedBook-2017.pdf)'
  }
];

export interface BhutanTestScenario {
  id: string;
  title: string;
  filename: string;
  dzongkhag: string;
  road_class: string;
  locality: string;
  lat: number;
  lon: number;
  is_monsoon: boolean;
  drainage_blocked: boolean;
  description: string;
  ground_truth_detections: {
    class_code: 'D00' | 'D10' | 'D20' | 'D40';
    class_name: string;
    confidence: number;
    bbox: [number, number, number, number];
    area_pct: number;
  }[];
}

export const BHUTAN_TEST_SCENARIOS: BhutanTestScenario[] = [
  {
    id: 'SCENARIO-01',
    title: 'Chukha PNH-1 Lifeline Highway (Pothole & Alligator Distress)',
    filename: 'chukha_pnh1_chuzom_link.jpg',
    dzongkhag: 'Chukha',
    road_class: 'PNH',
    locality: 'Gedu – Chuzom Highway Section, KM 48.2',
    lat: 27.0673,
    lon: 89.5847,
    is_monsoon: true,
    drainage_blocked: true,
    description: 'High-traffic freight corridor between Phuntsholing border and Thimphu. Severe monsoon runoff with active pothole cavity and subbase fatigue.',
    ground_truth_detections: [
      {
        class_code: 'D40',
        class_name: 'Pothole',
        confidence: 0.89,
        bbox: [180, 220, 360, 380],
        area_pct: 6.8
      },
      {
        class_code: 'D20',
        class_name: 'Alligator Crack',
        confidence: 0.82,
        bbox: [390, 260, 570, 420],
        area_pct: 5.4
      }
    ]
  },
  {
    id: 'SCENARIO-02',
    title: 'Dochula Pass PNH-2 Lateral Highway (Transverse Thermal Fractures)',
    filename: 'dochula_pnh2_pass_3100m.jpg',
    dzongkhag: 'Punakha',
    road_class: 'PNH',
    locality: 'Dochula Mountain Pass, Elevation 3,100m',
    lat: 27.5015,
    lon: 89.7523,
    is_monsoon: false,
    drainage_blocked: false,
    description: 'Alpine high-elevation pass connecting Thimphu to Punakha valley. Subject to seasonal snow, freeze-thaw cycles, and thermal shrinkage cracking.',
    ground_truth_detections: [
      {
        class_code: 'D10',
        class_name: 'Transverse Crack',
        confidence: 0.86,
        bbox: [70, 280, 580, 340],
        area_pct: 3.2
      },
      {
        class_code: 'D00',
        class_name: 'Longitudinal Crack',
        confidence: 0.77,
        bbox: [220, 160, 280, 410],
        area_pct: 2.1
      }
    ]
  },
  {
    id: 'SCENARIO-03',
    title: 'Thimphu Expressway Babesa Arterial (Alligator Fatigue)',
    filename: 'thimphu_babesa_expressway.jpg',
    dzongkhag: 'Thimphu',
    road_class: 'UR',
    locality: 'Babesa Bridge Corridor, Thimphu Thromde',
    lat: 27.4382,
    lon: 89.6541,
    is_monsoon: false,
    drainage_blocked: true,
    description: 'High-density urban commuter arterial. Heavy bus and truck axle loads resulting in widespread polygonal fatigue cracking on outer wheelpath.',
    ground_truth_detections: [
      {
        class_code: 'D20',
        class_name: 'Alligator Crack',
        confidence: 0.88,
        bbox: [140, 200, 420, 390],
        area_pct: 7.2
      }
    ]
  },
  {
    id: 'SCENARIO-04',
    title: 'Pelela Pass Wangdue – Trongsa East-West Connector (Pothole Hazard)',
    filename: 'pelela_lateral_pnh2.jpg',
    dzongkhag: 'Trongsa',
    road_class: 'PNH',
    locality: 'Pelela Pass Descent, Elevation 3,420m',
    lat: 27.5026,
    lon: 90.5072,
    is_monsoon: true,
    drainage_blocked: false,
    description: 'Winding mountain descent connecting Western and Central Bhutan. Surface water ponding on tight curve with edge pothole crater.',
    ground_truth_detections: [
      {
        class_code: 'D40',
        class_name: 'Pothole',
        confidence: 0.92,
        bbox: [240, 250, 460, 420],
        area_pct: 8.5
      }
    ]
  }
];
