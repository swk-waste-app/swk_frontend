import { FaArrowsAltH, FaCloudSun, FaRulerCombined } from 'react-icons/fa';
import guideImg from '../../assets/images/trashcan-guide.webp';

const TIPS = [
  {
    icon: FaArrowsAltH,
    title: 'Give It Space',
    text: 'Leave at least 3 feet of clearance on all sides so the automated arm can grab and empty the bin safely.',
  },
  {
    icon: FaRulerCombined,
    title: 'Curb-Ready Position',
    text: 'Place your bin with wheels facing your house, handle out, right at the edge of the curb on collection day.',
  },
  {
    icon: FaCloudSun,
    title: 'Weather-Proof It',
    text: 'Keep bins away from overhangs, poles and parked cars so crews can access them in any weather.',
  },
];

const TrashCanPlacement = () => {
  return (
    <section className="bg-white py-24 lg:py-28 px-5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-green-600 font-bold uppercase text-sm tracking-widest">Pro Tip</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 mt-3 leading-tight">
            The Placement of Your Trash Can Matters
          </h1>
          <p className="text-lg text-gray-600 mt-5 leading-relaxed">
            Positioning your bin correctly ensures efficient collection of garbage, recyclables and yard
            waste &mdash; and keeps our crews safe.
          </p>

          <div className="mt-9 space-y-5">
            {TIPS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-green-50 -z-10 hidden sm:block" />
          <img
            src={guideImg}
            alt="Trash can placement guide"
            loading="lazy"
            className="mx-auto rounded-2xl shadow-lg w-full max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default TrashCanPlacement;
