/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import firebaseConfigJson from '../../firebase-applet-config.json';

// Resilient Firebase initialization configuration
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || metaEnv.VITE_FIREBASE_API_KEY || '',
  authDomain: firebaseConfigJson.authDomain || metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: firebaseConfigJson.projectId || metaEnv.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: firebaseConfigJson.storageBucket || metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: firebaseConfigJson.messagingSenderId || metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: firebaseConfigJson.appId || metaEnv.VITE_FIREBASE_APP_ID || '',
  firestoreDatabaseId: firebaseConfigJson.firestoreDatabaseId || ''
};

let app;
let auth;
let db;
let isFirebaseEnabled = false;

// Check if valid credentials are present before bootstrapping Firebase
const hasCredentials = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain;

if (hasCredentials) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
    isFirebaseEnabled = true;
    console.log('Firebase successfully initialized on the client with DB ID:', firebaseConfig.firestoreDatabaseId);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn(
    'Firebase environment variables are missing. App is running in Local Resilient Persistence Mode (standard offline-first indexed/localStorage storage).'
  );
}

export { auth, db, isFirebaseEnabled };
export default app;
