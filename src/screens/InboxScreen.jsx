import Ic from '../components/Ic.jsx';
import TabBar from '../components/TabBar.jsx';
import { S } from '../styles/shared.js';
import { TAG_COLOR, TAG_NAME } from '../data/mockData.js';

export default function InboxScreen({ items, setItems, onTab, onOpenTrip }) {
  const unread = items.filter(i => !i.read).length;
  return (
    <div style={S.screen}>
      <div style={{ ...S.scroll, paddingTop:56, paddingBottom:100 }}>
        <div style={{ ...S.px, marginBottom:16 }}>
          <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>Automatisch geparst</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginTop:2 }}>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:30, letterSpacing:"-0.02em" }}>Posteingang</div>
            {unread > 0 && <span style={{ ...S.chip, color:"#9C4A28", background:"rgba(196,122,44,0.14)", border:"1px solid rgba(196,122,44,0.25)", fontSize:10 }}>{unread} neu</span>}
          </div>
        </div>
        <div style={{ background:"#FFFAF1", borderRadius:20, margin:"0 18px", overflow:"hidden", boxShadow:"0 3px 12px rgba(45,31,21,0.06)" }}>
          {items.map((item, i) => (
            <div key={item.id} onClick={() => { setItems(p=>p.map(x=>x.id===item.id?{...x,read:true}:x)); item.tag&&onOpenTrip(item.tag); }}
              style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 14px", borderBottom: i<items.length-1?"1px solid rgba(45,31,21,0.06)":"none", cursor:"pointer" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:item.read?"transparent":"#C96F4A", marginTop:7, flexShrink:0 }} />
              <div style={{ width:38, height:38, borderRadius:12, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ic name={item.icon} size={17} color="#5A4533" />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span style={{ fontWeight:item.read?500:700, fontSize:12 }}>{item.from}</span>
                  <span style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>{item.time}</span>
                </div>
                <div style={{ fontSize:12, fontWeight:item.read?400:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.subject}</div>
                <div style={{ fontSize:11, color:"#9F8A6F", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.preview}</div>
                {item.tag && <div style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:4, padding:"2px 7px", borderRadius:999, background:"rgba(45,31,21,0.06)", fontSize:9, fontWeight:600, color:TAG_COLOR[item.tag] }}><Ic name="Tag" size={9} color={TAG_COLOR[item.tag]} />{TAG_NAME[item.tag]}</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:14, fontFamily:"monospace", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,31,21,0.4)" }}>E-Mails aus Gmail automatisch erkannt</div>
      </div>
      <TabBar active="inbox" onChange={onTab} badges={{}} />
    </div>
  );
}
