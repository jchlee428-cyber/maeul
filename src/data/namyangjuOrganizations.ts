/**
 * 경기도 남양주시 기관·단체 현황 데이터셋
 * 출처: 남양주시청 기관단체 현황 (https://www.nyj.go.kr/www/selectTnExcelInsttGrpSttusListU.do?key=2410&cpn=18)
 * 공공행정, 복지시설, 노인복지, 장애인단체, 자원봉사, 일자리 등 지역사회 문제 해결 연계망
 */

export interface OrganizationItem {
  id: string;
  name: string; // 기관/단체명
  category: "공공행정" | "노인복지" | "사회복지" | "보건의료" | "장애인" | "일자리" | "자원봉사" | "기타";
  department: string; // 담당부서
  phone: string; // 대표 전화번호
  fax?: string; // 팩스
  address: string; // 사무실 주소
  mainRole: string; // 주요 역할 및 지원 서비스
  website?: string;
}

export const namyangjuOrganizations: OrganizationItem[] = [
  {
    id: "NYJ-ORG-001",
    name: "남양주시복지재단",
    category: "사회복지",
    department: "복지정책과 / 기획경영팀",
    phone: "031-524-9830",
    address: "경기도 남양주시 다산순환로 20, 다산중앙공원 내",
    mainRole: "남양주시 취약계층 복지사각지대 발굴, 민관협력 복지자원 배분, 긴급 후원 연계",
    website: "https://www.nyjwf.or.kr"
  },
  {
    id: "NYJ-ORG-002",
    name: "남양주시노인복지관",
    category: "노인복지",
    department: "노인정책과 / 복지사업팀",
    phone: "031-595-5060",
    address: "경기도 남양주시 금곡로 43 (금곡동)",
    mainRole: "어르신 맞춤돌봄, 노인일자리 사업, 무료 급식 및 밑반찬 배달, 평생교육 프로그램 운영",
    website: "http://www.nyjsw.or.kr"
  },
  {
    id: "NYJ-ORG-003",
    name: "남양주시동부노인복지관",
    category: "노인복지",
    department: "노인정책과 / 화도권역팀",
    phone: "031-595-9988",
    address: "경기도 남양주시 화도읍 수레로 1259",
    mainRole: "동부권(화도·수동·호평·평내) 어르신 취약돌봄, 경로당 활성화, 치매예방 교실 운영",
    website: "https://www.dongbusenior.or.kr"
  },
  {
    id: "NYJ-ORG-004",
    name: "해피누리노인복지관",
    category: "노인복지",
    department: "노인정책과 / 진접권역팀",
    phone: "031-527-3100",
    address: "경기도 남양주시 진접읍 해밀예당1로 189",
    mainRole: "북부권(진접·오남·별내) 독거노인 안부 확인, 일상생활 지원, 결식 어르신 식사 연계",
    website: "http://www.js1004.kr"
  },
  {
    id: "NYJ-ORG-005",
    name: "남양주시자원봉사센터",
    category: "자원봉사",
    department: "자치행정과 / 자원봉사팀",
    phone: "031-595-1365",
    address: "경기도 남양주시 금곡로 115",
    mainRole: "1365 자원봉사자 배치, 거동불편 주민 병원동행 봉사단, 재난안전 봉사대 지원",
    website: "http://www.nyjvc.or.kr"
  },
  {
    id: "NYJ-ORG-006",
    name: "남양주 지역사회보장협의체",
    category: "사회복지",
    department: "복지정책과 / 민관협력팀",
    phone: "031-590-8947",
    address: "경기도 남양주시 경춘로 1037 (남양주시청 제1청사)",
    mainRole: "읍면동 복지사각지대 발굴, 희망케어센터 연계, 위기가구 긴급생계 심의 지원",
    website: "http://nyjwelfare.org"
  },
  {
    id: "NYJ-ORG-007",
    name: "남양주고용복지플러스센터 (일자리센터)",
    category: "일자리",
    department: "고용노동부 / 일자리정책과",
    phone: "031-560-1919",
    address: "경기도 남양주시 늘을2로 14번길 3 (호평동)",
    mainRole: "국민취업지원제도 수당 지급, 어르신·청년 구직상담, 복합 복지서비스 원스톱 연계",
    website: "https://gyeonggi.work.go.kr/namyangju"
  },
  {
    id: "NYJ-ORG-008",
    name: "남양주시 희망케어센터 (권역별 통합 복지)",
    category: "사회복지",
    department: "복지정책과 / 희망케어운영팀",
    phone: "031-590-8941",
    address: "동부(화도), 서부(다산·별내), 남부(와부), 북부(진접) 4개 권역 센터",
    mainRole: "남양주형 통합돌봄 시스템, 긴급 주거지원, 밑반찬 푸드마켓 바우처, 긴급생계비 지원",
    website: "https://hope.nyj.go.kr"
  },
  {
    id: "NYJ-ORG-009",
    name: "남양주시보건소 (치매안심센터 / 고혈압·당뇨병 등록교육센터)",
    category: "보건의료",
    department: "보건행정과 / 건강증진과",
    phone: "031-590-4048",
    address: "경기도 남양주시 다산중앙로82번안길 118",
    mainRole: "치매 조기 무료 선별검사, 혈압·혈당 관리, 만성질환자 약제비 지원, 방문건강관리",
    website: "https://www.nyj.go.kr/health"
  },
  {
    id: "NYJ-ORG-010",
    name: "남양주시 교통약자이동지원센터 (드림콜)",
    category: "장애인",
    department: "대중교통과 / 교통약자이동지원팀",
    phone: "1666-5522",
    address: "경기도 남양주시 경춘로 1037",
    mainRole: "중증장애인, 거동불편 노약자 및 임산부 전용 특별교통수단(휠체어 리프트 차량 및 바우처 택시)",
    website: "https://dreamcall.nyj.go.kr"
  }
];
