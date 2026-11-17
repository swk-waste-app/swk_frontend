import { useEffect, useState } from 'react';
import { LuWifiOff } from 'react-icons/lu';

// Shown whenever the browser loses connectivity; the service worker keeps
// serving cached pages and API data underneath.
const OfflineBanner = () => {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-[100] flex items-center justify-center gap-2 border-t border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      <LuWifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      You are offline. Showing saved data where available.
    </div>
  );
};

export default OfflineBanner;
