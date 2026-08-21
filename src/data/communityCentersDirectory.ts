/**
 * 남양주시 (16개 읍·면·동) 및 구리시 (8개 동) 관내 전체 행정복지센터(주민센터) 공식 디렉토리
 * 출처: 남양주시청 및 구리시청 읍면동 행정망
 */

export interface CommunityCenterInfo {
  name: string; // 공식 기관명 (예: 평내동 행정복지센터)
  aliases: string[]; // 약칭 및 검색 키워드
  phone: string; // 대표 민원실 전화
  welfarePhone?: string; // 복지지원팀 / 찾아가는 복지팀 직통전화
  address: string; // 도로명 주소
  region: "남양주시" | "구리시";
}

export const communityCentersDirectory: CommunityCenterInfo[] = [
  // ================= 1. 남양주시 (16개 읍·면·동) =================
  {
    name: "평내동 행정복지센터",
    aliases: ["평내동", "평내동주민센터", "평내주민센터", "평내동사무소", "평내행정복지센터"],
    phone: "031-590-4960",
    welfarePhone: "031-590-4961",
    address: "경기도 남양주시 평내로 15 (평내동)",
    region: "남양주시"
  },
  {
    name: "호평동 행정복지센터",
    aliases: ["호평동", "호평동주민센터", "호평주민센터", "호평동사무소", "호평행정복지센터"],
    phone: "031-590-4900",
    welfarePhone: "031-590-4901",
    address: "경기도 남양주시 늘을3로 67 (호평동)",
    region: "남양주시"
  },
  {
    name: "금곡동 행정복지센터",
    aliases: ["금곡동", "금곡동주민센터", "금곡주민센터", "금곡동사무소", "금곡행정복지센터"],
    phone: "031-590-4840",
    welfarePhone: "031-590-4841",
    address: "경기도 남양주시 금곡로 77 (금곡동)",
    region: "남양주시"
  },
  {
    name: "다산1동 행정복지센터",
    aliases: ["다산1동", "다산1동주민센터", "다산1동사무소", "다산1행정복지센터", "다산동주민센터"],
    phone: "031-590-4800",
    welfarePhone: "031-590-4801",
    address: "경기도 남양주시 다산중앙로 7 (다산동)",
    region: "남양주시"
  },
  {
    name: "다산2동 주민센터",
    aliases: ["다산2동", "다산2동주민센터", "다산2동사무소", "다산2주민센터", "지금동주민센터", "지금동사무소"],
    phone: "031-590-4820",
    welfarePhone: "031-590-4821",
    address: "경기도 남양주시 다산지금로 16번길 19 (다산동)",
    region: "남양주시"
  },
  {
    name: "양정동 주민센터",
    aliases: ["양정동", "양정동주민센터", "양정주민센터", "양정동사무소"],
    phone: "031-590-4860",
    welfarePhone: "031-590-4861",
    address: "경기도 남양주시 일패로 15-2 (일패동)",
    region: "남양주시"
  },
  {
    name: "와부읍 행정복지센터",
    aliases: ["와부읍", "와부주민센터", "와부읍사무소", "덕소주민센터", "덕소동사무소", "와부행정복지센터"],
    phone: "031-590-4980",
    welfarePhone: "031-590-4981",
    address: "경기도 남양주시 와부읍 덕소로 97",
    region: "남양주시"
  },
  {
    name: "진접읍 행정복지센터",
    aliases: ["진접읍", "진접주민센터", "진접읍사무소", "진접행정복지센터", "장현주민센터"],
    phone: "031-590-4920",
    welfarePhone: "031-590-4921",
    address: "경기도 남양주시 진접읍 장현로 57",
    region: "남양주시"
  },
  {
    name: "화도읍 행정복지센터",
    aliases: ["화도읍", "화도주민센터", "화도읍사무소", "마석주민센터", "화도행정복지센터"],
    phone: "031-590-4880",
    welfarePhone: "031-590-4881",
    address: "경기도 남양주시 화도읍 비룡로 59",
    region: "남양주시"
  },
  {
    name: "진건읍 행정복지센터",
    aliases: ["진건읍", "진건주민센터", "진건읍사무소", "사릉주민센터", "진건행정복지센터"],
    phone: "031-590-4940",
    welfarePhone: "031-590-4941",
    address: "경기도 남양주시 진건읍 진건오남로 43-16",
    region: "남양주시"
  },
  {
    name: "오남읍 행정복지센터",
    aliases: ["오남읍", "오남주민센터", "오남읍사무소", "오남행정복지센터", "양지리주민센터"],
    phone: "031-590-4930",
    welfarePhone: "031-590-4931",
    address: "경기도 남양주시 오남읍 진건오남로 508",
    region: "남양주시"
  },
  {
    name: "별내동 주민센터",
    aliases: ["별내동", "별내동주민센터", "별내주민센터", "별내동사무소", "별내행정복지센터"],
    phone: "031-590-4990",
    welfarePhone: "031-590-4991",
    address: "경기도 남양주시 별내중앙로 109 (별내동)",
    region: "남양주시"
  },
  {
    name: "별내면 주민센터",
    aliases: ["별내면", "별내면주민센터", "별내면사무소", "청학리주민센터"],
    phone: "031-590-4950",
    welfarePhone: "031-590-4951",
    address: "경기도 남양주시 별내면 청학로 68",
    region: "남양주시"
  },
  {
    name: "퇴계원읍 행정복지센터",
    aliases: ["퇴계원읍", "퇴계원주민센터", "퇴계원읍사무소", "퇴계원행정복지센터"],
    phone: "031-590-4910",
    welfarePhone: "031-590-4911",
    address: "경기도 남양주시 퇴계원읍 퇴계원로 54",
    region: "남양주시"
  },
  {
    name: "수동면 주민센터",
    aliases: ["수동면", "수동면주민센터", "수동면사무소", "수동주민센터"],
    phone: "031-590-4890",
    welfarePhone: "031-590-4891",
    address: "경기도 남양주시 수동면 비룡로 803",
    region: "남양주시"
  },
  {
    name: "조안면 주민센터",
    aliases: ["조안면", "조안면주민센터", "조안면사무소", "조안주민센터"],
    phone: "031-590-4870",
    welfarePhone: "031-590-4871",
    address: "경기도 남양주시 조안면 북한강로 855",
    region: "남양주시"
  },

  // ================= 2. 구리시 (8개 동) =================
  {
    name: "인창동 행정복지센터",
    aliases: ["인창동", "인창동주민센터", "인창주민센터", "인창동사무소"],
    phone: "031-550-2601",
    welfarePhone: "031-550-2605",
    address: "경기도 구리시 건원대로34번길 90 (인창동)",
    region: "구리시"
  },
  {
    name: "교문1동 행정복지센터",
    aliases: ["교문1동", "교문1동주민센터", "교문1동사무소", "교문동주민센터"],
    phone: "031-550-2602",
    welfarePhone: "031-550-2606",
    address: "경기도 구리시 아차산로 453 (교문동)",
    region: "구리시"
  },
  {
    name: "교문2동 행정복지센터",
    aliases: ["교문2동", "교문2동주민센터", "교문2동사무소"],
    phone: "031-550-2603",
    welfarePhone: "031-550-2607",
    address: "경기도 구리시 장자대로 66 (교문동)",
    region: "구리시"
  },
  {
    name: "수택1동 행정복지센터",
    aliases: ["수택1동", "수택1동주민센터", "수택1동사무소", "수택동주민센터"],
    phone: "031-550-2604",
    welfarePhone: "031-550-2608",
    address: "경기도 구리시 안골로 64 (수택동)",
    region: "구리시"
  },
  {
    name: "수택2동 행정복지센터",
    aliases: ["수택2동", "수택2동주민센터", "수택2동사무소"],
    phone: "031-550-2609",
    welfarePhone: "031-550-2610",
    address: "경기도 구리시 원수택로 52 (수택동)",
    region: "구리시"
  },
  {
    name: "수택3동 행정복지센터",
    aliases: ["수택3동", "수택3동주민센터", "수택3동사무소", "토평동주민센터"],
    phone: "031-550-2611",
    welfarePhone: "031-550-2612",
    address: "경기도 구리시 체육관로 131 (수택동)",
    region: "구리시"
  },
  {
    name: "동구동 행정복지센터",
    aliases: ["동구동", "동구동주민센터", "동구주민센터", "동구동사무소"],
    phone: "031-550-2613",
    welfarePhone: "031-550-2614",
    address: "경기도 구리시 동구릉로 136번길 57 (인창동)",
    region: "구리시"
  },
  {
    name: "갈매동 행정복지센터",
    aliases: ["갈매동", "갈매동주민센터", "갈매주민센터", "갈매동사무소"],
    phone: "031-550-2615",
    welfarePhone: "031-550-2616",
    address: "경기도 구리시 갈매순환로 126 (갈매동)",
    region: "구리시"
  }
];

/**
 * 읍면동 행정복지센터 스마트 검색 함수
 * 대중교통(버스/전철), 소방서, 경찰서, 병원, 목적지 이동 등 행정복지센터와 무관한 질문은 절대 가로채지 않습니다.
 */
export function findCommunityCenterInfo(query: string): CommunityCenterInfo | null {
  const cleanQ = query.replace(/[\s\-_,.]/g, "").toLowerCase();

  // 1. 대중교통, 소방서, 경찰서, 길찾기 등 다른 시설/교통 질의가 섞여 있는 경우 즉시 제외 (오매칭 원천 차단)
  const isOtherIntent = (
    cleanQ.includes("버스") ||
    cleanQ.includes("지하철") ||
    cleanQ.includes("전철") ||
    cleanQ.includes("소방서") ||
    cleanQ.includes("경찰서") ||
    cleanQ.includes("가는") ||
    cleanQ.includes("가는법") ||
    cleanQ.includes("가는방법") ||
    cleanQ.includes("몇번") ||
    cleanQ.includes("잠실") ||
    cleanQ.includes("강남") ||
    cleanQ.includes("청량리") ||
    cleanQ.includes("병원") ||
    cleanQ.includes("약국") ||
    cleanQ.includes("마트")
  );

  if (isOtherIntent) {
    return null;
  }

  // 2. 관공서 관련 키워드가 포함되어 있거나, 지명 단독으로 물어본 경우에만 매칭
  const isGovKeyword = (
    cleanQ.includes("주민센터") ||
    cleanQ.includes("행정복지센터") ||
    cleanQ.includes("동사무소") ||
    cleanQ.includes("민원실") ||
    cleanQ.includes("복지팀") ||
    cleanQ.includes("등본") ||
    cleanQ.includes("초본") ||
    cleanQ.includes("인감") ||
    cleanQ.includes("전입신고") ||
    cleanQ.includes("전화번호") ||
    cleanQ.includes("연락처") ||
    cleanQ.length <= 8
  );

  if (!isGovKeyword) {
    return null;
  }

  for (const center of communityCentersDirectory) {
    if (cleanQ.includes(center.name.replace(/\s/g, "").toLowerCase())) {
      return center;
    }
    for (const alias of center.aliases) {
      if (cleanQ.includes(alias.replace(/\s/g, "").toLowerCase())) {
        return center;
      }
    }
  }

  return null;
}
