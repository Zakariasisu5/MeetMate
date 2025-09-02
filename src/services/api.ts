import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendConnectionRequest = async (senderId: string, receiverId: string) => {
  const { auth } = await import('../config/firebase');
  const user = auth.currentUser;
  console.log('Auth user:', user);
  if (!user) {
    throw new Error('Please login first');
  }
  return api.post('/connections/request', { senderId, receiverId });
};

export const respondToConnection = async (connectionId: string, status: 'accepted' | 'declined') => {
  const { auth } = await import('../config/firebase');
  const user = auth.currentUser;
  console.log('Auth user:', user);
  if (!user) {
    throw new Error('Please login first');
  }
  return api.post('/connections/respond', { connectionId, status });
};

export const getConnections = (userId: string) =>
  api.get(`/connections/${userId}`);

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface RSVP {
  id: string;
  userId: string;
  eventId: string;
  status: 'going' | 'maybe' | 'not_going';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRSVPRequest {
  eventId: string;
  status: 'going' | 'maybe' | 'not_going';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  avatar?: string;
}

export interface SensayChatRequest {
  prompt: string;
  context?: string;
}

export interface SensayRecommendationRequest {
  preferences: {
    interests: string[];
    location?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface SensayResponse {
  response: string;
  recommendations?: Event[];
}

export class ApiService {
  static async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await api.post('/api/events', data);
    return response.data;
  }

  static async getEvents(): Promise<Event[]> {
    const response = await api.get('/api/events');
    return response.data;
  }

  static async getEvent(id: string): Promise<Event> {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  }

  static async createRSVP(data: CreateRSVPRequest): Promise<RSVP> {
    const response = await api.post('/api/rsvp', data);
    return response.data;
  }

  static async getEventRSVPs(eventId: string): Promise<RSVP[]> {
    const response = await api.get(`/api/rsvp/event/${eventId}`);
    return response.data;
  }

  static async getUserRSVPs(userId: string): Promise<RSVP[]> {
    const response = await api.get(`/api/rsvp/user/${userId}`);
    return response.data;
  }

  static async createUser(data: CreateUserRequest): Promise<User> {
    const response = await api.post('/api/users', data);
    return response.data;
  }

  static async getUser(id: string): Promise<User> {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  }

  static async chatWithAI(data: SensayChatRequest): Promise<SensayResponse> {
    const response = await api.post('/ai/chat', data);
    return response.data;
  }

  static async getAIRecommendations(data: SensayRecommendationRequest): Promise<SensayResponse> {
    const response = await api.post('/ai/recommend', data);
    return response.data;
  }

  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  }
}

export default ApiService;
