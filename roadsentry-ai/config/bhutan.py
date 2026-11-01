"""
RoadSentry AI - Bhutan Geospatial & Road Infrastructure Definitions
"""

# Default map center: Kingdom of Bhutan
BHUTAN_MAP_CENTER = [27.5142, 90.4336]
BHUTAN_DEFAULT_ZOOM = 8

# 20 Dzongkhags (Districts) of Bhutan with administrative centers and GPS coordinates
BHUTAN_DZONGKHAGS = {
    "Thimphu": {
        "center_lat": 27.4728,
        "center_lon": 89.6393,
        "region": "Western",
        "description": "Capital district with heavy urban and arterial traffic, Thimphu Expressway."
    },
    "Paro": {
        "center_lat": 27.4287,
        "center_lon": 89.4164,
        "region": "Western",
        "description": "Location of Bhutan International Airport, vital tourism and trade link."
    },
    "Punakha": {
        "center_lat": 27.5924,
        "center_lon": 89.8797,
        "region": "Central",
        "description": "Subtropical valley with arterial roads connecting to Wangdue and Trongsa."
    },
    "Wangdue Phodrang": {
        "center_lat": 27.4862,
        "center_lon": 89.8996,
        "region": "Central",
        "description": "Gateway to Central and Eastern Bhutan via Pelela Pass (3,420m)."
    },
    "Chukha": {
        "center_lat": 27.0673,
        "center_lon": 89.5847,
        "region": "South-Western",
        "description": "Critical economic lifeline corridor (Phuntsholing-Thimphu PNH-1), prone to monsoon landslides."
    },
    "Haa": {
        "center_lat": 27.3875,
        "center_lon": 89.2807,
        "region": "Western",
        "description": "High-altitude alpine valley connected via Chelela Pass (3,988m)."
    },
    "Samtse": {
        "center_lat": 26.8990,
        "center_lon": 89.0995,
        "region": "Southern",
        "description": "Southern border belt with mining traffic and cross-border transport routes."
    },
    "Gasa": {
        "center_lat": 27.9037,
        "center_lon": 89.7269,
        "region": "Northern",
        "description": "Remote northern district with rugged terrain and hot spring access roads."
    },
    "Trongsa": {
        "center_lat": 27.5026,
        "center_lon": 90.5072,
        "region": "Central",
        "description": "Historic central hub connecting East-West and North-South highways."
    },
    "Bumthang": {
        "center_lat": 27.5492,
        "center_lon": 90.7339,
        "region": "Central",
        "description": "Cultural heartland connected by high passes (Yotongla 3,425m, Rodungla)."
    },
    "Zhemgang": {
        "center_lat": 27.2171,
        "center_lon": 90.6558,
        "region": "South-Central",
        "description": "Forested hilly terrain connected to Gelephu and Trongsa corridors."
    },
    "Sarpang": {
        "center_lat": 26.8640,
        "center_lon": 90.4998,
        "region": "Southern",
        "description": "Home to Gelephu Special Administrative Region (SAR) and major southern border corridor."
    },
    "Tsirang": {
        "center_lat": 27.0219,
        "center_lon": 90.1229,
        "region": "South-Central",
        "description": "Agricultural center connecting Sarpang to Wangdue Phodrang."
    },
    "Dagana": {
        "center_lat": 27.0754,
        "center_lon": 89.8804,
        "region": "South-Western",
        "description": "Southern hillside district with newly established secondary highway links."
    },
    "Mongar": {
        "center_lat": 27.2747,
        "center_lon": 91.2396,
        "region": "Eastern",
        "description": "Major eastern commercial hub connecting to Lhuntse, Trashigang, and Nganglam."
    },
    "Lhuntse": {
        "center_lat": 27.6586,
        "center_lon": 91.1839,
        "region": "North-Eastern",
        "description": "Rugged northeastern valley with cliffside roads and river crossings."
    },
    "Trashigang": {
        "center_lat": 27.3331,
        "center_lon": 91.5542,
        "region": "Eastern",
        "description": "Easternmost terminus of the East-West Highway and Yonphula domestic airport."
    },
    "Trashi Yangtse": {
        "center_lat": 27.6116,
        "center_lon": 91.4980,
        "region": "Eastern",
        "description": "Northeastern border district renowned for Chorten Kora and handicrafts."
    },
    "Pemagatshel": {
        "center_lat": 26.9385,
        "center_lon": 91.4385,
        "region": "South-Eastern",
        "description": "Southern gypsum and mining freight corridor connecting to Nganglam."
    },
    "Samdrup Jongkhar": {
        "center_lat": 26.8007,
        "center_lon": 91.5052,
        "region": "South-Eastern",
        "description": "Major commercial trade gateway between eastern Bhutan and Assam, India."
    }
}

# Road Classifications as defined by the Ministry of Infrastructure and Transport (MoIT), Bhutan
BHUTAN_ROAD_CLASSES = {
    "PNH": {
        "code": "PNH",
        "name": "Primary National Highway",
        "speed_limit_kmh": 50,
        "weight_factor": 1.5,
        "description": "Strategic arterial links connecting Dzongkhag capitals and international borders (e.g. PNH-1 Phuntsholing-Thimphu, PNH-2 East-West Lateral)."
    },
    "SNH": {
        "code": "SNH",
        "name": "Secondary National Highway",
        "speed_limit_kmh": 40,
        "weight_factor": 1.25,
        "description": "Major connectors between primary corridors and regional economic hubs."
    },
    "DR": {
        "code": "DR",
        "name": "Dzongkhag Road",
        "speed_limit_kmh": 30,
        "weight_factor": 1.1,
        "description": "Distributor roads connecting Dzongkhag headquarters to Gewog centers."
    },
    "FR": {
        "code": "FR",
        "name": "Farm Road",
        "speed_limit_kmh": 20,
        "weight_factor": 0.9,
        "description": "Unpaved or chip-sealed rural access roads connecting farming communities to markets."
    },
    "UR": {
        "code": "UR",
        "name": "Urban Road",
        "speed_limit_kmh": 30,
        "weight_factor": 1.3,
        "description": "Municipal streets in Thimphu, Phuntsholing, Gelephu, Paro, and other thromdes."
    }
}

# Prominent Mountain Highway Corridors in Bhutan
BHUTAN_MAJOR_CORRIDORS = [
    "PNH-1: Phuntsholing – Gedu – Chuzom – Thimphu (Lifeline Highway)",
    "PNH-2: Semtokha – Dochula (3,100m) – Wangdue – Pelela (3,420m) – Trongsa (East-West Highway)",
    "PNH-2 Extension: Trongsa – Yotongla (3,425m) – Bumthang – Thrumshingla (3,780m) – Mongar – Trashigang",
    "Chuzom – Paro International Airport Highway",
    "Thimphu Expressway (Babesa – Dechencholing)",
    "Trongsa – Tingtibi – Gelephu National Highway",
    "Samdrup Jongkhar – Trashigang Highway"
]
