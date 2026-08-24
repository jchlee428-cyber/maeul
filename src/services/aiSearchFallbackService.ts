/**
 * OpenAI (GPT-4o / GPT-4o-mini) 스마트 AI 검색 및 생성형 폴백 엔진
 * 
 * [동작 원리]
 * 1. 내부 공공데이터 RAG 및 로컬 DB에서 직접 매칭되지 않는 미지의 질문 또는 복합 질의 발생 시 호출
 * 2. OpenAI Chat Completion API (기본: gpt-4o-mini)를 통해 실시간 맞춤형 답변 생성
 * 3. 어르신과 주민을 위한 따뜻하고 알기 쉬운 단계별 안내 톤앤매너 유지
 * 4. API 키 부재 또는 네트워크 오류 시 지자체 공식 콜센터 안내로 안전하게 자동 전환 (Graceful Fallback)
 */

export interface OpenAISearchOptions {
  model?: string;
  userVillage?: string;
  userLang?: string;
}

export async function generateAISearchFallbackReply(
  userQuery: string,
  options?: OpenAISearchOptions
): Promise<string> {
  const q = userQuery.trim();
  const village = options?.userVillage || "남양주시 평내동";

  // 1. API 키 확인 (.env 환경변수 또는 로컬 스토리지)
  const apiKey =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENAI_API_KEY) ||
    (typeof window !== "undefined" ? localStorage.getItem("openai_api_key") : null) ||
    "";

  // 2. API 키가 있는 경우 OpenAI API 직접 호출
  if (apiKey && apiKey.startsWith("sk-")) {
    try {
      const systemPrompt = `당신은 대한민국 지역사회 어르신과 주민을 위한 따뜻하고 친절한 공공 복지 AI 도우미 '마을지기'입니다.
현재 주민 거주 권역: [${village}]

[핵심 답변 및 출력 원칙 - 자유로운 마크다운 적용]
1. 기존의 고정된 서식 틀에 얽매이지 말고, 사용자의 질문 내용과 성격에 가장 최적화된 **자유로운 마크다운(Markdown)** 형식으로 풍부하고 친절하게 답변을 작성하세요.
2. 가독성을 높이기 위해 소제목(###, ####), 글머리 기호(-), 번호 목록(1., 2., 3.), 볼드 강조(**), 인용구(>), 표(Table) 등을 적극 활용하세요.
3. 어르신과 주민의 눈높이에 맞춰 매우 따뜻하고 정중한 존댓말로 공감하며 설명하세요.
4. 어려운 행정·법률 용어는 쉬운 일상어로 쉽게 풀어서 설명하세요.
5. 관련된 관할 지자체/주민센터, 공식 웹사이트 링크([링크명](URL)), 대표 연락처(남양주시청: 031-590-2114, 보건복지상담: 129, 정부민원: 110)가 있다면 반드시 함께 안내하세요.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: options?.model || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: q }
          ],
          temperature: 0.6,
          max_tokens: 1000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim()) {
          return `✨ **AI 마을지기 스마트 검색 안내** (OpenAI 연계)

${reply.trim()}

---
💡 *더 자세한 사항이나 개인별 공적 급여 자격 확인은 관할 주민센터(031-590-4960) 또는 보건복지상담센터(129)에 문의하시면 정확한 상담을 받으실 수 있습니다.*`;
        }
      } else {
        console.warn("OpenAI API returned non-200 status:", response.status, await response.text());
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to local guide:", err);
    }
  }

  // 3. API 키가 없거나 호출 실패 시의 Graceful Fallback
  const isGuri = q.includes("구리");
  const isPyeongnae = q.includes("평내");

  return `🤖 **AI 마을지기 스마트 안내**

문의하신 **"${q}"**에 대한 안내입니다.

📍 **관할 공식 문의처**:
- **${isGuri ? "구리시청 대표 콜센터" : "남양주시청 대표 콜센터"}**: 📞 **${isGuri ? "031-557-1010" : "031-590-2114"}**
${isPyeongnae ? `- **평내동 주민자치센터**: 📞 **031-591-4600** (강좌/문화/프로그램: [http://pyeongnae.co.kr](http://pyeongnae.co.kr))\n- **평내동 행정복지센터**: 📞 **031-590-4960** (전입/등초본/복지급여)\n` : ""}- **보건복지상담센터 (복지·생계·의료)**: 📞 **국번없이 129** (무료)
- **정부 민원 안내 콜센터 (전국)**: 📞 **국번없이 110** (24시간)

💡 **안내 팁**:
- 찾으시는 구체적인 혜택이나 시설(예: *평내동 주민자치센터 강좌*, *어르신 식사돌봄*, *병원비 긴급지원*)을 말씀해주시면 딱 맞는 맞춤형 4단계 안내를 즉시 정리해드립니다!`;
}
