import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { Button } from '../../components/ui';
import ProductPreview from './ProductPreview';

// The tagline is configured per deployment and may or may not end in a full stop.
const tagline = brand.tagline.replace(/[.!\s]+$/, '');

const Hero = () => (
  <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
      <div>
        <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
          Book a waste pickup and earn points for what you recycle
        </h1>
        <p className="mt-5 max-w-xl text-base text-gray-600 dark:text-gray-400 sm:text-lg">
          {tagline}. {brand.name} is run by {brand.operator}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to="/signup" size="lg">Get started</Button>
          <Button as={Link} to="/#how-it-works" variant="secondary" size="lg">See how it works</Button>
        </div>
      </div>

      <ProductPreview />
    </div>
  </section>
);

export default Hero;
