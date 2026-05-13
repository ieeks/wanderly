import { useState } from 'react';
import Ic from '../components/Ic.jsx';
import TabBar from '../components/TabBar.jsx';
import Progress from '../components/Progress.jsx';
import WanderlyLogo from '../components/WanderlyLogo.jsx';
import { S } from '../styles/shared.js';

function SunGlow({ right, top }) {
  return <div style={{ position:"absolute", pointerEvents:"none", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(230,181,69,0.5) 0%,rgba(240,181,138,0.3) 40%,transparent 70%)", filter:"blur(2px)", right, top }} />;
}

export default function HomeScreen({ trips, onOpenTrip, onTab, onAddTrip, inboxBadge = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const totalBudget = trips.reduce((a,t) => a+t.total, 0);
  const totalPaid   = trips.reduce((a,t) => a+t.paid, 0);
  const totalDue    = trips.reduce((a,t) => a+t.due, 0);

  const sorted = [...trips].sort((a, b) => {
    const parseDate = d => {
      if (!d) return Infinity;
      if (d.match(/^\d{4}-\d{2}-\d{2}/)) return new Date(d).getTime();
      const months = { Jan:0,Feb:1,Mär:2,Mrz:2,Apr:3,Mai:4,Jun:5,Jul:6,Aug:7,Sep:8,Okt:9,Nov:10,Dez:11 };
      const m = d.match(/(\d+)[–\-].*?([A-Za-züä]+)/);
      if (m) return new Date(2026, months[m[2]]||0, parseInt(m[1])).getTime();
      return Infinity;
    };
    return parseDate(a.dates) - parseDate(b.dates);
  });

  const STACK_VISIBLE = 4;
  const TODAY_PROTO = new Date(2026, 4, 12);
  const upcoming = sorted.filter(t => {
    if (t.dates.match(/^\d{4}-\d{2}-\d{2}/)) return new Date(t.dates) >= TODAY_PROTO;
    const m = t.dates.match(/(\d+)[–\-].*?([A-Za-züä]+)/);
    if (!m) return true;
    const months = {Jan:0,Feb:1,Mär:2,Mrz:2,Apr:3,Mai:4,Jun:5,Jul:6,Aug:7,Sep:8,Okt:9,Nov:10,Dez:11};
    return new Date(2026, months[m[2]]||0, parseInt(m[1])) >= TODAY_PROTO;
  });
  const past = sorted.filter(t => !upcoming.includes(t));

  if (trips.length === 0) {
    return (
      <div style={S.screen}>
        <SunGlow right={-60} top={-40} />
        <div style={{ ...S.scroll, paddingTop:56, paddingBottom:100, display:"flex", flexDirection:"column" }}>
          <div style={{ ...S.px, marginBottom:0 }}>
            <WanderlyLogo size={38} showWordmark={true} />
          </div>

          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 32px 0", textAlign:"center" }}>
            <div style={{ marginBottom:28, position:"relative" }}>
              <WanderlyLogo size={90} />
              <div style={{ position:"absolute", top:-8, right:-12, fontSize:22 }}>✈</div>
              <div style={{ position:"absolute", bottom:-4, left:-14, fontSize:18 }}>🏖</div>
              <div style={{ position:"absolute", top:8, left:-20, fontSize:16 }}>🗺</div>
            </div>

            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-6px); }
              }
            `}</style>

            <div style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:26, letterSpacing:"-0.02em", color:"#2D1F15", marginBottom:10 }}>
              Noch keine Reisen
            </div>
            <div style={{ fontSize:14, color:"#9F8A6F", lineHeight:1.6, marginBottom:32, maxWidth:240 }}>
              Starte mit deiner ersten Reise und behalte Flüge, Hotels und Kosten im Blick.
            </div>

            <button onClick={onAddTrip} style={{ ...S.btn, background:"#C96F4A", color:"#FBF4E6", boxShadow:"0 8px 24px rgba(201,111,74,0.35)", padding:"15px 28px", fontSize:15, borderRadius:20, gap:10 }}>
              <Ic name="Plus" size={18} color="#FBF4E6" />
              Erste Reise anlegen
            </button>

            <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:10, background:"rgba(45,31,21,0.06)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ic name="Mail" size={13} color="#9F8A6F" />
              </div>
              <span style={{ fontSize:12, color:"#9F8A6F" }}>oder Gmail Sync aktivieren → automatisch</span>
            </div>
          </div>

          <div style={{ height:90 }} />
        </div>
        <TabBar active="home" onChange={onTab} badges={{ inbox: inboxBadge }} />
      </div>
    );
  }

  return (
    <div style={S.screen}>
      <SunGlow right={-80} top={-50} />
      <div style={{ ...S.scroll, paddingTop:56, paddingBottom:120 }}>
        <div style={{ ...S.px, marginBottom:16 }}>
          <WanderlyLogo size={38} showWordmark={true} />
          <div style={{ marginTop:10 }}>
            <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>Sommer 2026</div>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:26, lineHeight:1.05, marginTop:2, letterSpacing:"-0.02em" }}>Servus, Manuel ☀</div>
          </div>
        </div>

        <div style={{ ...S.px, marginBottom:12 }}>
          <div style={{ ...S.card, background:"rgba(255,255,255,0.55)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", color:"#5A4533" }}>Reisejahr · gesamt</span>
              <span style={{ fontFamily:"monospace", fontSize:10, color:"#9F8A6F" }}>{trips.length} trips</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginTop:8, gap:8 }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:600, letterSpacing:"-0.02em" }}>€ {totalBudget.toLocaleString("de-AT")}</span>
              <span style={{ fontFamily:"monospace", fontSize:11, color:"#5B7148", fontWeight:600 }}>€ {totalPaid.toLocaleString("de-AT")} paid</span>
            </div>
            <div style={{ marginTop:8 }}><Progress pct={(totalPaid/totalBudget)*100} /></div>
            {totalDue > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:7 }}>
                <Ic name="Clock" size={12} color="#C47A2C" />
                <span style={{ fontFamily:"monospace", fontSize:10, color:"#C47A2C", fontWeight:600 }}>€ {totalDue.toLocaleString("de-AT")} ausstehend</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ ...S.px, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:20, letterSpacing:"-0.02em" }}>Deine Reisen</span>
          <div style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer" }} onClick={() => setExpanded(e => !e)}>
            <span style={{ fontFamily:"monospace", fontSize:10, color:"#C96F4A", fontWeight:600 }}>{expanded?"stapeln":"liste"}</span>
            <Ic name={expanded?"Layers":"LayoutList"} size={14} color="#C96F4A" />
          </div>
        </div>

        {!expanded && (
          <div style={{ position:"relative", height:400, overflow:"hidden", padding:"0 18px", flexShrink:0 }}>
            {sorted.map((t, i) => {
              const top = i*74;
              const rot = (i - Math.min(sorted.length-1, STACK_VISIBLE-1)/2) * 0.6;
              const visible = i < STACK_VISIBLE;
              return (
                <div key={t.id} onClick={() => onOpenTrip(t.id)}
                  style={{ position:"absolute", left:18, right:18, top, background:t.bg, borderRadius:24, padding:"16px 16px 18px", boxShadow:"0 10px 28px rgba(45,31,21,0.11)", cursor:"pointer", minHeight:160, zIndex:10+i, transform:`rotate(${rot}deg)`, opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none", transition:"all 360ms cubic-bezier(.32,.72,.0,1)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(45,31,21,0.55)" }}>{t.dates}</div>
                      <div style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:28, lineHeight:1, marginTop:4, letterSpacing:"-0.02em" }}>{t.name} <span style={{ fontSize:20 }}>{t.emoji}</span></div>
                      <div style={{ fontSize:11, color:"rgba(45,31,21,0.6)", marginTop:3 }}>{t.route} · {t.short}</div>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      {t.flight && <Ic name="Plane" size={15} color="rgba(45,31,21,0.4)" />}
                      {t.train  && <Ic name="Train" size={15} color="rgba(45,31,21,0.4)" />}
                      {t.drive  && <Ic name="Car"   size={15} color="rgba(45,31,21,0.4)" />}
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
                    <span style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600 }}>€ {t.total.toLocaleString("de-AT")}</span>
                    {t.due > 0
                      ? <span style={{ ...S.chip, color:"#9C4A28", background:"rgba(196,122,44,0.14)", border:"1px solid rgba(196,122,44,0.25)" }}><Ic name="Clock" size={10} color="#9C4A28" />{t.dueDate} · € {t.due.toLocaleString("de-AT")}</span>
                      : <span style={{ ...S.chip, color:"#5B7148", background:"rgba(107,142,78,0.14)", border:"1px solid rgba(107,142,78,0.25)" }}><Ic name="Check" size={10} color="#5B7148" />bezahlt</span>}
                  </div>
                </div>
              );
            })}
            {sorted.length > STACK_VISIBLE && (
              <div
                onClick={e => { e.stopPropagation(); setExpanded(true); }}
                style={{ position:"absolute", bottom:12, left:0, right:0, display:"flex", justifyContent:"center", zIndex:50, cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, background:"#2D1F15", color:"#FBF4E6", padding:"6px 14px", borderRadius:999, boxShadow:"0 3px 10px rgba(45,31,21,0.25)" }}>
                  <Ic name="LayoutList" size={12} color="#FBF4E6" />
                  <span style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600 }}>+{sorted.length - STACK_VISIBLE} weitere · alle zeigen</span>
                </div>
              </div>
            )}
          </div>
        )}

        {expanded && (
          <div style={{ padding:"0 18px", display:"flex", flexDirection:"column", gap:14 }}>
            {past.length > 0 && upcoming.length > 0 && (
              <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"#9F8A6F", paddingLeft:2 }}>Bevorstehend</div>
            )}
            {[...upcoming, ...(past.length > 0 ? [{_divider:true}] : []), ...past].map((t, i) => t._divider ? (
              <div key="divider" style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(45,31,21,0.35)", paddingLeft:2, marginTop:4 }}>Vergangen</div>
            ) : (
              <div key={t.id} onClick={() => onOpenTrip(t.id)}
                style={{ background:t.bg, borderRadius:24, padding:"16px 16px 18px", boxShadow:"0 6px 20px rgba(45,31,21,0.09)", cursor:"pointer", opacity: past.includes(t) ? 0.6 : 1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(45,31,21,0.55)" }}>{t.dates}</div>
                    <div style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:26, lineHeight:1, marginTop:4, letterSpacing:"-0.02em" }}>{t.name} <span style={{ fontSize:20 }}>{t.emoji}</span></div>
                    <div style={{ fontSize:11, color:"rgba(45,31,21,0.6)", marginTop:3 }}>{t.route} · {t.short}</div>
                  </div>
                  <div style={{ display:"flex", gap:4 }}>
                    {t.flight && <Ic name="Plane" size={15} color="rgba(45,31,21,0.4)" />}
                    {t.train  && <Ic name="Train" size={15} color="rgba(45,31,21,0.4)" />}
                    {t.drive  && <Ic name="Car"   size={15} color="rgba(45,31,21,0.4)" />}
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
                  <span style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600 }}>€ {t.total.toLocaleString("de-AT")}</span>
                  {t.due > 0
                    ? <span style={{ ...S.chip, color:"#9C4A28", background:"rgba(196,122,44,0.14)", border:"1px solid rgba(196,122,44,0.25)" }}><Ic name="Clock" size={10} color="#9C4A28" />{t.dueDate} · € {t.due.toLocaleString("de-AT")}</span>
                    : <span style={{ ...S.chip, color:"#5B7148", background:"rgba(107,142,78,0.14)", border:"1px solid rgba(107,142,72,0.25)" }}><Ic name="Check" size={10} color="#5B7148" />bezahlt</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign:"center", marginTop:16, fontFamily:"monospace", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,31,21,0.45)" }}>tippe auf eine Reise</div>
      </div>
      <div onClick={onAddTrip} style={{ position:'absolute', right:20, bottom:80, width:52, height:52, borderRadius:'50%', background:'#C96F4A', boxShadow:'0 6px 20px rgba(201,111,74,0.45)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:25 }}>
        <Ic name="Plus" size={24} color="#FBF4E6" />
      </div>
      <TabBar active="home" onChange={onTab} badges={{ inbox: inboxBadge }} />
    </div>
  );
}
