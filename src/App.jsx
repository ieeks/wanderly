import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import { useCollection } from './hooks/useFirestore.js';
import { TRIPS, FAMILY, INBOX } from './data/mockData.js';
import { extractTripFromEmail } from './utils/parseEmail.js';

import DesktopApp from './screens/DesktopApp.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import TripDetail from './screens/TripDetail.jsx';
import ItineraryScreen from './screens/ItineraryScreen.jsx';
import InboxScreen from './screens/InboxScreen.jsx';
import SplitScreen from './screens/SplitScreen.jsx';
import MeScreen from './screens/MeScreen.jsx';

import ShareSheet from './components/ShareSheet.jsx';
import ExpenseSheet from './components/ExpenseSheet.jsx';
import DocsSheet from './components/DocsSheet.jsx';
import AddTripSheet from './components/AddTripSheet.jsx';
import DeleteConfirmSheet from './components/DeleteConfirmSheet.jsx';
import WanderlyLogo from './components/WanderlyLogo.jsx';
import Toast from './components/Toast.jsx';

import './index.css';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isDesktop;
}

function TransitionStyles() {
  return (
    <style>{`
      @keyframes slideInRight { from { transform: translate3d(100%,0,0); } to { transform: translate3d(0,0,0); } }
      @keyframes slideInLeft  { from { transform: translate3d(-100%,0,0); } to { transform: translate3d(0,0,0); } }
      @keyframes slideInUp    { from { transform: translate3d(0,100%,0); } to { transform: translate3d(0,0,0); } }
      @keyframes fadeIn       { from { opacity:0; } to { opacity:1; } }
      .screen-slide-right { animation: slideInRight 320ms cubic-bezier(0.32,0.72,0,1) both; }
      .screen-slide-left  { animation: slideInLeft  320ms cubic-bezier(0.32,0.72,0,1) both; }
      .screen-slide-up    { animation: slideInUp    360ms cubic-bezier(0.32,0.72,0,1) both; }
      .screen-fade        { animation: fadeIn 220ms ease both; }
      @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-6px); } }
    `}</style>
  );
}

function AnimatedScreen({ children, direction }) {
  const cls = { right:'screen-slide-right', left:'screen-slide-left', up:'screen-slide-up', fade:'screen-fade' }[direction] || 'screen-slide-right';
  return (
    <div className={cls} style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' }}>
      {children}
    </div>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();
  const [route, setRoute]             = useState('home');
  const [prevRoute, setPrevRoute]     = useState(null);
  const [tripId, setTripId]           = useState(null);
  const [share, setShare]             = useState(null);
  const [docs, setDocs]               = useState(false);
  const [addTrip, setAddTrip]         = useState(false);
  const [editTrip, setEditTrip]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]             = useState(null);
  const [expenseSheet, setExpenseSheet] = useState(null); // null | 'add' | expense-object
  const [emlParsing, setEmlParsing]     = useState(false);

  const { data: trips,      loading: tripsLoading    } = useCollection('trips',    TRIPS);
  const { data: family,     loading: familyLoading   } = useCollection('family',   FAMILY);
  const { data: inboxItems, loading: inboxLoading    } = useCollection('inbox',    INBOX);
  const { data: expenses,   loading: expensesLoading } = useCollection('expenses', []);

  const loading = tripsLoading || familyLoading || inboxLoading || expensesLoading;
  const unreadCount = inboxItems.filter(i => !i.read).length;

  // One-time migration: set splitShare + defaultPayer on existing family docs
  useEffect(() => {
    if (family.length === 0) return;
    const CHILD_IDS = new Set(['mi', 'al']);
    const PAYER_ID  = 'ol';
    family.forEach(f => {
      if (f.splitShare !== undefined) return;
      setDoc(doc(db, 'family', f.id), {
        splitShare: CHILD_IDS.has(f.id) ? 0 : 1,
        ...(f.id === PAYER_ID && { defaultPayer: true }),
      }, { merge: true });
    });
  }, [family]);

  const ROUTE_DEPTH = { home:0, inbox:0, split:0, me:0, detail:1, itinerary:2 };
  const TAB_ORDER   = { home:0, inbox:1, split:2, me:3 };

  function go(r, id = null) {
    setPrevRoute(route);
    setRoute(r);
    if (id) setTripId(id);
  }

  function tab(t) {
    setPrevRoute(route);
    setRoute(t);
  }

  function getDir(to) {
    const from = prevRoute || 'home';
    if (TAB_ORDER[to] !== undefined && TAB_ORDER[from] !== undefined) {
      return TAB_ORDER[to] > TAB_ORDER[from] ? 'right' : 'left';
    }
    if ((ROUTE_DEPTH[to] || 0) > (ROUTE_DEPTH[from] || 0)) return 'right';
    if ((ROUTE_DEPTH[to] || 0) < (ROUTE_DEPTH[from] || 0)) return 'left';
    return 'fade';
  }

  async function handleAddTrip(newTrip) {
    await setDoc(doc(db, 'trips', newTrip.id), newTrip);
  }

  async function handleToggleFav(trip) {
    await setDoc(doc(db, 'trips', trip.id), { fav: !trip.fav }, { merge: true });
  }

  async function handleEmlFile(filename, content) {
    setEmlParsing(true);
    try {
      const parsed = await extractTripFromEmail(content);
      setEditTrip(parsed);
      setAddTrip(true);
    } catch (err) {
      setToast('Parsing fehlgeschlagen: ' + err.message);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setEmlParsing(false);
    }
  }

  async function handleSaveTrip(updated) {
    await setDoc(doc(db, 'trips', updated.id), updated);
    setEditTrip(null);
  }

  async function deleteTrip(id) {
    await deleteDoc(doc(db, 'trips', id));
    setDeleteConfirm(null);
    setPrevRoute(route);
    setRoute('home');
  }

  async function updateTripItinerary(updated) {
    await setDoc(doc(db, 'trips', updated.id), updated);
  }

  async function handleEditPerson(person, deleteId) {
    if (deleteId) {
      await deleteDoc(doc(db, 'family', deleteId));
    } else {
      await setDoc(doc(db, 'family', person.id), person);
    }
  }

  async function handleAddExpense(expense) {
    await setDoc(doc(db, 'expenses', expense.id), expense);
  }

  async function handleEditExpense(expense) {
    await setDoc(doc(db, 'expenses', expense.id), expense);
  }

  async function handleDeleteExpense(id) {
    await deleteDoc(doc(db, 'expenses', id));
  }

  async function handleSettleAll() {
    const unsettled = expenses.filter(e => !e.settled);
    await Promise.all(unsettled.map(e =>
      setDoc(doc(db, 'expenses', e.id), { ...e, settled: true })
    ));
    setToast('Alle Ausgaben beglichen');
    setTimeout(() => setToast(null), 2000);
  }

  async function handleMarkRead(id) {
    await setDoc(doc(db, 'inbox', String(id)), { read: true }, { merge: true });
  }

  function sent(who) {
    setShare(null);
    setToast(`an ${who} geteilt`);
    setTimeout(() => setToast(null), 2000);
  }

  const shareTrip = share && trips.find(t => t.id === share);

  // Deep-link: /#trip_ibizaApr26 → open that trip directly
  useEffect(() => {
    const hash = window.location.hash.slice(1); // strip leading #
    if (hash && trips.length > 0) {
      const target = trips.find(t => t.id === hash);
      if (target) {
        setTripId(target.id);
        setRoute('detail');
        window.location.hash = ''; // clean up URL after navigating
      }
    }
  }, [trips]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#FBF4E6' }}>
      <WanderlyLogo size={60} />
    </div>
  );

  if (isDesktop) return (
    <DesktopApp
      trips={trips}
      family={family}
      inboxItems={inboxItems}
      expenses={expenses}
      onAddTrip={handleAddTrip}
      onToggleFav={handleToggleFav}
      onAddExpense={handleAddExpense}
      onEditExpense={handleEditExpense}
      onDeleteExpense={handleDeleteExpense}
      onSettleAll={handleSettleAll}
    />
  );

  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      height: '100dvh',
      position: 'relative',
      overflow: 'hidden',
      background: '#FBF4E6',
      fontFamily: "'Manrope', system-ui, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      <TransitionStyles />

      {route === 'home'      && <AnimatedScreen key="home"      direction={getDir('home')}>      <HomeScreen      trips={trips} onOpenTrip={id => go('detail', id)} onTab={tab} onAddTrip={() => setAddTrip(true)} inboxBadge={unreadCount} /></AnimatedScreen>}
      {route === 'detail'    && <AnimatedScreen key="detail"    direction={getDir('detail')}>    <TripDetail      tripId={tripId} trips={trips} family={family} onBack={() => go('home')} onShare={() => setShare(tripId)} onItinerary={id => go('itinerary', id)} onDocs={() => setDocs(true)} onDelete={t => setDeleteConfirm(t)} onEdit={t => { setEditTrip(t); setAddTrip(true); }} /></AnimatedScreen>}
      {route === 'itinerary' && <AnimatedScreen key="itinerary" direction={getDir('itinerary')}><ItineraryScreen tripId={tripId} trips={trips} onBack={() => go('detail')} onUpdateTrip={updateTripItinerary} /></AnimatedScreen>}
      {route === 'inbox'     && <AnimatedScreen key="inbox"     direction={getDir('inbox')}>     <InboxScreen     items={inboxItems} onMarkRead={handleMarkRead} onTab={tab} onOpenTrip={id => go('detail', id)} onEmlFile={handleEmlFile} /></AnimatedScreen>}
      {route === 'split'     && <AnimatedScreen key="split"     direction={getDir('split')}>     <SplitScreen     onTab={tab} inboxBadge={unreadCount} family={family} expenses={expenses} onAddExpense={() => setExpenseSheet('add')} onEditExpense={e => setExpenseSheet(e)} onSettleAll={handleSettleAll} /></AnimatedScreen>}
      {route === 'me'        && <AnimatedScreen key="me"        direction={getDir('me')}>        <MeScreen        onTab={tab} inboxBadge={unreadCount} family={family} onEditPerson={handleEditPerson} /></AnimatedScreen>}

      {share && shareTrip && <ShareSheet trip={shareTrip} family={family} onClose={() => setShare(null)} onSent={sent} />}
      {docs && route === 'detail' && <DocsSheet trip={trips.find(t => t.id === tripId) || trips[0]} onClose={() => setDocs(false)} />}
      {addTrip && <AddTripSheet onClose={() => { setAddTrip(false); setEditTrip(null); }} onAdd={handleAddTrip} onSave={handleSaveTrip} initialTrip={editTrip} />}
      {expenseSheet && <ExpenseSheet expense={expenseSheet === 'add' ? null : expenseSheet} family={family} onSave={expenseSheet === 'add' ? handleAddExpense : handleEditExpense} onDelete={handleDeleteExpense} onClose={() => setExpenseSheet(null)} />}
      {deleteConfirm && <DeleteConfirmSheet trip={deleteConfirm} onCancel={() => setDeleteConfirm(null)} onConfirm={deleteTrip} />}
      {emlParsing && <Toast msg="✉️ Buchungsmail wird gelesen…" />}
      {!emlParsing && toast && <Toast msg={toast} />}
    </div>
  );
}
