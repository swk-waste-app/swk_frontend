import { useCallback, useEffect, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuExternalLink, LuRefreshCw, LuTriangleAlert } from 'react-icons/lu';
import { Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { Skeleton } from '../../components/Skeleton';

const PAGE_SIZE = 8;
const SKELETON_KEYS = [0, 1, 2, 3, 4, 5];

const ExternalLink = ({ href, className = '', children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
);

// A paged list of links to outside articles, shared by the News and Articles
// pages. `load` must be a stable function that resolves to an array of
//   { title, url, summary, meta: [string], links: [{ label, url }] }
// Both pages are shown on the public site and inside the dashboard, so this
// renders page content only and no navigation of its own.
const ArticleFeed = ({ title, description, load, emptyIcon, emptyTitle, emptyDescription }) => {
  const [status, setStatus] = useState('loading');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(() => {
    let cancelled = false;
    setStatus('loading');
    load()
      .then((result) => {
        if (cancelled) return;
        setItems(result);
        setPage(1);
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [load]);

  useEffect(() => fetchItems(), [fetchItems]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visible = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (next) => {
    setPage(next);
    window.scrollTo(0, 0);
  };

  return (
    <div className="page">
      <PageHeader title={title} description={description} />

      {status === 'loading' && (
        <div className="grid gap-4 lg:grid-cols-2" role="status" aria-label={`Loading ${title.toLowerCase()}`}>
          {SKELETON_KEYS.map((key) => (
            <Card key={key} className="flex flex-col gap-3 p-5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      )}

      {status === 'error' && (
        <Card>
          <EmptyState
            icon={LuTriangleAlert}
            title={`${title} could not be loaded`}
            description="Check your connection and try again."
            action={<Button variant="secondary" icon={LuRefreshCw} onClick={fetchItems}>Try again</Button>}
          />
        </Card>
      )}

      {status === 'ready' && items.length === 0 && (
        <Card>
          <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
        </Card>
      )}

      {status === 'ready' && items.length > 0 && (
        <>
          <ul className="grid gap-4 lg:grid-cols-2">
            {visible.map((item, index) => {
              const meta = (item.meta || []).filter(Boolean).join(' · ');
              return (
                <Card as="li" key={`${page}-${index}`} className="flex min-w-0 flex-col p-5">
                  {meta && <p className="truncate text-xs text-gray-500 dark:text-gray-400">{meta}</p>}
                  <h2 className="mt-1 font-sans text-base font-semibold text-gray-900 dark:text-gray-50">
                    {item.url ? (
                      <ExternalLink href={item.url} className="hover:underline">
                        {item.title}
                        <LuExternalLink className="ml-1.5 inline h-3.5 w-3.5 align-[-2px] text-gray-400 dark:text-gray-500" aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </ExternalLink>
                    ) : item.title}
                  </h2>
                  {item.summary && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{item.summary}</p>
                  )}
                  {item.links?.length > 0 && (
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {item.links.map((link) => (
                        <ExternalLink key={link.label} href={link.url} className="link">{link.label}</ExternalLink>
                      ))}
                    </p>
                  )}
                </Card>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
              <Button variant="secondary" icon={LuChevronLeft} disabled={page === 1} onClick={() => goTo(page - 1)}>
                Previous
              </Button>
              <p className="text-sm tabular-nums text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</p>
              <Button variant="secondary" disabled={page === totalPages} onClick={() => goTo(page + 1)}>
                Next
                <LuChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ArticleFeed;
