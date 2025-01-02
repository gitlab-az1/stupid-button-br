import { ssrSafeWindow } from 'typesdk/ssr';
import { useState, useEffect } from 'react';


export type NetworkStatus = 'online' | 'offline';

export function useNetworkStatus(timeout: number = 3000): NetworkStatus {
  if(typeof timeout !== 'number' || timeout < 1) {
    timeout = 1;
  }

  if(timeout > 1000 * 60) {
    timeout = 1000 * 60;
  }
  
  const [status, setStatus] = useState<NetworkStatus>('online');
  const [offlineTimeoutId, setOfflineTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fn = {
      on: () => {
        if(offlineTimeoutId) {
          clearTimeout(offlineTimeoutId);
          setOfflineTimeoutId(null);
        }

        setStatus('online');
      },
      off: () => {
        if(offlineTimeoutId) {
          clearTimeout(offlineTimeoutId);
        }

        const timeoutId = setTimeout(() => {
          setStatus('offline');
        }, 3000);
        
        setOfflineTimeoutId(timeoutId);
      },
    } as const;

    setTimeout(() => {
      setStatus(ssrSafeWindow?.navigator.onLine ? 'online' : 'offline');
    }, 3000);

    window.addEventListener('online', fn.on);
    window.addEventListener('offline', fn.off);

    return () => {
      window.removeEventListener('online', fn.on);
      window.removeEventListener('offline', fn.off);

      if(offlineTimeoutId) {
        clearTimeout(offlineTimeoutId);
      }
    };
  }, [offlineTimeoutId]);

  return status;
}

export default useNetworkStatus;
