import axios from 'axios';
import { useEffect, useState } from 'react';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const fetchSWKNews = async () => {
    try {
      const response = await axios.get(`https://swk-backend.onrender.com/api/scholar/google-scholar`, {
        params: { 
          query: 'waste management',
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GNEWS_API_KEY}`,
        },
      });
      console.log('API response data:', response.data);

    
      if (Array.isArray(response.data.scholar_results)) {
        setArticles(response.data.scholar_results);
      } else {
        setError('Invalid articles data format.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching SWK news articles:', error.response || error.message || error);
      setError('Failed to fetch news articles.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSWKNews();
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 rounded-lg">
    <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Articles</h1>
  
    {currentArticles.length === 0 ? (
      <div className="text-center text-lg text-gray-500">No articles found.</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((article, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="mb-3 w-full h-48 object-cover rounded-t-lg"
              />
            )}
            
            <h2 className="text-xl font-semibold text-gray-800">
              <a
                href={article.title_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {article.title}
              </a>
            </h2>
            <p className="text-gray-600 mt-2">{article.snippet}</p>
          
            {article.inline_links && (
              <div className="mt-3 text-sm">
                {article.inline_links.versions && (
                  <a
                    href={article.inline_links.versions.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline mr-2"
                  >
                    {article.inline_links.versions.total}
                  </a>
                )}
                {article.inline_links.cited_by && (
                  <a
                    href={article.inline_links.cited_by.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline mr-2"
                  >
                    Cited by {article.inline_links.cited_by.total}
                  </a>
                )}
                {article.inline_links.related_pages_link && (
                  <a
                    href={article.inline_links.related_pages_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    Related Articles
                  </a>
                )}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {`${article.displayed_link || ''}`}
            </p>
          </div>
        ))}
      </div>
    )}
  
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-lg">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
  
  );
};

export default ArticlePage;
