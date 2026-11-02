import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import { formatDate } from '../components/NewsCard';
import Photo from '../components/Photo';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function Home() {
  const { t, lang } = useLanguage();
  const { home, areas, news, pubs, projects, members, presentations } = useSiteData();
  const memberCount = ['professor', 'postdoc', 'researcher', 'phd', 'ms', 'undergraduate']
    .reduce((n, k) => n + members[k].length, 0);

  return (
    <div className="home">
      {/* 1. 히어로: 왼쪽 글, 오른쪽 사진 (글이 얼굴을 가리지 않게) */}
      <section className={`hx-hero ${home.heroPhoto ? '' : 'hx-hero--plain'}`}>
        {home.heroPhoto && <Photo src={home.heroPhoto} alt="" className="hx-hero__backdrop" />}
        <div className="hx-hero__shade" />
        <div className="hx-hero__inner container">
          <div className="hx-hero__text">
            <motion.p className="hx-hero__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              {pick(home.school, lang)}
            </motion.p>
            <motion.h1 className="hx-hero__title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              {pick(home.tagline, lang)}
            </motion.h1>
            <motion.p className="hx-hero__lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}>
              {pick(home.labName, lang)}
            </motion.p>
            <motion.div className="hx-hero__actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
              <Link to="/research" className="hx-btn hx-btn--solid">{t('hero.cta')}</Link>
              <Link to="/members" className="hx-btn hx-btn--ghost">{t('hero.ctaSecondary')}</Link>
            </motion.div>
          </div>
          {home.heroPhoto && (
            <motion.div className="hx-hero__photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <Photo src={home.heroPhoto} alt={pick(home.labName, lang)} className="hx-hero__img" style={{ objectPosition: `center ${home.heroPos}` }} />
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. 연구실 소개 */}
      <section className="hx-intro container">
        <motion.div className="hx-intro__head" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {t('home.eyebrowAbout') && <p className="hx-eyebrow">{t('home.eyebrowAbout')}</p>}
          <h2 className="hx-intro__title">
            {pick(home.labName, lang)}
          </h2>
        </motion.div>
        <motion.div className="hx-intro__body" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
          <p className="hx-intro__text">{pick(home.intro, lang)}</p>
          <dl className="hx-intro__facts">
            <div><dt>{t('home.pi')}</dt><dd>{pick(home.pi, lang)}</dd></div>
            <div><dt>{t('home.affiliation')}</dt><dd>{pick(home.affiliation, lang)}</dd></div>
          </dl>
          <Link to="/about" className="hx-more">{t('nav.about')} <FiArrowRight /></Link>
        </motion.div>
      </section>

      {/* 3. 가로 사진 띠 */}
      {home.bandPhoto && (
        <div className="hx-band">
          <Photo src={home.bandPhoto} alt="" className="hx-band__img" style={{ objectPosition: `center ${home.bandPos}` }} />
          <div className="hx-band__stats container">
            <div><strong>{pubs.length}</strong><span>{t('home.publications')}</span></div>
            <div><strong>{projects.length}</strong><span>{t('home.projects')}</span></div>
            <div><strong>{presentations.length}</strong><span>{t('home.presentations')}</span></div>
            <div><strong>{memberCount}</strong><span>{t('home.membersCount')}</span></div>
          </div>
        </div>
      )}

      {/* 4. 연구 분야 */}
      <section className="hx-research">
        <div className="container">
          {t('home.eyebrowResearch') && <p className="hx-eyebrow hx-center">{t('home.eyebrowResearch')}</p>}
          <h2 className="hx-section-title hx-center">{t('home.researchHighlights')}</h2>
          <div className="hx-research__grid">
            {areas.map((a, i) => (
              <motion.div key={a.id} className="hx-area" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <span className="hx-area__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="hx-area__title">{pick(a.title, lang)}</h3>
                <p className="hx-area__desc">{pick(a.description, lang)}</p>
              </motion.div>
            ))}
          </div>
          <div className="hx-center"><Link to="/research" className="hx-more">{t('home.viewAll')} <FiArrowRight /></Link></div>
        </div>
      </section>

      {/* 5. 연구실 소식 — 세로 사진 카드 */}
      {news.length > 0 && (
        <section className="hx-news container">
          {t('home.eyebrowNews') && <p className="hx-eyebrow hx-center">{t('home.eyebrowNews')}</p>}
          <h2 className="hx-section-title hx-center">{t('home.newsTitle')}</h2>
          <div className="hx-news__grid">
            {news.slice(0, 3).map((n, i) => (
              <motion.div key={n.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to="/news" className={`hx-card ${n.photo ? '' : 'hx-card--plain'}`}>
                  {n.photo && <Photo src={n.photo} alt="" className="hx-card__img" />}
                  <div className="hx-card__shade" />
                  <div className="hx-card__text">
                    <p className="hx-card__meta">{t(`news.categories.${n.category}`)} · {formatDate(n.date, lang)}</p>
                    <h3 className="hx-card__title">{pick(n.title, lang)}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="hx-center"><Link to="/news" className="hx-more">{t('home.viewAll')} <FiArrowRight /></Link></div>
        </section>
      )}

      {/* 6. 모집 */}
      {pick(home.recruitTitle, lang) && (
        <section className="hx-recruit">
          <div className="container hx-recruit__inner">
            <div>
              <h2 className="hx-recruit__title">{pick(home.recruitTitle, lang)}</h2>
              <p className="hx-recruit__text">{pick(home.recruitText, lang)}</p>
            </div>
            {home.email && (
              <a href={`mailto:${home.email}`} className="hx-btn hx-btn--solid"><FiMail /> {home.email}</a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
