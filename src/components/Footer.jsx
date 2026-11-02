import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import { FaEnvelope } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const { t, lang } = useLanguage();
  const { home } = useSiteData();

  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <div className="footer__logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="10" r="3" fill="currentColor" opacity="0.8" />
              <circle cx="10" cy="20" r="3" fill="currentColor" opacity="0.6" />
              <circle cx="22" cy="20" r="3" fill="currentColor" opacity="0.6" />
              <line x1="16" y1="13" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="16" y1="13" x2="22" y2="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
            <span>{pick(home.labName, lang)}</span>
          </div>
          <p className="footer__dept">{pick(home.affiliation, lang)}</p>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__heading">{t('footer.quickLinks')}</h4>
          <Link to="/about" className="footer__link">{t('nav.about')}</Link>
          <Link to="/members" className="footer__link">{t('nav.members')}</Link>
          <Link to="/research" className="footer__link">{t('nav.research')}</Link>
          <Link to="/publications" className="footer__link">{t('nav.publications')}</Link>
          <Link to="/news" className="footer__link">{t('nav.news')}</Link>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__heading">{t('footer.contact')}</h4>
          {home.email && (
            <a href={`mailto:${home.email}`} className="footer__link footer__link--icon"><FaEnvelope /> {home.email}</a>
          )}
          <Link to="/contact" className="footer__link">{t('nav.contact')}</Link>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>{t('footer.copyright').replace('{year}', new Date().getFullYear())}</p>
      </div>
    </footer>
  );
}
