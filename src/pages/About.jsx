import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FiCalendar, FiBriefcase, FiAward } from 'react-icons/fi';
import './About.css';

export default function About() {
  const { t } = useLanguage();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="about">
      <div className="about__hero">
        <div className="about__hero-bg" />
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('about.title')}
          </motion.h1>
        </div>
      </div>

      <div className="container">
        {/* Profile Section */}
        <motion.section
          className="about__profile"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="about__avatar">
            <div className="about__avatar-placeholder">
              <span>SP</span>
            </div>
          </div>
          <div className="about__info">
            <h2 className="about__name">
              {t('about.educationList') ? 'Sohee Park, Ph.D.' : '박소희'}
            </h2>
            <p className="about__role">{t('about.professorTitle')}</p>
            <p className="about__affiliation">
              {t('hero.department')}, {t('hero.university')}
            </p>
            <p className="about__bio">{t('about.bio')}</p>
          </div>
        </motion.section>

        {/* Research Interests */}
        <motion.section
          className="about__section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="about__section-title">{t('about.interests')}</h2>
          <div className="about__tags">
            {(Array.isArray(t('about.interestTags')) ? t('about.interestTags') : []).map((tag, i) => (
              <span key={i} className={`tag ${i % 3 === 0 ? 'tag--warm' : i % 3 === 1 ? 'tag--gold' : ''}`}>
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Education Timeline */}
        <motion.section
          className="about__section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="about__section-title">
            <FiCalendar className="about__section-icon" />
            {t('about.education')}
          </h2>
          <div className="about__timeline">
            {(Array.isArray(t('about.educationList')) ? t('about.educationList') : []).map((item, i) => (
              <div key={i} className="about__timeline-item">
                <div className="about__timeline-dot" />
                <div className="about__timeline-year">{item.year}</div>
                <div className="about__timeline-detail">{item.detail}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          className="about__section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="about__section-title">
            <FiBriefcase className="about__section-icon" />
            {t('about.experience')}
          </h2>
          <div className="about__timeline">
            {(Array.isArray(t('about.experienceList')) ? t('about.experienceList') : []).map((item, i) => (
              <div key={i} className="about__timeline-item">
                <div className="about__timeline-dot" />
                <div className="about__timeline-year">{item.year}</div>
                <div className="about__timeline-detail">{item.detail}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Awards */}
        <motion.section
          className="about__section about__section--last"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="about__section-title">
            <FiAward className="about__section-icon" />
            {t('about.awards')}
          </h2>
          <ul className="about__awards">
            {(Array.isArray(t('about.awardsList')) ? t('about.awardsList') : []).map((award, i) => (
              <li key={i} className="about__award-item">
                <span className="about__award-icon">🏆</span>
                {award}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
