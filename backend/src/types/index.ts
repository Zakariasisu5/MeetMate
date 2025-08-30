// src/types/index.ts

import { Request } from "express";

// Authenticated request (with user info)
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Sensay requests
export interface SensayChatRequest {
  message: string;
}

export interface SensayRecommendationRequest {
  userId: string;
  context: string;
}

export interface SensayResponse {
  reply: string;
  recommendations?: string[];
}

// Event
export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  createdBy: string;
}

// RSVP
export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  status: "yes" | "no" | "maybe";
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
}

