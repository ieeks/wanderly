import { useState } from 'react';
import Ic from './Ic.jsx';
import { useSwipeDown } from '../hooks/useSwipeDown.js';

const ACTIVITY_ICONS = [
  { name:"Car",            label:"Auto"      },
  { name:"Plane",          label:"Flug"      },
  { name:"Train",          label:"Zug"       },
  { name:"Ship",           label:"Schiff"    },
  { name:"Building2",      label:"Hotel"     },
  { name:"UtensilsCrossed",label:"Essen"     },
  { name:"Mountain",       label:"Natur"     },
  { name:"Landmark",       label:"Kultur"    },
  { name:"Wine",           label:"Weingut"   },
  { name:"Footprints",     label:"Spazieren" },
  { name:"ShoppingBag",    label:"Shopping"  },
  { name:"Pause",          label:"Pause"     },
  { name:"Star",           label:"Highlight" },
  { name:"MapPin",         label:"Sonstiges" },
];

export default function ActivitySheet({ activity, dayLabel, onClose, onSave, onDelete }) {
  const isEdit = !!activity;
  const { sheetEl, onTouchStart, onTouchMove, onTouchEnd } = useSwipeDown(onClose);
  const [time,  setTime]  = useState(activity?.time  || '');
  const [label, setLabel] = useState(activity?.label || '');
  const [sub,   setSub]   = useState(activity?.sub   || '');
  const [icon,  setIcon]  = useState(activity?.icon  || 'MapPin');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canSave = label.trim().length > 0;
  const iStyle = { width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #EADFC4', background:'#FFFAF1', fontFamily:'inherit', fontSize:14, color:'#2D1F15', outline:'none', boxSizing:'border-box' };
  const lStyle = { fontFamily:'monospace', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'#9F8A6F', marginBottom:5, display:'block' };

  return (
    <>
      <div style={{ position:'absolute', inset:0, background:'rgba(45,31,21,0.45)', zIndex:34 }} onClick={onClose} />
      <div ref={sheetEl} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ position:'absolute', left:0, right:0, bottom:0, background:'#FFFAF1', borderTopLeftRadius:26, borderTopRightRadius:26, padding:'10px 18px 36px', zIndex:35, maxHeight:'90%', overflowY:'auto' }}>
        <div style={{ width:36, height:4, borderRadius:2, background:'rgba(45,31,21,0.16)', margin:'0 auto 14px' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div>
            <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'#9F8A6F' }}>{dayLabel}</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:600, marginTop:2 }}>{isEdit ? 'Aktivität bearbeiten' : 'Aktivität hinzufügen'}</div>
          </div>
          <div style={{ cursor:'pointer' }} onClick={onClose}><Ic name="X" size={20} color="#9F8A6F" /></div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><span style={lStyle}>Uhrzeit (optional)</span><input style={iStyle} placeholder="09:30" value={time} onChange={e => setTime(e.target.value)} /></div>
          <div><span style={lStyle}>Titel *</span><input style={iStyle} placeholder="z.B. Check-in Hotel" value={label} onChange={e => setLabel(e.target.value)} /></div>
          <div><span style={lStyle}>Beschreibung (optional)</span><input style={iStyle} placeholder="z.B. Zimmer 7 · 15:00 Uhr" value={sub} onChange={e => setSub(e.target.value)} /></div>
          <div>
            <span style={lStyle}>Kategorie</span>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {ACTIVITY_ICONS.map(ic => (
                <div key={ic.name} onClick={() => setIcon(ic.name)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'8px 10px', borderRadius:12, cursor:'pointer', background: icon===ic.name ? '#F8DEC4' : 'rgba(45,31,21,0.04)', border: icon===ic.name ? '1.5px solid #C96F4A' : '1.5px solid transparent', transition:'all 150ms', minWidth:52 }}>
                  <Ic name={ic.name} size={18} color={icon===ic.name ? '#C96F4A' : '#9F8A6F'} />
                  <span style={{ fontSize:9, fontFamily:'monospace', color: icon===ic.name ? '#C96F4A' : '#9F8A6F', fontWeight:600 }}>{ic.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          {isEdit && (
            <button onClick={() => setConfirmDelete(true)}
              style={{ width:44, height:50, borderRadius:14, border:'none', background:'rgba(196,44,44,0.08)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Ic name="Trash2" size={17} color="#C42C2C" />
            </button>
          )}
          <button onClick={() => canSave && onSave({ time, label, sub, icon })} disabled={!canSave}
            style={{ flex:1, height:50, borderRadius:14, border:'none', background: canSave ? '#C96F4A' : '#EADFC4', color: canSave ? '#FBF4E6' : '#9F8A6F', fontFamily:'inherit', fontWeight:700, fontSize:14, cursor: canSave ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: canSave ? '0 5px 12px rgba(201,111,74,0.35)' : 'none' }}>
            <Ic name="Check" size={16} color={canSave ? '#FBF4E6' : '#9F8A6F'} />
            {isEdit ? 'Änderungen speichern' : 'Hinzufügen'}
          </button>
        </div>

        {confirmDelete && (
          <div style={{ marginTop:12, padding:14, borderRadius:16, background:'rgba(196,44,44,0.06)', border:'1px solid rgba(196,44,44,0.15)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#C42C2C', marginBottom:10 }}>"{label}" wirklich löschen?</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setConfirmDelete(false)} style={{ flex:1, padding:'9px', borderRadius:10, border:'none', background:'rgba(45,31,21,0.07)', fontFamily:'inherit', fontWeight:600, fontSize:13, cursor:'pointer' }}>Abbrechen</button>
              <button onClick={() => { onDelete(); onClose(); }} style={{ flex:1, padding:'9px', borderRadius:10, border:'none', background:'#C42C2C', color:'white', fontFamily:'inherit', fontWeight:700, fontSize:13, cursor:'pointer' }}>Löschen</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
