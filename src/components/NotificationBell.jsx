import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuAward, LuBell, LuCheckCheck, LuInfo, LuStar, LuTruck } from 'react-icons/lu';
import { apiGetNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead } from '../services/notifications';
import { timeAgo } from '../lib/format';
import { Skeleton } from './Skeleton';

const TYPE_ICON = { pickup: LuTruck, points: LuStar, badge: LuAward, system: LuInfo };

// In-app notifications for the top bar. Polls the backend every 30 seconds and
// when the tab regains focus, so pickup updates appear without a page refresh.
const NotificationBell = () => {
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
      // Offline or token expired: keep whatever was last shown.
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
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-haspopup="true"
        aria-expanded={open}
        className="btn btn-ghost relative h-9 w-9 p-0"
      >
        <LuBell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold tabular-nums text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-pop animate-fade-in dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={onMarkAll} className="link flex items-center gap-1 text-xs">
                <LuCheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items === null && (
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}

            {items !== null && items.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No notifications yet</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Pickup updates and rewards appear here.</p>
              </div>
            )}

            {items !== null && items.map((n) => {
              const Icon = TYPE_ICON[n.type] || TYPE_ICON.system;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onItemClick(n)}
                  className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 focus-visible:-outline-offset-2 dark:border-gray-800 dark:hover:bg-gray-800 ${
                    n.read ? '' : 'bg-brand-50 dark:bg-brand-900/40'
                  }`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</span>
                    {n.body && <span className="mt-0.5 block text-xs text-gray-600 dark:text-gray-400">{n.body}</span>}
                    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-500">{timeAgo(n.createdAt)}</span>
                  </span>
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600 dark:bg-brand-400">
                      <span className="sr-only">Unread</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
