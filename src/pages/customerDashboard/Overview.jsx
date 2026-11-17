import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  LuArrowRight, LuCalendarPlus, LuChartBar, LuCircleCheck, LuFlame, LuLeaf, LuMapPin, LuRecycle, LuTrophy, LuWeight,
} from 'react-icons/lu';
import { Badge, Button, Card, EmptyState, PageHeader, StatCard, StatusBadge } from '../../components/ui';
import { Skeleton } from '../../components/Skeleton';
import { formatDateTime, formatDay, formatNumber, formatWeight } from '../../lib/format';
import { apiGetLeaderboard, apiGetUserStats } from '../../services/product';
import { apiGetMyPickups } from '../../services/pickups';
import { SchedulePickupButton } from './DatePicker';
import { LoadError, PickupRow, PickupRowsSkeleton, StatCardSkeleton } from './wasteList';
import { PICKUPS_PATH, badgeName, levelProgress, monthlyCounts, nextPickup, pickupId, pickupPath, weightLabel } from './pickupUtils';

const AXIS_TICK = { fontSize: 12, fill: 'rgb(var(--gray-500))' };

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{children}</h2>
);

const NextPickup = ({ pickup, onScheduled }) => (
  <Card className="p-5 lg:col-span-2">
    <div className="flex items-center justify-between gap-3">
      <SectionTitle>Next pickup</SectionTitle>
      {pickup && <StatusBadge status={pickup.status} />}
    </div>
    {pickup ? (
      <>
        <p className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">{formatDay(pickup.pickupDate)}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{formatDateTime(pickup.pickupDate)}</p>
        <ul className="mt-4 grid gap-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <LuRecycle className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            {pickup.wasteType || 'General Waste'}
            {weightLabel(pickup) && <span className="text-gray-500 dark:text-gray-400">({weightLabel(pickup)})</span>}
          </li>
          <li className="flex items-start gap-2">
            <LuMapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <span className="min-w-0 break-words">{pickup.location}</span>
          </li>
        </ul>
        <Button as={Link} to={pickupPath(pickup)} variant="secondary" size="sm" className="mt-5">
          View pickup
          <LuArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </>
    ) : (
      <EmptyState
        icon={LuCalendarPlus}
        title="No pickup scheduled"
        description="Choose a date and time and a collector will come to your address."
        action={<SchedulePickupButton variant="secondary" onScheduled={onScheduled} />}
        className="py-8"
      />
    )}
  </Card>
);

const LevelCard = ({ points, badges }) => {
  const { current, next, percent, remaining } = levelProgress(points);
  return (
    <Card className="p-5">
      <p className="eyebrow">Level</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">{current.name}</p>
      <p className="mt-1 text-sm tabular-nums text-gray-600 dark:text-gray-400">{formatNumber(points)} points</p>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        role="progressbar"
        aria-label="Progress to the next level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full bg-brand-600 dark:bg-brand-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs tabular-nums text-gray-500 dark:text-gray-400">
        {next ? `${formatNumber(remaining)} points to ${next.name}` : 'You have reached the highest level.'}
      </p>
      <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
        <p className="eyebrow">Badges</p>
        {badges.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((id) => <Badge key={id} tone="brand">{badgeName(id)}</Badge>)}
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">None yet. Your first completed pickup earns one.</p>
        )}
      </div>
    </Card>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const count = payload[0].value;
  return (
    <div className="card px-3 py-2 text-xs shadow-pop">
      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
      <p className="mt-0.5 tabular-nums text-gray-600 dark:text-gray-400">{count} {count === 1 ? 'pickup' : 'pickups'} booked</p>
    </div>
  );
};

const MonthlyChart = ({ data }) => (
  <Card className="p-5">
    <SectionTitle>Pickups booked</SectionTitle>
    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Each of the last six months.</p>
    {data.some((month) => month.pickups > 0) ? (
      <div
        className="mt-4 h-56 [&_.recharts-cartesian-grid_line]:stroke-gray-200 dark:[&_.recharts-cartesian-grid_line]:stroke-gray-800"
        role="img"
        aria-label={`Pickups booked per month: ${data.map((month) => `${month.month} ${month.pickups}`).join(', ')}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="rgb(var(--gray-200))" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_TICK} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} tick={AXIS_TICK} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgb(var(--gray-500) / 0.12)' }} />
            <Bar dataKey="pickups" fill="rgb(var(--brand-600))" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <EmptyState icon={LuChartBar} title="Nothing to chart yet" description="Pickups you book will be counted here by month." className="py-8" />
    )}
  </Card>
);

const Leaderboard = ({ entries, userId }) => (
  <Card className="overflow-hidden">
    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
      <SectionTitle>Community leaderboard</SectionTitle>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">The households with the most points.</p>
    </div>
    {entries.length > 0 ? (
      <ol className="divide-y divide-gray-100 dark:divide-gray-800">
        {entries.map((entry, index) => {
          const entryId = String(entry.id || entry._id || index);
          const isUser = Boolean(userId) && entryId === userId;
          return (
            <li
              key={entryId}
              className={`flex items-center gap-3 px-5 py-3 ${isUser ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`}
              aria-current={isUser ? 'true' : undefined}
            >
              <span className="w-6 shrink-0 text-sm font-semibold tabular-nums text-gray-500 dark:text-gray-400">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <span className="truncate">{entry.name}</span>
                  {isUser && <Badge tone="brand">You</Badge>}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{entry.level || levelProgress(entry.points).current.name}</p>
              </div>
              <div className="shrink-0 text-right tabular-nums">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatNumber(entry.points)} points</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatWeight(entry.wasteCollected)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    ) : (
      <EmptyState icon={LuTrophy} title="No rankings yet" description="Households appear here once they earn points from completed pickups." className="py-8" />
    )}
  </Card>
);

const OverviewSkeleton = () => (
  <div className="grid gap-6" aria-hidden="true">
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-5 h-7 w-40" />
        <Skeleton className="mt-3 h-4 w-56 max-w-full" />
        <Skeleton className="mt-3 h-4 w-48 max-w-full" />
      </Card>
      <Card className="p-5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-3 h-7 w-32" />
        <Skeleton className="mt-5 h-2 w-full rounded-full" />
        <Skeleton className="mt-3 h-3 w-36" />
      </Card>
    </div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
    </div>
    <Card className="overflow-hidden">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800"><Skeleton className="h-5 w-36" /></div>
      <PickupRowsSkeleton rows={3} />
    </Card>
  </div>
);

// The household home page: what is coming up, where the household stands,
// and what it has done so far.
const Overview = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);

  // Also called after a pickup is scheduled, so the page updates in place.
  const load = useCallback(async () => {
    try {
      const [statsRes, pickupsRes, leaderboardRes] = await Promise.all([
        apiGetUserStats(),
        apiGetMyPickups(),
        apiGetLeaderboard().catch(() => ({ data: [] })),
      ]);
      setData({
        stats: statsRes.data || {},
        pickups: Array.isArray(pickupsRes.data) ? pickupsRes.data : [],
        leaderboard: Array.isArray(leaderboardRes.data) ? leaderboardRes.data : [],
      });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    // Admins have their own overview.
    if (role === 'admin') {
      navigate('/customerDashboard/adminoverview', { replace: true });
      return;
    }
    load();
  }, [role, navigate, load]);

  if (role === 'admin') return null;

  const retry = () => {
    setStatus('loading');
    load();
  };

  const user = data?.stats.user || {};
  const totals = data?.stats.stats || {};
  const firstName = user.name?.trim().split(/\s+/)[0];
  const streak = totals.streak || 0;
  const recent = data
    ? [...data.pickups].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    : [];

  return (
    <div className="page">
      <PageHeader
        title={firstName ? `Hello, ${firstName}` : 'Hello'}
        description="Your next pickup, your points and what you have recycled so far."
        actions={<SchedulePickupButton onScheduled={load} />}
      />

      {status === 'loading' && <OverviewSkeleton />}

      {status === 'error' && (
        <Card><LoadError title="Your dashboard could not be loaded" onRetry={retry} /></Card>
      )}

      {status === 'ready' && (
        <div className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <NextPickup pickup={nextPickup(data.pickups)} onScheduled={load} />
            <LevelCard points={totals.totalPoints || 0} badges={user.badges || []} />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Pickups completed" icon={LuCircleCheck} value={formatNumber(totals.completedPickups)} />
            <StatCard label="Waste collected" icon={LuWeight} value={formatWeight(totals.totalWasteCollected || user.wasteCollected)} />
            <StatCard label="Carbon avoided" icon={LuLeaf} value={formatWeight(totals.totalCarbonSaved || user.carbonSaved)} hint="Estimated CO2e" />
            <StatCard label="Current streak" icon={LuFlame} value={`${formatNumber(streak)} ${streak === 1 ? 'week' : 'weeks'}`} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                <SectionTitle>Recent pickups</SectionTitle>
                <Link to={PICKUPS_PATH} className="link text-sm">View all</Link>
              </div>
              {recent.length > 0 ? (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recent.map((pickup) => <PickupRow key={pickupId(pickup)} pickup={pickup} />)}
                </ul>
              ) : (
                <EmptyState icon={LuRecycle} title="No pickups yet" description="Pickups you schedule will be listed here." className="py-8" />
              )}
            </Card>
            <MonthlyChart data={monthlyCounts(data.pickups)} />
          </div>

          <Leaderboard entries={data.leaderboard} userId={String(user.id || user._id || '')} />
        </div>
      )}
    </div>
  );
};

export default Overview;
