import { FaCalendarCheck, FaGift, FaTruck, FaUserPlus } from 'react-icons/fa';
import Reveal from '../../components/Reveal';

const STEPS = [
  {
    icon: FaUserPlus,
    title: 'Create an Account',
    text: 'Sign up in under a minute as a household, business, or vendor on the upcycling marketplace.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Schedule a Pickup',
    text: 'Pick a date and location that works for you — we handle the rest, right on time.',
  },
  {
    icon: FaTruck,
    title: 'We Collect & Sort',
    text: 'Our team collects your waste and routes it to the right facility for recycling or composting.',
  },
  {
    icon: FaGift,
    title: 'Earn Rewards',
    text: 'Track your pickups, earn points for consistent recycling, and shop upcycled goods on the marketplace.',
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-green-950 py-24 lg:py-28 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full bg-green-700/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-green-300 font-bold uppercase text-sm tracking-widest">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3">From Sign-Up to Sustainable, in Four Steps</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120} className="relative flex flex-col items-center text-center px-4">
              {i < STEPS.length - 1 && (
                <span className="hidden lg:block absolute top-9 left-[60%] w-full h-px bg-white/15" />
              )}
              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-green-300 backdrop-blur-sm">
                <Icon size={24} />
              </span>
              <span className="mt-4 text-xs font-bold text-green-300 tracking-widest">STEP {i + 1}</span>
              <h3 className="mt-2 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
