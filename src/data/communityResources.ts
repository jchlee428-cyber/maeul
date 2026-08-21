export interface CommunityResource {
  id: string;
  category: "welfare" | "gov" | "health" | "edu" | "housing" | "job" | "life" | "other";
  categoryLabel: string;
  title: string;
  organization: string;
  contact: string;
  onlineUrl?: string;
  target: string;
  plainSummary: string; // 쉬운 말 요약 (사업계획서 5.3)
  questions: {
    what: string;       // 이것은 무엇인가?
    who: string;        // 나에게 해당되는가?
    action: string;     // 내가 해야 할 일은 무엇인가?
    deadline: string;   // 언제까지 해야 하는가?
    preparation: string;// 무엇을 준비해야 하는가?
    where: string;      // 어디에 문의해야 하는가?
  };
  humanVerificationNotes: string; // 사람이 최종 확인해야 할 사항
}

export const communityResources: CommunityResource[] = [
  {
    id: "res-nyj-fee-01",
    category: "life",
    categoryLabel: "생활요금·물가",
    title: "남양주시 공공요금(상수도·도시가스·버스·택시) 및 취약계층 감면 안내",
    organization: "남양주시청 지역경제과 / 상하수도관리센터 / 대중교통과",
    contact: "남양주시청 콜센터 (031-590-2114) / 수도과 (031-590-4411) / 드림콜 (1666-5522)",
    onlineUrl: "https://www.nyj.go.kr/www/selectBbsNttList.do?key=2956&bbsNo=84&pageUnit=10&searchCnd=SJ&searchKrwd=%EA%B3%B5%EA%B3%B5%EC%9A%94%EA%B8%88",
    target: "남양주시 거주 시민 및 취약계층(기초수급자, 차상위, 어르신, 다자녀, 중증장애인)",
    plainSummary: "남양주시의 수도요금, 도시가스 요금, 버스·택시 요금, 종량제봉투 가격과 취약계층·어르신을 위한 할인 감면 혜택을 알기 쉽게 정리한 안내서입니다.",
    questions: {
      what: "남양주시청에서 고시한 주요 공공요금 기준과 취약계층 수도요금(월 10톤 감면), 도시가스(월 최대 24,000원 감면), 교통약자 이동지원(드림콜 택시) 등 생활비 경감 제도입니다.",
      who: "남양주시에 주소를 둔 시민 누구나 (특히 기초수급자, 차상위, 어르신, 다자녀 가구는 필수 감면 대상).",
      action: "신분증과 최근 요금고지서를 지참하여 관할 읍·면·동 행정복지센터 또는 해당 공급사에 감면 신청을 진행하세요.",
      deadline: "연중 상시 신청 가능 (도시가스·에너지바우처는 동절기 전 집중 신청 권장).",
      preparation: "신분증, 최근 요금 영수증, 복지카드 또는 수급자 증명서.",
      where: "주소지 읍·면·동 행정복지센터 복지팀 또는 남양주시 상하수도관리센터 (031-590-4411)"
    },
    humanVerificationNotes: "가구분할 및 수도요금 누수감면은 현장 계량기 검침 결과에 따라 적용되므로, 관할 수도과에 유선 확인이 필요합니다."
  },
  {
    id: "res-welfare-01",
    category: "welfare",
    categoryLabel: "복지",
    title: "긴급복지지원제도 (생계·의료·주거 긴급지원)",
    organization: "보건복지부 / 관할 읍·면·동 주민센터",
    contact: "보건복지상담센터 국번없이 129 또는 관할 주민센터",
    onlineUrl: "https://www.bokjiro.go.kr",
    target: "실직, 중한 질병, 주소득자 사망 등으로 갑작스러운 위기에 처한 가구 (중위소득 75% 이하)",
    plainSummary: "갑자기 돈을 벌 수 없거나 큰 병에 걸려 당장 생활이 막막할 때 정부에서 생계비나 병원비를 긴급하게 지원해주는 제도입니다.",
    questions: {
      what: "위기상황으로 생계유지가 곤란한 저소득층에게 생계, 의료, 주거 등을 신속히 지원하는 사업입니다.",
      who: "주소득자의 사망/실직/휴·폐업, 중한 질병·부상 등으로 생계가 어려워진 분 (재산·소득 기준 충족 필요).",
      action: "가까운 주민센터 복지팀에 전화하거나 직접 방문하여 '긴급복지지원' 상담을 요청하세요.",
      deadline: "위기 사유 발생 시 수시 신청 가능 (발생 후 즉시 신청 권장).",
      preparation: "신분증, 통장 사본, 위기상황 증빙서류 (진단서, 퇴직증명서, 월세 밀린 내역 등).",
      where: "주소지 읍·면·동 주민센터 복지팀 또는 129(보건복지상담센터)"
    },
    humanVerificationNotes: "소득 및 금융재산 기준이 매년 개정되므로, 방문 전 주민센터 담당자에게 정확한 소득 인정액 기준을 유선 확인해야 합니다."
  },
  {
    id: "res-welfare-02",
    category: "welfare",
    categoryLabel: "복지",
    title: "노인맞춤돌봄서비스 (식사·안부·가사지원)",
    organization: "보건복지부 / 지역 노인복지관",
    contact: "주소지 읍·면·동 주민센터 또는 독거노인종합지원센터 (1661-2129)",
    target: "만 65세 이상 국민기초생활수급자, 차상위계층, 기초연금수급자 중 돌봄이 필요한 어르신",
    plainSummary: "혼자 사시거나 일상생활이 힘든 어르신 댁에 생활지원사가 정기적으로 방문하여 안부를 묻고 식사 및 외출을 도와드립니다.",
    questions: {
      what: "일상생활 영위가 어려운 취약노인에게 맞춤형 돌봄(안전안부확인, 생활교육, 가사지원 등)을 제공합니다.",
      who: "만 65세 이상 독거노인 또는 조손가구 등 돌봄 필요 어르신.",
      action: "신분증을 지참하고 관할 주민센터에 방문하거나 거동이 불편할 경우 전화로 찾아가는 상담을 신청하세요.",
      deadline: "연중 상시 신청 가능.",
      preparation: "신분증, 기초연금 수급 확인서(필요시).",
      where: "주소지 관할 읍·면·동 주민센터"
    },
    humanVerificationNotes: "돌봄 필요 등급 판정 결과에 따라 제공되는 서비스 시간과 종류(중점/일반)가 달라집니다."
  },
  {
    id: "res-health-01",
    category: "health",
    categoryLabel: "의료",
    title: "재난적의료비 지원사업",
    organization: "국민건강보험공단 / 보건복지부",
    contact: "국민건강보험공단 1577-1000",
    onlineUrl: "https://www.nhis.or.kr",
    target: "기준중위소득 100% 이하이며, 연간 본인부담 의료비가 연소득의 10%를 초과하는 경우",
    plainSummary: "암, 뇌혈관질환 등 큰 병으로 감당하기 힘든 병원비가 나왔을 때 본인부담금의 50~80%를 국가가 지원해주는 제도입니다.",
    questions: {
      what: "소득 대비 과도하게 발생한 본인부담 의료비의 일부를 환급 지원합니다.",
      who: "소득 하위 50%(중위소득 100% 이하) 가구 중 질환으로 고액 의료비가 발생한 자.",
      action: "퇴원 후(또는 최종진료일 다음날부터) 180일 이내에 국민건강보험공단 지사에 방문하여 신청하세요.",
      deadline: "퇴원일(진료일) 기준 180일 이내.",
      preparation: "진료비 영수증 원본, 진료비 세부내역서, 진단서, 가족관계증명서, 통장사본.",
      where: "국민건강보험공단 지사 방문 접수"
    },
    humanVerificationNotes: "실손보험금 수령액은 지원금 산정 시 공제되므로, 보험금 수령 여부를 먼저 확인해야 합니다."
  },
  {
    id: "res-job-01",
    category: "job",
    categoryLabel: "일자리",
    title: "국민취업지원제도 (구직촉진수당 및 취업지원)",
    organization: "고용노동부 / 고용복지플러스센터",
    contact: "고용노동부 고객상담센터 1350 또는 관할 고용센터",
    onlineUrl: "https://www.kua.go.kr",
    target: "15~69세 구직자 (저소득층, 청년, 중장년 등)",
    plainSummary: "취업을 준비하는 동안 매달 50만 원씩 6개월간 구직촉진수당을 받고, 1:1 맞춤형 취업 교육을 지원받는 제도입니다.",
    questions: {
      what: "취업지원서비스와 함께 저소득 구직자에게는 생계안정을 위한 구직촉진수당(최대 300만원)을 지급합니다.",
      who: "1유형(중위소득 60% 이하, 재산 4억원 이하) 및 2유형(청년·중장년 등).",
      action: "인터넷 '국민취업지원제도' 누리집에서 신청하거나 가까운 고용복지플러스센터에 방문하세요.",
      deadline: "연중 상시 신청 가능.",
      preparation: "취업지원신청서, 소득·재산 증빙서류 (온라인 신청 시 대부분 행정망 연계).",
      where: "관할 고용복지플러스센터 또는 온라인 신청"
    },
    humanVerificationNotes: "수당 지급 기간 중 월 소득(아르바이트 등)이 50만 원을 초과할 경우 수당 지급이 중단될 수 있습니다."
  },
  {
    id: "res-housing-01",
    category: "housing",
    categoryLabel: "주거",
    title: "맞춤형 주거급여 (임차료 및 집수리 지원)",
    organization: "국토교통부 / LH / 주민센터",
    contact: "마이홈 콜센터 1600-1004 또는 관할 주민센터",
    onlineUrl: "https://www.myhome.go.kr",
    target: "소득인정액이 기준중위소득 48% 이하인 가구",
    plainSummary: "월세를 내는 가구에는 매달 월세 지원금을 통장으로 입금해주고, 자기 집이 있는 분께는 낡은 집을 무료로 고쳐드립니다.",
    questions: {
      what: "기초생활보장제도의 일환으로, 취약계층의 주거안정을 위해 임차료를 보조하거나 주택 개보수를 지원합니다.",
      who: "소득인정액 기준중위소득 48% 이하 가구 (임차가구 또는 자가가구).",
      action: "주민등록지 주민센터를 방문하여 주거급여를 신청하세요.",
      deadline: "연중 상시 신청 가능.",
      preparation: "임대차계약서 사본, 신분증, 통장사본, 신청서.",
      where: "주민등록지 읍·면·동 주민센터"
    },
    humanVerificationNotes: "신청 후 LH에서 실제 임대차 현장 조사 및 주택 노후도 평가를 거쳐 지원 금액이 결정됩니다."
  },
  {
    id: "res-life-01",
    category: "life",
    categoryLabel: "생활지원",
    title: "에너지바우처 (난방비·전기요금 지원)",
    organization: "산업통상자원부 / 한국에너지공단",
    contact: "에너지바우처 콜센터 1600-3190 또는 관할 주민센터",
    onlineUrl: "https://www.energyv.or.kr",
    target: "생계·의료급여 수급자 중 노인, 장애인, 영유아, 임산부, 한부모가족 포함 가구",
    plainSummary: "여름철에는 전기요금을 깎아주고, 겨울철에는 가스·연탄·난방유를 결제할 수 있는 이용권을 지원해드립니다.",
    questions: {
      what: "에너지 취약계층에게 여름철 냉방 바우처와 겨울철 난방 바우처를 카드 형태로 지원합니다.",
      who: "기초생활수급자(생계·의료)이면서 세대원 중 노인/장애인/영유아/임산부 등이 있는 가구.",
      action: "주민센터 복지팀을 방문하여 실물카드(국민행복카드) 또는 요금차감 방식을 선택하여 신청하세요.",
      deadline: "매년 5월 ~ 12월 (지자체 고시 일정 확인 필요).",
      preparation: "신분증, 최근 전기요금 또는 도시가스 요금고지서.",
      where: "주민등록지 읍·면·동 주민센터"
    },
    humanVerificationNotes: "여름철 바우처 잔액은 겨울철 바우처로 이월하여 사용할 수 있습니다."
  }
];
