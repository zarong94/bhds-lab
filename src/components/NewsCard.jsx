import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { pick } from '../context/SiteDataContext';
import Photo from './Photo';
import './NewsCard.css';

export const formatDate = (dateStr, lang) => {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr;
  return lang === 'ko'
    ? d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/** compact: 홈 화면용(사진 + 요약), 아니면 소식 페이지용(전체 내용) */
export default function NewsCard({ item, compact = false }) {
  const { t, lang } = useLanguage();
  const desc = pick(item.description, lang);
  const [open, setOpen] = useState(false);
  const long = !compact && (desc.length > 180 || desc.split('\n').length > 3);

  return (
    <article className={`newscard newscard--${item.category} ${item.photo ? 'newscard--photo' : ''} ${compact ? 'newscard--compact' : ''}`}>
      {item.photo && (
        <div className="newscard__photo">
          <Photo src={item.photo} alt={pick(item.title, lang)} />
        </div>
      )}
      <div className="newscard__body">
        <div className="newscard__header">
          <span className={`newscard__badge newscard__badge--${item.category}`}>{t(`news.categories.${item.category}`)}</span>
          <span className="newscard__date">{formatDate(item.date, lang)}</span>
        </div>
        <h3 className="newscard__title">{pick(item.title, lang)}</h3>
        <p className={`newscard__desc ${long && !open ? 'newscard__desc--clamped' : ''}`}>{compact ? desc.split('\n')[0] : desc}</p>
        {long && (
          <button type="button" className="newscard__toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? t('news.less') : t('news.more')}
          </button>
        )}
      </div>
    </article>
  );
}
