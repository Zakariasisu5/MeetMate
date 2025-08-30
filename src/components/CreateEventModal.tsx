import React, { useState } from 'react';
import { X, Calendar, MapPin, FileText, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeEvents } from '../hooks/useRealtime';
import { toast } from 'react-hot-toast';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createEvent } = useRealtimeEvents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        createdBy: 'current-user', // This will be set by the backend
      });
      
      toast.success('Event created successfully!');
      setFormData({ title: '', description: '', date: '', location: '' });
      onClose();
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold font-heading">Create New Event</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2 font-heading">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Event Title *
                </label>
                                 <input
                   type="text"
                   value={formData.title}
                   onChange={(e) => handleInputChange('title', e.target.value)}
                   placeholder="Enter event title"
                   className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-body"
                   required
                 />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 font-heading">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Description *
                </label>
                                 <textarea
                   value={formData.description}
                   onChange={(e) => handleInputChange('description', e.target.value)}
                   placeholder="Enter event description"
                   rows={3}
                   className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none font-body"
                   required
                 />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2 font-heading">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date & Time *
                </label>
                                 <input
                   type="datetime-local"
                   value={formData.date}
                   onChange={(e) => handleInputChange('date', e.target.value)}
                   className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-body"
                   required
                 />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2 font-heading">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                                 <input
                   type="text"
                   value={formData.location}
                   onChange={(e) => handleInputChange('location', e.target.value)}
                   placeholder="Enter event location"
                   className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary font-body"
                   required
                 />
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-4">
                                 <button
                   type="button"
                   onClick={onClose}
                   className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors font-body"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-body"
                 >
                  {isSubmitting ? (
                                         <div className="flex items-center justify-center gap-2">
                       <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                       <span className="font-body">Creating...</span>
                     </div>
                   ) : (
                     <span className="font-body">Create Event</span>
                   )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateEventModal;
