
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigStr = process.env.FIREBASE_CONFIG;
let app;
let auth: any = null;
let db: any = null;

try {
  const config = JSON.parse(firebaseConfigStr || '{}');
  if (config.apiKey && !getApps().length) {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
  } else if (getApps().length) {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase 初始化失敗，系統將進入離線展示模式。請檢查 FIREBASE_CONFIG 環境變數。");
}

export { auth, db };
export const isFirebaseReady = () => auth !== null && db !== null;
