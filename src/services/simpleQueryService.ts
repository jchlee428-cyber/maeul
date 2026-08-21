import { findSchoolInfo } from "@/data/schoolsDirectory";
import { findCommunityCenterInfo } from "@/data/communityCentersDirectory";
import { getSubwayArrivalInfo, localSubwayStations } from "./seoulSubwayService";
import { getRealtimeBusInfo, localBusRoutes } from "./precisionBusService";
import { generateAISearchFallbackReply } from "./aiSearchFallbackService";

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
 * 모든 간단 질의(행정복지센터, 버스, 지하철, 학교, 관공서, 전화번호, 일상 대화 등) 판별 및 즉시 응답 생성
 */
export async function checkAndHandleSimpleQueryAsync(userQuery: string): Promise<SimpleQueryResponse | null> {
  const q = userQuery.trim().toLowerCase();
  const rawQ = userQuery.trim();

  // [중요] 10단계 복합 지원 계획이 필요한 질의인지 확인 (신청, 생계위기, 수술비지원 등)
  const isComplexCaseQuery =
    (q.includes("신청") || q.includes("지원받고") || q.includes("지원금") || q.includes("생계비") || q.includes("수술비") || q.includes("월세가 막막") || q.includes("실직") || q.includes("돌봄이 필요") || q.includes("바우처 신청") || q.includes("구직촉진수당") || q.includes("10단계")) &&
    !q.includes("전화번호") && !q.includes("연락처") && !q.includes("몇번") && !q.includes("전화") && !q.includes("지하철") && !q.includes("주민센터");

  if (isComplexCaseQuery) {
    return null;
  }

  // 1. [최우선] 남양주시 및 구리시 읍·면·동 행정복지센터(주민센터) 정확 검색
  const matchedCenter = findCommunityCenterInfo(rawQ);
  if (matchedCenter) {
    return {
      isSimple: true,
      replyText: `문의하신 **${matchedCenter.name}** 공식 연락처 및 위치 안내입니다! 🏛️

📍 **${matchedCenter.name}** (${matchedCenter.region})
- 📞 **대표 민원실**: **${matchedCenter.phone}** (등초본·인감·가족관계·전입신고)
${matchedCenter.welfarePhone ? `- 📞 **복지지원팀 / 맞춤형복지팀**: **${matchedCenter.welfarePhone}** (복지상담·생계급여·에너지바우처)\n` : ""}- 🏢 **주소**: ${matchedCenter.address}

💡 *운영시간: 평일 오전 9시 ~ 오후 6시 (점심시간 12:00 ~ 13:00 교대 근무)*
복지 급여나 긴급 지원 신청은 위 **복지지원팀**으로 전화하시면 친절히 안내받으실 수 있습니다.`
    };
  }

  // 2. [초정밀 버스 실시간 위치 및 노선 질의]
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

  // 3. [지하철 / 전철 / 역 도착정보 질의]
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

  // 4. [구리·남양주 초·중·고교 정확 검색]
  const matchedSchool = findSchoolInfo(rawQ);
  if (matchedSchool) {
    return {
      isSimple: true,
      replyText: `문의하신 **${matchedSchool.name}** 공식 연락처 및 정보입니다! 🏫

📍 **${matchedSchool.name}**
- 📞 **교무실 (대표전화)**: **${matchedSchool.phone}**
${matchedSchool.adminPhone ? `- 📞 **행정실**: **${matchedSchool.adminPhone}**\n` : ""}- 🏢 **주소**: ${matchedSchool.address}
- 🏛️ **소속**: 경기도구리남양주교육지원청 (📞 031-550-6114)`
    };
  }

  // 5. 동기 판별기 호출
  const syncResult = checkAndHandleSimpleQuery(userQuery);
  if (syncResult && syncResult.isSimple) {
    return syncResult;
  }

  // 6. [AI 스마트 검색 폴백 엔진 (Gemini / ChatGPT 인텔리전스)]
  // 내부 DB에 미등록된 임의의 시설/위치/정보 질의 시 실시간 AI 지식망으로 응답 생성
  const aiFallbackText = await generateAISearchFallbackReply(rawQ);
  return {
    isSimple: true,
    replyText: aiFallbackText
  };
}

/**
 * 동기식 간단 질의 처리기
 */
export function checkAndHandleSimpleQuery(userQuery: string): SimpleQueryResponse | null {
  const q = userQuery.trim().toLowerCase();
  const rawQ = userQuery.trim();

  // 1. 행정복지센터 동기 매칭
  const matchedCenter = findCommunityCenterInfo(rawQ);
  if (matchedCenter) {
    return {
      isSimple: true,
      replyText: `문의하신 **${matchedCenter.name}** 공식 연락처입니다! 🏛️

📍 **${matchedCenter.name}** (${matchedCenter.region})
- 📞 **대표 민원실**: **${matchedCenter.phone}**
${matchedCenter.welfarePhone ? `- 📞 **복지지원팀**: **${matchedCenter.welfarePhone}**\n` : ""}- 🏢 **주소**: ${matchedCenter.address}`
    };
  }

  // 2. 학교 검색
  const matchedSchool = findSchoolInfo(rawQ);
  if (matchedSchool) {
    return {
      isSimple: true,
      replyText: `문의하신 **${matchedSchool.name}** 공식 연락처입니다! 🏫

📍 **${matchedSchool.name}**
- 📞 **교무실**: **${matchedSchool.phone}**
${matchedSchool.adminPhone ? `- 📞 **행정실**: **${matchedSchool.adminPhone}**\n` : ""}- 🏢 **주소**: ${matchedSchool.address}`
    };
  }

  // 3. 주요 시설 매칭
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

  // 4. 보건소
  if (q.includes("보건소") || q.includes("보건지소") || q.includes("치매안심센터")) {
    return {
      isSimple: true,
      replyText: `보건소 연락처를 안내해드릴게요! 😊

📍 **남양주시보건소 (다산동 본소)**: 📞 **031-590-4048** (다산중앙로82번안길 118)
📍 **남양주시 풍양보건소 (진접·오남·별내)**: 📞 **031-590-5340**
📍 **남양주시 동부보건센터 (화도·수동·호평)**: 📞 **031-590-4740**
📍 **구리시보건소**: 📞 **031-550-2441**
📍 **보건복지상담센터 (전국)**: 📞 **국번없이 129**`
    };
  }

  // 5. 수도 / 가스 / 전기
  if (q.includes("수도") || q.includes("누수")) {
    return {
      isSimple: true,
      replyText: `남양주시 상하수도 관련 연락처를 안내해드릴게요! 🚰

📍 **남양주시 수도과 (요금/고지)**: 📞 **031-590-4411**
📍 **상수도 누수 신고 및 긴급 보수**: 📞 **031-590-4415**
📍 **하수도 및 정화조 청소**: 📞 **031-590-4441**`
    };
  }

  // 6. 긴급 / 비상
  if (q.includes("119") || q.includes("112") || q.includes("응급") || q.includes("긴급전화") || q.includes("비상")) {
    return {
      isSimple: true,
      replyText: `🚨 **긴급 비상 연락처 안내**

🚑 **화재·구조·응급환자**: 📞 **119** (즉시 출동)
👮 **범죄 신고 및 경찰**: 📞 **112**
📞 **보건복지상담센터**: 📞 **129**
📞 **교통약자 이동지원 (드림콜)**: 📞 **1666-5522**`
    };
  }

  // 7. 일반 도움 요청 및 길라잡이 질의
  if (q.includes("도움") || q.includes("상담") || q.includes("안내") || q.includes("알려줘") || q.length <= 8) {
    return {
      isSimple: true,
      replyText: `어려우신 일이 있으신가요? 마을지기가 친절하게 도와드릴게요! 😊

📍 **주요 안내 분야**:
- 🏛️ **읍·면·동 주민센터**: *평내동 주민센터*, *호평동*, *다산동*, *와부읍*, *인창동* 등 직통 연락처
- 🚌 **실시간 버스**: *165번 버스*, *땡큐10번*, *M2316*, *남양주 버스*
- 🚊 **실시간 전철**: *구리역 지하철*, *평내호평역*, *다산역 8호선*, *진접역*
- 🏫 **학교 정보**: *인창초등학교*, *금곡중학교*, *평내고등학교* 등
- 💡 **복지 및 지원금**: *생계비 지원*, *병원비 수술비*, *에너지바우처*, *노인돌봄*

찾으시는 질문을 입력창에 적으시거나 아래 **[🎙️ 목소리로 말하기]**를 눌러 말씀해보세요!`
    };
  }

  // 8. 인사 및 감사
  if (q === "안녕" || q === "안녕하세요" || q === "반가워" || q === "하이" || q === "반갑습니다") {
    return {
      isSimple: true,
      replyText: `안녕하세요! 반갑습니다. 저는 지역사회 도우미 **마을지기**예요. 😊

어려운 일이 있으시거나 읍면동 주민센터, 학교, 병원비, 교통, 공공요금 등 무엇이든 편하게 물어보세요!`
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
