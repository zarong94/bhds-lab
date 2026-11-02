import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import PageHero from '../components/PageHero';
import { FiSearch, FiExternalLink, FiCopy, FiCheck, FiAward, FiArrowUpRight } from 'react-icons/fi';
import { SiGooglescholar } from 'react-icons/si';
import './Publications.css';

const HIGHLIGHT = /\b(Park S)\b(?=[,.]|$)/g;

function Authors({ text }) {
  const parts = text.split(HIGHLIGHT);
  return parts.map((p, i) => (p === 'Park S' ? <strong key={i} className="publications__author--highlight">{p}</strong> : <span key={i}>{p}</span>));
}

const ROLE_EN = { '교신저자': 'Corresponding', '제1저자': 'First author', '공동저자': 'Co-author' };

function Papers() {
  const { t, lang } = useLanguage();
  const { pubs } = useSiteData();
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('all');
  const [role, setRole] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const years = useMemo(() => [...new Set(pubs.map((p) => p.year))].sort((a, b) => b.localeCompare(a)), [pubs]);
  const roles = useMemo(() => [...new Set(pubs.map((p) => p.role).filter(Boolean))], [pubs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pubs.filter((p) =>
      (!q || [p.title, p.authors, p.journal].some((x) => x.toLowerCase().includes(q))) &&
      (year === 'all' || p.year === year) &&
      (role === 'all' || p.role === role));
  }, [pubs, search, year, role]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((p) => { (g[p.year] = g[p.year] || []).push(p); });
    return Object.entries(g).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const copy = (p) => {
    navigator.clipboard?.writeText(p.bibtex).then(() => {
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  };

  return (
    <>
      <div className="publications__filters">
        <div className="publications__search">
          <FiSearch className="publications__search-icon" />
          <input type="text" placeholder={t('publications.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="publications__search-input" aria-label={t('publications.searchPlaceholder')} />
        </div>
        <div className="publications__filter-group">
          <select value={year} onChange={(e) => setYear(e.target.value)} className="publications__select" aria-label={t('publications.allYears')}>
            <option value="all">{t('publications.allYears')}</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {roles.length > 1 && (
            <select value={role} onChange={(e) => setRole(e.target.value)} className="publications__select" aria-label={t('publications.allRoles')}>
              <option value="all">{t('publications.allRoles')}</option>
              {roles.map((r) => <option key={r} value={r}>{lang === 'ko' ? r : ROLE_EN[r] || r}</option>)}
            </select>
          )}
        </div>
      </div>
      <p className="publications__count">{t('publications.total').replace('{n}', filtered.length)}</p>

      <div className="publications__list">
        {grouped.length === 0 && <div className="publications__empty">{t('publications.noResults')}</div>}
        {grouped.map(([y, list]) => (
          <div key={y} className="publications__year-group">
            <h2 className="publications__year">{y}</h2>
            {list.map((p) => (
              <div key={p.id} className="publications__item">
                <div className="publications__item-content">
                  <h3 className="publications__item-title">
                    {p.doi ? <a href={p.doi} target="_blank" rel="noopener noreferrer">{p.title}</a> : p.title}
                  </h3>
                  <p className="publications__item-authors"><Authors text={p.authors} /></p>
                  <p className="publications__item-venue">
                    <em>{p.journal}</em>{p.citation ? `. ${p.citation}` : ''}
                    {p.role && <span className={`publications__role publications__role--${p.role === '공동저자' ? 'co' : 'lead'}`}>{lang === 'ko' ? p.role : ROLE_EN[p.role] || p.role}</span>}
                  </p>
                </div>
                <div className="publications__item-actions">
                  {p.doi && <a href={p.doi} target="_blank" rel="noopener noreferrer" className="publications__action-btn" title="DOI"><FiExternalLink /></a>}
                  {p.bibtex && (
                    <button className="publications__action-btn" onClick={() => copy(p)} title={t('publications.copyBibtex')}>
                      {copiedId === p.id ? <FiCheck style={{ color: '#38A169' }} /> : <FiCopy />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Presentations() {
  const { t, lang } = useLanguage();
  const { presentations } = useSiteData();
  const groups = [['oral', t('publications.oral')], ['poster', t('publications.poster')]];

  return (
    <div className="publications__list">
      {groups.map(([type, label]) => {
        const list = presentations.filter((p) => p.type === type);
        if (!list.length) return null;
        const byYear = list.reduce((acc, p) => { const y = p.date.slice(0, 4); (acc[y] = acc[y] || []).push(p); return acc; }, {});
        return (
          <section key={type} className="pres-group">
            <h2 className="pres-group__title">{label}</h2>
            {Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)).map(([y, items]) => (
              <div key={y} className="publications__year-group">
                <h3 className="publications__year">{y}</h3>
                {items.map((p) => (
                  <div key={p.id} className="publications__item">
                    <div className="publications__item-content">
                      <h4 className="publications__item-title">{pick(p.title, lang)}</h4>
                      <p className="publications__item-authors"><strong>{pick(p.presenter, lang)}</strong> · {pick(p.conference, lang)}</p>
                      <p className="publications__item-venue">
                        {p.date}
                        {p.award.ko && <span className="pres__award"><FiAward /> {pick(p.award, lang)}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

export default function Publications() {
  const { t } = useLanguage();
  const { home } = useSiteData();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'presentations' ? 'presentations' : 'papers';

  return (
    <div className="publications">
      <PageHero title={t('publications.title')} />
      <div className="container">
        {home.scholar && (
          <a className="pub-scholar" href={home.scholar} target="_blank" rel="noopener noreferrer">
            <SiGooglescholar /> {t('publications.scholar')} <FiArrowUpRight />
          </a>
        )}
        <div className="pub-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'papers'} className={`pub-tabs__tab ${tab === 'papers' ? 'is-active' : ''}`} onClick={() => setParams({})}>
            {t('publications.tabPapers')}
          </button>
          <button role="tab" aria-selected={tab === 'presentations'} className={`pub-tabs__tab ${tab === 'presentations' ? 'is-active' : ''}`} onClick={() => setParams({ tab: 'presentations' })}>
            {t('publications.tabPresentations')}
          </button>
        </div>
        {tab === 'papers' ? <Papers /> : <Presentations />}
      </div>
    </div>
  );
}
