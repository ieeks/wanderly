import Ic from './Ic.jsx';
import { useSwipeDown } from '../hooks/useSwipeDown.js';

export default function DeleteConfirmSheet({ trip, onCancel, onConfirm }) {
  const { sheetEl, onTouchStart, onTouchMove, onTouchEnd } = useSwipeDown(onCancel);
  return (
    <>
      <div style={{ position:'absolute', inset:0, background:'rgba(45,31,21,0.5)', zIndex:32 }} onClick={onCancel} />
      <div ref={sheetEl} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ position:'absolute', left:0, right:0, bottom:0, background:'#FFFAF1', borderTopLeftRadius:26, borderTopRightRadius:26, padding:'12px 18px 36px', zIndex:33 }}>
        <div style={{ width:36, height:4, borderRadius:2, background:'rgba(45,31,21,0.16)', margin:'0 auto 18px' }} />
        <div style={{ width:52, height:52, borderRadius:16, background:'rgba(196,44,44,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <Ic name="Trash2" size={24} color="#C42C2C" />
        </div>
        <div style={{ textAlign:'center', marginBottom:6 }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:600 }}>Reise löschen?</div>
          <div style={{ fontSize:13, color:'#9F8A6F', marginTop:6 }}><strong>{trip.name}</strong> wird unwiderruflich entfernt.</div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:22 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'13px', borderRadius:16, border:'none', background:'rgba(45,31,21,0.07)', fontFamily:'inherit', fontWeight:700, fontSize:14, cursor:'pointer', color:'#2D1F15' }}>Abbrechen</button>
          <button onClick={() => onConfirm(trip.id)} style={{ flex:1, padding:'13px', borderRadius:16, border:'none', background:'#C42C2C', fontFamily:'inherit', fontWeight:700, fontSize:14, cursor:'pointer', color:'white' }}>Löschen</button>
        </div>
      </div>
    </>
  );
}
