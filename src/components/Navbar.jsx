import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import './Navbar.css';

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about'), children: [
      { to: '/about', label: t('nav.profile') },
      { to: '/teaching', label: t('nav.teaching') },
    ] },
    { to: '/research', label: t('nav.research'), children: [
      { to: '/research#areas', label: t('nav.areas') },
      { to: '/research#projects', label: t('nav.projects') },
      { to: '/publications', label: t('nav.papers') },
      { to: '/publications?tab=presentations', label: t('nav.presentations') },
    ] },
    { to: '/members', label: t('nav.members') },
    { to: '/news', label: t('nav.news') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isGroupActive = (link) =>
    (link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)) ||
    (link.children || []).some((c) => location.pathname === c.to.split(/[?#]/)[0]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${!scrolled && location.pathname === '/' ? 'navbar--on-photo' : ''}`}>
      <div className="navbar__inner container">
        <NavLink to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <circle cx="16" cy="10" r="3" fill="currentColor" opacity="0.8" />
              <circle cx="10" cy="20" r="3" fill="currentColor" opacity="0.6" />
              <circle cx="22" cy="20" r="3" fill="currentColor" opacity="0.6" />
              <line x1="16" y1="13" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="16" y1="13" x2="22" y2="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="10" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
          <span className="navbar__logo-text">BHDS Lab</span>
        </NavLink>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {links.map((link) => (
            <div key={link.to} className={`navbar__item ${link.children ? 'navbar__item--has-sub' : ''}`}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={`navbar__link ${isGroupActive(link) ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </NavLink>
              {link.children && (
                <div className="navbar__sub">
                  <div className="navbar__sub-panel">
                    {link.children.map((c) => (
                      <Link key={c.to} to={c.to} className="navbar__sublink">{c.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            className="navbar__lang"
            onClick={toggleLang}
            aria-label="Toggle language"
          >
            <span className={lang === 'en' ? 'navbar__lang-active' : ''}>EN</span>
            <span className="navbar__lang-divider">|</span>
            <span className={lang === 'ko' ? 'navbar__lang-active' : ''}>KR</span>
          </button>
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {mobileOpen && <div className="navbar__overlay" onClick={() => setMobileOpen(false)} />}
    </nav>
  );
}
