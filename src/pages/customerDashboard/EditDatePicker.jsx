import { useEffect, useId, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuLock, LuTriangleAlert } from 'react-icons/lu';
import { toast } from 'sonner';
import { Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { Skeleton } from '../../components/Skeleton';
import { apiEditProduct, apiGetSingleScheduledProducts } from '../../services/product';
import PickupForm from './PickupForm';
import { PICKUPS_PATH, WASTE_TYPES, errorMessage, toLocalInput } from './pickupUtils';

// Edit a pickup that is still Scheduled (/customerDashboard/editSchedule/:id).
const EditPickupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formId = useId();
  const detailPath = `/customerDashboard/schedule/${id}`;
  const [pickup, setPickup] = useState(null);
  const [status, setStatus] = useState('loading');
  const [saving, setSaving] = useState(false);

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

  const save = async (payload) => {
    setSaving(true);
    try {
      await apiEditProduct(id, payload);
      toast.success('Pickup updated');
      navigate(detailPath, { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, 'Your changes could not be saved. Try again in a moment.'));
      setSaving(false);
    }
  };

  let content;
  if (status === 'loading') {
    content = (
      <Card className="max-w-2xl p-5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mb-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
        ))}
      </Card>
    );
  } else if (status === 'error' || !pickup) {
    content = (
      <Card className="max-w-2xl">
        <EmptyState
          icon={LuTriangleAlert}
          title="This pickup could not be opened"
          description="It may have been cancelled, or the connection dropped. Go back to your pickups and try again."
          action={<Button as={Link} to={PICKUPS_PATH} variant="secondary">Back to pickups</Button>}
        />
      </Card>
    );
  } else if (pickup.status !== 'Scheduled') {
    content = (
      <Card className="max-w-2xl">
        <EmptyState
          icon={LuLock}
          title="This pickup can no longer be edited"
          description="Only pickups that are still scheduled can be changed."
          action={<Button as={Link} to={detailPath} variant="secondary">View pickup</Button>}
        />
      </Card>
    );
  } else {
    content = (
      <Card className="max-w-2xl p-5">
        <PickupForm
          id={formId}
          saving={saving}
          onSubmit={save}
          initial={{
            pickupDate: toLocalInput(pickup.pickupDate),
            location: pickup.location || '',
            wasteType: WASTE_TYPES.includes(pickup.wasteType) ? pickup.wasteType : WASTE_TYPES[0],
            estimatedWeight: pickup.estimatedWeight > 0 ? String(pickup.estimatedWeight) : '',
            notes: pickup.notes || '',
          }}
        />
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button as={Link} to={detailPath} variant="secondary">Cancel</Button>
          <Button type="submit" form={formId} loading={saving}>Save changes</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="page">
      <Button as={Link} to={detailPath} variant="ghost" size="sm" icon={LuArrowLeft} className="-ml-2 mb-3">
        Pickup
      </Button>
      <PageHeader title="Edit pickup" description="Change the time, place or details of this pickup." />
      {content}
    </div>
  );
};

export default EditPickupPage;
