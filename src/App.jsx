import { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import { useCollection } from './hooks/useFirestore.js';
import { TRIPS, FAMILY, INBOX } from './data/mockData.js';

import HomeScreen from './screens/HomeScreen.jsx';
import TripDetail from './screens/TripDetail.jsx';
import ItineraryScreen from './screens/ItineraryScreen.jsx';
import InboxScreen from './screens/InboxScreen.jsx';
import SplitScreen from './screens/SplitScreen.jsx';
import MeScreen from './screens/MeScreen.jsx';

import ShareSheet from './components/ShareSheet.jsx';
import DocsSheet from './components/DocsSheet.jsx';
import AddTripSheet from './components/AddTripSheet.jsx';
import DeleteConfirmSheet from './components/DeleteConfirmSheet.jsx';
import WanderlyLogo from './components/WanderlyLogo.jsx';
import Toast from './components/Toast.jsx';

import './index.css';

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
  const [route, setRoute]             = useState('home');
  const [prevRoute, setPrevRoute]     = useState(null);
  const [tripId, setTripId]           = useState(null);
  const [share, setShare]             = useState(null);
  const [docs, setDocs]               = useState(false);
  const [addTrip, setAddTrip]         = useState(false);
  const [editTrip, setEditTrip]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]             = useState(null);

  const { data: trips,      loading: tripsLoading  } = useCollection('trips',  TRIPS);
  const { data: family,     loading: familyLoading } = useCollection('family', FAMILY);
  const { data: inboxItems, loading: inboxLoading  } = useCollection('inbox',  INBOX);

  const loading = tripsLoading || familyLoading || inboxLoading;
  const unreadCount = inboxItems.filter(i => !i.read).length;

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

  async function handleMarkRead(id) {
    await setDoc(doc(db, 'inbox', String(id)), { read: true }, { merge: true });
  }

  function sent(who) {
    setShare(null);
    setToast(`an ${who} geteilt`);
    setTimeout(() => setToast(null), 2000);
  }

  const shareTrip = share && trips.find(t => t.id === share);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh', background:'#FBF4E6' }}>
      <WanderlyLogo size={60} />
    </div>
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
      {route === 'inbox'     && <AnimatedScreen key="inbox"     direction={getDir('inbox')}>     <InboxScreen     items={inboxItems} onMarkRead={handleMarkRead} onTab={tab} onOpenTrip={id => go('detail', id)} /></AnimatedScreen>}
      {route === 'split'     && <AnimatedScreen key="split"     direction={getDir('split')}>     <SplitScreen     onTab={tab} inboxBadge={unreadCount} family={family} /></AnimatedScreen>}
      {route === 'me'        && <AnimatedScreen key="me"        direction={getDir('me')}>        <MeScreen        onTab={tab} inboxBadge={unreadCount} family={family} onEditPerson={handleEditPerson} /></AnimatedScreen>}

      {share && shareTrip && <ShareSheet trip={shareTrip} family={family} onClose={() => setShare(null)} onSent={sent} />}
      {docs && route === 'detail' && <DocsSheet trip={trips.find(t => t.id === tripId) || trips[0]} onClose={() => setDocs(false)} />}
      {addTrip && <AddTripSheet onClose={() => { setAddTrip(false); setEditTrip(null); }} onAdd={handleAddTrip} onSave={handleSaveTrip} initialTrip={editTrip} />}
      {deleteConfirm && <DeleteConfirmSheet trip={deleteConfirm} onCancel={() => setDeleteConfirm(null)} onConfirm={deleteTrip} />}
      {toast && <Toast msg={toast} />}
    </div>
  );
}
