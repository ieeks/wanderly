import OpenAI from 'openai';
import { TRIP_COLORS } from '../data/mockData.js';
import { fmtDate, nightsBetween } from './dateHelpers.js';

const SYSTEM = `Du bist ein Reisebuchungs-Parser. Extrahiere aus der E-Mail alle Reisedaten und antworte NUR mit gültigem JSON, ohne Markdown-Codeblock.

Schema (unbekannte Felder als null):
{
  "name": "Reiseziel auf Deutsch (z.B. 'Ibiza', 'Barcelona', 'Tirol')",
  "emoji": "passendes Emoji aus: ☀ 🫒 🍇 ❄ 🏖 🏔 🌊 🎿 🏛 🌴 🗺 ✈",
  "colorIdx": 0,
  "dateFrom": "YYYY-MM-DD",
  "dateTo": "YYYY-MM-DD",
  "type": "flight | train | drive",
  "flightFrom": "IATA",
  "flightFromCity": "Stadt",
  "flightTo": "IATA",
  "flightToCity": "Stadt",
  "flightNo": "z.B. FR180",
  "flightDepart": "HH:MM",
  "flightArrive": "HH:MM",
  "trainNo": "z.B. RJ 123",
  "trainFrom": "Bahnhof",
  "trainTo": "Bahnhof",
  "trainDepart": "HH:MM",
  "trainArrive": "HH:MM",
  "trainWagon": "Wagennummer",
  "trainSeats": "z.B. '23, 24'",
  "hotelName": "Name",
  "hotelLoc": "Stadt/Adresse",
  "hotelCi": "HH:MM",
  "hotelCo": "HH:MM",
  "costFlight": 0,
  "costHotel": 0,
  "costOther": 0,
  "paid": 0,
  "insurance": false
}

colorIdx-Mapping: 0=Peach (warm, Strand, Süden), 1=Sage (Natur, Wandern), 2=Sky (Meer, Insel), 3=Plum (Stadt, Kultur), 4=Sand (Wüste, Safari)`;

export async function extractTripFromEmail(emlContent) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY fehlt – bitte in .env.local setzen');
  }

  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: emlContent.slice(0, 12000) },
    ],
  });

  const text = res.choices[0]?.message?.content || '';
  const match = text.match(/\{[\s\S]+\}/);
  if (!match) throw new Error('Kein JSON in der Antwort');

  return buildTrip(JSON.parse(match[0]));
}

function buildTrip(d) {
  const colorIdx = typeof d.colorIdx === 'number' ? Math.min(4, Math.max(0, d.colorIdx)) : 0;
  const color    = TRIP_COLORS[colorIdx];
  const dateFrom = d.dateFrom || null;
  const dateTo   = d.dateTo   || dateFrom;

  const costFlight = parseInt(d.costFlight) || 0;
  const costHotel  = parseInt(d.costHotel)  || 0;
  const costOther  = parseInt(d.costOther)  || 0;
  const total      = costFlight + costHotel + costOther;
  const paid       = parseInt(d.paid) || 0;

  const slug = (d.name || 'reise')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '');
  const monthTag = dateFrom
    ? new Date(dateFrom).toLocaleDateString('de-AT', { month: 'short', year: '2-digit' }).replace('. ', '').replace(' ', '')
    : String(Date.now());

  const ciDate = fmtDate(dateFrom);
  const coDate = fmtDate(dateTo);
  const nights = nightsBetween(dateFrom, dateTo);

  return {
    id:     'trip_' + slug + monthTag,
    name:   d.name   || 'Neue Reise',
    emoji:  d.emoji  || '✈',
    dates:  ciDate && coDate ? `${ciDate} – ${coDate}` : '',
    short:  nights ? `${nights} Nächte` : '',
    route:  `${d.flightFromCity || d.trainFrom || 'Wien'} → ${d.name || ''}`,
    total, paid,
    due:    total - paid,
    dueDate: null,
    bg:     color.bg,
    accent: color.accent,
    colorIdx,
    costFlight: costFlight || null,
    costHotel:  costHotel  || null,
    costRental: null,
    costOther:  costOther  || null,

    flight: d.type === 'flight' ? {
      from:     d.flightFrom     || 'VIE',
      fromCity: d.flightFromCity || 'Wien',
      to:       d.flightTo       || '',
      toCity:   d.flightToCity   || d.name || '',
      no:       d.flightNo       || '',
      date:     ciDate,
      depart:   d.flightDepart   || '',
      arrive:   d.flightArrive   || '',
    } : null,

    train: d.type === 'train' ? {
      from:   d.trainFrom   || 'Wien Hbf',
      to:     d.trainTo     || d.name || '',
      no:     d.trainNo     || '',
      date:   ciDate,
      depart: d.trainDepart || '',
      arrive: d.trainArrive || '',
      wagon:  d.trainWagon  || '',
      seats:  d.trainSeats  || '',
    } : null,

    drive: d.type === 'drive' ? {
      from: 'Wien',
      to:   d.name || '',
      km:   0,
      time: '',
      date: ciDate,
    } : null,

    hotel: d.hotelName ? {
      name: d.hotelName,
      loc:  d.hotelLoc || d.name || '',
      ci:   ciDate + (d.hotelCi ? `, ${d.hotelCi}` : ''),
      co:   coDate + (d.hotelCo ? `, ${d.hotelCo}` : ''),
    } : null,

    extras: { insurance: d.insurance || null, rental: null },
    itinerary: [],
  };
}
