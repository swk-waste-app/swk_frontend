import { useState } from 'react';
import { LuSend } from 'react-icons/lu';
import { toast } from 'sonner';
import { brand } from '../config/brand';
import { Button, Field } from './ui';

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', subject: '', message: '' };
const FIELD_ORDER = ['name', 'email', 'subject', 'message'];

const validate = ({ name, email, subject, message }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter your name.';
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address, such as name@example.com.';
  if (!subject.trim()) errors.subject = 'Enter a subject.';
  if (!message.trim()) errors.message = 'Enter your message.';
  return errors;
};

// Sends a message to the operator through web3forms. Renders only the form,
// so the page that uses it decides on the heading and the surrounding card.
const ContactUsForm = () => {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);

  const errors = validate(values);
  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  const control = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    className: 'input',
    'aria-invalid': Boolean(errorFor(name)),
    onChange: (e) => setValues((prev) => ({ ...prev, [name]: e.target.value })),
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `${brand.name} contact: ${values.subject.trim()}`,
          from_name: `${brand.name} website`,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Request failed');

      toast.success('Message sent. We will reply by email.');
      setValues(EMPTY);
      setTouched({});
    } catch {
      toast.error(`Message not sent. Check your connection and try again, or email ${brand.supportEmail}.`);
    } finally {
      setSending(false);
    }
  };

  if (!ACCESS_KEY) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        The contact form is not set up on this site. Email{' '}
        <span className="select-all font-medium text-gray-900 dark:text-gray-100">{brand.supportEmail}</span> instead.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Your name" htmlFor="contact-name" error={errorFor('name')}>
        <input type="text" autoComplete="name" {...control('name')} />
      </Field>
      <Field label="Email address" htmlFor="contact-email" error={errorFor('email')}>
        <input type="email" autoComplete="email" inputMode="email" {...control('email')} />
      </Field>
      <Field label="Subject" htmlFor="contact-subject" error={errorFor('subject')} className="sm:col-span-2">
        <input type="text" {...control('subject')} />
      </Field>
      <Field label="Message" htmlFor="contact-message" error={errorFor('message')} className="sm:col-span-2">
        <textarea rows={5} {...control('message')} />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" icon={LuSend} loading={sending}>
          {sending ? 'Sending' : 'Send message'}
        </Button>
      </div>
    </form>
  );
};

export default ContactUsForm;
