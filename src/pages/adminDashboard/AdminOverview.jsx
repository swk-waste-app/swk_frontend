import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  LuCalendar, LuChevronRight, LuCircleCheck, LuClipboardList, LuCloud, LuRefreshCw,
  LuScale, LuStore, LuTriangleAlert, LuTruck, LuUsers,
} from 'react-icons/lu';
import { Badge, Button, Card, EmptyState, PageHeader, StatCard, StatusBadge } from '../../components/ui';
import { Skeleton } from '../../components/Skeleton';
import { brand } from '../../config/brand';
import { formatDateTime, formatNumber, formatWeight } from '../../lib/format';
import { apiErrorMessage, apiGetOpsSummary } from '../../services/ops';
import { apiGetLeaderboard } from '../../services/product';

// The operations overview: today's workload, collection totals and accounts,
// all read from the summary endpoint.

const QUEUE_PATH = '/customerDashboard/adminview';

const SERIES_COLOUR = 'rgb(var(--brand-600))';
const GRID_COLOUR = 'rgb(var(--gray-200))';
const AXIS_TICK = { fontSize: 12, fill: 'rgb(var(--gray-500))' };
const HOVER_BAND = { fill: 'rgb(var(--gray-500) / 0.12)' };
// The grid colour above suits a light card; this softens it on a dark one.
const CHART_FRAME = 'dark:[&_.recharts-cartesian-grid_line]:stroke-gray-800';

const monthName = new Intl.DateTimeFormat(brand.locale, { month: 'short' });
// "2026-03" to "Mar".
const monthLabel = (key) => {
  const [year, month] = key.split('-').map(Number);
  return monthName.format(new Date(year, month - 1, 1));
};

const pickupWord = (count) => (count === 1 ? 'pickup' : 'pickups');

const ChartTooltip = ({ active, payload, label, format }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-pop">
      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
      <p className="mt-0.5 tabular-nums text-gray-600 dark:text-gray-400">{format(payload[0].value)}</p>
    </div>
  );
};

const Panel = ({ title, description, aside, children }) => (
  <Card className="flex flex-col overflow-hidden">
    <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
      {aside}
    </div>
    {children}
  </Card>
);

const ChartEmpty = ({ children }) => (
  <p className="flex h-40 items-center justify-center px-5 text-center text-sm text-gray-500 dark:text-gray-400">{children}</p>
);

const MonthlyPickups = ({ monthly }) => {
  const data = monthly.map(({ month, count }) => ({ label: monthLabel(month), count }));
  const hasData = data.some((point) => point.count > 0);

  return (
    <Panel title="Pickups per month" description="By pickup date, last six months. Cancelled pickups are left out.">
      {hasData ? (
        <div className={`h-64 px-2 py-4 ${CHART_FRAME}`} role="img" aria-label="Bar chart of pickups per month for the last six months">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} stroke={GRID_COLOUR} />
              <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip cursor={HOVER_BAND} content={<ChartTooltip format={(value) => `${formatNumber(value)} ${pickupWord(value)}`} />} />
              <Bar dataKey="count" fill={SERIES_COLOUR} radius={[4, 4, 0, 0]} maxBarSize={44} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <ChartEmpty>No pickups in the last six months.</ChartEmpty>
      )}
    </Panel>
  );
};

const WasteByType = ({ types }) => {
  const data = types.filter((type) => type.weightKg > 0).slice(0, 8);

  return (
    <Panel title="Waste collected by type" description="Weight from completed pickups, in kg.">
      {data.length > 0 ? (
        <div
          className={`px-2 py-4 ${CHART_FRAME}`}
          style={{ height: data.length * 36 + 56 }}
          role="img"
          aria-label="Bar chart of the weight collected for each waste type"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid horizontal={false} stroke={GRID_COLOUR} />
              <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(value) => formatNumber(value)} />
              <YAxis type="category" dataKey="wasteType" width={136} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip cursor={HOVER_BAND} content={<ChartTooltip format={formatWeight} />} />
              <Bar dataKey="weightKg" fill={SERIES_COLOUR} radius={[0, 4, 4, 0]} maxBarSize={20} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <ChartEmpty>No completed pickups yet.</ChartEmpty>
      )}
    </Panel>
  );
};

const NeedsAttention = ({ pickups, total }) => (
  <Panel
    title="Needs attention"
    description="In progress, or scheduled for today or earlier."
    aside={total > 0 ? <Badge tone="warning">{formatNumber(total)}</Badge> : null}
  >
    {pickups.length === 0 ? (
      <EmptyState icon={LuCircleCheck} title="Nothing needs attention" description="No pickups are in progress or due today." />
    ) : (
      <>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {pickups.map((pickup) => (
            <li key={pickup._id}>
              <Link
                to={`${QUEUE_PATH}?status=${encodeURIComponent(pickup.status)}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {pickup.user?.name || 'Unknown household'}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {pickup.wasteType}, {formatDateTime(pickup.pickupDate)}, {pickup.location}
                  </p>
                </div>
                <StatusBadge status={pickup.status} />
                <LuChevronRight className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        {total > pickups.length && (
          <div className="border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <Link to={QUEUE_PATH} className="link text-sm">See all {formatNumber(total)} in the pickup queue</Link>
          </div>
        )}
      </>
    )}
  </Panel>
);

const TopRecyclers = ({ recyclers }) => (
  <Panel title="Top recyclers" description="Households with the most points.">
    {recyclers.length === 0 ? (
      <EmptyState icon={LuUsers} title="No households yet" description="Households appear here once they have signed up." />
    ) : (
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="w-12">Rank</th>
              <th scope="col">Household</th>
              <th scope="col" className="hidden sm:table-cell">Level</th>
              <th scope="col" className="text-right">Points</th>
              <th scope="col" className="text-right">Collected</th>
            </tr>
          </thead>
          <tbody>
            {recyclers.map((recycler, index) => (
              <tr key={recycler.id || recycler._id || index}>
                <td className="tabular-nums text-gray-500 dark:text-gray-400">{index + 1}</td>
                <td className="font-medium text-gray-900 dark:text-gray-100">{recycler.name}</td>
                <td className="hidden sm:table-cell">{recycler.level}</td>
                <td className="text-right tabular-nums">{formatNumber(recycler.points)}</td>
                <td className="whitespace-nowrap text-right tabular-nums">{formatWeight(recycler.wasteCollected)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Panel>
);

const OverviewSkeleton = () => (
  <div aria-busy="true" aria-label="Loading the overview">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <Card key={index} className="space-y-3 p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24 max-w-full" />
        </Card>
      ))}
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} className="space-y-4 p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-44 w-full" />
        </Card>
      ))}
    </div>
  </div>
);

const AdminOverview = () => {
  const [summary, setSummary] = useState(null);
  const [recyclers, setRecyclers] = useState([]);
  const [view, setView] = useState('loading'); // loading | ready | error
  const [loadError, setLoadError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      // The page is still useful without the leaderboard, so its failure is not fatal.
      const [summaryResponse, leaderboardResponse] = await Promise.all([
        apiGetOpsSummary(),
        apiGetLeaderboard().catch(() => ({ data: [] })),
      ]);
      loaded.current = true;
      setSummary(summaryResponse.data);
      setRecyclers(Array.isArray(leaderboardResponse.data) ? leaderboardResponse.data : []);
      setView('ready');
    } catch (error) {
      const message = apiErrorMessage(error, 'The overview could not be loaded. Try again.');
      // A failed refresh keeps the figures that are already on screen.
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

  let content;
  if (view === 'loading') {
    content = <OverviewSkeleton />;
  } else if (view === 'error') {
    content = (
      <Card>
        <EmptyState
          icon={LuTriangleAlert}
          title="The overview could not be loaded"
          description={loadError}
          action={<Button variant="secondary" icon={LuRefreshCw} onClick={retry}>Try again</Button>}
        />
      </Card>
    );
  } else {
    const { pickups, impact, users } = summary;
    const status = pickups.byStatus;
    const open = status.Scheduled + status['In Progress'];
    const closed = status.Completed + status.Cancelled;

    content = (
      <>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Pickups today"
            value={formatNumber(pickups.today)}
            hint="With a pickup date of today"
            icon={LuCalendar}
          />
          <StatCard
            label="Awaiting collection"
            value={formatNumber(open)}
            hint={`${formatNumber(status['In Progress'])} in progress, ${formatNumber(status.Scheduled)} scheduled`}
            icon={LuTruck}
          />
          <StatCard
            label="Completion rate"
            value={closed > 0 ? `${Math.round((status.Completed / closed) * 100)}%` : 'None yet'}
            hint={closed > 0
              ? `${formatNumber(status.Completed)} completed, ${formatNumber(status.Cancelled)} cancelled`
              : 'No pickup has been completed or cancelled'}
            icon={LuCircleCheck}
          />
          <StatCard
            label="All pickups"
            value={formatNumber(pickups.total)}
            hint="Booked to date"
            icon={LuClipboardList}
          />
          <StatCard
            label="Waste collected"
            value={formatWeight(impact.weightKg)}
            hint="From completed pickups"
            icon={LuScale}
          />
          <StatCard
            label="Estimated CO2e avoided"
            value={`${formatNumber(impact.carbonKg, 1)} kg`}
            hint="Estimated from the weight collected, not measured"
            icon={LuCloud}
          />
          <StatCard
            label="Households"
            value={formatNumber(users.households)}
            hint="Registered accounts"
            icon={LuUsers}
          />
          <StatCard
            label="Vendors"
            value={formatNumber(users.vendors)}
            hint="Marketplace sellers"
            icon={LuStore}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <NeedsAttention pickups={summary.attention || []} total={pickups.needsAttention} />
          <MonthlyPickups monthly={summary.monthly || []} />
          <WasteByType types={summary.byWasteType || []} />
          <TopRecyclers recyclers={recyclers} />
        </div>
      </>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title="Operations overview"
        description={`Today's workload, collection totals and accounts for ${brand.operator}.`}
        actions={(
          <>
            <Button variant="secondary" icon={LuRefreshCw} loading={refreshing && view === 'ready'} disabled={view === 'loading'} onClick={load}>
              Refresh
            </Button>
            <Button as={Link} to={QUEUE_PATH} icon={LuTruck}>Open pickup queue</Button>
          </>
        )}
      />
      {content}
    </div>
  );
};

export default AdminOverview;
