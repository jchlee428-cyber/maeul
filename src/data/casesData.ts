export interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  residentType: string;
  issue: string;
  aiProcess: string;
  humanVerification: string;
  deliveredResult: string;
  actualOutcome: string;
  satisfaction: string;
  improvements: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "case-01",
    tag: "고령 주민 돌봄 연계",
    title: "홀로 거주하는 70대 어르신의 식사 및 가사 지원 연계",
    residentType: "만 76세 독거 어르신 (관절염으로 거동 불편, 복지 정보 부재)",
    issue: "혼자 생활하며 장보기와 식사 준비가 어렵고, 지원 제도를 어디서 어떻게 신청해야 하는지 전혀 모르는 상태.",
    aiProcess: "익명화된 문제 상황을 입력하여 노인맞춤돌봄서비스 및 관할 종합사회복지관 밑반찬 배달 자원을 도출하고, 쉬운 4단계 맞춤 안내문으로 정리.",
    humanVerification: "지역 담당 복지사가 관할 주민센터 복지팀과 협의하여 기초연금 수급 자격을 확인하고 서비스 신청 가능 여부를 대조 검증.",
    deliveredResult: "어르신 눈높이에 맞춘 큰 글씨 A4 맞춤 안내서(준비물: 신분증 1장, 방문 없이 전화 1통으로 신청) 전달.",
    actualOutcome: "생활지원사 주 2회 방문 안부 확인 및 주 2회 무료 밑반찬 배달 서비스 정기 연계 완료.",
    satisfaction: "⭐⭐⭐⭐⭐ '복잡할 줄 알았는데 전화 한 통으로 반찬도 오고 도와주는 분이 생겨서 너무 든든합니다.'",
    improvements: "거동이 불편한 어르신을 위해 주민센터 담당자의 직권 방문 접수 프로토콜을 매뉴얼에 추가 반영."
  },
  {
    id: "case-02",
    tag: "정보이해 취약 주민",
    title: "느린학습자 청년의 독립 생활 및 구직 촉진 수당 연계",
    residentType: "만 24세 자립 준비 청년 (전문 행정용어 이해에 어려움)",
    issue: "복잡한 공공 취업 지원 서류와 신청 절차로 인해 거듭 신청을 포기하고 소득이 단절된 상황.",
    aiProcess: "어려운 고용복지 용어를 6대 질문(이것은 무엇인가? 나에게 해당되는가? 내가 해야 할 일은?)으로 쉬운 한국어로 재가공.",
    humanVerification: "지역 비영리 청년 활동가가 국민취업지원제도 1유형 신청 자격 및 필수 제출 서류 목록을 고용센터 담당관과 사전 교차 검증.",
    deliveredResult: "스마트폰으로 볼 수 있는 단계별 카드뉴스형 체크리스트와 1:1 동행 신청 가이드 제공.",
    actualOutcome: "국민취업지원제도 1유형 선정(월 50만원 수당 수령) 및 청년 친화 직무 교육 과정 참여.",
    satisfaction: "⭐⭐⭐⭐⭐ '안내문이 만화처럼 쉬워서 무엇부터 해야 할지 한눈에 알 수 있었어요.'",
    improvements: "청년들이 자주 찾는 모바일 메신저 알림톡 연동 필요성 확인."
  },
  {
    id: "case-03",
    tag: "다문화/외국인 주민",
    title: "갑작스러운 입원비로 위기에 처한 다문화 가정 의료비 지원",
    residentType: "베트남 출신 다문화 가구 (한국어 서류 작성에 취약)",
    issue: "자녀의 급성 맹장염 수술비 마련이 어렵고 긴급 의료비 신청 방법을 모르는 상태.",
    aiProcess: "다국어(베트남어/한국어 병기)로 재난적의료비 지원 및 긴급복지 의료지원 신청 절차와 준비 서류를 번역 및 구조화.",
    humanVerification: "다문화가족지원센터 상담사와 건보공단 지사 담당자가 외국인 등록 사실 및 건보료 납부 기준을 확인.",
    deliveredResult: "베트남어로 번역된 병원비 환급 신청서 작성 안내 및 병원 원무과 사회복지팀 직통 연락처 제공.",
    actualOutcome: "재난적의료비 180만 원 지원 결정 및 병원 사회사업팀 긴급 후원금 50만 원 추가 연계.",
    satisfaction: "⭐⭐⭐⭐⭐ '모국어로 안내받아서 서류를 빠짐없이 준비할 수 있었습니다. 정말 감사합니다.'",
    improvements: "주요 다문화 언어별(베트남어, 중국어, 우즈베크어 등) 표준 서식 템플릿 라이브러리 확장 추진."
  }
];

export const performanceMetrics = [
  { label: "실제 적용 주민", target: "3명 이상", current: "3명 완료 (100%)", status: "달성" },
  { label: "AI 활용 상담 사례", target: "3건 이상", current: "3건 완료 (100%)", status: "달성" },
  { label: "주민 맞춤 안내서 제작", target: "3건 이상", current: "3건 제작 완료", status: "달성" },
  { label: "공식 자료 교차 검증률", target: "100%", current: "100% (오류 0건)", status: "달성" },
  { label: "개인정보 비식별화 준수", target: "100%", current: "100% (민감정보 0건)", status: "달성" },
  { label: "주민 만족도 조사", target: "3건 이상", current: "평균 4.9 / 5.0점", status: "달성" },
  { label: "재현 가능 운영 매뉴얼", target: "1종 구축", current: "표준 4단계 매뉴얼 구축 완료", status: "달성" }
];
