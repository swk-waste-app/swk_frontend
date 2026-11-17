import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiLogin, startGoogleSignIn, googleErrorMessage } from '../../services/Auth';
import { Button, Field } from '../../components/ui';
import { brand } from '../../config/brand';
import AuthLayout, { FormAlert, GoogleOption, PasswordInput, TextInput } from '../auth/AuthLayout';
import { apiErrorMessage, isEmail } from '../auth/validation';

const overviewPathFor = (role) =>
  role === 'admin' ? '/customerDashboard/adminoverview'
  : role === 'vendor' ? '/customerDashboard/vendoroverview'
  : '/customerDashboard/overview';

const validate = ({ email, password }) => {
  const errors = {};
  if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
};

// The one sign-in screen for households, vendors and operations. The role
// comes from the account, so nobody has to pick one here.
const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState({ email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(
    searchParams.get('error') === 'google_failed' ? googleErrorMessage(searchParams.get('reason')) : ''
  );

  const errors = submitted ? validate(values) : {};
  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError('');
    if (Object.keys(validate(values)).length > 0) return;

    setLoading(true);
    try {
      const { data } = await apiLogin({ email: values.email, password: values.password });
      if (!data?.accessToken) throw new Error('The sign-in response had no access token.');
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('role', data.role);
      navigate(overviewPathFor(data.role));
    } catch (error) {
      const status = error.response?.status;
      setFormError(
        status === 401 || status === 404
          ? 'That email and password do not match an account. Check both and try again.'
          : apiErrorMessage(error, 'Could not sign you in. Try again in a moment.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in" description={`Use your ${brand.name} account.`}>
      <GoogleOption onClick={() => startGoogleSignIn('user')} dividerText="or sign in with email" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && <FormAlert>{formError}</FormAlert>}

        <Field label="Email" htmlFor="signin-email" error={errors.email}>
          <TextInput
            id="signin-email"
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={set('email')}
            invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Password" htmlFor="signin-password" error={errors.password}>
          <PasswordInput
            id="signin-password"
            name="password"
            autoComplete="current-password"
            value={values.password}
            onChange={set('password')}
            invalid={Boolean(errors.password)}
          />
        </Field>

        <Button type="submit" loading={loading} className="mt-2 w-full">Sign in</Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        New to {brand.name}? <Link to="/signup" className="link">Create an account</Link>
      </p>
    </AuthLayout>
  );
};

export default SignIn;
