import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  projectId: "tocc-budget-master",
  appId: "1:881664185950:web:a2a8cfe3decd7ba7d646cf",
  storageBucket: "tocc-budget-master.firebasestorage.app",
  apiKey: "AIzaSyANQ0WGu5-B4ck_Sc4h3nSbKmfrr5_ovNw",
  authDomain: "tocc-budget-master.firebaseapp.com",
  messagingSenderId: "881664185950",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);

const DOC_REF = doc(db, 'portal', 'state');

export async function loadState() {
  try {
    const snap = await getDoc(DOC_REF);
    if (snap.exists()) return snap.data();
    return null;
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}

export async function saveState(vendors, stages) {
  try {
    await setDoc(DOC_REF, { vendors, stages, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.error('Save failed:', e);
  }
}

export async function uploadImage(file) {
  try {
    const filename = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `portal-images/${filename}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (e) {
    console.error('Upload failed:', e);
    return null;
  }
}
