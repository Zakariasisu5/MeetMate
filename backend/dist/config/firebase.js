import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
dotenv.config();
const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
// Initialize Firebase Admin SDK
if (!getApps().length) {
    initializeApp({
        credential: cert(firebaseConfig),
    });
}
export const db = getFirestore();
export const auth = getAuth();
// Collections
export const collections = {
    users: db.collection('users'),
    events: db.collection('events'),
    rsvps: db.collection('rsvps'),
};
//# sourceMappingURL=firebase.js.map