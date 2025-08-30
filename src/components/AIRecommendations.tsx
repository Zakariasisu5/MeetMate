import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Users, Plus, X } from 'lucide-react';
import { useAIRecommendations } from '../hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../services/api';

interface AIRecommendationsProps {
  className?: string;
  onRecommendationSelect?: (event: Event) => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ 
  className = '',
  onRecommendationSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const aiRecommendationsMutation = useAIRecommendations();

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = async () => {
    if (interests.length === 0) return;

    const preferences = {
      interests,
      location: location || undefined,
      dateRange: dateRange.start && dateRange.end ? {
        start: new Date(dateRange.start).toISOString(),
        end: new Date(dateRange.end).toISOString(),
      } : undefined,
    };

    await aiRecommendationsMutation.mutateAsync({ preferences });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addInterest();
    }
  };

  return (
    <div className={className}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-4 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">AI Event Recommendations</h3>
            <p className="text-sm opacity-90">Get personalized event suggestions</p>
          </div>
        </div>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">AI Recommendations</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Interests
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add an interest..."
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={addInterest}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {interest}
                        <button
                          onClick={() => removeInterest(interest)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date Range (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={interests.length === 0 || aiRecommendationsMutation.isPending}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {aiRecommendationsMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Generating Recommendations...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Get Recommendations
                    </div>
                  )}
                </button>

                {/* Results */}
                {aiRecommendationsMutation.data && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">AI Response:</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {aiRecommendationsMutation.data.response}
                    </p>
                    
                    {aiRecommendationsMutation.data.recommendations && 
                     aiRecommendationsMutation.data.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Suggested Events:</h4>
                        <div className="space-y-2">
                          {aiRecommendationsMutation.data.recommendations.map((event) => (
                            <div
                              key={event.id}
                              className="p-2 bg-background rounded border border-border hover:border-primary/50 transition-colors cursor-pointer"
                              onClick={() => onRecommendationSelect?.(event)}
                            >
                              <h5 className="font-medium text-sm">{event.title}</h5>
                              <p className="text-xs text-muted-foreground">{event.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIRecommendations;
