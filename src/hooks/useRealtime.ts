import { useState, useEffect, useCallback } from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import realtimeService from '../services/realtime';
import { Event, RSVP, User } from '../services/api';

// Real-time events hook
export const useRealtimeEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = realtimeService.subscribeToEvents(
      (newEvents) => {
        setEvents(newEvents);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      return await realtimeService.createEvent(eventData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<Event>) => {
    try {
      await realtimeService.updateEvent(eventId, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
  };
};

// Real-time single event hook
export const useRealtimeEvent = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = realtimeService.subscribeToEvent(eventId, (newEvent) => {
      setEvent(newEvent);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [eventId]);

  const updateEvent = useCallback(async (updates: Partial<Event>) => {
    if (!eventId) return;
    
    try {
      await realtimeService.updateEvent(eventId, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  }, [eventId]);

  return {
    event,
    loading,
    error,
    updateEvent,
  };
};

// Real-time RSVPs hook
export const useRealtimeEventRSVPs = (eventId: string) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setRsvps([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = realtimeService.subscribeToEventRSVPs(eventId, (newRsvps) => {
      setRsvps(newRsvps);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [eventId]);

  const createRSVP = useCallback(async (rsvpData: Omit<RSVP, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      return await realtimeService.createRSVP(rsvpData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create RSVP');
      throw err;
    }
  }, []);

  const updateRSVP = useCallback(async (rsvpId: string, updates: Partial<RSVP>) => {
    try {
      await realtimeService.updateRSVP(rsvpId, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update RSVP');
      throw err;
    }
  }, []);

  return {
    rsvps,
    loading,
    error,
    createRSVP,
    updateRSVP,
  };
};

// Real-time user RSVPs hook
export const useRealtimeUserRSVPs = (userId?: string) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRsvps([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = realtimeService.subscribeToUserRSVPs(userId, (newRsvps) => {
      setRsvps(newRsvps);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return {
    rsvps,
    loading,
    error,
  };
};

// Real-time user hook
export const useRealtimeUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = realtimeService.subscribeToUser(userId, (newUser) => {
      setUser(newUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!userId) return;
    
    try {
      await realtimeService.createOrUpdateUser(userId, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    updateUser,
  };
};

// Current user real-time hook
export const useRealtimeCurrentUser = () => {
  const { user: authUser } = useFirebaseAuth();
  return useRealtimeUser(authUser?.uid);
};

// Cleanup hook for component unmount
export const useRealtimeCleanup = () => {
  useEffect(() => {
    return () => {
      realtimeService.cleanup();
    };
  }, []);
};
