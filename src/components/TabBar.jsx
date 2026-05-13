import Ic from './Ic.jsx';
import { S } from '../styles/shared.js';

export default function TabBar({ active, onChange, badges = {} }) {
  const tabs = [
    { id:"home",  icon:"Briefcase", label:"Trips"   },
    { id:"inbox", icon:"Inbox",     label:"Inbox"   },
    { id:"split", icon:"Users",     label:"Familie" },
    { id:"me",    icon:"CircleUser",label:"Ich"     },
  ];
  return (
    <div style={S.tabbar} className="tab-bar-pill">
      {tabs.map(t => {
        const on    = active === t.id;
        const badge = badges[t.id] || 0;
        return (
          <div key={t.id} onClick={() => onChange(t.id)}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 14px", borderRadius:20, cursor:"pointer", position:"relative", flex:1, background: on ? "rgba(201,111,74,0.1)" : "transparent", transition:"background 200ms" }}>
            <div style={{ position:"relative", display:"inline-flex" }}>
              <Ic name={t.icon} size={22} color={on ? "#C96F4A" : "#9F8A6F"} />
              {badge > 0 && (
                <div style={{
                  position:"absolute", top:-4, right:-6,
                  minWidth:16, height:16, borderRadius:999,
                  background:"#C96F4A", border:"2px solid #FBF4E6",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"0 3px",
                }}>
                  <span style={{ fontSize:9, fontWeight:800, color:"#FBF4E6", lineHeight:1 }}>
                    {badge > 9 ? "9+" : badge}
                  </span>
                </div>
              )}
            </div>
            <span style={{ fontSize:10, fontWeight:600, color: on ? "#C96F4A" : "#9F8A6F", letterSpacing:"0.04em" }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
