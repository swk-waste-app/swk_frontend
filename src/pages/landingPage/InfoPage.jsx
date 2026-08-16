import { useState } from 'react';
import { FaCommentDots, FaLeaf, FaRecycle, FaTruck } from 'react-icons/fa';
import ChatForm from '../../components/ContactUsForm';
import aboutImg from '../../assets/images/about-team.webp';
import { Link } from 'react-router-dom';

const HIGHLIGHTS = [
  { icon: FaTruck, text: 'Reliable, scheduled waste pickups' },
  { icon: FaRecycle, text: 'Upcycling marketplace for recycled goods' },
  { icon: FaLeaf, text: 'Sustainability workshops for communities' },
];

const AboutSection = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen((v) => !v);

  return (
    <section id="about" className="relative overflow-hidden bg-white dark:bg-gray-900 scroll-mt-20">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-green-100 blur-3xl opacity-60" />

      <div className="relative flex flex-col lg:flex-row items-center gap-12 px-6 py-20 lg:py-28 lg:px-16 max-w-7xl mx-auto">
        <div className="relative w-full lg:w-1/2 flex justify-center items-center">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-green-200 to-green-50 -z-10 hidden sm:block" />
          <img
            src={aboutImg}
            alt="SWK Taka Kipawa waste management team at work"
            loading="lazy"
            className="rounded-2xl shadow-xl w-full lg:w-5/6 object-cover aspect-[4/3]"
          />
          <div className="absolute -bottom-6 left-4 sm:left-10 bg-white p-5 rounded-xl shadow-lg text-center border border-gray-100">
            <h2 className="text-3xl font-extrabold text-green-700">3+</h2>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Years of Service</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 text-gray-700 dark:text-gray-300">
          <h3 className="uppercase text-sm text-green-600 font-bold tracking-widest">Who We Are</h3>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-green-800 dark:text-white mt-3 leading-tight">
            The Future of Eco&#8209;Conscious Living, Made Local
          </h1>
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 mt-4">
            Sustainable waste management for homes, businesses &amp; communities &mdash; enhanced with innovation.
          </p>
          <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            Taka Kipawa is a proudly Ghanaian&#8209;owned platform that combines waste management with an
            upcycling marketplace. We make environmental responsibility accessible by empowering users to
            schedule waste pickups, shop eco&#8209;friendly products, and join sustainability workshops &mdash;
            all in one place. With over{' '}
            <strong className="text-green-700 dark:text-white">100 satisfied customers</strong>, we take pride
            in building a greener future for Kipawa and beyond.
          </p>

          <ul className="mt-8 grid sm:grid-cols-1 gap-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-medium">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={15} />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4 mt-9">
            <Link to="/who-we-are">
              <button className="px-7 py-3.5 bg-green-700 text-white font-semibold rounded-full shadow-md shadow-green-700/25 hover:bg-green-800 transition-colors duration-200">
                More About Us
              </button>
            </Link>
            <Link to="/signup" className="font-semibold text-green-700 hover:text-green-800 underline underline-offset-4">
              Create your account &rarr;
            </Link>
          </div>
        </div>
      </div>

      {!isChatOpen && (
        <div
          role="button"
          tabIndex={0}
          onClick={toggleChat}
          onKeyDown={(e) => e.key === 'Enter' && toggleChat()}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-white text-gray-700 py-3 px-4 rounded-full shadow-xl cursor-pointer border border-gray-100 hover:shadow-2xl transition-shadow dark:bg-gray-800 dark:text-gray-300"
        >
          <FaCommentDots className="text-2xl text-green-600" />
          <span className="hidden lg:inline text-sm font-semibold">Chat with us 👋</span>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleChat}></div>
          <div className="relative">
            <ChatForm />
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSection;
