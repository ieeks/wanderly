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
      _dateFrom: p.departureDate || '',
      _dateTo:   p.returnDate    || '',
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
      _dateFrom: p.checkIn  || '',
      _dateTo:   p.checkOut || '',
      name: p.destination || p.hotelName || '',
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
      _dateFrom: p.departureDate || '',
      _dateTo:   p.returnDate    || '',
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
    _dateFrom: p.departureDate || p.checkIn  || '',
    _dateTo:   p.returnDate    || p.checkOut || '',
    name: p.destination || '',
    emoji: '🌍',
    dates: dateRange(p.departureDate || p.checkIn, p.returnDate || p.checkOut),
    short: '',
    route: p.destination || '',
    total: p.totalAmount || 0,
  };
}

// Returns the first existing trip that would benefit from merging with this inbox item.
// Checks name similarity + that the booking type isn't already present on the trip.
export function findMergeCandidate(trips, inboxItem) {
  const p = inboxItem.parsed || {};
  const dest = (p.destination || p.hotelName || '').toLowerCase().trim();
  if (dest.length < 3) return null;

  return trips.find(t => {
    if (p.type === 'hotel'  && t.hotel?.name) return false;
    if (p.type === 'flight' && t.flight)      return false;
    if (p.type === 'train'  && t.train)       return false;

    const tName = (t.name || '').toLowerCase().trim();
    if (tName.length < 3) return false;
    return tName.includes(dest) || dest.includes(tName);
  }) || null;
}

// Returns a copy of existingTrip with the new booking details merged in.
export function mergeIntoTrip(existingTrip, inboxItem) {
  const p = inboxItem.parsed || {};
  const merged = { ...existingTrip };
  const addedCost = p.totalAmount || 0;

  if (p.type === 'hotel') {
    const ci = parseIso(p.checkIn);
    const co = parseIso(p.checkOut);
    merged.hotel = {
      name: p.hotelName || p.destination || '',
      loc:  p.destination || existingTrip.name || '',
      ci:   ci ? fmtHotel(ci, '15:00') : '',
      co:   co ? fmtHotel(co, '11:00') : '',
    };
    if (addedCost) merged.costHotel = addedCost;
    if (p.checkIn  && !merged._dateFrom) merged._dateFrom = p.checkIn;
    if (p.checkOut && !merged._dateTo)   merged._dateTo   = p.checkOut;
  } else if (p.type === 'flight') {
    const dep = parseIso(p.departureDate);
    merged.flight = {
      from:     p.fromIata  || 'VIE',
      fromCity: 'Wien',
      to:       p.toIata    || '',
      toCity:   p.destination || existingTrip.name || '',
      no:       p.flightNr  || '',
      date:     dep ? fmtFlight(dep) : '',
      depart:   p.departureTime || '',
      arrive:   p.arrivalTime   || '',
    };
    if (addedCost) merged.costFlight = addedCost;
    if (p.departureDate && !merged._dateFrom) merged._dateFrom = p.departureDate;
    if (p.returnDate    && !merged._dateTo)   merged._dateTo   = p.returnDate;
  } else if (p.type === 'train') {
    const dep = parseIso(p.departureDate);
    merged.train = {
      from:   'Wien Hbf',
      to:     p.destination || existingTrip.name || '',
      no:     p.flightNr   || '',
      date:   dep ? fmtFlight(dep) : '',
      depart: '', arrive: '', wagon: '', seats: '',
    };
    if (p.departureDate && !merged._dateFrom) merged._dateFrom = p.departureDate;
    if (p.returnDate    && !merged._dateTo)   merged._dateTo   = p.returnDate;
  }

  merged.total = (existingTrip.total || 0) + addedCost;
  merged.due   = merged.total - (existingTrip.paid || 0);
  return merged;
}
