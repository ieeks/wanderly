import { useState } from 'react';
import Ic from '../components/Ic.jsx';
import TabBar from '../components/TabBar.jsx';
import WanderlyLogo from '../components/WanderlyLogo.jsx';
import FamilyEditSheet from '../components/FamilyEditSheet.jsx';
import { S } from '../styles/shared.js';

export default function MeScreen({ onTab, inboxBadge = 0, family, onEditPerson }) {
  const [editPerson, setEditPerson] = useState(null);
  const sections = [
    { title:"Konto", rows:[
      { icon:"User",      bg:"#D7E2C6", label:"Manuel",               detail:"manuel@wanderly.app" },
      { icon:"Bell",      bg:"#F8DEC4", label:"Benachrichtigungen",   detail:"Push & E-Mail" },
      { icon:"Globe",     bg:"#D2E2EA", label:"Sprache & Region",     detail:"Deutsch (AT)" },
    ]},
    { title:"Daten", rows:[
      { icon:"Mail",      bg:"#F5EAD4", label:"Gmail verbunden",      detail:"manuel.rechnungen@gmail.com" },
      { icon:"RefreshCw", bg:"#F5EAD4", label:"Letzter Sync",         detail:"vor 4 Min" },
      { icon:"Database",  bg:"#F5EAD4", label:"Gespeicherte Trips",   detail:"4 Reisen · 38 Dokumente" },
    ]},
    { title:"App", rows:[
      { icon:"Palette",   bg:"#F5EAD4", label:"Design",               detail:"Warm · Serif" },
      { icon:"Info",      bg:"#F5EAD4", label:"wanderly v2.1.0",      detail:"" },
    ]},
  ];
  return (
    <div style={S.screen}>
      <div style={{ ...S.scroll, paddingTop:56, paddingBottom:110 }}>
        <div style={{ ...S.px, marginBottom:4, marginTop:4 }}>
          <WanderlyLogo size={28} showWordmark={true} />
        </div>

        <div style={{ ...S.px, display:"flex", gap:14, alignItems:"center", marginBottom:20 }}>
          <div style={{ ...S.avatar("#F0B58A","#2D1F15"), width:56, height:56, fontSize:22 }}>M</div>
          <div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:600 }}>Manuel</div>
            <div style={{ fontFamily:"monospace", fontSize:10, color:"#9F8A6F", marginTop:2 }}>Wien, AT</div>
            <div style={{ display:"flex", gap:6, marginTop:6 }}>
              {[["Star","#E6B545","Pro"],["Plane","#7BA8B8","4 Trips"]].map(([icon,c,lbl])=>(
                <div key={lbl} style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px", borderRadius:999, background:"rgba(45,31,21,0.07)", fontSize:9, fontWeight:600 }}><Ic name={icon} size={10} color={c} />{lbl}</div>
              ))}
            </div>
          </div>
        </div>
        {sections.map((sec,si) => (
          <div key={si} style={{ marginBottom:18 }}>
            <div style={{ ...S.px, fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"#5A4533", marginBottom:7 }}>{sec.title}</div>
            <div style={{ background:"#FFFAF1", borderRadius:18, margin:"0 18px", overflow:"hidden", boxShadow:"0 3px 10px rgba(45,31,21,0.05)" }}>
              {sec.rows.map((row,ri) => (
                <div key={ri} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom:ri<sec.rows.length-1?"1px solid rgba(45,31,21,0.06)":"none", cursor:"pointer" }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:row.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Ic name={row.icon} size={15} color="#5A4533" /></div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{row.label}</div>
                    {row.detail && <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F", marginTop:1 }}>{row.detail}</div>}
                  </div>
                  <Ic name="ChevronRight" size={15} color="rgba(45,31,21,0.22)" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginBottom:18 }}>
          <div style={{ ...S.px, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
            <span style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"#5A4533" }}>Reisende</span>
            <div onClick={() => setEditPerson('new')} style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer" }}>
              <Ic name="UserPlus" size={14} color="#C96F4A" />
              <span style={{ fontFamily:"monospace", fontSize:9, color:"#C96F4A", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>hinzufügen</span>
            </div>
          </div>
          <div style={{ background:"#FFFAF1", borderRadius:18, margin:"0 18px", overflow:"hidden", boxShadow:"0 3px 10px rgba(45,31,21,0.05)" }}>
            {family.map((p, pi) => (
              <div key={p.id} onClick={() => setEditPerson(p)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderBottom: pi<family.length-1 ? "1px solid rgba(45,31,21,0.06)" : "none", cursor:"pointer" }}>
                <div style={{ ...S.avatar(p.bg, p.fg), width:36, height:36, fontSize:14, boxShadow:"0 0 0 2px rgba(255,255,255,0.85)" }}>{p.init[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
                  <div style={{ fontFamily:"monospace", fontSize:10, color:"#9F8A6F", marginTop:1 }}>Initiale: {p.init}</div>
                </div>
                <Ic name="ChevronRight" size={15} color="rgba(45,31,21,0.22)" />
              </div>
            ))}
          </div>
        </div>

        {editPerson && (
          <FamilyEditSheet
            person={editPerson === 'new' ? null : editPerson}
            onClose={() => setEditPerson(null)}
            onSave={p => { onEditPerson(p); setEditPerson(null); }}
            onDelete={id => { onEditPerson(null, id); setEditPerson(null); }}
          />
        )}
      </div>
      <TabBar active="me" onChange={onTab} badges={{ inbox: inboxBadge }} />
    </div>
  );
}
