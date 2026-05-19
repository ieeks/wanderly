const MONTH = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const DOW   = ['So','Mo','Di','Mi','Do','Fr','Sa'];

function parseIso(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function fmtShort(d) {
  return `${d.getDate()}. ${MONTH[d.getMonth()]}`;
}

function fmtFlight(d) {
  return `${DOW[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`;
}

function fmtHotel(d, time) {
  return `${fmtFlight(d)}, ${time}`;
}

function nights(from, to) {
  const f = parseIso(from), t = parseIso(to);
  if (!f || !t) return 0;
  return Math.round((t - f) / 86400000);
}

function dateRange(from, to) {
  const f = parseIso(from), t = parseIso(to);
  if (!f) return '';
  if (!t) return fmtShort(f);
  if (f.getMonth() === t.getMonth())
    return `${f.getDate()}–${t.getDate()} ${MONTH[f.getMonth()]}`;
  return `${fmtShort(f)} – ${fmtShort(t)}`;
}

const COLORS = [
  { bg:'linear-gradient(155deg,#D7E2C6,#9DB084)', accent:'#5B7148' },
  { bg:'linear-gradient(155deg,#F8DEC4,#ECAE84)', accent:'#C96F4A' },
  { bg:'linear-gradient(155deg,#D4E4F0,#7BA8B8)', accent:'#436B7C' },
  { bg:'linear-gradient(155deg,#E8D2DC,#C9A3B4)', accent:'#9C6377' },
];

export function inboxToTrip(item) {
  const p = item.parsed || {};
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const id = 'trip_' + Math.random().toString(36).slice(2, 8);

  const base = {
    id, ...color,
    paid: 0, due: p.totalAmount || 0, dueDate: null,
    costFlight: null, costHotel: null, costRental: null, costOther: null,
    extras: {}, itinerary: [],
    flight: null, train: null, drive: null,
    hotel: { name:'', loc:'', ci:'', co:'' },
  };

  if (p.type === 'flight') {
    const dep = parseIso(p.departureDate);
    const n = nights(p.departureDate, p.returnDate);
    return {
      ...base,
      name: p.destination || '',
      emoji: '✈️',
      dates: dateRange(p.departureDate, p.returnDate),
      short: n ? `${n} Nächte` : '',
      route: `Wien → ${p.destination || ''}`,
      total: p.totalAmount || 0,
      costFlight: p.totalAmount || null,
      flight: {
        from:      p.fromIata   || 'VIE',
        fromCity:  'Wien',
        to:        p.toIata     || '',
        toCity:    p.destination || '',
        no:        p.flightNr   || '',
        date:      dep ? fmtFlight(dep) : '',
        depart:    p.departureTime || '',
        arrive:    p.arrivalTime   || '',
      },
    };
  }

  if (p.type === 'hotel') {
    const ci = parseIso(p.checkIn);
    const co = parseIso(p.checkOut);
    const n = p.nights || nights(p.checkIn, p.checkOut);
    return {
      ...base,
      name: p.hotelName || p.destination || '',
      emoji: '🏨',
      dates: dateRange(p.checkIn, p.checkOut),
      short: n ? `${n} Nächte` : '',
      route: p.destination || '',
      total: p.totalAmount || 0,
      costHotel: p.totalAmount || null,
      hotel: {
        name: p.hotelName  || '',
        loc:  p.destination || '',
        ci:   ci ? fmtHotel(ci, '15:00') : '',
        co:   co ? fmtHotel(co, '11:00') : '',
      },
    };
  }

  if (p.type === 'train') {
    const dep = parseIso(p.departureDate);
    return {
      ...base,
      name: p.destination || '',
      emoji: '🚂',
      dates: dateRange(p.departureDate, p.returnDate),
      short: '',
      route: `Wien → ${p.destination || ''}`,
      total: p.totalAmount || 0,
      train: {
        from:   'Wien Hbf',
        to:     p.destination || '',
        no:     p.flightNr    || '',
        date:   dep ? fmtFlight(dep) : '',
        depart: '', arrive: '', wagon: '', seats: '',
      },
    };
  }

  return {
    ...base,
    name: p.destination || '',
    emoji: '🌍',
    dates: dateRange(p.departureDate || p.checkIn, p.returnDate || p.checkOut),
    short: '',
    route: p.destination || '',
    total: p.totalAmount || 0,
  };
}
