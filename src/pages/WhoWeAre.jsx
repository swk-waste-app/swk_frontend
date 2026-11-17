import { LuAward, LuBookOpen, LuShoppingBag, LuTruck } from 'react-icons/lu';
import { brand } from '../config/brand';
import { Card } from '../components/ui';
import ContactUsForm from '../components/ContactUsForm';

const SERVICES = [
  {
    icon: LuTruck,
    title: 'Waste pickup',
    text: 'Households book a collection for a date and a location, then follow it until it is completed.',
  },
  {
    icon: LuAward,
    title: 'Recycling rewards',
    text: 'Completed pickups earn points. Points add up to levels and badges, with a leaderboard for everyone taking part.',
  },
  {
    icon: LuShoppingBag,
    title: 'Marketplace',
    text: 'Vendors list upcycled and recycled products, and households browse them in one place.',
  },
  {
    icon: LuBookOpen,
    title: 'Education',
    text: 'Guides on sorting, recycling and composting, published by the operations team.',
  },
];

// One row of the page: a heading on the left, its content on the right.
const Row = ({ id, title, aside, children }) => (
  <section
    id={id}
    className="grid scroll-mt-16 gap-6 border-t border-gray-200 py-10 dark:border-gray-800 lg:grid-cols-[1fr_2fr] lg:gap-12 lg:py-14"
  >
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
      {aside}
    </div>
    <div>{children}</div>
  </section>
);

const AboutUsPage = () => (
  <div className="page pb-0 pt-10 sm:pt-14">
    <header className="max-w-3xl pb-10 lg:pb-14">
      <p className="eyebrow">About</p>
      <h1 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
        {brand.name} is run by {brand.operator}
      </h1>
      <p className="mt-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
        It is the waste pickup, recycling rewards and upcycled goods service that {brand.operator} provides
        for households and vendors in {brand.country}.
      </p>
    </header>

    <Row title="Who runs the service">
      <div className="flex max-w-2xl flex-col gap-4 text-base text-gray-700 dark:text-gray-300">
        <p>
          {brand.operator} operates {brand.name} in {brand.country}. Its operations team receives the pickup
          requests, sends the collectors, records what was collected and publishes the guides in the education hub.
        </p>
        <p>
          When you book a pickup here, {brand.operator} is the company that collects it, and the one to
          contact about anything to do with your account.
        </p>
      </div>
    </Row>

    <Row title="What it does">
      <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {SERVICES.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Icon className="h-5 w-5 text-brand-700 dark:text-brand-400" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
          </li>
        ))}
      </ul>
    </Row>

    <Row
      id="contact"
      title="Get in touch"
      aside={(
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <p>Send a message and {brand.operator} will reply by email.</p>
          <p className="mt-4 font-medium text-gray-700 dark:text-gray-300">Email</p>
          <p className="select-all break-all text-gray-900 dark:text-gray-100">{brand.supportEmail}</p>
        </div>
      )}
    >
      <Card className="max-w-2xl p-5 sm:p-6">
        <ContactUsForm />
      </Card>
    </Row>
  </div>
);

export default AboutUsPage;
