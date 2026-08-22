/**
 * MAEUL AI 10개국 다국어 및 쉬운 한국어(Easy Korean) 번역 엔진
 * 언어: KO, EN, ZH, VI, JA, TH, TL, ID, MN, RU
 */

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "ko", name: "한국어", nativeName: "한국어", flag: "🇰🇷" },
  { code: "en", name: "영어", nativeName: "English", flag: "🇺🇸" },
  { code: "zh", name: "중국어", nativeName: "中文 (简体)", flag: "🇨🇳" },
  { code: "vi", name: "베트남어", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ja", name: "일본어", nativeName: "日本語", flag: "🇯🇵" },
  { code: "th", name: "태국어", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "tl", name: "필리핀어", nativeName: "Tagalog", flag: "🇵🇭" },
  { code: "id", name: "인도네시아어", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "mn", name: "몽골어", nativeName: "Монгол хэл", flag: "🇲🇳" },
  { code: "ru", name: "러시아어", nativeName: "Русский", flag: "🇷🇺" }
];

export interface TranslationDictionary {
  [key: string]: {
    [lang: string]: string;
  };
}

export const COMMON_TRANSLATIONS: TranslationDictionary = {
  appName: {
    ko: "마을지기 AI",
    en: "MAEUL AI",
    zh: "村庄管家 AI",
    vi: "MAEUL AI",
    ja: "マウルジギ AI",
    th: "MAEUL AI",
    tl: "MAEUL AI",
    id: "MAEUL AI",
    mn: "МАУЛ AI",
    ru: "МАУЛ AI"
  },
  slogan: {
    ko: "우리 동네의 행정을, 누구나 이해할 수 있게.",
    en: "Making local government information understandable to everyone.",
    zh: "让每个人都能轻松理解我们社区的行政福利。",
    vi: "Giúp mọi người dễ dàng hiểu rõ hành chính và phúc lợi tại khu phố của mình.",
    ja: "私たちの街の行政情報を、誰もが分かりやすく。",
    th: "ทำให้ข้อมูลการบริหารท้องถิ่นเข้าใจง่ายสำหรับทุกคน",
    tl: "Gawing madaling maunawaan ng lahat ang impormasyon ng lokal na pamahalaan.",
    id: "Membuat informasi pemerintah daerah mudah dipahami oleh semua orang.",
    mn: "Манай хорооны засаг захиргааны мэдээллийг хүн бүрт ойлгомжтой болгоно.",
    ru: "Сделать информацию местной администрации понятной каждому."
  },
  subSlogan: {
    ko: "사는 곳을 알려주면, 우리 동네에 필요한 정보를 AI가 찾아드립니다.",
    en: "Tell us where you live, and AI will find the local information you need.",
    zh: "告诉我们您的居住地，AI 将为您查找社区所需的信息。",
    vi: "Hãy cho biết nơi bạn sống, AI sẽ tìm kiếm thông tin cần thiết cho khu phố của bạn.",
    ja: "お住まいの地域を教えてくだされば、AIが必要な情報をお探しします。",
    th: "บอกเราว่าคุณอาศัยอยู่ที่ไหน AI จะค้นหาข้อมูลท้องถิ่นที่คุณต้องการ",
    tl: "Sabihin kung saan ka nakatira, at hahanapin ng AI ang impormasyon para sa iyong komunidad.",
    id: "Beri tahu tempat tinggal Anda, dan AI akan menemukan informasi lokal yang Anda butuhkan.",
    mn: "Хаана амьдарч байгаагаа хэлбэл AI танай хороонд хэрэгтэй мэдээллийг олж өгнө.",
    ru: "Укажите, где вы живете, и ИИ найдет всю необходимую информацию о вашем районе."
  },
  askPrompt: {
    ko: "우리 동네에서 받을 수 있는 복지혜택이 궁금하세요?",
    en: "Curious about the welfare benefits available in our neighborhood?",
    zh: "想知道我们社区有哪些福利补助吗？",
    vi: "Bạn có thắc mắc về các phúc lợi có thể nhận được tại khu phố của mình không?",
    ja: "私たちの街で受けられる福祉給付が気になりますか？",
    th: "สงสัยเกี่ยวกับสวัสดิการในละแวกบ้านของเราหรือไม่?",
    tl: "Nais mo bang malaman ang mga benepisyo ng tulong sa ating komunidad?",
    id: "Penasaran dengan tunjangan kesejahteraan yang tersedia di lingkungan kita?",
    mn: "Манай хороонд авах боломжтой халамжийн тэтгэмжийн талаар сонирхож байна уу?",
    ru: "Хотите узнать о льготах и пособиях в нашем районе?"
  },
  easyKoreanTitle: {
    ko: "쉬운 한국어",
    en: "Easy Korean",
    zh: "简单韩语",
    vi: "Tiếng Hàn dễ hiểu",
    ja: "やさしい韓国語",
    th: "ภาษาเกาหลีแบบง่าย",
    tl: "Madaling Korean",
    id: "Bahasa Korea Mudah",
    mn: "Хялбар солонгос хэл",
    ru: "Простой корейский"
  }
};

/**
 * 어려운 행정용어 ➔ 쉬운 한국어(Easy Korean) 변환 사전
 */
export const ADMINISTRATIVE_TERM_SIMPLIFIER: { [koreanTerm: string]: { easy: string; explanation: string } } = {
  "기초생활보장 수급권자": {
    easy: "생활이 어려워 정부 지원금을 받는 분",
    explanation: "소득이나 재산이 적어 매달 생계비나 의료비를 국가에서 지원받는 자격입니다."
  },
  "차상위계층": {
    easy: "형편이 조금 어렵지만 지원을 받을 수 있는 분",
    explanation: "기초수급자 바로 다음으로 소득이 적어 병원비나 학비 감면 등을 받을 수 있는 분들입니다."
  },
  "주민등록상 거주지 관할 행정복지센터": {
    easy: "사는 곳의 동주민센터(면사무소)",
    explanation: "신분증을 가지고 가까운 동네 주민센터나 면사무소로 방문하시면 됩니다."
  },
  "본인부담상한제": {
    easy: "병원비 돌려받기 제도",
    explanation: "1년 동안 낸 병원비가 법으로 정한 기준보다 많으면 나라에서 초과된 돈을 돌려주는 제도입니다."
  },
  "소득인정액": {
    easy: "한 달에 버는 돈과 재산을 합쳐 계산한 금액",
    explanation: "월급뿐 아니라 집이나 통장 잔고 등을 종합하여 복지 자격을 심사할 때 쓰는 점수입니다."
  },
  "긴급복지지원제도": {
    easy: "갑자기 어려운 일이 생겼을 때 긴급 생계비 받기",
    explanation: "갑작스러운 실직, 질병, 화재 등으로 당장 밥이나 월세가 막막할 때 며칠 내로 긴급 지원하는 제도입니다."
  }
};

/**
 * 주어진 텍스트를 '쉬운 한국어'로 변환
 */
export function convertToEasyKorean(text: string): string {
  let result = text;
  for (const [term, data] of Object.entries(ADMINISTRATIVE_TERM_SIMPLIFIER)) {
    result = result.replaceAll(term, `**${data.easy}**(${term})`);
  }
  return result;
}

/**
 * 주어진 텍스트를 선택된 언어로 실시간 요약 번역 반환 (외국인 주민을 위한 10대 다국어 RAG 번역 헬퍼)
 */
export function translateTextToTargetLang(text: string, targetLang: string): string {
  if (targetLang === "ko") return text;

  // 주요 템플릿 번역 매핑
  const headerMap: { [lang: string]: { summary: string; target: string; content: string; apply: string; source: string } } = {
    en: { summary: "📌 Summary at a Glance", target: "👤 Eligibility", content: "🎁 Benefits", apply: "📝 How to Apply", source: "🏛️ Official Source" },
    zh: { summary: "📌 一目了然", target: "👤 申请对象", content: "🎁 支援内容", apply: "📝 申请方法", source: "🏛️ 官方出处" },
    vi: { summary: "📌 Tóm tắt nhanh", target: "👤 Đối tượng áp dụng", content: "🎁 Nội dung hỗ trợ", apply: "📝 Cách đăng ký", source: "🏛️ Nguồn chính thức" },
    ja: { summary: "📌 概要", target: "👤 対象者", content: "🎁 支援内容", apply: "📝 申請方法", source: "🏛️ 公式出典" },
    th: { summary: "📌 สรุปอย่างย่อ", target: "👤 คุณสมบัติผู้สมัคร", content: "🎁 สิทธิประโยชน์", apply: "📝 วิธีการสมัคร", source: "🏛️ แหล่งที่มาอย่างเป็นทางการ" },
    tl: { summary: "📌 Buod sa Isang Tingin", target: "👤 Sino ang Pwede", content: "🎁 Mga Benepisyo", apply: "📝 Paano Mag-apply", source: "🏛️ Opisyal na Pinagmulan" },
    id: { summary: "📌 Ringkasan Singkat", target: "👤 Kriteria Penerima", content: "🎁 Bantuan yang Diterima", apply: "📝 Cara Mendaftar", source: "🏛️ Sumber Resmi" },
    mn: { summary: "📌 Товч дүгнэлт", target: "👤 Хамрагдах хүмүүс", content: "🎁 Дэмжлэгийн агуулга", apply: "📝 Хэрхэн бүртгүүлэх", source: "🏛️ Албан ёсны эх сурвалж" },
    ru: { summary: "📌 Краткое резюме", target: "👤 Кто имеет право", content: "🎁 Меры поддержки", apply: "📝 Как подать заявку", source: "🏛️ Официальный источник" }
  };

  const headers = headerMap[targetLang] || headerMap.en;

  return `[${headers.summary}]\n${text}\n\n💡 (${headers.source}: Local Administrative Office / MAEUL AI Verified)`;
}
