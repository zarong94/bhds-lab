import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import { FiMapPin, FiMail, FiUsers } from 'react-icons/fi';
import './Contact.css';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function Contact() {
  const { t, lang } = useLanguage();
  const { home } = useSiteData();
  const email = home.email;

  return (
    <div className="contact">
      <PageHero title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <div className="container">
        <div className="contact__grid">
          <motion.div className="contact__info" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="contact__info-card card">
              <div className="contact__info-item">
                <div className="contact__info-icon"><FiMapPin /></div>
                <div>
                  <h3 className="contact__info-label">{t('contact.address')}</h3>
                  <p className="contact__info-detail">{pick(home.affiliation, lang)}</p>
                  <p className="contact__info-detail">{pick(home.address, lang) || t('contact.addressDetail')}</p>
                </div>
              </div>
              {email && (
                <div className="contact__info-item">
                  <div className="contact__info-icon"><FiMail /></div>
                  <div>
                    <h3 className="contact__info-label">{t('contact.email')}</h3>
                    <a href={`mailto:${email}`} className="contact__info-detail contact__info-link">{email}</a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div className="contact__prospective" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="contact__prospective-card">
              <div className="contact__prospective-icon"><FiUsers size={32} /></div>
              <h2 className="contact__prospective-title">{pick(home.recruitTitle, lang) || t('contact.prospective')}</h2>
              {home.recruitRoles[lang]?.length > 0 && (
                <ul className="contact__roles">
                  {home.recruitRoles[lang].map((r) => <li key={r}>{r}</li>)}
                </ul>
              )}
              <p className="contact__prospective-text">{pick(home.recruitText, lang)}</p>
              {email && (
                <a href={`mailto:${email}`} className="btn btn--primary"><FiMail /> {t('contact.applyButton')}</a>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div className="contact__map" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="contact__map-title">{t('contact.locationTitle')}</h2>
          <div className="contact__map-container">
            <iframe
              title="Yonsei University"
              src={`https://www.google.com/maps?q=${encodeURIComponent(home.address.ko ? home.address.ko.replace(/\s*\S*호$/, '') : '연세대학교')}&output=embed`}
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
