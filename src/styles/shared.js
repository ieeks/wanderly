// Shared style object — mirrors the S object from the prototype
export const S = {
  screen: { position:"absolute", inset:0, display:"flex", flexDirection:"column" },
  scroll: { flex:1, overflowY:"auto", overflowX:"hidden" },
  px: { paddingLeft:18, paddingRight:18 },
  tabbar: {
    position:"absolute", left:0, right:0, bottom:0,
    padding:"8px 16px 24px",
    background:"linear-gradient(180deg,transparent,rgba(251,244,230,0.96) 28%,#FBF4E6 60%)",
    display:"flex", justifyContent:"space-around", zIndex:20,
  },
  card: { background:"#FFFAF1", borderRadius:20, padding:16, boxShadow:"0 3px 12px rgba(45,31,21,0.06)" },
  pass: { margin:"0 18px", borderRadius:24, color:"#2D1F15", position:"relative", boxShadow:"0 14px 36px rgba(176,108,58,0.26)" },
  chip: { display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:999, background:"rgba(255,255,255,0.55)", border:"1px solid rgba(45,31,21,0.08)" },
  btn: { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, padding:"12px 16px", borderRadius:16, fontWeight:700, fontSize:14, cursor:"pointer", border:"none", fontFamily:"inherit" },
  pill: { width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,0.7)", backdropFilter:"blur(16px)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 },
  avatar: (bg, fg) => ({ width:26, height:26, borderRadius:"50%", background:bg, color:fg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:11, flexShrink:0, boxShadow:"0 0 0 2px rgba(255,255,255,0.85)" }),
  progress: { height:5, borderRadius:3, background:"rgba(45,31,21,0.1)", overflow:"hidden" },
  toggle: (on) => ({ width:36, height:21, borderRadius:11, background: on ? "#8AA074" : "rgba(45,31,21,0.15)", position:"relative", cursor:"pointer", transition:"background 200ms", flexShrink:0 }),
  toggleKnob: (on) => ({ position:"absolute", top:2, left: on ? 16 : 2, width:17, height:17, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.15)", transition:"left 200ms" }),
};
