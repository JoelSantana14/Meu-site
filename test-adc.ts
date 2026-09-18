import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp();
const db = getFirestore();
db.collection('settings').get().then(snap => {
  console.log('Docs:', snap.size);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
