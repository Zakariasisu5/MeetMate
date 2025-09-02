import ApiService from './api';
import realtimeService from './realtime';
import { Event, RSVP, User, CreateEventRequest, CreateRSVPRequest, CreateUserRequest } from './api';

class SyncService {
  private syncInProgress = false;

  async syncEventsFromBackend(): Promise<void> {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      const events = await ApiService.getEvents();
      
      for (const event of events) {
        await realtimeService.updateEvent(event.id, event);
      }
    } catch (error) {
      console.error('Failed to sync events from backend:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    try {
      const backendEvent = await ApiService.createEvent(eventData);
      
      await realtimeService.updateEvent(backendEvent.id, backendEvent);
      
      return backendEvent;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  async createRSVP(rsvpData: CreateRSVPRequest): Promise<RSVP> {
    try {
      const backendRSVP = await ApiService.createRSVP(rsvpData);
      
      await realtimeService.updateRSVP(backendRSVP.id, backendRSVP);
      
      return backendRSVP;
    } catch (error) {
      console.error('Failed to create RSVP:', error);
      throw error;
    }
  }

  async createOrUpdateUser(userData: CreateUserRequest): Promise<User> {
    try {
      const backendUser = await ApiService.createUser(userData);
      
      await realtimeService.createOrUpdateUser(backendUser.id, backendUser);
      
      return backendUser;
    } catch (error) {
      console.error('Failed to create/update user:', error);
      throw error;
    }
  }

  async getEventsWithRealtime(callback: (events: Event[]) => void): Promise<() => void> {
    await this.syncEventsFromBackend();
    
    return realtimeService.subscribeToEvents(callback);
  }

  async getEventRSVPsWithRealtime(eventId: string, callback: (rsvps: RSVP[]) => void): Promise<() => void> {
    try {
      const rsvps = await ApiService.getEventRSVPs(eventId);
      for (const rsvp of rsvps) {
        await realtimeService.updateRSVP(rsvp.id, rsvp);
      }
    } catch (error) {
      console.error('Failed to sync RSVPs from backend:', error);
    }
    
    return realtimeService.subscribeToEventRSVPs(eventId, callback);
  }

  async getUserRSVPsWithRealtime(userId: string, callback: (rsvps: RSVP[]) => void): Promise<() => void> {
    try {
      const rsvps = await ApiService.getUserRSVPs(userId);
      for (const rsvp of rsvps) {
        await realtimeService.updateRSVP(rsvp.id, rsvp);
      }
    } catch (error) {
      console.error('Failed to sync user RSVPs from backend:', error);
    }
    
    return realtimeService.subscribeToUserRSVPs(userId, callback);
  }

  async getUserWithRealtime(userId: string, callback: (user: User | null) => void): Promise<() => void> {
    try {
      const user = await ApiService.getUser(userId);
      await realtimeService.createOrUpdateUser(user.id, user);
    } catch (error) {
      console.error('Failed to sync user from backend:', error);
    }
    
    return realtimeService.subscribeToUser(userId, callback);
  }

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
      await realtimeService.subscribeToEvents(() => {})();
      status.firebase = true;
    } catch (error) {
      console.error('Firebase health check failed:', error);
    }

    return status;
  }

  async fullSync(): Promise<void> {
    console.log('Starting full sync...');
    
    try {
      await this.syncEventsFromBackend();
      
      
      console.log('Full sync completed');
    } catch (error) {
      console.error('Full sync failed:', error);
      throw error;
    }
  }
}

export const syncService = new SyncService();
export default syncService;
