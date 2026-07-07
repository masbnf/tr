import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Server-side only — never imported in client components
function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Firebase stores newlines as \n in env — replace them back
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

let _adminDb: Firestore | null = null;
function getAdminDb(): Firestore {
  if (!_adminDb) _adminDb = getFirestore(getAdminApp());
  return _adminDb;
}

// Lazy proxy: keeps `adminDb.collection(...)` working at every call site,
// but defers actual Firebase Admin init until first real use. Without this,
// importing this module (e.g. during `next build`'s route data collection)
// eagerly calls cert() and crashes the build whenever FIREBASE_ADMIN_* env
// vars aren't present in that environment.
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const instance = getAdminDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
