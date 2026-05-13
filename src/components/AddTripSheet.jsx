import { useState } from 'react';
import Ic from './Ic.jsx';
import WanderlyLogo from './WanderlyLogo.jsx';
import Progress from './Progress.jsx';
import { S } from '../styles/shared.js';
import { fmtDate, nightsBetween } from '../utils/dateHelpers.js';
import { AIRPORTS, TRIP_EMOJIS, TRIP_COLORS } from '../data/mockData.js';

export default function AddTripSheet({ onClose, onAdd, onSave, initialTrip }) {
  const isEdit = !!initialTrip;

  function parseTime(str) {
    if (!str) return '';
    const m = str.match(/,\s*(\d{1,2}:\d{2})/);
    return m ? m[1] : '';
  }
  function findColorIdx(bg) {
    if (!bg) return 0;
    return Math.max(0, TRIP_COLORS.findIndex(c => c.bg === bg));
  }
  function initAirportQuery(trip) {
    if (!trip?.flight?.to) return '';
    return (trip.flight.toCity || '') + ' (' + trip.flight.to + ')';
  }
  function parseDateToISO(str) {
    if (!str) return '';
    if (str.match(/^\d{4}-\d{2}-\d{2}/)) return str.slice(0,10);
    const part = str.split('–')[0].trim();
    const months = {Jan:1,Feb:2,Mär:3,Mrz:3,Apr:4,Mai:5,Jun:6,Jul:7,Aug:8,Sep:9,Okt:10,Nov:11,Dez:12};
    const m = part.match(/(\d+)\s+([A-Za-züä]+)/);
    if (!m) return '';
    const mon = months[m[2]];
    if (!mon) return '';
    return `2026-${String(mon).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  }

  function buildInitialForm(trip) {
    if (!trip) return {
      name: '', emoji: '☀', color: 0,
      dateFrom: '', dateTo: '',
      type: 'flight',
      flightTo: '', flightToCity: '', flightNo: '', flightDepart: '', flightArrive: '',
      trainNo: '', trainDepart: '', trainArrive: '', trainWagon: '', trainSeats: '',
      driveKm: '', driveTime: '',
      hotelName: '', hotelLoc: '', hotelCi: '', hotelCo: '',
      insurance: false, rental: false,
      costFlight: '', costHotel: '', costRental: '', costOther: '',
      paid: '',
    };
    const dateParts = (trip.dates || '').split('–').map(s => s.trim());
    const dateFrom = parseDateToISO(dateParts[0] || '');
    const dateTo   = parseDateToISO(dateParts[1] || dateParts[0] || '');
    const type = trip.flight ? 'flight' : trip.train ? 'train' : 'drive';
    const t = trip;
    return {
      name:         t.name || '',
      emoji:        t.emoji || '☀',
      color:        findColorIdx(t.bg),
      dateFrom,
      dateTo,
      type,
      flightTo:     t.flight?.to || '',
      flightToCity: t.flight?.toCity || '',
      flightNo:     t.flight?.no || '',
      flightDepart: t.flight?.depart || '',
      flightArrive: t.flight?.arrive || '',
      trainNo:      t.train?.no || '',
      trainDepart:  t.train?.depart || '',
      trainArrive:  t.train?.arrive || '',
      trainWagon:   t.train?.wagon || '',
      trainSeats:   t.train?.seats || '',
      driveKm:      t.drive?.km ? String(t.drive.km) : '',
      driveTime:    t.drive?.time || '',
      hotelName:    t.hotel?.name || '',
      hotelLoc:     t.hotel?.loc || '',
      hotelCi:      parseTime(t.hotel?.ci),
      hotelCo:      parseTime(t.hotel?.co),
      insurance:    !!(t.extras?.insurance),
      rental:       t.extras?.rental === 'pending',
      costFlight:   t.flight ? String(Math.round(t.total * 0.35)) : '',
      costHotel:    t.hotel?.name ? String(Math.round(t.total * 0.55)) : '',
      costRental:   t.extras?.rental ? String(Math.round(t.total * 0.1)) : '',
      costOther:    '',
      paid:         t.paid ? String(t.paid) : '',
    };
  }

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => buildInitialForm(initialTrip));
  const [airportQuery, setAirportQuery] = useState(() => initAirportQuery(initialTrip));
  const [airportResults, setAirportResults] = useState([]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function searchAirport(q) {
    setAirportQuery(q);
    if (q.length < 2) { setAirportResults([]); return; }
    const ql = q.toLowerCase();
    setAirportResults(
      AIRPORTS.filter(a =>
        a.city.toLowerCase().includes(ql) ||
        a.iata.toLowerCase().includes(ql) ||
        a.name.toLowerCase().includes(ql)
      ).slice(0, 5)
    );
  }

  function selectAirport(a) {
    set('flightTo', a.iata);
    set('flightToCity', a.city);
    setAirportQuery(a.city + ' (' + a.iata + ')');
    setAirportResults([]);
  }

  const inputStyle = {
    width:'100%', padding:'11px 14px', borderRadius:12,
    border:'1.5px solid #EADFC4', background:'#FFFAF1',
    fontFamily:'inherit', fontSize:14, color:'#2D1F15',
    outline:'none', boxSizing:'border-box',
  };
  const labelStyle = {
    fontFamily:'monospace', fontSize:9, letterSpacing:'0.12em',
    textTransform:'uppercase', color:'#9F8A6F', marginBottom:5, display:'block',
  };

  const STEPS = 4;
  const canNext1 = form.name.trim().length > 0 && form.dateFrom && form.dateTo;
  const canSave  = canNext1 && (form.costFlight || form.costHotel || form.costOther);

  function handleSave() {
    const nights = nightsBetween(form.dateFrom, form.dateTo);
    const ciDate = fmtDate(form.dateFrom);
    const coDate = fmtDate(form.dateTo);
    const newTrip = {
      id: 'trip_' + Date.now(),
      name: form.name,
      emoji: form.emoji,
      dates: fmtDate(form.dateFrom) + ' – ' + fmtDate(form.dateTo),
      short: nights + ' Nächte',
      route: 'Wien → ' + form.name,
      total: (parseInt(form.costFlight)||0) + (parseInt(form.costHotel)||0) + (parseInt(form.costRental)||0) + (parseInt(form.costOther)||0),
      paid:  parseInt(form.paid)  || 0,
      due:   ((parseInt(form.costFlight)||0) + (parseInt(form.costHotel)||0) + (parseInt(form.costRental)||0) + (parseInt(form.costOther)||0)) - (parseInt(form.paid)||0),
      dueDate: null,
      bg: TRIP_COLORS[form.color].bg,
      accent: TRIP_COLORS[form.color].accent,
      flight: form.type === 'flight' ? { from: 'VIE', fromCity:'Wien', to: form.flightTo||'???', toCity: form.flightToCity||form.name, no: form.flightNo, date: ciDate, depart: form.flightDepart, arrive: form.flightArrive } : null,
      train:  form.type === 'train'  ? { from:'Wien Hbf', to: form.name, no: form.trainNo, date: ciDate, depart: form.trainDepart, arrive: form.trainArrive, wagon: form.trainWagon, seats: form.trainSeats } : null,
      drive:  form.type === 'drive'  ? { from:'Wien', to: form.name, km: parseInt(form.driveKm)||0, time: form.driveTime, date: ciDate } : null,
      hotel: form.hotelName ? {
        name: form.hotelName,
        loc:  form.hotelLoc || form.name,
        ci:   ciDate + (form.hotelCi ? ', ' + form.hotelCi : ', 15:00'),
        co:   coDate + (form.hotelCo ? ', ' + form.hotelCo : ', 11:00'),
      } : { name:'', loc:'', ci:'', co:'' },
      extras: {
        insurance: form.insurance || undefined,
        rental: form.rental ? 'pending' : undefined,
      },
      itinerary: [],
    };
    if (isEdit) {
      onSave({ ...newTrip, id: initialTrip.id, itinerary: initialTrip.itinerary || [] });
    } else {
      onAdd(newTrip);
    }
    onClose();
  }

  return (
    <>
      <div style={{ position:'absolute', inset:0, background:'rgba(45,31,21,0.45)', zIndex:30 }} onClick={onClose} />
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#FFFAF1', borderTopLeftRadius:26, borderTopRightRadius:26, zIndex:31, maxHeight:'88%', display:'flex', flexDirection:'column' }}>

        <div style={{ padding:'10px 18px 0', flexShrink:0 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'rgba(45,31,21,0.16)', margin:'0 auto 14px' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <WanderlyLogo size={22} showWordmark={true} />
              <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'#9F8A6F', marginTop:6 }}>{isEdit ? 'Bearbeiten' : 'Neue Reise'} · Schritt {step}/{STEPS}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:600, marginTop:1 }}>
                {step===1 ? (isEdit ? 'Grundinfos' : 'Reise anlegen') : step===2 ? 'Anreise' : step===3 ? 'Unterkunft' : 'Budget'}
              </div>
            </div>
            <div style={{ cursor:'pointer' }} onClick={onClose}><Ic name="X" size={20} color="#9F8A6F" /></div>
          </div>

          <div style={{ display:'flex', gap:5, marginBottom:18 }}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{ flex:1, height:3, borderRadius:2, background: s <= step ? '#C96F4A' : '#EADFC4', transition:'background 300ms' }} />
            ))}
          </div>
        </div>

        <div style={{ overflowY:'auto', flex:1, padding:'0 18px' }}>

          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16, paddingBottom:16 }}>
              <div>
                <span style={labelStyle}>Reiseziel</span>
                <input style={inputStyle} placeholder="z.B. Halkidiki" value={form.name}
                  onChange={e => set('name', e.target.value)} />
              </div>

              <div>
                <span style={labelStyle}>Emoji</span>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {TRIP_EMOJIS.map(em => (
                    <div key={em} onClick={() => set('emoji', em)}
                      style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, cursor:'pointer', background: form.emoji===em ? '#F8DEC4' : 'rgba(45,31,21,0.05)', border: form.emoji===em ? '2px solid #C96F4A' : '2px solid transparent', transition:'all 150ms' }}>
                      {em}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span style={labelStyle}>Kartenfarbe</span>
                <div style={{ display:'flex', gap:8 }}>
                  {TRIP_COLORS.map((col, i) => (
                    <div key={i} onClick={() => set('color', i)}
                      style={{ flex:1, height:32, borderRadius:10, background:col.bg, cursor:'pointer', border: form.color===i ? '2.5px solid #2D1F15' : '2.5px solid transparent', transition:'border 150ms' }} />
                  ))}
                </div>
              </div>

              {form.name && (
                <div>
                  <span style={labelStyle}>Vorschau</span>
                  <div style={{ borderRadius:20, padding:'14px 16px', background:TRIP_COLORS[form.color].bg, boxShadow:'0 6px 20px rgba(45,31,21,0.1)' }}>
                    <div style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.14em', color:'rgba(45,31,21,0.55)' }}>{fmtDate(form.dateFrom)||'Datum'} – {fmtDate(form.dateTo)||'Datum'}</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:26, fontWeight:600, marginTop:4 }}>{form.name} <span style={{ fontSize:20 }}>{form.emoji}</span></div>
                    <div style={{ fontSize:11, color:'rgba(45,31,21,0.6)', marginTop:2 }}>Wien → {form.name}</div>
                  </div>
                </div>
              )}

              <div style={{ display:'flex', gap:10 }}>
                <div style={{ flex:1 }}>
                  <span style={labelStyle}>Von</span>
                  <input style={inputStyle} type="date" value={form.dateFrom} onChange={e => set('dateFrom', e.target.value)} />
                </div>
                <div style={{ flex:1 }}>
                  <span style={labelStyle}>Bis</span>
                  <input style={inputStyle} type="date" value={form.dateTo} onChange={e => set('dateTo', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16, paddingBottom:16 }}>
              <div>
                <span style={labelStyle}>Anreise-Typ</span>
                <div style={{ display:'flex', gap:8 }}>
                  {[
                    { id:'flight', icon:'Plane', label:'Flug' },
                    { id:'train',  icon:'Train', label:'Zug'  },
                    { id:'drive',  icon:'Car',   label:'Auto' },
                  ].map(t => (
                    <div key={t.id} onClick={() => set('type', t.id)}
                      style={{ flex:1, padding:'12px 8px', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', background: form.type===t.id ? '#2D1F15' : 'rgba(45,31,21,0.05)', border:'2px solid transparent', transition:'all 150ms' }}>
                      <Ic name={t.icon} size={20} color={form.type===t.id ? '#FBF4E6' : '#5A4533'} />
                      <span style={{ fontSize:11, fontWeight:600, color: form.type===t.id ? '#FBF4E6' : '#5A4533' }}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...S.card, background:'rgba(45,31,21,0.04)', display:'flex', alignItems:'center', gap:10 }}>
                <Ic name="MapPin" size={14} color="#9F8A6F" />
                <span style={{ fontSize:13, color:'#5A4533', fontWeight:500 }}>Wien → <strong>{form.name||'Reiseziel'}</strong></span>
              </div>

              {form.type === 'flight' && (
                <div style={{ ...S.card, background:'#F8DEC4' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                    <Ic name="Plane" size={13} color="#5A4533" />
                    <span style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'#5A4533' }}>Flugdetails · optional</span>
                  </div>

                  <div style={{ marginBottom:10 }}>
                    <span style={labelStyle}>Von</span>
                    <div style={{ ...inputStyle, background:'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', gap:8, color:'#9F8A6F', cursor:'default' }}>
                      <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:15, color:'#5A4533' }}>VIE</span>
                      <span style={{ fontSize:12 }}>Wien-Schwechat · fix</span>
                    </div>
                  </div>

                  <div style={{ marginBottom:10, position:'relative' }}>
                    <span style={labelStyle}>Nach · Stadt oder IATA eingeben</span>
                    <input
                      style={{ ...inputStyle, background:'rgba(255,255,255,0.6)' }}
                      placeholder="z.B. Tokio oder NRT"
                      value={airportQuery}
                      onChange={e => searchAirport(e.target.value)}
                    />
                    {airportResults.length > 0 && (
                      <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#FFFAF1', borderRadius:12, boxShadow:'0 8px 24px rgba(45,31,21,0.15)', zIndex:10, marginTop:4, overflow:'hidden' }}>
                        {airportResults.map(a => (
                          <div key={a.iata} onClick={() => selectAirport(a)}
                            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:'1px solid rgba(45,31,21,0.06)', cursor:'pointer' }}>
                            <div style={{ width:36, height:36, borderRadius:10, background:'#F8DEC4', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', fontWeight:700, fontSize:12, color:'#5A4533', flexShrink:0 }}>{a.iata}</div>
                            <div>
                              <div style={{ fontSize:13, fontWeight:600 }}>{a.city}</div>
                              <div style={{ fontFamily:'monospace', fontSize:10, color:'#9F8A6F' }}>{a.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {form.flightTo && (
                    <div style={{ display:'flex', gap:10 }}>
                      <div style={{ flex:1 }}><span style={labelStyle}>Flugnr.</span><input style={{ ...inputStyle, background:'rgba(255,255,255,0.6)' }} placeholder="FR180" value={form.flightNo} onChange={e => set('flightNo', e.target.value)} /></div>
                      <div style={{ flex:1 }}><span style={labelStyle}>Abflug</span><input style={{ ...inputStyle, background:'rgba(255,255,255,0.6)' }} placeholder="11:45" value={form.flightDepart} onChange={e => set('flightDepart', e.target.value)} /></div>
                    </div>
                  )}
                </div>
              )}

              {form.type === 'train' && (
                <div style={{ ...S.card, background:'#D2E2EA' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                    <Ic name="Train" size={13} color="#436B7C" />
                    <span style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'#436B7C' }}>Zugdetails · optional</span>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ flex:1 }}><span style={labelStyle}>Zugnr.</span><input style={{ ...inputStyle, background:'rgba(255,255,255,0.6)' }} placeholder="RJX 560" value={form.trainNo} onChange={e => set('trainNo', e.target.value)} /></div>
                    <div style={{ flex:1 }}><span style={labelStyle}>Abfahrt</span><input style={{ ...inputStyle, background:'rgba(255,255,255,0.6)' }} placeholder="07:30" value={form.trainDepart} onChange={e => set('trainDepart', e.target.value)} /></div>
                  </div>
                </div>
              )}

              {form.type === 'drive' && (
                <div style={{ ...S.card, background:'#E8D2DC' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                    <Ic name="Car" size={13} color="#9C6377" />
                    <span style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'#9C6377' }}>Fahrtdetails · optional</span>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ flex:1 }}><span style={labelStyle}>Km</span><input style={{ ...inputStyle, background:'rgba(255,255,255,0.6)' }} placeholder="350" type="number" value={form.driveKm} onChange={e => set('driveKm', e.target.value)} /></div>
                    <div style={{ flex:1 }}><span style={labelStyle}>Fahrzeit</span><input style={{ ...inputStyle, background:'rgba(255,255,255,0.6)' }} placeholder="3h 30min" value={form.driveTime} onChange={e => set('driveTime', e.target.value)} /></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16, paddingBottom:16 }}>
              <div>
                <span style={labelStyle}>Hotelname</span>
                <input style={inputStyle} placeholder="z.B. Potidea Palace" value={form.hotelName} onChange={e => set('hotelName', e.target.value)} />
              </div>

              <div>
                <span style={labelStyle}>Ort / Zimmertyp</span>
                <input style={inputStyle} placeholder="z.B. Nea Potidea · Suite · 7N" value={form.hotelLoc} onChange={e => set('hotelLoc', e.target.value)} />
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <div style={{ flex:1 }}>
                  <span style={labelStyle}>Check-in Zeit</span>
                  <input style={inputStyle} placeholder="15:00" value={form.hotelCi} onChange={e => set('hotelCi', e.target.value)} />
                </div>
                <div style={{ flex:1 }}>
                  <span style={labelStyle}>Check-out Zeit</span>
                  <input style={inputStyle} placeholder="11:00" value={form.hotelCo} onChange={e => set('hotelCo', e.target.value)} />
                </div>
              </div>

              <div>
                <span style={labelStyle}>Extras</span>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { key:'insurance', icon:'Shield', label:'Reiseversicherung', sub:'Europäische · Komplett · 4 Pax', bg:'#F5EAD4' },
                    { key:'rental',    icon:'Car',    label:'Mietwagen',         sub:'als "offen" markieren',          bg:'rgba(45,31,21,0.05)' },
                  ].map(ex => (
                    <div key={ex.key} onClick={() => set(ex.key, !form[ex.key])}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:14, background: form[ex.key] ? ex.bg : 'rgba(45,31,21,0.04)', border: form[ex.key] ? '1.5px solid rgba(45,31,21,0.12)' : '1.5px solid transparent', cursor:'pointer', transition:'all 150ms' }}>
                      <div style={{ width:36, height:36, borderRadius:10, background: form[ex.key] ? 'rgba(255,255,255,0.7)' : 'rgba(45,31,21,0.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Ic name={ex.icon} size={16} color={form[ex.key] ? '#5A4533' : '#9F8A6F'} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color: form[ex.key] ? '#2D1F15' : '#9F8A6F' }}>{ex.label}</div>
                        <div style={{ fontFamily:'monospace', fontSize:10, color:'#9F8A6F', marginTop:1 }}>{ex.sub}</div>
                      </div>
                      <div style={{ width:20, height:20, borderRadius:'50%', background: form[ex.key] ? '#C96F4A' : 'rgba(45,31,21,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {form[ex.key] && <Ic name="Check" size={11} color="#FBF4E6" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {form.hotelName && (
                <div style={{ ...S.card, background:'#F8DEC4' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                    <Ic name="Building2" size={12} color="#5A4533" />
                    <span style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.08em', color:'#5A4533' }}>Vorschau</span>
                  </div>
                  <div style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:600 }}>{form.hotelName}</div>
                  {form.hotelLoc && <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(45,31,21,0.6)', marginTop:2 }}>{form.hotelLoc}</div>}
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
                    <div><div style={{ fontFamily:'monospace', fontSize:8, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(45,31,21,0.5)' }}>Check-in</div><div style={{ fontWeight:600, fontSize:12, marginTop:1 }}>{fmtDate(form.dateFrom)}{form.hotelCi ? ', '+form.hotelCi : ', 15:00'}</div></div>
                    <div style={{ textAlign:'right' }}><div style={{ fontFamily:'monospace', fontSize:8, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(45,31,21,0.5)' }}>Check-out</div><div style={{ fontWeight:600, fontSize:12, marginTop:1 }}>{fmtDate(form.dateTo)}{form.hotelCo ? ', '+form.hotelCo : ', 11:00'}</div></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (() => {
            const cats = [
              { key:'costFlight', icon:'Plane',    label:'Flüge',       bg:'#D7E2C6', show: form.type==='flight' },
              { key:'costHotel',  icon:'Building2',label:'Unterkunft',  bg:'#F8DEC4', show: true },
              { key:'costRental', icon:'Car',      label:'Mietwagen',   bg:'rgba(45,31,21,0.06)', show: form.rental },
              { key:'costOther',  icon:'Euro',     label:'Sonstiges',   bg:'#E8D2DC', show: true },
            ].filter(c => c.show);
            const totalCost = cats.reduce((s,cat) => s + (parseInt(form[cat.key])||0), 0);
            const paidAmt   = parseInt(form.paid)||0;
            return (
              <div style={{ display:'flex', flexDirection:'column', gap:14, paddingBottom:16 }}>
                <div>
                  <span style={labelStyle}>Kosten aufschlüsseln</span>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {cats.map(cat => (
                      <div key={cat.key} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Ic name={cat.icon} size={16} color="#5A4533" />
                        </div>
                        <span style={{ fontSize:13, fontWeight:500, width:90, flexShrink:0 }}>{cat.label}</span>
                        <div style={{ position:'relative', flex:1 }}>
                          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9F8A6F', fontFamily:'Georgia,serif', fontSize:14 }}>€</span>
                          <input
                            style={{ ...inputStyle, paddingLeft:24, paddingTop:9, paddingBottom:9, fontSize:13 }}
                            type="number" placeholder="0"
                            value={form[cat.key]}
                            onChange={e => set(cat.key, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {totalCost > 0 && (
                  <>
                    <div style={{ ...S.card, background:'#2D1F15', color:'#FBF4E6' }}>
                      <div style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(251,244,230,0.5)', marginBottom:8 }}>Gesamt</div>
                      <div style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:600 }}>€ {totalCost.toLocaleString('de-AT')}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 12px', marginTop:8 }}>
                        {cats.filter(cat => parseInt(form[cat.key])>0).map(cat => (
                          <span key={cat.key} style={{ fontFamily:'monospace', fontSize:10, color:'rgba(251,244,230,0.6)' }}>
                            {cat.label} € {parseInt(form[cat.key]).toLocaleString('de-AT')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span style={labelStyle}>Bereits bezahlt (€)</span>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9F8A6F', fontFamily:'Georgia,serif', fontSize:16 }}>€</span>
                        <input style={{ ...inputStyle, paddingLeft:30 }} type="number" placeholder="0" value={form.paid} onChange={e => set('paid', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ ...S.card, background:'rgba(45,31,21,0.04)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                        <span style={{ fontSize:13, color:'#5B7148' }}>Bezahlt</span>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:14, fontWeight:600, color:'#5B7148' }}>€ {paidAmt.toLocaleString('de-AT')}</span>
                      </div>
                      <Progress pct={(paidAmt/totalCost)*100} />
                      <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                        <span style={{ fontSize:13, color:'#C47A2C' }}>Offen</span>
                        <span style={{ fontFamily:'Georgia,serif', fontSize:14, fontWeight:600, color:'#C47A2C' }}>€ {Math.max(0, totalCost-paidAmt).toLocaleString('de-AT')}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>

        <div style={{ padding:'12px 18px 32px', display:'flex', gap:10, flexShrink:0, borderTop:'1px solid rgba(45,31,21,0.07)' }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s-1)}
              style={{ ...S.btn, padding:'12px 16px', background:'rgba(45,31,21,0.06)', color:'#2D1F15', fontSize:14 }}>
              <Ic name="ChevronLeft" size={16} color="#2D1F15" />
            </button>
          )}
          {step < STEPS
            ? <button onClick={() => setStep(s => s+1)} disabled={step===1 && !canNext1}
                style={{ ...S.btn, flex:1, height:50, background: (step===1 && !canNext1) ? '#EADFC4' : '#C96F4A', color: (step===1 && !canNext1) ? '#9F8A6F' : '#FBF4E6', fontSize:14, cursor:(step===1&&!canNext1)?'default':'pointer', boxShadow:(step===1&&!canNext1)?'none':'0 5px 12px rgba(201,111,74,0.35)' }}>
                Weiter <Ic name="ChevronRight" size={16} color={(step===1&&!canNext1)?'#9F8A6F':'#FBF4E6'} />
              </button>
            : <button onClick={handleSave} disabled={!canSave}
                style={{ ...S.btn, flex:1, height:50, background: canSave ? '#C96F4A' : '#EADFC4', color: canSave ? '#FBF4E6' : '#9F8A6F', fontSize:14, cursor:canSave?'pointer':'default', boxShadow:canSave?'0 5px 12px rgba(201,111,74,0.35)':'none' }}>
                <Ic name="Check" size={16} color={canSave?'#FBF4E6':'#9F8A6F'} /> {isEdit ? 'Änderungen speichern' : 'Reise speichern'}
              </button>
          }
        </div>
      </div>
    </>
  );
}
