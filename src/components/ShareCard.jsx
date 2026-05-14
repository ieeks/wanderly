import { forwardRef } from 'react';
import WanderlyLogo from './WanderlyLogo.jsx';

const ShareCard = forwardRef(({ trip, family }, ref) => {
  return (
    <div ref={ref} style={{
      width: 1080,
      height: 1080,
      position: 'fixed',
      top: -9999,
      left: -9999,
      overflow: 'hidden',
      background: trip.bg,
      fontFamily: "'Manrope', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>

      {/* Top glow */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
        background: 'linear-gradient(0deg, rgba(45,31,21,0.55) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Top bar: logo + year */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '56px 60px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <WanderlyLogo size={64} />
          <span style={{
            fontSize: 40, fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.02em',
          }}>wanderly</span>
        </div>
        <div style={{
          padding: '10px 28px', borderRadius: 999,
          background: 'rgba(255,255,255,0.2)',
          fontSize: 28, fontWeight: 600, color: 'white',
        }}>2026</div>
      </div>

      {/* Emoji — centred */}
      <div style={{
        position: 'absolute',
        top: '22%', left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 220, lineHeight: 1,
        filter: 'drop-shadow(0 16px 40px rgba(45,31,21,0.2))',
        userSelect: 'none',
      }}>{trip.emoji}</div>

      {/* Bottom content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 60px 64px',
      }}>

        {/* Family avatars */}
        {family && family.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
            {family.map((f, i) => (
              <div key={f.id} style={{
                width: 72, height: 72, borderRadius: '50%',
                background: f.bg || '#C96F4A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 700, color: '#2D1F15',
                boxShadow: '0 0 0 4px rgba(255,255,255,0.85)',
                marginLeft: i > 0 ? -22 : 0,
                position: 'relative', zIndex: family.length - i,
                flexShrink: 0,
              }}>{(f.init || f.name || '?')[0]}</div>
            ))}
            <div style={{
              marginLeft: 28, fontSize: 28, fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
            }}>Familie · {family.length} {family.length === 1 ? 'Person' : 'Personen'}</div>
          </div>
        )}

        {/* Trip name */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: trip.name.length > 10 ? 100 : 140,
          fontWeight: 700, lineHeight: 1,
          color: 'white', letterSpacing: '-0.02em',
          textShadow: '0 4px 20px rgba(45,31,21,0.3)',
          marginBottom: 20,
        }}>{trip.name}</div>

        {/* Route + dates */}
        <div style={{
          fontSize: 34, fontWeight: 500,
          color: 'rgba(255,255,255,0.85)',
          marginBottom: 40,
        }}>{trip.route} · {trip.dates}</div>

        {/* Pill row */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: trip.short },
            { label: '€ ' + trip.total.toLocaleString('de-AT') },
            ...(trip.flight?.no ? [{ label: '✈ ' + trip.flight.no }] : []),
            ...(trip.train?.no  ? [{ label: '🚂 ' + trip.train.no }] : []),
          ].map((pill, i) => (
            <div key={i} style={{
              padding: '14px 30px', borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              fontSize: 28, fontWeight: 700, color: 'white',
              display: 'flex', alignItems: 'center',
              whiteSpace: 'nowrap',
            }}>{pill.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
export default ShareCard;
