import Ic from './Ic.jsx';
import { useSwipeDown } from '../hooks/useSwipeDown.js';

export default function DocsSheet({ trip, onClose }) {
  const { sheetEl, onTouchStart, onTouchMove, onTouchEnd } = useSwipeDown(onClose);
  const docs = [
    { id:1, type:"Flugticket",          file:"FR180_VIE_SKG.pdf",        size:"284 KB", date:"15 Mär", icon:"Plane",     bg:"#D7E2C6", status:"bestätigt" },
    { id:2, type:"Buchungsbestätigung", file:"Potidea_Palace_conf.pdf",  size:"156 KB", date:"12 Feb", icon:"Building2", bg:"#F8DEC4", status:"bestätigt" },
    { id:3, type:"Versicherungspolice", file:"Europaeische_2026.pdf",    size:"512 KB", date:"10 Apr", icon:"Shield",    bg:"#F5EAD4", status:"aktiv" },
    { id:4, type:"Mietwagen",           file:"noch nicht vorhanden",     size:null,     date:null,     icon:"Car",       bg:"rgba(45,31,21,0.05)", status:"offen" },
  ];
  return (
    <>
      <div style={{ position:"absolute", inset:0, background:"rgba(45,31,21,0.45)", zIndex:30 }} onClick={onClose} />
      <div ref={sheetEl} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ position:"absolute", left:0, right:0, bottom:0, background:"#FFFAF1", borderTopLeftRadius:26, borderTopRightRadius:26, padding:"10px 0 34px", boxShadow:"0 -8px 28px rgba(45,31,21,0.16)", zIndex:31 }}>
        <div style={{ width:36, height:4, borderRadius:2, background:"rgba(45,31,21,0.16)", margin:"0 auto 14px" }} />
        <div style={{ padding:"0 18px 14px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>{trip.name} · Dokumente</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600, marginTop:2 }}>Reiseunterlagen</div>
          </div>
          <div style={{ cursor:"pointer" }} onClick={onClose}><Ic name="X" size={20} color="#9F8A6F" /></div>
        </div>

        {docs.map((doc, i) => {
          const missing = !doc.size;
          return (
            <div key={doc.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 18px", borderTop: i===0 ? "1px solid rgba(45,31,21,0.07)" : "none", borderBottom:"1px solid rgba(45,31,21,0.07)", opacity: missing ? 0.5 : 1 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:doc.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ic name={doc.icon} size={18} color="#5A4533" />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{doc.type}</div>
                <div style={{ fontFamily:"monospace", fontSize:10, color:"#9F8A6F", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.file}</div>
                {!missing && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"1px 6px", borderRadius:999, background: doc.status==="aktiv"||doc.status==="bestätigt" ? "rgba(91,113,72,0.12)" : "rgba(196,122,44,0.12)", fontSize:9, fontWeight:600, color: doc.status==="aktiv"||doc.status==="bestätigt" ? "#5B7148" : "#C47A2C" }}>
                      <Ic name={doc.status==="offen" ? "Clock" : "FileCheck"} size={9} color={doc.status==="offen" ? "#C47A2C" : "#5B7148"} />
                      {doc.status}
                    </span>
                    <span style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>{doc.size} · {doc.date}</span>
                  </div>
                )}
              </div>
              {missing
                ? <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:999, border:"1.5px dashed #D9C9A8", fontSize:11, fontWeight:600, color:"#C96F4A", cursor:"pointer" }}><Ic name="Plus" size={12} color="#C96F4A" />hinzufügen</div>
                : <div style={{ display:"flex", gap:6 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(45,31,21,0.06)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Ic name="QrCode" size={14} color="#5A4533" /></div>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(45,31,21,0.06)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Ic name="Download" size={14} color="#5A4533" /></div>
                  </div>
              }
            </div>
          );
        })}

        <div style={{ padding:"14px 18px 0", display:"flex", gap:10 }}>
          <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"12px", borderRadius:16, background:"rgba(45,31,21,0.06)", border:"none", fontFamily:"inherit", fontWeight:700, fontSize:13, cursor:"pointer", color:"#2D1F15" }}>
            <Ic name="FileText" size={14} color="#2D1F15" />Alle exportieren
          </button>
        </div>
      </div>
    </>
  );
}
