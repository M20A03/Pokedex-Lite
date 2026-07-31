import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBWth8sJkTokT6ZiA4RyawbNRFicQXE5QU",
  authDomain: "pokedex-deepsolv.firebaseapp.com",
  projectId: "pokedex-deepsolv",
  storageBucket: "pokedex-deepsolv.firebasestorage.app",
  messagingSenderId: "360822117318",
  appId: "1:360822117318:web:9dd4407c35f4005ae518c7",
  measurementId: "G-18MWMG59CN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
