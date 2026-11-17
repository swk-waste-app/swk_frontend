import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuArrowLeft, LuTriangleAlert } from 'react-icons/lu';
import { apiGetEducationResource } from '../../services/education';
import { formatDate, mediaUrl } from '../../lib/format';
import { Badge, Button, Card, EmptyState } from '../../components/ui';
import { Skeleton } from '../../components/Skeleton';

const sentenceCase = (text = '') => text.charAt(0) + text.slice(1).toLowerCase();

const BackLink = () => (
  <Link to="/education" className="link inline-flex items-center gap-1.5 text-sm">
    <LuArrowLeft className="h-4 w-4" aria-hidden="true" />
    All guides
  </Link>
);

const EducationDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    apiGetEducationResource(id)
      .then((res) => {
        if (cancelled) return;
        setResource(res.data);
        setStatus(res.data ? 'ready' : 'error');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="page max-w-3xl" role="status" aria-label="Loading guide">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-8 h-5 w-28" />
        <Skeleton className="mt-4 h-9 w-4/5" />
        <Skeleton className="mt-3 h-4 w-48" />
        <Skeleton className="mt-8 h-64 w-full rounded-xl" />
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page max-w-3xl">
        <Card>
          <EmptyState
            icon={LuTriangleAlert}
            title="This guide could not be opened"
            description="It may have been removed, or the connection dropped. Go back to the list and try again."
            action={<Button as={Link} to="/education" variant="secondary" icon={LuArrowLeft}>All guides</Button>}
          />
        </Card>
      </div>
    );
  }

  const byline = [resource.author?.name && `By ${resource.author.name}`, formatDate(resource.createdAt)]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="page max-w-3xl pb-14">
      <BackLink />

      <header className="mt-8">
        {resource.category && <Badge>{sentenceCase(resource.category)}</Badge>}
        <h1 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
          {resource.title}
        </h1>
        {byline && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{byline}</p>}
      </header>

      {resource.image && (
        <img
          src={mediaUrl(resource.image, 'w_1200,q_auto,f_auto')}
          alt=""
          className="mt-8 max-h-96 w-full rounded-xl border border-gray-200 bg-gray-100 object-cover dark:border-gray-800 dark:bg-gray-800"
        />
      )}

      {resource.summary && (
        <p className="mt-8 text-lg leading-8 text-gray-900 dark:text-gray-100">{resource.summary}</p>
      )}
      <div className="mt-6 whitespace-pre-wrap text-base leading-7 text-gray-700 dark:text-gray-300">{resource.content}</div>

      {resource.tags?.length > 0 && (
        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
          {resource.tags.map((tag) => (
            <li key={tag}><Badge>{tag}</Badge></li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default EducationDetail;
