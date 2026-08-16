import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaLeaf } from 'react-icons/fa';
import { apiGetEducationResource } from '../../services/education';

const cloudinaryUrl = (image) =>
  `https://res.cloudinary.com/dwgj3lovn/image/upload/w_1200,q_auto,f_auto/${image}`;

const EducationDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiGetEducationResource(id)
      .then((res) => { if (!cancelled) setResource(res.data); })
      .catch(() => { if (!cancelled) setError('This resource could not be found.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-gray-600">{error || 'This resource could not be found.'}</p>
        <Link to="/education" className="mt-4 text-green-700 font-semibold hover:underline">Back to resources</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <Link to="/education" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 mb-8">
        <FaArrowLeft size={12} /> Back to resources
      </Link>

      <span className="text-xs font-bold uppercase tracking-wide text-green-600">{resource.category}</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 leading-tight">{resource.title}</h1>
      <p className="text-gray-500 text-sm mt-3">
        {resource.author?.name ? `By ${resource.author.name} · ` : ''}
        {new Date(resource.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {resource.image ? (
        <img
          src={cloudinaryUrl(resource.image)}
          alt={resource.title}
          className="w-full rounded-2xl shadow-md mt-8 object-cover max-h-96"
        />
      ) : (
        <div className="w-full h-56 rounded-2xl bg-green-50 flex items-center justify-center mt-8">
          <FaLeaf className="text-6xl text-green-200" />
        </div>
      )}

      <p className="mt-8 text-lg text-gray-700 font-medium leading-relaxed">{resource.summary}</p>
      <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">{resource.content}</div>

      {resource.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10">
          {resource.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default EducationDetail;
