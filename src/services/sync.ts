import ApiService from './api';
import realtimeService from './realtime';
import { Event, RSVP, User, CreateEventRequest, CreateRSVPRequest, CreateUserRequest } from './api';

// Hybrid service that syncs between backend API and Firebase
class SyncService {
  private syncInProgress = false;

  // Sync events from backend to Firebase
  async syncEventsFromBackend(): Promise<void> {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      const events = await ApiService.getEvents();
      
      // Update Firebase with backend data
      for (const event of events) {
        await realtimeService.updateEvent(event.id, event);
      }
    } catch (error) {
      console.error('Failed to sync events from backend:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Create event - save to both backend and Firebase
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      // First create in backend
      const backendEvent = await ApiService.createEvent(eventData);
      
      // Then sync to Firebase for real-time updates
      await realtimeService.updateEvent(backendEvent.id, backendEvent);
      
      return backendEvent;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  // Create RSVP - save to both backend and Firebase
  async createRSVP(rsvpData: CreateRSVPRequest): Promise<RSVP> {
    try {
      // First create in backend
      const backendRSVP = await ApiService.createRSVP(rsvpData);
      
      // Then sync to Firebase for real-time updates
      await realtimeService.updateRSVP(backendRSVP.id, backendRSVP);
      
      return backendRSVP;
    } catch (error) {
      console.error('Failed to create RSVP:', error);
      throw error;
    }
  }

  // Create/Update user - save to both backend and Firebase
  async createOrUpdateUser(userData: CreateUserRequest): Promise<User> {
    try {
      // First create/update in backend
      const backendUser = await ApiService.createUser(userData);
      
      // Then sync to Firebase for real-time updates
      await realtimeService.createOrUpdateUser(backendUser.id, backendUser);
      
      return backendUser;
    } catch (error) {
      console.error('Failed to create/update user:', error);
      throw error;
    }
  }

  // Get events with real-time updates
  async getEventsWithRealtime(callback: (events: Event[]) => void): Promise<() => void> {
    // Initial sync from backend
    await this.syncEventsFromBackend();
    
    // Subscribe to real-time updates
    return realtimeService.subscribeToEvents(callback);
  }

  // Get RSVPs with real-time updates
  async getEventRSVPsWithRealtime(eventId: string, callback: (rsvps: RSVP[]) => void): Promise<() => void> {
    // Initial sync from backend
    try {
      const rsvps = await ApiService.getEventRSVPs(eventId);
      for (const rsvp of rsvps) {
        await realtimeService.updateRSVP(rsvp.id, rsvp);
      }
    } catch (error) {
      console.error('Failed to sync RSVPs from backend:', error);
    }
    
    // Subscribe to real-time updates
    return realtimeService.subscribeToEventRSVPs(eventId, callback);
  }

  // Get user RSVPs with real-time updates
  async getUserRSVPsWithRealtime(userId: string, callback: (rsvps: RSVP[]) => void): Promise<() => void> {
    // Initial sync from backend
    try {
      const rsvps = await ApiService.getUserRSVPs(userId);
      for (const rsvp of rsvps) {
        await realtimeService.updateRSVP(rsvp.id, rsvp);
      }
    } catch (error) {
      console.error('Failed to sync user RSVPs from backend:', error);
    }
    
    // Subscribe to real-time updates
    return realtimeService.subscribeToUserRSVPs(userId, callback);
  }

  // Get user with real-time updates
  async getUserWithRealtime(userId: string, callback: (user: User | null) => void): Promise<() => void> {
    // Initial sync from backend
    try {
      const user = await ApiService.getUser(userId);
      await realtimeService.createOrUpdateUser(user.id, user);
    } catch (error) {
      console.error('Failed to sync user from backend:', error);
    }
    
    // Subscribe to real-time updates
    return realtimeService.subscribeToUser(userId, callback);
  }

  // Health check and sync status
  async healthCheck(): Promise<{ backend: boolean; firebase: boolean }> {
    const status = {
      backend: false,
      firebase: false,
    };

    try {
      await ApiService.healthCheck();
      status.backend = true;
    } catch (error) {
      console.error('Backend health check failed:', error);
    }

    try {
      // Simple Firebase test
      await realtimeService.subscribeToEvents(() => {})();
      status.firebase = true;
    } catch (error) {
      console.error('Firebase health check failed:', error);
    }

    return status;
  }

  // Full sync - sync all data from backend to Firebase
  async fullSync(): Promise<void> {
    console.log('Starting full sync...');
    
    try {
      // Sync events
      await this.syncEventsFromBackend();
      
      // Sync users (if needed)
      // This would require getting all users from backend
      
      console.log('Full sync completed');
    } catch (error) {
      console.error('Full sync failed:', error);
      throw error;
    }
  }
}

export const syncService = new SyncService();
export default syncService;
