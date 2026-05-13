import { useState } from 'react';
import Ic from '../components/Ic.jsx';
import ActivitySheet from '../components/ActivitySheet.jsx';
import { S } from '../styles/shared.js';

function buildDays(trip) {
  const DE_DAYS   = ['So','Mo','Di','Mi','Do','Fr','Sa'];
  const DE_MONTHS = ['Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  const months = {Jan:0,Feb:1,Mar:2,Mrz:2,Apr:3,Mai:4,Jun:5,Jul:6,Aug:7,Sep:8,Okt:9,Nov:10,Dez:11};
  function parseStart(dates) {
    if (!dates) return null;
    if (dates.match(/^\d{4}-\d{2}-\d{2}/)) return new Date(dates + 'T12:00:00');
    const dm = dates.match(/(\d+)[^\d]/);
    const mo = dates.match(/([A-Za-z]{3,})/);
    if (!dm || !mo) return null;
    return new Date(2026, months[mo[1]]||0, parseInt(dm[1]));
  }
  const nm = trip.short && trip.short.match(/(\d+)/);
  const nights = nm ? parseInt(nm[1]) : 3;
  const start = parseStart(trip.dates);
  if (!start) return trip.itinerary || [];
  const days = [];
  for (let i = 0; i <= nights; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const lbl = `${DE_DAYS[d.getDay()]} ${d.getDate()} ${DE_MONTHS[d.getMonth()]}`;
    const existing = (trip.itinerary || []).find(x => x.day === lbl);
    days.push({ day: lbl, items: existing?.items || [] });
  }
  return days;
}

export default function ItineraryScreen({ tripId, trips, onBack, onUpdateTrip }) {
  const trip = trips.find(t => t.id === tripId);
  const [days, setDays]   = useState(() => buildDays(trip || {}));
  const [sheet, setSheet] = useState(null);
  if (!trip) return null;

  function saveActivity(dayIdx, itemIdx, newItem) {
    const updated = days.map((day, di) => {
      if (di !== dayIdx) return day;
      const items = itemIdx === null
        ? [...day.items, newItem]
        : day.items.map((it, ii) => ii === itemIdx ? newItem : it);
      return { ...day, items: [...items].sort((a,b) => (!a.time?1:!b.time?-1:a.time.localeCompare(b.time))) };
    });
    setDays(updated);
    onUpdateTrip({ ...trip, itinerary: updated });
    setSheet(null);
  }

  function deleteActivity(dayIdx, itemIdx) {
    const updated = days.map((day, di) =>
      di !== dayIdx ? day : { ...day, items: day.items.filter((_,ii) => ii !== itemIdx) }
    );
    setDays(updated);
    onUpdateTrip({ ...trip, itinerary: updated });
    setSheet(null);
  }

  const activeDay  = sheet !== null ? days[sheet.dayIdx] : null;
  const activeItem = sheet !== null && sheet.itemIdx !== null ? activeDay?.items[sheet.itemIdx] : null;

  return (
    <div style={S.screen}>
      <div style={{ ...S.scroll, paddingTop:52, paddingBottom:30 }}>
        <div style={{ ...S.px, display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
          <div style={S.pill} onClick={onBack}><Ic name="ChevronLeft" size={18} color="#2D1F15" /></div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#9F8A6F" }}>{trip.name} · {trip.dates}</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:600, marginTop:1 }}>Tagesplan</div>
          </div>
        </div>

        {days.map((day, di) => (
          <div key={di} style={{ marginBottom:22 }}>
            <div style={{ ...S.px, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#9F8A6F" }}>{day.day}</span>
              <div onClick={() => setSheet({ dayIdx:di, itemIdx:null })}
                style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer", padding:"3px 10px", borderRadius:999, background:"rgba(201,111,74,0.1)" }}>
                <Ic name="Plus" size={11} color="#C96F4A" />
                <span style={{ fontFamily:"monospace", fontSize:9, color:"#C96F4A", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>hinzufügen</span>
              </div>
            </div>

            {day.items.length === 0 ? (
              <div style={{ ...S.px }}>
                <div onClick={() => setSheet({ dayIdx:di, itemIdx:null })}
                  style={{ padding:"14px", borderRadius:14, background:"rgba(45,31,21,0.03)", border:"1.5px dashed #EADFC4", textAlign:"center", cursor:"pointer" }}>
                  <span style={{ fontSize:12, color:"#C96F4A", fontWeight:500 }}>+ erste Aktivität hinzufügen</span>
                </div>
              </div>
            ) : (
              day.items.map((item, ii) => (
                <div key={ii} onClick={() => setSheet({ dayIdx:di, itemIdx:ii })}
                  style={{ display:"flex", gap:10, padding:"8px 18px", cursor:"pointer" }}>
                  <div style={{ width:36, fontFamily:"monospace", fontSize:10, color:"#9F8A6F", paddingTop:4, flexShrink:0 }}>{item.time}</div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", border:`2px solid ${ii===0?trip.accent:"#D9C9A8"}`, background:"#FBF4E6", marginTop:4 }} />
                    {ii < day.items.length-1 && <div style={{ flex:1, width:1.5, background:"rgba(45,31,21,0.1)", marginTop:3, minHeight:20 }} />}
                  </div>
                  <div style={{ flex:1, paddingBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <div style={{ width:26, height:26, borderRadius:8, background:"rgba(45,31,21,0.06)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Ic name={item.icon||"MapPin"} size={13} color={trip.accent} />
                      </div>
                      <span style={{ fontWeight:600, fontSize:13, flex:1 }}>{item.label}</span>
                      <Ic name="ChevronRight" size={13} color="rgba(45,31,21,0.25)" />
                    </div>
                    {item.sub && <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F", paddingLeft:34 }}>{item.sub}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {sheet !== null && (
        <ActivitySheet
          activity={activeItem}
          dayLabel={activeDay?.day || ''}
          onClose={() => setSheet(null)}
          onSave={item => saveActivity(sheet.dayIdx, sheet.itemIdx, item)}
          onDelete={() => deleteActivity(sheet.dayIdx, sheet.itemIdx)}
        />
      )}
    </div>
  );
}
