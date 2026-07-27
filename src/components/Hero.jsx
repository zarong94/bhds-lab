import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import './Hero.css';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero__accent" />
      <div className="hero__content container">
        <motion.p
          className="hero__affiliation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {t('hero.university')} · {t('hero.department')}
        </motion.p>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('hero.labName')}
        </motion.h1>

        <motion.p
          className="hero__slogan"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('hero.slogan')}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Link to="/research" className="btn btn--primary">
            {t('hero.cta')}
          </Link>
          <Link to="/members" className="btn btn--secondary">
            {t('hero.ctaSecondary')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
