import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FiMapPin, FiMail, FiPhone, FiClock, FiUsers } from 'react-icons/fi';
import './Contact.css';

export default function Contact() {
  const { t } = useLanguage();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="contact">
      <div className="contact__hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container">
        <div className="contact__grid">
          {/* Contact Info */}
          <motion.div
            className="contact__info"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="contact__info-card card">
              <div className="contact__info-item">
                <div className="contact__info-icon"><FiMapPin /></div>
                <div>
                  <h3 className="contact__info-label">{t('contact.address')}</h3>
                  <p className="contact__info-detail">{t('contact.addressDetail')}</p>
                </div>
              </div>

              <div className="contact__info-item">
                <div className="contact__info-icon"><FiMail /></div>
                <div>
                  <h3 className="contact__info-label">{t('contact.email')}</h3>
                  <a href="mailto:sohee.park@yonsei.ac.kr" className="contact__info-detail contact__info-link">
                    sohee.park@yonsei.ac.kr
                  </a>
                </div>
              </div>

              <div className="contact__info-item">
                <div className="contact__info-icon"><FiPhone /></div>
                <div>
                  <h3 className="contact__info-label">{t('contact.phone')}</h3>
                  <p className="contact__info-detail">+82-2-2228-1500</p>
                </div>
              </div>

              <div className="contact__info-item">
                <div className="contact__info-icon"><FiClock /></div>
                <div>
                  <h3 className="contact__info-label">{t('contact.officeHours')}</h3>
                  <p className="contact__info-detail">{t('contact.officeHoursDetail')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prospective Students */}
          <motion.div
            className="contact__prospective"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="contact__prospective-card">
              <div className="contact__prospective-icon">
                <FiUsers size={32} />
              </div>
              <h2 className="contact__prospective-title">{t('contact.prospective')}</h2>
              <p className="contact__prospective-text">{t('contact.prospectiveText')}</p>
              <a
                href="mailto:sohee.park@yonsei.ac.kr?subject=Prospective%20Student%20Inquiry"
                className="btn btn--primary"
              >
                <FiMail /> {t('contact.applyButton')}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Map placeholder */}
        <motion.div
          className="contact__map"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="contact__map-title">{t('contact.locationTitle')}</h2>
          <div className="contact__map-container">
            <iframe
              title="Yonsei University Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.8!2d126.9368!3d37.5645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c98dc50e0aead%3A0x6eb161e1c802a2d4!2sYonsei%20University!5e0!3m2!1sen!2skr!4v1"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
