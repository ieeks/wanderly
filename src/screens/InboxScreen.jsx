import { useRef, useState } from 'react';
import Ic from '../components/Ic.jsx';
import TabBar from '../components/TabBar.jsx';
import { S } from '../styles/shared.js';
import { TAG_COLOR, TAG_NAME } from '../data/mockData.js';
import { useSwipeDown } from '../hooks/useSwipeDown.js';

function PasteSheet({ onSubmit, onClose }) {
  const [text, setText] = useState('');
  const { sheetEl, onTouchStart, onTouchMove, onTouchEnd } = useSwipeDown(onClose);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(45,31,21,0.40)', backdropFilter:'blur(4px)' }} onClick={onClose} />
      <div ref={sheetEl} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ position:'relative', background:'#FBF4E6', borderRadius:'22px 22px 0 0', padding:'20px 20px 40px', display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ width:36, height:4, borderRadius:2, background:'rgba(45,31,21,0.15)', margin:'0 auto 4px' }} />
        <div>
          <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'#9F8A6F', marginBottom:4 }}>Mail-Text einfügen</div>
          <div style={{ fontFamily:'Georgia,serif', fontWeight:600, fontSize:22, letterSpacing:'-0.02em' }}>Buchung analysieren</div>
        </div>
        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={"Betreff: Buchungsbestätigung Ryanair\nVon: noreply@ryanair.com\n\nVielen Dank für Ihre Buchung…"}
          style={{
            width:'100%', height:200, padding:'12px 14px', borderRadius:14,
            border:'1.5px solid #EADFC4', background:'#FFFAF1',
            fontFamily:'monospace', fontSize:12, color:'#2D1F15',
            resize:'none', outline:'none', boxSizing:'border-box', lineHeight:1.6,
          }}
        />
        <button
          onClick={() => text.trim() && onSubmit(text)}
          disabled={!text.trim()}
          style={{
            padding:'14px', borderRadius:14, border:'none', cursor: text.trim() ? 'pointer' : 'default',
            background: text.trim() ? '#C96F4A' : 'rgba(45,31,21,0.10)',
            color: text.trim() ? '#fff' : 'rgba(45,31,21,0.35)',
            fontFamily:'inherit', fontSize:15, fontWeight:700, transition:'background 150ms',
          }}
        >
          ✦ Analysieren
        </button>
      </div>
    </div>
  );
}

export default function InboxScreen({ items, onMarkRead, onTab, onOpenTrip, onEmlFile }) {
  const unread = items.filter(i => !i.read).length;
  const fileRef = useRef(null);
  const [showPaste, setShowPaste] = useState(false);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = ev => onEmlFile?.(file.name, ev.target.result);
    reader.readAsText(file);
  }

  function handlePaste(text) {
    setShowPaste(false);
    onEmlFile?.('eingefügt.txt', text);
  }

  return (
    <div style={S.screen}>
      <div style={{ ...S.scroll, paddingTop:56, paddingBottom:110 }}>
        <div style={{ ...S.px, marginBottom:16 }}>
          <div style={{ fontFamily:"monospace", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9F8A6F" }}>Automatisch geparst</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginTop:2 }}>
            <div style={{ fontFamily:"Georgia,serif", fontWeight:600, fontSize:30, letterSpacing:"-0.02em" }}>Posteingang</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {unread > 0 && <span style={{ ...S.chip, color:"#9C4A28", background:"rgba(196,122,44,0.14)", border:"1px solid rgba(196,122,44,0.25)", fontSize:10 }}>{unread} neu</span>}
              {onEmlFile && (
                <>
                  <input ref={fileRef} type="file" accept=".eml,.txt,message/rfc822" style={{ display:'none' }} onChange={handleFile} />
                  <button onClick={() => fileRef.current?.click()} style={{ background:'none', border:'none', padding:'4px 5px', cursor:'pointer', color:'#C96F4A', fontFamily:'monospace', fontSize:10, fontWeight:700 }}>📥</button>
                  <button onClick={() => setShowPaste(true)} style={{ background:'none', border:'none', padding:'4px 5px', cursor:'pointer', color:'#C96F4A', fontFamily:'monospace', fontSize:10, fontWeight:700 }}>📋 einfügen</button>
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{ background:"#FFFAF1", borderRadius:20, margin:"0 18px", overflow:"hidden", boxShadow:"0 3px 12px rgba(45,31,21,0.06)" }}>
          {items.map((item, i) => (
            <div key={item.id} onClick={() => { onMarkRead(item.id); item.tag&&onOpenTrip(item.tag); }}
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
      {showPaste && <PasteSheet onSubmit={handlePaste} onClose={() => setShowPaste(false)} />}
    </div>
  );
}
