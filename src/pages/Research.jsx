import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import researchData from '../data/research.json';
import { FaBrain, FaChartLine, FaFileAlt, FaHeartbeat, FaLink } from 'react-icons/fa';
import './Research.css';

const iconMap = {
  brain: <FaBrain />,
  chart: <FaChartLine />,
  text: <FaFileAlt />,
  heart: <FaHeartbeat />,
  link: <FaLink />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
};

export default function Research() {
  const { t, lang } = useLanguage();

  return (
    <div className="research">
      <div className="research__hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('research.title')}
          </motion.h1>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('research.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container">
        <div className="research__grid">
          {researchData.map((item, i) => (
            <motion.div
              key={item.id}
              className="research__card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <div className="research__card-header">
                <div className="research__card-icon">
                  {iconMap[item.icon]}
                </div>
                <h3 className="research__card-title">{item.title[lang]}</h3>
              </div>
              <p className="research__card-desc">{item.description[lang]}</p>
              <div className="research__card-keywords">
                {item.keywords.map((kw) => (
                  <span key={kw} className="tag">{kw}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
