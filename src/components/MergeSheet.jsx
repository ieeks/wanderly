import { useSwipeDown } from '../hooks/useSwipeDown.js';

const TYPE_LABEL = { flight:'✈ Flug', hotel:'🏨 Hotel', train:'🚆 Zug', car:'🚗 Mietwagen', insurance:'🛡 Versicherung' };

export default function MergeSheet({ existingTrip, newItem, onMerge, onNewTrip, onClose }) {
  const { sheetEl, onTouchStart, onTouchMove, onTouchEnd } = useSwipeDown(onClose);
  const p = newItem?.parsed || {};
  const typeLabel = TYPE_LABEL[p.type] || p.type || '';

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(45,31,21,0.40)', backdropFilter:'blur(4px)' }} onClick={onClose} />
      <div
        ref={sheetEl} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ position:'relative', background:'#FBF4E6', borderRadius:'22px 22px 0 0', padding:'20px 20px 40px', display:'flex', flexDirection:'column', gap:16 }}
      >
        <div style={{ width:36, height:4, borderRadius:2, background:'rgba(45,31,21,0.15)', margin:'0 auto 4px' }} />
        <div>
          <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'#9F8A6F', marginBottom:4 }}>Buchung erkannt</div>
          <div style={{ fontFamily:'Georgia,serif', fontWeight:600, fontSize:22, letterSpacing:'-0.02em' }}>Zu bestehender Reise hinzufügen?</div>
        </div>

        <div style={{ background:'#FFFAF1', borderRadius:16, padding:16 }}>
          <div style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.12em', color:'#9F8A6F', marginBottom:8 }}>Bestehende Reise</div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:existingTrip.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
              {existingTrip.emoji}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:15 }}>{existingTrip.name}</div>
              <div style={{ fontFamily:'monospace', fontSize:10, color:'#9F8A6F', marginTop:2 }}>{existingTrip.dates} · {existingTrip.short}</div>
            </div>
          </div>
          <div style={{ marginTop:10, display:'flex', gap:6, flexWrap:'wrap' }}>
            {existingTrip.flight      && <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background:'rgba(45,31,21,0.06)' }}>✈ Flug vorhanden</span>}
            {existingTrip.train       && <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background:'rgba(45,31,21,0.06)' }}>🚆 Zug vorhanden</span>}
            {existingTrip.hotel?.name && <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background:'rgba(45,31,21,0.06)' }}>🏨 {existingTrip.hotel.name}</span>}
          </div>
        </div>

        <div style={{ background:'rgba(201,111,74,0.08)', borderRadius:16, padding:16, border:'1.5px solid rgba(201,111,74,0.20)' }}>
          <div style={{ fontFamily:'monospace', fontSize:9, textTransform:'uppercase', letterSpacing:'0.12em', color:'#9F8A6F', marginBottom:8 }}>Neue Buchung · {typeLabel}</div>
          <div style={{ fontWeight:600, fontSize:14 }}>{newItem.from}: {newItem.subject}</div>
          {p.hotelName   && <div style={{ fontSize:12, color:'#5A4533', marginTop:4 }}>🏨 {p.hotelName}</div>}
          {p.destination && !p.hotelName && <div style={{ fontSize:12, color:'#5A4533', marginTop:4 }}>📍 {p.destination}</div>}
          {(p.checkIn || p.departureDate) && (
            <div style={{ fontFamily:'monospace', fontSize:11, color:'#9F8A6F', marginTop:4 }}>
              {p.checkIn || p.departureDate}{(p.checkOut || p.returnDate) ? ` → ${p.checkOut || p.returnDate}` : ''}
            </div>
          )}
          {p.totalAmount > 0 && (
            <div style={{ fontFamily:'monospace', fontSize:11, color:'#C96F4A', fontWeight:700, marginTop:4 }}>
              € {p.totalAmount.toFixed(2).replace('.', ',')}
            </div>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button
            onClick={onMerge}
            style={{ padding:14, borderRadius:14, border:'none', cursor:'pointer', background:'#C96F4A', color:'#fff', fontFamily:'inherit', fontSize:15, fontWeight:700, boxShadow:'0 5px 12px rgba(201,111,74,0.35)' }}
          >
            ✦ Zu „{existingTrip.name}" hinzufügen
          </button>
          <button
            onClick={onNewTrip}
            style={{ padding:14, borderRadius:14, border:'none', cursor:'pointer', background:'rgba(45,31,21,0.08)', color:'#2D1F15', fontFamily:'inherit', fontSize:14, fontWeight:600 }}
          >
            Als neue Reise anlegen
          </button>
        </div>
      </div>
    </div>
  );
}
