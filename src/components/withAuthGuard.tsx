import React from 'react';
import { useAuth } from '../hooks/useAuth';

export function withAuthGuard<P>(Component: React.ComponentType<P>) {
  return function AuthGuarded(props: React.PropsWithChildren<P>) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>You must be logged in to view this page.</div>;

    return <Component {...props} />;
  };
}
