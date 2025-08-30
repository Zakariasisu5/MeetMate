import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, RSVP, User } from './api';

// Real-time listeners management
class RealtimeService {
  private listeners: Map<string, () => void> = new Map();

  // Events real-time listeners
  subscribeToEvents(callback: (events: Event[]) => void): () => void {
    try {
      const q = query(
        collection(db, 'events'),
        orderBy('date', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const events: Event[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          events.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            date: data.date?.toDate?.()?.toISOString() || data.date,
            location: data.location,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
          });
        });
        callback(events);
      }, (error) => {
        console.error('Error in events subscription:', error);
        callback([]);
      });

      const listenerId = `events-${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);
      return () => {
        unsubscribe();
        this.listeners.delete(listenerId);
      };
    } catch (error) {
      console.error('Failed to subscribe to events:', error);
      // Return a no-op function if subscription fails
      return () => {};
    }
  }

  // Single event real-time listener
  subscribeToEvent(eventId: string, callback: (event: Event | null) => void): () => void {
    const unsubscribe = onSnapshot(doc(db, 'events', eventId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const event: Event = {
          id: doc.id,
          title: data.title,
          description: data.description,
          date: data.date?.toDate?.()?.toISOString() || data.date,
          location: data.location,
          createdBy: data.createdBy,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        };
        callback(event);
      } else {
        callback(null);
      }
    });

    const listenerId = `event-${eventId}`;
    this.listeners.set(listenerId, unsubscribe);
    return () => {
      unsubscribe();
      this.listeners.delete(listenerId);
    };
  }

  // RSVPs real-time listeners
  subscribeToEventRSVPs(eventId: string, callback: (rsvps: RSVP[]) => void): () => void {
    const q = query(
      collection(db, 'rsvps'),
      where('eventId', '==', eventId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rsvps: RSVP[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        rsvps.push({
          id: doc.id,
          userId: data.userId,
          eventId: data.eventId,
          status: data.status,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        });
      });
      callback(rsvps);
    });

    const listenerId = `rsvps-event-${eventId}`;
    this.listeners.set(listenerId, unsubscribe);
    return () => {
      unsubscribe();
      this.listeners.delete(listenerId);
    };
  }

  subscribeToUserRSVPs(userId: string, callback: (rsvps: RSVP[]) => void): () => void {
    const q = query(
      collection(db, 'rsvps'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rsvps: RSVP[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        rsvps.push({
          id: doc.id,
          userId: data.userId,
          eventId: data.eventId,
          status: data.status,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        });
      });
      callback(rsvps);
    });

    const listenerId = `rsvps-user-${userId}`;
    this.listeners.set(listenerId, unsubscribe);
    return () => {
      unsubscribe();
      this.listeners.delete(listenerId);
    };
  }

  // User real-time listener
  subscribeToUser(userId: string, callback: (user: User | null) => void): () => void {
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const user: User = {
          id: doc.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        };
        callback(user);
      } else {
        callback(null);
      }
    });

    const listenerId = `user-${userId}`;
    this.listeners.set(listenerId, unsubscribe);
    return () => {
      unsubscribe();
      this.listeners.delete(listenerId);
    };
  }

  // Create event in Firestore (syncs with backend)
  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Update event in Firestore
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
    const { id, createdAt, updatedAt, ...updateData } = updates;
    await updateDoc(doc(db, 'events', eventId), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  }

  // Create RSVP in Firestore
  async createRSVP(rsvpData: Omit<RSVP, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'rsvps'), {
      ...rsvpData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Update RSVP in Firestore
  async updateRSVP(rsvpId: string, updates: Partial<RSVP>): Promise<void> {
    const { id, createdAt, updatedAt, ...updateData } = updates;
    await updateDoc(doc(db, 'rsvps', rsvpId), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  }

  // Create/Update user in Firestore
  async createOrUpdateUser(userId: string, userData: Partial<User>): Promise<void> {
    const { id, createdAt, updatedAt, ...updateData } = userData;
    await updateDoc(doc(db, 'users', userId), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  }

  // Cleanup all listeners
  cleanup(): void {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners.clear();
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
