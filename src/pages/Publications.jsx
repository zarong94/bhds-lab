import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import publications from '../data/publications.json';
import { FiSearch, FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi';
import './Publications.css';

export default function Publications() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const years = useMemo(() => {
    const y = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
    return y;
  }, []);

  const filtered = useMemo(() => {
    return publications.filter((pub) => {
      const matchSearch =
        !search ||
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        pub.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        pub.venue.toLowerCase().includes(search.toLowerCase());
      const matchYear = yearFilter === 'all' || pub.year === Number(yearFilter);
      const matchType = typeFilter === 'all' || pub.type === typeFilter;
      return matchSearch && matchYear && matchType;
    });
  }, [search, yearFilter, typeFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((pub) => {
      if (!groups[pub.year]) groups[pub.year] = [];
      groups[pub.year].push(pub);
    });
    return Object.entries(groups).sort(([a], [b]) => b - a);
  }, [filtered]);

  const handleCopy = (pub) => {
    navigator.clipboard.writeText(pub.bibtex);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="publications">
      <div className="publications__hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('publications.title')}
          </motion.h1>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('publications.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="publications__filters">
          <div className="publications__search">
            <FiSearch className="publications__search-icon" />
            <input
              type="text"
              placeholder={t('publications.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="publications__search-input"
              id="publication-search"
            />
          </div>
          <div className="publications__filter-group">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="publications__select"
              id="year-filter"
            >
              <option value="all">{t('publications.allYears')}</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="publications__select"
              id="type-filter"
            >
              <option value="all">{t('publications.allTypes')}</option>
              <option value="journal">{t('publications.journal')}</option>
              <option value="conference">{t('publications.conference')}</option>
            </select>
          </div>
        </div>

        {/* Publication List */}
        <div className="publications__list">
          {grouped.length === 0 && (
            <div className="publications__empty">{t('publications.noResults')}</div>
          )}
          {grouped.map(([year, pubs]) => (
            <div key={year} className="publications__year-group">
              <h2 className="publications__year">{year}</h2>
              {pubs.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  className="publications__item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="publications__item-type">
                    <span className={`publications__type-badge publications__type-badge--${pub.type}`}>
                      {pub.type === 'journal' ? 'J' : 'C'}
                    </span>
                  </div>
                  <div className="publications__item-content">
                    <h3 className="publications__item-title">{pub.title}</h3>
                    <p className="publications__item-authors">
                      {pub.authors.map((author, idx) => (
                        <span key={idx}>
                          <span className={author === 'S. Park' ? 'publications__author--highlight' : ''}>
                            {author}
                          </span>
                          {idx < pub.authors.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                    <p className="publications__item-venue">{pub.venue}</p>
                  </div>
                  <div className="publications__item-actions">
                    {pub.doi && (
                      <a
                        href={pub.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="publications__action-btn"
                        title="Open DOI"
                      >
                        <FiExternalLink />
                      </a>
                    )}
                    <button
                      className="publications__action-btn"
                      onClick={() => handleCopy(pub)}
                      title={t('publications.copyBibtex')}
                    >
                      {copiedId === pub.id ? <FiCheck style={{ color: '#38A169' }} /> : <FiCopy />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
