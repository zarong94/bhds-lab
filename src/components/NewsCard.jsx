import { useLanguage } from '../context/LanguageContext';
import './NewsCard.css';

const categoryLabels = {
  award: { en: 'Award', ko: '수상' },
  publication: { en: 'Paper', ko: '논문' },
  event: { en: 'Event', ko: '행사' },
  announcement: { en: 'Notice', ko: '공지' },
};

export default function NewsCard({ item }) {
  const { lang } = useLanguage();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (lang === 'ko') {
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Strip emoji from title for cleaner look
  const cleanTitle = (title) => title.replace(/[\u{1F3C6}\u{1F4C4}\u{1F389}\u{1F4E2}]\s*/gu, '');

  return (
    <div className={`newscard newscard--${item.category}`}>
      <div className="newscard__header">
        <span className={`newscard__badge newscard__badge--${item.category}`}>
          {categoryLabels[item.category]?.[lang] || item.category}
        </span>
        <span className="newscard__date">{formatDate(item.date)}</span>
      </div>
      <h3 className="newscard__title">{cleanTitle(item.title[lang])}</h3>
      <p className="newscard__desc">{item.description[lang]}</p>
    </div>
  );
}
