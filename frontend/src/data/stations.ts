// Mirrored station list for frontend (offline/fast access without API round-trip)
// Matches backend/src/stations.ts exactly

export interface Station {
  code: string;
  name: string;
  nameHi: string;
  km: number;
  lat: number;
  lng: number;
  type: 'major' | 'minor';
  state: 'Maharashtra' | 'Goa' | 'Karnataka';
  index: number;
}

export const STATIONS: Station[] = [
  { index: 0,  code: 'ROHA',  name: 'Roha',                      nameHi: 'रोहा',              km: 0,    lat: 18.4465, lng: 73.1236, type: 'major', state: 'Maharashtra' },
  { index: 1,  code: 'KLAD',  name: 'Kolad',                     nameHi: 'कोलाड',             km: 26,   lat: 18.392, lng: 73.2234, type: 'minor', state: 'Maharashtra' },
  { index: 2,  code: 'INDP',  name: 'Indapur',                   nameHi: 'इंदापूर',           km: 36,   lat: 18.299, lng: 73.2447, type: 'minor', state: 'Maharashtra' },
  { index: 3,  code: 'MQC',   name: 'Mangaon',                   nameHi: 'माणगाव',            km: 45,   lat: 18.2474, lng: 73.2754, type: 'minor', state: 'Maharashtra' },
  { index: 4,  code: 'GRO',   name: 'Goregaon Road',             nameHi: 'गोरेगाव रोड',       km: 56,   lat: 18.163, lng: 73.3028, type: 'minor', state: 'Maharashtra' },
  { index: 5,  code: 'VIR',   name: 'Veer',                      nameHi: 'वीर',               km: 66,   lat: 18.1137, lng: 73.3306, type: 'minor', state: 'Maharashtra' },
  { index: 6,  code: 'SPWM',  name: 'Sape Wamane',               nameHi: 'सापे वामने',        km: 75,   lat: 18.0561, lng: 73.3676, type: 'minor', state: 'Maharashtra' },
  { index: 7,  code: 'KRJD',  name: 'Karanjadi',                 nameHi: 'करंजाडी',           km: 83,   lat: 17.998541, lng: 73.404484, type: 'minor', state: 'Maharashtra' },
  { index: 8,  code: 'VINR',  name: 'Vinhere',                   nameHi: 'विनहेरे',           km: 89,   lat: 17.9148, lng: 73.3836, type: 'minor', state: 'Maharashtra' },
  { index: 9,  code: 'DWNK',  name: 'Diwankhavati',             nameHi: 'दिवाणखवटी',         km: 96,   lat: 17.8552, lng: 73.4182, type: 'minor', state: 'Maharashtra' },
  { index: 10, code: 'KLMB',  name: 'Kalambani Budruk',         nameHi: 'कळंबणी बुद्रुक',    km: 103,  lat: 17.7661, lng: 73.4207, type: 'minor', state: 'Maharashtra' },
  { index: 11, code: 'KHED',  name: 'Khed',                      nameHi: 'खेड',               km: 112,  lat: 17.7121, lng: 73.4088, type: 'major', state: 'Maharashtra' },
  { index: 12, code: 'ANJN',  name: 'Anjani',                    nameHi: 'अंजनी',             km: 123,  lat: 17.621, lng: 73.3998, type: 'minor', state: 'Maharashtra' },
  { index: 13, code: 'CHI',   name: 'Chiplun',                   nameHi: 'चिपळूण',            km: 135,  lat: 17.5425, lng: 73.5224, type: 'major', state: 'Maharashtra' },
  { index: 14, code: 'KMTE',  name: 'Kamathe',                   nameHi: 'कामठे',             km: 146,  lat: 17.4779, lng: 73.516, type: 'minor', state: 'Maharashtra' },
  { index: 15, code: 'SWRD',  name: 'Sawarda',                   nameHi: 'सावर्डा',           km: 155,  lat: 17.4047, lng: 73.5152, type: 'minor', state: 'Maharashtra' },
  { index: 16, code: 'AVRR',  name: 'Aravali Road',              nameHi: 'अरावली रोड',        km: 164,  lat: 17.3167, lng: 73.5381, type: 'minor', state: 'Maharashtra' },
  { index: 17, code: 'KDWI',  name: 'Kadavai',                   nameHi: 'कडवई',              km: 172,  lat: 17.2653, lng: 73.5522, type: 'minor', state: 'Maharashtra' },
  { index: 18, code: 'SNMR',  name: 'Sangameshwar Road',         nameHi: 'संगमेश्वर रोड',     km: 181,  lat: 17.195, lng: 73.524, type: 'minor', state: 'Maharashtra' },
  { index: 19, code: 'UKS',   name: 'Ukshi',                     nameHi: 'उकशी',              km: 192,  lat: 17.1302, lng: 73.4569, type: 'minor', state: 'Maharashtra' },
  { index: 20, code: 'BHOK',  name: 'Bhoke',                     nameHi: 'भोके',              km: 201,  lat: 17.0489, lng: 73.3811, type: 'minor', state: 'Maharashtra' },
  { index: 21, code: 'RN',    name: 'Ratnagiri',                 nameHi: 'रत्नागिरी',         km: 211,  lat: 17.0029, lng: 73.3583, type: 'major', state: 'Maharashtra' },
  { index: 22, code: 'NVSR',  name: 'Nivasar',                   nameHi: 'निवसर',             km: 222,  lat: 16.9472, lng: 73.4548, type: 'minor', state: 'Maharashtra' },
  { index: 23, code: 'ADVL',  name: 'Adavali',                   nameHi: 'आडवली',             km: 230,  lat: 16.9216, lng: 73.5929, type: 'minor', state: 'Maharashtra' },
  { index: 24, code: 'VRWL',  name: 'Veravali',                  nameHi: 'वेरावली',           km: 239,  lat: 16.866, lng: 73.537, type: 'minor', state: 'Maharashtra' },
  { index: 25, code: 'VLVD',  name: 'Vilavade',                  nameHi: 'विळवडे',            km: 248,  lat: 16.7857, lng: 73.6192, type: 'minor', state: 'Maharashtra' },
  { index: 26, code: 'RJPR',  name: 'Rajapur Road',              nameHi: 'राजापूर रोड',       km: 258,  lat: 16.6356, lng: 73.6268, type: 'minor', state: 'Maharashtra' },
  { index: 27, code: 'KHPR',  name: 'Kharepatan Road',           nameHi: 'खारेपाटण रोड',      km: 268,  lat: 16.569, lng: 73.6608, type: 'minor', state: 'Maharashtra' },
  { index: 28, code: 'VBWR',  name: 'Vaibhavwadi Road',          nameHi: 'वैभववाडी रोड',      km: 279,  lat: 16.5122, lng: 73.708, type: 'minor', state: 'Maharashtra' },
  { index: 29, code: 'ACRN',  name: 'Achirne',                   nameHi: 'अचिर्णे',           km: 289,  lat: 16.4467, lng: 73.7439, type: 'minor', state: 'Maharashtra' },
  { index: 30, code: 'NNGR',  name: 'Nandgaon Road',             nameHi: 'नांदगाव रोड',       km: 298,  lat: 16.3876, lng: 73.7309, type: 'minor', state: 'Maharashtra' },
  { index: 31, code: 'KKNV',  name: 'Kankavli',                  nameHi: 'कणकवली',            km: 308,  lat: 16.2736, lng: 73.7153, type: 'major', state: 'Maharashtra' },
  { index: 32, code: 'SIND',  name: 'Sindhudurg',                nameHi: 'सिंधुदुर्ग',        km: 320,  lat: 16.1122, lng: 73.6799, type: 'minor', state: 'Maharashtra' },
  { index: 33, code: 'KUDL',  name: 'Kudal',                     nameHi: 'कुडाळ',             km: 330,  lat: 16.0168, lng: 73.6779, type: 'major', state: 'Maharashtra' },
  { index: 34, code: 'ZARP',  name: 'Zarap',                     nameHi: 'झाराप',             km: 342,  lat: 15.9482, lng: 73.7341, type: 'minor', state: 'Maharashtra' },
  { index: 35, code: 'SAWI',  name: 'Sawantwadi Road',           nameHi: 'सावंतवाडी रोड',     km: 354,  lat: 15.8666, lng: 73.7852, type: 'major', state: 'Maharashtra' },
  { index: 36, code: 'MDRE',  name: 'Madure',                    nameHi: 'मडुरे',             km: 365,  lat: 15.7875, lng: 73.801, type: 'minor', state: 'Goa'         },
  { index: 37, code: 'PRNM',  name: 'Pernem',                    nameHi: 'पेडणे',             km: 376,  lat: 15.7084, lng: 73.8173, type: 'minor', state: 'Goa'         },
  { index: 38, code: 'THVM',  name: 'Thivim',                    nameHi: 'थिवीम',             km: 395,  lat: 15.6295, lng: 73.877, type: 'major', state: 'Goa'         },
  { index: 39, code: 'KRML',  name: 'Karmali',                   nameHi: 'करमाळी',            km: 408,  lat: 15.4907, lng: 73.9245, type: 'major', state: 'Goa'         },
  { index: 40, code: 'VRNA',  name: 'Verna',                     nameHi: 'वेर्णा',            km: 420,  lat: 15.3539, lng: 73.9124, type: 'minor', state: 'Goa'         },
  { index: 41, code: 'MAJRD', name: 'Majorda Jn',                nameHi: 'मजोर्डा जंक्शन',   km: 428,  lat: 15.3137, lng: 73.922, type: 'major', state: 'Goa'         },
  { index: 42, code: 'MAO',   name: 'Madgaon Jn',                nameHi: 'मडगाव जंक्शन',     km: 436,  lat: 15.2673, lng: 73.9703, type: 'major', state: 'Goa'         },
  { index: 43, code: 'BALLI', name: 'Balli',                     nameHi: 'बल्ली',             km: 447,  lat: 15.1517, lng: 74.0212, type: 'minor', state: 'Goa'         },
  { index: 44, code: 'CCNA',  name: 'Canacona',                  nameHi: 'कानाकोना',          km: 460,  lat: 15.0069, lng: 74.0394, type: 'minor', state: 'Goa'         },
  { index: 45, code: 'LOLM',  name: 'Loliem',                    nameHi: 'लोलिएम',            km: 471,  lat: 14.9393, lng: 74.0883, type: 'minor', state: 'Goa'         },
  { index: 46, code: 'ASNT',  name: 'Asnoti',                    nameHi: 'असनोटी',            km: 480,  lat: 14.8763, lng: 74.1476, type: 'minor', state: 'Karnataka'   },
  { index: 47, code: 'KAWR',  name: 'Karwar',                    nameHi: 'कारवार',            km: 493,  lat: 14.8202, lng: 74.1826, type: 'major', state: 'Karnataka'   },
  { index: 48, code: 'HRWD',  name: 'Harwada',                   nameHi: 'हरवाडा',            km: 503,  lat: 14.7404, lng: 74.2594, type: 'minor', state: 'Karnataka'   },
  { index: 49, code: 'ANKL',  name: 'Ankola',                    nameHi: 'अंकोला',            km: 515,  lat: 14.6454, lng: 74.332, type: 'minor', state: 'Karnataka'   },
  { index: 50, code: 'GOKR',  name: 'Gokarna Road',              nameHi: 'गोकर्ण रोड',        km: 528,  lat: 14.5838, lng: 74.3677, type: 'minor', state: 'Karnataka'   },
  { index: 51, code: 'MIRJ',  name: 'Mirjan',                    nameHi: 'मिर्जन',            km: 539,  lat: 14.5004, lng: 74.4248, type: 'minor', state: 'Karnataka'   },
  { index: 52, code: 'KUMTA', name: 'Kumta',                     nameHi: 'कुमटा',             km: 550,  lat: 14.4372, lng: 74.4211, type: 'minor', state: 'Karnataka'   },
  { index: 53, code: 'HONVR', name: 'Honnavar',                  nameHi: 'होन्नावर',          km: 564,  lat: 14.3159, lng: 74.4324, type: 'major', state: 'Karnataka'   },
  { index: 54, code: 'MNKI',  name: 'Manki',                     nameHi: 'मांकी',             km: 576,  lat: 14.1746, lng: 74.4937, type: 'minor', state: 'Karnataka'   },
  { index: 55, code: 'MRSW',  name: 'Murdeshwar',                nameHi: 'मुरुडेश्वर',        km: 590,  lat: 14.1008, lng: 74.5054, type: 'minor', state: 'Karnataka'   },
  { index: 56, code: 'CTPR',  name: 'Chitrapur',                 nameHi: 'चित्रापुर',         km: 602,  lat: 14.045, lng: 74.535, type: 'minor', state: 'Karnataka'   },
  { index: 57, code: 'BTKL',  name: 'Bhatkal',                   nameHi: 'भटकल',              km: 614,  lat: 13.9894, lng: 74.5656, type: 'major', state: 'Karnataka'   },
  { index: 58, code: 'SRUR',  name: 'Shiroor',                   nameHi: 'शिरुर',             km: 625,  lat: 13.931, lng: 74.5942, type: 'minor', state: 'Karnataka'   },
  { index: 59, code: 'MKBH',  name: 'Mookambika Road (Byndoor)', nameHi: 'मूकाम्बिका रोड',   km: 636,  lat: 13.8765, lng: 74.6184, type: 'minor', state: 'Karnataka'   },
  { index: 60, code: 'BJUR',  name: 'Bijoor',                    nameHi: 'बिजुर',             km: 644,  lat: 13.822, lng: 74.6426, type: 'minor', state: 'Karnataka'   },
  { index: 61, code: 'SNPR',  name: 'Senapura',                  nameHi: 'सेनापुरा',          km: 651,  lat: 13.7179, lng: 74.6845, type: 'minor', state: 'Karnataka'   },
  { index: 62, code: 'KUDA',  name: 'Kundapura',                 nameHi: 'कुन्दापुर',         km: 662,  lat: 13.6133, lng: 74.7287, type: 'major', state: 'Karnataka'   },
  { index: 63, code: 'BKUR',  name: 'Barkur',                    nameHi: 'बरकुर',             km: 674,  lat: 13.4771, lng: 74.7599, type: 'minor', state: 'Karnataka'   },
  { index: 64, code: 'UD',    name: 'Udupi',                     nameHi: 'उडुपी',             km: 686,  lat: 13.3361, lng: 74.7708, type: 'major', state: 'Karnataka'   },
  { index: 65, code: 'INNJ',  name: 'Innanje',                   nameHi: 'इन्नान्जे',         km: 695,  lat: 13.2561, lng: 74.7618, type: 'minor', state: 'Karnataka'   },
  { index: 66, code: 'PBDL',  name: 'Padubidri',                 nameHi: 'पाडुबिद्री',        km: 703,  lat: 13.1969, lng: 74.768, type: 'minor', state: 'Karnataka'   },
  { index: 67, code: 'NDKR',  name: 'Nandikoor',                 nameHi: 'नंदिकुर',           km: 711,  lat: 13.1327, lng: 74.8061, type: 'minor', state: 'Karnataka'   },
  { index: 68, code: 'MULK',  name: 'Mulki',                     nameHi: 'मुल्की',            km: 719,  lat: 13.0689, lng: 74.8053, type: 'minor', state: 'Karnataka'   },
  { index: 69, code: 'SRTK',  name: 'Surathkal',                 nameHi: 'सुरतकल',            km: 738,  lat: 12.9902, lng: 74.8054, type: 'major', state: 'Karnataka'   },
];

export const STATION_BY_CODE = new Map(STATIONS.map(s => [s.code, s]));
export const ROUTE_TOTAL_KM = 738;
