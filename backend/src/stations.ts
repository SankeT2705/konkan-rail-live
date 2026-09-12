/**
 * Complete static dataset for all 70 Konkan Railway stations
 * Route: Roha (Maharashtra) → Thokur/Surathkal (Karnataka)
 * Total distance: ~738 km along the Konkan coast
 *
 * Sources: KR official timetables, OpenStreetMap, Wikipedia
 * Coordinates are approximate (~500m accuracy) — sufficient for map display
 */

import { Station } from './types';

export const STATIONS: Station[] = [
  { index: 0,  code: 'ROHA',  name: 'Roha',                  nameHi: 'रोहा',                       km: 0,    lat: 18.4415, lng: 73.1187, type: 'major', state: 'Maharashtra' },
  { index: 1,  code: 'KLAD',  name: 'Kolad',                 nameHi: 'कोलाड',                      km: 26,   lat: 18.2578, lng: 73.1000, type: 'minor', state: 'Maharashtra' },
  { index: 2,  code: 'INDP',  name: 'Indapur',               nameHi: 'इंदापूर',                    km: 36,   lat: 18.1750, lng: 73.0820, type: 'minor', state: 'Maharashtra' },
  { index: 3,  code: 'MQC',   name: 'Mangaon',               nameHi: 'माणगाव',                     km: 45,   lat: 18.0921, lng: 73.0731, type: 'minor', state: 'Maharashtra' },
  { index: 4,  code: 'GRO',   name: 'Goregaon Road',         nameHi: 'गोरेगाव रोड',                km: 56,   lat: 17.9980, lng: 73.0500, type: 'minor', state: 'Maharashtra' },
  { index: 5,  code: 'VIR',   name: 'Veer',                  nameHi: 'वीर',                        km: 66,   lat: 17.9220, lng: 73.0278, type: 'minor', state: 'Maharashtra' },
  { index: 6,  code: 'SPWM',  name: 'Sape Wamane',           nameHi: 'सापे वामने',                 km: 75,   lat: 17.8500, lng: 73.0210, type: 'minor', state: 'Maharashtra' },
  { index: 7,  code: 'KRJD',  name: 'Karanjadi',             nameHi: 'करंजाडी',                    km: 83,   lat: 17.7780, lng: 73.0040, type: 'minor', state: 'Maharashtra' },
  { index: 8,  code: 'VINR',  name: 'Vinhere',               nameHi: 'विनहेरे',                    km: 89,   lat: 17.7200, lng: 73.0000, type: 'minor', state: 'Maharashtra' },
  { index: 9,  code: 'DWNK',  name: 'Diwankhavati',         nameHi: 'दिवाणखवटी',                  km: 96,   lat: 17.6500, lng: 72.9890, type: 'minor', state: 'Maharashtra' },
  { index: 10, code: 'KLMB',  name: 'Kalambani Budruk',     nameHi: 'कळंबणी बुद्रुक',              km: 103,  lat: 17.5900, lng: 72.9750, type: 'minor', state: 'Maharashtra' },
  { index: 11, code: 'KHED',  name: 'Khed',                  nameHi: 'खेड',                        km: 112,  lat: 17.7130, lng: 73.3995, type: 'major', state: 'Maharashtra' },
  { index: 12, code: 'ANJN',  name: 'Anjani',                nameHi: 'अंजनी',                      km: 123,  lat: 17.6200, lng: 73.3500, type: 'minor', state: 'Maharashtra' },
  { index: 13, code: 'CHI',   name: 'Chiplun',               nameHi: 'चिपळूण',                     km: 135,  lat: 17.5272, lng: 73.5110, type: 'major', state: 'Maharashtra' },
  { index: 14, code: 'KMTE',  name: 'Kamathe',               nameHi: 'कामठे',                      km: 146,  lat: 17.4500, lng: 73.5500, type: 'minor', state: 'Maharashtra' },
  { index: 15, code: 'SWRD',  name: 'Sawarda',               nameHi: 'सावर्डा',                    km: 155,  lat: 17.3810, lng: 73.5620, type: 'minor', state: 'Maharashtra' },
  { index: 16, code: 'AVRR',  name: 'Aravali Road',          nameHi: 'अरावली रोड',                 km: 164,  lat: 17.3100, lng: 73.5750, type: 'minor', state: 'Maharashtra' },
  { index: 17, code: 'KDWI',  name: 'Kadavai',               nameHi: 'कडवई',                       km: 172,  lat: 17.2450, lng: 73.5900, type: 'minor', state: 'Maharashtra' },
  { index: 18, code: 'SNMR',  name: 'Sangameshwar Road',     nameHi: 'संगमेश्वर रोड',              km: 181,  lat: 17.1800, lng: 73.5950, type: 'minor', state: 'Maharashtra' },
  { index: 19, code: 'UKS',   name: 'Ukshi',                 nameHi: 'उकशी',                       km: 192,  lat: 17.1050, lng: 73.5900, type: 'minor', state: 'Maharashtra' },
  { index: 20, code: 'BHOK',  name: 'Bhoke',                 nameHi: 'भोके',                       km: 201,  lat: 17.0300, lng: 73.5920, type: 'minor', state: 'Maharashtra' },
  { index: 21, code: 'RN',    name: 'Ratnagiri',             nameHi: 'रत्नागिरी',                  km: 211,  lat: 16.9944, lng: 73.3001, type: 'major', state: 'Maharashtra' },
  { index: 22, code: 'NVSR',  name: 'Nivasar',               nameHi: 'निवसर',                      km: 222,  lat: 16.9100, lng: 73.2900, type: 'minor', state: 'Maharashtra' },
  { index: 23, code: 'ADVL',  name: 'Adavali',               nameHi: 'आडवली',                      km: 230,  lat: 16.8400, lng: 73.2800, type: 'minor', state: 'Maharashtra' },
  { index: 24, code: 'VRWL',  name: 'Veravali',              nameHi: 'वेरावली',                    km: 239,  lat: 16.7700, lng: 73.2700, type: 'minor', state: 'Maharashtra' },
  { index: 25, code: 'VLVD',  name: 'Vilavade',              nameHi: 'विळवडे',                     km: 248,  lat: 16.7000, lng: 73.2500, type: 'minor', state: 'Maharashtra' },
  { index: 26, code: 'RJPR',  name: 'Rajapur Road',          nameHi: 'राजापूर रोड',                km: 258,  lat: 16.6510, lng: 73.5233, type: 'minor', state: 'Maharashtra' },
  { index: 27, code: 'KHPR',  name: 'Kharepatan Road',       nameHi: 'खारेपाटण रोड',               km: 268,  lat: 16.5800, lng: 73.5200, type: 'minor', state: 'Maharashtra' },
  { index: 28, code: 'VBWR',  name: 'Vaibhavwadi Road',      nameHi: 'वैभववाडी रोड',               km: 279,  lat: 16.5100, lng: 73.5000, type: 'minor', state: 'Maharashtra' },
  { index: 29, code: 'ACRN',  name: 'Achirne',               nameHi: 'अचिर्णे',                    km: 289,  lat: 16.4380, lng: 73.5200, type: 'minor', state: 'Maharashtra' },
  { index: 30, code: 'NNGR',  name: 'Nandgaon Road',         nameHi: 'नांदगाव रोड',                km: 298,  lat: 16.3700, lng: 73.5300, type: 'minor', state: 'Maharashtra' },
  { index: 31, code: 'KKNV',  name: 'Kankavli',              nameHi: 'कणकवली',                     km: 308,  lat: 16.2990, lng: 73.7090, type: 'major', state: 'Maharashtra' },
  { index: 32, code: 'SIND',  name: 'Sindhudurg',            nameHi: 'सिंधुदुर्ग',                 km: 320,  lat: 16.2200, lng: 73.7600, type: 'minor', state: 'Maharashtra' },
  { index: 33, code: 'KUDL',  name: 'Kudal',                 nameHi: 'कुडाळ',                      km: 330,  lat: 16.0141, lng: 73.6875, type: 'major', state: 'Maharashtra' },
  { index: 34, code: 'ZARP',  name: 'Zarap',                 nameHi: 'झाराप',                      km: 342,  lat: 15.9400, lng: 73.7100, type: 'minor', state: 'Maharashtra' },
  { index: 35, code: 'SAWI',  name: 'Sawantwadi Road',       nameHi: 'सावंतवाडी रोड',              km: 354,  lat: 15.9050, lng: 73.8330, type: 'major', state: 'Maharashtra' },
  { index: 36, code: 'MDRE',  name: 'Madure',                nameHi: 'मडुरे',                      km: 365,  lat: 15.8100, lng: 73.8800, type: 'minor', state: 'Goa'         },
  { index: 37, code: 'PRNM',  name: 'Pernem',                nameHi: 'पेडणे',                      km: 376,  lat: 15.7300, lng: 73.8500, type: 'minor', state: 'Goa'         },
  { index: 38, code: 'THVM',  name: 'Thivim',                nameHi: 'थिवीम',                      km: 395,  lat: 15.5980, lng: 73.9550, type: 'major', state: 'Goa'         },
  { index: 39, code: 'KRML',  name: 'Karmali',               nameHi: 'करमाळी',                     km: 408,  lat: 15.5060, lng: 73.9850, type: 'major', state: 'Goa'         },
  { index: 40, code: 'VRNA',  name: 'Verna',                 nameHi: 'वेर्णा',                     km: 420,  lat: 15.3730, lng: 73.9520, type: 'minor', state: 'Goa'         },
  { index: 41, code: 'MAJRD', name: 'Majorda Jn',            nameHi: 'मजोर्डा जंक्शन',             km: 428,  lat: 15.3110, lng: 73.9480, type: 'major', state: 'Goa'         },
  { index: 42, code: 'MAO',   name: 'Madgaon Jn',            nameHi: 'मडगाव जंक्शन',               km: 436,  lat: 15.2993, lng: 73.9570, type: 'major', state: 'Goa'         },
  { index: 43, code: 'BALLI', name: 'Balli',                 nameHi: 'बल्ली',                      km: 447,  lat: 15.1900, lng: 74.0100, type: 'minor', state: 'Goa'         },
  { index: 44, code: 'CCNA',  name: 'Canacona',              nameHi: 'कानाकोना',                   km: 460,  lat: 15.0100, lng: 74.0300, type: 'minor', state: 'Goa'         },
  { index: 45, code: 'LOLM',  name: 'Loliem',                nameHi: 'लोलिएम',                     km: 471,  lat: 14.9400, lng: 74.0100, type: 'minor', state: 'Goa'         },
  { index: 46, code: 'ASNT',  name: 'Asnoti',                nameHi: 'असनोटी',                     km: 480,  lat: 14.8700, lng: 74.0600, type: 'minor', state: 'Karnataka'   },
  { index: 47, code: 'KAWR',  name: 'Karwar',                nameHi: 'कारवार',                     km: 493,  lat: 14.8041, lng: 74.1235, type: 'major', state: 'Karnataka'   },
  { index: 48, code: 'HRWD',  name: 'Harwada',               nameHi: 'हरवाडा',                     km: 503,  lat: 14.7300, lng: 74.2100, type: 'minor', state: 'Karnataka'   },
  { index: 49, code: 'ANKL',  name: 'Ankola',                nameHi: 'अंकोला',                     km: 515,  lat: 14.6558, lng: 74.3001, type: 'minor', state: 'Karnataka'   },
  { index: 50, code: 'GOKR',  name: 'Gokarna Road',          nameHi: 'गोकर्ण रोड',                 km: 528,  lat: 14.5500, lng: 74.3300, type: 'minor', state: 'Karnataka'   },
  { index: 51, code: 'MIRJ',  name: 'Mirjan',                nameHi: 'मिर्जन',                     km: 539,  lat: 14.4800, lng: 74.3400, type: 'minor', state: 'Karnataka'   },
  { index: 52, code: 'KUMTA', name: 'Kumta',                 nameHi: 'कुमटा',                      km: 550,  lat: 14.4261, lng: 74.4133, type: 'minor', state: 'Karnataka'   },
  { index: 53, code: 'HONVR', name: 'Honnavar',              nameHi: 'होन्नावर',                   km: 564,  lat: 14.2788, lng: 74.4438, type: 'major', state: 'Karnataka'   },
  { index: 54, code: 'MNKI',  name: 'Manki',                 nameHi: 'मांकी',                      km: 576,  lat: 14.1900, lng: 74.4200, type: 'minor', state: 'Karnataka'   },
  { index: 55, code: 'MRSW',  name: 'Murdeshwar',            nameHi: 'मुरुडेश्वर',                 km: 590,  lat: 14.0936, lng: 74.4402, type: 'minor', state: 'Karnataka'   },
  { index: 56, code: 'CTPR',  name: 'Chitrapur',             nameHi: 'चित्रापुर',                  km: 602,  lat: 13.9800, lng: 74.5100, type: 'minor', state: 'Karnataka'   },
  { index: 57, code: 'BTKL',  name: 'Bhatkal',               nameHi: 'भटकल',                       km: 614,  lat: 13.9763, lng: 74.5540, type: 'major', state: 'Karnataka'   },
  { index: 58, code: 'SRUR',  name: 'Shiroor',               nameHi: 'शिरुर',                      km: 625,  lat: 13.8900, lng: 74.6100, type: 'minor', state: 'Karnataka'   },
  { index: 59, code: 'MKBH',  name: 'Mookambika Road (Byndoor)', nameHi: 'मूकाम्बिका रोड (बैन्दूर)', km: 636, lat: 13.8100, lng: 74.6500, type: 'minor', state: 'Karnataka' },
  { index: 60, code: 'BJUR',  name: 'Bijoor',                nameHi: 'बिजुर',                      km: 644,  lat: 13.7400, lng: 74.6700, type: 'minor', state: 'Karnataka'   },
  { index: 61, code: 'SNPR',  name: 'Senapura',              nameHi: 'सेनापुरा',                   km: 651,  lat: 13.6800, lng: 74.7100, type: 'minor', state: 'Karnataka'   },
  { index: 62, code: 'KUDA',  name: 'Kundapura',             nameHi: 'कुन्दापुर',                  km: 662,  lat: 13.6201, lng: 74.6908, type: 'major', state: 'Karnataka'   },
  { index: 63, code: 'BKUR',  name: 'Barkur',                nameHi: 'बरकुर',                      km: 674,  lat: 13.5400, lng: 74.7100, type: 'minor', state: 'Karnataka'   },
  { index: 64, code: 'UD',    name: 'Udupi',                 nameHi: 'उडुपी',                      km: 686,  lat: 13.3409, lng: 74.7421, type: 'major', state: 'Karnataka'   },
  { index: 65, code: 'INNJ',  name: 'Innanje',               nameHi: 'इन्नान्जे',                  km: 695,  lat: 13.2700, lng: 74.7300, type: 'minor', state: 'Karnataka'   },
  { index: 66, code: 'PBDL',  name: 'Padubidri',             nameHi: 'पाडुबिद्री',                 km: 703,  lat: 13.2000, lng: 74.7600, type: 'minor', state: 'Karnataka'   },
  { index: 67, code: 'NDKR',  name: 'Nandikoor',             nameHi: 'नंदिकुर',                    km: 711,  lat: 13.1300, lng: 74.8100, type: 'minor', state: 'Karnataka'   },
  { index: 68, code: 'MULK',  name: 'Mulki',                 nameHi: 'मुल्की',                     km: 719,  lat: 13.0700, lng: 74.7900, type: 'minor', state: 'Karnataka'   },
  { index: 69, code: 'SRTK',  name: 'Surathkal',             nameHi: 'सुरतकल',                     km: 738,  lat: 12.9960, lng: 74.7970, type: 'major', state: 'Karnataka'   },
];

// Lookup helpers
export const STATION_BY_CODE = new Map(STATIONS.map(s => [s.code.toUpperCase(), s]));
export const STATION_BY_NAME = new Map(STATIONS.map(s => [s.name.toLowerCase(), s]));
export const STATION_BY_INDEX = new Map(STATIONS.map(s => [s.index, s]));

/** Find a station by partial name match (for scraper lookups) */
export function findStationByName(rawName: string): Station | undefined {
  const normalized = rawName.trim().toLowerCase().replace(/\s+/g, ' ');
  // Exact match first
  if (STATION_BY_NAME.has(normalized)) return STATION_BY_NAME.get(normalized);
  // Partial match
  return STATIONS.find(s =>
    s.name.toLowerCase().includes(normalized) ||
    normalized.includes(s.name.toLowerCase())
  );
}

export const ROUTE_TOTAL_KM = 738;
