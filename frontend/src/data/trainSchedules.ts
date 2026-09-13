/**
 * Official Indian Railways / Konkan Railway Train Timetables.
 * Contains scheduled stops, arrival/departure times, and halt durations
 * for regular trains operating on the Konkan Railway network.
 */

export interface ScheduleStop {
  stationCode: string;
  stationName: string;
  arr: string; // "HH:mm" or "Origin"
  dep: string; // "HH:mm" or "Dest"
  haltMinutes: number;
  day: number;
}

export interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  stops: ScheduleStop[];
}

/**
 * Pre-compiled authentic timetables for major Konkan Railway trains.
 */
export const OFFICIAL_TRAIN_SCHEDULES: Record<string, TrainSchedule> = {
  // ── 10103: CSMT -> MAO (Mandovi Express) ──────────────────────────────
  '10103': {
    trainNumber: '10103',
    trainName: 'Mandovi Express',
    origin: 'CSMT',
    destination: 'MAO',
    stops: [
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: 'Origin', dep: '07:10', haltMinutes: 0, day: 1 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '07:22', dep: '07:25', haltMinutes: 3, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '07:53', dep: '07:55', haltMinutes: 2, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '08:30', dep: '08:35', haltMinutes: 5, day: 1 },
      { stationCode: 'MQC',  stationName: 'Mangaon', arr: '10:04', dep: '10:06', haltMinutes: 2, day: 1 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '11:20', dep: '11:22', haltMinutes: 2, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '12:00', dep: '12:02', haltMinutes: 2, day: 1 },
      { stationCode: 'SWRD', stationName: 'Sawarda', arr: '12:20', dep: '12:22', haltMinutes: 2, day: 1 },
      { stationCode: 'AVRR', stationName: 'Aravali Road', arr: '12:38', dep: '12:40', haltMinutes: 2, day: 1 },
      { stationCode: 'SNMR', stationName: 'Sangameshwar Road', arr: '12:54', dep: '12:56', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '14:00', dep: '14:05', haltMinutes: 5, day: 1 },
      { stationCode: 'ADVL', stationName: 'Adavali', arr: '14:40', dep: '14:42', haltMinutes: 2, day: 1 },
      { stationCode: 'RAJP', stationName: 'Rajapur Road', arr: '15:14', dep: '15:16', haltMinutes: 2, day: 1 },
      { stationCode: 'VBWR', stationName: 'Vaibhavwadi Road', arr: '15:34', dep: '15:36', haltMinutes: 2, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '16:04', dep: '16:06', haltMinutes: 2, day: 1 },
      { stationCode: 'SIND', stationName: 'Sindhudurg', arr: '16:20', dep: '16:22', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '16:32', dep: '16:34', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '17:10', dep: '17:12', haltMinutes: 2, day: 1 },
      { stationCode: 'PERN', stationName: 'Pernem', arr: '17:40', dep: '17:42', haltMinutes: 2, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '17:54', dep: '17:56', haltMinutes: 2, day: 1 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '18:14', dep: '18:16', haltMinutes: 2, day: 1 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '19:10', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 10104: MAO -> CSMT (Mandovi Express) ──────────────────────────────
  '10104': {
    trainNumber: '10104',
    trainName: 'Mandovi Express',
    origin: 'MAO',
    destination: 'CSMT',
    stops: [
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: 'Origin', dep: '09:15', haltMinutes: 0, day: 1 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '09:34', dep: '09:36', haltMinutes: 2, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '09:56', dep: '09:58', haltMinutes: 2, day: 1 },
      { stationCode: 'PERN', stationName: 'Pernem', arr: '10:10', dep: '10:12', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '10:30', dep: '10:32', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '10:50', dep: '10:52', haltMinutes: 2, day: 1 },
      { stationCode: 'SIND', stationName: 'Sindhudurg', arr: '11:04', dep: '11:06', haltMinutes: 2, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '11:22', dep: '11:24', haltMinutes: 2, day: 1 },
      { stationCode: 'VBWR', stationName: 'Vaibhavwadi Road', arr: '11:52', dep: '11:54', haltMinutes: 2, day: 1 },
      { stationCode: 'RAJP', stationName: 'Rajapur Road', arr: '12:12', dep: '12:14', haltMinutes: 2, day: 1 },
      { stationCode: 'ADVL', stationName: 'Adavali', arr: '12:44', dep: '12:46', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '13:40', dep: '13:45', haltMinutes: 5, day: 1 },
      { stationCode: 'SNMR', stationName: 'Sangameshwar Road', arr: '14:18', dep: '14:20', haltMinutes: 2, day: 1 },
      { stationCode: 'AVRR', stationName: 'Aravali Road', arr: '14:34', dep: '14:36', haltMinutes: 2, day: 1 },
      { stationCode: 'SWRD', stationName: 'Sawarda', arr: '14:52', dep: '14:54', haltMinutes: 2, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '15:16', dep: '15:18', haltMinutes: 2, day: 1 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '15:46', dep: '15:48', haltMinutes: 2, day: 1 },
      { stationCode: 'MQC',  stationName: 'Mangaon', arr: '17:00', dep: '17:02', haltMinutes: 2, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '18:50', dep: '18:55', haltMinutes: 5, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '19:40', dep: '19:43', haltMinutes: 3, day: 1 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '20:12', dep: '20:15', haltMinutes: 3, day: 1 },
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: '21:45', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 10111: CSMT -> MAO (Konkan Kanya Express) ─────────────────────────
  '10111': {
    trainNumber: '10111',
    trainName: 'Konkan Kanya Express',
    origin: 'CSMT',
    destination: 'MAO',
    stops: [
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: 'Origin', dep: '23:05', haltMinutes: 0, day: 1 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '23:17', dep: '23:20', haltMinutes: 3, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '23:42', dep: '23:45', haltMinutes: 3, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '00:25', dep: '00:30', haltMinutes: 5, day: 2 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '03:00', dep: '03:02', haltMinutes: 2, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '03:32', dep: '03:34', haltMinutes: 2, day: 2 },
      { stationCode: 'SNMR', stationName: 'Sangameshwar Road', arr: '04:14', dep: '04:16', haltMinutes: 2, day: 2 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '05:25', dep: '05:30', haltMinutes: 5, day: 2 },
      { stationCode: 'VBWR', stationName: 'Vaibhavwadi Road', arr: '06:40', dep: '06:42', haltMinutes: 2, day: 2 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '07:10', dep: '07:12', haltMinutes: 2, day: 2 },
      { stationCode: 'SIND', stationName: 'Sindhudurg', arr: '07:26', dep: '07:28', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '07:40', dep: '07:42', haltMinutes: 2, day: 2 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '08:08', dep: '08:10', haltMinutes: 2, day: 2 },
      { stationCode: 'PERN', stationName: 'Pernem', arr: '08:44', dep: '08:46', haltMinutes: 2, day: 2 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '08:58', dep: '09:00', haltMinutes: 2, day: 2 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '09:20', dep: '09:22', haltMinutes: 2, day: 2 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '10:45', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 10112: MAO -> CSMT (Konkan Kanya Express) ─────────────────────────
  '10112': {
    trainNumber: '10112',
    trainName: 'Konkan Kanya Express',
    origin: 'MAO',
    destination: 'CSMT',
    stops: [
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: 'Origin', dep: '19:00', haltMinutes: 0, day: 1 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '19:18', dep: '19:20', haltMinutes: 2, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '19:40', dep: '19:42', haltMinutes: 2, day: 1 },
      { stationCode: 'PERN', stationName: 'Pernem', arr: '19:54', dep: '19:56', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '20:16', dep: '20:18', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '20:38', dep: '20:40', haltMinutes: 2, day: 1 },
      { stationCode: 'SIND', stationName: 'Sindhudurg', arr: '20:52', dep: '20:54', haltMinutes: 2, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '21:10', dep: '21:12', haltMinutes: 2, day: 1 },
      { stationCode: 'VBWR', stationName: 'Vaibhavwadi Road', arr: '21:40', dep: '21:42', haltMinutes: 2, day: 1 },
      { stationCode: 'RAJP', stationName: 'Rajapur Road', arr: '21:58', dep: '22:00', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '23:25', dep: '23:30', haltMinutes: 5, day: 1 },
      { stationCode: 'SNMR', stationName: 'Sangameshwar Road', arr: '00:08', dep: '00:10', haltMinutes: 2, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '00:52', dep: '00:54', haltMinutes: 2, day: 2 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '01:24', dep: '01:26', haltMinutes: 2, day: 2 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '03:55', dep: '04:00', haltMinutes: 5, day: 2 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '04:42', dep: '04:45', haltMinutes: 3, day: 2 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '05:12', dep: '05:15', haltMinutes: 3, day: 2 },
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: '05:40', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 11003: DR -> SWV (Tutari Express) ─────────────────────────────────
  '11003': {
    trainNumber: '11003',
    trainName: 'Tutari Express',
    origin: 'DR',
    destination: 'SWV',
    stops: [
      { stationCode: 'DR',   stationName: 'Dadar', arr: 'Origin', dep: '00:05', haltMinutes: 0, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '00:27', dep: '00:30', haltMinutes: 3, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '01:10', dep: '01:15', haltMinutes: 5, day: 1 },
      { stationCode: 'ROHA', stationName: 'Roha', arr: '02:40', dep: '02:45', haltMinutes: 5, day: 1 },
      { stationCode: 'MQC',  stationName: 'Mangaon', arr: '03:08', dep: '03:10', haltMinutes: 2, day: 1 },
      { stationCode: 'VIR',  stationName: 'Veer', arr: '03:26', dep: '03:28', haltMinutes: 2, day: 1 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '04:18', dep: '04:20', haltMinutes: 2, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '04:54', dep: '04:56', haltMinutes: 2, day: 1 },
      { stationCode: 'SWRD', stationName: 'Sawarda', arr: '05:16', dep: '05:18', haltMinutes: 2, day: 1 },
      { stationCode: 'AVRR', stationName: 'Aravali Road', arr: '05:32', dep: '05:34', haltMinutes: 2, day: 1 },
      { stationCode: 'SNMR', stationName: 'Sangameshwar Road', arr: '05:48', dep: '05:50', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '07:05', dep: '07:10', haltMinutes: 5, day: 1 },
      { stationCode: 'ADVL', stationName: 'Adavali', arr: '07:44', dep: '07:46', haltMinutes: 2, day: 1 },
      { stationCode: 'VLVD', stationName: 'Vilavade', arr: '08:04', dep: '08:06', haltMinutes: 2, day: 1 },
      { stationCode: 'RAJP', stationName: 'Rajapur Road', arr: '08:24', dep: '08:26', haltMinutes: 2, day: 1 },
      { stationCode: 'VBWR', stationName: 'Vaibhavwadi Road', arr: '08:44', dep: '08:46', haltMinutes: 2, day: 1 },
      { stationCode: 'NNGR', stationName: 'Nandgaon Road', arr: '09:02', dep: '09:04', haltMinutes: 2, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '09:20', dep: '09:22', haltMinutes: 2, day: 1 },
      { stationCode: 'SIND', stationName: 'Sindhudurg', arr: '09:38', dep: '09:40', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '09:54', dep: '09:56', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '12:30', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 11004: SWV -> DR (Tutari Express) ─────────────────────────────────
  '11004': {
    trainNumber: '11004',
    trainName: 'Tutari Express',
    origin: 'SWV',
    destination: 'DR',
    stops: [
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: 'Origin', dep: '20:00', haltMinutes: 0, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '20:18', dep: '20:20', haltMinutes: 2, day: 1 },
      { stationCode: 'SIND', stationName: 'Sindhudurg', arr: '20:34', dep: '20:36', haltMinutes: 2, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '20:52', dep: '20:54', haltMinutes: 2, day: 1 },
      { stationCode: 'NNGR', stationName: 'Nandgaon Road', arr: '21:08', dep: '21:10', haltMinutes: 2, day: 1 },
      { stationCode: 'VBWR', stationName: 'Vaibhavwadi Road', arr: '21:24', dep: '21:26', haltMinutes: 2, day: 1 },
      { stationCode: 'RAJP', stationName: 'Rajapur Road', arr: '21:42', dep: '21:44', haltMinutes: 2, day: 1 },
      { stationCode: 'VLVD', stationName: 'Vilavade', arr: '22:00', dep: '22:02', haltMinutes: 2, day: 1 },
      { stationCode: 'ADVL', stationName: 'Adavali', arr: '22:20', dep: '22:22', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '23:15', dep: '23:20', haltMinutes: 5, day: 1 },
      { stationCode: 'SNMR', stationName: 'Sangameshwar Road', arr: '23:56', dep: '23:58', haltMinutes: 2, day: 1 },
      { stationCode: 'AVRR', stationName: 'Aravali Road', arr: '00:14', dep: '00:16', haltMinutes: 2, day: 2 },
      { stationCode: 'SWRD', stationName: 'Sawarda', arr: '00:30', dep: '00:32', haltMinutes: 2, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '00:54', dep: '00:56', haltMinutes: 2, day: 2 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '01:28', dep: '01:30', haltMinutes: 2, day: 2 },
      { stationCode: 'VIR',  stationName: 'Veer', arr: '02:40', dep: '02:42', haltMinutes: 2, day: 2 },
      { stationCode: 'MQC',  stationName: 'Mangaon', arr: '03:00', dep: '03:02', haltMinutes: 2, day: 2 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '04:45', dep: '04:50', haltMinutes: 5, day: 2 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '05:37', dep: '05:40', haltMinutes: 3, day: 2 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '06:45', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 12133: CSMT -> MAJN (Mangaluru Superfast Express) ─────────────────
  '12133': {
    trainNumber: '12133',
    trainName: 'Mangaluru Express',
    origin: 'CSMT',
    destination: 'MAJN',
    stops: [
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: 'Origin', dep: '22:02', haltMinutes: 0, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '22:42', dep: '22:45', haltMinutes: 3, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '23:20', dep: '23:25', haltMinutes: 5, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '04:30', dep: '04:35', haltMinutes: 5, day: 2 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '06:12', dep: '06:14', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '06:34', dep: '06:36', haltMinutes: 2, day: 2 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '07:00', dep: '07:02', haltMinutes: 2, day: 2 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '07:34', dep: '07:36', haltMinutes: 2, day: 2 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '07:54', dep: '07:56', haltMinutes: 2, day: 2 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '08:50', dep: '09:00', haltMinutes: 10, day: 2 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '09:58', dep: '10:00', haltMinutes: 2, day: 2 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '10:48', dep: '10:50', haltMinutes: 2, day: 2 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '11:34', dep: '11:36', haltMinutes: 2, day: 2 },
      { stationCode: 'BYNR', stationName: 'Byndoor', arr: '11:52', dep: '11:54', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '12:20', dep: '12:22', haltMinutes: 2, day: 2 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '12:48', dep: '12:50', haltMinutes: 2, day: 2 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '13:30', dep: '13:32', haltMinutes: 2, day: 2 },
      { stationCode: 'MAJN', stationName: 'Mangaluru Jn', arr: '14:05', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 12134: MAJN -> CSMT (Mangaluru Superfast Express) ─────────────────
  '12134': {
    trainNumber: '12134',
    trainName: 'Mangaluru Express',
    origin: 'MAJN',
    destination: 'CSMT',
    stops: [
      { stationCode: 'MAJN', stationName: 'Mangaluru Jn', arr: 'Origin', dep: '16:35', haltMinutes: 0, day: 1 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '17:04', dep: '17:06', haltMinutes: 2, day: 1 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '17:40', dep: '17:42', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '18:08', dep: '18:10', haltMinutes: 2, day: 1 },
      { stationCode: 'BYNR', stationName: 'Byndoor', arr: '18:36', dep: '18:38', haltMinutes: 2, day: 1 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '18:54', dep: '18:56', haltMinutes: 2, day: 1 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '19:44', dep: '19:46', haltMinutes: 2, day: 1 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '20:34', dep: '20:36', haltMinutes: 2, day: 1 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '21:55', dep: '22:05', haltMinutes: 10, day: 1 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '22:30', dep: '22:32', haltMinutes: 2, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '22:52', dep: '22:54', haltMinutes: 2, day: 1 },
      { stationCode: 'PERN', stationName: 'Pernem', arr: '23:08', dep: '23:10', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '23:26', dep: '23:28', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '23:48', dep: '23:50', haltMinutes: 2, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '00:10', dep: '00:12', haltMinutes: 2, day: 2 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '02:15', dep: '02:20', haltMinutes: 5, day: 2 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '08:32', dep: '08:35', haltMinutes: 3, day: 2 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '09:12', dep: '09:15', haltMinutes: 3, day: 2 },
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: '10:45', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 12617: ERS -> NZM (Mangala Lakshadweep Express) ───────────────────
  '12617': {
    trainNumber: '12617',
    trainName: 'Mangala Lakshadweep Exp',
    origin: 'ERS',
    destination: 'NZM',
    stops: [
      { stationCode: 'MAJN', stationName: 'Mangaluru Jn', arr: '21:55', dep: '22:00', haltMinutes: 5, day: 1 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '22:30', dep: '22:32', haltMinutes: 2, day: 1 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '23:08', dep: '23:10', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '23:38', dep: '23:40', haltMinutes: 2, day: 1 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '00:26', dep: '00:28', haltMinutes: 2, day: 2 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '00:46', dep: '00:48', haltMinutes: 2, day: 2 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '01:26', dep: '01:28', haltMinutes: 2, day: 2 },
      { stationCode: 'GOKR', stationName: 'Gokarna Road', arr: '01:46', dep: '01:48', haltMinutes: 2, day: 2 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '02:24', dep: '02:26', haltMinutes: 2, day: 2 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '03:30', dep: '03:40', haltMinutes: 10, day: 2 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '04:06', dep: '04:08', haltMinutes: 2, day: 2 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '04:30', dep: '04:32', haltMinutes: 2, day: 2 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '05:08', dep: '05:10', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '05:30', dep: '05:32', haltMinutes: 2, day: 2 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '05:54', dep: '05:56', haltMinutes: 2, day: 2 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '07:55', dep: '08:00', haltMinutes: 5, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '09:30', dep: '09:32', haltMinutes: 2, day: 2 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '10:04', dep: '10:06', haltMinutes: 2, day: 2 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '12:35', dep: '12:40', haltMinutes: 5, day: 2 },
    ],
  },

  // ── 12618: NZM -> ERS (Mangala Lakshadweep Express) ───────────────────
  '12618': {
    trainNumber: '12618',
    trainName: 'Mangala Lakshadweep Exp',
    origin: 'NZM',
    destination: 'ERS',
    stops: [
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '06:30', dep: '06:35', haltMinutes: 5, day: 2 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '09:10', dep: '09:12', haltMinutes: 2, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '09:44', dep: '09:46', haltMinutes: 2, day: 2 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '11:25', dep: '11:30', haltMinutes: 5, day: 2 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '13:08', dep: '13:10', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '13:30', dep: '13:32', haltMinutes: 2, day: 2 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '13:54', dep: '13:56', haltMinutes: 2, day: 2 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '14:36', dep: '14:38', haltMinutes: 2, day: 2 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '14:58', dep: '15:00', haltMinutes: 2, day: 2 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '16:00', dep: '16:10', haltMinutes: 10, day: 2 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '17:10', dep: '17:12', haltMinutes: 2, day: 2 },
      { stationCode: 'GOKR', stationName: 'Gokarna Road', arr: '17:46', dep: '17:48', haltMinutes: 2, day: 2 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '18:08', dep: '18:10', haltMinutes: 2, day: 2 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '18:50', dep: '18:52', haltMinutes: 2, day: 2 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '19:10', dep: '19:12', haltMinutes: 2, day: 2 },
      { stationCode: 'BYNR', stationName: 'Byndoor', arr: '19:28', dep: '19:30', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '19:58', dep: '20:00', haltMinutes: 2, day: 2 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '20:30', dep: '20:32', haltMinutes: 2, day: 2 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '21:12', dep: '21:14', haltMinutes: 2, day: 2 },
      { stationCode: 'MAJN', stationName: 'Mangaluru Jn', arr: '22:15', dep: '22:20', haltMinutes: 5, day: 2 },
    ],
  },

  // ── 12619: LTT -> MAQ (Matsyagandha Express) ──────────────────────────
  '12619': {
    trainNumber: '12619',
    trainName: 'Matsyagandha Express',
    origin: 'LTT',
    destination: 'MAQ',
    stops: [
      { stationCode: 'LTT',  stationName: 'Mumbai LTT', arr: 'Origin', dep: '15:20', haltMinutes: 0, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '15:42', dep: '15:45', haltMinutes: 3, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '16:22', dep: '16:25', haltMinutes: 3, day: 1 },
      { stationCode: 'MQC',  stationName: 'Mangaon', arr: '17:54', dep: '17:56', haltMinutes: 2, day: 1 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '19:00', dep: '19:02', haltMinutes: 2, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '19:30', dep: '19:32', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '21:10', dep: '21:15', haltMinutes: 5, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '23:30', dep: '23:32', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '23:54', dep: '23:56', haltMinutes: 2, day: 1 },
      { stationCode: 'PERN', stationName: 'Pernem', arr: '00:18', dep: '00:20', haltMinutes: 2, day: 2 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '00:32', dep: '00:34', haltMinutes: 2, day: 2 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '01:50', dep: '02:00', haltMinutes: 10, day: 2 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '03:00', dep: '03:02', haltMinutes: 2, day: 2 },
      { stationCode: 'ANKL', stationName: 'Ankola', arr: '03:26', dep: '03:28', haltMinutes: 2, day: 2 },
      { stationCode: 'GOKR', stationName: 'Gokarna Road', arr: '03:38', dep: '03:40', haltMinutes: 2, day: 2 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '03:56', dep: '03:58', haltMinutes: 2, day: 2 },
      { stationCode: 'HONVR',stationName: 'Honnavar', arr: '04:14', dep: '04:16', haltMinutes: 2, day: 2 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '04:40', dep: '04:42', haltMinutes: 2, day: 2 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '04:58', dep: '05:00', haltMinutes: 2, day: 2 },
      { stationCode: 'BYNR', stationName: 'Byndoor', arr: '05:16', dep: '05:18', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '05:46', dep: '05:48', haltMinutes: 2, day: 2 },
      { stationCode: 'BKUR', stationName: 'Barkur', arr: '06:04', dep: '06:06', haltMinutes: 2, day: 2 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '06:24', dep: '06:26', haltMinutes: 2, day: 2 },
      { stationCode: 'MULK', stationName: 'Mulki', arr: '07:04', dep: '07:06', haltMinutes: 2, day: 2 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '07:18', dep: '07:20', haltMinutes: 2, day: 2 },
      { stationCode: 'MAQ',  stationName: 'Mangaluru Central', arr: '07:40', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 12620: MAQ -> LTT (Matsyagandha Express) ──────────────────────────
  '12620': {
    trainNumber: '12620',
    trainName: 'Matsyagandha Express',
    origin: 'MAQ',
    destination: 'LTT',
    stops: [
      { stationCode: 'MAQ',  stationName: 'Mangaluru Central', arr: 'Origin', dep: '14:20', haltMinutes: 0, day: 1 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '14:48', dep: '14:50', haltMinutes: 2, day: 1 },
      { stationCode: 'MULK', stationName: 'Mulki', arr: '15:00', dep: '15:02', haltMinutes: 2, day: 1 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '15:28', dep: '15:30', haltMinutes: 2, day: 1 },
      { stationCode: 'BKUR', stationName: 'Barkur', arr: '15:46', dep: '15:48', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '16:04', dep: '16:06', haltMinutes: 2, day: 1 },
      { stationCode: 'BYNR', stationName: 'Byndoor', arr: '16:32', dep: '16:34', haltMinutes: 2, day: 1 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '16:48', dep: '16:50', haltMinutes: 2, day: 1 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '17:06', dep: '17:08', haltMinutes: 2, day: 1 },
      { stationCode: 'HONVR',stationName: 'Honnavar', arr: '17:34', dep: '17:36', haltMinutes: 2, day: 1 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '17:50', dep: '17:52', haltMinutes: 2, day: 1 },
      { stationCode: 'GOKR', stationName: 'Gokarna Road', arr: '18:08', dep: '18:10', haltMinutes: 2, day: 1 },
      { stationCode: 'ANKL', stationName: 'Ankola', arr: '18:22', dep: '18:24', haltMinutes: 2, day: 1 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '18:50', dep: '18:52', haltMinutes: 2, day: 1 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '20:00', dep: '20:10', haltMinutes: 10, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '20:56', dep: '20:58', haltMinutes: 2, day: 1 },
      { stationCode: 'PERN', stationName: 'Pernem', arr: '21:12', dep: '21:14', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '21:38', dep: '21:40', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '22:00', dep: '22:02', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '00:15', dep: '00:20', haltMinutes: 5, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '01:50', dep: '01:52', haltMinutes: 2, day: 2 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '02:22', dep: '02:24', haltMinutes: 2, day: 2 },
      { stationCode: 'MQC',  stationName: 'Mangaon', arr: '03:28', dep: '03:30', haltMinutes: 2, day: 2 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '05:10', dep: '05:15', haltMinutes: 5, day: 2 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '05:52', dep: '05:55', haltMinutes: 3, day: 2 },
      { stationCode: 'LTT',  stationName: 'Mumbai LTT', arr: '06:35', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 16345: LTT -> TVC (Netravati Express) ─────────────────────────────
  '16345': {
    trainNumber: '16345',
    trainName: 'Netravati Express',
    origin: 'LTT',
    destination: 'TVC',
    stops: [
      { stationCode: 'LTT',  stationName: 'Mumbai LTT', arr: 'Origin', dep: '11:40', haltMinutes: 0, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '12:02', dep: '12:05', haltMinutes: 3, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '12:45', dep: '12:50', haltMinutes: 5, day: 1 },
      { stationCode: 'ROHA', stationName: 'Roha', arr: '14:05', dep: '14:10', haltMinutes: 5, day: 1 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '15:20', dep: '15:22', haltMinutes: 2, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '15:52', dep: '15:54', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '17:25', dep: '17:30', haltMinutes: 5, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '19:24', dep: '19:26', haltMinutes: 2, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '20:20', dep: '20:22', haltMinutes: 2, day: 1 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '20:42', dep: '20:44', haltMinutes: 2, day: 1 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '21:35', dep: '21:45', haltMinutes: 10, day: 1 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '22:42', dep: '22:44', haltMinutes: 2, day: 1 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '23:32', dep: '23:34', haltMinutes: 2, day: 1 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '00:16', dep: '00:18', haltMinutes: 2, day: 2 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '00:36', dep: '00:38', haltMinutes: 2, day: 2 },
      { stationCode: 'BYNR', stationName: 'Byndoor', arr: '00:54', dep: '00:56', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '01:24', dep: '01:26', haltMinutes: 2, day: 2 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '01:54', dep: '01:56', haltMinutes: 2, day: 2 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '02:40', dep: '02:42', haltMinutes: 2, day: 2 },
      { stationCode: 'MAJN', stationName: 'Mangaluru Jn', arr: '04:15', dep: '04:20', haltMinutes: 5, day: 2 },
    ],
  },

  // ── 16346: TVC -> LTT (Netravati Express) ─────────────────────────────
  '16346': {
    trainNumber: '16346',
    trainName: 'Netravati Express',
    origin: 'TVC',
    destination: 'LTT',
    stops: [
      { stationCode: 'MAJN', stationName: 'Mangaluru Jn', arr: '22:45', dep: '22:50', haltMinutes: 5, day: 1 },
      { stationCode: 'SRTK', stationName: 'Surathkal', arr: '23:18', dep: '23:20', haltMinutes: 2, day: 1 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '23:50', dep: '23:52', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDA', stationName: 'Kundapura', arr: '00:22', dep: '00:24', haltMinutes: 2, day: 2 },
      { stationCode: 'BYNR', stationName: 'Byndoor', arr: '00:50', dep: '00:52', haltMinutes: 2, day: 2 },
      { stationCode: 'BTKL', stationName: 'Bhatkal', arr: '01:08', dep: '01:10', haltMinutes: 2, day: 2 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '01:28', dep: '01:30', haltMinutes: 2, day: 2 },
      { stationCode: 'KUMTA',stationName: 'Kumta', arr: '02:10', dep: '02:12', haltMinutes: 2, day: 2 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '02:58', dep: '03:00', haltMinutes: 2, day: 2 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '04:05', dep: '04:15', haltMinutes: 10, day: 2 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '04:40', dep: '04:42', haltMinutes: 2, day: 2 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '05:02', dep: '05:04', haltMinutes: 2, day: 2 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '05:54', dep: '05:56', haltMinutes: 2, day: 2 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '08:15', dep: '08:20', haltMinutes: 5, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '09:50', dep: '09:52', haltMinutes: 2, day: 2 },
      { stationCode: 'KHED', stationName: 'Khed', arr: '10:24', dep: '10:26', haltMinutes: 2, day: 2 },
      { stationCode: 'ROHA', stationName: 'Roha', arr: '12:40', dep: '12:45', haltMinutes: 5, day: 2 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '14:00', dep: '14:05', haltMinutes: 5, day: 2 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '14:47', dep: '14:50', haltMinutes: 3, day: 2 },
      { stationCode: 'LTT',  stationName: 'Mumbai LTT', arr: '17:05', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 12051: CSMT -> MAO (Jan Shatabdi Express) ─────────────────────────
  '12051': {
    trainNumber: '12051',
    trainName: 'Jan Shatabdi Express',
    origin: 'CSMT',
    destination: 'MAO',
    stops: [
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: 'Origin', dep: '05:10', haltMinutes: 0, day: 1 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '05:19', dep: '05:22', haltMinutes: 3, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '05:43', dep: '05:45', haltMinutes: 2, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '06:23', dep: '06:25', haltMinutes: 2, day: 1 },
      { stationCode: 'ROHA', stationName: 'Roha', arr: '07:28', dep: '07:30', haltMinutes: 2, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '09:04', dep: '09:06', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '10:35', dep: '10:40', haltMinutes: 5, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '12:08', dep: '12:10', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '12:28', dep: '12:30', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '12:50', dep: '12:52', haltMinutes: 2, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '13:28', dep: '13:30', haltMinutes: 2, day: 1 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '14:10', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 12052: MAO -> CSMT (Jan Shatabdi Express) ─────────────────────────
  '12052': {
    trainNumber: '12052',
    trainName: 'Jan Shatabdi Express',
    origin: 'MAO',
    destination: 'CSMT',
    stops: [
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: 'Origin', dep: '15:05', haltMinutes: 0, day: 1 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '15:46', dep: '15:48', haltMinutes: 2, day: 1 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '16:16', dep: '16:18', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '16:38', dep: '16:40', haltMinutes: 2, day: 1 },
      { stationCode: 'KKNV', stationName: 'Kankavli', arr: '17:00', dep: '17:02', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '18:35', dep: '18:40', haltMinutes: 5, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '20:00', dep: '20:02', haltMinutes: 2, day: 1 },
      { stationCode: 'ROHA', stationName: 'Roha', arr: '21:40', dep: '21:42', haltMinutes: 2, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '22:48', dep: '22:50', haltMinutes: 2, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '23:23', dep: '23:25', haltMinutes: 2, day: 1 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '23:47', dep: '23:50', haltMinutes: 3, day: 1 },
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: '23:55', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 22119: CSMT -> MAO (Tejas Express) ────────────────────────────────
  '22119': {
    trainNumber: '22119',
    trainName: 'Tejas Express',
    origin: 'CSMT',
    destination: 'MAO',
    stops: [
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: 'Origin', dep: '05:50', haltMinutes: 0, day: 1 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '06:00', dep: '06:02', haltMinutes: 2, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '06:23', dep: '06:25', haltMinutes: 2, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '07:00', dep: '07:02', haltMinutes: 2, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '09:44', dep: '09:46', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '11:05', dep: '11:10', haltMinutes: 5, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '12:48', dep: '12:50', haltMinutes: 2, day: 1 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '13:58', dep: '14:00', haltMinutes: 2, day: 1 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '14:40', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 22120: MAO -> CSMT (Tejas Express) ────────────────────────────────
  '22120': {
    trainNumber: '22120',
    trainName: 'Tejas Express',
    origin: 'MAO',
    destination: 'CSMT',
    stops: [
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: 'Origin', dep: '15:35', haltMinutes: 0, day: 1 },
      { stationCode: 'KRML', stationName: 'Karmali', arr: '15:58', dep: '16:00', haltMinutes: 2, day: 1 },
      { stationCode: 'KUDL', stationName: 'Kudal', arr: '17:14', dep: '17:16', haltMinutes: 2, day: 1 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '18:55', dep: '19:00', haltMinutes: 5, day: 1 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '20:18', dep: '20:20', haltMinutes: 2, day: 1 },
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '23:03', dep: '23:05', haltMinutes: 2, day: 1 },
      { stationCode: 'TNA',  stationName: 'Thane', arr: '23:43', dep: '23:45', haltMinutes: 2, day: 1 },
      { stationCode: 'DR',   stationName: 'Dadar', arr: '00:08', dep: '00:10', haltMinutes: 2, day: 2 },
      { stationCode: 'CSMT', stationName: 'Mumbai CSMT', arr: '00:30', dep: 'Dest', haltMinutes: 0, day: 2 },
    ],
  },

  // ── 20645: MAO -> MAQ (Vande Bharat Express) ──────────────────────────
  '20645': {
    trainNumber: '20645',
    trainName: 'Vande Bharat Express',
    origin: 'MAO',
    destination: 'MAQ',
    stops: [
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: 'Origin', dep: '06:10', haltMinutes: 0, day: 1 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '06:55', dep: '06:57', haltMinutes: 2, day: 1 },
      { stationCode: 'GOKR', stationName: 'Gokarna Road', arr: '07:28', dep: '07:30', haltMinutes: 2, day: 1 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '08:12', dep: '08:14', haltMinutes: 2, day: 1 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '09:12', dep: '09:14', haltMinutes: 2, day: 1 },
      { stationCode: 'MAQ',  stationName: 'Mangaluru Central', arr: '10:45', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 20646: MAQ -> MAO (Vande Bharat Express) ──────────────────────────
  '20646': {
    trainNumber: '20646',
    trainName: 'Vande Bharat Express',
    origin: 'MAQ',
    destination: 'MAO',
    stops: [
      { stationCode: 'MAQ',  stationName: 'Mangaluru Central', arr: 'Origin', dep: '16:00', haltMinutes: 0, day: 1 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '17:08', dep: '17:10', haltMinutes: 2, day: 1 },
      { stationCode: 'MRSW', stationName: 'Murdeshwar', arr: '18:16', dep: '18:18', haltMinutes: 2, day: 1 },
      { stationCode: 'GOKR', stationName: 'Gokarna Road', arr: '18:58', dep: '19:00', haltMinutes: 2, day: 1 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '19:33', dep: '19:35', haltMinutes: 2, day: 1 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '20:45', dep: 'Dest', haltMinutes: 0, day: 1 },
    ],
  },

  // ── 22634: NZM -> TVC (Superfast Express) ─────────────────────────────
  '22634': {
    trainNumber: '22634',
    trainName: 'NZM-TVC SF Exp',
    origin: 'NZM',
    destination: 'TVC',
    stops: [
      { stationCode: 'PNVL', stationName: 'Panvel', arr: '18:00', dep: '18:05', haltMinutes: 5, day: 2 },
      { stationCode: 'CHI',  stationName: 'Chiplun', arr: '20:44', dep: '20:46', haltMinutes: 2, day: 2 },
      { stationCode: 'RN',   stationName: 'Ratnagiri', arr: '22:15', dep: '22:20', haltMinutes: 5, day: 2 },
      { stationCode: 'SAWI', stationName: 'Sawantwadi Road', arr: '00:20', dep: '00:22', haltMinutes: 2, day: 3 },
      { stationCode: 'THVM', stationName: 'Thivim', arr: '00:54', dep: '00:56', haltMinutes: 2, day: 3 },
      { stationCode: 'MAO',  stationName: 'Madgaon Jn', arr: '02:00', dep: '02:10', haltMinutes: 10, day: 3 },
      { stationCode: 'KAWR', stationName: 'Karwar', arr: '03:10', dep: '03:12', haltMinutes: 2, day: 3 },
      { stationCode: 'UD',   stationName: 'Udupi', arr: '05:30', dep: '05:32', haltMinutes: 2, day: 3 },
      { stationCode: 'MAJN', stationName: 'Mangaluru Jn', arr: '06:40', dep: '06:45', haltMinutes: 5, day: 3 },
    ],
  },
};

/**
 * Returns the official train schedule if pre-compiled.
 */
export function getOfficialTrainSchedule(trainNumber: string): TrainSchedule | undefined {
  const trimmed = trainNumber.trim();
  const cleaned = trimmed.replace(/^0+/, ''); // e.g. "01104" -> "1104", "11004" -> "11004"
  return OFFICIAL_TRAIN_SCHEDULES[trimmed] || OFFICIAL_TRAIN_SCHEDULES[cleaned];
}
