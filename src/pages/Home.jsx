import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import Hero from '../components/Hero';
import NewsCard from '../components/NewsCard';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { iconMap } from './Research';
import './Home.css';

function AnimatedCounter({ end, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView || !end) return undefined;
    let current = 0;
    const step = Math.max(1, end / (1200 / 16));
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); } else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div className="home-stat" ref={ref}>
      <div className="home-stat__number">{count}</div>
      <div className="home-stat__label">{label}</div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
};

export default function Home() {
  const { t, lang } = useLanguage();
  const { home, areas, news, pubs, projects, members, presentations } = useSiteData();
  const memberCount = ['professor', 'postdoc', 'researcher', 'phd', 'ms', 'undergraduate']
    .reduce((n, k) => n + members[k].length, 0);

  return (
    <div className="home">
      <Hero />

      {/* About */}
      <section className="section home-about">
        <div className="container home-about__grid">
          <div>
            <h2 className="section-title">{t('home.about')}</h2>
            <p className="home-about__intro">{pick(home.intro, lang)}</p>
          </div>
          <dl className="home-about__facts">
            <div className="home-about__fact">
              <dt>{t('home.pi')}</dt>
              <dd><Link to="/about">{pick(home.pi, lang)}</Link></dd>
            </div>
            <div className="home-about__fact">
              <dt>{t('home.affiliation')}</dt>
              <dd>{pick(home.affiliation, lang)}</dd>
            </div>
            {home.keywords[lang]?.length > 0 && (
              <div className="home-about__fact">
                <dt>{t('home.keywords')}</dt>
                <dd className="home-about__tags">
                  {home.keywords[lang].map((k) => <span key={k} className="tag">{k}</span>)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Research areas */}
      <section className="section home-research">
        <div className="container">
          <h2 className="section-title">{t('home.researchHighlights')}</h2>
          <div className="home-research__grid">
            {areas.map((item, i) => (
              <motion.div key={item.id} className="home-research__card card" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="home-research__card-icon">{iconMap[item.icon] || iconMap.chart}</div>
                <h3 className="home-research__card-title">{pick(item.title, lang)}</h3>
                <p className="home-research__card-desc">{pick(item.description, lang)}</p>
              </motion.div>
            ))}
          </div>
          <div className="home-research__more">
            <Link to="/research" className="btn btn--secondary">{t('home.viewAll')} <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section home-stats">
        <div className="container">
          <div className="home-stats__grid">
            <AnimatedCounter end={pubs.length} label={t('home.publications')} />
            <AnimatedCounter end={projects.length} label={t('home.projects')} />
            <AnimatedCounter end={presentations.length} label={t('home.presentations')} />
            <AnimatedCounter end={memberCount} label={t('home.membersCount')} />
          </div>
        </div>
      </section>

      {/* News */}
      {news.length > 0 && (
        <section className="section home-news">
          <div className="container">
            <h2 className="section-title">{t('home.newsTitle')}</h2>
            <div className="home-news__grid">
              {news.slice(0, 3).map((item, i) => (
                <motion.div key={item.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <NewsCard item={item} compact />
                </motion.div>
              ))}
            </div>
            <div className="home-research__more">
              <Link to="/news" className="btn btn--secondary">{t('home.viewAll')} <FiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {/* Recruit */}
      {pick(home.recruitTitle, lang) && (
        <section className="home-recruit">
          <div className="container home-recruit__inner">
            <div>
              <h2 className="home-recruit__title">{pick(home.recruitTitle, lang)}</h2>
              <p className="home-recruit__text">{pick(home.recruitText, lang)}</p>
            </div>
            {home.email && (
              <a href={`mailto:${home.email}`} className="btn btn--primary home-recruit__btn">
                <FiMail /> {home.email}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
