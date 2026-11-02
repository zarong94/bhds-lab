import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SHEET_API_URL, photoUrl } from '../config';
import snapshotCompact from '../data/snapshot.json';

/*
 * 사이트 내용은 구글시트("BHDS 홈페이지 내용")에서 옵니다.
 *  1) 먼저 브라우저에 저장된 마지막 내용(없으면 빌드 때 넣어둔 snapshot.json)으로 바로 화면을 그리고
 *  2) 시트 주소에서 최신 내용을 받아오면 교체합니다.
 *  시트가 잠시 응답하지 않거나 형식이 깨져도 마지막 정상 내용이 그대로 보입니다.
 */

const STORAGE_KEY = 'bhds-site-data-v1';

// snapshot.json은 용량을 줄이려고 {h: 열 제목, r: 행들} 형태로 저장돼 있어요.
function expand(compact) {
  const sheets = {};
  Object.entries(compact.sheets || {}).forEach(([name, t]) => {
    sheets[name] = Array.isArray(t) ? t : (t.r || []).map((row) => Object.fromEntries((t.h || []).map((h, i) => [h, row[i]])));
  });
  return { ...compact, sheets };
}
const snapshot = expand(snapshotCompact);
const SiteDataContext = createContext(null);

const isValid = (d) =>
  d && typeof d === 'object' && d.sheets && typeof d.sheets === 'object' &&
  Array.isArray(d.sheets['구성원']) && d.sheets['구성원'].length > 0;

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const d = raw ? JSON.parse(raw) : null;
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

function store(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* storage unavailable */ }
}

/* ── helpers ── */
const s = (v) => (v == null ? '' : String(v).trim());
const list = (v) => s(v).split(/\s*,\s*/).filter(Boolean);
const num = (v, fallback = 9999) => {
  const n = parseFloat(s(v));
  return Number.isFinite(n) ? n : fallback;
};
const bi = (ko, en) => ({ ko: s(ko), en: s(en) || s(ko) });
const dateKey = (v) => s(v).replace(/[./]/g, '-');

const MEMBER_GROUPS = {
  '교수': 'professor',
  '박사후연구원': 'postdoc',
  '연구교수': 'postdoc',
  '연구원': 'researcher',
  '박사과정': 'phd',
  '석박사통합과정': 'phd',
  '석사과정': 'ms',
  '학부연구생': 'undergraduate',
  '졸업생': 'alumni',
};

const NEWS_CATEGORIES = { '수상': 'award', '논문': 'publication', '행사': 'event', '공지': 'announcement' };

export function normalize(raw) {
  const sh = raw.sheets || {};
  const photos = raw.photos || {};
  const photo = (name, w) => photoUrl(photos[s(name)], w);
  const rows = (name) => (Array.isArray(sh[name]) ? sh[name] : []);

  // 홈
  const homeMap = {};
  rows('홈').forEach((r) => { homeMap[s(r['항목'])] = bi(r['내용'], r['내용(영문)']); });
  const H = (k) => homeMap[k] || bi('', '');
  const home = {
    labName: H('연구실 이름'),
    short: H('약칭'),
    school: H('학교'),
    tagline: H('한 줄 소개'),
    intro: H('연구실 소개'),
    pi: H('연구책임자'),
    affiliation: H('소속'),
    keywords: list(H('키워드').ko),
    recruitTitle: H('모집 제목'),
    recruitText: H('모집 문구'),
    email: H('연락처 이메일').ko,
    scholar: H('구글스칼라').ko,
    address: H('주소'),
    recruitRoles: { ko: list(H('모집 분야').ko), en: list(H('모집 분야').en) },
  };

  // 교수소개
  const prof = { info: {}, education: [], career: [], service: [], talks: [], awards: [] };
  const careerGroups = new Map();
  const talkYears = new Map();
  rows('교수소개').forEach((r) => {
    const kind = s(r['구분']);
    const group = s(r['그룹']);
    const item = { text: s(r['내용']), period: s(r['기간·날짜']), venue: s(r['기관·행사']), note: s(r['비고']) };
    if (kind === '기본정보') prof.info[group] = item.text;
    else if (kind === '학력') prof.education.push(item);
    else if (kind === '경력') {
      if (!careerGroups.has(group)) careerGroups.set(group, []);
      careerGroups.get(group).push(item);
    } else if (kind === '학회활동') prof.service.push(item);
    else if (kind === '초청강연') {
      const y = group || item.period.slice(0, 4);
      if (!talkYears.has(y)) talkYears.set(y, []);
      talkYears.get(y).push(item);
    } else if (kind === '수상') prof.awards.push(item);
  });
  prof.career = [...careerGroups].map(([group, items]) => ({ group, items }));
  prof.talks = [...talkYears].sort(([a], [b]) => b.localeCompare(a)).map(([year, items]) => ({ year, items }));
  const pi = prof.info;
  prof.name = bi(pi['이름'], pi['영문이름']);
  prof.title = bi(pi['직위'], pi['직위(영문)']);
  prof.affiliation = bi(pi['소속'], pi['소속(영문)']);
  prof.email = s(pi['이메일']);
  prof.photo = photo(pi['사진파일명'], 800);

  // 구성원
  const members = { professor: [], postdoc: [], researcher: [], phd: [], ms: [], undergraduate: [], alumni: [] };
  rows('구성원').forEach((r, i) => {
    const key = MEMBER_GROUPS[s(r['구분'])] || 'researcher';
    members[key].push({
      id: `${key}-${i}`,
      name: bi(r['이름'], r['이름(영문)']),
      role: bi(r['직함'], r['직함(영문)']),
      email: s(r['이메일']),
      interests: { ko: list(r['관심분야']), en: list(r['관심분야(영문)']).length ? list(r['관심분야(영문)']) : list(r['관심분야']) },
      current: bi(r['현재소속(졸업생)'], r['현재소속(영문)']),
      photo: photo(r['사진파일명'], 600),
      scholar: s(r['구글스칼라']),
      website: s(r['홈페이지']),
      school: s(r['대학원']),
      order: num(r['순서'], 1000 + i),
    });
  });
  Object.values(members).forEach((arr) => arr.sort((a, b) => a.order - b.order));

  // 연구분야
  const areas = rows('연구분야')
    .map((r, i) => ({
      id: `area-${i}`,
      title: bi(r['제목'], r['제목(영문)']),
      description: bi(r['설명'], r['설명(영문)']),
      keywords: list(r['키워드']),
      icon: s(r['아이콘']) || 'chart',
      order: num(r['순서'], 1000 + i),
    }))
    .sort((a, b) => a.order - b.order);

  // 연구과제
  const projects = rows('연구과제').map((r, i) => ({
    id: `proj-${i}`,
    ongoing: s(r['상태']) === '진행중',
    title: s(r['과제명']),
    agency: s(r['지원기관']),
    period: s(r['기간']),
    role: s(r['역할']),
    start: dateKey(s(r['기간']).slice(0, 7)),
  })).sort((a, b) => b.start.localeCompare(a.start));

  // 논문
  const pubs = rows('논문').map((r, i) => ({
    id: `pub-${i}`,
    year: s(r['연도']),
    authors: s(r['저자']),
    title: s(r['제목']),
    journal: s(r['학술지']),
    citation: s(r['서지정보']),
    doi: s(r['DOI·링크']),
    role: s(r['저자역할']),
    type: s(r['구분']) === '학회' ? 'conference' : 'journal',
    bibtex: s(r['BibTeX']),
  })).sort((a, b) => b.year.localeCompare(a.year));

  // 학술발표
  const presentations = rows('학술발표').map((r, i) => ({
    id: `pres-${i}`,
    type: s(r['구분']) === '구연' ? 'oral' : 'poster',
    date: dateKey(r['날짜']),
    title: s(r['제목']),
    presenter: s(r['발표자']),
    conference: s(r['학회']),
    award: s(r['수상']),
  })).sort((a, b) => b.date.localeCompare(a.date));

  // 소식
  const news = rows('소식').map((r, i) => ({
    id: `news-${i}`,
    date: dateKey(r['날짜']),
    category: NEWS_CATEGORIES[s(r['분류'])] || 'announcement',
    title: bi(r['제목'], r['제목(영문)']),
    description: bi(r['내용'], r['내용(영문)']),
    photo: photo(r['사진파일명'], 1000),
  })).sort((a, b) => b.date.localeCompare(a.date));

  // 수업
  const courseGroups = new Map();
  rows('수업').forEach((r) => {
    const key = s(r['대학원']) + '|' + s(r['전공']);
    if (!courseGroups.has(key)) {
      courseGroups.set(key, { school: bi(r['대학원'], r['대학원(영문)']), major: s(r['전공']), link: s(r['전공소개 링크']), courses: [] });
    }
    courseGroups.get(key).courses.push({ code: s(r['과목코드']), name: s(r['과목명']) });
  });
  const teaching = [...courseGroups.values()];

  return { home, prof, members, areas, projects, pubs, presentations, news, teaching, updated: raw.updated };
}

export function SiteDataProvider({ children }) {
  const [raw, setRaw] = useState(() => readStored() || snapshot);

  useEffect(() => {
    if (!SHEET_API_URL) return undefined;
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    fetch(SHEET_API_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then((d) => {
        if (cancelled || !isValid(d)) return;
        normalize(d); // throws if the sheet shape is broken → keep previous data
        setRaw(d);
        store(d);
      })
      .catch(() => { /* keep last good data */ })
      .finally(() => clearTimeout(timer));
    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, []);

  const data = useMemo(() => {
    try { return normalize(raw); } catch { return normalize(snapshot); }
  }, [raw]);

  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}

/** 언어별 텍스트 고르기: {ko, en} → 현재 언어 (비어 있으면 한국어) */
export const pick = (obj, lang) => (obj ? obj[lang] || obj.ko || obj.en || '' : '');
