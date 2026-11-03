import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSiteData, pick } from '../context/SiteDataContext';
import { formatDate } from '../components/NewsCard';
import Photo from '../components/Photo';
import { FiArrowRight, FiMail, FiMapPin } from 'react-icons/fi';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

/** 히어로 오른쪽: 사진 있는 소식을 자동으로 넘겨 보여줌. 누르면 소식 페이지로.
 *  좌우로 밀거나(터치·마우스 끌기) 트랙패드로 옆으로 스크롤하면 넘어가고, 아래 긴 막대를 눌러 고를 수 있음 */
const SLIDE_MS = 5000;
function HeroNews({ items, lang, t }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ x: 0, moved: false, down: false });
  const wheel = useRef({ sum: 0, lock: 0 });
  const count = items.length;
  const go = (d) => setIdx((i) => (i + d + count) % count);

  // 다음으로 넘어가는 시점은 아래 막대가 다 차는 순간(마우스를 올리면 함께 멈춤)

  const onPointerDown = (e) => { drag.current = { x: e.clientX, moved: false, down: true }; };
  const onPointerUp = (e) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.x;
    drag.current.down = false;
    if (Math.abs(dx) > 40 && count > 1) { drag.current.moved = true; go(dx < 0 ? 1 : -1); }
  };
  const onClick = (e) => { if (drag.current.moved) { e.preventDefault(); drag.current.moved = false; } };
  const onWheel = (e) => {
    if (count < 2 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const now = Date.now();
    if (now < wheel.current.lock) return;
    wheel.current.sum += e.deltaX;
    if (Math.abs(wheel.current.sum) > 40) {
      go(wheel.current.sum > 0 ? 1 : -1);
      wheel.current = { sum: 0, lock: now + 700 };
    }
  };

  const n = items[idx];
  return (
    <div className="hx-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onWheel={onWheel}>
      <Link to="/news" className="hx-slider__link" aria-label={pick(n.title, lang)} draggable={false}
        onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { drag.current.down = false; }} onClick={onClick}>
        <AnimatePresence initial={false}>
          <motion.div key={n.id} className="hx-slider__slide"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}>
            <Photo src={n.photo} alt="" className="hx-hero__img" />
            <div className="hx-slider__shade" />
            <div className="hx-slider__caption">
              <p className="hx-slider__meta">{t(`news.categories.${n.category}`)} · {formatDate(n.date, lang)}</p>
              <h3 className="hx-slider__title">{pick(n.title, lang)}</h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </Link>
      {count > 1 && (
        <div className="hx-slider__bar">
          {items.map((it, i) => (
            <button key={it.id} type="button" aria-label={pick(it.title, lang)}
              className={`hx-slider__seg ${i === idx ? 'is-active' : ''} ${i < idx ? 'is-done' : ''}`} onClick={() => setIdx(i)}>
              <span className="hx-slider__track">
                {i === idx && <span key={idx} className="hx-slider__fill" style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} onAnimationEnd={() => go(1)} />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** 로고 주변 여백을 잘라내고, 가로세로 비율이 달라도 눈으로 보기에 비슷한 크기가 되게 맞춤 */
const LOGO_AREA = 4200; // 로고 하나가 차지하는 넓이(px²) 기준
function useTrimmedLogo(src) {
  const [out, setOut] = useState({ url: src, ratio: 3 });
  useEffect(() => {
    if (!src) return undefined;
    let alive = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      try {
        const w = img.naturalWidth; const h = img.naturalHeight;
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, w, h).data;
        let t = h; let l = w; let b = -1; let r = -1;
        for (let yy = 0; yy < h; yy += 1) {
          for (let xx = 0; xx < w; xx += 1) {
            const i = (yy * w + xx) * 4;
            const blank = d[i + 3] < 20 || (d[i] > 242 && d[i + 1] > 242 && d[i + 2] > 242);
            if (!blank) { if (yy < t) t = yy; if (yy > b) b = yy; if (xx < l) l = xx; if (xx > r) r = xx; }
          }
        }
        if (r < l || b < t) { if (alive) setOut({ url: src, ratio: w / h }); return; }
        const cw = r - l + 1; const ch = b - t + 1;
        const o = document.createElement('canvas'); o.width = cw; o.height = ch;
        o.getContext('2d').drawImage(c, l, t, cw, ch, 0, 0, cw, ch);
        if (alive) setOut({ url: o.toDataURL('image/png'), ratio: cw / ch });
      } catch (e) {
        if (alive) setOut({ url: src, ratio: img.naturalWidth / img.naturalHeight || 3 });
      }
    };
    img.onerror = () => {};
    img.src = src;
    return () => { alive = false; };
  }, [src]);
  return out;
}

function OrgLogo({ src, alt }) {
  const { url, ratio } = useTrimmedLogo(src);
  let h = Math.sqrt(LOGO_AREA / ratio);
  let w = h * ratio;
  if (h > 58) { h = 58; w = h * ratio; }
  if (w > 200) { w = 200; h = w / ratio; }
  return <img className="hx-org__img" src={url} alt={alt} style={{ width: `${w}px`, height: `${h}px` }} referrerPolicy="no-referrer" />;
}

/** 함께한 기관: 한 줄로 흐르며 가운데에서 크고 선명하게, 양옆으로 갈수록 작고 흐리게 (-x² 곡선처럼 살짝 휘어짐) */
function PartnerArc({ orgs, lang }) {
  const box = useRef(null);
  const track = useRef(null);
  const items = useRef([]);
  const hover = useRef(false);
  const reps = 3;
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0; let last = performance.now(); let raf;
    const tick = (now) => {
      const dt = Math.min(now - last, 50); last = now;
      const el = track.current; const b = box.current;
      if (el && b) {
        const setW = el.scrollWidth / reps;
        if (!hover.current && !reduce) x = (x + dt * 0.045) % setW;
        el.style.transform = `translateX(${-x - setW}px)`;
        const half = b.clientWidth / 2;
        const mid = b.getBoundingClientRect().left + half;
        items.current.forEach((it) => {
          if (!it) return;
          const r = it.getBoundingClientRect();
          const d = Math.max(-1.2, Math.min(1.2, (r.left + r.width / 2 - mid) / half));
          const k = Math.max(0, 1 - d * d); // -x² 모양
          it.style.transform = `translateY(${(1 - k) * 34}px) scale(${0.62 + 0.5 * k})`;
          it.style.opacity = String(0.12 + 0.88 * k);
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [orgs.length]);

  const all = Array.from({ length: reps }, () => orgs).flat();
  return (
    <div className="hx-arc" ref={box} onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { hover.current = false; }}>
      <div className="hx-arc__track" ref={track}>
        {all.map((o, i) => (
          <span key={`${o.ko}-${i}`} ref={(el) => { items.current[i] = el; }}
            className={`hx-org ${o.logo ? 'hx-org--logo' : ''}`} aria-hidden={i >= orgs.length} title={pick(o, lang)}>
            {o.logo
              ? <OrgLogo src={o.logo} alt={pick(o, lang)} />
              : <span className="hx-org__name">{pick(o, lang)}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { t, lang } = useLanguage();
  const { home, areas, news, partners } = useSiteData();
  // 영어 화면에서는 영문 이름이 있는 기관만
  const orgs = partners.filter((o) => lang === 'ko' || o.en !== o.ko);
  const photoNews = news.filter((n) => n.photo).slice(0, 6);

  return (
    <div className="home">
      {/* 1. 히어로: 왼쪽 글, 오른쪽 사진 (글이 얼굴을 가리지 않게) */}
      <section className={`hx-hero ${home.heroPhoto ? '' : 'hx-hero--plain'}`}>
        {home.heroPhoto && <Photo src={home.heroPhoto} alt="" className="hx-hero__backdrop" />}
        <div className="hx-hero__shade" />
        <div className="hx-hero__inner container">
          <div className="hx-hero__text">
            <motion.p className="hx-hero__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              {pick(home.school, lang)}
            </motion.p>
            <motion.h1 className="hx-hero__title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              {pick(home.labName, lang)}
            </motion.h1>
            {areas.length > 0 && (
              <motion.p className="hx-hero__areas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}>
                {areas.map((a) => pick(a.title, lang)).join(' · ')}
              </motion.p>
            )}
            <motion.div className="hx-hero__actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}>
              <Link to="/research" className="hx-btn hx-btn--solid">{t('hero.cta')}</Link>
              <Link to="/members" className="hx-btn hx-btn--ghost">{t('hero.ctaSecondary')}</Link>
            </motion.div>
          </div>
          {photoNews.length > 0 ? (
            <motion.div className="hx-hero__photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <HeroNews items={photoNews} lang={lang} t={t} />
            </motion.div>
          ) : home.heroPhoto && (
            <motion.div className="hx-hero__photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <Photo src={home.heroPhoto} alt={pick(home.labName, lang)} className="hx-hero__img" style={{ objectPosition: `center ${home.heroPos}` }} />
            </motion.div>
          )}
        </div>
      </section>

      {/* 1-2. 연구실 소개 */}
      <section className="hx-intro container">
        <motion.div className="hx-intro__head" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {t('home.eyebrowAbout') && <p className="hx-eyebrow">{t('home.eyebrowAbout')}</p>}
          <h2 className="hx-intro__title">
            {pick(home.labName, lang)}
          </h2>
        </motion.div>
        <motion.div className="hx-intro__body" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
          <p className="hx-intro__text">{pick(home.intro, lang)}</p>
          <dl className="hx-intro__facts">
            <div><dt>{t('home.pi')}</dt><dd>{pick(home.pi, lang)}</dd></div>
            <div><dt>{t('home.affiliation')}</dt><dd>{pick(home.affiliation, lang)}</dd></div>
          </dl>
          <Link to="/about" className="hx-more">{t('nav.about')} <FiArrowRight /></Link>
        </motion.div>
      </section>

      {/* 2. 연구 분야 */}
      <section className="hx-research">
        <div className="container">
          <h2 className="hx-section-title hx-center">{t('nav.areas')}</h2>
          <div className="hx-research__grid">
            {areas.map((a, i) => (
              <motion.div key={a.id} className="hx-area" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <span className="hx-area__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="hx-area__title">{pick(a.title, lang)}</h3>
                <p className="hx-area__desc">{pick(a.description, lang)}</p>
              </motion.div>
            ))}
          </div>
          <div className="hx-center"><Link to="/research/areas" className="hx-more">{t('home.viewAll')} <FiArrowRight /></Link></div>
        </div>
      </section>

      {/* 3. 함께한 기관 — 옆으로 천천히 흐르는 띠 (로고는 드라이브 logo 폴더에 '기관명.png'로 올리면 표시) */}
      {orgs.length > 0 && (
        <section className="hx-partners">
          <h2 className="hx-section-title hx-center">{t('home.partnersTitle')}</h2>
          <PartnerArc orgs={orgs} lang={lang} />
        </section>
      )}

      {/* 4. 연락처 */}
      <section className="hx-contact">
        <div className="container hx-contact__inner">
          <div>
            <h2 className="hx-section-title">{t('nav.contact')}</h2>
            <dl className="hx-contact__list">
              <div><dt><FiMapPin /> {t('contact.address')}</dt><dd>{pick(home.address, lang) || t('contact.addressDetail')}</dd></div>
              {home.email && <div><dt><FiMail /> {t('contact.email')}</dt><dd><a href={`mailto:${home.email}`}>{home.email}</a></dd></div>}
            </dl>
          </div>
          <div className="hx-contact__recruit">
            <h3 className="hx-contact__recruit-title">{pick(home.recruitTitle, lang) || t('contact.prospective')}</h3>
            {home.recruitRoles[lang]?.length > 0 && (
              <ul className="hx-contact__roles">{home.recruitRoles[lang].map((r) => <li key={r}>{r}</li>)}</ul>
            )}
            <div className="hx-contact__actions">
              {home.email && <a href={`mailto:${home.email}`} className="hx-btn hx-btn--solid"><FiMail /> {t('contact.applyButton')}</a>}
              <Link to="/contact" className="hx-btn hx-btn--line">{t('contact.locationTitle')} <FiArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
