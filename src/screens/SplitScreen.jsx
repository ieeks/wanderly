import Ic from '../components/Ic.jsx';
import TabBar from '../components/TabBar.jsx';
import { S } from '../styles/shared.js';
import { FAMILY } from '../data/mockData.js';

export default function SplitScreen({ onTab, inboxBadge = 0, family }) {
  const fam = family || FAMILY;
  const lines = [
    { who:"Flüge Ibiza",       amt:872.50, payer:fam[0], date:"2 Apr",  icon:"Plane",          bg:"#F8DEC4" },
    { who:"Anzahl. Halkidiki", amt:912.17, payer:fam[1], date:"15 Mär", icon:"Building2",      bg:"#D7E2C6" },
    { who:"Flüge Halkidiki",   amt:656.28, payer:fam[0], date:"15 Mär", icon:"Plane",          bg:"#D7E2C6" },
    { who:"Versicherung 2026", amt:248.00, payer:fam[0], date:"10 Apr", icon:"Shield",         bg:"#F5EAD4" },
    { who:"Wachau Pension",    amt:320.00, payer:fam[1], date:"20 Mär", icon:"UtensilsCrossed",bg:"#E8D2DC" },
  ];
  return (
    <div style={S.screen}>
      <div style={{ ...S.scroll, paddingTop:56, paddingBottom:100 }}>
        <div style={{ ...S.px, display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>Familie · 2026</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:600, marginTop:2 }}>Split & Settle</div>
          </div>
          <div style={S.pill}><Ic name="Settings2" size={15} color="#2D1F15" /></div>
        </div>
        <div style={{ ...S.px, marginBottom:14 }}>
          <div style={{ background:"linear-gradient(160deg,#F8DEC4,#ECAE84)", borderRadius:24, padding:20, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-8, bottom:-16, fontSize:90, color:"rgba(45,31,21,0.06)", pointerEvents:"none" }}>✿</div>
            <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(45,31,21,0.6)" }}>Olga schuldet Manuel</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:44, fontWeight:600, marginTop:4 }}>€ 248,03</div>
            <div style={{ fontFamily:"monospace", fontSize:10, color:"rgba(45,31,21,0.6)", marginTop:3 }}>aus {lines.length} Buchungen · auto-parsed</div>
            <div style={{ display:"flex", gap:8, marginTop:14 }}>
              <button style={{ ...S.btn, flex:1, padding:"9px 12px", fontSize:12, background:"#C96F4A", color:"#FBF4E6", boxShadow:"0 4px 10px rgba(201,111,74,0.3)" }}><Ic name="Send" size={13} color="#FBF4E6" />an Olga</button>
              <button style={{ ...S.btn, padding:"9px 12px", fontSize:12, background:"rgba(255,255,255,0.5)", color:"#2D1F15" }}>beglichen</button>
            </div>
          </div>
        </div>
        <div style={{ ...S.px, display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:"#5A4533" }}>Ausgaben</span>
          <span style={{ fontFamily:"monospace", fontSize:10, color:"#9F8A6F" }}>{lines.length} Positionen</span>
        </div>
        <div style={{ ...S.px }}>
          <div style={{ ...S.card, padding:"4px 14px" }}>
            {lines.map((l,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom: i<lines.length-1?"1px solid #EADFC4":"none" }}>
                <div style={{ width:34, height:34, borderRadius:10, background:l.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Ic name={l.icon} size={15} color="#5A4533" /></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{l.who}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                    <div style={S.avatar(l.payer.bg,l.payer.fg)}>{l.payer.init[0]}</div>
                    <span style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>{l.payer.name} · {l.date}</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:600 }}>€ {l.amt.toFixed(2)}</div>
                  <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>50 / 50</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="split" onChange={onTab} badges={{ inbox: inboxBadge }} />
    </div>
  );
}
