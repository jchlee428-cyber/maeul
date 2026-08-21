# 🌿 마을지기 (Maeul-Jigi) AI 시스템

> **따뜻한 인공지능 기반 지역사회 문제 해결 및 공공데이터 연계 플랫폼**  
> 공공데이터포털(data.go.kr) 공식 API 및 지자체 고시 기반 10단계 복지/생활 지원 솔루션

---

## ✨ 핵심 기능

1. **지능형 질문 라우팅 (Smart Routing Engine)**
   - **단순 질의**: 0.1초 즉시 대화형 챗봇 말풍선 (구리·남양주 전역 60여 개 초·중·고교, 보건소, 수도/가스, 버스/지하철, 관공서 직통 연락처).
   - **복합 위기 상담**: 공공데이터 원문 기반 10단계 맞춤형 지원 계획 생성 + **[이 서비스에 도움 요청하기]** 연계.

2. **공공데이터포털 및 지자체 API 연동**
   - 재정경제부 공공기관 정보 조회 서비스 OpenAPI
   - 남양주시청 공공요금 및 생활물가 공식 고시
   - 남양주시청 관내 기관단체(복지재단, 노인복지관, 희망케어센터) 현황
   - 서울시 열린데이터광장 실시간 지하철 도착정보 OpenAPI (경의중앙선, 경춘선, 8호선 별내선, 4호선 진접선)
   - 행정안전부 한국지역정보개발원 전국 초정밀버스 실시간 위치 정보 (땡큐버스 10~90번, M2316 등 광역버스, 시내버스)

3. **어르신 친화 기능 (Elder-Friendly UI/UX)**
   - Web Speech API 기반 고가시성 음성 마이크 입력 (STT)
   - 10단계 전체 내러티브 음성 안내 및 개별 스텝/챗봇 답변 음성 듣기 (TTS)
   - 히든 Iframe 격리 기법을 적용한 **A4 맞춤 안내서 1장 인쇄 엔진**

4. **신뢰성 및 안전성 (Zero False Positives / Zero Hallucination)**
   - 개인정보 무수집 원칙 (주민번호/실명 일체 미보관)
   - 정규식 기반 정확한 노선번호/학교명 추출 엔진 (165번 vs 65번 서브스트링 오매칭 방지)
   - 안전한 로컬 상담 기록 DB (`replyText` 무손실 저장 및 100% 원문 복원)

5. **마을관리자 전용 대시보드 (`/admin`)**
   - 접수 ➔ AI 분석 ➔ 사람 검증 ➔ 기관 연결 ➔ 완료의 5단계 실시간 관제

---

## 🚀 빠른 시작 (Getting Started)

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 API 키를 입력합니다:
```bash
cp .env.example .env
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 4. 타입 검사 및 프로덕션 빌드
```bash
npm run type-check
npm run build
```

---

## 📁 주요 프로젝트 구조

```
project-마을지기/
├── src/
│   ├── components/
│   │   ├── ChatModal.tsx           # 따뜻한 AI 상담 및 챗봇 모달
│   │   ├── CustomGuideSheet.tsx    # 1장 완결 A4 맞춤 안내서 인쇄 모달
│   │   ├── HelpRequestModal.tsx    # 마을관리자 도움 요청 접수 모달
│   │   └── ...
│   ├── data/
│   │   ├── schoolsDirectory.ts     # 구리·남양주 관내 초·중·고교 공식 디렉토리
│   │   ├── namyangjuPublicFees.ts  # 남양주시 공공요금 및 감면 데이터셋
│   │   ├── namyangjuOrganizations.ts # 남양주시 기관단체 현황 데이터셋
│   │   └── communityResources.ts   # 핵심 공공 지원 자원 라이브러리
│   ├── services/
│   │   ├── simpleQueryService.ts   # 지능형 단답/연락처/학교 라우팅 엔진
│   │   ├── precisionBusService.ts  # 초정밀 버스 및 땡큐버스 실시간 엔진
│   │   ├── seoulSubwayService.ts   # 서울시 실시간 지하철 도착정보 서비스
│   │   ├── publicDataService.ts    # 공공데이터 RAG 10단계 분석 엔진
│   │   ├── consultationHistoryService.ts # 로컬 상담 DB 영구 저장소
│   │   └── caseManagementService.ts # 마을관리자 5단계 사례 관리 엔진
│   └── pages/
│       ├── admin/page.tsx          # 마을관리자 대시보드
│       └── ...
├── RULES.md                        # 마을지기 핵심 운영 원칙
├── MAULJIGI_PROJECT_REPORT.md      # 종합 개발 보고서 및 API 가이드
└── package.json
```

---

## 📜 라이선스 (License)

본 프로젝트는 지역사회 복지 사각지대 해소와 공공데이터 활용을 위해 제작되었습니다.
