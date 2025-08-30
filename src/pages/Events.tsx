import React, { useEffect } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useRealtimeCurrentUser } from '../hooks/useRealtime';
import Events from '../components/Events';

const EventsPage: React.FC = () => {
  const { user } = useFirebaseAuth();
  const { user: currentUser, updateUser } = useRealtimeCurrentUser();

  // Create user profile in Firestore when user logs in
  useEffect(() => {
    if (user && !currentUser) {
      updateUser({
        name: user.displayName || 'User',
        email: user.email || '',
        avatar: user.photoURL || undefined,
      });
    }
  }, [user, currentUser, updateUser]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Events />
    </div>
  );
};

export default EventsPage;
