import { findSchoolInfo } from "@/data/schoolsDirectory";
import { getSubwayArrivalInfo, localSubwayStations } from "./seoulSubwayService";
import { getRealtimeBusInfo, localBusRoutes } from "./precisionBusService";

export interface SimpleQueryResponse {
  isSimple: boolean;
  replyText: string;
}

// 관내 주요 행정/공공/치안/문화 시설 데이터베이스
const localPublicFacilityDB: Record<string, { phone: string; address: string; extra?: string }> = {
  // 교육청
  "구리남양주교육지원청": { phone: "031-550-6114", address: "경기도 구리시 안골로 48 (교문동)", extra: "구리시·남양주시 관내 유·초·중·고 학사 및 전학 배정 총괄" },
  "교육지원청": { phone: "031-550-6114", address: "경기도 구리시 안골로 48 (교문동)", extra: "경기도구리남양주교육지원청" },

  // 경찰서
  "남양주경찰서": { phone: "031-579-8324", address: "경기도 남양주시 경춘로 514 (금곡동)", extra: "금곡·평내·호평·와부·화도 권역 관할 (민원 182)" },
  "남양주북부경찰서": { phone: "031-579-9324", address: "경기도 남양주시 진접읍 진건오남로 1009", extra: "진접·오남·별내 권역 관할 (민원 182)" },
  "구리경찰서": { phone: "031-569-0112", address: "경기도 구리시 아차산로 363 (교문동)", extra: "구리시 전역 치안 관할" },

  // 소방서
  "남양주소방서": { phone: "031-590-0314", address: "경기도 남양주시 가운로 72 (다산동)", extra: "응급 화재·구조 신고 119" },
  "구리소방서": { phone: "031-570-6314", address: "경기도 구리시 인창동 675", extra: "응급 화재·구조 신고 119" },

  // 우체국
  "남양주우체국": { phone: "031-590-4114", address: "경기도 남양주시 사릉로 28 (금곡동)", extra: "우편·택배·금융" },
  "구리우체국": { phone: "031-550-7114", address: "경기도 구리시 체육관로 164", extra: "우편·택배·금융" },

  // 도서관
  "정약용도서관": { phone: "031-590-2580", address: "경기도 남양주시 다산중앙로82번안길 138 (다산동)", extra: "남양주시 대표 도서관" },
  "금곡도서관": { phone: "031-590-8980", address: "경기도 남양주시 금곡로 85-11", extra: "시립도서관" },
  "화도도서관": { phone: "031-590-4581", address: "경기도 남양주시 화도읍 비룡로 57", extra: "시립도서관" },
  "진접도서관": { phone: "031-590-5310", address: "경기도 남양주시 진접읍 해밀예당1로 43", extra: "시립도서관" },
  "별빛도서관": { phone: "031-590-8800", address: "경기도 남양주시 별내중앙로 109", extra: "시립도서관" },
  "와부도서관": { phone: "031-590-8970", address: "경기도 남양주시 와부읍 와부로 49", extra: "시립도서관" },
  "인창도서관": { phone: "031-550-2472", address: "경기도 구리시 건원대로34번길 90", extra: "구리시립도서관" },
  "토평도서관": { phone: "031-550-8697", address: "경기도 구리시 장자대로 100", extra: "구리시립도서관" }
};

/**
 * 모든 간단 질의(버스, 지하철, 학교, 관공서, 전화번호, 일상 대화 등) 판별 및 즉시 응답 생성
 */
export async function checkAndHandleSimpleQueryAsync(userQuery: string): Promise<SimpleQueryResponse | null> {
  const q = userQuery.trim().toLowerCase();
  const rawQ = userQuery.trim();

  // 1. [초정밀 버스 실시간 위치 및 노선 질의]
  if (
    q.includes("버스") || q.includes("정류장") || q.includes("정류소") ||
    q.includes("땡큐") || q.includes("m23") || q.includes("광역버스") || q.includes("마을버스") ||
    Object.keys(localBusRoutes).some((r) => q.includes(r))
  ) {
    const busReply = await getRealtimeBusInfo(rawQ);
    return {
      isSimple: true,
      replyText: busReply
    };
  }

  // 2. [지하철 / 전철 / 역 도착정보 질의]
  if (
    q.includes("지하철") || q.includes("전철") || q.includes("열차") || q.includes("기차") ||
    q.includes("별내선") || q.includes("진접선") || q.includes("경춘선") || q.includes("경의중앙선") ||
    Object.keys(localSubwayStations).some((station) => q.includes(station))
  ) {
    let targetStation = "구리";
    for (const st of Object.keys(localSubwayStations)) {
      if (q.includes(st)) {
        targetStation = st;
        break;
      }
    }

    const subwayReply = await getSubwayArrivalInfo(targetStation);
    return {
      isSimple: true,
      replyText: subwayReply
    };
  }

  // 동기 판별기 호출
  return checkAndHandleSimpleQuery(userQuery);
}

/**
 * 동기식 간단 질의 처리기
 */
export function checkAndHandleSimpleQuery(userQuery: string): SimpleQueryResponse | null {
  const q = userQuery.trim().toLowerCase();
  const rawQ = userQuery.trim();

  // [중요] 10단계 복합 지원 계획이 필요한 질의인지 확인 (신청, 생계위기, 수술비지원 등)
  const isComplexCaseQuery =
    (q.includes("신청") || q.includes("지원받고") || q.includes("지원금") || q.includes("생계비") || q.includes("수술비") || q.includes("월세가 막막") || q.includes("실직") || q.includes("돌봄이 필요") || q.includes("바우처 신청") || q.includes("구직촉진수당") || q.includes("10단계")) &&
    !q.includes("전화번호") && !q.includes("연락처") && !q.includes("몇번") && !q.includes("전화") && !q.includes("지하철");

  if (isComplexCaseQuery) {
    // 10단계 RAG로 넘김
    return null;
  }

  // 1. [최우선] 구리시 및 남양주시 전체 초·중·고등학교 정확 검색
  const matchedSchool = findSchoolInfo(rawQ);
  if (matchedSchool) {
    return {
      isSimple: true,
      replyText: `문의하신 **${matchedSchool.name}** 공식 연락처 및 정보입니다! 🏫

📍 **${matchedSchool.name}**
- 📞 **교무실 (대표전화)**: **${matchedSchool.phone}**
${matchedSchool.adminPhone ? `- 📞 **행정실**: **${matchedSchool.adminPhone}**\n` : ""}- 🏢 **주소**: ${matchedSchool.address}
- 🏛️ **소속**: 경기도구리남양주교육지원청

💡 학사 일정, 전학 및 입학 관련 문의는 위 교무실 또는 교육지원청(📞 031-550-6114)으로 문의하시면 됩니다.`
    };
  }

  // 2. 학교 관련 질의이나 특정 학교가 DB에 없는 경우의 안전한 100% 팩트 안내 (절대 엉뚱한 학교를 예시로 들지 않음!)
  if (q.includes("초등") || q.includes("중학") || q.includes("고등") || q.includes("학교")) {
    if (q.includes("전화") || q.includes("번호") || q.includes("연락") || q.includes("어디") || q.includes("위치") || q.length <= 15) {
      return {
        isSimple: true,
        replyText: `문의하신 학교 연락처 안내입니다! 🏫

📍 **경기도구리남양주교육지원청**: 📞 **031-550-6114**
   - 주소: 경기도 구리시 안골로 48 (교문동)
   - 주요업무: 구리시·남양주시 관내 모든 초·중·고교 학사, 전학 배정, 전화번호 안내

📍 **전국 학교알리미 / 114 전화번호 안내**: 📞 **국번없이 114**

💡 찾으시는 학교의 정확한 명칭(예: *인창초등학교*, *금곡중학교*, *평내고등학교*)을 말씀해주시면 직통 전화번호와 주소를 즉시 알려드립니다!`
      };
    }
  }

  // 3. 지하철/전철 질의 (동기 fallback)
  if (
    q.includes("지하철") || q.includes("전철") || q.includes("열차") ||
    Object.keys(localSubwayStations).some((st) => q.includes(st) && (q.includes("역") || q.includes("도착") || q.includes("시간")))
  ) {
    let stationName = "구리";
    for (const st of Object.keys(localSubwayStations)) {
      if (q.includes(st)) {
        stationName = st;
        break;
      }
    }
    const meta = localSubwayStations[stationName];
    return {
      isSimple: true,
      replyText: `🚊 **${stationName}역 지하철 운행 안내**

📍 **노선**: **${meta ? meta.line : "수도권 전철"}**
🏢 **위치**: ${meta ? meta.address : "해당 전철역"}
📞 **고객센터**: ${meta ? meta.phone : "1544-7788"} (한국철도공사 코레일 / 서울교통공사)

💡 만 65세 이상 어르신은 **G-PASS 어르신 카드**로 수도권 전철을 **100% 무료(무임)**로 이용하실 수 있습니다.`
    };
  }

  // 4. 주요 행정/치안/도서관 시설 매칭
  for (const [key, info] of Object.entries(localPublicFacilityDB)) {
    if (q.includes(key.toLowerCase())) {
      return {
        isSimple: true,
        replyText: `문의하신 **${key}** 공식 연락처입니다! 😊

📍 **${key}**
- 📞 **대표 전화번호**: **${info.phone}**
- 🏢 **주소**: ${info.address}
- ℹ️ **안내**: ${info.extra || "관련 문의는 위 대표번호로 전화하시면 신속히 안내받으실 수 있습니다."}`
      };
    }
  }

  // 5. 보건소 / 치매안심센터 질의
  if (q.includes("보건소") || q.includes("보건지소") || q.includes("치매안심센터") || q.includes("보건센터")) {
    return {
      isSimple: true,
      replyText: `보건소 연락처를 안내해드릴게요! 😊

📍 **남양주시보건소 (다산동 본소)**: 📞 **031-590-4048** (다산중앙로82번안길 118)
📍 **남양주시 풍양보건소 (진접·오남·별내)**: 📞 **031-590-5340** (진접읍 해밀예당1로 43)
📍 **남양주시 동부보건센터 (화도·수동·호평)**: 📞 **031-590-4740** (화도읍 비룡로 57)
📍 **구리시보건소**: 📞 **031-550-2441** (구리시 안골로 48)
📍 **보건복지상담센터 (전국)**: 📞 **국번없이 129** (24시간)`
    };
  }

  // 6. 상하수도 / 수도세 / 누수 질의
  if (q.includes("수도") || q.includes("상수도") || q.includes("누수")) {
    return {
      isSimple: true,
      replyText: `남양주시 상하수도 관련 연락처를 안내해드릴게요! 🚰

📍 **남양주시 상하수도관리센터 수도과**: 📞 **031-590-4411**
📍 **수도요금 고지 및 이사정산**: 📞 **031-590-4412**
📍 **상수도 누수 신고 및 긴급 보수**: 📞 **031-590-4415**
📍 **하수도 및 정화조 청소**: 📞 **031-590-4441**`
    };
  }

  // 7. 도시가스 / 난방 / 전기 질의
  if (q.includes("도시가스") || q.includes("가스회사") || q.includes("예스코") || q.includes("대륜") || q.includes("한전") || q.includes("전기요금")) {
    return {
      isSimple: true,
      replyText: `에너지 공급기관 고객센터 연락처입니다! ⚡🔥

📍 **예스코 (남양주 남부·서부 / 구리시)**: 📞 **1544-3131**
📍 **대륜E&S (남양주 북부)**: 📞 **1566-6116**
📍 **한국전력공사 (한전 전기요금/고장)**: 📞 **국번없이 123**
📍 **에너지바우처 안내 콜센터**: 📞 **1600-3190**`
    };
  }

  // 8. 교통약자 이동지원 / 드림콜 / 택시 질의
  if (q.includes("드림콜") || q.includes("교통약자") || q.includes("장애인택시") || q.includes("바우처택시")) {
    return {
      isSimple: true,
      replyText: `남양주시 교통약자 이동지원(드림콜) 연락처입니다! 🚕

📍 **남양주시 교통약자이동지원센터 (드림콜)**: 📞 **1666-5522**
   - 이용대상: 중증장애인, 거동불편 만 65세 이상 어르신, 임산부
   - 이용요금: 기본 10km 1,500원 (초과 5km당 100원)
   - 운영시간: 24시간 연중무휴`
    };
  }

  // 9. 복지관 / 희망케어센터 / 노인복지관 질의
  if (q.includes("복지관") || q.includes("희망케어") || q.includes("자원봉사") || q.includes("복지재단")) {
    return {
      isSimple: true,
      replyText: `주요 복지관 및 지원센터 연락처입니다! 😊

📍 **남양주시복지재단**: 📞 **031-524-9830** (다산순환로 20)
📍 **남양주시노인복지관 (금곡 본관)**: 📞 **031-595-5060**
📍 **남양주시동부노인복지관 (화도)**: 📞 **031-595-9988**
📍 **해피누리노인복지관 (진접)**: 📞 **031-527-3100**
📍 **남양주시 희망케어센터 (통합복지)**: 📞 **031-590-8941**
📍 **남양주시자원봉사센터**: 📞 **031-595-1365**`
    };
  }

  // 10. 주민센터 / 시청 / 행정복지센터 질의
  if (q.includes("주민센터") || q.includes("행정복지센터") || q.includes("동사무소") || q.includes("시청")) {
    return {
      isSimple: true,
      replyText: `행정기관 대표 연락처입니다! 🏛️

📍 **남양주시청 대표 콜센터**: 📞 **031-590-2114**
📍 **구리시청 대표 콜센터**: 📞 **031-557-1010**
📍 **정부 민원 안내 콜센터**: 📞 **국번없이 110**
📍 **보건복지상담센터**: 📞 **국번없이 129**`
    };
  }

  // 11. 긴급 / 비상 연락처
  if (q.includes("119") || q.includes("112") || q.includes("응급") || q.includes("긴급전화") || q.includes("비상") || q.includes("위급")) {
    return {
      isSimple: true,
      replyText: `🚨 **긴급 비상 연락처 안내**

🚑 **화재·구조·응급환자**: 📞 **119** (즉시 출동)
👮 **범죄 신고 및 경찰**: 📞 **112**
📞 **보건복지상담센터**: 📞 **129**
📞 **정신건강 위기상담**: 📞 **1577-0199** (24시간)
📞 **교통약자 이동지원 (드림콜)**: 📞 **1666-5522**`
    };
  }

  // 12. 일반적인 "전화번호", "연락처 모음" 단답형 질의
  if (q.includes("전화번호") || q.includes("연락처") || q.includes("번호") || q.includes("어디") || q.includes("위치") || q.length <= 10) {
    return {
      isSimple: true,
      replyText: `"${rawQ}"에 대해 안내해드릴게요! 😊

📍 **남양주시 대표 콜센터**: 📞 **031-590-2114**
📍 **구리남양주교육지원청 (학교/전학)**: 📞 **031-550-6114**
📍 **보건복지상담센터 (복지·의료)**: 📞 **국번없이 129**
📍 **정부 민원 안내 콜센터**: 📞 **국번없이 110**
📍 **남양주시보건소**: 📞 **031-590-4048**
🚨 **응급·구조 (소방서)**: 📞 **119**

궁금하신 특정 학교(예: *인창초등학교*), 기관, 병원이나 시설 명칭을 말씀해주시면 정확한 직통 번호를 바로 알려드립니다!`
    };
  }

  // 13. 인사 및 일상
  if (q === "안녕" || q === "안녕하세요" || q === "반가워" || q === "하이" || q === "반갑습니다") {
    return {
      isSimple: true,
      replyText: `안녕하세요! 반갑습니다. 저는 지역사회 도우미 **마을지기**예요. 😊

어려운 일이 있으시거나 학교·기관 전화번호, 복지 혜택, 병원비, 공공요금 등 무엇이든 편하게 물어보세요!`
    };
  }

  if (q.includes("고마워") || q.includes("감사합니다") || q.includes("수고했어") || q.includes("고맙습니다")) {
    return {
      isSimple: true,
      replyText: `도움이 되셨다니 정말 기뻐요! 🥰 언제든 궁금한 점이 생기시면 편하게 찾아주세요. 오늘도 행복한 하루 보내세요!`
    };
  }

  return null;
}
