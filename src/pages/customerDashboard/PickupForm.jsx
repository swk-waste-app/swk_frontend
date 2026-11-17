import { useEffect, useState } from 'react';
import { Field } from '../../components/ui';
import { formatNumber } from '../../lib/format';
import { apiGetProfile } from '../../services/product';
import { POINTS_PER_KG, WASTE_TYPES, pointsFor, toLocalInput } from './pickupUtils';

const EMPTY = { pickupDate: '', location: '', wasteType: WASTE_TYPES[0], estimatedWeight: '', notes: '' };

const validate = (values) => {
  const errors = {};
  if (!values.pickupDate) errors.pickupDate = 'Choose a date and time.';
  else if (!(new Date(values.pickupDate) > new Date())) errors.pickupDate = 'Choose a date and time in the future.';
  if (!values.location.trim()) errors.location = 'Enter the address the waste should be collected from.';
  if (values.estimatedWeight !== '' && !(Number(values.estimatedWeight) >= 0)) {
    errors.estimatedWeight = 'Enter the weight in kg as a number, or leave it blank.';
  }
  return errors;
};

// The fields for booking or editing a pickup. The parent renders the submit
// button (with `form={id}`) and receives the payload the API expects.
const PickupForm = ({ id, initial, prefillLocation = false, saving = false, onSubmit }) => {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});

  // Start from the address on the profile unless the user has typed one.
  useEffect(() => {
    if (!prefillLocation) return undefined;
    let active = true;
    apiGetProfile()
      .then(({ data }) => {
        if (active && data?.location) setValues((v) => (v.location ? v : { ...v, location: data.location }));
      })
      .catch(() => {});
    return () => { active = false; };
  }, [prefillLocation]);

  const field = (name) => ({
    id: `${id}-${name}`,
    value: values[name],
    'aria-invalid': errors[name] ? true : undefined,
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }));
      if (errors[name]) setErrors((found) => ({ ...found, [name]: undefined }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }
    onSubmit({
      pickupDate: new Date(values.pickupDate).toISOString(),
      location: values.location.trim(),
      wasteType: values.wasteType,
      estimatedWeight: Number(values.estimatedWeight) || 0,
      notes: values.notes.trim(),
    });
  };

  const points = pointsFor(values.estimatedWeight);

  return (
    <form id={id} onSubmit={handleSubmit} noValidate>
      <fieldset disabled={saving} className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date and time" htmlFor={`${id}-pickupDate`} error={errors.pickupDate} className="sm:col-span-2">
            <input type="datetime-local" className="input" min={toLocalInput(new Date())} {...field('pickupDate')} />
          </Field>

          <Field label="Location" htmlFor={`${id}-location`} error={errors.location} className="sm:col-span-2">
            <input type="text" className="input" placeholder="e.g. 14 Palm Street" autoComplete="street-address" {...field('location')} />
          </Field>

          <Field label="Waste type" htmlFor={`${id}-wasteType`}>
            <select className="input" {...field('wasteType')}>
              {WASTE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </Field>

          <Field
            label="Estimated weight (kg)"
            htmlFor={`${id}-estimatedWeight`}
            optional
            error={errors.estimatedWeight}
            hint={points > 0
              ? `About ${formatNumber(points)} points on completion`
              : `You earn ${POINTS_PER_KG} points for each kg collected.`}
          >
            <input type="number" className="input" min="0" step="0.1" inputMode="decimal" placeholder="e.g. 5" {...field('estimatedWeight')} />
          </Field>

          <Field label="Notes" htmlFor={`${id}-notes`} optional className="sm:col-span-2">
            <textarea className="input resize-none" rows={3} maxLength={500} placeholder="Anything the collector should know, such as a gate code or where the bags are." {...field('notes')} />
          </Field>
        </div>
      </fieldset>
    </form>
  );
};

export default PickupForm;
