import Ic from '../components/Ic.jsx';
import TabBar from '../components/TabBar.jsx';
import { S } from '../styles/shared.js';
import { calcBalances, findCreditorDebtor } from '../utils/splitCalc.js';

const CATEGORIES = [
  { icon:"Plane",           bg:"#F8DEC4" },
  { icon:"Building2",       bg:"#D7E2C6" },
  { icon:"UtensilsCrossed", bg:"#E8D2DC" },
  { icon:"Car",             bg:"#D4E4F0" },
  { icon:"Shield",          bg:"#F5EAD4" },
  { icon:"ShoppingBag",     bg:"#E8D8F0" },
  { icon:"Ticket",          bg:"#DCF0E4" },
  { icon:"MoreHorizontal",  bg:"#EAEAEA" },
];

function fmt(n) {
  return n.toLocaleString('de-AT', { minimumFractionDigits:2, maximumFractionDigits:2 });
}

export default function SplitScreen({ onTab, inboxBadge = 0, family = [], expenses = [], onAddExpense, onEditExpense, onSettleAll, onUnsettleAll, onSettleExpense }) {
  const unsettled = expenses.filter(e => !e.settled);
  const settled   = expenses.filter(e =>  e.settled);

  const balances = calcBalances(family, unsettled);
  const { creditor: maxCreditor, debtor: maxDebtor } = findCreditorDebtor(family, balances);
  const saldo = maxCreditor ? Math.abs(balances[maxCreditor.id] || 0) : 0;

  const totalUnsettled = unsettled.reduce((s, e) => s + e.amt, 0);

  return (
    <div style={S.screen}>
      <div style={{ ...S.scroll, paddingTop:56, paddingBottom:110 }}>

        {/* Header */}
        <div style={{ ...S.px, display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>Familie · 2026</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:600, marginTop:2 }}>Split & Settle</div>
          </div>
          <div style={S.pill}><Ic name="Settings2" size={15} color="#2D1F15" /></div>
        </div>

        {/* Hero saldo card */}
        <div style={{ ...S.px, marginBottom:14 }}>
          <div style={{ background:"linear-gradient(160deg,#F8DEC4,#ECAE84)", borderRadius:24, padding:20, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-8, bottom:-16, fontSize:90, color:"rgba(45,31,21,0.06)", pointerEvents:"none" }}>✿</div>
            {unsettled.length === 0 ? (
              <>
                <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(45,31,21,0.6)" }}>Alles beglichen</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:44, fontWeight:600, marginTop:4 }}>€ 0,00</div>
                <div style={{ fontFamily:"monospace", fontSize:10, color:"rgba(45,31,21,0.6)", marginTop:3 }}>Keine offenen Ausgaben</div>
                {settled.length > 0 && (
                  <button onClick={onUnsettleAll} style={{ ...S.btn, marginTop:14, padding:"9px 14px", fontSize:12, background:"rgba(255,255,255,0.5)", color:"#2D1F15" }}>↩ Zurücksetzen</button>
                )}
              </>
            ) : (
              <>
                <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(45,31,21,0.6)" }}>
                  {maxDebtor?.name} schuldet {maxCreditor?.name}
                </div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:44, fontWeight:600, marginTop:4 }}>€ {fmt(saldo)}</div>
                <div style={{ fontFamily:"monospace", fontSize:10, color:"rgba(45,31,21,0.6)", marginTop:3 }}>
                  aus {unsettled.length} Buchung{unsettled.length !== 1 ? 'en' : ''} · € {fmt(totalUnsettled)} gesamt
                </div>
                <div style={{ display:"flex", gap:8, marginTop:14 }}>
                  <button style={{ ...S.btn, flex:1, padding:"9px 12px", fontSize:12, background:"#C96F4A", color:"#FBF4E6", boxShadow:"0 4px 10px rgba(201,111,74,0.3)" }}>
                    <Ic name="Send" size={13} color="#FBF4E6" />an {maxDebtor?.name}
                  </button>
                  <button onClick={onSettleAll} style={{ ...S.btn, padding:"9px 12px", fontSize:12, background:"rgba(255,255,255,0.5)", color:"#2D1F15" }}>beglichen</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Unsettled expenses */}
        {unsettled.length > 0 && (
          <>
            <div style={{ ...S.px, display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:"#5A4533" }}>Ausgaben</span>
              <span style={{ fontFamily:"monospace", fontSize:10, color:"#9F8A6F" }}>{unsettled.length} Position{unsettled.length !== 1 ? 'en' : ''}</span>
            </div>
            <div style={{ ...S.px }}>
              <div style={{ ...S.card, padding:"4px 14px" }}>
                {unsettled.map((e, i) => {
                  const payer = family.find(f => f.id === e.payerId) || family[0];
                  const cat   = CATEGORIES[e.catIdx] || CATEGORIES[7];
                  return (
                    <div key={e.id} onClick={() => onEditExpense(e)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom: i < unsettled.length - 1 ? "1px solid #EADFC4" : "none", cursor:"pointer" }}>
                      <div style={{ width:34, height:34, borderRadius:10, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Ic name={cat.icon} size={15} color="#5A4533" />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{e.desc}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                          {payer && <div style={S.avatar(payer.bg, payer.fg)}>{(payer.init || payer.name)[0]}</div>}
                          <span style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>{payer?.name} · {e.date}</span>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:600 }}>€ {fmt(e.amt)}</div>
                        <div style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>50 / 50</div>
                      </div>
                      <button
                        onClick={ev => { ev.stopPropagation(); onSettleExpense?.(e.id, true); }}
                        title="Als beglichen markieren"
                        style={{ flexShrink:0, width:32, height:32, borderRadius:"50%", border:"1.5px solid rgba(91,113,72,0.35)", background:"rgba(107,142,78,0.12)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0 }}>
                        <Ic name="Check" size={15} color="#5B7148" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Settled expenses (collapsed) */}
        {settled.length > 0 && (
          <div style={{ ...S.px, marginTop:16 }}>
            <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9F8A6F", marginBottom:8 }}>Beglichen · {settled.length}</div>
            <div style={{ ...S.card, padding:"4px 14px", opacity:0.6 }}>
              {settled.map((e, i) => {
                const payer = family.find(f => f.id === e.payerId) || family[0];
                const cat   = CATEGORIES[e.catIdx] || CATEGORIES[7];
                return (
                  <div key={e.id} onClick={() => onEditExpense(e)}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom: i < settled.length - 1 ? "1px solid #EADFC4" : "none", cursor:"pointer" }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Ic name={cat.icon} size={15} color="#5A4533" />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, textDecoration:"line-through" }}>{e.desc}</div>
                      <span style={{ fontFamily:"monospace", fontSize:9, color:"#9F8A6F" }}>{payer?.name} · {e.date}</span>
                    </div>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:600, color:"#9F8A6F" }}>€ {fmt(e.amt)}</div>
                    <button
                      onClick={ev => { ev.stopPropagation(); onSettleExpense?.(e.id, false); }}
                      title="Wieder als offen markieren"
                      style={{ flexShrink:0, width:32, height:32, borderRadius:"50%", border:"1.5px solid rgba(45,31,21,0.15)", background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0 }}>
                      <Ic name="RotateCcw" size={14} color="#9F8A6F" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {expenses.length === 0 && (
          <div style={{ ...S.px, marginTop:40, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🧾</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:600, marginBottom:6 }}>Noch keine Ausgaben</div>
            <div style={{ fontSize:13, color:"#9F8A6F" }}>Tippe auf + um eine Ausgabe hinzuzufügen</div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={onAddExpense}
        style={{ position:"absolute", right:24, bottom:96, width:52, height:52, borderRadius:"50%", background:"#C96F4A", border:"none", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 20px rgba(201,111,74,0.4)", cursor:"pointer", zIndex:10 }}>
        <Ic name="Plus" size={22} color="#FBF4E6" />
      </button>

      <TabBar active="split" onChange={onTab} badges={{ inbox: inboxBadge }} />
    </div>
  );
}
