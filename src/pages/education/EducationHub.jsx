import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuBookOpen, LuImage, LuRefreshCw, LuTriangleAlert } from 'react-icons/lu';
import { apiGetEducationResources } from '../../services/education';
import { brand } from '../../config/brand';
import { mediaUrl } from '../../lib/format';
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { SkeletonTile } from '../../components/Skeleton';
import EcoChat from '../../components/EcoChat';

// Values match the categories the API accepts; labels are shown in sentence case.
const CATEGORIES = ['All', 'Recycling Tips', 'Composting', 'Waste Sorting', 'Sustainability', 'Workshops', 'General'];
const SKELETON_KEYS = [0, 1, 2, 3, 4, 5];

const sentenceCase = (text = '') => text.charAt(0) + text.slice(1).toLowerCase();

const CHIP = 'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors';
const CHIP_ACTIVE = 'border-brand-700 bg-brand-700 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-gray-950';
const CHIP_IDLE = 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800';

const EducationHub = () => {
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState('loading');
  const [category, setCategory] = useState('All');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    apiGetEducationResources(category === 'All' ? undefined : category)
      .then((res) => {
        if (cancelled) return;
        setResources(Array.isArray(res.data) ? res.data : []);
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [category, attempt]);

  return (
    <div className="page">
      <PageHeader
        title="Education"
        description={`Guides on sorting, recycling and composting, published by ${brand.operator}.`}
      />

      <div role="group" aria-label="Filter by category" className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
            className={`${CHIP} ${category === name ? CHIP_ACTIVE : CHIP_IDLE}`}
          >
            {sentenceCase(name)}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading guides">
          {SKELETON_KEYS.map((key) => <SkeletonTile key={key} />)}
        </div>
      )}

      {status === 'error' && (
        <Card>
          <EmptyState
            icon={LuTriangleAlert}
            title="Guides could not be loaded"
            description="Check your connection and try again."
            action={(
              <Button variant="secondary" icon={LuRefreshCw} onClick={() => setAttempt((n) => n + 1)}>Try again</Button>
            )}
          />
        </Card>
      )}

      {status === 'ready' && resources.length === 0 && (
        <Card>
          <EmptyState
            icon={LuBookOpen}
            title="No guides here yet"
            description={category === 'All' ? 'Nothing has been published yet.' : 'Nothing has been published in this category yet.'}
            action={category !== 'All' && (
              <Button variant="secondary" onClick={() => setCategory('All')}>Show all guides</Button>
            )}
          />
        </Card>
      )}

      {status === 'ready' && resources.length > 0 && (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((item) => (
            <li key={item._id} className="flex">
              <Link
                to={`/education/${item._id}`}
                className="card group flex w-full flex-col overflow-hidden transition-colors hover:border-gray-300 dark:hover:border-gray-700"
              >
                <div className="flex h-44 items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
                  {item.image ? (
                    <img
                      src={mediaUrl(item.image, 'w_700,q_auto,f_auto')}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <LuImage className="h-8 w-8" aria-hidden="true" />
                  )}
                </div>
                <div className="flex flex-1 flex-col items-start p-5">
                  {item.category && <Badge>{sentenceCase(item.category)}</Badge>}
                  <h2 className="mt-3 font-sans text-base font-semibold text-gray-900 group-hover:underline dark:text-gray-50">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{item.summary}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Assistant: renders only when the server has it switched on. */}
      <EcoChat />
    </div>
  );
};

export default EducationHub;
