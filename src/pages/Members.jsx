import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import Photo from '../components/Photo';
import { FiMail, FiGlobe } from 'react-icons/fi';
import { SiGooglescholar } from 'react-icons/si';
import './Members.css';

const SCHOOL_EN = {
  '융합보건의료대학원': 'Graduate School of Transdisciplinary Health Sciences',
  '보건대학원': 'Graduate School of Public Health',
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
};

function MemberCard({ member, lang }) {
  const initials = member.name.en.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div className="member-card card">
      <div className="member-card__photo-wrap">
        <div className="member-card__frame">
          <Photo
            src={member.photo}
            alt={pick(member.name, lang)}
            className="member-card__img"
            style={{ transform: `scale(${member.photoZoom})`, objectPosition: `center ${member.photoPos}` }}
            fallback={<div className="member-card__avatar"><span>{initials}</span></div>}
          />
        </div>
      </div>
      <h3 className="member-card__name">{pick(member.name, lang)}</h3>
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
  // 교수님은 '교수 소개' 페이지에 따로 있으므로 구성원 목록에서는 뺌
  const categories = ['postdoc', 'researcher', 'phd', 'ms', 'undergraduate'];
  // 졸업생은 대학원별로 묶음 (시트 '구성원' 탭의 '대학원' 칸)
  const order = ['융합보건의료대학원', '보건대학원'];
  const schools = [...new Set(members.alumni.map((a) => a.school))]
    .sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) || (a === '' ? 1 : 0));
  const alumniGroups = schools.map((school) => ({ school, list: members.alumni.filter((a) => a.school === school) }));

  return (
    <div className="members">
      <PageHero title={t('members.title')} />
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
            {alumniGroups.map((g) => (
            <div key={g.school || 'etc'} className="members__alumni-group">
            {g.school && <h3 className="members__alumni-school">{SCHOOL_EN[g.school] && lang === 'en' ? SCHOOL_EN[g.school] : g.school}</h3>}
            <div className="members__alumni-list">
              {g.list.map((a) => (
                <div key={a.id} className="members__alumni-item">
                  <div className="members__alumni-name">
                    {pick(a.name, lang)}
                  </div>
                  <div className="members__alumni-role">{pick(a.role, lang)}</div>
                  {pick(a.current, lang) && (
                    <div className="members__alumni-pos">{t('members.currentPosition')}: {pick(a.current, lang)}</div>
                  )}
                </div>
              ))}
            </div>
            </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
