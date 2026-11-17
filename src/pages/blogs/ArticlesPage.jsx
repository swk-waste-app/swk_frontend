import { LuFileText } from 'react-icons/lu';
import { apiClient } from '../../services/config';
import ArticleFeed from './ArticleFeed';

// The count arrives either as a number or as text that already reads "Cited by 12".
const citedByLabel = (total) => (/cited/i.test(String(total)) ? String(total) : `Cited by ${total}`);

const loadArticles = async () => {
  const { data } = await apiClient.get('/scholar/google-scholar', { params: { query: 'waste management' } });
  if (!Array.isArray(data?.scholar_results)) throw new Error('Unexpected articles response');
  return data.scholar_results
    .filter((article) => article?.title)
    .map((article) => {
      const { cited_by: citedBy, versions, related_pages_link: related } = article.inline_links || {};
      return {
        title: article.title,
        url: article.title_link,
        summary: article.snippet,
        meta: [article.displayed_link],
        links: [
          citedBy?.link && { label: citedByLabel(citedBy.total), url: citedBy.link },
          versions?.link && { label: String(versions.total || 'Other versions'), url: versions.link },
          related && { label: 'Related articles', url: related },
        ].filter(Boolean),
      };
    });
};

const ArticlePage = () => (
  <ArticleFeed
    title="Articles"
    description="Published research on waste management, listed by Google Scholar."
    load={loadArticles}
    emptyIcon={LuFileText}
    emptyTitle="No articles to show"
    emptyDescription="The search returned no research articles. Check back later."
  />
);

export default ArticlePage;
