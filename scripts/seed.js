// node scripts/seed.js
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { TRIPS, FAMILY, INBOX } from '../src/data/mockData.js'

const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        'wanderly-b0f4e.firebaseapp.com',
  projectId:         'wanderly-b0f4e',
  storageBucket:     'wanderly-b0f4e.firebasestorage.app',
  messagingSenderId: '457320986949',
  appId:             process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

async function seed() {
  for (const trip of TRIPS) {
    await setDoc(doc(db, 'trips', trip.id), trip)
    console.log(`✓ trips/${trip.id}`)
  }
  for (const person of FAMILY) {
    await setDoc(doc(db, 'family', person.id), person)
    console.log(`✓ family/${person.id}`)
  }
  for (const item of INBOX) {
    await setDoc(doc(db, 'inbox', String(item.id)), item)
    console.log(`✓ inbox/${item.id}`)
  }
  console.log('Seed complete.')
  process.exit(0)
}

seed().catch(console.error)
