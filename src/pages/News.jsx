import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import NewsCard from '../components/NewsCard';
import './Extra.css';

export default function News() {
  const { t } = useLanguage();
  const { news } = useSiteData();

  return (
    <div className="news-page">
      <PageHero title={t('news.title')} />
      <div className="container news-page__list">
        {news.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: Math.min(i, 3) * 0.05 }}>
            <NewsCard item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
