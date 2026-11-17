import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { Button } from '../../components/ui';

const CtaBanner = () => (
  <section className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl">Book your first pickup</h2>
        <p className="mt-2 max-w-xl text-base text-gray-600 dark:text-gray-400">
          Create an account, choose a date and {brand.operator} does the collecting. Questions first?{' '}
          <Link to="/who-we-are#contact" className="link">Send a message</Link>.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button as={Link} to="/signup" size="lg">Get started</Button>
        <Button as={Link} to="/signin" variant="secondary" size="lg">Sign in</Button>
      </div>
    </div>
  </section>
);

export default CtaBanner;
