import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
getDocs(collection(db, 'settings')).then(snap => {
  console.log('Docs:', snap.size);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
