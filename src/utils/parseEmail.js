import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase.js';
import { TRIP_COLORS } from '../data/mockData.js';
import { fmtDate, nightsBetween } from './dateHelpers.js';

export async function extractTripFromEmail(emlContent) {
  const functions = getFunctions(app, 'europe-west3');
  const parse = httpsCallable(functions, 'parseBookingEmail');
  const result = await parse({ content: emlContent });
  return buildTrip(result.data);
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
