import { useState } from 'react';
import Ic from '../components/Ic.jsx';
import TravelDoc from '../components/TravelDoc.jsx';
import Progress from '../components/Progress.jsx';
import { S } from '../styles/shared.js';

function SunGlow({ right, top }) {
  return <div style={{ position:"absolute", pointerEvents:"none", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(230,181,69,0.5) 0%,rgba(240,181,138,0.3) 40%,transparent 70%)", filter:"blur(2px)", right, top }} />;
}

export default function TripDetail({ tripId, trips, family, onBack, onShare, onItinerary, onDocs, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const trip = trips.find(t => t.id === tripId) || trips[0];
  return (
    <div style={S.screen}>
      <SunGlow right={-70} top={30} />
      <div style={{ ...S.scroll, paddingTop:50, paddingBottom:100 }}>
        <div style={{ ...S.px, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={S.pill} onClick={onBack}><Ic name="ChevronLeft" size={18} color="#2D1F15" /></div>
          <div style={{ display:"flex", gap:8, position:"relative" }}>
            <div style={S.pill} onClick={onShare}><Ic name="Share2" size={16} color="#2D1F15" /></div>
            <div style={S.pill} onClick={() => setShowMenu(m=>!m)}><Ic name="MoreHorizontal" size={16} color="#2D1F15" /></div>
            {showMenu && (
              <div style={{ position:"absolute", top:42, right:0, background:"#FFFAF1", borderRadius:16, boxShadow:"0 8px 24px rgba(45,31,21,0.18)", overflow:"hidden", minWidth:160, zIndex:20 }}>
                <div onClick={()=>{setShowMenu(false); onEdit&&onEdit(trip);}} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderBottom:"1px solid rgba(45,31,21,0.07)", cursor:"pointer" }}>
                  <Ic name="Edit2" size={15} color="#5A4533" /><span style={{ fontSize:14, fontWeight:500 }}>Bearbeiten</span>
                </div>
                <div onClick={()=>{setShowMenu(false); onDelete&&onDelete(trip);}} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", cursor:"pointer" }}>
                  <Ic name="Trash2" size={15} color="#C42C2C" /><span style={{ fontSize:14, fontWeight:500, color:"#C42C2C" }}>Löschen</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ ...S.px, marginBottom:16 }}>
          <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>{trip.dates} 2026</div>
          <div style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:40, lineHeight:1, marginTop:4, letterSpacing:"-0.025em" }}>{trip.name} <span style={{ fontSize:30 }}>{trip.emoji}</span></div>
          <div style={{ fontFamily:"monospace", fontSize:10, color:"#9F8A6F", marginTop:5, letterSpacing:"0.05em" }}>{trip.route} · {trip.short}</div>
        </div>

        <TravelDoc trip={trip} family={family} />

        <div style={{ ...S.px, marginTop:16 }}>
          <div style={{ ...S.card, background:"#F8DEC4" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}><Ic name="Building2" size={12} color="#5A4533" /><span style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", color:"#5A4533" }}>Hotel · Booking</span></div>
              {trip.due > 0 && <span style={{ ...S.chip, color:"#9C4A28", background:"rgba(196,122,44,0.14)", border:"1px solid rgba(196,122,44,0.25)", fontSize:10 }}><Ic name="Clock" size={10} color="#9C4A28" />{trip.dueDate}</span>}
            </div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600, marginTop:8, lineHeight:1.1 }}>{trip.hotel?.name}</div>
            <div style={{ fontFamily:"monospace", fontSize:10, color:"rgba(45,31,21,0.6)", marginTop:3 }}>{trip.hotel?.loc}</div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:12 }}>
              <div><div style={{ fontFamily:"monospace", fontSize:8, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(45,31,21,0.5)" }}>Check-in</div><div style={{ fontWeight:600, fontSize:12, marginTop:2 }}>{trip.hotel?.ci}</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontFamily:"monospace", fontSize:8, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(45,31,21,0.5)" }}>Check-out</div><div style={{ fontWeight:600, fontSize:12, marginTop:2 }}>{trip.hotel?.co}</div></div>
            </div>
          </div>
        </div>

        <div style={{ ...S.px, display:"flex", gap:10, marginTop:10 }}>
          {trip.extras?.insurance && (
            <div style={{ ...S.card, flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><Ic name="Shield" size={11} color="#5A4533" /><span style={{ fontFamily:"monospace", fontSize:8, textTransform:"uppercase", letterSpacing:"0.08em", color:"#5A4533" }}>Versicherung</span></div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:600, marginTop:5 }}>Europäische</div>
              <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>Komplett · 4 Pax</div>
            </div>
          )}
          {trip.extras?.rental === "pending" && (
            <div style={{ ...S.card, flex:1, background:"rgba(255,255,255,0.5)", border:"1.5px dashed #D9C9A8" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><Ic name="Car" size={11} color="#9F8A6F" /><span style={{ fontFamily:"monospace", fontSize:8, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9F8A6F" }}>Mietwagen</span></div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:600, marginTop:5, color:"#9F8A6F" }}>offen</div>
              <div style={{ fontFamily:"monospace", fontSize:9, color:"#C96F4A", fontWeight:600 }}>+ buchen</div>
            </div>
          )}
          {trip.extras?.skipass && (
            <div style={{ ...S.card, flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><Ic name="MountainSnow" size={11} color="#5A4533" /><span style={{ fontFamily:"monospace", fontSize:8, textTransform:"uppercase", letterSpacing:"0.08em", color:"#5A4533" }}>Skipass</span></div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, marginTop:5, lineHeight:1.2 }}>Arlberg 5-Tage</div>
              <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>4 Pax · reserviert</div>
            </div>
          )}
          {trip.extras?.restaurant && (
            <div style={{ ...S.card, flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><Ic name="UtensilsCrossed" size={11} color="#5A4533" /><span style={{ fontFamily:"monospace", fontSize:8, textTransform:"uppercase", letterSpacing:"0.08em", color:"#5A4533" }}>Restaurant</span></div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, marginTop:5, lineHeight:1.2 }}>Florianihof</div>
              <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>So 19:00 · 4 Pers</div>
            </div>
          )}
        </div>

        <div style={{ ...S.px, marginTop:10 }}>
          <div style={{ ...S.card, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }} onClick={() => onItinerary(trip.id)}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><Ic name="CalendarDays" size={12} color="#5A4533" /><span style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:"#5A4533" }}>Tagesplan</span></div>
              <div style={{ fontWeight:600, fontSize:14, marginTop:4 }}>{trip.itinerary?.length || 0} Tage · {(trip.itinerary||[]).reduce((a,d)=>a+d.items.length,0)} Aktivitäten</div>
            </div>
            <Ic name="ChevronRight" size={18} color="#9F8A6F" />
          </div>
        </div>

        <div style={{ ...S.px, marginTop:16 }}>
          <div style={{ ...S.card, background:"#2D1F15", color:"#FBF4E6" }}>
            <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(251,244,230,0.5)" }}>Gesamt</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:600, marginTop:4 }}>€ {trip.total.toLocaleString("de-AT")}</div>
            {(trip.costFlight || trip.costHotel || trip.costRental || trip.costOther) && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 16px", marginTop:10, paddingTop:10, borderTop:"1px solid rgba(251,244,230,0.1)" }}>
                {[
                  { key:"costFlight", icon:"Plane",      label:"Flüge"      },
                  { key:"costHotel",  icon:"Building2",  label:"Unterkunft" },
                  { key:"costRental", icon:"Car",         label:"Mietwagen"  },
                  { key:"costOther",  icon:"DollarSign",  label:"Sonstiges"  },
                ].filter(cat => trip[cat.key] && parseInt(trip[cat.key]) > 0).map(cat => (
                  <div key={cat.key} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <Ic name={cat.icon} size={11} color="rgba(251,244,230,0.5)" />
                    <span style={{ fontFamily:"monospace", fontSize:10, color:"rgba(251,244,230,0.6)" }}>
                      {cat.label} € {parseInt(trip[cat.key]).toLocaleString("de-AT")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
              <span style={{ fontFamily:"monospace", fontSize:10, color:"rgba(251,244,230,0.65)" }}>€ {trip.paid.toLocaleString("de-AT")} paid</span>
              {trip.due > 0 && <span style={{ fontFamily:"monospace", fontSize:10, color:"#E6B545", fontWeight:600 }}>⏰ € {trip.due.toLocaleString("de-AT")} · {trip.dueDate}</span>}
            </div>
            <div style={{ marginTop:8 }}><Progress pct={(trip.paid/trip.total)*100} dark /></div>
          </div>
        </div>
      </div>

      <div style={{ position:"absolute", left:0, right:0, bottom:0, padding:"14px 18px 32px", background:"linear-gradient(180deg,transparent,#FBF4E6 35%)", display:"flex", gap:10, alignItems:"center" }}>
        <button style={{ ...S.btn, flex:1, display:"flex", height:50, background:"rgba(45,31,21,0.07)", color:"#2D1F15" }} onClick={onDocs}><Ic name="FolderOpen" size={15} color="#2D1F15" />Dokumente</button>
        <button style={{ ...S.btn, flex:2, display:"flex", height:50, background:"#C96F4A", color:"#FBF4E6", boxShadow:"0 5px 12px rgba(201,111,74,0.35)" }} onClick={onShare}><Ic name="Share2" size={15} color="#FBF4E6" />Teilen</button>
      </div>
    </div>
  );
}
