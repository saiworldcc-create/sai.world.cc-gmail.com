import { useState, useEffect } from 'react';
import { updateDeliveryStatus } from '../services/api';

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const checkQueue = () => {
      const queue = JSON.parse(localStorage.getItem('deliveryQueue') || '[]');
      setQueueCount(queue.length);
    };

    const handleOnline = async () => {
      setIsOnline(true);
      const queue = JSON.parse(localStorage.getItem('deliveryQueue') || '[]');
      
      if (queue.length > 0) {
        // Process queue
        for (const item of queue) {
          try {
            await updateDeliveryStatus(item.awb, { status: item.status, location: item.location });
          } catch (e) {
            console.error('Failed to sync item:', item);
          }
        }
        localStorage.setItem('deliveryQueue', '[]');
        setQueueCount(0);
        alert('All offline updates have been synced!');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const enqueueUpdate = (awb, status, location) => {
    const queue = JSON.parse(localStorage.getItem('deliveryQueue') || '[]');
    queue.push({ awb, status, location, timestamp: Date.now() });
    localStorage.setItem('deliveryQueue', JSON.stringify(queue));
    setQueueCount(queue.length);
  };

  return { isOnline, queueCount, enqueueUpdate };
}
