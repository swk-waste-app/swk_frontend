import { FaArrowRight, FaBookOpen, FaLeaf, FaTruckLoading } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Reveal from '../../components/Reveal';
import serviceCollection from '../../assets/images/service-collection.webp';
import serviceCompost from '../../assets/images/service-compost.webp';
import serviceEducation from '../../assets/images/service-blog.webp';

const SERVICES = [
  {
    image: serviceCollection,
    icon: FaTruckLoading,
    title: 'Waste Collection',
    description:
      'Using meticulous collection strategies, we efficiently gather waste and transport it to designated facilities for sorting, transfer and recycling.',
    to: '/signin',
  },
  {
    image: serviceCompost,
    icon: FaLeaf,
    title: 'Composting & Recycling',
    description:
      'Our Integrated Waste Processing Plant receives, sorts and recycles solid waste, producing organic compost for agronomic use across Ghana and West Africa.',
    to: '/signin',
  },
  {
    image: serviceEducation,
    icon: FaBookOpen,
    title: 'Education & Awareness',
    description:
      'Practical guides, sorting tips and workshop updates — built to help households and businesses live more sustainably.',
    to: '/education',
  },
];

const WasteManagementSection = () => {
  return (
    <div id="services" className="bg-gray-50 py-24 lg:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="text-green-600 font-bold uppercase text-sm tracking-widest">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mt-3 leading-tight">
              Sustainable Waste Management Solutions
            </h2>
          </div>
          <p className="text-gray-600 max-w-md">
            The Taka Kipawa App is a proudly Ghanaian&#8209;owned platform combining waste management with an
            upcycling marketplace &mdash; built for households and businesses building a greener future.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map(({ image, icon: Icon, title, description, to }, i) => (
            <Reveal key={title} delay={i * 120}>
              <Link
                to={to}
                className="group relative flex flex-col bg-white rounded-2xl shadow-md overflow-hidden ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-green-700 shadow-lg">
                    <Icon size={18} />
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-green-900">{title}</h3>
                  <p className="text-gray-600 mt-2.5 text-sm leading-relaxed flex-1">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-green-700 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                    Learn more <FaArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteManagementSection;
