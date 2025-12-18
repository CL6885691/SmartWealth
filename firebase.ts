
import { initializeApp, getApps } from 'firebase/app';
// Fixed: Correct modular SDK import for getAuth
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigStr = process.env.FIREBASE_CONFIG;
let app;
let auth: any = null;
let db: any = null;

const initFirebase = () => {
  try {
    if (!firebaseConfigStr || firebaseConfigStr === '{}') {
      console.warn("FIREBASE_CONFIG 為空，系統將進入「展示模式」。");
      return;
    }

    const config = JSON.parse(firebaseConfigStr);
    if (config.apiKey) {
      if (!getApps().length) {
        app = initializeApp(config);
      } else {
        app = getApps()[0];
      }
      // Fixed: Initialize modular Auth and Firestore using standalone functions
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("Firebase 成功連線。");
    }
  } catch (error) {
    console.error("Firebase 配置解析失敗:", error);
  }
};

initFirebase();

export { auth, db };
export const isFirebaseReady = () => {
  return auth !== null && db !== null;
};
