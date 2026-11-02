/**
 * BHDS Lab 홈페이지 ↔ 구글시트 연결 스크립트
 *
 * 하는 일: 구글시트("BHDS 홈페이지 내용")의 각 탭과 homepage 폴더의 사진 목록을
 *          JSON으로 내보냅니다. 홈페이지는 이 웹 앱 주소에서 내용을 읽어 갑니다.
 *
 * 수정 후에는 [배포] → [배포 관리] → 연필(수정) → 버전 "새 버전" → [배포]를 눌러야 반영됩니다.
 * (주소는 그대로 유지됩니다)
 */

const SHEET_ID = '1eQ2ll3Ci79LkvMkF4rd_J6zf1kiIuY7Ng81Rcgw_ei8';   // BHDS 홈페이지 내용
const PHOTO_ROOT_ID = '1mCJVSqfduiq8--WZVvxYtBU7ZEp56wc0';         // homepage 폴더
const TABS = ['홈', '교수소개', '구성원', '연구분야', '연구과제', '논문', '학술발표', '소식', '수업'];
const CACHE_SECONDS = 180;

function doGet(e) {
  const params = (e && e.parameter) || {};
  const cache = CacheService.getScriptCache();
  let json = params.fresh ? null : cache.get('data');
  if (!json) {
    json = JSON.stringify(buildData_());
    if (json.length < 95000) cache.put('data', json, CACHE_SECONDS);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function buildData_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const data = { updated: new Date().toISOString(), sheets: {}, photos: {} };

  TABS.forEach(function (name) {
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    const values = sh.getDataRange().getDisplayValues();
    if (values.length < 2) { data.sheets[name] = []; return; }
    const head = values.shift().map(function (h) { return String(h).trim(); });
    data.sheets[name] = values
      .filter(function (r) { return r.some(function (c) { return String(c).trim() !== ''; }); })
      .map(function (r) {
        const o = {};
        head.forEach(function (h, i) { if (h) o[h] = String(r[i] == null ? '' : r[i]).trim(); });
        return o;
      })
      .filter(function (o) {
        const hidden = String(o['공개'] || '').trim().toUpperCase() === 'N';
        const example = Object.keys(o).some(function (k) { return o[k].indexOf('(예시)') === 0; });
        return !hidden && !example;
      });
  });

  // homepage 폴더 아래 모든 하위 폴더(member, news …)의 이미지: 파일명 → 파일 ID
  const root = DriveApp.getFolderById(PHOTO_ROOT_ID);
  collectPhotos_(root, data.photos);
  const subs = root.getFolders();
  while (subs.hasNext()) collectPhotos_(subs.next(), data.photos);

  return data;
}

function collectPhotos_(folder, out) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    if (String(f.getMimeType()).indexOf('image/') === 0) out[f.getName()] = f.getId();
  }
}

/** 편집기에서 한 번 실행해 권한을 승인하고 결과를 확인하는 용도 */
function test() {
  const d = buildData_();
  Logger.log(Object.keys(d.sheets).map(function (k) { return k + ': ' + d.sheets[k].length; }).join(', '));
  Logger.log('사진: ' + Object.keys(d.photos).join(', '));
}
