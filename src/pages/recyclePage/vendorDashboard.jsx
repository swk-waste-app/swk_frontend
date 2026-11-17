import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LuBanknote, LuEye, LuPackage, LuPlus, LuShoppingBag, LuStore } from 'react-icons/lu';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Skeleton } from '../../components/Skeleton';
import { Badge, Button, Card, EmptyState, PageHeader, StatCard } from '../../components/ui';
import { formatMoney, formatNumber } from '../../lib/format';
import { apiGetUserStats, apiGetVendorsProducts } from '../../services/product';
import { ROUTES, inStock, plural, useLoader } from './listingOptions';
import { LoadError, ProductImage } from './listingParts';

const TOP_COUNT = 5;
const INVENTORY_ROWS = 8;
const AXIS_TICK = { fill: 'rgb(var(--gray-500))', fontSize: 12 };
const sectionTitle = 'text-lg font-semibold text-gray-900 dark:text-gray-50';

const sum = (items, pick) => items.reduce((total, item) => total + (Number(pick(item)) || 0), 0);

const ChartTooltip = ({ active, payload, label }) => (active && payload?.length ? (
  <div className="card px-3 py-2 text-xs shadow-pop">
    <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
    <p className="tabular-nums text-gray-600 dark:text-gray-400">{plural(payload[0].value, 'listing')}</p>
  </div>
) : null);

const OverviewSkeleton = () => (
  <div aria-hidden="true">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} className="p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-16" />
        </Card>
      ))}
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  </div>
);

const VendorDashboard = () => {
  // The stats call only adds the store link and totals, so the page still
  // works from the listings alone when it fails.
  const load = useCallback(async () => {
    const [products, stats] = await Promise.all([apiGetVendorsProducts(), apiGetUserStats().catch(() => null)]);
    return {
      products: Array.isArray(products.data) ? products.data : [],
      vendorId: stats?.data?.user?.id,
      totals: stats?.data?.vendorStats,
    };
  }, []);
  const { status, data, reload } = useLoader(load);

  const products = data?.products || [];
  const totals = data?.totals || {
    totalProducts: products.length,
    totalViews: sum(products, (p) => p.views),
    totalSold: sum(products, (p) => p.sold),
    totalRevenue: sum(products, (p) => p.price * p.sold),
  };

  const byCategory = Object.entries(products.reduce((counts, p) => {
    const category = p.category || 'Other';
    return { ...counts, [category]: (counts[category] || 0) + 1 };
  }, {})).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  const topListings = [...products].sort((a, b) => (b.views || 0) - (a.views || 0) || (b.sold || 0) - (a.sold || 0)).slice(0, TOP_COUNT);
  const lowestStock = [...products].sort((a, b) => (a.inventory || 0) - (b.inventory || 0)).slice(0, INVENTORY_ROWS);

  return (
    <div className="page">
      <PageHeader
        title="Shop overview"
        description="Views, sales and stock for your listings."
        actions={(
          <>
            {data?.vendorId && <Button as={Link} to={ROUTES.store(data.vendorId)} variant="secondary" icon={LuStore}>View store</Button>}
            <Button as={Link} to={ROUTES.addListing} icon={LuPlus}>Add listing</Button>
          </>
        )}
      />

      {status === 'loading' && <OverviewSkeleton />}

      {status === 'error' && <LoadError title="Your shop overview could not be loaded" onRetry={reload} />}

      {status === 'ready' && (
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Listings" value={formatNumber(totals.totalProducts)} hint={`${formatNumber(products.filter(inStock).length)} in stock`} icon={LuPackage} />
            <StatCard label="Total views" value={formatNumber(totals.totalViews)} icon={LuEye} />
            <StatCard label="Items sold" value={formatNumber(totals.totalSold)} icon={LuShoppingBag} />
            <StatCard
              label="Revenue"
              value={<span className="text-xl sm:text-2xl">{formatMoney(totals.totalRevenue, { whole: true })}</span>}
              hint="Units sold at current prices"
              icon={LuBanknote}
            />
          </div>

          {products.length === 0 ? (
            <Card>
              <EmptyState
                icon={LuStore}
                title="No listings yet"
                description="Add your first listing to start selling on the marketplace."
                action={<Button as={Link} to={ROUTES.addListing} icon={LuPlus}>Add listing</Button>}
              />
            </Card>
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card as="section" className="min-w-0 p-5">
                  <h2 className={sectionTitle}>Listings by category</h2>
                  {/* The grid lines take their colour from this wrapper so they adapt to dark mode. */}
                  <div className="mt-4 text-gray-200 dark:text-gray-800">
                    <ResponsiveContainer width="100%" height={Math.max(160, byCategory.length * 40)}>
                      <BarChart data={byCategory} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                        <CartesianGrid horizontal={false} stroke="currentColor" />
                        <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={120} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgb(var(--gray-500) / 0.1)' }} />
                        <Bar dataKey="count" fill="rgb(var(--brand-600))" radius={[0, 4, 4, 0]} maxBarSize={24} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card as="section" className="min-w-0 p-5">
                  <h2 className={sectionTitle}>Top listings by views</h2>
                  <ol className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
                    {topListings.map((product, i) => (
                      <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="w-4 shrink-0 text-sm font-semibold tabular-nums text-gray-400 dark:text-gray-500">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <Link to={ROUTES.product(product.id)} className="block truncate text-sm font-medium text-gray-900 hover:underline dark:text-gray-100">{product.title}</Link>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{product.category || 'Other'}</p>
                        </div>
                        <div className="shrink-0 text-right tabular-nums">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{plural(product.views, 'view')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(product.sold)} sold</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>

              <Card as="section" className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <h2 className={sectionTitle}>Inventory</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Lowest stock first.</p>
                  </div>
                  <Link to={ROUTES.listings} className="link text-sm">
                    {products.length > INVENTORY_ROWS ? `View all ${plural(products.length, 'listing')}` : 'Manage listings'}
                  </Link>
                </div>
                <div className="table-wrap border-t border-gray-200 dark:border-gray-800">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Listing</th>
                        <th className="text-right">Stock</th>
                        <th>Status</th>
                        <th className="text-right">Price</th>
                        <th className="text-right">Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowestStock.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="flex min-w-[10rem] items-center gap-3">
                              <ProductImage image={product.image} wasteType={product.wasteType} transform="w_120,q_auto,f_auto" className="h-10 w-10 rounded-lg" iconClassName="h-4 w-4" />
                              <div className="min-w-0">
                                <Link to={ROUTES.editListing(product.id)} className="font-medium text-gray-900 hover:underline dark:text-gray-100">{product.title}</Link>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{product.category || 'Other'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-right tabular-nums">{formatNumber(product.inventory)}</td>
                          <td>
                            <Badge tone={inStock(product) ? 'neutral' : 'danger'}>{inStock(product) ? 'In stock' : 'Out of stock'}</Badge>
                          </td>
                          <td className="whitespace-nowrap text-right tabular-nums">{formatMoney(product.price)}</td>
                          <td className="text-right tabular-nums">{formatNumber(product.sold)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
