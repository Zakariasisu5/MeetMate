import { Request } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}
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
export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    createdBy: string;
}
export interface RSVP {
    id: string;
    eventId: string;
    userId: string;
    status: "yes" | "no" | "maybe";
}
export interface User {
    id: string;
    name: string;
    email: string;
}
export type { User };
export type { Event };
export type { AIRequest };
export type { AIResponse };
//# sourceMappingURL=index.d.ts.map