import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { Button, Card } from '../../components/ui';
import BrandMark from '../../components/BrandMark';

// Short entry screen at /s: sign in, create an account, or read more first.
const DirectionPage = () => (
  <main className="flex min-h-screen items-center justify-center px-4 py-12">
    <Card className="w-full max-w-sm p-6 sm:p-8">
      <Link to="/" className="inline-flex max-w-full rounded-lg text-gray-900 dark:text-gray-50">
        <BrandMark />
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Welcome</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{brand.tagline}</p>
      <div className="mt-6 flex flex-col gap-3">
        <Button as={Link} to="/signin">Sign in</Button>
        <Button as={Link} to="/signup" variant="secondary">Create an account</Button>
      </div>
      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        New here? <Link to="/#how-it-works" className="link">See how it works</Link>
      </p>
    </Card>
  </main>
);

export default DirectionPage;
