# BHDS Lab 홈페이지 — 관리 & 인수인계 매뉴얼

연세대학교 **바이오헬스 데이터사이언스 연구실 (Biostatistics & Health Data Science Lab, 박소희 교수님 연구실)** 홈페이지 소스코드입니다.
주소: https://bhds-lab-ashy.vercel.app

**내용 수정에는 코드가 필요 없습니다.** 모든 내용은 구글 드라이브의 시트와 사진 폴더에서 옵니다.

---

## 1. 내용 수정하기 (가장 자주 쓰임)

1. 공유드라이브 `homepage` 폴더의 구글시트 **"BHDS 홈페이지 내용"** 을 엽니다.
2. 해당 탭을 고칩니다. 시트 첫 탭 **사용법** 에 작성 규칙이 정리돼 있습니다.
3. 몇 분 안에 홈페이지에 반영됩니다. (새로고침하면 보입니다. 최대 약 3분 지연)

| 탭 | 홈페이지에서 나오는 곳 |
|---|---|
| 홈 | 첫 화면 문구, 연구실 소개, 모집 문구, 연락처 이메일 |
| 교수소개 | 교수 소개 페이지 (기본정보·학력·경력·학회활동·초청강연·수상) |
| 구성원 | 구성원 페이지 |
| 연구분야 / 연구과제 | 연구 페이지 |
| 논문 / 학술발표 | 논문·발표 페이지 (탭 2개) |
| 소식 | 홈 화면 최근 소식, 소식 페이지 |
| 수업 | 수업 페이지 |

**사진**: `homepage/member`(구성원·교수님), `homepage/news`(소식) 폴더에 올리고, 시트의 `사진파일명` 칸에 파일 이름을 그대로 적습니다.

> 주의: 탭 이름과 각 탭 첫 줄(열 제목)은 바꾸지 마세요. 사이트가 이 이름으로 내용을 찾습니다.
> 숨기고 싶은 줄은 `공개` 칸에 `N`을 적으면 됩니다.

---

## 2. 어떻게 연결돼 있나

```
구글시트 + 드라이브 사진 폴더
        │  (Apps Script 웹 앱: "BHDS 홈페이지 연결")
        ▼
 JSON 주소 (src/config.js 의 SHEET_API_URL)
        │  방문자 브라우저가 페이지를 열 때 읽어 옴
        ▼
 홈페이지 (GitHub → Vercel 자동 배포)
```

- **Apps Script**: 코드 사본은 `apps-script/Code.gs`. script.google.com 에서 "BHDS 홈페이지 연결" 프로젝트로 관리됩니다.
  스크립트를 고친 뒤에는 **배포 → 배포 관리 → 수정(연필) → 버전: 새 버전 → 배포** 를 눌러야 반영됩니다. (주소는 그대로)
- **안전장치**: 시트가 잠시 응답하지 않으면, 방문자 브라우저에 저장된 마지막 내용 → 없으면 `src/data/snapshot.json` 을 보여줍니다.
  `snapshot.json` 은 Vercel 배포 때마다 시트에서 자동으로 새로 받아옵니다(`scripts/refresh-snapshot.mjs`).
- **사진 주소**: 드라이브 파일 ID로 `lh3.googleusercontent.com` 이미지를 불러옵니다. `homepage` 폴더가 "링크가 있는 모든 사용자 — 보기"로 공유돼 있어야 합니다.

---

## 3. 코드 구조 (개발자용)

```
src/
├── config.js                    # 시트 연결 주소, 사진 주소 규칙
├── context/SiteDataContext.jsx  # 시트 내용 불러오기·정리 (탭 → 화면용 데이터)
├── context/LanguageContext.jsx  # 한국어/영어 전환 (기본 한국어)
├── i18n/ko.json, en.json        # 메뉴·버튼 등 고정 문구
├── data/snapshot.json           # 시트 내용 백업본 (자동 갱신)
├── pages/                       # Home, About(교수), Members, Research, Publications, Teaching, News, Contact
└── components/
apps-script/Code.gs              # 시트 → JSON 스크립트 사본
```

```bash
npm install
npm run dev     # 로컬 개발 서버
npm run build   # 배포용 빌드 (빌드 전에 snapshot 자동 갱신)
```

---

## 4. 인수인계 체크리스트

- [ ] 공유드라이브 `homepage` 폴더(시트·사진) 편집 권한
- [ ] Apps Script 프로젝트 "BHDS 홈페이지 연결" 소유자/편집자 (만든 사람 계정으로 실행됨 — 담당자가 바뀌면 새 담당자 계정으로 다시 배포하고 `src/config.js` 주소 교체)
- [ ] GitHub 저장소 / Vercel 프로젝트 권한
- [ ] 연세대학교 도메인 연결이 필요하면 학교 전산원에 CNAME 등록 요청

*2026-11 Google Sites(BHDS)의 내용과 사진을 시트로 옮기고, 시트 연동 구조로 변경.*
