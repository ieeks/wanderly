import { useState } from 'react';
import Ic from './Ic.jsx';

const PERSON_COLORS = [
  { bg:"#F0B58A", fg:"#2D1F15", label:"Peach"  },
  { bg:"#8AA074", fg:"#1f2a17", label:"Sage"   },
  { bg:"#7BA8B8", fg:"#143037", label:"Sky"    },
  { bg:"#9C6377", fg:"#fff",    label:"Plum"   },
  { bg:"#E6B545", fg:"#2D1F15", label:"Sun"    },
  { bg:"#C96F4A", fg:"#fff",    label:"Terra"  },
  { bg:"#94B5C2", fg:"#143037", label:"Mist"   },
  { bg:"#C9A3B4", fg:"#2D1F15", label:"Rose"   },
];

export default function FamilyEditSheet({ person, onClose, onSave, onDelete }) {
  const isEdit = !!person;
  const [name,  setName]  = useState(person?.name  || '');
  const [init,  setInit]  = useState(person?.init  || '');
  const [color, setColor] = useState(
    person ? Math.max(0, PERSON_COLORS.findIndex(c => c.bg === person.bg)) : 0
  );
  const [showDelete, setShowDelete] = useState(false);

  const chosen = PERSON_COLORS[color];
  const canSave = name.trim().length > 0 && init.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave({
      id:   person?.id || 'p_' + Date.now(),
      name: name.trim(),
      init: init.trim().slice(0,2).toUpperCase(),
      bg:   chosen.bg,
      fg:   chosen.fg,
    });
    onClose();
  }

  return (
    <>
      <div style={{ position:'absolute', inset:0, background:'rgba(45,31,21,0.45)', zIndex:32 }} onClick={onClose} />
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#FFFAF1', borderTopLeftRadius:26, borderTopRightRadius:26, padding:'10px 18px 36px', zIndex:33 }}>
        <div style={{ width:36, height:4, borderRadius:2, background:'rgba(45,31,21,0.16)', margin:'0 auto 14px' }} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'#9F8A6F' }}>{isEdit ? 'Person bearbeiten' : 'Person hinzufügen'}</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:600, marginTop:2 }}>{name || 'Neue Person'}</div>
          </div>
          <div style={{ cursor:'pointer' }} onClick={onClose}><Ic name="X" size={20} color="#9F8A6F" /></div>
        </div>

        <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:chosen.bg, color:chosen.fg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontWeight:700, fontSize:24, boxShadow:'0 0 0 3px rgba(255,255,255,0.9), 0 4px 16px rgba(45,31,21,0.15)' }}>
            {init.slice(0,2).toUpperCase() || '?'}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'#9F8A6F', marginBottom:5, display:'block' }}>Name</span>
            <input
              style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #EADFC4', background:'#FFFAF1', fontFamily:'inherit', fontSize:14, color:'#2D1F15', outline:'none', boxSizing:'border-box' }}
              placeholder="z.B. Olga" value={name} onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'#9F8A6F', marginBottom:5, display:'block' }}>Initialen (1–2 Zeichen)</span>
            <input
              style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #EADFC4', background:'#FFFAF1', fontFamily:'inherit', fontSize:14, color:'#2D1F15', outline:'none', boxSizing:'border-box', textTransform:'uppercase' }}
              placeholder="z.B. O" value={init} onChange={e => setInit(e.target.value.slice(0,2))} maxLength={2}
            />
          </div>

          <div>
            <span style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'#9F8A6F', marginBottom:8, display:'block' }}>Avatar-Farbe</span>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {PERSON_COLORS.map((col, i) => (
                <div key={i} onClick={() => setColor(i)}
                  style={{ width:36, height:36, borderRadius:'50%', background:col.bg, cursor:'pointer', border: color===i ? `3px solid #2D1F15` : '3px solid transparent', transition:'border 150ms', boxShadow:'0 2px 6px rgba(45,31,21,0.12)' }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginTop:22 }}>
          {isEdit && (
            <button onClick={() => setShowDelete(true)}
              style={{ width:44, height:50, borderRadius:14, border:'none', background:'rgba(196,44,44,0.08)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Ic name="Trash2" size={17} color="#C42C2C" />
            </button>
          )}
          <button onClick={handleSave} disabled={!canSave}
            style={{ flex:1, height:50, borderRadius:14, border:'none', background: canSave ? '#C96F4A' : '#EADFC4', color: canSave ? '#FBF4E6' : '#9F8A6F', fontFamily:'inherit', fontWeight:700, fontSize:14, cursor: canSave ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: canSave ? '0 5px 12px rgba(201,111,74,0.35)' : 'none' }}>
            <Ic name="Check" size={16} color={canSave ? '#FBF4E6' : '#9F8A6F'} />
            {isEdit ? 'Änderungen speichern' : 'Person hinzufügen'}
          </button>
        </div>

        {showDelete && (
          <div style={{ marginTop:14, padding:'14px', borderRadius:16, background:'rgba(196,44,44,0.06)', border:'1px solid rgba(196,44,44,0.15)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#C42C2C', marginBottom:10 }}>"{person.name}" wirklich entfernen?</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setShowDelete(false)} style={{ flex:1, padding:'9px', borderRadius:10, border:'none', background:'rgba(45,31,21,0.07)', fontFamily:'inherit', fontWeight:600, fontSize:13, cursor:'pointer' }}>Abbrechen</button>
              <button onClick={() => { onDelete(person.id); onClose(); }} style={{ flex:1, padding:'9px', borderRadius:10, border:'none', background:'#C42C2C', color:'#fff', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer' }}>Entfernen</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
