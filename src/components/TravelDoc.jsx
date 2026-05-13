import Ic from './Ic.jsx';
import { S } from '../styles/shared.js';
import { FAMILY } from '../data/mockData.js';

export default function TravelDoc({ trip, family }) {
  const fam = family || FAMILY;
  const passBase = { ...S.pass };

  if (trip.flight) {
    const f = trip.flight;
    return (
      <div style={{ ...passBase, background:"linear-gradient(180deg,#F4C9A5,#ECAE84)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 0" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:36, letterSpacing:"-0.03em" }}>{f.from}</div>
            <div style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,31,21,0.6)", marginTop:3 }}>{f.fromCity}</div>
          </div>
          <div style={{ flex:1, display:"flex", alignItems:"center", padding:"0 12px" }}>
            <div style={{ flex:1, height:1.5, background:"rgba(45,31,21,0.3)" }} />
            <div style={{ padding:"0 8px" }}><Ic name="Plane" size={18} color="rgba(45,31,21,0.6)" /></div>
            <div style={{ flex:1, height:1.5, background:"rgba(45,31,21,0.3)" }} />
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:36, letterSpacing:"-0.03em" }}>{f.to}</div>
            <div style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,31,21,0.6)", marginTop:3 }}>{f.toCity}</div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 20px 14px" }}>
          {[["Datum",f.date],["Flug",f.no],["Ab / An",`${f.depart} / ${f.arrive}`]].map(([k,v],i) => (
            <div key={i} style={{ textAlign: i===2 ? "right" : i===1 ? "center" : "left" }}>
              <div style={{ fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,31,21,0.5)" }}>{k}</div>
              <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ position:"relative", borderTop:"2px dashed rgba(45,31,21,0.25)" }}>
          <div style={{ position:"absolute", top:-10, left:-10, width:20, height:20, borderRadius:"50%", background:"#FBF4E6" }} />
          <div style={{ position:"absolute", top:-10, right:-10, width:20, height:20, borderRadius:"50%", background:"#FBF4E6" }} />
        </div>
        <div style={{ padding:"14px 20px 18px" }}>
          {fam.map(fp => (
            <div key={fp.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px dashed rgba(45,31,21,0.15)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:500 }}>
                <div style={S.avatar(fp.bg, fp.fg)}>{fp.init[0]}</div>
                {fp.name}
                {fp.extra && <span style={{ fontSize:9, color:"rgba(45,31,21,0.5)", fontFamily:"monospace" }}>· {fp.extra}</span>}
              </div>
              <span style={{ fontFamily:"monospace", fontSize:12, color:"#5A4533" }}>{fp.seat1} / {fp.seat2}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trip.train) {
    const t = trip.train;
    return (
      <div style={{ ...passBase, background:"linear-gradient(180deg,#D2E2EA,#94B5C2)", boxShadow:"0 14px 36px rgba(67,107,124,0.26)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 0" }}>
          <div style={{ textAlign:"center" }}><div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:22 }}>Wien</div><div style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(45,31,21,0.6)", marginTop:2 }}>Hbf</div></div>
          <div style={{ flex:1, display:"flex", alignItems:"center", padding:"0 12px" }}><div style={{ flex:1, height:1.5, background:"rgba(45,31,21,0.3)" }} /><div style={{ padding:"0 8px" }}><Ic name="Train" size={18} color="rgba(45,31,21,0.6)" /></div><div style={{ flex:1, height:1.5, background:"rgba(45,31,21,0.3)" }} /></div>
          <div style={{ textAlign:"center" }}><div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:22 }}>St. Anton</div><div style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(45,31,21,0.6)", marginTop:2 }}>Bahnhof</div></div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 20px 14px" }}>
          {[["Datum",t.date],["Zug",t.no],["Ab → An",`${t.depart} → ${t.arrive}`]].map(([k,v],i) => (
            <div key={i} style={{ textAlign: i===2?"right":i===1?"center":"left" }}>
              <div style={{ fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,31,21,0.5)" }}>{k}</div>
              <div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ position:"relative", borderTop:"2px dashed rgba(45,31,21,0.25)" }}>
          <div style={{ position:"absolute", top:-10, left:-10, width:20, height:20, borderRadius:"50%", background:"#FBF4E6" }} />
          <div style={{ position:"absolute", top:-10, right:-10, width:20, height:20, borderRadius:"50%", background:"#FBF4E6" }} />
        </div>
        <div style={{ padding:"14px 20px 18px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px dashed rgba(45,31,21,0.15)", fontWeight:600, fontSize:12 }}>
            <span>Wagen {t.wagon} · Sitze</span><span style={{ fontFamily:"monospace" }}>{t.seats}</span>
          </div>
          {fam.map(fp => (
            <div key={fp.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px dashed rgba(45,31,21,0.15)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}><div style={S.avatar(fp.bg,fp.fg)}>{fp.init[0]}</div>{fp.name}</div>
              <span style={{ fontFamily:"monospace", fontSize:11, color:"#5A4533" }}>2. Klasse</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trip.drive) {
    const d = trip.drive;
    return (
      <div style={{ ...passBase, background:"linear-gradient(180deg,#EFD8E1,#C9A3B4)", boxShadow:"0 14px 36px rgba(156,99,119,0.26)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 0" }}>
          <div style={{ textAlign:"center" }}><div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:28 }}>{d.from}</div><div style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(45,31,21,0.6)", marginTop:2 }}>start</div></div>
          <div style={{ flex:1, display:"flex", alignItems:"center", padding:"0 12px" }}><div style={{ flex:1, height:1.5, background:"rgba(45,31,21,0.3)" }} /><div style={{ padding:"0 8px" }}><Ic name="Car" size={18} color="rgba(45,31,21,0.6)" /></div><div style={{ flex:1, height:1.5, background:"rgba(45,31,21,0.3)" }} /></div>
          <div style={{ textAlign:"center" }}><div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:28 }}>{d.to}</div><div style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(45,31,21,0.6)", marginTop:2 }}>arrive</div></div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 20px 14px" }}>
          {[["Abfahrt",d.date],["Distanz",`${d.km} km`],["Fahrzeit",d.time]].map(([k,v],i) => (
            <div key={i} style={{ textAlign:i===2?"right":i===1?"center":"left" }}>
              <div style={{ fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,31,21,0.5)" }}>{k}</div>
              <div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ position:"relative", borderTop:"2px dashed rgba(45,31,21,0.25)" }}>
          <div style={{ position:"absolute", top:-10, left:-10, width:20, height:20, borderRadius:"50%", background:"#FBF4E6" }} />
          <div style={{ position:"absolute", top:-10, right:-10, width:20, height:20, borderRadius:"50%", background:"#FBF4E6" }} />
        </div>
        <div style={{ padding:"14px 20px 18px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px dashed rgba(45,31,21,0.15)", fontWeight:600, fontSize:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><Ic name="Zap" size={13} color="#C96F4A" />BYD Seal U</div>
            <span style={{ fontFamily:"monospace" }}>W-??-BEV</span>
          </div>
          {fam.map(fp => (
            <div key={fp.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px dashed rgba(45,31,21,0.15)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}><div style={S.avatar(fp.bg,fp.fg)}>{fp.init[0]}</div>{fp.name}</div>
              <span style={{ fontFamily:"monospace", fontSize:11, color:"#5A4533" }}>{fp.id==="mn"?"Fahrer":"Mitfahrer"}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
