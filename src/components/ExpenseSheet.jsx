import { useState } from 'react';
import Ic from './Ic.jsx';
import { S } from '../styles/shared.js';

const CATEGORIES = [
  { icon:"Plane",           label:"Flug",        bg:"#F8DEC4" },
  { icon:"Building2",       label:"Unterkunft",  bg:"#D7E2C6" },
  { icon:"UtensilsCrossed", label:"Restaurant",  bg:"#E8D2DC" },
  { icon:"Car",             label:"Mietwagen",   bg:"#D4E4F0" },
  { icon:"Shield",          label:"Versicherung",bg:"#F5EAD4" },
  { icon:"ShoppingBag",     label:"Shopping",    bg:"#E8D8F0" },
  { icon:"Ticket",          label:"Aktivität",   bg:"#DCF0E4" },
  { icon:"MoreHorizontal",  label:"Sonstiges",   bg:"#EAEAEA" },
];

export default function ExpenseSheet({ expense, family, onSave, onDelete, onClose }) {
  const isEdit = !!expense;
  const [desc,   setDesc]   = useState(expense?.desc   || '');
  const [amt,    setAmt]    = useState(expense?.amt     ? String(expense.amt) : '');
  const [catIdx, setCatIdx] = useState(expense?.catIdx  ?? 0);
  const [payerId,setPayerId]= useState(expense?.payerId || family[0]?.id || '');
  const [saving, setSaving] = useState(false);

  const cat = CATEGORIES[catIdx] || CATEGORIES[0];

  async function handleSave() {
    const amount = parseFloat(amt.replace(',', '.'));
    if (!desc.trim() || isNaN(amount) || amount <= 0) return;
    setSaving(true);
    await onSave({
      ...(expense || {}),
      id:      expense?.id || 'exp_' + Date.now(),
      desc:    desc.trim(),
      amt:     amount,
      catIdx,
      payerId,
      settled: expense?.settled || false,
      date:    expense?.date    || new Date().toLocaleDateString('de-AT', { day:'numeric', month:'short' }),
    });
    onClose();
  }

  async function handleDelete() {
    setSaving(true);
    await onDelete(expense.id);
    onClose();
  }

  return (
    <>
      <div style={{ position:"absolute", inset:0, background:"rgba(45,31,21,0.45)", zIndex:30 }} onClick={onClose} />
      <div style={{ position:"absolute", left:0, right:0, bottom:0, background:"#FFFAF1", borderTopLeftRadius:24, borderTopRightRadius:24, padding:"10px 18px 36px", boxShadow:"0 -8px 28px rgba(45,31,21,0.16)", zIndex:31 }}>
        <div style={{ width:36, height:4, borderRadius:2, background:"rgba(45,31,21,0.16)", margin:"0 auto 14px" }} />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600 }}>{isEdit ? 'Ausgabe bearbeiten' : 'Ausgabe hinzufügen'}</div>
          <div style={{ cursor:"pointer" }} onClick={onClose}><Ic name="X" size={20} color="#9F8A6F" /></div>
        </div>

        {/* Description */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"#9F8A6F", marginBottom:4 }}>Beschreibung</div>
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="z.B. Flüge Ibiza"
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(45,31,21,0.05)", border:"1.5px solid rgba(45,31,21,0.12)", borderRadius:12, padding:"10px 12px", fontSize:14, fontFamily:"inherit", outline:"none", color:"#2D1F15" }}
          />
        </div>

        {/* Amount */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"#9F8A6F", marginBottom:4 }}>Betrag (€)</div>
          <input
            value={amt}
            onChange={e => setAmt(e.target.value)}
            placeholder="0,00"
            inputMode="decimal"
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(45,31,21,0.05)", border:"1.5px solid rgba(45,31,21,0.12)", borderRadius:12, padding:"10px 12px", fontSize:20, fontFamily:"Georgia,serif", fontWeight:600, outline:"none", color:"#2D1F15" }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"#9F8A6F", marginBottom:6 }}>Kategorie</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {CATEGORIES.map((c, i) => (
              <button key={i} onClick={() => setCatIdx(i)}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"8px 10px", borderRadius:12, border:"1.5px solid", borderColor: catIdx === i ? "#C96F4A" : "rgba(45,31,21,0.12)", background: catIdx === i ? "#FFF0E6" : c.bg, cursor:"pointer", fontFamily:"inherit", minWidth:60 }}>
                <Ic name={c.icon} size={16} color={catIdx === i ? "#C96F4A" : "#5A4533"} />
                <span style={{ fontFamily:"monospace", fontSize:8, color: catIdx === i ? "#C96F4A" : "#5A4533" }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payer */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:"monospace", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:"#9F8A6F", marginBottom:6 }}>Bezahlt von</div>
          <div style={{ display:"flex", gap:8 }}>
            {family.map(f => (
              <button key={f.id} onClick={() => setPayerId(f.id)}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", borderRadius:12, border:"1.5px solid", borderColor: payerId === f.id ? "#C96F4A" : "rgba(45,31,21,0.12)", background: payerId === f.id ? "#FFF0E6" : "rgba(45,31,21,0.04)", cursor:"pointer", fontFamily:"inherit" }}>
                <div style={{ ...S.avatar(f.bg, f.fg), width:22, height:22, fontSize:9 }}>{(f.init || f.name)[0]}</div>
                <span style={{ fontSize:12, fontWeight:600, color: payerId === f.id ? "#C96F4A" : "#2D1F15" }}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:8 }}>
          {isEdit && (
            <button onClick={handleDelete} disabled={saving}
              style={{ ...S.btn, padding:"12px 14px", background:"rgba(201,111,74,0.1)", color:"#C96F4A", border:"none" }}>
              <Ic name="Trash2" size={15} color="#C96F4A" />
            </button>
          )}
          <button onClick={handleSave} disabled={saving || !desc.trim() || !parseFloat(amt)}
            style={{ ...S.btn, flex:1, background:"#C96F4A", color:"#FBF4E6", opacity: (!desc.trim() || !parseFloat(amt)) ? 0.5 : 1 }}>
            {saving ? 'Speichern…' : isEdit ? 'Speichern' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </>
  );
}
