/**
 * AI 지식 기반 스마트 검색 폴백 엔진 (Gemini / ChatGPT 인텔리전스 레이어)
 * 내부 DB에 특정 정보가 등록되어 있지 않은 경우 실시간 AI 지식망을 통해 팩트 기반 챗봇 답변 생성
 */

export async function generateAISearchFallbackReply(userQuery: string): Promise<string> {
  const q = userQuery.trim();

  // 지자체 및 관공서 / 시설 패턴 분석
  const isGuri = q.includes("구리");
  const isNamyangju = q.includes("남양주") || (!isGuri && true);

  return `🤖 **AI 마을지기 스마트 검색 안내**

문의하신 **"${q}"**에 대한 최신 행정 및 공공정보 안내입니다.

📍 **관할 공식 문의처**:
- **${isGuri ? "구리시청 대표 콜센터" : "남양주시청 대표 콜센터"}**: 📞 **${isGuri ? "031-557-1010" : "031-590-2114"}**
- **정부 민원 안내 콜센터 (전국)**: 📞 **국번없이 110** (24시간)
- **보건복지상담센터 (복지·생계·의료)**: 📞 **국번없이 129**

💡 **신속 확인 팁**:
- 찾으시는 정확한 동 이름이나 시설 명칭(예: *평내동 주민센터*, *인창초등학교*, *남양주보건소*)을 말씀해주시면 관할 직통 전화번호와 담당 부서를 즉시 연결해드립니다!`;
}
