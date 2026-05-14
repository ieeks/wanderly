import { useState, useEffect, useRef, createContext, useContext } from 'react';
import '../styles/desktop.css';

// ─── Context ─────────────────────────────────────────────────
const Ctx = createContext({});
const useCtx = () => useContext(Ctx);

// ─── Helpers ─────────────────────────────────────────────────
const MONTH_DE = { 'Jan':0,'Feb':1,'Mär':2,'Apr':3,'Mai':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Okt':9,'Nov':10,'Dez':11 };

function departureDateOf(trip) {
  const m  = (trip.dates || '').match(/^(\d+)/);
  const mo = Object.entries(MONTH_DE).find(([k]) => (trip.dates || '').includes(k));
  if (!m || !mo) return null;
  return new Date(2026, Number(mo[1]), parseInt(m[1]));
}

function daysUntil(trip) {
  const d = departureDateOf(trip);
  if (!d) return null;
  return Math.round((d - new Date()) / 86400000);
}

function nextUpcomingTrip(trips) {
  const today = new Date();
  const sorted = [...trips]
    .map(t => ({ t, d: departureDateOf(t) }))
    .filter(({ d }) => d && d >= today)
    .sort((a, b) => a.d - b.d);
  return sorted[0]?.t || trips[0];
}

function getTint(trip) {
  if (trip.tint) return trip.tint;
  const bg = trip.bg || '';
  if (bg.includes('E8D2DC') || bg.includes('C9A3B4')) return 'tint-plum';
  if (bg.includes('D7E2C6') || bg.includes('9DB084') || bg.includes('B0C49A')) return 'tint-sage';
  if (bg.includes('D2E2EA') || bg.includes('94B5C2')) return 'tint-sky';
  if (bg.includes('F8DEC4') || bg.includes('ECAE84')) return 'tint-peach';
  return 'tint-sand';
}

const AV_CSS = new Set(['b1','b2','b3','b4']);
function avClass(f) { return AV_CSS.has(f.bg) ? `av ${f.bg}` : 'av'; }
function avStyle(f) { return AV_CSS.has(f.bg) ? {} : { background: f.bg || '#F0B58A', color: f.fg || '#2D1F15' }; }
function fmtEuro(n) { return (n || 0).toLocaleString('de-AT', { minimumFractionDigits:2, maximumFractionDigits:2 }); }

// ─── useEmlDrop ───────────────────────────────────────────────
function useEmlDrop(ref) {
  const [over, setOver] = useState(false);
  const [last, setLast] = useState(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let depth = 0;
    const onOver  = e => e.preventDefault();
    const onEnter = () => { depth++; setOver(true); };
    const onLeave = () => { if (--depth <= 0) { depth = 0; setOver(false); } };
    const onDrop  = e => {
      e.preventDefault(); depth = 0; setOver(false);
      const f = e.dataTransfer?.files?.[0];
      setLast(f?.name || 'booking.eml');
      setTimeout(() => setLast(null), 2400);
    };
    el.addEventListener('dragover', onOver);
    el.addEventListener('dragenter', onEnter);
    el.addEventListener('dragleave', onLeave);
    el.addEventListener('drop', onDrop);
    return () => { el.removeEventListener('dragover', onOver); el.removeEventListener('dragenter', onEnter); el.removeEventListener('dragleave', onLeave); el.removeEventListener('drop', onDrop); };
  }, [ref]);
  return { over, last };
}

// ─── DropVeil ─────────────────────────────────────────────────
function DropVeil({ on, fileName }) {
  return (
    <div className={'drop-veil' + (on ? ' on' : '')}>
      <div className="pill">
        {fileName ? <>✓ <span style={{ fontFamily:'var(--mono)', fontSize:16, marginLeft:8 }}>{fileName}</span> erkannt</> : <>📥 .eml hier ablegen — wanderly liest automatisch</>}
      </div>
    </div>
  );
}

// ─── Av (avatar helper) ───────────────────────────────────────
function Av({ f, size = 28, fontSize = 13, style: extra = {} }) {
  return (
    <div className={avClass(f)} style={{ ...avStyle(f), width:size, height:size, fontSize, ...extra }}>
      {(f.init || f.name || '?')[0]}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────
function Sidebar({ activeView, activeTrip, collapsed, onToggleCollapse, onSelectView, onSelectTrip }) {
  const { trips, family } = useCtx();
  const NAV = [
    { id:'dashboard', l:'Dashboard',     ic:'◐' },
    { id:'trips',     l:'Alle Reisen',   ic:'🧳' },
    { id:'inbox',     l:'Inbox',         ic:'📥', badge:3 },
    { id:'family',    l:'Familie',       ic:'👨‍👩‍👦' },
    { id:'split',     l:'Split & Settle',ic:'⇄' },
    { id:'docs',      l:'Dokumente',     ic:'📁' },
  ];
  return (
    <div className="sb" data-sidebar={collapsed ? 'collapsed' : 'open'}>
      <div style={{ padding:'20px 22px 12px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#C96F4A,#E6B545)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'var(--serif)', fontWeight:700, fontSize:16, boxShadow:'0 4px 10px rgba(201,111,74,0.30)', flexShrink:0 }}>w</div>
        <div className="sb-hide" style={{ minWidth:0 }}>
          <div className="serif" style={{ fontSize:18, fontWeight:600, letterSpacing:'-0.01em' }}>wanderly</div>
          <div className="mono" style={{ fontSize:10, color:'var(--muted)', letterSpacing:'0.12em', textTransform:'uppercase' }}>familie · 2026</div>
        </div>
        <div style={{ marginLeft:'auto', cursor:'pointer', padding:6, borderRadius:8, color:'var(--muted)' }} onClick={onToggleCollapse}>{collapsed ? '›' : '‹'}</div>
      </div>

      <div className="sb-h"><span className="sb-h-text">Navigation</span></div>
      <div className="col" style={{ gap:2 }}>
        {NAV.map(n => (
          <div key={n.id} className={'sb-item' + (activeView === n.id ? ' active' : '')} onClick={() => onSelectView(n.id)}>
            <span className="dot">{n.ic}</span>
            <span className="sb-label grow">{n.l}</span>
            {n.badge && <span className="chip sb-label" style={{ padding:'1px 7px', fontSize:10 }}>{n.badge}</span>}
          </div>
        ))}
      </div>

      <div className="sb-h"><span className="sb-h-text">Reisen · 2026</span></div>
      <div className="scroll" style={{ flex:1, paddingBottom:12 }}>
        {trips.map(t => (
          <div key={t.id} className={'sb-trip' + (activeTrip === t.id ? ' active' : '')} onClick={() => onSelectTrip(t.id)}>
            <div className="swatch" style={{ background:t.bg }}>{t.emoji}</div>
            <div className="grow sb-trip-meta" style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, lineHeight:1.15 }}>{t.name}</div>
              <div className="mono" style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>{t.dates} · {(t.short || '').split(' · ')[0]}</div>
            </div>
            {t.due > 0 && <span className="chip warn sb-hide" style={{ padding:'2px 7px', fontSize:10 }}>⏰</span>}
          </div>
        ))}
      </div>

      <div style={{ padding:'14px 18px 16px', borderTop:'0.5px solid var(--line)', display:'flex', alignItems:'center', gap:10 }}>
        <div className="row" style={{ marginLeft:-4 }}>
          {family.slice(0,4).map(f => <Av key={f.id} f={f} size={26} fontSize={11} style={{ marginLeft:-8 }} />)}
        </div>
        <div className="sb-hide grow" style={{ minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600 }}>Familie</div>
          <div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>{family.length} reisende · online</div>
        </div>
      </div>
    </div>
  );
}

// ─── Titlebar ─────────────────────────────────────────────────
function Titlebar({ breadcrumbs }) {
  return (
    <div className="titlebar">
      <div className="lights"><span className="r" /><span className="y" /><span className="g" /></div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:16, fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)' }}>
        {breadcrumbs.map((b, i) => (
          <span key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
            {i > 0 && <span style={{ opacity:0.5 }}>›</span>}
            <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--ink-2)' : 'var(--muted)', fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>{b}</span>
          </span>
        ))}
      </div>
      <div className="titlebar-right"><span className="kbd">⌘K</span><span>Suche</span></div>
    </div>
  );
}

// ─── BoardingPass ─────────────────────────────────────────────
function BoardingPass({ trip }) {
  const { family } = useCtx();
  const pax = (
    <div className="pax">
      {family.map(fp => (
        <div key={fp.id} className="pax-row">
          <span className="who"><Av f={fp} size={22} fontSize={10} />{fp.name}</span>
          <span className="seat">{fp.seat1 || '—'} / {fp.seat2 || '—'}</span>
        </div>
      ))}
    </div>
  );

  if (trip.flight) {
    const f = trip.flight;
    return (
      <div className="bpass">
        <div className="route">
          <div className="col" style={{ alignItems:'flex-start' }}><div className="iata">{f.from}</div><div className="city">{f.fromCity}{f.terminal ? ` · T${f.terminal}` : ''}</div></div>
          <div className="col-mid">
            <div className="dashline"><div className="dash" /><div className="icon">✈</div><div className="dash" /></div>
            <div className="mono" style={{ fontSize:10, color:'rgba(45,31,21,0.55)', letterSpacing:'0.12em' }}>DIRECT</div>
          </div>
          <div className="col" style={{ alignItems:'flex-end' }}><div className="iata">{f.to}</div><div className="city">{f.toCity}</div></div>
        </div>
        <div className="meta">
          <div><div className="k">Datum</div><div className="v">{f.date}</div></div>
          <div><div className="k">Flug</div><div className="v">{f.no}</div></div>
          <div><div className="k">Abflug</div><div className="v">{f.depart}</div></div>
          <div><div className="k">Ankunft</div><div className="v">{f.arrive}</div></div>
        </div>
        <div className="perf" />{pax}
      </div>
    );
  }
  if (trip.train) {
    const t = trip.train;
    return (
      <div className="bpass" style={{ background:'linear-gradient(180deg,#D2E2EA,#94B5C2)', boxShadow:'0 18px 50px rgba(67,107,124,0.28)' }}>
        <div className="route">
          <div className="col" style={{ alignItems:'flex-start' }}><div className="iata" style={{ fontSize:40 }}>{t.from}</div><div className="city">Hbf</div></div>
          <div className="col-mid"><div className="dashline"><div className="dash" /><div className="icon">🚆</div><div className="dash" /></div><div className="mono" style={{ fontSize:10, color:'rgba(45,31,21,0.55)' }}>{t.no}</div></div>
          <div className="col" style={{ alignItems:'flex-end' }}><div className="iata" style={{ fontSize:40 }}>{t.to}</div><div className="city">Bhf</div></div>
        </div>
        <div className="meta">
          <div><div className="k">Datum</div><div className="v">{t.date}</div></div>
          <div><div className="k">Zug</div><div className="v">{t.no}</div></div>
          <div><div className="k">Wagen</div><div className="v">{t.wagon || '—'}</div></div>
          <div><div className="k">Sitze</div><div className="v">{t.seats || '—'}</div></div>
        </div>
        <div className="perf" />{pax}
      </div>
    );
  }
  if (trip.drive) {
    const d = trip.drive;
    const parts = (d.date || '').split('·');
    return (
      <div className="bpass" style={{ background:'linear-gradient(180deg,#EFD8E1,#C9A3B4)', boxShadow:'0 18px 50px rgba(156,99,119,0.28)' }}>
        <div className="route">
          <div className="col" style={{ alignItems:'flex-start' }}><div className="iata" style={{ fontSize:48 }}>{d.from}</div><div className="city">start</div></div>
          <div className="col-mid"><div className="dashline"><div className="dash" /><div className="icon">🚗</div><div className="dash" /></div><div className="mono" style={{ fontSize:10, color:'rgba(45,31,21,0.55)' }}>{d.km} km · {d.time}</div></div>
          <div className="col" style={{ alignItems:'flex-end' }}><div className="iata" style={{ fontSize:48 }}>{d.to}</div><div className="city">ziel</div></div>
        </div>
        <div className="meta">
          <div><div className="k">Tag</div><div className="v">{parts[0]?.trim() || '—'}</div></div>
          <div><div className="k">Zeit</div><div className="v">{parts[1]?.trim() || '—'}</div></div>
          <div><div className="k">Distanz</div><div className="v">{d.km} km</div></div>
          <div><div className="k">Fahrzeit</div><div className="v">{d.time}</div></div>
        </div>
        <div className="perf" />{pax}
      </div>
    );
  }
  return null;
}

// ─── CountdownCard ────────────────────────────────────────────
function CountdownCard({ trip }) {
  const days = daysUntil(trip);
  const depDate = trip.flight?.date || trip.train?.date || (trip.drive?.date || '').split('·')[0]?.trim() || '';
  const depTime = trip.flight?.depart || trip.train?.depart || (trip.drive?.date || '').split('·')[1]?.trim() || '';
  const depMeta = trip.flight ? `${trip.flight.from}${trip.flight.terminal ? ` · T${trip.flight.terminal}` : ''}${trip.flight.gate ? ` · ${trip.flight.gate}` : ''}` : trip.train ? trip.train.no : '🚗';
  return (
    <div className="card ink" style={{ background:'linear-gradient(160deg,#2D1F15,#4a2f1f)' }}>
      <div className="label">Countdown</div>
      <div className="display" style={{ fontSize:72, marginTop:4, lineHeight:0.95 }}>
        {days === null ? '?' : days < 0 ? '✓' : days}
        <span style={{ fontSize:24, marginLeft:8, opacity:0.6 }}>{days !== null && days < 0 ? ' vorbei' : ' Tage'}</span>
      </div>
      <div className="row between" style={{ marginTop:12, fontFamily:'var(--mono)', fontSize:11, color:'rgba(251,244,230,0.6)' }}>
        <span>{depDate} · {depTime}</span>
        <span>{depMeta}</span>
      </div>
    </div>
  );
}

// ─── BudgetCard ───────────────────────────────────────────────
function BudgetCard({ trip }) {
  const pct = trip.total > 0 ? trip.paid / trip.total * 100 : 0;
  return (
    <div className="card">
      <div className="row between">
        <span className="label">💰 Budget · {trip.name}</span>
        <span className="mono" style={{ fontSize:10, color:'var(--muted)' }}>{Math.round(pct)}% paid</span>
      </div>
      <div className="display" style={{ fontSize:36, marginTop:6, letterSpacing:'-0.015em' }}>€ {(trip.total||0).toLocaleString('de-AT')}</div>
      <div className="progress" style={{ marginTop:10 }}><i style={{ width:pct+'%' }} /></div>
      <div className="row between" style={{ marginTop:10 }}>
        <div>
          <div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>PAID</div>
          <div className="serif" style={{ fontSize:18, fontWeight:600, color:'var(--sage-d)' }}>€ {(trip.paid||0).toLocaleString('de-AT')}</div>
        </div>
        {trip.due > 0 ? (
          <div style={{ textAlign:'right' }}>
            <div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>OFFEN{trip.dueDate ? ` · ${trip.dueDate}` : ''}</div>
            <div className="serif" style={{ fontSize:18, fontWeight:600, color:'var(--terra)' }}>€ {trip.due.toLocaleString('de-AT')}</div>
          </div>
        ) : (
          <span className="chip paid">✓ vollständig bezahlt</span>
        )}
      </div>
      {trip.due > 0 && <button className="btn terra" style={{ width:'100%', marginTop:14, padding:12, justifyContent:'center' }}>Restzahlung jetzt veranlassen</button>}
    </div>
  );
}

// ─── SplitMiniCard ────────────────────────────────────────────
function SplitMiniCard() {
  const { expenses, family } = useCtx();
  const unsettled = expenses.filter(e => !e.settled);
  const n = family.length || 2;
  const bal = {};
  family.forEach(f => { bal[f.id] = 0; });
  unsettled.forEach(e => { const ea = e.amt/n; family.forEach(f => { bal[f.id] += f.id === e.payerId ? e.amt-ea : -ea; }); });
  let creditor = null, debtor = null;
  family.forEach(f => { const b = bal[f.id]||0; if (b>0 && (!creditor||b>bal[creditor.id])) creditor=f; if (b<0 && (!debtor||b<bal[debtor.id])) debtor=f; });
  const saldo = creditor ? Math.abs(bal[creditor.id]) : 0;
  return (
    <div className="card tint-sand">
      <div className="label">⇄ Familien-Split</div>
      {saldo > 0 && debtor && creditor ? (
        <>
          <div className="display" style={{ fontSize:22, marginTop:8 }}>{debtor.name} schuldet € {fmtEuro(saldo)}</div>
          <div className="row" style={{ gap:8, marginTop:10 }}>
            {family.slice(0,4).map(f => (
              <div key={f.id} style={{ flex:1 }}>
                <Av f={f} size={22} fontSize={10} />
                <div className="mono" style={{ fontSize:10, marginTop:4, color:bal[f.id]>0?'var(--sage-d)':bal[f.id]<0?'var(--terra)':'var(--muted)', fontWeight:600 }}>
                  {bal[f.id]>0?`+€${Math.round(bal[f.id])}`:bal[f.id]<0?`-€${Math.round(Math.abs(bal[f.id]))}` : '✓'}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mono" style={{ fontSize:13, color:'var(--muted)', marginTop:8 }}>Alles ausgeglichen ✓</div>
      )}
    </div>
  );
}

// ─── InboxMiniCard ────────────────────────────────────────────
function InboxMiniCard({ onOpen }) {
  const { inboxItems } = useCtx();
  const unread = inboxItems.filter(i => !i.read);
  return (
    <div className="card">
      <div className="row between" style={{ marginBottom:8 }}>
        <span className="label">📥 Inbox · neu</span>
        {unread.length > 0 && <span className="chip warn" style={{ fontSize:10 }}>{unread.length} ungelesen</span>}
      </div>
      {inboxItems.slice(0,3).map((m,i) => (
        <div key={m.id||i} className="row" style={{ gap:10, padding:'8px 0', borderBottom:i<2?'1px solid var(--line-2)':'none' }}>
          {!m.read && <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--terra)', flexShrink:0 }} />}
          <div className="grow" style={{ minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.subject}</div>
            <div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>{m.from}</div>
          </div>
        </div>
      ))}
      <div className="mono" style={{ fontSize:10, color:'var(--terra)', fontWeight:600, marginTop:10, textAlign:'center', cursor:'pointer' }} onClick={onOpen}>Inbox öffnen →</div>
    </div>
  );
}

// ─── ExtrasGrid ───────────────────────────────────────────────
function ExtrasGrid({ trip }) {
  const ex = trip.extras || {};
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--d-gap)' }}>
      <div className="card"><div className="label" style={{ fontSize:10 }}>🛡 Versicherung</div><div className="display" style={{ fontSize:17, marginTop:6 }}>{ex.insurance ? 'Europäische' : '—'}</div><div className="mono" style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>{ex.insurance ? 'Reise-Komplett · 4 Pax' : 'keine gebucht'}</div></div>
      <div className="card" style={{ background:ex.rental==='pending'?'rgba(255,255,255,0.45)':'var(--paper)', border:ex.rental==='pending'?'1.5px dashed var(--line)':'none' }}>
        <div className="label" style={{ fontSize:10 }}>🚗 Mietwagen</div>
        <div className="display" style={{ fontSize:17, marginTop:6, color:ex.rental==='pending'?'var(--muted)':'inherit' }}>{ex.rental==='pending'?'nicht gebucht':ex.rental||'—'}</div>
        {ex.rental==='pending' && <div className="mono" style={{ fontSize:10, color:'var(--terra)', fontWeight:600, marginTop:2 }}>+ hinzufügen</div>}
      </div>
      <div className="card"><div className="label" style={{ fontSize:10 }}>🍷 Reservierung</div><div className="display" style={{ fontSize:17, marginTop:6 }}>{ex.restaurant?ex.restaurant.split(' · ')[0]:ex.skipass?'Skipass':'—'}</div><div className="mono" style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>{ex.restaurant?ex.restaurant.split(' · ')[1]||'':ex.skipass||'noch keine'}</div></div>
      <div className="card"><div className="label" style={{ fontSize:10 }}>🏖 Aktivitäten</div><div className="display" style={{ fontSize:17, marginTop:6 }}>—</div><div className="mono" style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>noch keine</div></div>
    </div>
  );
}

// ─── Hotel card (reused in dashboard + detail) ────────────────
function HotelCard({ trip }) {
  const tint = getTint(trip);
  return (
    <div className={`card ${tint}`}>
      <div className="row between">
        <span className="label">🏨 Hotel</span>
        {trip.due > 0 && <span className="chip warn">⏰ bis {trip.dueDate}</span>}
      </div>
      <div className="display" style={{ fontSize:30, marginTop:8, lineHeight:1.1, letterSpacing:'-0.015em' }}>{trip.hotel?.name || '—'}</div>
      <div className="mono" style={{ fontSize:12, color:'rgba(45,31,21,0.65)', marginTop:6 }}>{trip.hotel?.loc || ''}</div>
      <div className="row between" style={{ marginTop:18, alignItems:'flex-end' }}>
        <div><div className="label" style={{ fontSize:10 }}>Check-in</div><div className="serif" style={{ fontWeight:600, fontSize:18, marginTop:2 }}>{trip.hotel?.ci || '—'}</div></div>
        <div className="mono muted" style={{ fontSize:11 }}>──── Nächte ────</div>
        <div style={{ textAlign:'right' }}><div className="label" style={{ fontSize:10 }}>Check-out</div><div className="serif" style={{ fontWeight:600, fontSize:18, marginTop:2 }}>{trip.hotel?.co || '—'}</div></div>
      </div>
    </div>
  );
}

// ─── DashboardView ────────────────────────────────────────────
function DashboardView({ trip, onOpenInbox, onSelectTrip }) {
  const { trips } = useCtx();
  const others = trips.filter(t => t.id !== trip.id);
  return (
    <div style={{ padding:'var(--d-pad)', position:'relative' }}>
      <div className="row between" style={{ alignItems:'flex-end', marginBottom:22 }}>
        <div>
          <div className="eyebrow">Nächste Reise</div>
          <div className="display" style={{ fontSize:56, lineHeight:1, marginTop:6, letterSpacing:'-0.025em' }}>{trip.name} <span style={{ fontSize:44 }}>{trip.emoji}</span></div>
          <div className="mono" style={{ fontSize:12, color:'var(--muted)', marginTop:8, letterSpacing:'0.08em' }}>{(trip.route||'').toUpperCase()} · {(trip.dates||'').toUpperCase()} 2026 · {(trip.short||'').toUpperCase()}</div>
        </div>
        <div className="row" style={{ gap:8 }}>
          <button className="btn ghost">📁 Dokumente</button>
          <button className="btn ghost">♡</button>
          <button className="btn terra">↗ teilen</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'var(--d-gap)' }}>
        <div className="col" style={{ gap:'var(--d-gap)' }}>
          <BoardingPass trip={trip} />
          <HotelCard trip={trip} />
          <ExtrasGrid trip={trip} />
        </div>
        <div className="col" style={{ gap:'var(--d-gap)' }}>
          <CountdownCard trip={trip} />
          <BudgetCard trip={trip} />
          <SplitMiniCard />
          <InboxMiniCard onOpen={onOpenInbox} />
        </div>
      </div>

      {others.length > 0 && (
        <div style={{ marginTop:28 }}>
          <div className="row between" style={{ marginBottom:12 }}>
            <span className="label">Weitere Reisen · 2026</span>
            <span className="mono" style={{ fontSize:11, color:'var(--terra)', fontWeight:600, cursor:'pointer' }}>alle ansehen →</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(others.length,3)},1fr)`, gap:'var(--d-gap)' }}>
            {others.slice(0,3).map(t => (
              <div key={t.id} className="card" style={{ background:t.bg, cursor:'pointer', transition:'transform 180ms' }}
                   onClick={() => onSelectTrip(t.id)}
                   onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                   onMouseLeave={e => e.currentTarget.style.transform='none'}>
                <div className="row between" style={{ alignItems:'flex-start' }}>
                  <div>
                    <div className="eyebrow" style={{ color:'rgba(45,31,21,0.55)' }}>{t.dates}</div>
                    <div className="display" style={{ fontSize:26, marginTop:4, lineHeight:1 }}>{t.name} <span style={{ fontSize:20 }}>{t.emoji}</span></div>
                    <div className="mono" style={{ fontSize:11, color:'rgba(45,31,21,0.6)', marginTop:4 }}>{t.route}</div>
                  </div>
                  <div className="serif" style={{ fontSize:22, fontWeight:600 }}>€ {(t.total||0).toLocaleString('de-AT')}</div>
                </div>
                <div className="row between" style={{ marginTop:14 }}>
                  <span className="mono" style={{ fontSize:11, color:'rgba(45,31,21,0.65)' }}>{t.short}</span>
                  {t.due>0 ? <span className="chip warn">⏰ {t.dueDate}</span> : <span className="chip paid">✓ paid</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TripDetailView ───────────────────────────────────────────
function TripDetailView({ trip, onBack }) {
  const { family } = useCtx();
  return (
    <div style={{ padding:'var(--d-pad)', position:'relative' }}>
      <div className="row between" style={{ alignItems:'flex-end', marginBottom:22 }}>
        <div>
          <div className="row" style={{ gap:10, color:'var(--muted)', fontFamily:'var(--mono)', fontSize:11, marginBottom:6, cursor:'pointer' }} onClick={onBack}>← Dashboard</div>
          <div className="eyebrow">{trip.dates} 2026 · {trip.short}</div>
          <div className="display" style={{ fontSize:56, lineHeight:1, marginTop:6, letterSpacing:'-0.025em' }}>{trip.name} <span style={{ fontSize:44 }}>{trip.emoji}</span></div>
          <div className="mono" style={{ fontSize:12, color:'var(--muted)', marginTop:8, letterSpacing:'0.08em' }}>{(trip.route||'').toUpperCase()}</div>
        </div>
        <div className="row" style={{ gap:8 }}>
          <button className="btn ghost">📁 Dokumente</button>
          <button className="btn ghost">📅 Kalender</button>
          <button className="btn terra">↗ teilen</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'var(--d-gap)' }}>
        <div className="col" style={{ gap:'var(--d-gap)' }}>
          <BoardingPass trip={trip} />
          <HotelCard trip={trip} />
          <ExtrasGrid trip={trip} />
          {trip.itinerary?.length > 0 && (
            <div className="card">
              <div className="label" style={{ marginBottom:10 }}>Tagesplan</div>
              {trip.itinerary.slice(0,2).map((day,di) => (
                <div key={di}>
                  <div className="mono" style={{ fontSize:10, color:'var(--muted)', marginBottom:4, marginTop:di>0?10:0 }}>{day.day}</div>
                  {(day.items||[]).map((item,ii) => (
                    <div key={ii} className="row" style={{ padding:'8px 0', gap:14, borderBottom:'0.5px solid var(--line-2)' }}>
                      <div style={{ width:50, fontFamily:'var(--mono)', fontSize:12, fontWeight:600 }}>{item.time}</div>
                      <div className="grow" style={{ fontSize:13, fontWeight:500 }}>{item.label}</div>
                      <div className="mono" style={{ fontSize:11, color:'var(--muted)' }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col" style={{ gap:'var(--d-gap)' }}>
          <CountdownCard trip={trip} />
          <BudgetCard trip={trip} />
          <div className="card">
            <div className="label" style={{ marginBottom:10 }}>Reisende · {family.length} Pax</div>
            {family.map((f,i) => (
              <div key={f.id} className="row" style={{ padding:'8px 0', gap:12, borderBottom:i<family.length-1?'0.5px solid var(--line-2)':'none' }}>
                <Av f={f} />
                <div className="grow"><div style={{ fontSize:13, fontWeight:600 }}>{f.name}</div></div>
                {trip.flight && <div className="mono" style={{ fontSize:11, color:'var(--muted)' }}>{f.seat1||'—'} · {f.seat2||'—'}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AllTripsView ─────────────────────────────────────────────
function AllTripsView({ onSelectTrip }) {
  const { trips } = useCtx();
  const total = trips.reduce((s,t) => s+(t.total||0), 0);
  return (
    <div style={{ padding:'var(--d-pad)' }}>
      <div className="row between" style={{ alignItems:'flex-end', marginBottom:22 }}>
        <div>
          <div className="eyebrow">Alle Reisen · 2026</div>
          <div className="display" style={{ fontSize:48, marginTop:4, letterSpacing:'-0.02em' }}>Reisejahr</div>
          <div className="mono" style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>{trips.length} Reisen · € {total.toLocaleString('de-AT')} gesamt</div>
        </div>
        <div className="row" style={{ gap:8 }}>
          <button className="btn ghost">📅 iCal</button>
          <button className="btn terra">+ Neue Reise</button>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'var(--d-gap)' }}>
        {trips.map(t => (
          <div key={t.id} className="card" style={{ background:t.bg, padding:0, cursor:'pointer', overflow:'hidden', transition:'transform 180ms' }}
               onClick={() => onSelectTrip(t.id)}
               onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
               onMouseLeave={e => e.currentTarget.style.transform='none'}>
            <div style={{ padding:'var(--d-pad)' }}>
              <div className="row between" style={{ alignItems:'flex-start' }}>
                <div>
                  <div className="eyebrow" style={{ color:'rgba(45,31,21,0.55)' }}>{t.dates} 2026</div>
                  <div className="display" style={{ fontSize:38, marginTop:6, lineHeight:0.95, letterSpacing:'-0.02em' }}>{t.name} <span style={{ fontSize:30 }}>{t.emoji}</span></div>
                  <div className="mono" style={{ fontSize:11, color:'rgba(45,31,21,0.6)', marginTop:6 }}>{t.route} · {t.short}</div>
                </div>
                <div className="serif" style={{ fontSize:28, fontWeight:600 }}>€ {(t.total||0).toLocaleString('de-AT')}</div>
              </div>
              <div className="progress" style={{ marginTop:14, background:'rgba(45,31,21,0.12)' }}>
                <i style={{ width:(t.total>0?t.paid/t.total*100:0)+'%' }} />
              </div>
              <div className="row between" style={{ marginTop:8 }}>
                <span className="mono" style={{ fontSize:11, color:'var(--sage-d)', fontWeight:700 }}>€ {(t.paid||0).toLocaleString('de-AT')} paid</span>
                {t.due>0 ? <span className="chip warn">⏰ {t.dueDate}</span> : <span className="chip paid">✓ paid</span>}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.55)', backdropFilter:'blur(8px)', padding:'10px var(--d-pad)', display:'flex', justifyContent:'space-between', borderTop:'0.5px solid rgba(45,31,21,0.06)' }}>
              <span className="mono" style={{ fontSize:10, color:'rgba(45,31,21,0.6)' }}>
                {[t.flight&&'✈ Flug', t.train&&'🚆 Zug', t.drive&&'🚗 Auto', '🏨 Hotel', t.extras?.insurance&&'🛡', t.extras?.skipass&&'⛷'].filter(Boolean).join(' · ')}
              </span>
              <span className="mono" style={{ fontSize:10, color:'var(--terra)', fontWeight:700 }}>öffnen →</span>
            </div>
          </div>
        ))}
        <div className="card" style={{ background:'transparent', border:'2px dashed var(--line)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:280, cursor:'pointer' }}>
          <div style={{ textAlign:'center', color:'var(--muted)' }}>
            <div className="display" style={{ fontSize:32, marginBottom:6 }}>+</div>
            <div className="mono" style={{ fontSize:11, letterSpacing:'0.10em', textTransform:'uppercase' }}>Neue Reise hinzufügen</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── InboxView ────────────────────────────────────────────────
function InboxView() {
  const { inboxItems, trips } = useCtx();
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding:'var(--d-pad)' }}>
      <div className="row between" style={{ alignItems:'flex-end', marginBottom:22 }}>
        <div>
          <div className="eyebrow">Inbox · auto-parsed</div>
          <div className="display" style={{ fontSize:48, marginTop:4 }}>Eingehende Buchungen</div>
          <div className="mono" style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>{inboxItems.length} erkannt · {inboxItems.filter(i=>i.read).length} zugeordnet</div>
        </div>
        <button className="btn terra">📥 .eml hochladen</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'var(--d-gap)' }}>
        <div className="card" style={{ padding:0 }}>
          <div className="row between" style={{ padding:'14px var(--d-pad)', borderBottom:'0.5px solid var(--line-2)' }}>
            <span className="label">{inboxItems.length} Mails</span>
          </div>
          {inboxItems.map((m,i) => {
            const mt = trips.find(t => m.trip_id ? t.id===m.trip_id : (m.subject||'').toLowerCase().includes((t.name||'').toLowerCase()));
            return (
              <div key={m.id||i} onClick={() => setSelected(selected===i?null:i)}
                   style={{ padding:'14px var(--d-pad)', borderBottom:i<inboxItems.length-1?'0.5px solid var(--line-2)':'none', cursor:'pointer', background:selected===i?'rgba(201,111,74,0.10)':'transparent', borderLeft:selected===i?'3px solid var(--terra)':'3px solid transparent' }}>
                <div className="row between">
                  <div style={{ fontSize:13, fontWeight:700 }}>{m.from||'—'}</div>
                  <div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>{m.time||m.date||''}</div>
                </div>
                <div style={{ fontSize:13, marginTop:2, color:'var(--ink-2)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.subject}</div>
                <div className="row" style={{ marginTop:8, gap:6 }}>
                  {!m.read && <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--terra)', flexShrink:0 }} />}
                  {mt && <span className="chip" style={{ fontSize:10, padding:'1px 7px', background:mt.bg, border:'none' }}>{mt.emoji} {mt.name}</span>}
                  <span className={`chip ${m.read?'paid':'warn'}`} style={{ fontSize:10 }}>{m.read?'✓ gelesen':'⏰ ungelesen'}</span>
                </div>
              </div>
            );
          })}
          <div style={{ padding:18, margin:14, border:'2px dashed var(--line)', borderRadius:14, textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>📥</div>
            <div style={{ fontSize:13, fontWeight:600 }}>.eml hierher ziehen</div>
            <div className="mono" style={{ fontSize:10, color:'var(--muted)', marginTop:4 }}>wanderly liest automatisch</div>
          </div>
        </div>
        <div>
          {selected !== null ? (
            <div className="card">
              <div className="label" style={{ marginBottom:8 }}>E-Mail Details</div>
              <div className="display" style={{ fontSize:20, marginTop:4 }}>{inboxItems[selected]?.subject}</div>
              <div className="mono" style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>{inboxItems[selected]?.from}</div>
              {inboxItems[selected]?.body && <p style={{ fontSize:13, lineHeight:1.6, marginTop:16 }}>{inboxItems[selected].body}</p>}
            </div>
          ) : (
            <div className="card" style={{ background:'rgba(255,255,255,0.55)', border:'1.5px dashed var(--line)', textAlign:'center', padding:36 }}>
              <div style={{ fontSize:36, marginBottom:8, opacity:0.4 }}>📨</div>
              <div className="serif" style={{ fontSize:20, fontWeight:600 }}>Mail anklicken</div>
              <div className="mono" style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>oder .eml ins Fenster ziehen</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SplitView ────────────────────────────────────────────────
const EXPENSE_ICONS = ['✈','🏨','🍽','🚗','🛡','🛍','🎫','•'];

function SplitView() {
  const { expenses, family } = useCtx();
  const unsettled = expenses.filter(e => !e.settled);
  const n = family.length || 2;
  const bal = {};
  family.forEach(f => { bal[f.id] = 0; });
  unsettled.forEach(e => { const ea = e.amt/n; family.forEach(f => { bal[f.id] += f.id===e.payerId ? e.amt-ea : -ea; }); });
  let creditor = null, debtor = null;
  family.forEach(f => { const b=bal[f.id]||0; if(b>0&&(!creditor||b>bal[creditor.id]))creditor=f; if(b<0&&(!debtor||b<bal[debtor.id]))debtor=f; });
  const saldo = creditor ? Math.abs(bal[creditor.id]) : 0;

  return (
    <div style={{ padding:'var(--d-pad)' }}>
      <div className="row between" style={{ alignItems:'flex-end', marginBottom:22 }}>
        <div>
          <div className="eyebrow">Split & Settle · Familie 2026</div>
          <div className="display" style={{ fontSize:48, marginTop:4 }}>Wer schuldet wem?</div>
          <div className="mono" style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>aus {unsettled.length} geteilten Buchungen</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'var(--d-gap)', marginBottom:'var(--d-gap)' }}>
        <div className="card tint-peach" style={{ overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', right:-20, bottom:-40, fontSize:220, opacity:0.06, fontFamily:'var(--serif)' }}>✿</div>
          <div className="label" style={{ position:'relative' }}>Aktueller Stand</div>
          {saldo > 0 && debtor && creditor ? (
            <>
              <div className="row" style={{ marginTop:18, gap:28, alignItems:'center', position:'relative' }}>
                <div className="col" style={{ alignItems:'center', gap:8 }}><Av f={debtor} size={80} fontSize={36} /><div style={{ fontSize:14, fontWeight:700 }}>{debtor.name}</div></div>
                <div className="col grow" style={{ alignItems:'center' }}>
                  <div className="mono" style={{ fontSize:10, color:'rgba(45,31,21,0.6)', letterSpacing:'0.10em' }}>SCHULDET</div>
                  <div className="display" style={{ fontSize:64, lineHeight:1, marginTop:4, letterSpacing:'-0.03em' }}>€ {fmtEuro(saldo)}</div>
                </div>
                <div className="col" style={{ alignItems:'center', gap:8 }}><Av f={creditor} size={80} fontSize={36} /><div style={{ fontSize:14, fontWeight:700 }}>{creditor.name}</div></div>
              </div>
              <div className="row" style={{ gap:10, marginTop:22, position:'relative' }}>
                <button className="btn terra grow" style={{ justifyContent:'center', padding:12 }}>📤 Anfrage senden</button>
                <button className="btn ghost grow" style={{ justifyContent:'center', padding:12, background:'rgba(255,255,255,0.55)' }}>als beglichen markieren</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div className="display" style={{ fontSize:48, color:'var(--sage-d)' }}>✓</div>
              <div style={{ fontWeight:600, marginTop:8 }}>Alles ausgeglichen</div>
            </div>
          )}
        </div>
        <div className="card">
          <div className="label" style={{ marginBottom:14 }}>Pro Person</div>
          {family.map((f,i) => {
            const b = bal[f.id]||0;
            return (
              <div key={f.id} className="row" style={{ padding:'12px 0', gap:14, borderBottom:i<family.length-1?'0.5px solid var(--line-2)':'none' }}>
                <Av f={f} />
                <div className="grow"><div style={{ fontSize:13, fontWeight:600 }}>{f.name}</div></div>
                <div style={{ textAlign:'right' }}>
                  <div className="serif" style={{ fontSize:18, fontWeight:600, color:b===0?'var(--muted)':b>0?'var(--sage-d)':'var(--terra)' }}>{b===0?'✓':(b>0?'+':'−')+' € '+Math.abs(b).toFixed(0)}</div>
                  <div className="mono" style={{ fontSize:9, color:'var(--muted)' }}>{b>0?'bekommt':b<0?'schuldet':'ausgeglichen'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {expenses.length > 0 && (
        <div>
          <div className="row between" style={{ marginBottom:10 }}>
            <span className="label">Geteilte Ausgaben · {expenses.length} Positionen</span>
          </div>
          <div className="card" style={{ padding:0 }}>
            <div className="row" style={{ padding:'12px var(--d-pad)', borderBottom:'0.5px solid var(--line-2)', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.10em', textTransform:'uppercase', color:'var(--muted)' }}>
              <div style={{ width:40 }} /><div className="grow">Buchung</div><div style={{ width:140 }}>bezahlt von</div><div style={{ width:100 }}>Datum</div><div style={{ width:100 }}>Split</div><div style={{ width:110, textAlign:'right' }}>Betrag</div><div style={{ width:110, textAlign:'right' }}>pro Person</div>
            </div>
            {expenses.map((e,i) => {
              const payer = family.find(f => f.id===e.payerId)||family[0];
              return (
                <div key={e.id} className="row" style={{ padding:'14px var(--d-pad)', borderBottom:i<expenses.length-1?'0.5px solid var(--line-2)':'none', opacity:e.settled?0.5:1 }}
                     onMouseEnter={el => el.currentTarget.style.background='rgba(255,255,255,0.45)'}
                     onMouseLeave={el => el.currentTarget.style.background='transparent'}>
                  <div style={{ width:40, fontSize:18 }}>{EXPENSE_ICONS[e.catIdx]||'•'}</div>
                  <div className="grow" style={{ fontSize:13, fontWeight:600, textDecoration:e.settled?'line-through':'none' }}>{e.desc}</div>
                  {payer && <div style={{ width:140 }} className="row"><Av f={payer} size={22} fontSize={11} /><span style={{ fontSize:12, marginLeft:8 }}>{payer.name}</span></div>}
                  <div style={{ width:100, fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)' }}>{e.date}</div>
                  <div style={{ width:100, fontFamily:'var(--mono)', fontSize:11, color:'var(--ink-2)' }}>50 / 50</div>
                  <div className="serif" style={{ width:110, textAlign:'right' }}>€ {fmtEuro(e.amt)}</div>
                  <div className="mono muted" style={{ width:110, textAlign:'right' }}>€ {fmtEuro(e.amt/n)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FamilyView ───────────────────────────────────────────────
function FamilyView() {
  const { family, trips } = useCtx();
  return (
    <div style={{ padding:'var(--d-pad)' }}>
      <div className="row between" style={{ alignItems:'flex-end', marginBottom:22 }}>
        <div>
          <div className="eyebrow">Reisende · 2026</div>
          <div className="display" style={{ fontSize:48, marginTop:4 }}>Familie</div>
          <div className="mono" style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>{family.length} Reisende · alle gemeinsam unterwegs</div>
        </div>
        <button className="btn terra">+ Mitglied einladen</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'var(--d-gap)' }}>
        {family.map(f => (
          <div key={f.id} className="card">
            <div className="row" style={{ gap:16 }}>
              <Av f={f} size={64} fontSize={28} />
              <div className="grow">
                <div className="display" style={{ fontSize:28, lineHeight:1 }}>{f.name}</div>
                <div className="mono" style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>{f.extra || 'Reisender'}</div>
              </div>
            </div>
            <div className="row" style={{ marginTop:18, gap:'var(--d-gap)' }}>
              <div className="grow"><div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>REISEN</div><div className="serif" style={{ fontSize:22, fontWeight:600 }}>{trips.length}</div></div>
              {f.seat1 && <div className="grow"><div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>SITZ HIN</div><div className="mono" style={{ fontSize:18, fontWeight:600 }}>{f.seat1}</div></div>}
              {f.seat2 && <div className="grow"><div className="mono" style={{ fontSize:10, color:'var(--muted)' }}>SITZ RÜCK</div><div className="mono" style={{ fontSize:18, fontWeight:600 }}>{f.seat2}</div></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DocsView ─────────────────────────────────────────────────
function DocsView() {
  const { trips } = useCtx();
  const docs = [];
  trips.forEach(t => {
    if (t.flight) docs.push({ trip:t, n:`Boarding-Pass-${t.flight.no||t.name}.pdf`, s:'124 KB', ic:'✈', kind:'Flug' });
    if (t.train)  docs.push({ trip:t, n:`OEBB-${t.train.no||t.name}.pdf`, s:'88 KB', ic:'🚆', kind:'Zug' });
    if (t.hotel)  docs.push({ trip:t, n:`${(t.hotel.name||t.name).replace(/\s+/g,'-')}-Voucher.pdf`, s:'198 KB', ic:'🏨', kind:'Hotel' });
    if (t.extras?.insurance) docs.push({ trip:t, n:`Versicherung-${t.id}.pdf`, s:'88 KB', ic:'🛡', kind:'Versicherung' });
    if (t.extras?.skipass)   docs.push({ trip:t, n:`Skipass-${t.id}.pdf`, s:'156 KB', ic:'⛷', kind:'Skipass' });
  });
  return (
    <div style={{ padding:'var(--d-pad)' }}>
      <div className="row between" style={{ alignItems:'flex-end', marginBottom:22 }}>
        <div>
          <div className="eyebrow">Dokumente · 2026</div>
          <div className="display" style={{ fontSize:48, marginTop:4 }}>Reise-Unterlagen</div>
          <div className="mono" style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>{docs.length} Dateien</div>
        </div>
        <div className="row" style={{ gap:8 }}>
          <button className="btn ghost">⬇ alle laden</button>
          <button className="btn terra">+ hochladen</button>
        </div>
      </div>
      <div className="card" style={{ padding:0 }}>
        <div className="row" style={{ padding:'12px var(--d-pad)', borderBottom:'0.5px solid var(--line-2)', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.10em', textTransform:'uppercase', color:'var(--muted)' }}>
          <div style={{ width:40 }} /><div className="grow">Datei</div><div style={{ width:140 }}>Reise</div><div style={{ width:100 }}>Typ</div><div style={{ width:80 }}>Größe</div><div style={{ width:60 }} />
        </div>
        {docs.map((d,i) => (
          <div key={i} className="row" style={{ padding:'12px var(--d-pad)', borderBottom:i<docs.length-1?'0.5px solid var(--line-2)':'none', cursor:'pointer', transition:'background 120ms' }}
               onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.5)'}
               onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <div style={{ width:40, fontSize:18 }}>{d.ic}</div>
            <div className="grow" style={{ fontSize:13, fontWeight:500 }}>{d.n}</div>
            <div style={{ width:140 }} className="row">
              <div style={{ width:22, height:22, borderRadius:6, background:d.trip.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>{d.trip.emoji}</div>
              <span style={{ fontSize:12, fontWeight:500, marginLeft:8 }}>{d.trip.name}</span>
            </div>
            <div style={{ width:100, fontSize:12, color:'var(--ink-2)' }}>{d.kind}</div>
            <div style={{ width:80, fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)' }}>{d.s}</div>
            <div style={{ width:60, textAlign:'right', color:'var(--muted)', fontSize:14 }}>↓</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DesktopApp (Variant A shell) ────────────────────────────
export default function DesktopApp({ trips, family, inboxItems, expenses, onAddExpense, onEditExpense, onDeleteExpense, onSettleAll }) {
  const [view, setView]     = useState('dashboard');
  const [tripId, setTripId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const wrapRef = useRef(null);
  const { over, last } = useEmlDrop(wrapRef);

  useEffect(() => {
    if (trips.length > 0 && !tripId) {
      setTripId(nextUpcomingTrip(trips)?.id || trips[0].id);
    }
  }, [trips]);

  const trip = trips.find(t => t.id === tripId) || trips[0];

  function selectTrip(id) { setTripId(id); setView('trip'); }

  const breadcrumbs = ({
    dashboard: ['wanderly','Familie 2026','Dashboard'],
    trips:     ['wanderly','Familie 2026','Alle Reisen'],
    inbox:     ['wanderly','Familie 2026','Inbox'],
    family:    ['wanderly','Familie 2026','Familie'],
    split:     ['wanderly','Familie 2026','Split & Settle'],
    docs:      ['wanderly','Familie 2026','Dokumente'],
    trip:      ['wanderly','Familie 2026', trip?.name || ''],
  })[view] || ['wanderly'];

  return (
    <Ctx.Provider value={{ trips, family, inboxItems, expenses, onAddExpense, onEditExpense, onDeleteExpense, onSettleAll }}>
      <div className="wd" data-density="comfortable" ref={wrapRef} style={{ width:'100%', height:'100dvh', position:'relative' }}>
        <div className="macwin" style={{ borderRadius:0, height:'100%' }}>
          <Titlebar breadcrumbs={breadcrumbs} />
          <div className="body">
            <Sidebar
              activeView={view === 'trip' ? null : view}
              activeTrip={view === 'trip' ? tripId : null}
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed(c => !c)}
              onSelectView={setView}
              onSelectTrip={selectTrip}
            />
            <div className="scroll grow" style={{ background:'var(--cream)', position:'relative' }}>
              {(view === 'dashboard' || view === 'trip') && (
                <div style={{ position:'absolute', right:-160, top:-120, width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(230,181,69,0.45) 0%,rgba(240,181,138,0.22) 40%,transparent 70%)', pointerEvents:'none' }} />
              )}
              {trip && view === 'dashboard' && <DashboardView trip={trip} onOpenInbox={() => setView('inbox')} onSelectTrip={selectTrip} />}
              {trip && view === 'trip'      && <TripDetailView trip={trip} onBack={() => setView('dashboard')} />}
              {view === 'trips'   && <AllTripsView onSelectTrip={selectTrip} />}
              {view === 'inbox'   && <InboxView />}
              {view === 'split'   && <SplitView />}
              {view === 'family'  && <FamilyView />}
              {view === 'docs'    && <DocsView />}
            </div>
          </div>
        </div>
        <DropVeil on={over} fileName={last} />
      </div>
    </Ctx.Provider>
  );
}
