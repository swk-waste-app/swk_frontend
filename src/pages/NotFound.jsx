import { Link, useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import { Button } from '../components/ui';
import BrandMark from '../components/BrandMark';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <Link to="/" className="rounded-lg text-gray-900 dark:text-gray-50">
        <BrandMark />
      </Link>
      <p className="eyebrow mt-10">Error 404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        This address does not match any page. Check the link, or start again from the home page.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" icon={LuArrowLeft} onClick={() => navigate(-1)}>Go back</Button>
        <Button as={Link} to="/">Go to home page</Button>
      </div>
    </main>
  );
};

export default NotFound;
