import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick, projectRole } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import { FaBrain, FaChartLine, FaFileAlt, FaHeartbeat, FaLink } from 'react-icons/fa';
import './Research.css';

export const iconMap = {
  brain: <FaBrain />,
  chart: <FaChartLine />,
  text: <FaFileAlt />,
  heart: <FaHeartbeat />,
  link: <FaLink />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08 } }),
};

function ProjectItem({ p, lang }) {
  const isPI = /PI\)|책임/.test(p.role) && !/Co-I/.test(p.role);
  return (
    <li className="project">
      <div className="project__main">
        <h4 className="project__title">{pick(p.title, lang)}</h4>
        <p className="project__agency">{pick(p.agency, lang)}</p>
      </div>
      <div className="project__meta">
        <span className="project__period">{p.period}</span>
        <span className={`project__role ${isPI ? 'project__role--pi' : ''}`}>{projectRole(p.role, lang)}</span>
      </div>
    </li>
  );
}

export default function Research() {
  const { t, lang } = useLanguage();
  const { areas, projects } = useSiteData();
  const ongoing = projects.filter((p) => p.ongoing);
  const completed = projects.filter((p) => !p.ongoing);
  const byYear = completed.reduce((acc, p) => {
    const y = p.start.slice(0, 4) || '—';
    (acc[y] = acc[y] || []).push(p);
    return acc;
  }, {});

  return (
    <div className="research">
      <PageHero title={t('research.title')} />

      <div className="container">
        <h2 id="areas" className="research__heading">{t('research.areas')}</h2>
        <div className="research__grid">
          {areas.map((item, i) => (
            <motion.div key={item.id} className="research__card" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}>
              <div className="research__card-header">
                <div className="research__card-icon">{iconMap[item.icon] || iconMap.chart}</div>
                <div>
                  <h3 className="research__card-title">{pick(item.title, lang)}</h3>
                </div>
              </div>
              <p className="research__card-desc">{pick(item.description, lang)}</p>
              {item.keywords.length > 0 && (
                <div className="research__card-keywords">
                  {item.keywords.map((kw) => <span key={kw} className="tag">{kw}</span>)}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div id="projects" />
        {ongoing.length > 0 && (
          <section className="research__projects">
            <h2 className="research__heading">{t('research.ongoing')}</h2>
            <ul className="project-list">{ongoing.map((p) => <ProjectItem key={p.id} p={p} lang={lang} />)}</ul>
          </section>
        )}

        {completed.length > 0 && (
          <section className="research__projects research__projects--last">
            <h2 className="research__heading">{t('research.completed')}</h2>
            {Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)).map(([year, list]) => (
              <div key={year} className="project-year">
                <h3 className="project-year__label">{year}</h3>
                <ul className="project-list">{list.map((p) => <ProjectItem key={p.id} p={p} lang={lang} />)}</ul>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
