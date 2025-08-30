import { useEffect } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import toast from 'react-hot-toast';

export function useConnections() {
  // 1. Send connection request
  const sendConnectionRequest = async (senderId?: string, receiverId?: string) => {
    // Use localStorage fallback if not provided
    let _senderId = senderId || localStorage.getItem('senderId') || '';
    let _receiverId = receiverId || localStorage.getItem('receiverId') || '';
    if (!_senderId || !_receiverId) throw new Error('Missing sender or receiver ID');
    // Prevent duplicate requests
    const q = query(
      collection(db, 'connections'),
      where('senderId', '==', _senderId),
      where('receiverId', '==', _receiverId)
    );
    let alreadySent = false;
    await new Promise<void>((resolve) => {
      onSnapshot(q, (snap) => {
        alreadySent = !snap.empty;
        resolve();
      });
    });
    if (alreadySent) throw new Error('Request already sent');
    await addDoc(collection(db, 'connections'), {
      senderId: _senderId,
      receiverId: _receiverId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  };

  // 2. Respond to request
  const respondToRequest = async (connectionId: string, response: 'accepted' | 'declined') => {
    await updateDoc(doc(db, 'connections', connectionId), { status: response });
  };

  // 3. Listen to accepted connections
  const getConnections = (userId: string, callback: (connections: any[]) => void) => {
    const q = query(
      collection(db, 'connections'),
      where('status', '==', 'accepted'),
      where('receiverId', '==', userId)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  // 4. Listen to incoming pending requests
  const listenToIncomingRequests = (userId: string, callback: (requests: any[]) => void) => {
    const q = query(
      collection(db, 'connections'),
      where('receiverId', '==', userId),
      where('status', '==', 'pending')
    );
    return onSnapshot(q, async (snap) => {
      const requests = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const senderDoc = await getDoc(doc(db, 'users', data.senderId));
          const sender = senderDoc.exists() ? senderDoc.data() : {};
          // Show toast for each new request
          toast(`${sender.displayName} sent you a connection request`);
          return { id: docSnap.id, ...data, sender };
        })
      );
      callback(requests);
    });
  };

  return {
    sendConnectionRequest,
    respondToRequest,
    getConnections,
    listenToIncomingRequests,
  };
}
