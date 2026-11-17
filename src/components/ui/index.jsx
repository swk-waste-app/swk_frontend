import { useEffect, useId, useRef, useState } from 'react';
import { LuLoaderCircle, LuX } from 'react-icons/lu';
import { brand } from '../../config/brand';
import { confirmRegistry } from './confirm';

// The shared building blocks of the product. Screens compose these instead of
// restyling buttons, cards and dialogs one page at a time. See DESIGN_SYSTEM.md.

const cx = (...parts) => parts.filter(Boolean).join(' ');

export const Spinner = ({ className = '' }) => (
  <LuLoaderCircle className={cx('animate-spin', className)} aria-hidden="true" />
);

const BUTTON_VARIANT = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger' };
const BUTTON_SIZE = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

// <Button variant="secondary" icon={LuPlus} loading={saving}>Add product</Button>
// Pass `as={Link} to="..."` to render a link that looks like a button.
export const Button = ({ as: Tag = 'button', variant = 'primary', size = 'md', icon: Icon, loading = false, className = '', children, disabled, ...rest }) => (
  <Tag
    className={cx('btn', BUTTON_VARIANT[variant], BUTTON_SIZE[size], className)}
    {...(Tag === 'button' ? { type: rest.type || 'button', disabled: disabled || loading } : {})}
    {...rest}
  >
    {loading ? <Spinner className="h-4 w-4" /> : Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
    {children}
  </Tag>
);

export const Card = ({ as: Tag = 'div', className = '', children, ...rest }) => (
  <Tag className={cx('card', className)} {...rest}>{children}</Tag>
);

// Title block at the top of every signed-in page.
export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0">
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

// One figure with its label. `hint` is a short qualifier, not a second metric.
export const StatCard = ({ label, value, hint, icon: Icon, className = '' }) => (
  <Card className={cx('p-5', className)}>
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      {Icon && <Icon className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />}
    </div>
    <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-50">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
  </Card>
);

const BADGE_TONE = { neutral: 'badge-neutral', brand: 'badge-brand', success: 'badge-success', warning: 'badge-warning', danger: 'badge-danger', info: 'badge-info' };

export const Badge = ({ tone = 'neutral', className = '', children }) => (
  <span className={cx('badge', BADGE_TONE[tone], className)}>{children}</span>
);

// The four pickup states, always shown the same way everywhere.
const PICKUP_STATUS_TONE = { Scheduled: 'info', 'In Progress': 'warning', Completed: 'success', Cancelled: 'neutral' };
const PICKUP_STATUS_LABEL = { 'In Progress': 'In progress' };

export const StatusBadge = ({ status }) => (
  <Badge tone={PICKUP_STATUS_TONE[status] || 'neutral'}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {PICKUP_STATUS_LABEL[status] || status}
  </Badge>
);

export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div className={cx('flex flex-col items-center px-6 py-12 text-center', className)}>
    {Icon && (
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    )}
    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-gray-600 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// Label, control, and help or error text for one form field.
export const Field = ({ label, htmlFor, hint, error, optional = false, children, className = '' }) => (
  <div className={className}>
    {label && (
      <label htmlFor={htmlFor} className="label">
        {label}
        {optional && <span className="ml-1.5 font-normal text-gray-400 dark:text-gray-500">Optional</span>}
      </label>
    )}
    {children}
    {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="help">{hint}</p> : null}
  </div>
);

export const BrandLogo = ({ className = 'h-9 w-auto' }) => (
  <img src={brand.logo} alt={brand.name} className={cx('object-contain', className)} />
);

const MODAL_SIZE = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

// Accessible dialog: closes on Escape and backdrop click, locks page scroll,
// and returns focus to whatever opened it.
export const Modal = ({ open, onClose, title, description, children, footer, size = 'md' }) => {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current?.(); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-gray-950/50" onClick={() => onClose?.()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx('relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-pop outline-none animate-fade-in dark:bg-gray-900 sm:rounded-xl', MODAL_SIZE[size])}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
            {description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>}
          </div>
          <button type="button" onClick={() => onClose?.()} aria-label="Close" className="btn btn-ghost btn-sm -mr-2 px-2">
            <LuX className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children && <div className="overflow-y-auto px-5 py-4">{children}</div>}
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">{footer}</div>}
      </div>
    </div>
  );
};

// Renders the dialog for confirmAction() (see ./confirm.js). Mounted once in App.jsx.
export const ConfirmHost = () => {
  const [request, setRequest] = useState(null);

  useEffect(() => {
    confirmRegistry.open = setRequest;
    return () => { confirmRegistry.open = null; };
  }, []);

  if (!request) return null;

  const settle = (answer) => {
    request.resolve(answer);
    setRequest(null);
  };

  return (
    <Modal
      open
      size="sm"
      onClose={() => settle(false)}
      title={request.title}
      description={request.body}
      footer={(
        <>
          <Button variant="secondary" onClick={() => settle(false)}>{request.cancelLabel || 'Cancel'}</Button>
          <Button variant={request.tone === 'danger' ? 'danger' : 'primary'} onClick={() => settle(true)}>
            {request.confirmLabel || 'Confirm'}
          </Button>
        </>
      )}
    />
  );
};
