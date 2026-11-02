import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick, period, noteLabel } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import Photo from '../components/Photo';
import { SiGooglescholar } from 'react-icons/si';
import { FiMail, FiBookOpen, FiBriefcase, FiUsers, FiMic, FiAward } from 'react-icons/fi';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function Section({ icon, title, children, last }) {
  return (
    <motion.section className={`about__section ${last ? 'about__section--last' : ''}`} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}>
      <h2 className="about__section-title">{icon}<span>{title}</span></h2>
      {children}
    </motion.section>
  );
}

function CvList({ items, lang }) {
  return (
    <ul className="cv-list">
      {items.map((it, i) => (
        <li key={i} className="cv-list__item">
          <span className="cv-list__text">{pick(it.text, lang)}</span>
          <span className="cv-list__period">{period(it.period, lang)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  const { t, lang } = useLanguage();
  const { prof, home, members } = useSiteData();
  const scholar = home.scholar || members.professor[0]?.scholar;
  const [showAllTalks, setShowAllTalks] = useState(false);
  const talkYears = showAllTalks ? prof.talks : prof.talks.slice(0, 2);
  const initials = prof.name.en.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <div className="about">
      <PageHero title={t('about.title')} />

      <div className="container">
        <motion.section className="about__profile" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="about__avatar">
            <Photo
              src={prof.photo}
              alt={pick(prof.name, lang)}
              className="about__photo"
              fallback={<div className="about__avatar-placeholder"><span>{initials}</span></div>}
            />
          </div>
          <div className="about__info">
            <h2 className="about__name">
              {pick(prof.name, lang)}
            </h2>
            <p className="about__role">{pick(prof.title, lang)}</p>
            <p className="about__affiliation">{pick(prof.affiliation, lang)}</p>
            {prof.email && (
              <a className="about__email" href={`mailto:${prof.email}`}><FiMail /> {prof.email}</a>
            )}
            {scholar && (
              <a className="about__email about__scholar" href={scholar} target="_blank" rel="noopener noreferrer"><SiGooglescholar /> Google Scholar</a>
            )}
          </div>
        </motion.section>

        {prof.education.length > 0 && (
          <Section icon={<FiBookOpen className="about__section-icon" />} title={t('about.education')}>
            <CvList items={prof.education} lang={lang} />
          </Section>
        )}

        {prof.career.length > 0 && (
          <Section icon={<FiBriefcase className="about__section-icon" />} title={t('about.career')}>
            {prof.career.map((g) => (
              <div key={g.group.ko} className="cv-group">
                {g.group.ko && <h3 className="cv-group__title">{pick(g.group, lang)}</h3>}
                <CvList items={g.items} lang={lang} />
              </div>
            ))}
          </Section>
        )}

        {prof.service.length > 0 && (
          <Section icon={<FiUsers className="about__section-icon" />} title={t('about.service')}>
            <CvList items={prof.service} lang={lang} />
          </Section>
        )}

        {prof.awards.length > 0 && (
          <Section icon={<FiAward className="about__section-icon" />} title={t('about.awards')}>
            <CvList items={prof.awards} lang={lang} />
          </Section>
        )}

        {prof.talks.length > 0 && (
          <Section icon={<FiMic className="about__section-icon" />} title={t('about.talks')} last>
            {talkYears.map((y) => (
              <div key={y.year} className="talk-year">
                <h3 className="talk-year__label">{y.year}</h3>
                <ul className="talk-list">
                  {y.items.map((it, i) => (
                    <li key={i} className="talk">
                      <p className="talk__title">{pick(it.text, lang)}</p>
                      <p className="talk__meta">
                        {[pick(it.venue, lang), it.period].filter(Boolean).join(' · ')}
                        {it.note && <span className="talk__note">{noteLabel(it.note, lang)}</span>}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {prof.talks.length > 2 && (
              <button className="btn btn--secondary about__more" onClick={() => setShowAllTalks(!showAllTalks)}>
                {showAllTalks ? t('about.showLess') : t('about.showMore')}
              </button>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}
