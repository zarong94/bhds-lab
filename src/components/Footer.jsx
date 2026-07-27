import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FaGithub, FaEnvelope } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <div className="footer__logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="10" r="3" fill="currentColor" opacity="0.8" />
              <circle cx="10" cy="20" r="3" fill="currentColor" opacity="0.6" />
              <circle cx="22" cy="20" r="3" fill="currentColor" opacity="0.6" />
              <line x1="16" y1="13" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="16" y1="13" x2="22" y2="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
            <span>{t('footer.labName')}</span>
          </div>
          <p className="footer__dept">
            {t('footer.department')}<br />
            {t('footer.university')}
          </p>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__heading">{t('footer.quickLinks')}</h4>
          <Link to="/about" className="footer__link">{t('nav.about')}</Link>
          <Link to="/research" className="footer__link">{t('nav.research')}</Link>
          <Link to="/publications" className="footer__link">{t('nav.publications')}</Link>
          <Link to="/members" className="footer__link">{t('nav.members')}</Link>
          <Link to="/contact" className="footer__link">{t('nav.contact')}</Link>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__heading">{t('footer.connect')}</h4>
          <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="footer__link footer__link--icon">
            <SiGooglescholar /> Google Scholar
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer__link footer__link--icon">
            <FaGithub /> GitHub
          </a>
          <a href="mailto:sohee.park@yonsei.ac.kr" className="footer__link footer__link--icon">
            <FaEnvelope /> Email
          </a>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}
