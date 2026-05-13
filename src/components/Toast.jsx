import Ic from './Ic.jsx';

export default function Toast({ msg }) {
  return (
    <div style={{ position:"absolute", left:0, right:0, top:60, display:"flex", justifyContent:"center", zIndex:40, pointerEvents:"none" }}>
      <div style={{ background:"#2D1F15", color:"#FBF4E6", padding:"9px 16px", borderRadius:999, fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:7, boxShadow:"0 6px 18px rgba(0,0,0,0.18)" }}>
        <Ic name="Check" size={13} color="#8AA074" />{msg}
      </div>
    </div>
  );
}
