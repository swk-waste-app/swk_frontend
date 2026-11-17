import { Link } from 'react-router-dom';
import { LuPackage, LuPencil, LuStore } from 'react-icons/lu';
import { brand } from '../../config/brand';
import { Button, Card } from '../../components/ui';

const POINTS = [
  { icon: LuPackage, text: 'List upcycled products with a photo, price, condition and stock level.' },
  { icon: LuStore, text: 'Get a shop page that shows all of your listings in one place.' },
  { icon: LuPencil, text: 'Edit or remove listings from your vendor dashboard at any time.' },
];

const VendorSection = () => (
  <section id="vendors" className="scroll-mt-16">
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Card className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <div>
          <p className="eyebrow">For vendors</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl">
            Sell upcycled products on the marketplace
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            If you make goods from recovered materials, a vendor account puts them in front of the households
            that use {brand.name}.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/signup?type=vendor">Open a vendor account</Button>
            <Button as={Link} to="/signin" variant="ghost">Sign in to your shop</Button>
          </div>
        </div>

        <ul className="flex flex-col gap-5 lg:justify-center">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="pt-1.5">{text}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </section>
);

export default VendorSection;
