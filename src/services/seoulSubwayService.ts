/**
 * 서울시 열린데이터광장 실시간 지하철 도착정보 API 서비스 (보안 내부 모듈)
 * 사용자 요청 시에만 백엔드에서 안전하게 인출되어 챗봇 말풍선으로 안내
 */

export interface SubwayArrivalItem {
  lineName: string; // 호선명 (예: 경의중앙선, 경춘선, 8호선, 4호선)
  trainLineNm: string; // 방면 (예: 용문행 - 도농방면)
  arvlMsg2: string; // 도착 메시지 (예: [3]번째 전역 (평내호평), 전역 도착 등)
  arvlMsg3: string; // 현재 위치 (예: 평내호평)
  recptnDt: string; // 수신 시각
}

const SEOUL_SUBWAY_API_KEY = import.meta.env.VITE_SEOUL_SUBWAY_API_KEY || "72536d4d4676696b39327073504c4c";

// 구리·남양주 및 수도권 주요 전철역 메타데이터
export const localSubwayStations: Record<string, { line: string; transfer?: string; address: string; phone: string }> = {
  // 경춘선
  "평내호평": { line: "경춘선 / ITX-청춘", transfer: "M버스 환승", address: "경기도 남양주시 늘을로 14", phone: "1544-7788" },
  "금곡": { line: "경춘선", address: "경기도 남양주시 금곡로 77-1", phone: "1544-7788" },
  "마석": { line: "경춘선 / ITX-청춘", address: "경기도 남양주시 화도읍 마석중앙로 107", phone: "1544-7788" },
  "사릉": { line: "경춘선", address: "경기도 남양주시 진건읍 진건오남로 112", phone: "1544-7788" },
  "퇴계원": { line: "경춘선", address: "경기도 남양주시 퇴계원읍 퇴계원로 101", phone: "1544-7788" },
  "천마산": { line: "경춘선", address: "경기도 남양주시 화도읍 경춘로 1793", phone: "1544-7788" },
  "대성리": { line: "경춘선", address: "경기도 가평군 청평면 경춘로 88", phone: "1544-7788" },

  // 경의중앙선
  "구리": { line: "경의중앙선 / 8호선(별내선)", transfer: "환승역", address: "경기도 구리시 건원대로34번길 32", phone: "1544-7788" },
  "도농": { line: "경의중앙선", address: "경기도 남양주시 미금로 240 (다산동)", phone: "1544-7788" },
  "양정": { line: "경의중앙선", address: "경기도 남양주시 일패동 464-1", phone: "1544-7788" },
  "덕소": { line: "경의중앙선 / KTX", transfer: "KTX 정차", address: "경기도 남양주시 와부읍 덕소로97번길 77", phone: "1544-7788" },
  "도심": { line: "경의중앙선", address: "경기도 남양주시 와부읍 도곡리 999", phone: "1544-7788" },
  "팔당": { line: "경의중앙선", address: "경기도 남양주시 와부읍 팔당로 107", phone: "1544-7788" },
  "운길산": { line: "경의중앙선", address: "경기도 남양주시 조안면 물의정원로 7", phone: "1544-7788" },

  // 8호선 (별내선)
  "별내": { line: "8호선(별내선) / 경춘선", transfer: "환승역", address: "경기도 남양주시 별내동 1098", phone: "02-6110-8000" },
  "다산": { line: "8호선(별내선)", address: "경기도 남양주시 다산동 6056", phone: "02-6110-8000" },
  "동구릉": { line: "8호선(별내선)", address: "경기도 구리시 인창동 674-1", phone: "02-6110-8000" },
  "장자호수공원": { line: "8호선(별내선)", address: "경기도 구리시 토평동 994", phone: "02-6110-8000" },
  "암사역사공원": { line: "8호선", address: "서울특별시 강동구 암사동 140", phone: "02-6110-8000" },

  // 4호선 (진접선)
  "진접": { line: "4호선(진접선)", address: "경기도 남양주시 진접읍 금강로 1533", phone: "02-6110-4000" },
  "오남": { line: "4호선(진접선)", address: "경기도 남양주시 오남읍 양지로 47", phone: "02-6110-4000" },
  "별내별가람": { line: "4호선(진접선)", address: "경기도 남양주시 별내동 824", phone: "02-6110-4000" },
  "당고개": { line: "4호선", address: "서울특별시 노원구 상계동 111", phone: "02-6110-4000" }
};

/**
 * 서울시 실시간 지하철 도착정보 조회
 */
export async function getSubwayArrivalInfo(stationName: string): Promise<string> {
  // 역 이름 정제 (예: "구리역" -> "구리", "평내호평역" -> "평내호평")
  const cleanStation = stationName.replace(/역$/g, "").replace(/[\s]/g, "");
  const stationMeta = localSubwayStations[cleanStation];

  const apiUrl = `http://swopenAPI.seoul.go.kr/api/subway/${SEOUL_SUBWAY_API_KEY}/json/realtimeStationArrival/0/5/${encodeURIComponent(cleanStation)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Subway API error status: ${response.status}`);
    }
    const data = await response.json();

    if (data && data.realtimeArrivalList && data.realtimeArrivalList.length > 0) {
      const arrivals: SubwayArrivalItem[] = data.realtimeArrivalList.slice(0, 4);

      const arrivalDetails = arrivals
        .map((item) => `🚆 **[${item.trainLineNm}]**: ${item.arvlMsg2} (${item.arvlMsg3 ? `현재: ${item.arvlMsg3}` : ""})`)
        .join("\n");

      return `🚊 **${cleanStation}역 실시간 지하철 도착정보** (서울시 공식 연동)

${arrivalDetails}

📍 **역사 정보**: ${stationMeta ? `${stationMeta.line} | 📞 ${stationMeta.phone}` : "수도권 전철"}
${stationMeta?.address ? `🏢 **위치**: ${stationMeta.address}\n` : ""}
💡 *만 65세 이상 어르신은 G-PASS 카드로 수도권 전철을 100% 무임 이용하실 수 있습니다.*`;
    }
  } catch (error) {
    console.warn("Realtime subway API fetch fallback:", error);
  }

  // 실시간 API 응답 지연/CORS 또는 심야 시간대 fallback 안내
  if (stationMeta) {
    return `🚊 **${cleanStation}역 지하철 운행 및 역사 안내**

📍 **운행 노선**: **${stationMeta.line}** ${stationMeta.transfer ? `[${stationMeta.transfer}]` : ""}
🏢 **역사 주소**: ${stationMeta.address}
📞 **고객센터**: ${stationMeta.phone} (한국철도공사 코레일 / 서울교통공사)

💡 **이용 안내**:
- 첫차: 평일 05:30경 / 막차: 평일 23:40~00:10경 (노선별 상이)
- 만 65세 이상 어르신은 **G-PASS 어르신 교통카드**로 수도권 전철/지하철을 **100% 무료(무임)**로 탑승하실 수 있습니다.`;
  }

  return `🚊 **수도권 지하철 및 전철 안내**

문의하신 **${cleanStation}역**에 대한 전철 운행 안내입니다.
- 📞 **서울교통공사 고객센터**: **1577-1234** (1~8호선)
- 📞 **한국철도공사 코레일**: **1544-7788** (경의중앙선, 경춘선, 수인분당선 등)
- 📞 **철도/지하철 유실물 센터**: **국번없이 114** 또는 코레일 유실물 통합포털

💡 만 65세 이상 어르신은 G-PASS 카드로 전철을 100% 무임 승차하실 수 있습니다.`;
}
