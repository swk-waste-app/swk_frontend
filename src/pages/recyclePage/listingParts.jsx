import { useState } from 'react';
import { LuArmchair, LuCpu, LuGlassWater, LuLeaf, LuNewspaper, LuPackage, LuRecycle, LuRefreshCw, LuShirt, LuTriangleAlert, LuWrench } from 'react-icons/lu';
import { Button, Card, EmptyState } from '../../components/ui';
import { mediaUrl } from '../../lib/format';

// Small pieces shared by the marketplace and vendor screens.

const WASTE_ICON = {
  Glass: LuGlassWater,
  Plastics: LuRecycle,
  'Recyclable Materials': LuRecycle,
  'Paper & Cardboard': LuNewspaper,
  'Fashion & Textiles': LuShirt,
  'Wood & Furniture': LuArmchair,
  'Organic/Food Waste': LuLeaf,
  'Metals & Scrap': LuWrench,
  'Electronic (E-Waste)': LuCpu,
};

// A listing photo, or a neutral tile with an icon for the waste type when the
// photo is missing or fails to load. Size and radius come from `className`.
export const ProductImage = ({ image, alt = '', wasteType, transform, className = '', iconClassName = 'h-10 w-10' }) => {
  const [failed, setFailed] = useState(false);
  const Icon = WASTE_ICON[wasteType] || LuPackage;

  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 ${className}`}>
      {image && !failed ? (
        <img src={mediaUrl(image, transform)} alt={alt} loading="lazy" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <Icon className={iconClassName} aria-hidden="true" />
      )}
    </div>
  );
};

export const Switch = ({ checked, onChange, label, id }) => (
  <button
    type="button"
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="inline-flex items-center gap-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200"
  >
    <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-700 dark:bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </span>
    {label}
  </button>
);

export const LoadError = ({ title, onRetry }) => (
  <Card>
    <EmptyState
      icon={LuTriangleAlert}
      title={title}
      description="Check your connection and try again."
      action={<Button variant="secondary" icon={LuRefreshCw} onClick={onRetry}>Try again</Button>}
    />
  </Card>
);
