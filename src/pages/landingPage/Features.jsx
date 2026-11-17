import { LuBell, LuBookOpen, LuCalendarPlus, LuMoon, LuScanLine, LuShoppingBag, LuSmartphone, LuTrophy } from 'react-icons/lu';

const FEATURES = [
  { icon: LuCalendarPlus, title: 'Pickup booking and tracking', text: 'Schedule a collection and follow its status until it is completed.' },
  { icon: LuBell, title: 'Notifications', text: 'Hear about it when a pickup changes status or points are added.' },
  { icon: LuTrophy, title: 'Points, levels and badges', text: 'Earn points for completed pickups and see your place on the leaderboard.' },
  { icon: LuScanLine, title: 'AI waste scanner', text: 'Photograph an item to find out what it is and how to sort it.' },
  { icon: LuShoppingBag, title: 'Marketplace', text: 'Browse upcycled and recycled products listed by vendors.' },
  { icon: LuBookOpen, title: 'Education hub', text: 'Read guides on sorting, recycling and composting.' },
  { icon: LuSmartphone, title: 'Installs on your phone', text: 'Add it to your home screen. Pages you have opened stay available offline.' },
  { icon: LuMoon, title: 'Dark mode', text: 'Switch between light and dark whenever you like.' },
];

const Features = () => (
  <section className="border-y border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl">What you can do</h2>
      <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-400">
        Everything a household account includes.
      </p>

      <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Icon className="h-5 w-5 text-brand-700 dark:text-brand-400" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Features;
