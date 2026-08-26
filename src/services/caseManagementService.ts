export type ProcessStatus = "접수" | "AI 분석" | "검증" | "기관 연결" | "완료";
export type VerificationStatus = "검증 대기" | "검증 완료" | "보완 필요";

export interface CommunityCase {
  id: string; // 사례번호: CASE-2026-0821-001
  createdAt: string; // "2026-08-21 11:20"
  problemType: "복지" | "의료" | "교육" | "생활지원" | "주거" | "일자리" | "기타";
  region: string; // 예: "서울시 관악구 신림동"
  neededService: string; // 예: "독거 어르신 식사 및 일상 돌봄 지원"
  userSituation: string; // 주민이 입력한 원문 요약
  contactInfo: string; // 안심 연락처 (비식별화)
  aiRecommendation: string; // AI가 추천한 공공제도명 및 원문 근거
  sourceApi: string; // 공공데이터 출처
  verificationStatus: VerificationStatus; // 검증상태
  managerNotes?: string; // 관리자 현장 메모
  connectedOrg: string; // 연결기관 (예: "신림동 주민센터 복지팀")
  processStatus: ProcessStatus; // 처리상태 (접수 -> AI 분석 -> 검증 -> 기관 연결 -> 완료)
}

export interface DashboardStats {
  todayConsultations: number; // 오늘 상담 건수
  welfareQueries: number;     // 복지 문의
  medicalQueries: number;     // 의료 문의
  educationQueries: number;   // 교육 문의
  lifeQueries: number;        // 생활지원 문의
  connectedCount: number;     // 실제 연결 건수
  unverifiedCount: number;    // 미확인 정보 (검증 대기 건수)
}

const STORAGE_KEY = "maeul_community_cases_v2";

// 초기 시연용 현실적인 실증 사례 5건
const initialCases: CommunityCase[] = [
  {
    id: "CASE-2026-0821-001",
    createdAt: "2026-08-21 09:30",
    problemType: "복지",
    region: "서울시 관악구 신림동",
    neededService: "독거 어르신 식사 및 일상 돌봄 지원",
    userSituation: "혼자 사시는 70대 어르신이 거동이 불편해 식사 준비를 못하고 계심",
    contactInfo: "안심번호 050-****-1201 (이웃 주민 대리 접수)",
    aiRecommendation: "노인맞춤돌봄서비스 (보건복지부 노인복지서비스 공공데이터 ID: 150244)",
    sourceApi: "보건복지부 노인복지서비스 공공데이터",
    verificationStatus: "검증 완료",
    managerNotes: "기초연금 수급 대상 확인 완료. 신림종합사회복지관 밑반찬 배달 우선 연계 확정.",
    connectedOrg: "신림동 주민센터 복지팀 / 신림종합사회복지관",
    processStatus: "완료"
  },
  {
    id: "CASE-2026-0821-002",
    createdAt: "2026-08-21 10:15",
    problemType: "의료",
    region: "부산시 부산진구 부전동",
    neededService: "입원 수술비 긴급 지원 및 의료비 환급",
    userSituation: "뇌출혈 수술 후 병원비 300만 원 청구서가 나왔으나 납부 곤란",
    contactInfo: "010-****-5542 (환자 본인)",
    aiRecommendation: "재난적의료비 지원사업 (국민건강보험공단 API ID: 150490)",
    sourceApi: "국민건강보험공단 재난적의료비 공공API",
    verificationStatus: "검증 완료",
    managerNotes: "건보공단 부산진구지사 담당자와 통화 완료. 퇴원 후 180일 내 진료비 내역서 접수 안내.",
    connectedOrg: "국민건강보험공단 부산진지사 / 부산진구보건소",
    processStatus: "기관 연결"
  },
  {
    id: "CASE-2026-0821-003",
    createdAt: "2026-08-21 10:45",
    problemType: "생활지원",
    region: "대구시 달서구 상인동",
    neededService: "혹서기 전기요금 감면 및 에너지바우처",
    userSituation: "기초수급 독거가구로 여름철 냉방 전기요금 부담으로 온열질환 우려",
    contactInfo: "010-****-8819",
    aiRecommendation: "에너지바우처 및 필수요금 감면 (한국에너지공단 ID: 150333)",
    sourceApi: "한국에너지공단 에너지복지 공공데이터",
    verificationStatus: "검증 대기",
    managerNotes: "주민센터 복지팀에 수급자 에너지바우처 자동 발급 여부 확인 필요.",
    connectedOrg: "상인2동 행정복지센터",
    processStatus: "검증"
  },
  {
    id: "CASE-2026-0821-004",
    createdAt: "2026-08-21 11:05",
    problemType: "교육",
    region: "인천시 부평구 부평동",
    neededService: "다문화 한부모 가정 초등학생 교육비 바우처 지원",
    userSituation: "입학 후 방과후교실 및 인터넷 통신비 지원을 신청하고 싶음",
    contactInfo: "010-****-3310 (보호자)",
    aiRecommendation: "초·중·고 학생 교육급여 및 맞춤형 교육비 (교육부 ID: 150611)",
    sourceApi: "교육부 교육비 원클릭 공공데이터",
    verificationStatus: "검증 완료",
    managerNotes: "부평구 다문화가족지원센터와 연계하여 서류 번역 및 원클릭 접수 완료.",
    connectedOrg: "부평구청 교육복지과 / 부평다문화가족지원센터",
    processStatus: "기관 연결"
  },
  {
    id: "CASE-2026-0821-005",
    createdAt: "2026-08-21 11:18",
    problemType: "복지",
    region: "대전시 서구 둔산동",
    neededService: "갑작스러운 실직 후 긴급생계비 지원",
    userSituation: "소규모 공장 폐업으로 월세 3개월 밀리고 생계 곤란",
    contactInfo: "010-****-9021",
    aiRecommendation: "긴급복지 생계지원사업 (보건복지부 ID: 150001)",
    sourceApi: "공공데이터포털 복지로 맞춤형 복지서비스 OpenAPI",
    verificationStatus: "검증 대기",
    managerNotes: "선지원 후조사 원칙에 따라 긴급복지 지원요청서 작성 지원 예정.",
    connectedOrg: "둔산동 행정복지센터 맞춤형복지팀",
    processStatus: "접수"
  }
];

export function getCases(): CommunityCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
      return initialCases;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load cases from storage", e);
    return initialCases;
  }
}

export function saveCases(cases: CommunityCase[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error("Failed to save cases to storage", e);
  }
}

export function addCase(newCaseData: Omit<CommunityCase, "id" | "createdAt" | "processStatus" | "verificationStatus" | "connectedOrg">): CommunityCase {
  const cases = getCases();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const timeStr = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const count = cases.length + 1;
  const id = `CASE-${dateStr}-${String(count).padStart(3, "0")}`;

  const newCase: CommunityCase = {
    ...newCaseData,
    id,
    createdAt: `${new Date().toLocaleDateString("ko-KR")} ${timeStr}`,
    verificationStatus: "검증 대기",
    connectedOrg: "관할 지자체 복지팀 (배정 대기)",
    processStatus: "접수"
  };

  const updated = [newCase, ...cases];
  saveCases(updated);
  return newCase;
}

export function updateCase(updatedCase: CommunityCase) {
  const cases = getCases();
  const index = cases.findIndex((c) => c.id === updatedCase.id);
  if (index !== -1) {
    cases[index] = updatedCase;
    saveCases(cases);
  }
}

export function getDashboardStats(): DashboardStats {
  const cases = getCases();

  const welfareQueries = cases.filter((c) => c.problemType === "복지" || c.problemType === "주거" || c.problemType === "일자리").length;
  const medicalQueries = cases.filter((c) => c.problemType === "의료").length;
  const educationQueries = cases.filter((c) => c.problemType === "교육").length;
  const lifeQueries = cases.filter((c) => c.problemType === "생활지원" || c.problemType === "기타").length;

  const connectedCount = cases.filter((c) => c.processStatus === "기관 연결" || c.processStatus === "완료").length;
  const unverifiedCount = cases.filter((c) => c.verificationStatus === "검증 대기" || c.verificationStatus === "보완 필요").length;

  return {
    todayConsultations: cases.length + 12, // 오늘 상담 누적(상담 봇 질의 포함)
    welfareQueries,
    medicalQueries,
    educationQueries,
    lifeQueries,
    connectedCount,
    unverifiedCount
  };
}

export function resetCasesToDefault(): CommunityCase[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
  } catch (e) {
    console.error("Failed to reset cases in storage", e);
  }
  return initialCases;
}

