import { S } from '../styles/shared.js';

export default function Progress({ pct, dark }) {
  return (
    <div style={{ ...S.progress, background: dark ? "rgba(251,244,230,0.15)" : "rgba(45,31,21,0.1)" }}>
      <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#C96F4A,#E6B545)", borderRadius:3 }} />
    </div>
  );
}
