import type { TrainPosition } from '../types';
import { STATIONS, type Station } from '../data/stations';
import { getOfficialTrainSchedule } from '../data/trainSchedules';

export interface TrainEndpoints {
  sourceCode: string;
  sourceName: string;
  destCode: string;
  destName: string;
  routeSummary: string;
  totalDistanceKm: number;
}

export interface RouteProgress {
  sourceCode: string;
  sourceName: string;
  destCode: string;
  destName: string;
  currentStationName: string;
  totalRouteKm: number;
  coveredKm: number;
  remainingKm: number;
  progressPercent: number;
  routeSummary: string;
  direction: 'up' | 'down';
  krSectorKm: number;
}

export const STATION_NAMES: Record<string, { name: string; nameHi: string; kmOffset: number }> = {
  // Northern Terminals (North of Roha = negative relative to Roha km 0)
  CDG:  { name: 'Chandigarh', nameHi: 'चंदिगढ', kmOffset: -1750 },
  ASR:  { name: 'Amritsar', nameHi: 'अमृतसर', kmOffset: -1800 },
  HSR:  { name: 'Hisar (Haryana)', nameHi: 'हिसार', kmOffset: -1650 },
  NZM:  { name: 'Delhi Nizamuddin', nameHi: 'हजरत निजामुद्दीन', kmOffset: -1500 },
  NDLS: { name: 'New Delhi', nameHi: 'नवी दिल्ली', kmOffset: -1500 },
  JAM:  { name: 'Jamnagar (Gujarat)', nameHi: 'जामनगर', kmOffset: -900 },
  ADI:  { name: 'Ahmedabad Jn', nameHi: 'अहमदाबाद', kmOffset: -630 },
  BRC:  { name: 'Vadodara Jn', nameHi: 'वडोदरा', kmOffset: -530 },
  ST:   { name: 'Surat', nameHi: 'सूरत', kmOffset: -400 },
  BSR:  { name: 'Vasai Road', nameHi: 'वसई रोड', kmOffset: -180 },
  CSMT: { name: 'Mumbai CSMT', nameHi: 'मुंबई सीएसएमटी', kmOffset: -140 },
  DR:   { name: 'Dadar (Mumbai)', nameHi: 'दादर', kmOffset: -135 },
  LTT:  { name: 'Mumbai LTT', nameHi: 'लोकमान्य टिळक टर्मिनस', kmOffset: -130 },
  MMCT: { name: 'Mumbai Central', nameHi: 'मुंबई सेंट्रल', kmOffset: -140 },
  BDTS: { name: 'Bandra Terminus', nameHi: 'बांद्रा टर्मिनस', kmOffset: -135 },
  PUNE: { name: 'Pune Jn', nameHi: 'पुणे', kmOffset: -150 },
  PNVL: { name: 'Panvel', nameHi: 'पनवेल', kmOffset: -70 },

  // Konkan Railway Route Stations (km 0 to 738)
  ROHA: { name: 'Roha', nameHi: 'रोहा', kmOffset: 0 },
  KLAD: { name: 'Kolad', nameHi: 'कोलाड', kmOffset: 26 },
  INDP: { name: 'Indapur', nameHi: 'इंदापूर', kmOffset: 36 },
  MQC:  { name: 'Mangaon', nameHi: 'माणगाव', kmOffset: 45 },
  VIR:  { name: 'Veer', nameHi: 'वीर', kmOffset: 66 },
  KHED: { name: 'Khed', nameHi: 'खेड', kmOffset: 112 },
  CHI:  { name: 'Chiplun', nameHi: 'चिपळूण', kmOffset: 135 },
  SWRD: { name: 'Sawarda', nameHi: 'सावर्डा', kmOffset: 155 },
  RN:   { name: 'Ratnagiri', nameHi: 'रत्नागिरी', kmOffset: 211 },
  ADVL: { name: 'Adavali', nameHi: 'आडवली', kmOffset: 230 },
  RAJP: { name: 'Rajapur Road', nameHi: 'राजापूर रोड', kmOffset: 258 },
  VBW:  { name: 'Vaibhavwadi Road', nameHi: 'वैभववाडी रोड', kmOffset: 279 },
  VBWR: { name: 'Vaibhavwadi Road', nameHi: 'वैभववाडी रोड', kmOffset: 279 },
  KKNV: { name: 'Kankavli', nameHi: 'कणकवली', kmOffset: 308 },
  SIND: { name: 'Sindhudurg', nameHi: 'सिंधुदुर्ग', kmOffset: 320 },
  KUDL: { name: 'Kudal', nameHi: 'कुडाळ', kmOffset: 330 },
  SWV:  { name: 'Sawantwadi Road', nameHi: 'सावंतवाडी रोड', kmOffset: 354 },
  SAWI: { name: 'Sawantwadi Road', nameHi: 'सावंतवाडी रोड', kmOffset: 354 },
  PERN: { name: 'Pernem', nameHi: 'पेडणे', kmOffset: 376 },
  THVM: { name: 'Thivim (Goa)', nameHi: 'थिवीम', kmOffset: 395 },
  KRML: { name: 'Karmali (Goa)', nameHi: 'करमाळी', kmOffset: 408 },
  MAO:  { name: 'Madgaon Jn (Goa)', nameHi: 'मडगाव जंक्शन', kmOffset: 436 },
  VS:   { name: 'Vasco-da-Gama', nameHi: 'वास्को-द-गामा', kmOffset: 460 },
  KAWR: { name: 'Karwar', nameHi: 'कारवार', kmOffset: 493 },
  GOKR: { name: 'Gokarna Road', nameHi: 'गोकर्ण रोड', kmOffset: 525 },
  KT:   { name: 'Kumta', nameHi: 'कुमटा', kmOffset: 550 },
  MRDW: { name: 'Murdeshwar', nameHi: 'मुरुडेश्वर', kmOffset: 585 },
  BTKL: { name: 'Bhatkal', nameHi: 'भटकल', kmOffset: 614 },
  BYNR: { name: 'Byndoor', nameHi: 'बैन्दूर', kmOffset: 630 },
  KUDA: { name: 'Kundapura', nameHi: 'कुन्दापुर', kmOffset: 655 },
  UD:   { name: 'Udupi', nameHi: 'उडुपी', kmOffset: 686 },
  MULK: { name: 'Mulki', nameHi: 'मुल्की', kmOffset: 720 },
  SRTK: { name: 'Surathkal', nameHi: 'सुरतकल', kmOffset: 738 },

  // Southern Terminals (South of Surathkal = positive offset)
  MAJN: { name: 'Mangaluru Jn', nameHi: 'मंगळूरु जंक्शन', kmOffset: 760 },
  MAQ:  { name: 'Mangaluru Central', nameHi: 'मंगळूरु सेंट्रल', kmOffset: 765 },
  CAN:  { name: 'Kannur', nameHi: 'कण्णूर', kmOffset: 890 },
  CLT:  { name: 'Kozhikode', nameHi: 'कोळिकोड', kmOffset: 980 },
  SRR:  { name: 'Shoranur Jn', nameHi: 'शोरणूर', kmOffset: 1060 },
  TCR:  { name: 'Thrissur', nameHi: 'तृशूर', kmOffset: 1095 },
  ERS:  { name: 'Ernakulam (Kochi)', nameHi: 'एर्नाकुलम', kmOffset: 1170 },
  ALLP: { name: 'Alappuzha', nameHi: 'अलप्पुळा', kmOffset: 1230 },
  KTYM: { name: 'Kottayam', nameHi: 'कोट्टायम', kmOffset: 1230 },
  QLN:  { name: 'Kollam Jn', nameHi: 'कोल्लम', kmOffset: 1330 },
  TVC:  { name: 'Thiruvananthapuram', nameHi: 'तिरुवनंतपुरम', kmOffset: 1390 },
  TVCN: { name: 'Kochuveli (Trivandrum)', nameHi: 'कोचुवेली', kmOffset: 1385 },
  KCVL: { name: 'Kochuveli (Trivandrum)', nameHi: 'कोचुवेली', kmOffset: 1385 },
  TEN:  { name: 'Tirunelveli', nameHi: 'तिरुनेलवेली', kmOffset: 1540 },
  CBE:  { name: 'Coimbatore', nameHi: 'कोइम्बतूर', kmOffset: 1160 },
};

/**
 * Resolves the true physical travel direction of a train ('up' = Northbound to Mumbai/Roha, 'down' = Southbound to Goa/Mangaluru).
 * Fixes parity bugs and name-direction mismatches.
 */
export function getEffectiveDirection(train: { trainNumber: string; trainName: string; direction?: 'up' | 'down' }): 'up' | 'down' {
  const name = (train.trainName || '').toUpperCase();

  // 1. Explicit "SRC-DEST" pattern in name (e.g. "MAO-CSMT", "CSMT-MAO", "DR-KUDL", "KUDL-DR", "SWV-LTT")
  const match = name.match(/\b([A-Z]{2,5})\s*[-–]\s*([A-Z]{2,5})\b/);
  if (match) {
    const src = STATION_NAMES[match[1]];
    const dest = STATION_NAMES[match[2]];
    if (src && dest && src.kmOffset !== dest.kmOffset) {
      // If src is south of dest (e.g. MAO 436 > CSMT -140), train is moving North ('up')
      return src.kmOffset < dest.kmOffset ? 'down' : 'up';
    }
  }

  // 2. Specific named train directions
  const num = parseInt(train.trainNumber, 10);
  if (!isNaN(num)) {
    // Northern Railway trains (Mangala, Kerala Sampark Kranti)
    if (num === 12618 || num === 12218 || num === 12978) return 'down';
    if (num === 12617 || num === 12217 || num === 12977) return 'up';

    // Standard Konkan / Central Railway convention:
    // Even train numbers terminate in Mumbai/Delhi (UP, Northbound)
    // Odd train numbers terminate in Goa/Mangaluru/Kerala (DOWN, Southbound)
    return num % 2 === 0 ? 'up' : 'down';
  }

  return train.direction || 'down';
}

/**
 * Extract human-readable source and destination from train name or code conventions.
 */
export function getTrainEndpoints(train: TrainPosition, lang: 'en' | 'hi' = 'en'): TrainEndpoints {
  const name = train.trainName.toUpperCase();
  const isDown = getEffectiveDirection(train) === 'down';

  // 1. Try pattern: "SRC-DEST" or "SRC - DEST" e.g. "CSMT-SWV SPL", "SWV-LTT SPL", "MAJN-ADI SPECIA"
  const match = name.match(/\b([A-Z]{2,5})\s*[-–]\s*([A-Z]{2,5})\b/);
  if (match) {
    const srcCode = match[1];
    const destCode = match[2];
    const src = STATION_NAMES[srcCode];
    const dest = STATION_NAMES[destCode];

    const srcName = src ? (lang === 'hi' ? src.nameHi : src.name) : srcCode;
    const destName = dest ? (lang === 'hi' ? dest.nameHi : dest.name) : destCode;
    const totalDistance = (src && dest) ? Math.abs(dest.kmOffset - src.kmOffset) : 738;

    return {
      sourceCode: srcCode,
      sourceName: srcName,
      destCode: destCode,
      destName: destName,
      routeSummary: `${srcName} → ${destName}`,
      totalDistanceKm: totalDistance,
    };
  }

  // 2. Named train heuristics
  if (name.includes('KERALA') && name.includes('KRANTI')) {
    return {
      sourceCode: isDown ? 'CDG' : 'KCVL',
      sourceName: isDown ? (lang === 'hi' ? 'चंदिगढ' : 'Chandigarh') : (lang === 'hi' ? 'कोचुवेली (केरळ)' : 'Kochuveli (Kerala)'),
      destCode: isDown ? 'KCVL' : 'CDG',
      destName: isDown ? (lang === 'hi' ? 'कोचुवेली (केरळ)' : 'Kochuveli (Kerala)') : (lang === 'hi' ? 'चंदिगढ' : 'Chandigarh'),
      routeSummary: isDown ? 'Chandigarh → Kochuveli' : 'Kochuveli → Chandigarh',
      totalDistanceKm: 3140,
    };
  }

  if (name.includes('MANGALA')) {
    return {
      sourceCode: isDown ? 'NZM' : 'ERS',
      sourceName: isDown ? (lang === 'hi' ? 'हजरत निजामुद्दीन' : 'Delhi Nizamuddin') : (lang === 'hi' ? 'एर्नाकुलम (कोची)' : 'Ernakulam (Kochi)'),
      destCode: isDown ? 'ERS' : 'NZM',
      destName: isDown ? (lang === 'hi' ? 'एर्नाकुलम (कोची)' : 'Ernakulam (Kochi)') : (lang === 'hi' ? 'हजरत निजामुद्दीन' : 'Delhi Nizamuddin'),
      routeSummary: isDown ? 'Delhi → Ernakulam' : 'Ernakulam → Delhi',
      totalDistanceKm: 2670,
    };
  }

  if (name.includes('NETRAVA')) {
    return {
      sourceCode: isDown ? 'LTT' : 'TVC',
      sourceName: isDown ? (lang === 'hi' ? 'मुंबई एलटीटी' : 'Mumbai LTT') : (lang === 'hi' ? 'तिरुवनंतपुरम' : 'Thiruvananthapuram'),
      destCode: isDown ? 'TVC' : 'LTT',
      destName: isDown ? (lang === 'hi' ? 'तिरुवनंतपुरम' : 'Thiruvananthapuram') : (lang === 'hi' ? 'मुंबई एलटीटी' : 'Mumbai LTT'),
      routeSummary: isDown ? 'Mumbai LTT → Trivandrum' : 'Trivandrum → Mumbai LTT',
      totalDistanceKm: 1520,
    };
  }

  if (name.includes('MATSYAG')) {
    return {
      sourceCode: isDown ? 'LTT' : 'MAQ',
      sourceName: isDown ? (lang === 'hi' ? 'मुंबई एलटीटी' : 'Mumbai LTT') : (lang === 'hi' ? 'मंगळूरु सेंट्रल' : 'Mangaluru Central'),
      destCode: isDown ? 'MAQ' : 'LTT',
      destName: isDown ? (lang === 'hi' ? 'मंगळूरु सेंट्रल' : 'Mangaluru Central') : (lang === 'hi' ? 'मुंबई एलटीटी' : 'Mumbai LTT'),
      routeSummary: isDown ? 'Mumbai LTT → Mangaluru' : 'Mangaluru → Mumbai LTT',
      totalDistanceKm: 895,
    };
  }

  if (name.includes('KONKAN') && name.includes('KANYA')) {
    return {
      sourceCode: isDown ? 'CSMT' : 'MAO',
      sourceName: isDown ? (lang === 'hi' ? 'मुंबई सीएसएमटी' : 'Mumbai CSMT') : (lang === 'hi' ? 'मडगाव जंक्शन' : 'Madgaon (Goa)'),
      destCode: isDown ? 'MAO' : 'CSMT',
      destName: isDown ? (lang === 'hi' ? 'मडगाव जंक्शन' : 'Madgaon (Goa)') : (lang === 'hi' ? 'मुंबई सीएसएमटी' : 'Mumbai CSMT'),
      routeSummary: isDown ? 'Mumbai CSMT → Madgaon' : 'Madgaon → Mumbai CSMT',
      totalDistanceKm: 580,
    };
  }

  if (name.includes('MANDOVI')) {
    return {
      sourceCode: isDown ? 'CSMT' : 'MAO',
      sourceName: isDown ? (lang === 'hi' ? 'मुंबई सीएसएमटी' : 'Mumbai CSMT') : (lang === 'hi' ? 'मडगाव जंक्शन' : 'Madgaon (Goa)'),
      destCode: isDown ? 'MAO' : 'CSMT',
      destName: isDown ? (lang === 'hi' ? 'मडगाव जंक्शन' : 'Madgaon (Goa)') : (lang === 'hi' ? 'मुंबई सीएसएमटी' : 'Mumbai CSMT'),
      routeSummary: isDown ? 'Mumbai CSMT → Madgaon' : 'Madgaon → Mumbai CSMT',
      totalDistanceKm: 580,
    };
  }

  if (name.includes('TUTARI')) {
    return {
      sourceCode: isDown ? 'DR' : 'SWV',
      sourceName: isDown ? (lang === 'hi' ? 'दादर (मुंबई)' : 'Dadar (Mumbai)') : (lang === 'hi' ? 'सावंतवाडी रोड' : 'Sawantwadi Road'),
      destCode: isDown ? 'SWV' : 'DR',
      destName: isDown ? (lang === 'hi' ? 'सावंतवाडी रोड' : 'Sawantwadi Road') : (lang === 'hi' ? 'दादर (मुंबई)' : 'Dadar (Mumbai)'),
      routeSummary: isDown ? 'Dadar → Sawantwadi' : 'Sawantwadi → Dadar',
      totalDistanceKm: 490,
    };
  }

  if (name.includes('RATNAGIRI') || name.includes('RN PASS')) {
    return {
      sourceCode: isDown ? 'DR' : 'RN',
      sourceName: isDown ? (lang === 'hi' ? 'दादर (मुंबई)' : 'Dadar (Mumbai)') : (lang === 'hi' ? 'रत्नागिरी' : 'Ratnagiri'),
      destCode: isDown ? 'RN' : 'DR',
      destName: isDown ? (lang === 'hi' ? 'रत्नागिरी' : 'Ratnagiri') : (lang === 'hi' ? 'दादर (मुंबई)' : 'Dadar (Mumbai)'),
      routeSummary: isDown ? 'Dadar → Ratnagiri' : 'Ratnagiri → Dadar',
      totalDistanceKm: 346,
    };
  }

  // 3. Fallback based on resolved direction
  if (isDown) {
    return {
      sourceCode: 'ROHA',
      sourceName: lang === 'hi' ? 'रोहा' : 'Roha',
      destCode: 'SRTK',
      destName: lang === 'hi' ? 'सुरतकल' : 'Surathkal',
      routeSummary: 'Roha → Surathkal (Southbound)',
      totalDistanceKm: 738,
    };
  } else {
    return {
      sourceCode: 'SRTK',
      sourceName: lang === 'hi' ? 'सुरतकल' : 'Surathkal',
      destCode: 'ROHA',
      destName: lang === 'hi' ? 'रोहा' : 'Roha',
      routeSummary: 'Surathkal → Roha (Northbound)',
      totalDistanceKm: 738,
    };
  }
}

/**
 * Calculates exact distance covered between train source and destination,
 * remaining distance, and progress percentage.
 */
export function getRouteProgress(train: TrainPosition, lang: 'en' | 'hi' = 'en'): RouteProgress {
  const direction = getEffectiveDirection(train);
  const endpoints = getTrainEndpoints(train, lang);
  const src = STATION_NAMES[endpoints.sourceCode];
  const dest = STATION_NAMES[endpoints.destCode];

  const krSectorKm = Math.round(train.progressKm);
  const currentStationName = train.lastStationName || 'Konkan Railway';

  // Calculate total route distance
  let totalRouteKm = endpoints.totalDistanceKm || 738;
  if (src && dest) {
    const dist = Math.abs(dest.kmOffset - src.kmOffset);
    if (dist > 50) totalRouteKm = dist;
  }

  // Calculate distance covered based on current train position
  let coveredKm = 0;
  if (src && dest) {
    if (direction === 'down') {
      // Southbound: train moving from smaller offset (North) to larger offset (South)
      coveredKm = krSectorKm - src.kmOffset;
    } else {
      // Northbound: train moving from larger offset (South) to smaller offset (North)
      coveredKm = src.kmOffset - krSectorKm;
    }
  } else {
    coveredKm = direction === 'down' ? krSectorKm : Math.max(0, 738 - krSectorKm);
  }

  coveredKm = Math.max(0, Math.min(totalRouteKm, Math.round(coveredKm)));
  const remainingKm = Math.max(0, totalRouteKm - coveredKm);
  const progressPercent = totalRouteKm > 0 ? Math.min(100, Math.max(0, Math.round((coveredKm / totalRouteKm) * 100))) : 0;

  return {
    sourceCode: endpoints.sourceCode,
    sourceName: endpoints.sourceName,
    destCode: endpoints.destCode,
    destName: endpoints.destName,
    currentStationName,
    totalRouteKm,
    coveredKm,
    remainingKm,
    progressPercent,
    routeSummary: endpoints.routeSummary,
    direction: direction,
    krSectorKm,
  };
}

/**
 * Returns the exact stations on this train's Konkan Railway journey in order of travel.
 * Never includes stations before the train's KR origin or after the train's KR destination.
 */
export function getTrainRouteStations(train: TrainPosition): Station[] {
  const endpoints = getTrainEndpoints(train);
  const src = STATION_NAMES[endpoints.sourceCode];
  const dest = STATION_NAMES[endpoints.destCode];
  const direction = getEffectiveDirection(train);
  const isDown = direction === 'down';

  // Determine KR start and end boundaries (0 to 738 km)
  let startKrKm = 0;
  let endKrKm = 738;

  if (isDown) {
    // Southbound: Roha/North -> South
    if (src && src.kmOffset >= 0 && src.kmOffset <= 738) {
      startKrKm = src.kmOffset;
    } else {
      startKrKm = 0;
    }

    if (dest && dest.kmOffset >= 0 && dest.kmOffset <= 738) {
      endKrKm = dest.kmOffset;
    } else {
      endKrKm = 738;
    }
  } else {
    // Northbound: South -> Roha/North
    if (src && src.kmOffset >= 0 && src.kmOffset <= 738) {
      startKrKm = src.kmOffset;
    } else {
      startKrKm = 738;
    }

    if (dest && dest.kmOffset >= 0 && dest.kmOffset <= 738) {
      endKrKm = dest.kmOffset;
    } else {
      endKrKm = 0;
    }
  }

  const minKm = Math.min(startKrKm, endKrKm, train.progressKm);
  const maxKm = Math.max(startKrKm, endKrKm, train.progressKm);

  // Filter STATIONS strictly within [minKm - 2, maxKm + 2]
  const inRange = STATIONS.filter(s => s.km >= (minKm - 2) && s.km <= (maxKm + 2));

  // Sequence according to travel direction
  if (isDown) {
    return inRange.sort((a, b) => a.km - b.km);
  } else {
    return inRange.sort((a, b) => b.km - a.km);
  }
}

/**
 * Returns human-readable direction label with high-visibility origin-to-destination context.
 */
export function getDirectionDetails(direction: 'up' | 'down', lang: 'en' | 'hi' = 'en') {
  if (direction === 'down') {
    return {
      arrow: '▼',
      tag: 'Southbound',
      subText: lang === 'hi' ? 'दक्षिणगामी (मुंबई/रोहा → गोवा/मंगळूरु)' : 'Southbound (Towards Goa / Mangaluru)',
      shortText: 'Southbound',
      color: '#38bdf8', // Bright sky-blue
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.35)',
    };
  }
  return {
    arrow: '▲',
    tag: 'Northbound',
    subText: lang === 'hi' ? 'उत्तरगामी (मंगळूरु/गोवा → मुंबई/रोहा)' : 'Northbound (Towards Mumbai / Roha)',
    shortText: 'Northbound',
    color: '#2dd4bf', // Bright teal / emerald
    badgeBg: 'rgba(45, 212, 191, 0.15)',
    badgeBorder: 'rgba(45, 212, 191, 0.35)',
  };
}

/**
 * Formats delay minutes into hours and minutes.
 * e.g., 228 -> "+3h 48m" or "+3h 48m late"
 * e.g., 45 -> "+45m" or "+45m late"
 * e.g., 0 -> "On time"
 * e.g., -15 -> "-15m" or "15m early"
 */
export function formatDelay(
  delayMinutes: number,
  options?: { showUnit?: 'short' | 'long'; lang?: 'en' | 'hi' }
): string {
  const lang = options?.lang || 'en';
  if (delayMinutes === 0) {
    return lang === 'hi' ? 'समय पर' : 'On time';
  }

  const abs = Math.abs(delayMinutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;

  let timeStr = '';
  if (hours > 0 && mins > 0) {
    timeStr = `${hours}h ${mins}m`;
  } else if (hours > 0) {
    timeStr = `${hours}h`;
  } else {
    timeStr = `${mins}m`;
  }

  if (delayMinutes > 0) {
    if (options?.showUnit === 'long') {
      return lang === 'hi' ? `+${timeStr} विलंब` : `+${timeStr} late`;
    }
    return `+${timeStr}`;
  } else {
    if (options?.showUnit === 'long') {
      return lang === 'hi' ? `${timeStr} पहले` : `${timeStr} early`;
    }
    return `-${timeStr}`;
  }
}

/**
 * Adds or subtracts minutes from an "HH:mm" time string, wrapping cleanly across 24h.
 */
export function addMinutesToTime(timeStr: string | undefined, minutes: number): string {
  if (!timeStr || !timeStr.includes(':')) {
    const now = new Date();
    const total = now.getHours() * 60 + now.getMinutes() + minutes;
    const norm = ((total % 1440) + 1440) % 1440;
    return `${String(Math.floor(norm / 60)).padStart(2, '0')}:${String(norm % 60).padStart(2, '0')}`;
  }
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return timeStr;

  const total = h * 60 + m + minutes;
  const norm = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(norm / 60);
  const mm = norm % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/**
 * Calculates transit time between stations in minutes based on distance and train speed profile.
 */
export function calculateTransitMinutes(distanceKm: number, category?: string): number {
  const speed = category === 'premium' ? 75
    : category === 'superfast' ? 65
    : category === 'express' ? 55
    : category === 'passenger' ? 45
    : 50;
  return Math.max(2, Math.round(distanceKm / (speed / 60)));
}

export interface StationTimingInfo {
  stationCode: string;
  stationName: string;
  status: 'passed' | 'current' | 'upcoming';
  scheduledArrival: string;          // "HH:mm" or "" (Origin)
  actualOrExpectedArrival: string;   // "HH:mm" or ""
  isArrivalDelayed: boolean;
  scheduledDeparture: string;        // "HH:mm" or "" (Dest)
  actualOrExpectedDeparture: string; // "HH:mm" or ""
  isDepartureDelayed: boolean;
  // Legacy fields for compatibility
  scheduledTime: string;             // "HH:mm"
  expectedOrActualTime: string;      // "HH:mm"
  delayMinutes: number;
  delayText: string;
  isOfficialStop: boolean;
  distanceKmFromTrain: number;
}

/**
 * Derives accurate, authentic timetable and delay-adjusted timing information
 * for any station along a train's journey matching Google Transit structure.
 */
export function getStationTimingDetails(
  train: TrainPosition,
  station: Station,
  options?: {
    history?: Array<{ station_code: string; actual_time?: string; delay_minutes?: number }>;
    routeStations?: Station[];
    safeActiveIndex?: number;
    lang?: 'en' | 'hi';
  }
): StationTimingInfo {
  const lang = options?.lang || 'en';
  const distanceKm = Math.abs(station.km - train.progressKm);
  const schedule = getOfficialTrainSchedule(train.trainNumber);
  const stop = schedule?.stops.find(s => s.stationCode === station.code);
  const isOfficialStop = Boolean(stop) || station.type === 'major';

  // Determine relative position
  const routeStations = options?.routeStations || getTrainRouteStations(train);
  const currentStationIndex = options?.safeActiveIndex !== undefined
    ? options.safeActiveIndex
    : routeStations.findIndex(s => s.code === train.lastStationCode || s.name.toLowerCase() === train.lastStationName.toLowerCase());

  const thisStationIndex = routeStations.findIndex(s => s.code === station.code);
  const safeCurrentIndex = currentStationIndex !== -1 ? currentStationIndex : 0;

  let status: 'passed' | 'current' | 'upcoming' = 'upcoming';
  if (thisStationIndex !== -1 && thisStationIndex < safeCurrentIndex) {
    status = 'passed';
  } else if (thisStationIndex !== -1 && thisStationIndex === safeCurrentIndex) {
    status = 'current';
  } else if (thisStationIndex === -1) {
    // Fallback based on physical travel direction
    const isDown = getEffectiveDirection(train) === 'down';
    const hasPassed = isDown ? station.km < train.progressKm : station.km > train.progressKm;
    status = hasPassed ? 'passed' : 'upcoming';
  }

  const delayMinutes = train.delayMinutes || 0;
  const delayText = formatDelay(delayMinutes, { lang });

  const isOrigin = thisStationIndex === 0;
  const isDestination = thisStationIndex === routeStations.length - 1;

  let scheduledArrival = '';
  let scheduledDeparture = '';
  let actualOrExpectedArrival = '';
  let actualOrExpectedDeparture = '';

  const transitMins = calculateTransitMinutes(distanceKm, train.category);

  if (isOrigin) {
    scheduledArrival = '';
    actualOrExpectedArrival = '';
    scheduledDeparture = stop?.dep && stop.dep !== 'Dest' ? stop.dep : '08:30';
    if (status === 'current' || status === 'passed') {
      actualOrExpectedDeparture = train.actualTime || addMinutesToTime(scheduledDeparture, delayMinutes);
    } else {
      actualOrExpectedDeparture = addMinutesToTime(scheduledDeparture, delayMinutes);
    }
  } else if (isDestination) {
    scheduledDeparture = '';
    actualOrExpectedDeparture = '';
    scheduledArrival = stop?.arr && stop.arr !== 'Origin' ? stop.arr : (stop?.dep || '');
    if (!scheduledArrival) {
      const totalTransit = calculateTransitMinutes(Math.abs(738 - train.progressKm), train.category);
      scheduledArrival = addMinutesToTime(train.actualTime, totalTransit - delayMinutes);
    }
    actualOrExpectedArrival = addMinutesToTime(scheduledArrival, delayMinutes);
  } else {
    // Intermediate station
    if (stop) {
      scheduledArrival = stop.arr !== 'Origin' ? stop.arr : stop.dep;
      scheduledDeparture = stop.dep !== 'Dest' ? stop.dep : stop.arr;
    } else {
      const estTime = status === 'passed'
        ? addMinutesToTime(train.actualTime, -transitMins)
        : addMinutesToTime(train.actualTime, transitMins);
      scheduledArrival = addMinutesToTime(estTime, -delayMinutes);
      scheduledDeparture = addMinutesToTime(scheduledArrival, 2);
    }

    if (status === 'current') {
      if (train.status === 'arrived') {
        actualOrExpectedArrival = train.actualTime;
        actualOrExpectedDeparture = scheduledDeparture
          ? addMinutesToTime(scheduledDeparture, delayMinutes)
          : addMinutesToTime(train.actualTime, 2);
      } else if (train.status === 'departed') {
        actualOrExpectedDeparture = train.actualTime;
        actualOrExpectedArrival = scheduledArrival
          ? addMinutesToTime(scheduledArrival, delayMinutes)
          : train.actualTime;
      } else {
        actualOrExpectedArrival = scheduledArrival
          ? addMinutesToTime(scheduledArrival, delayMinutes)
          : train.actualTime;
        actualOrExpectedDeparture = scheduledDeparture
          ? addMinutesToTime(scheduledDeparture, delayMinutes)
          : train.actualTime;
      }
    } else if (status === 'passed') {
      const hist = options?.history?.find(h => h.station_code === station.code);
      if (hist && hist.actual_time) {
        actualOrExpectedDeparture = hist.actual_time;
        actualOrExpectedArrival = scheduledArrival
          ? addMinutesToTime(scheduledArrival, hist.delay_minutes ?? delayMinutes)
          : hist.actual_time;
      } else {
        actualOrExpectedArrival = scheduledArrival
          ? addMinutesToTime(scheduledArrival, delayMinutes)
          : addMinutesToTime(train.actualTime, -transitMins);
        actualOrExpectedDeparture = scheduledDeparture
          ? addMinutesToTime(scheduledDeparture, delayMinutes)
          : addMinutesToTime(actualOrExpectedArrival, 2);
      }
    } else {
      // Upcoming
      actualOrExpectedArrival = scheduledArrival
        ? addMinutesToTime(scheduledArrival, delayMinutes)
        : addMinutesToTime(train.actualTime, transitMins);
      actualOrExpectedDeparture = scheduledDeparture
        ? addMinutesToTime(scheduledDeparture, delayMinutes)
        : addMinutesToTime(actualOrExpectedArrival, 2);
    }
  }

  const isArrivalDelayed = delayMinutes > 5;
  const isDepartureDelayed = delayMinutes > 5;

  return {
    stationCode: station.code,
    stationName: lang === 'hi' ? station.nameHi : station.name,
    status,
    scheduledArrival,
    actualOrExpectedArrival,
    isArrivalDelayed,
    scheduledDeparture,
    actualOrExpectedDeparture,
    isDepartureDelayed,
    // Legacy fields for compatibility
    scheduledTime: scheduledArrival || scheduledDeparture,
    expectedOrActualTime: actualOrExpectedArrival || actualOrExpectedDeparture,
    delayMinutes,
    delayText,
    isOfficialStop,
    distanceKmFromTrain: distanceKm,
  };
}

/**
 * Calculates realistic expected arrival time (HH:mm) at an upcoming station
 * based on official train schedule (when available) + current delay,
 * or transit time from current station.
 */
export function calculateExpectedTime(
  baseTimeStr: string | undefined,
  distanceKm: number,
  category?: string,
  delayMinutes: number = 0,
  officialScheduledTime?: string
): string {
  if (officialScheduledTime && officialScheduledTime.includes(':')) {
    return addMinutesToTime(officialScheduledTime, delayMinutes);
  }
  const transitMinutes = calculateTransitMinutes(distanceKm, category);
  return addMinutesToTime(baseTimeStr, transitMinutes);
}
