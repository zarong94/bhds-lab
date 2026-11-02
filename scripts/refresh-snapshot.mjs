// 빌드(배포) 직전에 구글시트의 최신 내용을 받아 src/data/snapshot.json 을 갱신합니다.
// 실패해도 빌드는 계속되고, 기존 snapshot.json 이 그대로 쓰입니다.
import { readFileSync, writeFileSync } from 'node:fs';

const config = readFileSync(new URL('../src/config.js', import.meta.url), 'utf8');
const url = (config.match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+\/exec/) || [])[0];
const out = new URL('../src/data/snapshot.json', import.meta.url);

if (!url) {
  console.log('[snapshot] SHEET_API_URL not set, skipping');
  process.exit(0);
}

try {
  const res = await fetch(url + '?fresh=1', { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const d = await res.json();
  if (!d.sheets || !Array.isArray(d.sheets['구성원']) || !d.sheets['구성원'].length) throw new Error('unexpected shape');
  const compact = { updated: d.updated, photos: d.photos || {}, sheets: {} };
  for (const [name, rows] of Object.entries(d.sheets)) {
    const h = rows.length ? Object.keys(rows[0]) : [];
    compact.sheets[name] = { h, r: rows.map((o) => h.map((k) => o[k])) };
  }
  writeFileSync(out, JSON.stringify(compact));
  console.log('[snapshot] updated from sheet:', Object.keys(compact.sheets).join(', '));
} catch (e) {
  console.log('[snapshot] could not refresh (' + e.message + '), keeping existing snapshot');
}
