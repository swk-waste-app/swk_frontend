import { LuBell, LuMapPin, LuRecycle } from 'react-icons/lu';
import { Badge, Card, StatusBadge } from '../../components/ui';
import { formatDay } from '../../lib/format';

const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

// A sample of the household dashboard, built from the same components the
// signed-in app uses. The content is illustrative and labelled as a sample.
const ProductPreview = () => (
  <div
    role="img"
    aria-label="Sample household dashboard showing a scheduled pickup, progress towards the next level and a notification."
    className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-gray-100 p-3 dark:border-gray-800 dark:bg-gray-950 sm:p-4 lg:mx-0 lg:justify-self-end"
  >
    <div className="flex items-center justify-between gap-3 px-1 pb-3">
      <p className="eyebrow">Your dashboard</p>
      <Badge>Sample</Badge>
    </div>

    <div className="flex flex-col gap-3">
      <Card className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow">Next pickup</p>
          <StatusBadge status="Scheduled" />
        </div>
        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-50">{formatDay(Date.now() + THREE_DAYS)}</p>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <LuMapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            14 Palm Street
          </li>
          <li className="flex items-center gap-2">
            <LuRecycle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Recyclable materials
          </li>
        </ul>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow">Points</p>
          <Badge tone="brand">Level 2</Badge>
        </div>
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-50">180</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-full w-2/5 rounded-full bg-brand-600 dark:bg-brand-500" />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">120 points to level 3</p>
      </Card>

      <Card className="flex items-start gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <LuBell className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Pickup completed</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Points were added to your account.</p>
        </div>
        <span className="ml-auto shrink-0 text-xs text-gray-500 dark:text-gray-400">Today</span>
      </Card>
    </div>
  </div>
);

export default ProductPreview;
