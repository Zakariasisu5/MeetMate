import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import ApiService, {
  Event,
  CreateEventRequest,
  RSVP,
  CreateRSVPRequest,
  User,
  CreateUserRequest,
  SensayChatRequest,
  SensayRecommendationRequest,
  SensayResponse,
} from '../services/api';

// Query keys
export const queryKeys = {
  events: ['events'] as const,
  event: (id: string) => ['events', id] as const,
  rsvps: ['rsvps'] as const,
  eventRsvps: (eventId: string) => ['rsvps', 'event', eventId] as const,
  userRsvps: (userId: string) => ['rsvps', 'user', userId] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
};

// Events hooks
export const useEvents = () => {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: ApiService.getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: () => ApiService.getEvent(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => ApiService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      toast.success('Event created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create event');
    },
  });
};

// RSVP hooks
export const useEventRSVPs = (eventId: string) => {
  return useQuery({
    queryKey: queryKeys.eventRsvps(eventId),
    queryFn: () => ApiService.getEventRSVPs(eventId),
    enabled: !!eventId,
  });
};

export const useUserRSVPs = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.userRsvps(userId),
    queryFn: () => ApiService.getUserRSVPs(userId),
    enabled: !!userId,
  });
};

export const useCreateRSVP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRSVPRequest) => ApiService.createRSVP(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
  queryClient.invalidateQueries({ queryKey: queryKeys.eventRsvps(variables.eventId) });
  queryClient.invalidateQueries({ queryKey: ['rsvps', 'user'] });
      toast.success('RSVP updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update RSVP');
    },
  });
};

// User hooks
export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => ApiService.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => ApiService.createUser(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user(data.id), data);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    },
  });
};

// AI hooks
export const useAIChat = () => {
  return useMutation({
    mutationFn: (data: SensayChatRequest) => ApiService.chatWithAI(data),
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to get AI response');
    },
  });
};

export const useAIRecommendations = () => {
  return useMutation({
    mutationFn: (data: SensayRecommendationRequest) => ApiService.getAIRecommendations(data),
    onSuccess: () => {
      toast.success('AI recommendations generated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to get recommendations');
    },
  });
};

// Utility hooks
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: ApiService.healthCheck,
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
  });
};
