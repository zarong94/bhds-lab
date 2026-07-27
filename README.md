# 🎓 연세대학교 융합보건의료대학원 — BHDS Lab 홈페이지 관리 & 인수인계 매뉴얼

본 프로젝트는 연세대학교 융합보건의료대학원 **Bio-Health Data Science Lab (BHDS Lab / 박소희 교수님 연구실)** 공식 홈페이지 소스코드입니다.

인수인계를 받는 다음 연구실 담당자는 본 문서를 참고하여 5분 만에 홈페이지 소식 및 논문, 구성원 정보를 업데이트할 수 있습니다.

---

## 📁 1. 핵심 파일 구조 한눈에 보기

코드를 몰라도 **`src/data/`** 폴더 안의 데이터 파일만 수정하면 웹사이트의 모든 내용이 자동으로 업데이트됩니다.

```
lab-website/
├── src/
│   ├── data/
│   │   ├── publications.json   # 📄 논문 목록 & BibTeX
│   │   ├── members.json        # 👥 연구실 구성원 (교수, 박사, 석사, 졸업생)
│   │   ├── news.json           # 🏆 학생 수상, 연구실 소식, 공지사항
│   │   └── research.json       # 🔬 주요 연구 분야
│   ├── i18n/
│   │   ├── ko.json             # 🇰🇷 한국어 텍스트 (교수 소개, 사이트 문구)
│   │   └── en.json             # 🇺🇸 영어 텍스트 (기본값)
│   └── index.css               # 🎨 메인 디자인 색상 (연세 블루 등)
└── README.md                   # 📖 본 인수인계 매뉴얼
```

---

## ✏️ 2. 홈페이지 콘텐츠 업데이트 방법 (가장 자주 쓰임)

### 📄 A. 새로운 논문 추가하기 (`src/data/publications.json`)
파일 맨 위에 아래 양식으로 한 덩어리를 추가합니다:

```json
{
  "id": 11,
  "title": "논문 제목 입력 (Deep Learning in Bio-Health)",
  "authors": ["H. Lee", "S. Park"],
  "venue": "Journal of Biomedical Informatics",
  "year": 2026,
  "type": "journal",
  "doi": "https://doi.org/10.1016/j.jbi.2026.0000",
  "bibtex": "@article{...}"
}
```
* `type`: 저널 논문은 `"journal"`, 학회 논문은 `"conference"`로 적습니다.

---

### 👥 B. 신입생 / 졸업생 등록하기 (`src/data/members.json`)

#### 1) 신입생 추가 (석사/박사)
`"phd"` 또는 `"ms"` 항목에 아래 양식으로 추가합니다:

```json
{
  "name": { "en": "Hong Gildong", "ko": "홍길동" },
  "role": { "en": "M.S. Student (2026 –)", "ko": "석사과정 (2026 –)" },
  "email": "gildong@yonsei.ac.kr",
  "interests": { 
    "en": ["Medical AI", "EHR Analysis"], 
    "ko": ["의료 AI", "전자건강기록 분석"] 
  }
}
```

#### 2) 학생 졸업 시 (Alumni로 이동)
`"alumni"` 항목에 아래 양식으로 추가합니다:

```json
{
  "name": { "en": "Hong Gildong", "ko": "홍길동" },
  "role": { "en": "M.S. (2024 – 2026)", "ko": "석사 (2024 – 2026)" },
  "currentPosition": { "en": "Researcher, Naver Healthcare", "ko": "네이버 헬스케어 연구원" }
}
```

---

### 🏆 C. 학생 수상 & 소식 등록하기 (`src/data/news.json`)

`news.json` 맨 위에 새로운 소식을 추가합니다:

```json
{
  "id": 9,
  "category": "award",
  "date": "2026-08-01",
  "title": {
    "en": "Hong Gildong wins Best Student Paper Award",
    "ko": "홍길동 학생, 2026 우수논문상 수상"
  },
  "description": {
    "en": "M.S. student Hong Gildong received the Best Student Paper Award...",
    "ko": "석사과정 홍길동 학생이 우수논문상을 수상했습니다."
  }
}
```
* `category`: `"award"`(수상), `"publication"`(논문발표), `"event"`(행사), `"announcement"`(공지) 중 하나를 입력합니다.

---

## 🌐 3. 인터넷에 24시간 무료로 공개(배포)하는 방법

이 사이트는 **GitHub + Vercel** (또는 GitHub Pages) 조합으로 배포하면 **컴퓨터를 끌 필요 없이 24시간 무료 유지**됩니다.

### 🌟 초간단 자동 배포 세팅법 (최초 1회만 설정)
1. **GitHub**에 연구실 공용 저장소(Repository)를 만들고 이 소스코드를 올려둡니다.
2. [Vercel.com](https://vercel.com) 회원가입 후 **[Import Project]**를 눌러 GitHub 저장소를 연결합니다.
3. 배포 버튼을 누르면 1분 만에 `https://bhds-lab.vercel.app` 과 같은 무료 24시간 주소가 생성됩니다.

### 🔄 배포 완료 후 일상적인 업데이트 절차
웹 브라우저로 [GitHub.com](https://github.com) 접속 ➔ `src/data/` 폴더에서 파일 선택 ➔ **✏️ Edit (수정)** 버튼 클릭 ➔ 텍스트 수정 후 **[Commit changes]** 저장 ➔ **Vercel이 30초 안에 자동으로 실시간 홈페이지 반영!**

---

## 💻 4. 개발 및 빌드 명령어 (개발자용)

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행 (테스트용)
npm run dev

# 3. 배포용 정적 빌드 테스트
npm run build
```

---

## 🔑 5. 후임 담당자 인수인계 체크리스트

- [ ] 연구실 공용 GitHub 계정 아이디/비밀번호 전달
- [ ] Vercel (또는 호스팅 서비스) 계정 권한 이전
- [ ] 연세대학교 공식 도메인(`*.yonsei.ac.kr`) 연동 필요 시 학교 전산원에 CNAME 레코드 등록 요청

---
*제작일: 2026년 7월 | Bio-Health Data Science Lab, Yonsei University*
