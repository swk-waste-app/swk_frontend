import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LuBan, LuCalendar, LuCircleCheck, LuClipboardList, LuMapPin, LuPhone, LuPlay,
  LuRecycle, LuRefreshCw, LuSearch, LuTriangleAlert, LuTruck,
} from 'react-icons/lu';
import { Badge, Button, Card, EmptyState, Field, Modal, PageHeader, StatusBadge } from '../../components/ui';
import { confirmAction } from '../../components/ui/confirm';
import { Skeleton } from '../../components/Skeleton';
import { formatDateTime, formatNumber, formatWeight } from '../../lib/format';
import { apiErrorMessage, apiGetPickups, apiUpdatePickupStatus } from '../../services/ops';

// The pickup queue: where the operations team starts, completes and cancels
// household pickups.

const PAGE_SIZE = 200;
// Must match the backend, which awards the points when a pickup is completed.
const POINTS_PER_KG = 10;
const FORM_ID = 'pickup-action-form';

const TABS = [
  { value: 'All', label: 'All' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'In Progress', label: 'In progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const cx = (...parts) => parts.filter(Boolean).join(' ');

const isOpen = (pickup) => pickup.status === 'Scheduled' || pickup.status === 'In Progress';
const customerName = (pickup) => pickup.user?.name || 'Unknown household';
const describe = (pickup) =>
  `${pickup.wasteType} pickup for ${customerName(pickup)}, ${formatDateTime(pickup.pickupDate)}`;

const weightLabel = (pickup) => {
  if (pickup.actualWeight > 0) return formatWeight(pickup.actualWeight);
  if (pickup.estimatedWeight > 0) return `est. ${formatWeight(pickup.estimatedWeight)}`;
  return 'Not given';
};

const isOverdue = (pickup) => {
  if (pickup.status !== 'Scheduled') return false;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return new Date(pickup.pickupDate) < startOfToday;
};

// Pickups that need action come first: in progress, then scheduled with the
// earliest date on top. Finished pickups follow, most recent first.
const RANK = { 'In Progress': 0, Scheduled: 1 };
const byUrgency = (a, b) => {
  const rankA = RANK[a.status] ?? 2;
  const rankB = RANK[b.status] ?? 2;
  if (rankA !== rankB) return rankA - rankB;
  const earliestFirst = new Date(a.pickupDate) - new Date(b.pickupDate);
  return rankA < 2 ? earliestFirst : -earliestFirst;
};

const searchText = (pickup) => {
  const phone = pickup.user?.contactNumber || '';
  return [pickup.user?.name, phone, phone.replace(/\D/g, ''), pickup.user?.email, pickup.location, pickup.wasteType, pickup.agentName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

// The dialog focuses its own panel when it opens; this moves on to the field.
const useFocusOnOpen = () => {
  const ref = useRef(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.select();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return ref;
};

const StartDialog = ({ pickup, collectors, saving, onClose, onSubmit }) => {
  const [agentName, setAgentName] = useState(pickup.agentName || '');
  const inputRef = useFocusOnOpen();

  return (
    <Modal
      open
      size="sm"
      onClose={onClose}
      title="Start pickup"
      description={describe(pickup)}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Back</Button>
          <Button type="submit" form={FORM_ID} icon={LuPlay} loading={saving}>Start pickup</Button>
        </>
      )}
    >
      <form id={FORM_ID} onSubmit={(event) => { event.preventDefault(); onSubmit(agentName.trim()); }}>
        <Field label="Collector or crew" htmlFor="pickup-collector" optional hint="The household is told who is coming.">
          <input
            id="pickup-collector"
            ref={inputRef}
            className="input"
            list="pickup-collectors"
            maxLength={80}
            autoComplete="off"
            placeholder="e.g. Truck 2"
            value={agentName}
            onChange={(event) => setAgentName(event.target.value)}
          />
          <datalist id="pickup-collectors">
            {collectors.map((name) => <option key={name} value={name} />)}
          </datalist>
        </Field>
      </form>
    </Modal>
  );
};

const CompleteDialog = ({ pickup, saving, onClose, onSubmit }) => {
  const [weight, setWeight] = useState(String(pickup.actualWeight || pickup.estimatedWeight || ''));
  const [error, setError] = useState('');
  const inputRef = useFocusOnOpen();

  const kg = Number(weight);
  const valid = weight.trim() !== '' && Number.isFinite(kg) && kg >= 0;
  const points = valid ? Math.round(kg * POINTS_PER_KG) : 0;
  const estimate = pickup.estimatedWeight > 0 ? pickup.estimatedWeight : 0;
  const farAboveEstimate = valid && estimate > 0 && kg > estimate * 3;

  const submit = (event) => {
    event.preventDefault();
    if (!valid) {
      setError('Enter the weight collected in kg. Use 0 if nothing was collected.');
      return;
    }
    onSubmit(kg);
  };

  return (
    <Modal
      open
      size="sm"
      onClose={onClose}
      title="Complete pickup"
      description={describe(pickup)}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Back</Button>
          <Button type="submit" form={FORM_ID} icon={LuCircleCheck} loading={saving}>Complete pickup</Button>
        </>
      )}
    >
      <form id={FORM_ID} noValidate onSubmit={submit}>
        <Field
          label="Actual weight (kg)"
          htmlFor="pickup-weight"
          error={error}
          hint={estimate ? `The household estimated ${formatWeight(estimate)}.` : 'The household did not give an estimate.'}
        >
          <input
            id="pickup-weight"
            ref={inputRef}
            className="input tabular-nums"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={weight}
            onChange={(event) => { setWeight(event.target.value); setError(''); }}
          />
        </Field>
        <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {customerName(pickup)} will receive{' '}
          <strong className="font-semibold tabular-nums text-gray-900 dark:text-gray-50">{formatNumber(points)} points</strong>{' '}
          ({POINTS_PER_KG} per kg). Points are awarded once and cannot be changed afterwards.
        </p>
        {farAboveEstimate && (
          <p className="mt-3 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
            <LuTriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            This is more than three times the estimate. Check the figure before completing.
          </p>
        )}
      </form>
    </Modal>
  );
};

const Phone = ({ pickup }) => {
  const phone = pickup.user?.contactNumber;
  if (!phone) return <p className="text-xs text-gray-500 dark:text-gray-400">No phone number</p>;
  return (
    <a href={`tel:${phone}`} className="inline-flex items-center gap-1 text-xs text-gray-600 hover:underline dark:text-gray-400">
      <LuPhone className="h-3 w-3" aria-hidden="true" />
      {phone}
    </a>
  );
};

const PickupDate = ({ pickup }) => (
  <span className="inline-flex flex-wrap items-center gap-2">
    <span className="whitespace-nowrap tabular-nums">{formatDateTime(pickup.pickupDate)}</span>
    {isOverdue(pickup) && <Badge tone="warning">Overdue</Badge>}
  </span>
);

const Collector = ({ pickup }) =>
  pickup.agentName || <span className="text-gray-400 dark:text-gray-500">No collector yet</span>;

const PickupActions = ({ pickup, busy, onStart, onComplete, onCancel }) => {
  if (pickup.status === 'Completed') {
    return (
      <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
        {formatNumber(pickup.pointsEarned)} points awarded
      </span>
    );
  }
  if (!isOpen(pickup)) return null;

  const name = customerName(pickup);
  return (
    <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap xl:justify-end">
      {pickup.status === 'Scheduled' ? (
        <Button size="sm" icon={LuPlay} loading={busy} aria-label={`Start pickup for ${name}`} onClick={() => onStart(pickup)}>
          Start
        </Button>
      ) : (
        <Button size="sm" icon={LuCircleCheck} loading={busy} aria-label={`Complete pickup for ${name}`} onClick={() => onComplete(pickup)}>
          Complete
        </Button>
      )}
      <Button size="sm" variant="ghost" icon={LuBan} disabled={busy} aria-label={`Cancel pickup for ${name}`} onClick={() => onCancel(pickup)}>
        Cancel
      </Button>
    </div>
  );
};

const PickupCard = ({ pickup, actions }) => (
  <Card as="li" className="flex flex-col gap-3 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{customerName(pickup)}</p>
        <Phone pickup={pickup} />
      </div>
      <StatusBadge status={pickup.status} />
    </div>
    <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
      <li className="flex items-start gap-2">
        <LuRecycle className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        <span>{pickup.wasteType}, <span className="tabular-nums">{weightLabel(pickup)}</span></span>
      </li>
      <li className="flex items-start gap-2">
        <LuCalendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        <PickupDate pickup={pickup} />
      </li>
      <li className="flex items-start gap-2">
        <LuMapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        <span className="min-w-0 break-words">{pickup.location}</span>
      </li>
      <li className="flex items-start gap-2">
        <LuTruck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        <span><Collector pickup={pickup} /></span>
      </li>
    </ul>
    {pickup.notes && (
      <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        Note from the household: {pickup.notes}
      </p>
    )}
    {pickup.status !== 'Cancelled' && (
      <div className="border-t border-gray-100 pt-3 dark:border-gray-800">{actions}</div>
    )}
  </Card>
);

const QueueSkeleton = () => (
  <Card className="divide-y divide-gray-100 dark:divide-gray-800" aria-busy="true" aria-label="Loading pickups">
    {Array.from({ length: 6 }, (_, row) => (
      <div key={row} className="flex items-center gap-4 px-4 py-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-40 max-w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="hidden h-4 w-28 sm:block" />
        <Skeleton className="hidden h-4 w-36 lg:block" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="hidden h-8 w-32 sm:block" />
      </div>
    ))}
  </Card>
);

const AdminDashboard = () => {
  const [pickups, setPickups] = useState([]);
  const [view, setView] = useState('loading'); // loading | ready | error
  const [loadError, setLoadError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState([]);
  const [dialog, setDialog] = useState(null); // { type: 'start' | 'complete', pickup }
  const [params, setParams] = useSearchParams();
  const loaded = useRef(false);
  const inFlight = useRef(new Set());

  // The status filter lives in the URL so the overview can link straight to it.
  const requested = params.get('status');
  const filter = TABS.some((tab) => tab.value === requested) ? requested : 'All';
  const setFilter = (value) => setParams(value === 'All' ? {} : { status: value }, { replace: true });

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data } = await apiGetPickups({ limit: PAGE_SIZE });
      const list = Array.isArray(data) ? data : [];
      loaded.current = true;
      setPickups(list);
      setHasMore(list.length === PAGE_SIZE);
      setView('ready');
    } catch (error) {
      const message = apiErrorMessage(error, 'Pickups could not be loaded. Try again.');
      // A failed refresh keeps the list that is already on screen.
      if (loaded.current) toast.error(message);
      else {
        setLoadError(message);
        setView('error');
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const retry = () => {
    setView('loading');
    load();
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data } = await apiGetPickups({ limit: PAGE_SIZE, skip: pickups.length });
      const more = Array.isArray(data) ? data : [];
      setPickups((list) => {
        const seen = new Set(list.map((pickup) => pickup._id));
        return [...list, ...more.filter((pickup) => !seen.has(pickup._id))];
      });
      setHasMore(more.length === PAGE_SIZE);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'More pickups could not be loaded. Try again.'));
    } finally {
      setLoadingMore(false);
    }
  };

  const closeDialog = useCallback(() => setDialog(null), []);

  // Sends one status change, updates that row in place and reports the result.
  const changeStatus = async (pickup, body, successMessage) => {
    const id = pickup._id;
    if (inFlight.current.has(id)) return false;
    inFlight.current.add(id);
    setBusy([...inFlight.current]);
    try {
      const { data } = await apiUpdatePickupStatus(id, body);
      const updated = data?.pickup || { ...pickup, ...body };
      setPickups((list) => list.map((item) => (item._id === id ? updated : item)));
      toast.success(successMessage);
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error, 'The pickup could not be updated. Try again.'));
      // Someone else already closed it: show what the server has now.
      if (error.response?.status === 409) load();
      return false;
    } finally {
      inFlight.current.delete(id);
      setBusy([...inFlight.current]);
    }
  };

  const startPickup = async (agentName) => {
    if (await changeStatus(dialog.pickup, { status: 'In Progress', agentName }, 'Pickup started')) closeDialog();
  };

  const completePickup = async (actualWeight) => {
    const points = formatNumber(Math.round(actualWeight * POINTS_PER_KG));
    const done = await changeStatus(
      dialog.pickup,
      { status: 'Completed', actualWeight },
      `Pickup completed. ${points} points awarded to ${customerName(dialog.pickup)}.`,
    );
    if (done) closeDialog();
  };

  const cancelPickup = async (pickup) => {
    const confirmed = await confirmAction({
      title: 'Cancel this pickup?',
      body: `The ${describe(pickup)} will be cancelled and the household will be notified. A cancelled pickup cannot be reopened.`,
      confirmLabel: 'Cancel pickup',
      cancelLabel: 'Keep pickup',
      tone: 'danger',
    });
    if (confirmed) changeStatus(pickup, { status: 'Cancelled' }, 'Pickup cancelled');
  };

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const digits = needle.replace(/[\s()+-]/g, '');
    const list = needle
      ? pickups.filter((pickup) => {
        const text = searchText(pickup);
        return text.includes(needle) || (digits !== '' && text.includes(digits));
      })
      : pickups;
    return [...list].sort(byUrgency);
  }, [pickups, query]);

  const counts = useMemo(() => {
    const tally = { All: matches.length };
    matches.forEach((pickup) => { tally[pickup.status] = (tally[pickup.status] || 0) + 1; });
    return tally;
  }, [matches]);

  const collectors = useMemo(
    () => [...new Set(pickups.map((pickup) => pickup.agentName).filter(Boolean))].sort(),
    [pickups],
  );

  const visible = filter === 'All' ? matches : matches.filter((pickup) => pickup.status === filter);

  const actionsFor = (pickup) => (
    <PickupActions
      pickup={pickup}
      busy={busy.includes(pickup._id)}
      onStart={(target) => setDialog({ type: 'start', pickup: target })}
      onComplete={(target) => setDialog({ type: 'complete', pickup: target })}
      onCancel={cancelPickup}
    />
  );

  const clearFilters = () => {
    setQuery('');
    setFilter('All');
  };

  let content;
  if (view === 'loading') {
    content = <QueueSkeleton />;
  } else if (view === 'error') {
    content = (
      <Card>
        <EmptyState
          icon={LuTriangleAlert}
          title="Pickups could not be loaded"
          description={loadError}
          action={<Button variant="secondary" icon={LuRefreshCw} onClick={retry}>Try again</Button>}
        />
      </Card>
    );
  } else if (pickups.length === 0) {
    content = (
      <Card>
        <EmptyState
          icon={LuClipboardList}
          title="No pickups yet"
          description="Pickups appear here as soon as a household books one."
        />
      </Card>
    );
  } else if (visible.length === 0) {
    content = (
      <Card>
        <EmptyState
          icon={LuSearch}
          title="No pickups match"
          description="Nothing fits the current search and status filter."
          action={<Button variant="secondary" onClick={clearFilters}>Clear search and filter</Button>}
        />
      </Card>
    );
  } else {
    content = (
      <>
        <Card className="hidden overflow-hidden xl:block">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Pickup</th>
                  <th scope="col">Date</th>
                  <th scope="col">Location</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((pickup) => (
                  <tr key={pickup._id}>
                    <td>
                      <p className="whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{customerName(pickup)}</p>
                      <Phone pickup={pickup} />
                    </td>
                    <td>
                      <p>{pickup.wasteType}</p>
                      <p className="whitespace-nowrap text-xs tabular-nums text-gray-500 dark:text-gray-400">{weightLabel(pickup)}</p>
                    </td>
                    <td><PickupDate pickup={pickup} /></td>
                    <td className="max-w-[14rem]">
                      <p className="line-clamp-2">{pickup.location}</p>
                      {pickup.notes && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400" title={pickup.notes}>
                          Note: {pickup.notes}
                        </p>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={pickup.status} />
                      <p className="mt-1 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400"><Collector pickup={pickup} /></p>
                    </td>
                    <td className="text-right">{actionsFor(pickup)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <ul className="grid gap-3 md:grid-cols-2 xl:hidden">
          {visible.map((pickup) => (
            <PickupCard key={pickup._id} pickup={pickup} actions={actionsFor(pickup)} />
          ))}
        </ul>

        {hasMore && (
          <div className="mt-4 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing the {formatNumber(pickups.length)} most recent pickups by pickup date. Search and counts cover these only.
            </p>
            <Button variant="secondary" loading={loadingMore} onClick={loadMore}>Load older pickups</Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title="Pickups"
        description="Start, complete and cancel household pickups. Pickups that need action are listed first."
        actions={(
          <Button variant="secondary" icon={LuRefreshCw} loading={refreshing && view === 'ready'} disabled={view === 'loading'} onClick={load}>
            Refresh
          </Button>
        )}
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:px-0">
          <div role="group" aria-label="Filter by status" className="inline-flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {TABS.map((tab) => {
              const active = filter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(tab.value)}
                  className={cx(
                    'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-white text-gray-900 shadow-card dark:bg-gray-950 dark:text-gray-50'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                  )}
                >
                  {tab.label}
                  <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
                    {view === 'ready' ? formatNumber(counts[tab.value] || 0) : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="relative w-full lg:w-80">
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <input
            type="search"
            className="input pl-9"
            placeholder="Search name, phone, location or type"
            aria-label="Search pickups"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      {content}

      {dialog?.type === 'start' && (
        <StartDialog
          pickup={dialog.pickup}
          collectors={collectors}
          saving={busy.includes(dialog.pickup._id)}
          onClose={closeDialog}
          onSubmit={startPickup}
        />
      )}
      {dialog?.type === 'complete' && (
        <CompleteDialog
          pickup={dialog.pickup}
          saving={busy.includes(dialog.pickup._id)}
          onClose={closeDialog}
          onSubmit={completePickup}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
