import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import membersData from '../data/members.json';
import { FiMail, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SiGooglescholar } from 'react-icons/si';
import './Members.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

function MemberCard({ member, lang }) {
  return (
    <div className="member-card card">
      <div className="member-card__avatar">
        <span>{member.name[lang].split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
      </div>
      <h3 className="member-card__name">{member.name[lang]}</h3>
      <p className="member-card__role">{member.role[lang]}</p>
      {member.interests && (
        <div className="member-card__interests">
          {member.interests[lang].map((interest, i) => (
            <span key={i} className="tag">{interest}</span>
          ))}
        </div>
      )}
      <div className="member-card__links">
        {member.email && (
          <a href={`mailto:${member.email}`} className="member-card__link" title="Email">
            <FiMail />
          </a>
        )}
        {member.links?.scholar && (
          <a href={member.links.scholar} target="_blank" rel="noopener noreferrer" className="member-card__link" title="Google Scholar">
            <SiGooglescholar />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Members() {
  const { t, lang } = useLanguage();
  const [showAlumni, setShowAlumni] = useState(false);
  const categories = ['professor', 'phd', 'ms', 'undergraduate'];

  return (
    <div className="members">
      <div className="members__hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('members.title')}
          </motion.h1>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('members.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container">
        {categories.map((cat) => {
          const members = membersData[cat];
          if (!members || members.length === 0) return null;
          return (
            <section key={cat} className="members__section">
              <h2 className="members__category-title">{t(`members.categories.${cat}`)}</h2>
              <div className={`members__grid ${cat === 'professor' ? 'members__grid--professor' : ''}`}>
                {members.map((member, i) => (
                  <motion.div
                    key={member.email || member.name.en}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <MemberCard member={member} lang={lang} />
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Alumni */}
        {membersData.alumni && membersData.alumni.length > 0 && (
          <section className="members__section members__section--alumni">
            <button
              className="members__alumni-toggle"
              onClick={() => setShowAlumni(!showAlumni)}
            >
              <h2 className="members__category-title" style={{ marginBottom: 0 }}>
                {t('members.categories.alumni')}
              </h2>
              {showAlumni ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
            </button>
            {showAlumni && (
              <motion.div
                className="members__alumni-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {membersData.alumni.map((alum, i) => (
                  <div key={alum.name.en} className="members__alumni-item">
                    <div className="members__alumni-name">{alum.name[lang]}</div>
                    <div className="members__alumni-role">{alum.role[lang]}</div>
                    <div className="members__alumni-pos">
                      {t('members.currentPosition')}: {alum.currentPosition[lang]}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
