import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LuBookOpen, LuClipboardList, LuFileText, LuLayoutDashboard, LuLogOut, LuNewspaper, LuPackage,
  LuPencil, LuPlus, LuScanLine, LuShoppingBag, LuStore, LuTruck, LuUser, LuX,
} from 'react-icons/lu';
import BrandLockup from '../../components/BrandLockup';
import { Skeleton } from '../../components/Skeleton';
import { Badge } from '../../components/ui';

const APP = '/customerDashboard';

// `also` lists the detail screens that belong to an item, so it stays
// highlighted while the person is one level deeper.
const MARKETPLACE = { label: 'Marketplace', to: `${APP}/products`, icon: LuShoppingBag, also: [`${APP}/product`, `${APP}/store`] };
const SCANNER = { label: 'AI scanner', to: `${APP}/scan`, icon: LuScanLine };
const NEWS = { label: 'News', to: `${APP}/blogs`, icon: LuNewspaper };
const ARTICLES = { label: 'Articles', to: `${APP}/articles`, icon: LuFileText };

const NAVIGATION = {
  user: [
    {
      label: 'Your household',
      items: [
        { label: 'Overview', to: `${APP}/overview`, icon: LuLayoutDashboard },
        { label: 'Pickups', to: `${APP}/pickup`, icon: LuTruck, also: [`${APP}/wpickup`, `${APP}/schedule`, `${APP}/editSchedule`] },
        SCANNER,
        MARKETPLACE,
      ],
    },
    { label: 'Read and learn', items: [NEWS, ARTICLES, { label: 'Learn', to: '/education', icon: LuBookOpen }] },
    { label: 'Become a vendor', items: [{ label: 'Sell on the marketplace', to: '/signup?type=vendor', icon: LuStore }] },
  ],
  vendor: [
    {
      label: 'Your shop',
      items: [
        { label: 'Overview', to: `${APP}/vendoroverview`, icon: LuLayoutDashboard },
        { label: 'My listings', to: `${APP}/vendorProduct`, icon: LuPackage, also: [`${APP}/editProduct`] },
        { label: 'Add listing', to: `${APP}/addProduct`, icon: LuPlus },
      ],
    },
    { label: 'Explore', items: [MARKETPLACE, SCANNER, NEWS, ARTICLES] },
  ],
  admin: [
    {
      label: 'Operations',
      items: [
        { label: 'Overview', to: `${APP}/adminoverview`, icon: LuLayoutDashboard },
        { label: 'Pickups', to: `${APP}/adminview`, icon: LuClipboardList, also: [`${APP}/schedule`] },
        { label: 'Publish article', to: `${APP}/addEducation`, icon: LuPencil },
      ],
    },
    { label: 'Explore', items: [MARKETPLACE, SCANNER, NEWS, ARTICLES] },
  ],
};

const ROLE_LABEL = { user: 'Household', vendor: 'Vendor', admin: 'Operations' };

const isActive = (item, pathname) =>
  [item.to, ...(item.also || [])].some((path) => pathname === path || pathname.startsWith(`${path}/`));

const linkClass = (active) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50'
  }`;

// The app's navigation. Always visible from the `lg` breakpoint up; below it,
// a drawer that the top bar's menu button opens (`open`, `onClose`).
// `profile` is undefined while it loads and null when it could not be loaded.
const SideBar = ({ role, profile, open, onClose, onSignOut }) => {
  const { pathname } = useLocation();
  const closeRef = useRef(null);
  const groups = NAVIGATION[role] || NAVIGATION.user;
  const initial = profile?.name?.trim().charAt(0).toUpperCase();

  // While the drawer is open: Escape closes it, the page behind does not
  // scroll, and focus moves in, then back to the menu button on close.
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const desktop = window.matchMedia('(min-width: 1024px)');
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onClose);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onClose);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-gray-950/50 transition-opacity duration-200 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-[transform,visibility] duration-200 dark:border-gray-800 dark:bg-gray-900 lg:visible lg:z-30 lg:translate-x-0 ${
          open ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-4 dark:border-gray-800">
          <Link to={groups[0].items[0].to} onClick={onClose} className="min-w-0 rounded-lg text-gray-900 dark:text-gray-50">
            <BrandLockup />
          </Link>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="btn btn-ghost -mr-1.5 h-9 w-9 shrink-0 p-0 lg:hidden">
            <LuX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Main" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="eyebrow mb-2 px-3">{group.label}</p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item, pathname);
                  return (
                    <li key={item.to}>
                      <Link to={item.to} onClick={onClose} aria-current={active ? 'page' : undefined} className={linkClass(active)}>
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-300"
              aria-hidden="true"
            >
              {initial || <LuUser className="h-4 w-4" />}
            </span>
            <div className="flex min-w-0 flex-col items-start gap-1">
              {profile === undefined
                ? <Skeleton className="h-4 w-24" />
                : <p className="max-w-full truncate text-sm font-medium text-gray-900 dark:text-gray-100">{profile?.name || 'Your account'}</p>}
              <Badge>{ROLE_LABEL[role] || ROLE_LABEL.user}</Badge>
            </div>
          </div>
          <button type="button" onClick={onSignOut} className="btn btn-ghost mt-1 w-full justify-start gap-3 px-3">
            <LuLogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
