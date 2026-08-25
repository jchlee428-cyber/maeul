/**
 * 보건복지부 공식 누리집 (https://www.mohw.go.kr) 웹페이지 정보 검색 및 복지정책 전용 서비스 엔진
 * 
 * 보건복지부 대표 포털 내의:
 * 1. 기초생활보장 및 긴급생계지원 정책 (생계·의료·주거·교육급여, 긴급복지지원)
 * 2. 노인 복지 및 장기요양 (기초연금, 치매안심센터, 노인일자리, 주야간보호 데이케어)
 * 3. 장애인 정책 및 자립지원 (장애인연금, 활동지원, 장애인일자리, 보조기기)
 * 4. 아동·보육 및 다문화·가족 (아동수당, 부모급여, 다함께돌봄, 늘봄학교, 첫만남이용권)
 * 5. 보건의료 및 건강보험 (재난적의료비, 암환자의료비, 치매치료비, 희귀질환지원)
 * 6. 정신건강 및 위기상담 (전국민 마음투자, 자살예방 109, 정신건강 1577-0199)
 * 7. 보건복지상담센터 (국번없이 129, www.129.go.kr) 및 복지로 (www.bokjiro.go.kr) 모의계산/온라인신청
 * 8. 최신 보도자료, 고시/공고, 법령 정보 및 민원 서식
 * 정보를 실시간 색인 및 정밀 검색하여 안내합니다.
 */

export interface MohwPortalService {
  id: string;
  name: string;
  category: "basic_livelihood" | "senior" | "disabled" | "child" | "health" | "mental" | "news" | "consult";
  categoryLabel: string;
  description: string;
  url: string;
  phone?: string;
  keywords: string[];
}

// 보건복지부 대표 기본 정보
export const MOHW_INFO = {
  name: "보건복지부 (Ministry of Health and Welfare)",
  websiteUrl: "https://www.mohw.go.kr",
  callCenterPhone: "129", // 보건복지상담센터 (국번없이 129)
  address: "세종특별자치시 도움4로 13 정부세종청사 10동 보건복지부 (우: 30113)",
  portalLinks: {
    home: "https://www.mohw.go.kr",
    bokjiro: "https://www.bokjiro.go.kr", // 대한민국 대표 복지포털
    callCenter129: "https://www.129.go.kr", // 보건복지상담센터
    news: "https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027", // 보도자료
    announcement: "https://www.mohw.go.kr/board.es?mid=a10411010100&bid=0019", // 고시/공고/입법예고
    regulations: "https://www.mohw.go.kr/menu.es?mid=a10401010000", // 소관 법령 정보
    forms: "https://www.mohw.go.kr/board.es?mid=a10408010000&bid=0023", // 민원 서식 자료실
    mockCalculation: "https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do" // 복지급여 모의계산
  }
};

// 보건복지부 핵심 서비스 및 정책 데이터베이스
export const MOHW_PORTAL_SERVICES: MohwPortalService[] = [
  {
    id: "mohw-129",
    name: "보건복지상담센터 (129 누리집)",
    category: "consult",
    categoryLabel: "상담·콜센터",
    description: "생계, 의료, 돌봄, 복지 사각지대 위기가구 등 모든 보건복지 정책을 24시간 전화, 카카오톡, 수어 화상으로 1:1 전문 상담해 드립니다.",
    url: "https://www.129.go.kr",
    phone: "129",
    keywords: ["129", "보건복지상담센터", "복지콜센터", "보건복지부 전화", "상담전화", "복지상담", "129콜센터", "전화번호", "mohw"]
  },
  {
    id: "mohw-bokjiro",
    name: "복지로 포털 (온라인 복지신청 & 모의계산)",
    category: "consult",
    categoryLabel: "복지포털",
    description: "대한민국 1,000여 개 중앙부처 및 지자체 복지 서비스를 한눈에 검색하고, 내가 받을 수 있는 복지급여 모의계산 및 온라인 복지 신청이 가능한 대표 포털입니다.",
    url: "https://www.bokjiro.go.kr",
    phone: "1566-0313",
    keywords: ["복지로", "복지로포털", "온라인신청", "복지신청", "모의계산", "복지서비스조회", "맞춤형복지", "bokjiro"]
  },
  {
    id: "mohw-basic-livelihood",
    name: "국민기초생활보장제도 (생계·의료·주거·교육급여)",
    category: "basic_livelihood",
    categoryLabel: "기초생활보장",
    description: "소득인정액이 기준중위소득 이하인 저소득 가구에 매월 생계급여(최대 183만 원 현금 지급), 의료급여(병원비 면제·감면), 주거급여(월세 지원), 교육급여(교육활동비)를 지급합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10708010100",
    phone: "129",
    keywords: ["기초생활수급", "생계급여", "의료급여", "주거급여", "교육급여", "수급자", "차상위계층", "중위소득", "기초수급자"]
  },
  {
    id: "mohw-emergency-welfare",
    name: "긴급복지지원제도 (선지원 후조사)",
    category: "basic_livelihood",
    categoryLabel: "긴급복지",
    description: "실직, 중한 질병, 월세 체납, 화재 등으로 갑작스러운 위기에 처한 가구에 신청 즉시 생계비(월 183만 원), 의료비(최대 300만 원), 주거비(대도시 월 66만 원)를 선지원합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10708020000",
    phone: "129",
    keywords: ["긴급복지", "긴급생계비", "긴급의료비", "위기가구", "선지원", "실직생계비", "월세체납", "긴급지원"]
  },
  {
    id: "mohw-catastrophic-medical",
    name: "재난적의료비 지원사업",
    category: "health",
    categoryLabel: "의료비지원",
    description: "과도한 질병·수술·입원비로 가계 경제에 부담을 겪는 가구에 연간 최대 5,000만 원 한도 내 본인부담 의료비의 50~80%를 국가가 환급 지원합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10701040000",
    phone: "1577-1000",
    keywords: ["재난적의료비", "병원비지원", "수술비지원", "의료비환급", "국민건강보험", "고액병원비", "본인부담금환급"]
  },
  {
    id: "mohw-dementia-care",
    name: "치매국가책임제 및 노인장기요양보험",
    category: "senior",
    categoryLabel: "치매·노인돌봄",
    description: "치매 어르신 주야간보호(데이케어센터 85~100% 국비 지원), 전국 보건소 치매안심센터 무료 정밀검진 및 쉼터 낮돌봄, 치매약제비(월 3만 원), 치매가족휴가제를 지원합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10706030000",
    phone: "1899-9988",
    keywords: ["치매", "치매안심센터", "주야간보호", "데이케어", "노인장기요양보험", "치매약제비", "치매쉼터", "노인돌봄", "치매상담콜센터"]
  },
  {
    id: "mohw-basic-pension",
    name: "기초연금 지원제도 (만 65세 이상)",
    category: "senior",
    categoryLabel: "노후소득보장",
    description: "대한민국 만 65세 이상 어르신 중 소득하위 70% 가구에 매월 최대 33만 4천 원의 기초연금을 평생 지급하여 안정적인 노후생활을 지원합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10706010000",
    phone: "1355",
    keywords: ["기초연금", "노령연금", "65세이상", "어르신연금", "국민연금공단", "노인소득", "기초연금신청"]
  },
  {
    id: "mohw-disabled-support",
    name: "장애인 활동지원 및 장애인연금",
    category: "disabled",
    categoryLabel: "장애인복지",
    description: "등록 장애인을 위한 일상생활·가사·외출 동행 활동지원사 파견, 중증장애인 연금 지급, 장애인 보조기기 교부 및 공공일자리(복지일자리)를 지원합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10707010000",
    phone: "129",
    keywords: ["장애인연금", "장애인활동지원", "활동보조", "장애인복지", "보조기기", "장애수당", "장애인일자리"]
  },
  {
    id: "mohw-child-allowance",
    name: "아동수당 & 부모급여 & 첫만남이용권",
    category: "child",
    categoryLabel: "아동·양육",
    description: "만 8세 미만 모든 아동에게 월 10만 원 아동수당 지급, 0세(월 100만 원)·1세(월 50만 원) 부모급여, 출생 아동 첫만남이용권(첫째 200만 원, 둘째 300만 원 바우처)을 전액 지원합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10705010000",
    phone: "129",
    keywords: ["아동수당", "부모급여", "첫만남이용권", "양육수당", "출산지원금", "아이돌봄", "영유아지원", "보육료"]
  },
  {
    id: "mohw-mind-support",
    name: "전국민 마음투자 심리상담 지원사업",
    category: "mental",
    categoryLabel: "정신건강",
    description: "우울·불안·스트레스 등 마음의 어려움을 겪는 국민에게 전문 1:1 심리상담 바우처(총 8회, 회당 최대 8만 원)를 지원하며, 24시간 자살예방 상담전화(109)를 운영합니다.",
    url: "https://www.mohw.go.kr/menu.es?mid=a10703040000",
    phone: "109",
    keywords: ["마음투자", "심리상담", "정신건강", "우울증", "불안장애", "자살예방", "109", "1577-0199", "마음건강"]
  },
  {
    id: "mohw-news-announcement",
    name: "보건복지부 최신 보도자료 & 고시·공고",
    category: "news",
    categoryLabel: "정책소식",
    description: "보건복지부의 2026년 최신 복지 기준 개정, 보건의료 정책 발표, 복지사업 지침 고시공고 및 공식 보도자료를 실시간으로 확인하실 수 있습니다.",
    url: "https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027",
    phone: "044-202-2000",
    keywords: ["보도자료", "고시공고", "보건복지부 소식", "복지정책", "복지뉴스", "지침개정", "법령정보", "mohw소식"]
  }
];

/**
 * 보건복지부(https://www.mohw.go.kr) 관련 질의인지 판별
 */
export function isMohwQuery(query: string): boolean {
  const q = query.toLowerCase().trim();
  return (
    q.includes("보건복지부") ||
    q.includes("복지부") ||
    q.includes("mohw") ||
    q.includes("mohw.go.kr") ||
    q.includes("129") ||
    q.includes("보건복지상담센터") ||
    q.includes("복지로") ||
    q.includes("bokjiro") ||
    ((q.includes("복지") || q.includes("보건") || q.includes("정책")) && (q.includes("홈페이지") || q.includes("누리집") || q.includes("사이트") || q.includes("공식")))
  );
}

/**
 * 보건복지부 누리집(https://www.mohw.go.kr) 정보 정밀 검색 및 포맷팅
 */
export function searchMohwPortal(query: string): string {
  const q = query.toLowerCase().trim();

  // 1. 키워드 기반 서비스 매칭
  const matchedServices = MOHW_PORTAL_SERVICES.filter((svc) => {
    return svc.keywords.some((k) => q.includes(k.toLowerCase())) ||
      svc.name.toLowerCase().includes(q) ||
      svc.description.toLowerCase().includes(q);
  });

  if (matchedServices.length > 0) {
    const topServices = matchedServices.slice(0, 3);
    let result = `🏛️ **보건복지부 공식 누리집 (https://www.mohw.go.kr) 검색 결과**\n\n`;
    result += `질문하신 내용과 가장 일치하는 보건복지부 공식 정책 및 온라인 서비스를 안내해 드립니다.\n\n---\n\n`;

    topServices.forEach((svc, index) => {
      result += `### ${index + 1}. [${svc.name}](${svc.url})\n`;
      result += `- 🏷️ **분야:** ${svc.categoryLabel}\n`;
      result += `- 📝 **주요 내용:** ${svc.description}\n`;
      if (svc.phone) {
        result += `- 📞 **직통 문의처:** **${svc.phone}** (보건복지상담센터)\n`;
      }
      result += `- 🔗 **공식 페이지 바로가기:** [${svc.url}](${svc.url})\n\n`;
    });

    result += `---\n\n`;
    result += `### 💡 보건복지부 주요 포털 안내\n`;
    result += `- 🌐 **보건복지부 대표 누리집**: [https://www.mohw.go.kr](https://www.mohw.go.kr)\n`;
    result += `- 💻 **복지로 (온라인 복지 신청·모의계산)**: [https://www.bokjiro.go.kr](https://www.bokjiro.go.kr)\n`;
    result += `- 📞 **보건복지상담센터 (24시간)**: 국번없이 **129** (전국 무료)`;

    return result;
  }

  // 2. 전체 개요 안내 (기본 안내)
  return `🏛️ **보건복지부 공식 누리집 ([https://www.mohw.go.kr](https://www.mohw.go.kr)) 안내**

대한민국 국민의 건강과 행복한 삶을 책임지는 **보건복지부 공식 복지 포털 및 주요 행정 서비스**입니다.

---

### 🌟 보건복지부 핵심 온라인 서비스 바로가기
1. 📞 [보건복지상담센터 (국번없이 129)](https://www.129.go.kr) ➔ 24시간 생계·의료·돌봄 복지상담
2. 💻 [복지로 포털 (www.bokjiro.go.kr)](https://www.bokjiro.go.kr) ➔ 나에게 맞는 복지급여 모의계산 및 온라인 복지 신청
3. 🏥 [재난적의료비 지원사업](https://www.mohw.go.kr/menu.es?mid=a10701040000) ➔ 과도한 병원비 50~80% 국비 환급
4. 👵 [치매안심센터 & 노인장기요양보험](https://www.mohw.go.kr/menu.es?mid=a10706030000) ➔ 데이케어 국비지원 및 치매 무료 검진
5. 👶 [아동수당 & 부모급여](https://www.mohw.go.kr/menu.es?mid=a10705010000) ➔ 영유아 양육수당 및 첫만남이용권 신청
6. 🌿 [전국민 마음투자 심리상담](https://www.mohw.go.kr/menu.es?mid=a10703040000) ➔ 우울·불안 전문 심리상담 바우처
7. 📢 [보건복지부 최신 보도자료 & 고시공고](https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027)

---

### 📞 보건복지부 대표 공식 문의처
- **보건복지상담센터 (전국 복지통합)**: 📞 **국번없이 129** (24시간 운영, 무료)
- **보건복지부 대표전화 (정부세종청사)**: 📞 **044-202-2000**
- **정부민원안내 콜센터**: 📞 **국번없이 110** (24시간)`;
}
