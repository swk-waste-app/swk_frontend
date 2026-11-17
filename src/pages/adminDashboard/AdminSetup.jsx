import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiCreateAdmin } from '../../services/Auth';
import { Button, Field } from '../../components/ui';
import AuthLayout, { FormAlert, PasswordInput, TextInput } from '../auth/AuthLayout';
import { apiErrorMessage, isEmail } from '../auth/validation';

const EMPTY = { name: '', email: '', password: '', secret: '' };

const validate = ({ name, email, password, secret }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter a name.';
  if (!isEmail(email.trim())) errors.email = 'Enter a valid email address.';
  if (password.length < 6) errors.password = 'Use at least 6 characters.';
  if (!secret.trim()) errors.secret = 'Enter the setup key.';
  return errors;
};

// Creates an operations (admin) account. The page is not linked from anywhere
// and the server only accepts the request with the deployment's setup key.
const AdminSetup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const errors = { ...(submitted ? validate(values) : {}), ...serverErrors };
  const field = (name) => ({
    name,
    value: values[name],
    invalid: Boolean(errors[name]),
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }));
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
      await apiCreateAdmin(
        { name: values.name.trim(), email: values.email.trim(), password: values.password },
        values.secret.trim()
      );
      toast.success('Operations account created. Sign in to continue.');
      navigate('/signin');
    } catch (error) {
      const status = error.response?.status;
      setServerErrors(
        status === 403 ? { secret: 'That setup key was not accepted. Check it and try again.' }
        : status === 409 ? { email: 'An account with this email already exists.' }
        : { form: apiErrorMessage(error, 'Could not create the account. Try again in a moment.') }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an operations account"
      description="For the team that runs pickups. You need the setup key from the server configuration."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {errors.form && <FormAlert>{errors.form}</FormAlert>}

        <Field label="Full name" htmlFor="setup-name" error={errors.name}>
          <TextInput id="setup-name" type="text" autoComplete="name" {...field('name')} />
        </Field>

        <Field label="Email" htmlFor="setup-email" error={errors.email}>
          <TextInput id="setup-email" type="email" autoComplete="email" {...field('email')} />
        </Field>

        <Field label="Password" htmlFor="setup-password" error={errors.password} hint="At least 6 characters.">
          <PasswordInput id="setup-password" autoComplete="new-password" {...field('password')} />
        </Field>

        <Field label="Setup key" htmlFor="setup-secret" error={errors.secret} hint="The ADMIN_SECRET value set on the server.">
          <PasswordInput id="setup-secret" autoComplete="off" {...field('secret')} />
        </Field>

        <Button type="submit" loading={loading} className="mt-2 w-full">Create account</Button>
      </form>
    </AuthLayout>
  );
};

export default AdminSetup;
