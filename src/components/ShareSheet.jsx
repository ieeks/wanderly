import { useState } from 'react';
import Ic from './Ic.jsx';
import WanderlyLogo from './WanderlyLogo.jsx';
import { S } from '../styles/shared.js';

export default function ShareSheet({ trip, onClose, onSent }) {
  const [hidePrices, setHidePrices] = useState(true);
  const [expires, setExpires] = useState(true);
  const rows = [
    { cls:"#25D366", icon:"MessageCircle", label:"Olga · WhatsApp",    sub:"letzte Nachricht vor 2h",     who:"Olga" },
    { cls:"#25D366", icon:"Users",         label:"Familie",             sub:"WhatsApp Gruppe · 6",         who:"Familie" },
    { cls:"#7BA8B8", icon:"Mail",          label:"Oma & Opa",          sub:"oma@example.at",               who:"Oma & Opa" },
    { cls:"#5856D6", icon:"Wifi",          label:"AirDrop",            sub:"3 Geräte in der Nähe",         who:null },
    { cls:"#F5EAD4", icon:"Link2",         label:"Link kopieren",      sub:"wanderly.app/s/x7p2…",        who:null },
  ];
  return (
    <>
      <div style={{ position:"absolute", inset:0, background:"rgba(45,31,21,0.45)", zIndex:30 }} onClick={onClose} />
      <div style={{ position:"absolute", left:0, right:0, bottom:0, background:"#FFFAF1", borderTopLeftRadius:24, borderTopRightRadius:24, padding:"10px 18px 28px", boxShadow:"0 -8px 28px rgba(45,31,21,0.16)", zIndex:31 }}>
        <div style={{ width:36, height:4, borderRadius:2, background:"rgba(45,31,21,0.16)", margin:"0 auto 12px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>Teilen · read-only</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600, marginTop:2 }}>{trip.name} '26</div>
          </div>
          <div style={{ cursor:"pointer" }} onClick={onClose}><Ic name="X" size={20} color="#9F8A6F" /></div>
        </div>
        <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid #EADFC4", marginBottom:12 }}>
          <div style={{ height:80, background:trip.bg, display:"flex", alignItems:"space-between", justifyContent:"space-between", padding:"10px 12px", position:"relative" }}>
            <span style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600, color:"#2D1F15", alignSelf:"flex-end" }}>{trip.name} '26</span>
            <div style={{ position:"absolute", top:8, right:8, opacity:0.6 }}><WanderlyLogo size={20} /></div>
          </div>
          <div style={{ padding:"8px 12px 10px", background:"#FFFAF1" }}>
            <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F", letterSpacing:"0.08em" }}>wanderly.app/s/x7p2-{trip.id}</div>
            <div style={{ fontSize:12, fontWeight:600, marginTop:2 }}>{trip.route} · {trip.dates}</div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
          {[[`Preise verstecken`,hidePrices,setHidePrices],["Link läuft in 7 Tagen ab",expires,setExpires]].map(([label,on,set],i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13 }}>{label}</span>
              <div style={S.toggle(on)} onClick={() => set(v=>!v)}><div style={S.toggleKnob(on)} /></div>
            </div>
          ))}
        </div>
        {rows.map((r,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 4px", borderBottom: i<rows.length-1?"1px solid rgba(45,31,21,0.06)":"none", cursor:"pointer" }} onClick={() => r.who && onSent(r.who)}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:r.cls, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ic name={r.icon} size={17} color={r.cls==="#F5EAD4"?"#2D1F15":"white"} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{r.label}</div>
              <div style={{ fontSize:11, color:"#9F8A6F" }}>{r.sub}</div>
            </div>
            <Ic name="ChevronRight" size={15} color="rgba(45,31,21,0.25)" />
          </div>
        ))}
      </div>
    </>
  );
}
