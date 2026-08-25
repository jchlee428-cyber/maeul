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

  // 3. API 키가 없거나 호출 실패 시의 지능형 스마트 로컬 폴백 (Smart Offline Local Guide)
  const isGuri = q.includes("구리");
  const isPyeongnae = q.includes("평내");
  const lowerQ = q.toLowerCase();

  // A. 일자리/구직/취업/알바/시니어/은퇴
  if (lowerQ.includes("일자리") || lowerQ.includes("취업") || lowerQ.includes("구직") || lowerQ.includes("알바") || lowerQ.includes("일할") || lowerQ.includes("직업") || lowerQ.includes("경력")) {
    return `✨ **AI 마을지기 맞춤 일자리·취업 길라잡이**

문의하신 **"${q}"**에 대해 지역사회에서 지원받으실 수 있는 공공 일자리 경로를 정리해 드렸습니다.

### 🏢 1. 지역별 맞춤 일자리 지원 기관
- **남양주시 일자리센터**: 📞 **031-560-1919** (구직상담, 취업알선, 이력서 컨설팅)
- **남양주시니어클럽 (만 60세 이상)**: 📞 **031-594-5500** (노인일자리, 시장형 사업단, 실버카페 등)
- **남양주고용복지플러스센터**: 📞 **031-560-1900** (국민취업지원제도, 실업급여, 내일배움카드)
- **남양주여성새로일하기센터**: 📞 **031-590-2680** (경력단절 여성 재취업 및 직업훈련)

### 📋 2. 주민 행동 순서
1. **유선 또는 방문 상담**: 거주지 관할 일자리센터 또는 고용복지플러스센터에 방문하여 구직 등록
2. **맞춤 프로그램 참여**: 국민취업지원제도(월 최대 50만 원 구직촉진수당) 또는 직업훈련비 국비 지원 신청
3. **온라인 공공 일자리 확인**: [워크넷(Worknet)](https://www.worknet.go.kr) 또는 [노인일자리여기](https://www.seniorro.or.kr)에서 실시간 채용공고 열람

💡 *신청 서류나 자격 요건이 막막하시다면 아래 **[🤝 마을관리자 도움 요청하기]**를 눌러주시면 친절하게 지원해 드립니다.*`;
  }

  // B. 다문화/외국인/한국어/이민
  if (lowerQ.includes("다문화") || lowerQ.includes("외국인") || lowerQ.includes("한국말") || lowerQ.includes("한국어") || lowerQ.includes("이민") || lowerQ.includes("통역") || lowerQ.includes("번역")) {
    return `✨ **AI 마을지기 다문화·외국인 주민 정착 안내**

문의하신 **"${q}"**에 대한 맞춤 지원 서비스입니다.

### 🏫 1. 한국어 교육 및 정착 지원 센터
- **남양주시가족센터 (본관 - 금곡동)**: 📞 **031-555-8261** / 📞 **031-553-8211**
- **다누리콜센터 (여성가족부 전국망)**: 📞 **1577-1366** (24시간 13개국어 무료 전화·통역상담)
- **외국인주민지원센터**: 📞 **031-590-4688**

### 📚 2. 제공되는 주요 무료 혜택
1. **무료 한국어교실**: 단계별(기초·초급·중급·토픽반) 정기 수업 운영
2. **무료 통번역 동행 서비스**: 병원, 관공서, 학교 방문 시 통역사 무료 파견 및 전화 통역
3. **자녀 언어발달 & 이중언어 코칭**: 다문화 자녀의 한국어 및 모국어 학습 지원
4. **가족상담 & 조기적응 프로그램**: 생활 정보 안내 및 한국문화 체험`;
  }

  // C. 복지/생계/어려움/도움
  if (lowerQ.includes("복지") || lowerQ.includes("어려") || lowerQ.includes("힘들") || lowerQ.includes("생계") || lowerQ.includes("지원금") || lowerQ.includes("돌봄") || lowerQ.includes("취약계층")) {
    return `✨ **AI 마을지기 맞춤 복지 지원 안내**

주민님의 상황(**"${q}"**)에 가장 적합한 긴급 및 상시 복지 지원 경로입니다.

### 🏛️ 1. 관할 복지 창구
- **관할 읍·면·동 행정복지센터 복지팀**: 주소지 관할 주민센터 방문 접수
${isPyeongnae ? `- **평내동 행정복지센터 복지상담**: 📞 **031-590-4960**\n` : ""}- **남양주시 희망케어센터 (권역별 통합 복지)**: 📞 **031-590-8941**
- **보건복지상담센터 (전국 복지통합콜)**: 📞 **국번없이 129** (무료)

### 💡 2. 긴급 지원 안내
- 갑작스러운 위기(실직, 질병, 월세 체납, 공공요금 단전) 시 **긴급복지지원법에 따라 선지원(생계비·의료비·주거비)**을 받으실 수 있습니다.
- 방문 전 관할 행정복지센터 복지팀이나 129 콜센터로 전화하시면 필요 서류를 바로 확인해 드립니다.`;
  }

  // D. 일반 통합 안내 (기본)
  return `🤖 **AI 마을지기 스마트 지역사회 안내**

문의하신 **"${q}"**에 대한 관할 안내입니다.

📍 **관할 공식 문의처**:
- **${isGuri ? "구리시청 대표 콜센터" : "남양주시청 대표 콜센터"}**: 📞 **${isGuri ? "031-557-1010" : "031-590-2114"}**
${isPyeongnae ? `- **평내동 주민자치센터**: 📞 **031-591-4600** (강좌/문화/프로그램: [http://pyeongnae.co.kr](http://pyeongnae.co.kr))\n- **평내동 행정복지센터**: 📞 **031-590-4960** (전입/등초본/복지급여/취약계층지원)\n` : ""}- **보건복지상담센터 (복지·생계·의료·돌봄)**: 📞 **국번없이 129** (무료)
- **정부 민원 안내 콜센터 (전국 민원)**: 📞 **국번없이 110** (24시간)
- **고용노동부 고객상담센터 (일자리·취업)**: 📞 **국번없이 1350**

💡 **안내 팁**:
- 찾으시는 구체적인 분야(예: *60대 노인 일자리*, *다문화 한국어 교실*, *병원비 긴급지원*, *버스 실시간 위치*)를 말씀해주시면 실시간 맞춤형 4단계 행동 계획을 정리해 드립니다!`;
}

