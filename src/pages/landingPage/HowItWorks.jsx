import { LuAward, LuCalendarPlus, LuTruck } from 'react-icons/lu';
import { brand } from '../../config/brand';
import { Card } from '../../components/ui';

const STEPS = [
  {
    icon: LuCalendarPlus,
    title: 'Book a pickup',
    text: 'Choose a date, a pickup location and the type of waste. You can change or cancel a booking that has not been collected yet.',
  },
  {
    icon: LuTruck,
    title: 'We collect',
    text: `A collector from ${brand.operator} comes on the day. You get a notification each time the pickup status changes.`,
  },
  {
    icon: LuAward,
    title: 'You earn points',
    text: 'A completed pickup adds points based on the weight collected. Points raise your level, and the marketplace is open for upcycled goods.',
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-16">
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl">How it works</h2>
      <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-400">
        Three steps, from booking to points in your account.
      </p>

      <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <Card as="li" key={title} className="p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold tabular-nums text-gray-400 dark:text-gray-500">Step {index + 1}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
          </Card>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
