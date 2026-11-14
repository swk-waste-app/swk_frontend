import { useEffect, useState } from 'react';
import { FaWifi } from 'react-icons/fa';

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
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-amber-500 text-white text-center text-sm font-semibold py-2 px-4 flex items-center justify-center gap-2">
      <FaWifi className="opacity-80" />
      You&apos;re offline — showing saved data where available.
    </div>
  );
};

export default OfflineBanner;
