'use client';

import { useEffect } from 'react';

/**
 * Auto-ping the database health endpoint every 6 hours while user is online.
 * This keeps the Supabase free tier database from auto-suspending.
 * 
 * Add to your root layout:
 * <DatabaseKeepAlive />
 */
export function DatabaseKeepAlive() {
  useEffect(() => {
    // Ping on mount
    const pingDatabase = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'GET',
          cache: 'no-store',
        });
        if (!response.ok) {
          console.warn('Database health check failed:', response.status);
        }
      } catch (err) {
        console.error('Failed to ping database:', err);
      }
    };

    pingDatabase();

    // Set up interval to ping every 6 hours
    const intervalId = setInterval(pingDatabase, 6 * 60 * 60 * 1000);

    // Ping when user returns from being idle
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pingDatabase();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
