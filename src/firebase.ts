import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const { firestoreDatabaseId, ...restConfig } = firebaseConfig as any;

const app = initializeApp(restConfig);
// CRITICAL: The app will break without specifying the databaseId if it's not the default (default)
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);

export default app;
