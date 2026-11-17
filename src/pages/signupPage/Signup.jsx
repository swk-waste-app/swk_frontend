import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LuHouse, LuStore } from 'react-icons/lu';
import { toast } from 'sonner';
import { apiSignup, startGoogleSignIn } from '../../services/Auth';
import { Button, Field } from '../../components/ui';
import AuthLayout, { FormAlert, GoogleOption, PasswordInput, TextInput } from '../auth/AuthLayout';
import { apiErrorMessage, isEmail } from '../auth/validation';

const ACCOUNT_TYPES = [
  { value: 'user', label: 'Household', icon: LuHouse, summary: 'Book waste pickups, earn reward points and shop the marketplace.' },
  { value: 'vendor', label: 'Vendor', icon: LuStore, summary: 'List upcycled goods for sale in the marketplace.' },
];

const EMPTY = { name: '', email: '', contactNumber: '', password: '', confirm: '' };

const validate = ({ name, email, contactNumber, password, confirm }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter your name.';
  if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  if (contactNumber.length < 7) errors.contactNumber = 'Enter your phone number, digits only.';
  if (password.length < 6) errors.password = 'Use at least 6 characters.';
  if (confirm !== password) errors.confirm = 'The passwords do not match.';
  return errors;
};

// The one sign-up screen. `defaultType` (or ?type=vendor) preselects the
// vendor account type.
const Signup = ({ defaultType = 'user' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(
    defaultType === 'vendor' || searchParams.get('type') === 'vendor' ? 'vendor' : 'user'
  );
  const [values, setValues] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const errors = { ...(submitted ? validate(values) : {}), ...serverErrors };
  const field = (name, clean = (v) => v) => ({
    name,
    value: values[name],
    invalid: Boolean(errors[name]),
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: clean(e.target.value) }));
      setServerErrors({});
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerErrors({});
    if (Object.keys(validate(values)).length > 0) return;

    setLoading(true);
    try {
      await apiSignup({
        name: values.name.trim(),
        email: values.email,
        password: values.password,
        contactNumber: values.contactNumber,
        role: type,
      });
      toast.success('Account created. Sign in to continue.');
      navigate('/signin');
    } catch (error) {
      setServerErrors(
        error.response?.status === 409
          ? { email: 'An account with this email already exists. Sign in instead.' }
          : { form: apiErrorMessage(error, 'Could not create your account. Try again in a moment.') }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account" description="Choose the kind of account you need.">
      <fieldset className="mb-6">
        <legend className="sr-only">Account type</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {ACCOUNT_TYPES.map(({ value, label, icon: Icon }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="accountType"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="peer sr-only"
              />
              <span className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-card peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 dark:text-gray-400 dark:peer-checked:bg-gray-950 dark:peer-checked:text-gray-50">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </span>
            </label>
          ))}
        </div>
        <p className="help" aria-live="polite">{ACCOUNT_TYPES.find((t) => t.value === type).summary}</p>
      </fieldset>

      <GoogleOption onClick={() => startGoogleSignIn(type)} dividerText="or sign up with email" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && <FormAlert>{errors.form}</FormAlert>}

        <Field label="Full name" htmlFor="signup-name" error={errors.name}>
          <TextInput id="signup-name" type="text" autoComplete="name" {...field('name')} />
        </Field>

        <Field label="Email" htmlFor="signup-email" error={errors.email}>
          <TextInput id="signup-email" type="email" autoComplete="email" {...field('email')} />
        </Field>

        <Field label="Phone number" htmlFor="signup-phone" error={errors.contactNumber} hint="Digits only, no spaces or symbols.">
          <TextInput
            id="signup-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={15}
            {...field('contactNumber', (v) => v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Password" htmlFor="signup-password" error={errors.password} hint="At least 6 characters.">
          <PasswordInput id="signup-password" autoComplete="new-password" {...field('password')} />
        </Field>

        <Field label="Confirm password" htmlFor="signup-confirm" error={errors.confirm}>
          <PasswordInput id="signup-confirm" autoComplete="new-password" {...field('confirm')} />
        </Field>

        <Button type="submit" loading={loading} className="mt-2 w-full">
          {type === 'vendor' ? 'Create vendor account' : 'Create household account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <Link to="/signin" className="link">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
