import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, Card, Field } from '../../components/ui';
import { brand } from '../../config/brand';
import { CATEGORIES, CONDITIONS, ROUTES, WASTE_TYPES, apiErrorMessage } from './listingOptions';
import { ProductImage, Switch } from './listingParts';

const TEXT_FIELDS = ['title', 'description', 'category', 'wasteType', 'condition', 'location', 'price', 'inventory'];
const UPCYCLING_FIELDS = ['upcyclingStory', 'wasteSourced', 'processDescription', 'timeToMake'];
// Order of the fields on screen, used to focus the first one that is invalid.
const VALIDATED = ['title', 'category', 'price', 'inventory', 'image'];
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_MB = 10;
const INPUT = 'input aria-[invalid=true]:border-red-500 dark:aria-[invalid=true]:border-red-400';

const toValues = (product) => ({
  title: product?.title || '',
  description: product?.description || '',
  category: product?.category || '',
  wasteType: product?.wasteType || '',
  condition: product?.condition || 'New',
  location: product?.location || '',
  price: product?.price ?? '',
  inventory: product?.inventory ?? '',
  isUpcycled: Boolean(product?.isUpcycled),
  upcyclingStory: product?.upcyclingStory || '',
  materialsUsed: (product?.materialsUsed || []).join(', '),
  wasteSourced: product?.wasteSourced || '',
  processDescription: product?.processDescription || '',
  timeToMake: product?.timeToMake || '',
});

const imageError = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return 'Use a JPG, PNG or WebP image.';
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Choose an image smaller than ${MAX_IMAGE_MB} MB.`;
  return undefined;
};

const validate = (values, file, requireImage) => {
  const errors = {};
  const stock = Number(values.inventory);
  if (!String(values.title).trim()) errors.title = 'Enter a title.';
  if (!values.category) errors.category = 'Choose a category.';
  if (values.price === '' || !(Number(values.price) >= 0)) errors.price = 'Enter a price of 0 or more.';
  if (values.inventory === '' || !Number.isInteger(stock) || stock < 0) errors.inventory = 'Enter a whole number of 0 or more.';
  if (file) errors.image = imageError(file);
  else if (requireImage) errors.image = 'Add a photo of the item.';
  return errors;
};

// Empty fields are left out because the API rejects empty strings.
const toFormData = (values, file) => {
  const data = new FormData();
  const add = (name) => {
    const value = String(values[name]).trim();
    if (value) data.append(name, value);
  };
  TEXT_FIELDS.forEach(add);
  data.append('isUpcycled', values.isUpcycled);
  if (values.isUpcycled) {
    UPCYCLING_FIELDS.forEach(add);
    values.materialsUsed.split(',').map((material) => material.trim()).filter(Boolean)
      .forEach((material) => data.append('materialsUsed[]', material));
  }
  if (file) data.append('image', file);
  return data;
};

// Keeps a saved value selectable even if it is no longer in the list.
const withCurrent = (options, value) => (value && !options.includes(value) ? [value, ...options] : options);

const Section = ({ title, description, children }) => (
  <Card as="section" className="p-5">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
    {description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>}
    <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
  </Card>
);

// The add and edit listing form. `product` is the listing being edited;
// `save` receives the form data and returns the API promise.
const ListingForm = ({ product, save, submitLabel, successMessage }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => toValues(product));
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState('');

  // Show the chosen photo, but only if it passed the checks in chooseFile.
  useEffect(() => {
    if (!file || imageError(file)) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const change = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const control = (name) => ({
    id: `listing-${name}`,
    name,
    className: INPUT,
    value: values[name],
    onChange: (e) => change(name, e.target.value),
    'aria-invalid': errors[name] ? true : undefined,
  });

  const chooseFile = (e) => {
    const picked = e.target.files?.[0] || null;
    setFile(picked);
    setErrors((current) => ({ ...current, image: picked ? imageError(picked) : undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values, file, !product);
    setErrors(found);
    const firstInvalid = VALIDATED.find((name) => found[name]);
    if (firstInvalid) {
      document.getElementById(`listing-${firstInvalid}`)?.focus();
      return;
    }

    setSaving(true);
    try {
      await save(toFormData(values, file));
      toast.success(successMessage);
      navigate(ROUTES.listings);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'The listing was not saved. Check your connection and try again.'));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid max-w-3xl gap-6">
      <Section title="Basics">
        <Field className="sm:col-span-2" label="Title" htmlFor="listing-title" error={errors.title}>
          <input type="text" placeholder="e.g. Tote bag made from denim offcuts" {...control('title')} />
        </Field>
        <Field className="sm:col-span-2" label="Description" htmlFor="listing-description" optional>
          <textarea rows={4} placeholder="Size, colour, how it can be used" {...control('description')} />
        </Field>
        <Field label="Category" htmlFor="listing-category" error={errors.category}>
          <select {...control('category')}>
            <option value="">Choose a category</option>
            {withCurrent(CATEGORIES, values.category).map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </Field>
        <Field label="Waste type" htmlFor="listing-wasteType" hint="The material the item is made from." optional>
          <select {...control('wasteType')}>
            <option value="">Choose a waste type</option>
            {withCurrent(WASTE_TYPES, values.wasteType).map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </Field>
        <Field label="Condition" htmlFor="listing-condition">
          <select {...control('condition')}>
            {CONDITIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </Field>
        <Field label="Location" htmlFor="listing-location" optional>
          <input type="text" placeholder="e.g. Central market" {...control('location')} />
        </Field>
      </Section>

      <Section title="Pricing and stock">
        <Field label={`Price (${brand.currency})`} htmlFor="listing-price" error={errors.price}>
          <input type="number" min="0" step="0.01" inputMode="decimal" placeholder="0.00" {...control('price')} />
        </Field>
        <Field label="Stock" htmlFor="listing-inventory" hint="Units available to sell." error={errors.inventory}>
          <input type="number" min="0" step="1" inputMode="numeric" placeholder="0" {...control('inventory')} />
        </Field>
      </Section>

      <Section title="Photo">
        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-start">
          {preview ? (
            <img src={preview} alt="Selected photo" className="h-24 w-24 shrink-0 rounded-lg border border-gray-200 object-cover dark:border-gray-800" />
          ) : (
            <ProductImage
              image={product?.image}
              alt="Current photo"
              wasteType={values.wasteType}
              transform="w_240,q_auto,f_auto"
              className="h-24 w-24 rounded-lg border border-gray-200 dark:border-gray-800"
              iconClassName="h-6 w-6"
            />
          )}
          <Field
            className="min-w-0 flex-1"
            label={product ? 'Replace photo' : 'Upload a photo'}
            htmlFor="listing-image"
            hint={`JPG, PNG or WebP, up to ${MAX_IMAGE_MB} MB.${product ? ' Leave empty to keep the current photo.' : ''}`}
            error={errors.image}
            optional={Boolean(product)}
          >
            <input
              id="listing-image"
              name="image"
              type="file"
              accept={IMAGE_TYPES.join(',')}
              onChange={chooseFile}
              aria-invalid={errors.image ? true : undefined}
              className={`${INPUT} px-2 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 dark:file:bg-gray-800 dark:file:text-gray-200`}
            />
          </Field>
        </div>
      </Section>

      <Section title="Upcycling details" description="Tell buyers what the item was made from and how.">
        <div className="sm:col-span-2">
          <Switch label="This item is upcycled" checked={values.isUpcycled} onChange={(checked) => change('isUpcycled', checked)} />
        </div>
        {values.isUpcycled && (
          <>
            <Field className="sm:col-span-2" label="Story" htmlFor="listing-upcyclingStory" optional>
              <textarea rows={3} placeholder="What the item used to be and why you made it" {...control('upcyclingStory')} />
            </Field>
            <Field className="sm:col-span-2" label="Materials" htmlFor="listing-materialsUsed" hint="Separate materials with commas." optional>
              <input type="text" placeholder="e.g. denim, bottle caps, cotton thread" {...control('materialsUsed')} />
            </Field>
            <Field label="Where the material came from" htmlFor="listing-wasteSourced" optional>
              <input type="text" placeholder="e.g. Offcuts from a local tailor" {...control('wasteSourced')} />
            </Field>
            <Field label="Time to make" htmlFor="listing-timeToMake" optional>
              <input type="text" placeholder="e.g. 2 hours" {...control('timeToMake')} />
            </Field>
            <Field className="sm:col-span-2" label="How it was made" htmlFor="listing-processDescription" optional>
              <textarea rows={3} placeholder="The main steps, from raw material to finished item" {...control('processDescription')} />
            </Field>
          </>
        )}
      </Section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button as={Link} to={ROUTES.listings} variant="secondary">Cancel</Button>
        <Button type="submit" loading={saving}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default ListingForm;
