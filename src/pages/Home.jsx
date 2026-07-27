import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../components/Hero';
import NewsCard from '../components/NewsCard';
import researchData from '../data/research.json';
import newsData from '../data/news.json';
import { FiArrowRight } from 'react-icons/fi';
import { FaBrain, FaChartLine, FaFileAlt, FaHeartbeat, FaLink } from 'react-icons/fa';
import './Home.css';

const iconMap = {
  brain: <FaBrain />,
  chart: <FaChartLine />,
  text: <FaFileAlt />,
  heart: <FaHeartbeat />,
  link: <FaLink />,
};

function AnimatedCounter({ end, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1600;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div className="home-stat" ref={ref}>
      <div className="home-stat__number">{count}+</div>
      <div className="home-stat__label">{label}</div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06 },
  }),
};

export default function Home() {
  const { t, lang } = useLanguage();
  const latestNews = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div className="home">
      <Hero />

      {/* Research Highlights */}
      <section className="section home-research">
        <div className="container">
          <h2 className="section-title">{t('home.researchHighlights')}</h2>
          <div className="home-research__grid">
            {researchData.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.id}
                className="home-research__card card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="home-research__card-icon">
                  {iconMap[item.icon]}
                </div>
                <h3 className="home-research__card-title">{item.title[lang]}</h3>
                <p className="home-research__card-desc">{item.description[lang]}</p>
                <div className="home-research__card-tags">
                  {item.keywords.slice(0, 3).map((kw) => (
                    <span key={kw} className="tag">{kw}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="home-research__more">
            <Link to="/research" className="btn btn--secondary">
              {t('home.viewAll')} <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section home-stats">
        <div className="container">
          <div className="home-stats__grid">
            <AnimatedCounter end={45} label={t('home.publications')} />
            <AnimatedCounter end={12} label={t('home.projects')} />
            <AnimatedCounter end={15} label={t('home.membersCount')} />
            <AnimatedCounter end={8} label={t('home.collaborations')} />
          </div>
        </div>
      </section>

      {/* News */}
      <section className="section home-news">
        <div className="container">
          <h2 className="section-title">{t('home.newsTitle')}</h2>
          <p className="section-subtitle">{t('home.newsSubtitle')}</p>
          <div className="home-news__grid">
            {latestNews.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <NewsCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
