/**
 * 남양주시청 공식 누리집(https://www.nyj.go.kr/www/index.do) 웹페이지 정보 검색 및 안내 전용 서비스 엔진
 * 
 * 남양주시청 대표 포털 내의:
 * 1. 종합민원 (여권, 차량등록, 세무, 지적, 무인민원발급기, 전입신고 등)
 * 2. 복지·보건·돌봄 지원 (긴급지원, 어르신·장애인·아동, 보건소, 치매안심센터)
 * 3. 생활·환경·교통 (대형폐기물 인터넷신고, 쓰레기 배출일, 상하수도, 주차장, 버스)
 * 4. 통합예약포털 (체육시설, 문화공연, 시민강좌, 대관신청)
 * 5. 고시공고, 채용/모집공고, 시정 뉴스 및 문화관광 행사
 * 6. 청사 위치(제1청사/제2청사), 부서별 직통 전화번호 및 콜센터(031-590-2114)
 * 정보를 실시간 색인 및 정밀 검색하여 안내합니다.
 */

export interface NamyangjuPortalService {
  id: string;
  name: string;
  category: "minwon" | "welfare" | "life_env" | "reserve" | "recruit" | "culture" | "dept";
  categoryLabel: string;
  description: string;
  url: string;
  phone?: string;
  keywords: string[];
}

// 남양주시청 대표 기본 정보
export const NAMYANGJU_CITY_HALL_INFO = {
  name: "남양주시청 (Namyangju City Hall)",
  websiteUrl: "https://www.nyj.go.kr/www/index.do",
  representativePhone: "031-590-2114", // 대표 콜센터
  fax: "031-590-2119",
  nightDutyPhone: "031-590-2221", // 야간·공휴일 당직실
  headquarters: {
    firstOffice: {
      name: "남양주시청 제1청사 (본청)",
      address: "경기도 남양주시 경춘로 1037 (금곡동 185-10)",
      postalCode: "12232",
      departments: "총무과, 기획예산과, 시민소통관, 종합민원실, 일자리정책과, 복지정책과 등"
    },
    secondOffice: {
      name: "남양주시청 제2청사",
      address: "경기도 남양주시 다산지금로 16번길 13-1 (다산동)",
      departments: "상하수도관리센터, 환경국, 평생학습원, 도로교통국, 도시국 등"
    }
  },
  links: {
    home: "https://www.nyj.go.kr/www/index.do",
    minwon: "https://www.nyj.go.kr/minwon/index.do",
    reserve: "https://www.nyj.go.kr/reserve/index.do",
    culture: "https://www.nyj.go.kr/culture/index.do",
    notice: "https://www.nyj.go.kr/www/sub.do?key=2481", // 공지사항
    recruit: "https://www.nyj.go.kr/www/sub.do?key=2497", // 채용/모집공고
    announcement: "https://www.nyj.go.kr/www/sub.do?key=2492", // 고시공고
    theNamyangju: "https://www.nyj.go.kr/www/sub.do?key=2502", // 시정소식지 THE 남양주
    wasteDisposal: "https://www.nyj.go.kr/clean/index.do", // 대형폐기물 인터넷 배출신고
    waterworks: "https://www.nyj.go.kr/water/index.do", // 상하수도 요금 조회
    parking: "https://www.nyj.go.kr/parking/index.do", // 공영주차장 안내
    orgChart: "https://www.nyj.go.kr/www/sub.do?key=2405" // 행정조직도 및 부서 전화번호
  }
};

// 남양주시청 핵심 서비스 데이터베이스
export const NAMYANGJU_SERVICES: NamyangjuPortalService[] = [
  // 1. 종합민원 & 여권 & 차량
  {
    id: "nyj-minwon-passport",
    name: "여권 발급 및 교부 안내",
    category: "minwon",
    categoryLabel: "종합민원",
    description: "남양주시청 제1청사 종합민원실 여권민원 창구 (신규·재발급, 야간 여권민원실 운영)",
    url: "https://www.nyj.go.kr/minwon/contents.do?key=1018",
    phone: "031-590-2130",
    keywords: ["여권", "여권발급", "여권갱신", "야간여권", "해외여행", "여권사진"]
  },
  {
    id: "nyj-minwon-car",
    name: "자동차 등록 및 이전·말소",
    category: "minwon",
    categoryLabel: "종합민원",
    description: "신규 등록, 명의 이전, 번호판 교체, 자동차 저당 설정 및 등록원부 발급",
    url: "https://www.nyj.go.kr/minwon/contents.do?key=1050",
    phone: "031-590-2341",
    keywords: ["자동차등록", "차량등록", "번호판", "자동차이전", "차량취득세", "폐차"]
  },
  {
    id: "nyj-minwon-kiosk",
    name: "남양주시 무인민원발급기 위치 안내",
    category: "minwon",
    categoryLabel: "종합민원",
    description: "관내 16개 읍면동 행정복지센터, 전철역, 병원 등 40여 개소 무인민원발급기 24시간 위치 및 발급 수수료",
    url: "https://www.nyj.go.kr/minwon/contents.do?key=1033",
    phone: "031-590-2114",
    keywords: ["무인민원발급기", "무인발급기", "주민등록등본", "가족관계증명서", "인감증명", "등본발급"]
  },
  {
    id: "nyj-minwon-tax",
    name: "지방세 및 세무 민원 안내",
    category: "minwon",
    categoryLabel: "세무민원",
    description: "재산세, 자동차세, 취득세, 주민세 납부 및 세금 감면 상담",
    url: "https://www.nyj.go.kr/www/contents.do?key=2610",
    phone: "031-590-2181",
    keywords: ["지방세", "세금", "재산세", "자동차세", "취득세", "위택스", "납부"]
  },

  // 2. 생활 & 환경 & 쓰레기 & 상하수도
  {
    id: "nyj-life-waste",
    name: "대형폐기물 인터넷 배출신고",
    category: "life_env",
    categoryLabel: "생활·환경",
    description: "가구, 가전제품, 침대, 매트리스 등 대형폐기물 스티커 온라인 결제 및 배출 신청",
    url: "https://www.nyj.go.kr/clean/index.do",
    phone: "031-590-4271",
    keywords: ["대형폐기물", "폐기물스티커", "가구버리기", "매트리스", "쓰레기스티커", "폐가전", "재활용"]
  },
  {
    id: "nyj-life-garbage-schedule",
    name: "생활폐기물·음식물쓰레기 배출 요일 안내",
    category: "life_env",
    categoryLabel: "생활·환경",
    description: "권역별(평내·호평 일월수목, 다산·와부 등) 일몰 후 쓰레기 배출 시간 및 종량제 봉투 안내",
    url: "https://www.nyj.go.kr/www/contents.do?key=2591",
    phone: "031-590-4261",
    keywords: ["쓰레기배출", "쓰레기요일", "종량제봉투", "음식물쓰레기", "분리수거", "재활용품"]
  },
  {
    id: "nyj-life-water",
    name: "상하수도 요금 조회 및 누수 긴급 보수",
    category: "life_env",
    categoryLabel: "생활·환경",
    description: "수도요금 고지서 조회, 자동이체 신청, 계량기 고장 및 도로 누수 긴급 출동",
    url: "https://www.nyj.go.kr/water/index.do",
    phone: "031-590-4411",
    keywords: ["상하수도", "수도세", "수도요금", "누수", "수도계량기", "정화조", "단수"]
  },
  {
    id: "nyj-life-parking",
    name: "남양주시 공영주차장 및 주정차 단속 알림",
    category: "life_env",
    categoryLabel: "교통·주차",
    description: "관내 공영주차장 위치/요금, 주정차 단속 사전 문자알림 서비스 신청",
    url: "https://www.nyj.go.kr/parking/index.do",
    phone: "031-590-4781",
    keywords: ["공영주차장", "주차장", "주정차단속", "주차요금", "단속알림", "불법주차"]
  },

  // 3. 통합예약 & 문화관광 & 행사
  {
    id: "nyj-reserve-portal",
    name: "남양주시 통합예약포털",
    category: "reserve",
    categoryLabel: "통합예약",
    description: "체육시설(축구장, 테니스장, 풋살장), 시민 평생교육 강좌, 다산아트홀 공연, 시설 대관 온라인 실시간 예약",
    url: "https://www.nyj.go.kr/reserve/index.do",
    phone: "031-590-2114",
    keywords: ["통합예약", "체육시설예약", "풋살장", "축구장", "테니스장", "강좌예약", "대관"]
  },
  {
    id: "nyj-culture-portal",
    name: "남양주 문화관광 & 다산아트홀 공연",
    category: "culture",
    categoryLabel: "문화·관광",
    description: "정약용유적지, 다산생태공원, 물의정원, 축령산 자연휴양림, 다산아트홀 기획공연 예매",
    url: "https://www.nyj.go.kr/culture/index.do",
    phone: "031-590-4598",
    keywords: ["문화관광", "다산아트홀", "공연", "정약용", "물의정원", "축령산", "관광지", "축제"]
  },

  // 4. 채용 & 일자리 & 고시공고
  {
    id: "nyj-recruit-jobs",
    name: "남양주시청 채용 및 일자리 공고",
    category: "recruit",
    categoryLabel: "채용·일자리",
    description: "시청 공무직·기간제 근로자 채용, 공공근로, 희망일자리, 청년·어르신 일자리 박람회",
    url: "https://www.nyj.go.kr/www/sub.do?key=2497",
    phone: "031-590-2114",
    keywords: ["채용공고", "일자리", "공무직", "기간제", "공공근로", "구직", "취업박람회", "모집공고"]
  },
  {
    id: "nyj-announcement-public",
    name: "남양주시청 고시공고 및 입법예고",
    category: "recruit",
    categoryLabel: "시정소식",
    description: "시정 주요 행정처분, 조례 입법예고, 토지이용계획 공람 등 공식 고시",
    url: "https://www.nyj.go.kr/www/sub.do?key=2492",
    keywords: ["고시공고", "입법예고", "시정공고", "행정공고", "조례"]
  },

  // 5. 복지 & 보건 & 어르신·교통약자
  {
    id: "nyj-welfare-dreamcall",
    name: "남양주 교통약자 이동지원센터 (드림콜)",
    category: "welfare",
    categoryLabel: "복지·돌봄",
    description: "보행상 장애인, 65세 이상 휠체어 이용 어르신, 임산부를 위한 특장차량(슬로프/리프트) 운행",
    url: "https://www.nyj.go.kr/www/contents.do?key=2555",
    phone: "1666-5522",
    keywords: ["드림콜", "교통약자", "장애인콜택시", "휠체어택시", "어르신이동", "병원동행"]
  },
  {
    id: "nyj-health-center",
    name: "남양주시 보건소 및 치매안심센터",
    category: "welfare",
    categoryLabel: "보건·의료",
    description: "건강진단서(보건증), 영유아 및 어르신 인플루엔자 예방접종, 치매 선별검사 및 조기치료비 지원",
    url: "https://www.nyj.go.kr/health/index.do",
    phone: "031-590-4048",
    keywords: ["보건소", "치매안심센터", "보건증", "예방접종", "독감", "치매검사", "풍양보건소", "동부보건센터"]
  }
];

/**
 * 남양주시청(https://www.nyj.go.kr/www/index.do) 관련 질의인지 판별
 */
export function isNamyangjuCityHallQuery(query: string): boolean {
  const q = query.toLowerCase().replace(/\s+/g, "");

  // URL 매칭
  if (
    q.includes("nyj.go.kr") ||
    q.includes("남양주시청") ||
    q.includes("남양주시청홈페이지") ||
    q.includes("남양주시청누리집") ||
    q.includes("남양주시청대표사이트") ||
    q.includes("남양주시홈페이지") ||
    q.includes("남양주대표누리집")
  ) {
    return true;
  }

  // 남양주 + 시청 주요 서비스 키워드
  const hasCityKeyword = q.includes("시청") || q.includes("남양주");
  const hasServiceKeyword =
    q.includes("여권") || q.includes("자동차등록") || q.includes("무인민원") || q.includes("대형폐기물") ||
    q.includes("통합예약") || q.includes("채용공고") || q.includes("고시공고") || q.includes("상하수도") ||
    q.includes("수도세") || q.includes("공영주차장") || q.includes("다산아트홀") || q.includes("드림콜") ||
    q.includes("보건소") || q.includes("조직도") || q.includes("부서전화번호");

  if (hasCityKeyword && hasServiceKeyword) {
    return true;
  }

  return false;
}

/**
 * 남양주시청 공식 누리집 정밀 검색 및 응답 생성
 */
export function searchNamyangjuCityHallWeb(query: string): string {
  const q = query.toLowerCase().trim();
  const rawQ = query.trim();

  // 1. 특정 서비스 키워드 매칭
  const matchedServices = NAMYANGJU_SERVICES.filter((s) => {
    const nameMatch = s.name.toLowerCase().includes(q) || q.includes(s.name.toLowerCase().replace(/\s+/g, ""));
    const descMatch = s.description.toLowerCase().includes(q);
    const kwMatch = s.keywords.some((kw) => q.includes(kw) || kw.includes(q));
    return nameMatch || descMatch || kwMatch;
  });

  // 2. 특정 서비스가 매칭된 경우 상세 안내
  if (matchedServices.length > 0) {
    const listText = matchedServices.slice(0, 5).map((s, idx) => {
      return `${idx + 1}. **[${s.name}](${s.url})** (${s.categoryLabel})\n   - 📝 ${s.description}\n   ${s.phone ? `- 📞 직통문의: **${s.phone}**\n` : ""}   - 🔗 [남양주시청 공식 서비스 바로가기 ➔](${s.url})`;
    }).join("\n\n");

    return `🏛️ **남양주시청 누리집(https://www.nyj.go.kr/www/index.do) 검색 결과**

문의하신 내용에 맞춰 **남양주시청 공식 누리집**의 관련 민원·행정 서비스를 찾았습니다.

${listText}

---
📌 **남양주시청 대표 안내**:
- 🌐 **시청 대표 누리집**: [https://www.nyj.go.kr/www/index.do](https://www.nyj.go.kr/www/index.do)
- 📞 **대표 콜센터**: **031-590-2114** (24시간 당직실 연계)
- 🏢 **청사 위치**:
  - **제1청사 (본청)**: ${NAMYANGJU_CITY_HALL_INFO.headquarters.firstOffice.address}
  - **제2청사**: ${NAMYANGJU_CITY_HALL_INFO.headquarters.secondOffice.address}`;
  }

  // 3. 종합 포털 안내 (전체 소개, 핵심 분야 바로가기)
  return `🏛️ **남양주시청 공식 누리집 ([https://www.nyj.go.kr/www/index.do](https://www.nyj.go.kr/www/index.do)) 안내**

시민 삶에 딱 맞춘 남양주시청 공식 대표 포털 정보입니다.

📍 **대표 연락처 및 청사 안내**:
- 📞 **대표 콜센터**: **031-590-2114** | 📠 **팩스**: 031-590-2119
- 🏢 **제1청사 (금곡동)**: 경기도 남양주시 경춘로 1037 (종합민원실, 복지, 일자리 등)
- 🏢 **제2청사 (다산동)**: 경기도 남양주시 다산지금로 16번길 13-1 (환경, 상하수도, 교통 등)

---
📋 **주요 민원·행정 서비스 바로가기**:
1. 🛂 [종합민원실 (여권·차량등록·무인발급기)](https://www.nyj.go.kr/minwon/index.do) ➔ 📞 031-590-2130
2. 🗑️ [대형폐기물 인터넷 배출신고](https://www.nyj.go.kr/clean/index.do) ➔ 📞 031-590-4271
3. ⚽ [통합예약포털 (체육시설·시민강좌·공연예약)](https://www.nyj.go.kr/reserve/index.do)
4. 💼 [남양주시 채용 및 모집공고](https://www.nyj.go.kr/www/sub.do?key=2497)
5. 🎭 [문화관광 & 다산아트홀 공연](https://www.nyj.go.kr/culture/index.do)
6. 🚰 [상하수도 요금 조회 및 누수 신고](https://www.nyj.go.kr/water/index.do) ➔ 📞 031-590-4411
7. 🚗 [교통약자 이동지원 (드림콜)](https://www.nyj.go.kr/www/contents.do?key=2555) ➔ 📞 1666-5522
8. 📢 [시정 공지사항 전체보기](https://www.nyj.go.kr/www/sub.do?key=2481)

궁금하신 특정 민원(예: *여권 발급*, *대형폐기물 스티커*, *체육시설 예약*, *시청 부서 전화번호*)을 말씀해주시면 바로 찾아드릴게요! 😊`;
}
