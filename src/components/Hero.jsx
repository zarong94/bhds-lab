import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import './Hero.css';

export default function Hero() {
  const { t, lang } = useLanguage();
  const { home } = useSiteData();
  const other = lang === 'ko' ? 'en' : 'ko';

  return (
    <section className="hero">
      <div className="hero__accent" />
      <div className="hero__content container">
        <motion.p className="hero__affiliation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {pick(home.school, lang)}
        </motion.p>
        <motion.h1 className="hero__title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {pick(home.labName, lang)}
        </motion.h1>
        {home.labName[other] && home.labName[other] !== home.labName[lang] && (
          <motion.p className="hero__subname" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            {home.labName[other]}
          </motion.p>
        )}
        <motion.p className="hero__slogan" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {pick(home.tagline, lang)}
        </motion.p>
        <motion.div className="hero__actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
          <Link to="/research" className="btn btn--primary">{t('hero.cta')}</Link>
          <Link to="/members" className="btn btn--secondary">{t('hero.ctaSecondary')}</Link>
        </motion.div>
      </div>
    </section>
  );
}
