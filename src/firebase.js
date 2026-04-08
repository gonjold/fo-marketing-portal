import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDBrdIX2GBD7OP7tZfU9tJdVLzLS9cTpIo",
  authDomain: "fo-marketing-portal.firebaseapp.com",
  projectId: "fo-marketing-portal",
  storageBucket: "fo-marketing-portal.firebasestorage.app",
  messagingSenderId: "11934251456",
  appId: "1:11934251456:web:87cb8b5d3d86ce6467b025"
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
