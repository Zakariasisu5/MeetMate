import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, MessageCircle } from 'lucide-react';
import { useRealtimeEvents, useRealtimeEventRSVPs, useRealtimeCurrentUser } from '../hooks/useRealtime';
import { Event, RSVP } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import AIChat from './AIChat';
import AIRecommendations from './AIRecommendations';
import RealtimeStatus from './RealtimeStatus';
import CreateEventModal from './CreateEventModal';

interface EventsProps {
  className?: string;
}

const Events: React.FC<EventsProps> = ({ className = '' }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const { events, loading: eventsLoading, error: eventsError, createEvent } = useRealtimeEvents();
  const { user: currentUser } = useRealtimeCurrentUser();
  const { rsvps: eventRSVPs, createRSVP } = useRealtimeEventRSVPs(selectedEvent?.id || '');

  const handleRSVP = async (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    if (!currentUser?.id) return;
    
    await createRSVP({
      userId: currentUser.id,
      eventId,
      status,
    });
  };

  const getRSVPStatus = (eventId: string) => {
    if (!eventRSVPs) return null;
    return eventRSVPs.find(rsvp => rsvp.eventId === eventId)?.status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'going':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_going':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'going':
        return 'Going';
      case 'maybe':
        return 'Maybe';
      case 'not_going':
        return 'Not Going';
      default:
        return 'RSVP';
    }
  };

  if (eventsLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-muted-foreground font-body">Failed to load events. Please try again.</p>
      </div>
    );
  }

  return (
  <div className={`space-y-6 ${className} px-2 sm:px-4 md:px-8`}>
      {/* Header */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-heading">Events</h2>
          <p className="text-muted-foreground font-body">Discover and join amazing events</p>
          <RealtimeStatus className="mt-2" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-body"
          >
            <MessageCircle className="w-4 h-4" />
            AI Chat
          </button>
          <button
            onClick={() => setShowCreateEvent(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-body"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* AI Components */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AIRecommendations 
          onRecommendationSelect={(event) => {
            setSelectedEvent(event);
            setShowCreateEvent(false);
          }}
        />
        {showAIChat && <AIChat />}
      </div>

      {/* Events List */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {events?.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Event Header */}
                <div>
                                     <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                     {event.title}
                   </h3>
                   <p className="text-sm text-muted-foreground line-clamp-2 font-body">
                     {event.description}
                   </p>
                </div>

                {/* Event Details */}
                <div className="space-y-2">
                                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Calendar className="w-4 h-4" />
                     <span className="font-body">{formatDate(event.date)}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <MapPin className="w-4 h-4" />
                     <span className="font-body">{event.location}</span>
                   </div>
                </div>

                {/* RSVP Status */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                     <div className="flex items-center gap-2">
                     <Users className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground font-body">
                       {eventRSVPs?.filter(rsvp => rsvp.status === 'going').length || 0} going
                     </span>
                   </div>
                                     {getRSVPStatus(event.id) && (
                     <span className={`px-2 py-1 rounded-full text-xs border font-body ${getStatusColor(getRSVPStatus(event.id)!)}`}>
                       {getStatusText(getRSVPStatus(event.id)!)}
                     </span>
                   )}
                </div>

                {/* RSVP Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row">
                                     <button
                     onClick={() => handleRSVP(event.id, 'going')}
                     className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors font-body ${
                       getRSVPStatus(event.id) === 'going'
                         ? 'bg-green-100 text-green-800'
                         : 'bg-primary text-primary-foreground hover:bg-primary/90'
                     }`}
                   >
                     Going
                   </button>
                   <button
                     onClick={() => handleRSVP(event.id, 'maybe')}
                     className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors font-body ${
                       getRSVPStatus(event.id) === 'maybe'
                         ? 'bg-yellow-100 text-yellow-800'
                         : 'bg-muted text-muted-foreground hover:bg-muted/80'
                     }`}
                   >
                     Maybe
                   </button>
                   <button
                     onClick={() => handleRSVP(event.id, 'not_going')}
                     className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors font-body ${
                       getRSVPStatus(event.id) === 'not_going'
                         ? 'bg-red-100 text-red-800'
                         : 'bg-muted text-muted-foreground hover:bg-muted/80'
                     }`}
                   >
                     Not Going
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

             {/* Empty State */}
       {events?.length === 0 && (
         <div className="text-center py-12">
           <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
           <h3 className="text-lg font-medium text-foreground mb-2 font-heading">No events yet</h3>
           <p className="text-muted-foreground mb-4 font-body">
             Be the first to create an event or check back later for new events.
           </p>
           <button
             onClick={() => setShowCreateEvent(true)}
             className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-body"
           >
             Create First Event
           </button>
         </div>
       )}

       {/* Create Event Modal */}
       <CreateEventModal 
         isOpen={showCreateEvent} 
         onClose={() => setShowCreateEvent(false)} 
       />
     </div>
   );
 };

export default Events;
