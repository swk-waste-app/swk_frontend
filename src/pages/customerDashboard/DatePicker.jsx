import { useCallback, useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuCalendarPlus } from 'react-icons/lu';
import { toast } from 'sonner';
import { Button, Card, Modal, PageHeader } from '../../components/ui';
import { apiAddSchedule } from '../../services/product';
import PickupForm from './PickupForm';
import { PICKUPS_PATH, WASTE_TYPES, errorMessage } from './pickupUtils';

const INTRO = 'Tell us when and where to collect.';

// Books a pickup, reports the outcome, and calls `onDone` once it is saved.
const useSchedulePickup = (onDone) => {
  const [saving, setSaving] = useState(false);

  const submit = async (payload) => {
    setSaving(true);
    try {
      await apiAddSchedule(payload);
      toast.success('Pickup scheduled');
      onDone?.();
    } catch (error) {
      toast.error(errorMessage(error, 'The pickup could not be scheduled. Try again in a moment.'));
    } finally {
      setSaving(false);
    }
  };

  return { saving, submit };
};

// The "Schedule pickup" button and its dialog. `onScheduled` lets the page
// that shows it refresh its own data once the pickup is saved.
export const SchedulePickupButton = ({ onScheduled, variant = 'primary', size = 'md' }) => {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { saving, submit } = useSchedulePickup(() => {
    setOpen(false);
    onScheduled?.();
  });

  return (
    <>
      <Button variant={variant} size={size} icon={LuCalendarPlus} onClick={() => setOpen(true)}>
        Schedule pickup
      </Button>
      <Modal
        open={open}
        onClose={close}
        title="Schedule pickup"
        description={INTRO}
        footer={(
          <>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" form={formId} icon={LuCalendarPlus} loading={saving}>Schedule pickup</Button>
          </>
        )}
      >
        <PickupForm id={formId} prefillLocation saving={saving} onSubmit={submit} />
      </Modal>
    </>
  );
};

// The same form as a page of its own (/customerDashboard/wpickup). A waste
// type passed in the navigation state, for example from the scanner, is
// selected to start with.
const SchedulePickupPage = () => {
  const formId = useId();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { saving, submit } = useSchedulePickup(() => navigate(PICKUPS_PATH));
  const wasteType = WASTE_TYPES.includes(state?.wasteType) ? state.wasteType : WASTE_TYPES[0];

  return (
    <div className="page">
      <Button as={Link} to={PICKUPS_PATH} variant="ghost" size="sm" icon={LuArrowLeft} className="-ml-2 mb-3">
        Pickups
      </Button>
      <PageHeader title="Schedule pickup" description={INTRO} />
      <Card className="max-w-2xl p-5">
        <PickupForm id={formId} initial={{ wasteType }} prefillLocation saving={saving} onSubmit={submit} />
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button as={Link} to={PICKUPS_PATH} variant="secondary">Cancel</Button>
          <Button type="submit" form={formId} icon={LuCalendarPlus} loading={saving}>Schedule pickup</Button>
        </div>
      </Card>
    </div>
  );
};

export default SchedulePickupPage;
