import { useCallback, useEffect, useState } from 'react';
import { LuCalendar, LuCircleCheck, LuClipboardList, LuTruck } from 'react-icons/lu';
import { PageHeader, StatCard } from '../../components/ui';
import { formatNumber } from '../../lib/format';
import { apiGetMyPickups } from '../../services/pickups';
import { SchedulePickupButton } from './DatePicker';
import PickupList, { StatCardSkeleton } from './wasteList';

const STATS = [
  { label: 'Total', icon: LuClipboardList, counts: () => true },
  { label: 'Scheduled', icon: LuCalendar, counts: (pickup) => pickup.status === 'Scheduled' },
  { label: 'In progress', icon: LuTruck, counts: (pickup) => pickup.status === 'In Progress' },
  { label: 'Completed', icon: LuCircleCheck, counts: (pickup) => pickup.status === 'Completed' },
];

const PickupsPage = () => {
  const [pickups, setPickups] = useState([]);
  const [status, setStatus] = useState('loading');

  // Also called after a pickup is scheduled, so the list updates in place.
  const load = useCallback(async () => {
    try {
      const { data } = await apiGetMyPickups();
      setPickups(Array.isArray(data) ? data : []);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const retry = () => {
    setStatus('loading');
    load();
  };

  return (
    <div className="page">
      <PageHeader
        title="Pickups"
        description="Schedule a collection and follow each pickup until it is completed."
        actions={<SchedulePickupButton onScheduled={load} />}
      />

      {status !== 'error' && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ label, icon, counts }) => (status === 'loading'
            ? <StatCardSkeleton key={label} />
            : <StatCard key={label} label={label} icon={icon} value={formatNumber(pickups.filter(counts).length)} />
          ))}
        </div>
      )}

      <PickupList
        pickups={pickups}
        status={status}
        onRetry={retry}
        emptyAction={<SchedulePickupButton variant="secondary" onScheduled={load} />}
      />
    </div>
  );
};

export default PickupsPage;
