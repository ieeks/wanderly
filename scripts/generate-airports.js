#!/usr/bin/env node
/**
 * Fetches airport-codes CSV and generates an expanded AIRPORTS array for mockData.js
 * Usage: node scripts/generate-airports.js
 */

import https from 'https';

const CSV_URL = 'https://raw.githubusercontent.com/datasets/airport-codes/master/data/airport-codes.csv';

// German name overrides: iata -> { city, name }
const DE_OVERRIDES = {
  // DACH
  VIE: { city: 'Wien',             name: 'Wien-Schwechat' },
  GRZ: { city: 'Graz',             name: 'Graz' },
  SZG: { city: 'Salzburg',         name: 'Salzburg' },
  INN: { city: 'Innsbruck',        name: 'Innsbruck' },
  KLU: { city: 'Klagenfurt',       name: 'Klagenfurt' },
  LNZ: { city: 'Linz',             name: 'Blue Danube' },
  MUC: { city: 'München',          name: 'Franz Josef Strauß' },
  FRA: { city: 'Frankfurt',        name: 'Frankfurt' },
  DUS: { city: 'Düsseldorf',       name: 'Düsseldorf' },
  BER: { city: 'Berlin',           name: 'Brandenburg' },
  HAM: { city: 'Hamburg',          name: 'Helmut Schmidt' },
  STR: { city: 'Stuttgart',        name: 'Stuttgart' },
  CGN: { city: 'Köln',             name: 'Köln/Bonn' },
  NUE: { city: 'Nürnberg',         name: 'Nürnberg' },
  HAJ: { city: 'Hannover',         name: 'Hannover' },
  BRE: { city: 'Bremen',           name: 'Bremen' },
  LEJ: { city: 'Leipzig',          name: 'Leipzig/Halle' },
  DRS: { city: 'Dresden',          name: 'Dresden' },
  ERF: { city: 'Erfurt',           name: 'Erfurt-Weimar' },
  FMO: { city: 'Münster',          name: 'Münster/Osnabrück' },
  ZRH: { city: 'Zürich',           name: 'Zürich' },
  GVA: { city: 'Genf',             name: 'Genf' },
  BSL: { city: 'Basel',            name: 'EuroAirport Basel' },
  LJU: { city: 'Ljubljana',        name: 'Jože Pučnik' },
  // Italy
  FCO: { city: 'Rom',              name: 'Fiumicino' },
  CIA: { city: 'Rom',              name: 'Ciampino' },
  MXP: { city: 'Mailand',          name: 'Malpensa' },
  LIN: { city: 'Mailand',          name: 'Linate' },
  BGY: { city: 'Mailand/Bergamo',  name: 'Orio al Serio' },
  NAP: { city: 'Neapel',           name: 'Capodichino' },
  VCE: { city: 'Venedig',          name: 'Marco Polo' },
  TSF: { city: 'Venedig/Treviso',  name: 'Treviso' },
  FLR: { city: 'Florenz',          name: 'Peretola' },
  PSA: { city: 'Pisa',             name: 'Galileo Galilei' },
  BLQ: { city: 'Bologna',          name: 'Guglielmo Marconi' },
  CTA: { city: 'Catania',          name: 'Fontanarossa' },
  PMO: { city: 'Palermo',          name: 'Falcone-Borsellino' },
  BRI: { city: 'Bari',             name: 'Karol Wojtyla' },
  CAG: { city: 'Cagliari',         name: 'Elmas' },
  OLB: { city: 'Olbia',            name: 'Costa Smeralda' },
  // Spain
  MAD: { city: 'Madrid',           name: 'Barajas' },
  BCN: { city: 'Barcelona',        name: 'El Prat' },
  AGP: { city: 'Málaga',           name: 'Costa del Sol' },
  PMI: { city: 'Mallorca',         name: 'Palma de Mallorca' },
  IBZ: { city: 'Ibiza',            name: 'Ibiza' },
  MAH: { city: 'Menorca',          name: 'Menorca' },
  TFS: { city: 'Teneriffa Süd',    name: 'Sur Reina Sofía' },
  TFN: { city: 'Teneriffa Nord',   name: 'Los Rodeos' },
  LPA: { city: 'Gran Canaria',     name: 'Gran Canaria' },
  ACE: { city: 'Lanzarote',        name: 'César Manrique' },
  FUE: { city: 'Fuerteventura',    name: 'Fuerteventura' },
  ALC: { city: 'Alicante',         name: 'Alicante-Elche' },
  VLC: { city: 'Valencia',         name: 'Valencia' },
  SVQ: { city: 'Sevilla',          name: 'San Pablo' },
  BIO: { city: 'Bilbao',           name: 'Bilbao' },
  GRX: { city: 'Granada',          name: 'Federico García Lorca' },
  // France
  CDG: { city: 'Paris',            name: 'Charles de Gaulle' },
  ORY: { city: 'Paris',            name: 'Orly' },
  LYS: { city: 'Lyon',             name: 'Saint-Exupéry' },
  NCE: { city: 'Nizza',            name: 'Côte d\'Azur' },
  MRS: { city: 'Marseille',        name: 'Provence' },
  TLS: { city: 'Toulouse',         name: 'Blagnac' },
  BOD: { city: 'Bordeaux',         name: 'Mérignac' },
  NTE: { city: 'Nantes',           name: 'Atlantique' },
  SXB: { city: 'Straßburg',        name: 'Strasbourg' },
  MPL: { city: 'Montpellier',      name: 'Méditerranée' },
  // UK
  LHR: { city: 'London',           name: 'Heathrow' },
  LGW: { city: 'London',           name: 'Gatwick' },
  STN: { city: 'London',           name: 'Stansted' },
  LTN: { city: 'London',           name: 'Luton' },
  MAN: { city: 'Manchester',       name: 'Manchester' },
  EDI: { city: 'Edinburgh',        name: 'Edinburgh' },
  GLA: { city: 'Glasgow',          name: 'Glasgow' },
  BHX: { city: 'Birmingham',       name: 'Birmingham' },
  BRS: { city: 'Bristol',          name: 'Bristol' },
  // Netherlands / Belgium / Luxembourg
  AMS: { city: 'Amsterdam',        name: 'Schiphol' },
  RTM: { city: 'Rotterdam',        name: 'Rotterdam/Den Haag' },
  EIN: { city: 'Eindhoven',        name: 'Eindhoven' },
  BRU: { city: 'Brüssel',          name: 'Zaventem' },
  CRL: { city: 'Brüssel/Charleroi',name: 'Charleroi' },
  LUX: { city: 'Luxemburg',        name: 'Findel' },
  // Scandinavia
  CPH: { city: 'Kopenhagen',       name: 'Kastrup' },
  OSL: { city: 'Oslo',             name: 'Gardermoen' },
  ARN: { city: 'Stockholm',        name: 'Arlanda' },
  NYO: { city: 'Stockholm/Skavsta',name: 'Skavsta' },
  HEL: { city: 'Helsinki',         name: 'Helsinki-Vantaa' },
  GOT: { city: 'Göteborg',         name: 'Landvetter' },
  TRD: { city: 'Trondheim',        name: 'Trondheim' },
  BGO: { city: 'Bergen',           name: 'Flesland' },
  KEF: { city: 'Reykjavik',        name: 'Keflavík' },
  // Portugal
  LIS: { city: 'Lissabon',         name: 'Humberto Delgado' },
  OPO: { city: 'Porto',            name: 'Francisco de Sá Carneiro' },
  FAO: { city: 'Faro (Algarve)',   name: 'Faro' },
  FNC: { city: 'Madeira',          name: 'Cristiano Ronaldo' },
  PDL: { city: 'Azoren',           name: 'João Paulo II' },
  // Greece
  ATH: { city: 'Athen',            name: 'Eleftherios Venizelos' },
  SKG: { city: 'Thessaloniki',     name: 'Makedonia' },
  HER: { city: 'Heraklion',        name: 'Nikos Kazantzakis' },
  CFU: { city: 'Korfu',            name: 'Ioannis Kapodistrias' },
  RHO: { city: 'Rhodos',           name: 'Diagoras' },
  KGS: { city: 'Kos',              name: 'Hippokrates' },
  JMK: { city: 'Mykonos',          name: 'Mykonos' },
  JTR: { city: 'Santorin',         name: 'Santorini' },
  ZTH: { city: 'Zakynthos',        name: 'Dionysios Solomos' },
  CHQ: { city: 'Chania',           name: 'Ioannis Daskalogiannis' },
  MJT: { city: 'Mytilini',         name: 'Odysseas Elytis' },
  EFL: { city: 'Kefalonia',        name: 'Anna Pollatou' },
  // Croatia
  SPU: { city: 'Split',            name: 'Split' },
  DBV: { city: 'Dubrovnik',        name: 'Dubrovnik' },
  ZAD: { city: 'Zadar',            name: 'Zadar' },
  PUY: { city: 'Pula',             name: 'Pula' },
  ZAG: { city: 'Zagreb',           name: 'Franjo Tuđman' },
  // Eastern Europe
  BEG: { city: 'Belgrad',          name: 'Nikola Tesla' },
  OTP: { city: 'Bukarest',         name: 'Henri Coandă' },
  SOF: { city: 'Sofia',            name: 'Sofia' },
  WAW: { city: 'Warschau',         name: 'Chopin' },
  KRK: { city: 'Krakau',           name: 'John Paul II' },
  PRG: { city: 'Prag',             name: 'Václav Havel' },
  BUD: { city: 'Budapest',         name: 'Liszt Ferenc' },
  SKP: { city: 'Skopje',           name: 'Alexander der Große' },
  TIA: { city: 'Tirana',           name: 'Nënë Tereza' },
  SJJ: { city: 'Sarajevo',         name: 'Sarajevo' },
  POZ: { city: 'Posen',            name: 'Ławica' },
  WRO: { city: 'Breslau',          name: 'Copernicus' },
  GDN: { city: 'Danzig',           name: 'Lech Wałęsa' },
  KTW: { city: 'Kattowitz',        name: 'Pyrzowice' },
  RIX: { city: 'Riga',             name: 'Riga' },
  TLL: { city: 'Tallinn',          name: 'Lennart Meri' },
  VNO: { city: 'Vilnius',          name: 'Vilnius' },
  // Turkey
  IST: { city: 'Istanbul',         name: 'Istanbul' },
  SAW: { city: 'Istanbul',         name: 'Sabiha Gökçen' },
  AYT: { city: 'Antalya',          name: 'Antalya' },
  ADB: { city: 'Izmir',            name: 'Adnan Menderes' },
  DLM: { city: 'Dalaman',          name: 'Dalaman' },
  BJV: { city: 'Bodrum',           name: 'Milas-Bodrum' },
  // Middle East
  DXB: { city: 'Dubai',            name: 'Dubai Intl.' },
  AUH: { city: 'Abu Dhabi',        name: 'Abu Dhabi' },
  DOH: { city: 'Doha',             name: 'Hamad Intl.' },
  BAH: { city: 'Bahrain',          name: 'Bahrain Intl.' },
  TLV: { city: 'Tel Aviv',         name: 'Ben Gurion' },
  AMM: { city: 'Amman',            name: 'Queen Alia' },
  BEY: { city: 'Beirut',           name: 'Rafic Hariri' },
  MCT: { city: 'Maskat',           name: 'Muscat Intl.' },
  // Africa
  CAI: { city: 'Kairo',            name: 'Cairo Intl.' },
  HRG: { city: 'Hurghada',         name: 'Hurghada' },
  SSH: { city: 'Sharm el-Sheikh',  name: 'Sharm el-Sheikh' },
  MBA: { city: 'Mombasa',          name: 'Moi Intl.' },
  NBO: { city: 'Nairobi',          name: 'Jomo Kenyatta' },
  CPT: { city: 'Kapstadt',         name: 'Cape Town Intl.' },
  JNB: { city: 'Johannesburg',     name: 'O.R. Tambo' },
  CMN: { city: 'Casablanca',       name: 'Mohammed V' },
  RAK: { city: 'Marrakesch',       name: 'Menara' },
  TUN: { city: 'Tunis',            name: 'Tunis-Carthage' },
  DJE: { city: 'Djerba',           name: 'Djerba-Zarzis' },
  MRU: { city: 'Mauritius',        name: 'Sir Seewoosagur Ramgoolam' },
  RUN: { city: 'Réunion',          name: 'Roland Garros' },
  TNR: { city: 'Antananarivo',     name: 'Ivato' },
  SEZ: { city: 'Seychellen',       name: 'Seychelles Intl.' },
  ZNZ: { city: 'Sansibar',         name: 'Abeid Amani Karume' },
  // Asia
  BKK: { city: 'Bangkok',          name: 'Suvarnabhumi' },
  DMK: { city: 'Bangkok',          name: 'Don Mueang' },
  HKT: { city: 'Phuket',           name: 'Phuket' },
  CNX: { city: 'Chiang Mai',       name: 'Chiang Mai' },
  USM: { city: 'Koh Samui',        name: 'Samui' },
  SIN: { city: 'Singapur',         name: 'Changi' },
  KUL: { city: 'Kuala Lumpur',     name: 'KLIA' },
  PEN: { city: 'Penang',           name: 'Penang Intl.' },
  CGK: { city: 'Jakarta',          name: 'Soekarno-Hatta' },
  DPS: { city: 'Bali',             name: 'Ngurah Rai' },
  MNL: { city: 'Manila',           name: 'Ninoy Aquino' },
  CEB: { city: 'Cebu',             name: 'Mactan-Cebu' },
  HAN: { city: 'Hanoi',            name: 'Noi Bai' },
  SGN: { city: 'Ho-Chi-Minh-Stadt',name: 'Tan Son Nhat' },
  DAD: { city: 'Da Nang',          name: 'Da Nang' },
  PNH: { city: 'Phnom Penh',       name: 'Phnom Penh Intl.' },
  REP: { city: 'Siem Reap',        name: 'Siem Reap' },
  RGN: { city: 'Yangon',           name: 'Yangon' },
  CMB: { city: 'Colombo',          name: 'Bandaranaike' },
  MLE: { city: 'Malediven',        name: 'Velana Intl.' },
  DEL: { city: 'Neu-Delhi',        name: 'Indira Gandhi' },
  BOM: { city: 'Mumbai',           name: 'Chhatrapati Shivaji' },
  BLR: { city: 'Bangalore',        name: 'Kempegowda' },
  MAA: { city: 'Chennai',          name: 'Chennai' },
  HYD: { city: 'Hyderabad',        name: 'Rajiv Gandhi' },
  CCU: { city: 'Kalkutta',         name: 'Netaji Subhas Chandra Bose' },
  COK: { city: 'Kochi',            name: 'Cochin Intl.' },
  GOI: { city: 'Goa',              name: 'Dabolim' },
  KTM: { city: 'Kathmandu',        name: 'Tribhuvan' },
  PEK: { city: 'Peking',           name: 'Capital' },
  PKX: { city: 'Peking',           name: 'Daxing' },
  PVG: { city: 'Shanghai',         name: 'Pudong' },
  SHA: { city: 'Shanghai',         name: 'Hongqiao' },
  CAN: { city: 'Guangzhou',        name: 'Baiyun' },
  HKG: { city: 'Hongkong',         name: 'Chek Lap Kok' },
  TPE: { city: 'Taipeh',           name: 'Taiwan Taoyuan' },
  ICN: { city: 'Seoul',            name: 'Incheon' },
  GMP: { city: 'Seoul',            name: 'Gimpo' },
  NRT: { city: 'Tokio',            name: 'Narita' },
  HND: { city: 'Tokio',            name: 'Haneda' },
  KIX: { city: 'Osaka',            name: 'Kansai' },
  ITM: { city: 'Osaka',            name: 'Itami' },
  NGO: { city: 'Nagoya',           name: 'Chubu Centrair' },
  CTS: { city: 'Sapporo',          name: 'New Chitose' },
  OKA: { city: 'Okinawa',          name: 'Naha' },
  FUK: { city: 'Fukuoka',          name: 'Fukuoka' },
  // Americas
  JFK: { city: 'New York',         name: 'JFK' },
  EWR: { city: 'New York',         name: 'Newark' },
  LGA: { city: 'New York',         name: 'LaGuardia' },
  LAX: { city: 'Los Angeles',      name: 'LAX' },
  ORD: { city: 'Chicago',          name: "O'Hare" },
  MIA: { city: 'Miami',            name: 'Miami' },
  SFO: { city: 'San Francisco',    name: 'SFO' },
  BOS: { city: 'Boston',           name: 'Logan' },
  ATL: { city: 'Atlanta',          name: 'Hartsfield-Jackson' },
  DFW: { city: 'Dallas',           name: 'Dallas/Fort Worth' },
  SEA: { city: 'Seattle',          name: 'Sea-Tac' },
  DEN: { city: 'Denver',           name: 'Denver' },
  LAS: { city: 'Las Vegas',        name: 'Harry Reid' },
  MCO: { city: 'Orlando',          name: 'Orlando' },
  MSY: { city: 'New Orleans',      name: 'Louis Armstrong' },
  HNL: { city: 'Honolulu',         name: 'Daniel K. Inouye' },
  YYZ: { city: 'Toronto',          name: 'Pearson' },
  YVR: { city: 'Vancouver',        name: 'Vancouver' },
  YUL: { city: 'Montreal',         name: 'Trudeau' },
  YYC: { city: 'Calgary',          name: 'Calgary' },
  MEX: { city: 'Mexiko-Stadt',     name: 'Benito Juárez' },
  CUN: { city: 'Cancún',           name: 'Cancún' },
  BOG: { city: 'Bogotá',           name: 'El Dorado' },
  LIM: { city: 'Lima',             name: 'Jorge Chávez' },
  GRU: { city: 'São Paulo',        name: 'Guarulhos' },
  GIG: { city: 'Rio de Janeiro',   name: 'Galeão' },
  BSB: { city: 'Brasília',         name: 'Juscelino Kubitschek' },
  EZE: { city: 'Buenos Aires',     name: 'Ezeiza' },
  SCL: { city: 'Santiago de Chile',name: 'Arturo Merino Benítez' },
  // Australia / Pacific
  SYD: { city: 'Sydney',           name: 'Kingsford Smith' },
  MEL: { city: 'Melbourne',        name: 'Tullamarine' },
  BNE: { city: 'Brisbane',         name: 'Brisbane' },
  PER: { city: 'Perth',            name: 'Perth' },
  ADL: { city: 'Adelaide',         name: 'Adelaide' },
  AKL: { city: 'Auckland',         name: 'Auckland' },
  CHC: { city: 'Christchurch',     name: 'Christchurch' },
  NAN: { city: 'Fiji',             name: 'Nadi' },
  PPT: { city: 'Tahiti',           name: 'Faa\'a' },
  // Russia / Central Asia
  SVO: { city: 'Moskau',           name: 'Scheremetjewo' },
  DME: { city: 'Moskau',           name: 'Domodedowo' },
  LED: { city: 'St. Petersburg',   name: 'Pulkovo' },
  ALA: { city: 'Almaty',           name: 'Almaty' },
};

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    // Handle quoted fields with commas
    const fields = [];
    let cur = '', inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { fields.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    fields.push(cur.trim());
    return Object.fromEntries(headers.map((h, i) => [h, (fields[i] || '').replace(/^"|"$/g, '')]));
  });
}

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

async function main() {
  console.error('Fetching airport data...');
  const csv = await fetchCSV(CSV_URL);
  const rows = parseCSV(csv);

  const filtered = rows
    .filter(r => r.type === 'large_airport' && r.iata_code && r.iata_code.length === 3)
    .sort((a, b) => a.iata_code.localeCompare(b.iata_code));

  console.error(`Found ${filtered.length} large airports with IATA codes`);

  const airports = [];
  for (const row of filtered) {
    const iata = row.iata_code.trim();
    if (DE_OVERRIDES[iata]) {
      airports.push({ iata, ...DE_OVERRIDES[iata] });
    } else {
      const city = toTitleCase(row.municipality || row.name || iata);
      const nameParts = (row.name || '').replace(/\s*International\s*Airport/i, '').replace(/\s*Airport/i, '').trim();
      airports.push({ iata, city, name: nameParts || city });
    }
  }

  // Build JS array string
  const maxIata = 3;
  const maxCity = Math.max(...airports.map(a => a.city.length));
  const maxName = Math.max(...airports.map(a => a.name.length));

  const lines = airports.map(a => {
    const iata = `'${a.iata}'`.padEnd(maxIata + 2);
    const city = `'${a.city.replace(/'/g, "\\'")}'`.padEnd(maxCity + 2);
    const name = `'${a.name.replace(/'/g, "\\'")}'`;
    return `  { iata:${iata}, city:${city}, name:${name} },`;
  });

  console.log('export const AIRPORTS = [');
  console.log(lines.join('\n'));
  console.log('];');
  console.error(`\nGenerated ${airports.length} airports.`);
}

main().catch(e => { console.error(e); process.exit(1); });
