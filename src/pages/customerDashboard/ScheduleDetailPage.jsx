import { useEffect, useId, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  LuArrowLeft, LuBan, LuCalendar, LuCheck, LuFileText, LuMapPin, LuPencil, LuRecycle, LuStar, LuTriangleAlert, LuUser, LuWeight, LuX,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { Button, Card, EmptyState, Field, PageHeader, StatusBadge } from '../../components/ui';
import { confirmAction } from '../../components/ui/confirm';
import { Skeleton } from '../../components/Skeleton';
import { formatDate, formatDateTime, formatNumber, formatWeight } from '../../lib/format';
import { apiDeleteScheduledTicket, apiGetSingleScheduledProducts, apiSubmitPickupRating } from '../../services/product';
import { PICKUPS_PATH, POINTS_PER_KG, editPickupPath, errorMessage, pickupId, pointsFor } from './pickupUtils';

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{children}</h2>
);

const BackLink = () => (
  <Button as={Link} to={PICKUPS_PATH} variant="ghost" size="sm" icon={LuArrowLeft} className="-ml-2 mb-3">
    Pickups
  </Button>
);

// The steps a pickup goes through, each marked done, current, upcoming or cancelled.
const timelineFor = (pickup) => {
  const booked = pickup.createdAt ? `Booked ${formatDate(pickup.createdAt)}` : '';
  if (pickup.status === 'Cancelled') {
    return [
      { label: 'Scheduled', note: booked, state: 'done' },
      { label: 'Cancelled', note: '', state: 'cancelled' },
    ];
  }
  const reached = ['Scheduled', 'In Progress', 'Completed'].indexOf(pickup.status);
  return [
    { label: 'Scheduled', note: booked },
    { label: 'In progress', note: '' },
    { label: 'Completed', note: formatDate(pickup.completedAt) },
  ].map((step, index) => ({
    ...step,
    state: index < reached || pickup.status === 'Completed' ? 'done' : index === reached ? 'current' : 'upcoming',
  }));
};

const STEP_LINE = {
  done: 'bg-brand-600 dark:bg-brand-500',
  current: 'bg-brand-600 dark:bg-brand-500',
  upcoming: 'bg-gray-200 dark:bg-gray-800',
  cancelled: 'bg-gray-400 dark:bg-gray-600',
};

const STEP_MARKER = {
  done: 'border-brand-600 bg-brand-600 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-gray-950',
  current: 'border-brand-600 bg-white text-brand-700 dark:border-brand-400 dark:bg-gray-900 dark:text-brand-300',
  upcoming: 'border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500',
  cancelled: 'border-gray-500 bg-gray-500 text-white dark:border-gray-400 dark:bg-gray-400 dark:text-gray-950',
};

const Timeline = ({ pickup }) => (
  <ol className="flex">
    {timelineFor(pickup).map((step, index) => (
      <li
        key={step.label}
        className="relative flex flex-1 flex-col items-center px-1 text-center"
        aria-current={step.state === 'current' ? 'step' : undefined}
      >
        {index > 0 && (
          <span
            className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${STEP_LINE[step.state]}`}
            aria-hidden="true"
          />
        )}
        <span className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${STEP_MARKER[step.state]}`}>
          {step.state === 'done' && <LuCheck className="h-4 w-4" aria-hidden="true" />}
          {step.state === 'cancelled' && <LuX className="h-4 w-4" aria-hidden="true" />}
          {step.state === 'current' && <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />}
        </span>
        <p className={`mt-2 text-sm font-medium ${step.state === 'upcoming' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {step.label}
        </p>
        {step.note && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{step.note}</p>}
      </li>
    ))}
  </ol>
);

const Detail = ({ icon: Icon, label, children }) => (
  <div className="flex gap-3 py-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
    <div className="min-w-0">
      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium text-gray-900 dark:text-gray-100">{children}</dd>
    </div>
  </div>
);

const Figure = ({ label, value }) => (
  <div>
    <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-50">{value}</dd>
  </div>
);

// What the pickup earned once completed, or what it is expected to earn.
const PointsCard = ({ pickup }) => {
  if (pickup.status === 'Completed') {
    return (
      <Card className="p-5">
        <SectionTitle>Earned from this pickup</SectionTitle>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <Figure label="Points" value={formatNumber(pickup.pointsEarned)} />
          <Figure label="Estimated CO2e avoided" value={formatWeight(pickup.carbonSaved)} />
        </dl>
      </Card>
    );
  }
  const expected = pointsFor(pickup.estimatedWeight);
  return (
    <Card className="p-5">
      <SectionTitle>Points</SectionTitle>
      {expected > 0 && (
        <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">About {formatNumber(expected)} points on completion</p>
      )}
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        You earn {POINTS_PER_KG} points for each kg collected. The final figure uses the weight recorded at collection.
      </p>
    </Card>
  );
};

const starLabel = (count) => `${count} ${count === 1 ? 'star' : 'stars'}`;

const Stars = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5].map((count) => {
    const icon = (
      <LuStar
        className={`h-6 w-6 ${count <= value ? 'fill-brand-600 text-brand-600 dark:fill-brand-400 dark:text-brand-400' : 'text-gray-300 dark:text-gray-600'}`}
        aria-hidden="true"
      />
    );
    if (!onChange) return <span key={count} className="p-1">{icon}</span>;
    return (
      <button
        key={count}
        type="button"
        role="radio"
        aria-checked={count === value}
        aria-label={starLabel(count)}
        onClick={() => onChange(count)}
        className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {icon}
      </button>
    );
  });
  return onChange
    ? <div className="-ml-1 flex gap-1" role="radiogroup" aria-label="Rating">{stars}</div>
    : <div className="-ml-1 flex gap-1" role="img" aria-label={`${starLabel(value)} out of 5`}>{stars}</div>;
};

const RatingCard = ({ pickup, onRated }) => {
  const feedbackId = useId();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  if (pickup.rating) {
    return (
      <Card className="p-5">
        <SectionTitle>Your rating</SectionTitle>
        <div className="mt-3"><Stars value={pickup.rating} /></div>
        {pickup.feedback && <p className="mt-3 break-words text-sm text-gray-700 dark:text-gray-300">{pickup.feedback}</p>}
      </Card>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const review = { rating, feedback: feedback.trim() };
      await apiSubmitPickupRating(pickupId(pickup), review);
      toast.success('Rating saved');
      onRated(review);
    } catch (error) {
      toast.error(errorMessage(error, 'Your rating could not be saved. Try again in a moment.'));
      setSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <SectionTitle>Rate this pickup</SectionTitle>
      <form onSubmit={submit} className="mt-3 grid gap-4">
        <Stars value={rating} onChange={setRating} />
        <Field label="Feedback" htmlFor={feedbackId} optional>
          <textarea
            id={feedbackId}
            className="input resize-none"
            rows={3}
            maxLength={500}
            placeholder="What went well, or what could be better?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Field>
        <div>
          <Button type="submit" disabled={!rating} loading={saving}>Submit rating</Button>
        </div>
      </form>
    </Card>
  );
};

const DetailSkeleton = () => (
  <div aria-hidden="true">
    <Skeleton className="mb-2 h-8 w-64 max-w-full" />
    <Skeleton className="mb-6 h-4 w-40" />
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="grid gap-6 lg:col-span-2">
        <Card className="p-5"><Skeleton className="h-16 w-full" /></Card>
        <Card className="p-5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-5 h-4 w-56 max-w-full" />
          <Skeleton className="mt-4 h-4 w-48 max-w-full" />
          <Skeleton className="mt-4 h-4 w-40" />
        </Card>
      </div>
      <Card className="self-start p-5">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="mt-4 h-4 w-full" />
      </Card>
    </div>
  </div>
);

const ScheduleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState(null);
  const [status, setStatus] = useState('loading');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    apiGetSingleScheduledProducts(id)
      .then(({ data }) => {
        if (!active) return;
        setPickup(data);
        setStatus('ready');
      })
      .catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [id]);

  const cancelPickup = async () => {
    const confirmed = await confirmAction({
      title: 'Cancel this pickup?',
      body: `The pickup on ${formatDateTime(pickup.pickupDate)} will be removed from your pickups. This cannot be undone.`,
      confirmLabel: 'Cancel pickup',
      cancelLabel: 'Keep pickup',
      tone: 'danger',
    });
    if (!confirmed) return;
    setCancelling(true);
    try {
      await apiDeleteScheduledTicket(id);
      toast.success('Pickup cancelled');
      navigate(PICKUPS_PATH, { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, 'The pickup could not be cancelled. Try again in a moment.'));
      setCancelling(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="page">
        <BackLink />
        <DetailSkeleton />
      </div>
    );
  }

  if (status === 'error' || !pickup) {
    return (
      <div className="page">
        <BackLink />
        <Card>
          <EmptyState
            icon={LuTriangleAlert}
            title="This pickup could not be opened"
            description="It may have been cancelled, or the connection dropped. Go back to your pickups and try again."
            action={<Button as={Link} to={PICKUPS_PATH} variant="secondary">Back to pickups</Button>}
          />
        </Card>
      </div>
    );
  }

  const isScheduled = pickup.status === 'Scheduled';
  const isCancelled = pickup.status === 'Cancelled';

  return (
    <div className="page">
      <BackLink />
      <PageHeader
        title={`${pickup.wasteType || 'General Waste'} pickup`}
        description={formatDateTime(pickup.pickupDate)}
        actions={isScheduled && (
          <>
            <Button as={Link} to={editPickupPath(pickup)} variant="secondary" icon={LuPencil}>Edit</Button>
            <Button variant="danger" icon={LuBan} loading={cancelling} onClick={cancelPickup}>Cancel pickup</Button>
          </>
        )}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`grid content-start gap-6 ${isCancelled ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <SectionTitle>Status</SectionTitle>
              <StatusBadge status={pickup.status} />
            </div>
            <Timeline pickup={pickup} />
          </Card>

          <Card className="p-5">
            <SectionTitle>Details</SectionTitle>
            <dl className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
              <Detail icon={LuCalendar} label="Date and time">{formatDateTime(pickup.pickupDate)}</Detail>
              <Detail icon={LuMapPin} label="Location">{pickup.location}</Detail>
              <Detail icon={LuRecycle} label="Waste type">{pickup.wasteType || 'General Waste'}</Detail>
              {pickup.estimatedWeight > 0 && (
                <Detail icon={LuWeight} label="Estimated weight">{formatWeight(pickup.estimatedWeight)}</Detail>
              )}
              {pickup.actualWeight > 0 && (
                <Detail icon={LuWeight} label="Weight collected">{formatWeight(pickup.actualWeight)}</Detail>
              )}
              {pickup.agentName && <Detail icon={LuUser} label="Collector">{pickup.agentName}</Detail>}
              {pickup.notes && <Detail icon={LuFileText} label="Notes">{pickup.notes}</Detail>}
            </dl>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Reference <span className="font-mono uppercase">{String(pickupId(pickup)).slice(-8)}</span>
            </p>
          </Card>
        </div>

        {!isCancelled && (
          <div className="grid content-start gap-6">
            <PointsCard pickup={pickup} />
            {pickup.status === 'Completed' && (
              <RatingCard pickup={pickup} onRated={(review) => setPickup((current) => ({ ...current, ...review }))} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleDetailPage;
