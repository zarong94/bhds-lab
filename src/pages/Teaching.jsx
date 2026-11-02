import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import { FiArrowUpRight } from 'react-icons/fi';
import './Extra.css';

export default function Teaching() {
  const { t, lang } = useLanguage();
  const { teaching } = useSiteData();

  return (
    <div className="teaching">
      <PageHero title={t('teaching.title')} />
      <div className="container teaching__grid">
        {teaching.map((g) => (
          <section key={g.school.ko + g.major.ko} className="teaching__card card">
            <h2 className="teaching__school">{pick(g.school, lang)}</h2>
            <p className="teaching__major">{pick(g.major, lang)}</p>
            <h3 className="teaching__label">{t('teaching.courses')}</h3>
            <ul className="teaching__courses">
              {g.courses.map((c) => (
                <li key={c.code + c.name.ko} className="teaching__course">
                  <span className="teaching__code">{c.code}</span>
                  <span className="teaching__name">{pick(c.name, lang)}</span>
                </li>
              ))}
            </ul>
            {g.link && (
              <a className="teaching__link" href={g.link} target="_blank" rel="noopener noreferrer">
                {t('teaching.majorLink')} <FiArrowUpRight />
              </a>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
