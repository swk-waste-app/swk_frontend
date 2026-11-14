import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import { apiGetNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead } from '../services/notifications';
import { Skeleton } from './Skeleton';

const TYPE_ICON = { pickup: '🗓️', points: '🌟', badge: '🏅', system: '📣' };

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

// Real in-app notifications: polls the backend every 30s and when the tab
// regains focus, so pickup updates appear without a page refresh.
// placement: 'sidebar' (desktop green sidebar) or 'header' (mobile top bar).
const NotificationBell = ({ placement = 'sidebar' }) => {
  const [items, setItems] = useState(null);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    try {
      const { data } = await apiGetNotifications();
      setItems(data.notifications);
      setUnread(data.unreadCount);
    } catch {
      // Offline or token expired — keep whatever we last showed.
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    const onFocus = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onFocus);
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const onItemClick = (n) => {
    setOpen(false);
    if (!n.read) {
      setUnread((u) => Math.max(0, u - 1));
      setItems((list) => (list || []).map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      apiMarkNotificationRead(n.id).catch(() => {});
    }
    if (n.link) navigate(n.link);
  };

  const onMarkAll = () => {
    setUnread(0);
    setItems((list) => (list || []).map((x) => ({ ...x, read: true })));
    apiMarkAllNotificationsRead().catch(() => {});
  };

  const panelPosition = placement === 'header'
    ? 'fixed right-2 top-14 w-80 max-w-[92vw]'
    : 'fixed left-3 top-24 w-72 max-w-[85vw]';

  return (
    <div ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative p-2 rounded-full text-white hover:bg-green-700 transition-colors duration-200"
      >
        <FaBell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className={`${panelPosition} z-[80] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden text-left animate-fade-in`}>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={onMarkAll}
                className="text-xs font-semibold text-green-700 dark:text-green-400 hover:underline flex items-center gap-1"
              >
                <FaCheckDouble size={10} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items === null && (
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}

            {items !== null && items.length === 0 && (
              <div className="p-8 text-center">
                <FaBell className="mx-auto text-3xl text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Pickup updates and rewards will appear here.</p>
              </div>
            )}

            {items !== null && items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onItemClick(n)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex items-start gap-3 transition-colors ${
                  n.read
                    ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                    : 'bg-green-50/70 dark:bg-green-900/20 hover:bg-green-50 dark:hover:bg-green-900/30'
                }`}
              >
                <span className="text-lg leading-none mt-0.5">{TYPE_ICON[n.type] || TYPE_ICON.system}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100">{n.title}</span>
                  {n.body && <span className="block text-xs text-gray-600 dark:text-gray-300 mt-0.5">{n.body}</span>}
                  <span className="block text-[11px] text-gray-400 dark:text-gray-500 mt-1">{timeAgo(n.createdAt)}</span>
                </span>
                {!n.read && <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
