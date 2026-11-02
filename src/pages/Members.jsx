import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import Photo from '../components/Photo';
import { FiMail, FiGlobe } from 'react-icons/fi';
import { SiGooglescholar } from 'react-icons/si';
import './Members.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
};

function MemberCard({ member, lang }) {
  const initials = member.name.en.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div className="member-card card">
      <div className="member-card__photo-wrap">
        <Photo
          src={member.photo}
          alt={pick(member.name, lang)}
          className="member-card__photo"
          fallback={<div className="member-card__avatar"><span>{initials}</span></div>}
        />
      </div>
      <h3 className="member-card__name">{pick(member.name, lang)}</h3>
      <p className="member-card__name-other">{lang === 'ko' ? member.name.en : member.name.ko}</p>
      <p className="member-card__role">{pick(member.role, lang)}</p>
      {member.interests[lang]?.length > 0 && (
        <div className="member-card__interests">
          {member.interests[lang].map((x) => <span key={x} className="tag">{x}</span>)}
        </div>
      )}
      <div className="member-card__links">
        {member.email && <a href={`mailto:${member.email}`} className="member-card__link" title={member.email}><FiMail /></a>}
        {member.scholar && <a href={member.scholar} target="_blank" rel="noopener noreferrer" className="member-card__link" title="Google Scholar"><SiGooglescholar /></a>}
        {member.website && <a href={member.website} target="_blank" rel="noopener noreferrer" className="member-card__link" title="Website"><FiGlobe /></a>}
      </div>
      {member.email && <p className="member-card__email">{member.email}</p>}
    </div>
  );
}

export default function Members() {
  const { t, lang } = useLanguage();
  const { members } = useSiteData();
  const categories = ['professor', 'postdoc', 'researcher', 'phd', 'ms', 'undergraduate'];

  return (
    <div className="members">
      <PageHero title={t('members.title')} subtitle={t('members.subtitle')} />
      <div className="container">
        {categories.map((cat) => {
          const list = members[cat];
          if (!list || list.length === 0) return null;
          return (
            <section key={cat} className="members__section">
              <h2 className="members__category-title">{t(`members.categories.${cat}`)}</h2>
              <div className={`members__grid ${cat === 'professor' ? 'members__grid--professor' : ''}`}>
                {list.map((m, i) => (
                  <motion.div key={m.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                    <MemberCard member={m} lang={lang} />
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}

        {members.alumni.length > 0 && (
          <section className="members__section members__section--alumni">
            <h2 className="members__category-title">{t('members.categories.alumni')}</h2>
            <div className="members__alumni-list">
              {members.alumni.map((a) => (
                <div key={a.id} className="members__alumni-item">
                  <div className="members__alumni-name">
                    {pick(a.name, lang)} <span className="members__alumni-other">{lang === 'ko' ? a.name.en : a.name.ko}</span>
                  </div>
                  <div className="members__alumni-role">{pick(a.role, lang)}</div>
                  {pick(a.current, lang) && (
                    <div className="members__alumni-pos">{t('members.currentPosition')}: {pick(a.current, lang)}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
