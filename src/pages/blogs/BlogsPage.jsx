import { LuNewspaper } from 'react-icons/lu';
import { apiClient } from '../../services/config';
import { formatDate } from '../../lib/format';
import ArticleFeed from './ArticleFeed';

const loadNews = async () => {
  const { data } = await apiClient.get('/news', { params: { query: 'recycling' } });
  if (!Array.isArray(data)) throw new Error('Unexpected news response');
  return data
    // The news provider returns placeholder entries for stories it has withdrawn.
    .filter((article) => article?.title && article.title !== '[Removed]')
    .map((article) => ({
      title: article.title,
      url: article.url,
      summary: article.description,
      meta: [article.source?.name, formatDate(article.publishedAt)],
    }));
};

const BlogsPage = () => (
  <ArticleFeed
    title="News"
    description="Recent coverage of waste management, recycling and upcycling from news sites."
    load={loadNews}
    emptyIcon={LuNewspaper}
    emptyTitle="No news to show"
    emptyDescription="There are no recent stories right now. Check back later."
  />
);

export default BlogsPage;
