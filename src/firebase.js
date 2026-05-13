import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        "wanderly-b0f4e.firebaseapp.com",
  projectId:         "wanderly-b0f4e",
  storageBucket:     "wanderly-b0f4e.firebasestorage.app",
  messagingSenderId: "457320986949",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const storage = getStorage(app);
