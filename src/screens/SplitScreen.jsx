import Ic from '../components/Ic.jsx';
import TabBar from '../components/TabBar.jsx';
import { S } from '../styles/shared.js';

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

export default function SplitScreen({ onTab, inboxBadge = 0, family = [], expenses = [], onAddExpense, onEditExpense, onSettleAll }) {
  const unsettled = expenses.filter(e => !e.settled);
  const settled   = expenses.filter(e =>  e.settled);

  // Saldo: per payer, collect 50% of what they paid that others owe
  // Always 50/50: each expense is split equally among all family members
  const memberCount = family.length || 2;
  const share = 1 / memberCount;

  // Net: what does each person owe others?
  // For each expense, payer fronted the full amount.
  // Everyone else owes payer their share.
  // Simplified to the two-person case shown in UI: find who owes whom and how much.
  const balances = {};
  family.forEach(f => { balances[f.id] = 0; });
  unsettled.forEach(e => {
    const each = e.amt * share;
    family.forEach(f => {
      if (f.id === e.payerId) {
        balances[f.id] = (balances[f.id] || 0) + e.amt - each; // payer gets credit
      } else {
        balances[f.id] = (balances[f.id] || 0) - each;          // others owe
      }
    });
  });

  // Find the biggest creditor and biggest debtor for the hero card
  let maxCreditor = null, maxDebtor = null;
  family.forEach(f => {
    const b = balances[f.id] || 0;
    if (b > 0 && (!maxCreditor || b > (balances[maxCreditor.id] || 0))) maxCreditor = f;
    if (b < 0 && (!maxDebtor  || b < (balances[maxDebtor.id]  || 0))) maxDebtor  = f;
  });
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
