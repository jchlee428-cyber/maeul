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

export const UI_TRANSLATIONS: TranslationDictionary = {
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
  newChat: {
    ko: "새 대화",
    en: "New Chat",
    zh: "新对话",
    vi: "Hội thoại mới",
    ja: "新しい対話",
    th: "แชทใหม่",
    tl: "Bagong Chat",
    id: "Obrolan Baru",
    mn: "Шинэ яриа",
    ru: "Новый чат"
  },
  consultationHistory: {
    ko: "상담 기록",
    en: "History",
    zh: "咨询记录",
    vi: "Lịch sử tư vấn",
    ja: "相談履歴",
    th: "ประวัติการปรึกษา",
    tl: "Kasaysayan",
    id: "Riwayat Konsultasi",
    mn: "Зөвлөгөөний түүх",
    ru: "История консультаций"
  },
  askInputPlaceholder: {
    ko: "질문을 적어주세요 (예: 수술비 지원, 땡큐버스, 긴급복지)",
    en: "Ask any question (e.g., medical subsidy, Thank You Bus, welfare)",
    zh: "请输入您的问题（例如：医疗费支援、Thank You 巴士、紧急福利）",
    vi: "Nhập câu hỏi của bạn (vd: hỗ trợ viện phí, xe buýt Thank You, trợ cấp)",
    ja: "ご質問を入力してください（例：医療費支援、Thank Youバス、福祉相談）",
    th: "พิมพ์คำถามของคุณ (เช่น เงินช่วยเหลือค่ารักษาพยาบาล, รถบัส)",
    tl: "Magtanong dito (hal. tulong medikal, Thank You Bus, tulong pinansyal)",
    id: "Ketik pertanyaan Anda (mis. bantuan medis, bus Thank You, subsidi)",
    mn: "Асуултаа бичнэ үү (жишээ: эмнэлгийн төлбөрийн тусламж, автобус)",
    ru: "Введите ваш вопрос (например: медпомощь, автобус, соцпособия)"
  },
  sendButton: {
    ko: "상담하기",
    en: "Send",
    zh: "咨询",
    vi: "Gửi tư vấn",
    ja: "相談する",
    th: "ส่งคำถาม",
    tl: "Ipadala",
    id: "Kirim",
    mn: "Зөвлөгөө авах",
    ru: "Отправить"
  },
  voiceButton: {
    ko: "🎙️ [목소리로 말하기] 눌러서 질문하기",
    en: "🎙️ [Speak by Voice] Press to Ask",
    zh: "🎙️ [语音提问] 点击说话",
    vi: "🎙️ [Nói bằng giọng nói] Nhấn để hỏi",
    ja: "🎙️ [音声で話す] タップして質問",
    th: "🎙️ [พูดด้วยเสียง] แตะเพื่อถาม",
    tl: "🎙️ [Magsalita gamit ang Boses] Pindutin para magtanong",
    id: "🎙️ [Bicara dengan Suara] Tekan untuk bertanya",
    mn: "🎙️ [Дуу хоолойгоор ярих] Дарж асууна уу",
    ru: "🎙️ [Сказать голосом] Нажмите для вопроса"
  },
  voiceListening: {
    ko: "🎙️ 귀 기울여 듣고 있어요... 편하게 말씀하세요!",
    en: "🎙️ Listening carefully... Please speak freely!",
    zh: "🎙️ 正在倾听中... 请随时说话！",
    vi: "🎙️ Đang lắng nghe... Xin vui lòng nói tự nhiên!",
    ja: "🎙️ 音声を聞き取っています... お話しください！",
    th: "🎙️ กำลังฟังอยู่... กรุณาพูดได้เลย!",
    tl: "🎙️ Nakikinig... Magsalita nang malaya!",
    id: "🎙️ Mendengarkan... Silakan berbicara!",
    mn: "🎙️ Таны яриаг сонсож байна... Чөлөөтэй ярина уу!",
    ru: "🎙️ Слушаю вас... Говорите свободно!"
  },
  audioListen: {
    ko: "듣기",
    en: "Listen",
    zh: "朗读",
    vi: "Nghe",
    ja: "音声で聞く",
    th: "ฟังเสียง",
    tl: "Pakinggan",
    id: "Dengar",
    mn: "Сонсох",
    ru: "Слушать"
  },
  audioStop: {
    ko: "멈춤",
    en: "Stop",
    zh: "停止",
    vi: "Dừng",
    ja: "停止",
    th: "หยุด",
    tl: "Itigil",
    id: "Berhenti",
    mn: "Зогсоох",
    ru: "Стоп"
  },
  stepAudioBannerTitle: {
    ko: "4단계 맞춤 음성 안내",
    en: "4-Step Voice Guidance",
    zh: "4阶段个性化语音引导",
    vi: "Hướng dẫn giọng nói 4 bước",
    ja: "4段階の音声案内",
    th: "คู่มือเสียง 4 ขั้นตอน",
    tl: "Gabay sa Boses sa 4 na Hakbang",
    id: "Panduan Suara 4 Langkah",
    mn: "4 үе шаттай дуут заавар",
    ru: "4-этапное голосовое руководство"
  },
  stepAudioBannerDesc: {
    ko: "4단계 안내를 목소리로 들으시겠어요?",
    en: "Would you like to hear the 4-step guidance read aloud?",
    zh: "您想听 AI 为您朗读 4 阶段详细指南吗？",
    vi: "Bạn có muốn nghe AI đọc to toàn bộ hướng dẫn 4 bước không?",
    ja: "4段階の案内を音声でお聞きになりますか？",
    th: "คุณต้องการฟังคำแนะนำ 4 ขั้นตอนแบบออกเสียงหรือไม่?",
    tl: "Gusto mo bang marinig ang buong 4-step na gabay sa boses?",
    id: "Apakah Anda ingin mendengarkan panduan 4 langkah dibacakan?",
    mn: "4 үе шаттай зааврыг дуугаар сонсохыг хүсч байна уу?",
    ru: "Хотите прослушать 4-этапное руководство голосом?"
  },
  listenAll4Steps: {
    ko: "4단계 전체 듣기",
    en: "Listen to All 4 Steps",
    zh: "朗读全部 4 个阶段",
    vi: "Nghe toàn bộ 4 bước",
    ja: "4段階すべて聞く",
    th: "ฟังทั้งหมด 4 ขั้นตอน",
    tl: "Pakinggan Lahat ng 4 Hakbang",
    id: "Dengarkan Semua 4 Langkah",
    mn: "Бүх 4 шатыг сонсох",
    ru: "Прослушать все 4 этапа"
  },
  officialSourceLabel: {
    ko: "공식 출처",
    en: "Official Source",
    zh: "官方出处",
    vi: "Nguồn chính thức",
    ja: "公式出典",
    th: "แหล่งที่มาอย่างเป็นทางการ",
    tl: "Opisyal na Pinagmulan",
    id: "Sumber Resmi",
    mn: "Албан ёсны эх сурвалж",
    ru: "Официальный источник"
  },
  inquiryContactLabel: {
    ko: "문의처",
    en: "Inquiry Contact",
    zh: "咨询电话",
    vi: "Liên hệ tư vấn",
    ja: "お問い合わせ",
    th: "ติดต่อสอบถาม",
    tl: "Makipag-ugnayan",
    id: "Kontak Informasi",
    mn: "Холбогдох дугаар",
    ru: "Контакты"
  },
  helpRequestAction: {
    ko: "이 지원에 도움 요청하기 (마을관리자 연계)",
    en: "Request Help for this Benefit (Connect Local Admin)",
    zh: "申请此项支援帮助（对接村庄管理员）",
    vi: "Yêu cầu giúp đỡ cho khoản trợ cấp này (Kết nối quản lý thôn)",
    ja: "この支援のサポートを要請する（村の管理者連携）",
    th: "ขอความช่วยเหลือสำหรับสวัสดิการนี้ (ติดต่อผู้ดูแล)",
    tl: "Humingi ng Tulong para Dito (Ikonekta sa Admin)",
    id: "Minta Bantuan untuk Subsidi Ini (Hubungkan Petugas)",
    mn: "Энэхүү дэмжлэгт тусламж хүсэх (Хорооны ажилтантай холбогдох)",
    ru: "Запросить помощь по этой услуге (Связь с администратором)"
  },
  printA4Guide: {
    ko: "A4 안내서 인쇄",
    en: "Print A4 Guide",
    zh: "打印 A4 指南",
    vi: "In tờ rơi hướng dẫn A4",
    ja: "A4案内書を印刷",
    th: "พิมพ์คู่มือ A4",
    tl: "I-print ang A4 Gabay",
    id: "Cetak Panduan A4",
    mn: "A4 заавар хэвлэх",
    ru: "Печать памятки А4"
  },
  privacyNotice: {
    ko: "🔒 개인정보는 일체 저장되지 않습니다. 위급 상황 시 119 · 112",
    en: "🔒 No personal information is stored. In emergencies: 119 · 112",
    zh: "🔒 绝不存储个人信息。紧急情况请拨打 119 · 112",
    vi: "🔒 Không lưu trữ thông tin cá nhân. Trường hợp khẩn cấp: 119 · 112",
    ja: "🔒 個人情報は保存されません。緊急時は 119 · 112",
    th: "🔒 ไม่มีการบันทึกข้อมูลส่วนบุคคล ในกรณีฉุกเฉิน: 119 · 112",
    tl: "🔒 Walang personal na impormasyon na iniimbak. Sa emergency: 119 · 112",
    id: "🔒 Data pribadi tidak disimpan. Dalam keadaan darurat: 119 · 112",
    mn: "🔒 Хувийн мэдээлэл хадгалагдахгүй. Яаралтай үед: 119 · 112",
    ru: "🔒 Персональные данные не сохраняются. При ЧС: 119 · 112"
  }
};

/**
 * 10개국 환영 메시지 생성 함수
 */
export function getMultilingualWelcome(villageName: string, fullName: string, lang: string): string {
  switch (lang) {
    case "en":
      return `Hello! I am **'MAEUL AI'**, your AI Administrative Welfare Assistant serving **${fullName}**. 😊\n\nFeel free to ask about hospital expense reimbursement, living cost subsidies, senior companion care, bus schedules, or community center contacts in your neighborhood.\n\nWe **never ask for personal info** such as your name or resident registration number. Please ask comfortably!`;
    case "zh":
      return `您好！我是服务于 **${fullName}** 的社区 AI 行政福利助理 **'MAEUL AI'**。😊\n\n您可以咨询医疗费补助、紧急生活费、独居老人照护、公交车时刻或居民中心电话等社区信息。\n\n我们**绝不询问**姓名或身份证号等个人隐私信息，请放心咨询！`;
    case "vi":
      return `Xin chào! Tôi là **'MAEUL AI'**, trợ lý phúc lợi hành chính AI phục vụ tại **${fullName}**. 😊\n\nHãy thoải mái hỏi về hỗ trợ viện phí, trợ cấp sinh hoạt, chăm sóc người cao tuổi, lịch trình xe buýt hoặc số điện thoại trung tâm hành chính.\n\nChúng tôi **không bao giờ hỏi thông tin cá nhân** như tên hoặc số căn cước, xin hãy yên tâm đặt câu hỏi!`;
    case "ja":
      return `こんにちは！私は **${fullName}** を担当するAI行政福祉アシスタント **'マウルジギ'** です。😊\n\n医療費の払い戻し、生活費の緊急支援、高齢者見守り、バスや住民センターの電話番号など、何でもお気軽にご質問ください。\n\nお名前や住民登録番号などの個人情報は**一切伺いません**ので、ご安心ください！`;
    case "th":
      return `สวัสดีครับ/ค่ะ! ฉันคือ **'MAEUL AI'** ผู้ช่วยสวัสดิการและข้อมูลการบริหารสำหรับ **${fullName}** 😊\n\nสอบถามเกี่ยวกับเงินช่วยเหลือค่ารักษาพยาบาล ค่าครองชีพ การดูแลผู้สูงอายุ ตารางรถบัส หรือเบอร์โทรศูนย์บริการประชาชนได้เลย\n\nเรา**ไม่ถามข้อมูลส่วนบุคคล** เช่น ชื่อหรือเลขบัตรประชาชน วางใจและสอบถามได้เลยครับ/ค่ะ!`;
    case "tl":
      return `Kamusta! Ako si **'MAEUL AI'**, ang iyong AI Administrative Assistant para sa **${fullName}**. 😊\n\nMagtanong tungkol sa tulong sa gastusin sa ospital, tulong pinansyal sa pamumuhay, pangangalaga sa matatanda, iskedyul ng bus, o mga hotline ng community center.\n\n**Hinding-hindi kami nagtatanong ng personal na impormasyon** tulad ng iyong pangalan o ID number. Huwag mag-atubiling magtanong!`;
    case "id":
      return `Halo! Saya adalah **'MAEUL AI'**, asisten administrasi & kesejahteraan AI yang melayani **${fullName}**. 😊\n\nSilakan tanyakan tentang pengembalian biaya rumah sakit, bantuan biaya hidup darurat, perawatan lansia, rute bus, atau nomor pusat layanan warga.\n\nKami **tidak pernah meminta informasi pribadi** seperti nama atau nomor KTP. Silakan bertanya dengan tenang!`;
    case "mn":
      return `Сайн байна уу! Би бол **${fullName}**-д үйлчилдэг AI захиргаа, халамжийн туслах **'МАУЛ AI'** байна. 😊\n\nЭмнэлгийн төлбөрийн буцаан олголт, амьжиргааны тэтгэмж, ахмадын асаргаа, автобусны цагийн хуваарь болон хорооны утасны дугаарыг чөлөөтэй асууна уу.\n\nБид таны нэр, регистрийн дугаар зэрэг **хувийн мэдээллийг хэзээ ч шаардахгүй** тул санаа амар асуугаарай!`;
    case "ru":
      return `Здравствуйте! Я — **'MAEUL AI'**, ваш персональный помощник по административным и социальным вопросам в **${fullName}**. 😊\n\nСпрашивайте о компенсации расходов на лечение, экстренных пособиях, уходе за пожилыми, расписании автобусов и контактах районного центра.\n\nМы **никогда не запрашиваем личные данные** (ФИО, номер паспорта). Задавайте вопросы с уверенностью!`;
    default:
      return `안녕하세요! 저는 **${fullName}**을 돕는 AI 행정복지사 **'마을지기'**예요. 😊\n\n병원비, 생계비, 어르신 돌봄, 버스나 주민센터 전화번호 등 무엇이든 편하게 물어보세요.\n\n이름이나 주민번호 같은 개인정보는 **절대 묻지 않으니** 안심하고 말씀하세요!`;
  }
}

/**
 * 4단계 안내 스텝 제목 번역
 */
export function translateStepTitle(title: string, lang: string): string {
  if (lang === "ko") return title;

  const stepTitles: { [key: string]: { [lang: string]: string } } = {
    "따뜻한 공감과 상황 확인": {
      en: "Empathy & Situation Assessment",
      zh: "温暖共情与情况确认",
      vi: "Thấu hiểu & Xác nhận hoàn cảnh",
      ja: "共感と状況の確認",
      th: "ความเข้าอกเข้าใจและตรวจสอบสถานการณ์",
      tl: "Pakikiramay at Pagsusuri ng Sitwasyon",
      id: "Empati & Penilaian Situasi",
      mn: "Сэтгэл санааны дэмжлэг ба нөхцөл байдлыг тодруулах",
      ru: "Поддержка и анализ ситуации"
    },
    "딱 맞는 공공 지원 제도": {
      en: "Tailored Public Support Programs",
      zh: "精准匹配的公共福利制度",
      vi: "Chương trình hỗ trợ công cộng phù hợp",
      ja: "ぴったりな公的支援制度",
      th: "โครงการสวัสดิการภาครัฐที่เหมาะสม",
      tl: "Angkop na Programa ng Tulong Pampubliko",
      id: "Program Bantuan Pemerintah yang Tepat",
      mn: "Тохирсон төрийн халамжийн хөтөлбөр",
      ru: "Подходящие государственные программы"
    },
    "주민 행동 순서 (준비물/방법)": {
      en: "Action Steps (Documents & Method)",
      zh: "居民行动步骤（准备材料与申请）",
      vi: "Các bước thực hiện (Giấy tờ & Cách nộp)",
      ja: "住民の行動手順（必要書類・申請方法）",
      th: "ขั้นตอนการดำเนินการ (เอกสารและวิธีการ)",
      tl: "Mga Hakbang (Dokumento at Paraan)",
      id: "Langkah Tindakan (Dokumen & Cara Daftar)",
      mn: "Хэрэгжүүлэх алхмууд (Бичиг баримт ба арга зам)",
      ru: "Порядок действий (Документы и способ подачи)"
    },
    "안심 확인과 사람 연결 안내": {
      en: "Reassurance & Human Connection",
      zh: "安心确认与专人对接",
      vi: "An tâm & Kết nối nhân viên hỗ trợ",
      ja: "安心確認と担当者への接続",
      th: "ความอุ่นใจและการติดต่อเจ้าหน้าที่",
      tl: "Kapanatagan at Koneksyon sa Kawani",
      id: "Jaminan Aman & Hubungan dengan Petugas",
      mn: "Аюулгүй байдлын баталгаа ба хариуцсан хүнтэй холбогдох",
      ru: "Подтверждение безопасности и связь с куратором"
    }
  };

  for (const [k, v] of Object.entries(stepTitles)) {
    if (title.includes(k) || k.includes(title)) {
      return v[lang] || title;
    }
  }

  return title;
}

/**
 * 4단계 안내 스텝 본문 내용 실시간 다국어 번역 변환기
 */
export function translateStepContent(content: string, stepNum: number, lang: string): string {
  if (lang === "ko") return content;

  // 번역 사전 키워드 매핑 및 번역
  let res = content;

  if (lang === "en") {
    res = res
      .replace(/남양주시/g, "Namyangju City")
      .replace(/평내동/g, "Pyeongnae-dong")
      .replace(/호평동/g, "Hopyeong-dong")
      .replace(/금곡동/g, "Geumgok-dong")
      .replace(/행정복지센터/g, "Community Service Center")
      .replace(/주민센터/g, "Community Center")
      .replace(/맞춤형복지팀/g, "Customized Welfare Team")
      .replace(/기초생활수급/g, "Basic Livelihood Security")
      .replace(/차상위계층/g, "Near-Poverty Bracket")
      .replace(/본인부담상한제/g, "Medical Out-of-Pocket Cap System")
      .replace(/긴급복지지원/g, "Emergency Welfare Support")
      .replace(/신분증/g, "ID Card (Alien Registration Card/Passport)")
      .replace(/통장사본/g, "Bank Account Copy")
      .replace(/월세 계약서/g, "Rental Lease Contract")
      .replace(/전액 무료/g, "100% Fully Free")
      .replace(/월 최대/g, "Up to monthly")
      .replace(/신청하세요/g, "Please apply")
      .replace(/방문 접수/g, "Visit in person")
      .replace(/전화 문의/g, "Telephone inquiry");
  } else if (lang === "vi") {
    res = res
      .replace(/남양주시/g, "Thành phố Namyangju")
      .replace(/평내동/g, "Phường Pyeongnae")
      .replace(/호평동/g, "Phường Hopyeong")
      .replace(/금곡동/g, "Phường Geumgok")
      .replace(/행정복지센터/g, "Trung tâm dịch vụ hành chính phúc lợi")
      .replace(/주민센터/g, "Ủy ban nhân dân phường")
      .replace(/맞춤형복지팀/g, "Đội phúc lợi chuyên trách")
      .replace(/신분증/g, "Thẻ căn cước/Thẻ cư trú người nước ngoài")
      .replace(/통장사본/g, "Bản sao sổ tài khoản ngân hàng")
      .replace(/전액 무료/g, "Hoàn toàn miễn phí 100%")
      .replace(/방문 접수/g, "Nộp trực tiếp tại trung tâm");
  } else if (lang === "zh") {
    res = res
      .replace(/남양주시/g, "南杨州市")
      .replace(/평내동/g, "坪内洞")
      .replace(/호평동/g, "好坪洞")
      .replace(/금곡동/g, "金谷洞")
      .replace(/행정복지센터/g, "行政福利中心")
      .replace(/신분증/g, "身份证件（外国人登录证/护照）")
      .replace(/통장사본/g, "银行存折复印件")
      .replace(/전액 무료/g, "全额免费 100%")
      .replace(/방문 접수/g, "现场访问申请");
  }

  return res;
}

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

  const headerMap: { [lang: string]: { summary: string; target: string; content: string; apply: string; source: string } } = {
    en: { summary: "📌 Summary at a Glance", target: "👤 Eligibility", content: "🎁 Benefits", apply: "📝 How to Apply", source: "🏛️ Official Source Verified" },
    zh: { summary: "📌 一目了然", target: "👤 申请对象", content: "🎁 支援内容", apply: "📝 申请方法", source: "🏛️ 官方出处已验证" },
    vi: { summary: "📌 Tóm tắt nhanh", target: "👤 Đối tượng áp dụng", content: "🎁 Nội dung hỗ trợ", apply: "📝 Cách đăng ký", source: "🏛️ Đã xác minh nguồn chính thức" },
    ja: { summary: "📌 概要", target: "👤 対象者", content: "🎁 支援内容", apply: "📝 申請方法", source: "🏛️ 公式出典確認済み" },
    th: { summary: "📌 สรุปอย่างย่อ", target: "👤 คุณสมบัติผู้สมัคร", content: "🎁 สิทธิประโยชน์", apply: "📝 วิธีการสมัคร", source: "🏛️ ตรวจสอบแหล่งที่มาอย่างเป็นทางการแล้ว" },
    tl: { summary: "📌 Buod sa Isang Tingin", target: "👤 Sino ang Pwede", content: "🎁 Mga Benepisyo", apply: "📝 Paano Mag-apply", source: "🏛️ Na-verify na Opisyal na Pinagmulan" },
    id: { summary: "📌 Ringkasan Singkat", target: "👤 Kriteria Penerima", content: "🎁 Bantuan yang Diterima", apply: "📝 Cara Mendaftar", source: "🏛️ Sumber Resmi Terverifikasi" },
    mn: { summary: "📌 Товч дүгнэлт", target: "👤 Хамрагдах хүмүүс", content: "🎁 Дэмжлэгийн агуулга", apply: "📝 Хэрхэн бүртгүүлэх", source: "🏛️ Албан ёсны эх сурвалж баталгаажсан" },
    ru: { summary: "📌 Краткое резюме", target: "👤 Кто имеет право", content: "🎁 Меры поддержки", apply: "📝 Как подать заявку", source: "🏛️ Официальный источник проверен" }
  };

  const headers = headerMap[targetLang] || headerMap.en;

  let translatedBody = text;
  if (targetLang === "en") {
    translatedBody = translatedBody
      .replace(/말씀해주셔서 정말 감사해요/g, "Thank you very much for sharing your situation with us.")
      .replace(/힘드신 이야기를 편하게 나눠주셔서 고마워요/g, "We are here to support you through your difficulties.")
      .replace(/공공데이터포털 연계/g, "Linked with Public Data Portal")
      .replace(/공식 정보를 확인하여/g, "We verified official administrative guidelines")
      .replace(/어르신과 주민의 눈높이에 맞춰 알기 쉽게 4단계로 정리해드렸어요/g, "and structured the essential support into 4 easy-to-understand steps for you.");
  } else if (targetLang === "vi") {
    translatedBody = translatedBody
      .replace(/말씀해주셔서 정말 감사해요/g, "Cảm ơn bạn rất nhiều vì đã chia sẻ hoàn cảnh với chúng tôi.")
      .replace(/힘드신 이야기를 편하게 나눠주셔서 고마워요/g, "Chúng tôi luôn sẵn sàng hỗ trợ bạn vượt qua khó khăn.")
      .replace(/공공데이터포털 연계/g, "Kết nối với Cổng dữ liệu công cộng quốc gia")
      .replace(/공식 정보를 확인하여/g, "Chúng tôi đã xác minh thông tin chính thức từ cơ quan hành chính")
      .replace(/어르신과 주민의 눈높이에 맞춰 알기 쉽게 4단계로 정리해드렸어요/g, "và tổng hợp thành 4 bước dễ hiểu dành riêng cho bạn.");
  } else if (targetLang === "zh") {
    translatedBody = translatedBody
      .replace(/말씀해주셔서 정말 감사해요/g, "非常感谢您向我们倾诉您的情况。")
      .replace(/힘드신 이야기를 편하게 나눠주셔서 고마워요/g, "我们随时为您排忧解难。")
      .replace(/공공데이터포털 연계/g, "对接公共数据门户")
      .replace(/공식 정보를 확인하여/g, "已确认官方行政指南")
      .replace(/어르신과 주민의 눈높이에 맞춰 알기 쉽게 4단계로 정리해드렸어요/g, "并为您整理成通俗易懂的 4 个阶段。");
  }

  return `[${headers.summary}]\n${translatedBody}\n\n💡 (${headers.source}: MAEUL AI)`;
}
