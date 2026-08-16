import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaLeaf } from 'react-icons/fa';
import { apiGetEducationResources } from '../../services/education';

const CATEGORIES = ['All', 'Recycling Tips', 'Composting', 'Waste Sorting', 'Sustainability', 'Workshops', 'General'];

const cloudinaryUrl = (image) =>
  `https://res.cloudinary.com/dwgj3lovn/image/upload/w_700,q_auto,f_auto/${image}`;

const EducationHub = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGetEducationResources(category === 'All' ? undefined : category)
      .then((res) => { if (!cancelled) setResources(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (!cancelled) setError('Failed to load resources. Please try again shortly.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-green-950 text-white py-16 px-5 sm:px-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-200">
          <FaLeaf size={12} /> Education &amp; Awareness
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-5">Learn to Waste Less, Recycle Right</h1>
        <p className="text-green-100/80 mt-3 max-w-xl mx-auto">
          Practical guides, sorting tips and workshop updates from the Taka Kipawa team &mdash; built to help
          Kipawa and beyond live more sustainably.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 ${
                category === c
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600" />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <FaBookOpen className="mx-auto mb-4 text-4xl text-gray-300" />
            No resources published in this category yet &mdash; check back soon.
          </div>
        )}

        {!loading && !error && resources.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((item) => (
              <Link
                to={`/education/${item._id}`}
                key={item._id}
                className="group flex flex-col bg-white rounded-2xl shadow-md ring-1 ring-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="h-44 overflow-hidden bg-green-50 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={cloudinaryUrl(item.image)}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <FaLeaf className="text-5xl text-green-200" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-green-600">{item.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed flex-1 line-clamp-3">{item.summary}</p>
                  <span className="mt-4 text-green-700 font-semibold text-sm">Read more &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationHub;
