import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

interface NotificationContextProps {
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 9999,
            padding: '16px 24px',
            borderRadius: 8,
            background: notification.type === 'success' ? '#22c55e' : notification.type === 'error' ? '#ef4444' : '#2563eb',
            color: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            fontWeight: 500,
            fontSize: 16,
            minWidth: 200,
            textAlign: 'center',
            transition: 'all 0.3s',
          }}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
