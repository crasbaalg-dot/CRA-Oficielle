/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Resilient Firebase initialization configuration
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || '',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '',
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
    db = getFirestore(app);
    isFirebaseEnabled = true;
    console.log('Firebase successfully initialized on the client.');
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
