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
  "기초생활수급자": {
    easy: "정부 지원금을 받는 분",
    explanation: "생활이 어려워 국가에서 생계비나 의료비를 지원받는 분입니다."
  },
  "차상위계층": {
    easy: "형편이 조금 어렵지만 지원을 받을 수 있는 분",
    explanation: "기초수급자 바로 다음으로 소득이 적어 병원비나 학비 감면 등을 받을 수 있는 분들입니다."
  },
  "주민등록상 거주지 관할 행정복지센터": {
    easy: "사는 곳의 동주민센터(면사무소)",
    explanation: "신분증을 가지고 가까운 동네 주민센터나 면사무소로 방문하시면 됩니다."
  },
  "관할 행정복지센터": {
    easy: "가까운 동주민센터",
    explanation: "주민등록 주소지의 동주민센터나 읍면사무소입니다."
  },
  "행정복지센터": {
    easy: "동주민센터",
    explanation: "주민등록등본 발급과 복지 상담을 받는 동네 관공서입니다."
  },
  "본인부담상한제": {
    easy: "병원비 돌려받기 제도",
    explanation: "1년 동안 낸 병원비가 법으로 정한 기준보다 많으면 나라에서 초과된 돈을 돌려주는 제도입니다."
  },
  "본인부담금": {
    easy: "내가 직접 내는 병원비",
    explanation: "건강보험 혜택을 제외하고 환자가 직접 지불하는 진료비입니다."
  },
  "비급여": {
    easy: "건강보험이 안 되는 치료비",
    explanation: "건강보험 혜택을 받지 못해 환자가 전액 부담하는 진료 항목입니다."
  },
  "재난적의료비": {
    easy: "큰 병으로 감당하기 힘든 병원비 지원",
    explanation: "수술이나 입원 등으로 가계에 큰 부담이 되는 병원비를 최대 80%까지 지원하는 제도입니다."
  },
  "소득인정액": {
    easy: "한 달에 버는 돈과 재산을 합쳐 계산한 금액",
    explanation: "월급뿐 아니라 집이나 통장 잔고 등을 종합하여 복지 자격을 심사할 때 쓰는 점수입니다."
  },
  "중위소득": {
    easy: "대한민국 가구의 딱 중간 소득",
    explanation: "모든 국민 가구를 소득 순으로 세웠을 때 정중앙에 위치한 소득 기준입니다."
  },
  "부양의무자": {
    easy: "돌봐줄 가족(자녀 또는 부모)",
    explanation: "신청인을 부양할 책임이 있는 직계혈족(부모, 자녀)입니다."
  },
  "에너지바우처": {
    easy: "전기·가스·난방비 지원 쿠폰",
    explanation: "여름 냉방비와 겨울 난방비를 결제할 수 있도록 정부가 지급하는 전자 바우처입니다."
  },
  "구직촉진수당": {
    easy: "취업 준비 중에 매달 받는 생계지원금",
    explanation: "구직 활동을 성실히 하는 동안 매달 50만 원씩 최대 6개월간 지급받는 수당입니다."
  },
  "국민취업지원제도": {
    easy: "일자리 찾기와 생계비를 함께 지원하는 프로그램",
    explanation: "취업 상담, 직업 훈련과 함께 수당을 지원하는 고용복지 제도입니다."
  },
  "긴급복지지원제도": {
    easy: "갑자기 어려운 일이 생겼을 때 긴급 생계비 받기",
    explanation: "갑작스러운 실직, 질병, 화재 등으로 당장 밥이나 월세가 막막할 때 며칠 내로 긴급 지원하는 제도입니다."
  },
  "긴급복지지원": {
    easy: "갑작스러운 위기 시 긴급 지원",
    explanation: "위기 상황에 처한 주민에게 3일 이내에 생계비나 의료비를 신속 지원하는 제도입니다."
  },
  "통장사본": {
    easy: "통장 맨 앞면 복사본",
    explanation: "지원금을 입금받을 은행 계좌번호와 이름이 적힌 면입니다."
  },
  "임대차계약서": {
    easy: "전세·월세 집 계약서",
    explanation: "주거비나 월세 지원을 신청할 때 필요한 임대차 계약 서류입니다."
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

export interface AdminDocReport {
  summary: string[];
  terms: { term: string; explanation: string }[];
  dates: string;
  target: string;
  documents: string[];
  whereToApply: string;
  contact: string;
}

export const MULTILINGUAL_DOC_ANALYSIS: { [docKey: string]: { [lang: string]: AdminDocReport } } = {
  emergency: {
    ko: {
      summary: [
        "갑작스러운 경제적 어려움에 처한 주민에게 3개월간 월 71만 원의 긴급 생계비를 지원합니다.",
        "어려운 이웃뿐 아니라 독거 어르신도 난방 연료비 추가 감면과 함께 지원받을 수 있습니다.",
        "평내동 종합행정복지센터 복지팀에 신분증과 통장을 가지고 방문하시면 됩니다."
      ],
      terms: [
        { term: "기준중위소득 75%", explanation: "대한민국 전체 가구를 소득 순서대로 줄 세웠을 때 75% 수준 이하인 기준입니다." },
        { term: "기초생활보장 수급권자", explanation: "소득이나 재산이 적어 국가에서 생계비나 의료비를 매달 보조받는 자격입니다." },
        { term: "차상위계층", explanation: "기초수급자 바로 윗 단계로, 형편이 어렵지만 일부 감면 혜택을 받는 분들입니다." }
      ],
      dates: "2026년 4월 30일(목) 오후 6시까지 (마감 전 신청 필요)",
      target: "남양주시에 거주하는 기초수급자, 차상위계층 및 위기 독거어르신 가구",
      documents: ["신분증 (주민등록증 또는 운전면허증)", "통장 사본 (본인 명의)", "금융정보제공동의서 (주민센터 구비)", "월세 계약서 (해당자)"],
      whereToApply: "평내동 종합행정복지센터 맞춤형복지팀 (방문 접수)",
      contact: "평내동 복지팀 (031-590-2605) / 보건복지상담센터 (129)"
    },
    en: {
      summary: [
        "Provides emergency living support of 713,100 KRW/month for 3 months to households facing sudden economic crises.",
        "Vulnerable neighbors and seniors living alone will also receive additional winter heating fuel discounts.",
        "Visit the Custom Welfare Team at Pyeongnae-dong Community Center with your ID card and bankbook copy."
      ],
      terms: [
        { term: "Median Income 75% (기준중위소득 75%)", explanation: "Income threshold below 75% when ranking all Korean households by income." },
        { term: "Basic Livelihood Recipient (기초생활보장 수급권자)", explanation: "Eligibility for monthly government subsidies for living and medical costs." },
        { term: "Near-Poverty Class (차상위계층)", explanation: "Households slightly above basic welfare who still qualify for essential government discounts." }
      ],
      dates: "By April 30, 2026 (Thu) 18:00 (Apply before deadline)",
      target: "Basic recipients, near-poverty households, and seniors living alone in Namyangju City",
      documents: ["ID Card (Resident Card or Driver's License)", "Bankbook Copy (Under applicant's name)", "Financial Information Consent Form (Available at Center)", "Lease Agreement (if applicable)"],
      whereToApply: "Pyeongnae-dong Integrated Community Service Center - Custom Welfare Team (In-person)",
      contact: "Pyeongnae Welfare Team (031-590-2605) / Ministry of Health & Welfare (129)"
    },
    zh: {
      summary: [
        "为面临突发经济危机的居民提供为期 3 个月、每月 713,100 韩元的紧急生活费补助。",
        "除困难家庭外，独居老人还可额外享受冬季取暖燃料费减免。",
        "请携带身份证和存折复印件，前往坪内洞综合行政福利中心定制福利组办理申请。"
      ],
      terms: [
        { term: "基准中位收入 75% (기준중위소득 75%)", explanation: "按全国家庭收入排序时处于 75% 水平以下的收入标准。" },
        { term: "基础生活保障受惠人 (기초생활수급권자)", explanation: "因收入或财产较少而每月享受国家生活费及医疗费补助的资格。" },
        { term: "次上位阶层 (차상위계층)", explanation: "处于低保边缘、但仍可享受各项民生减免优惠的困难家庭。" }
      ],
      dates: "截至 2026年 4月 30日(周四) 18:00 (请在截止日前申请)",
      target: "居住在南杨州市的低保户、次上位阶层及独居老人困难家庭",
      documents: ["身份证 (外国人登入证或驾照)", "本人存折复印件", "金融信息提供同意书 (福利中心备有)", "房屋租赁合同 (适用者)"],
      whereToApply: "坪内洞综合行政福利中心 定制福利组 (现场办理)",
      contact: "坪内洞福利组 (031-590-2605) / 保健福利咨询热线 (129)"
    },
    vi: {
      summary: [
        "Hỗ trợ chi phí sinh hoạt khẩn cấp 713.100 KRW/tháng trong 3 tháng cho các hộ gia đình gặp khó khăn kinh tế đột xuất.",
        "Ngoài hộ khó khăn, người cao tuổi neo đơn còn được giảm thêm tiền nhiên liệu sưởi ấm mùa đông.",
        "Hãy mang theo CCCD/hộ chiếu và bản sao sổ ngân hàng đến Đội Phúc lợi Tùy biến tại Trung tâm Hành chính Phúc lợi Pyeongnae-dong."
      ],
      terms: [
        { term: "75% Thu nhập trung vị chuẩn (기준중위소득 75%)", explanation: "Mức thu nhập dưới 75% khi xếp hạng tất cả các hộ gia đình tại Hàn Quốc theo thu nhập." },
        { term: "Đối tượng thụ hưởng bảo trợ cơ bản (기초생활수급권자)", explanation: "Người có thu nhập thấp được nhà nước trợ cấp sinh hoạt phí và y tế hàng tháng." },
        { term: "Hộ cận nghèo (차상위계층)", explanation: "Nhóm ngay trên diện hộ nghèo, vẫn được hưởng các ưu đãi miễn giảm dịch vụ công thiết yếu." }
      ],
      dates: "Đến 18:00 thứ Năm, ngày 30 tháng 4 năm 2026 (Cần nộp trước hạn)",
      target: "Hộ hưởng bảo trợ cơ bản, cận nghèo và người già neo đơn cư trú tại TP Namyangju",
      documents: ["Thẻ chứng minh/hộ chiếu", "Bản sao sổ ngân hàng chính chủ", "Giấy đồng ý cung cấp thông tin tài chính (có tại trung tâm)", "Hợp đồng thuê nhà (nếu có)"],
      whereToApply: "Đội Phúc lợi Tùy biến - Trung tâm Hành chính Phúc lợi Tổng hợp Pyeongnae-dong (Đến nộp trực tiếp)",
      contact: "Đội Phúc lợi Pyeongnae (031-590-2605) / Tổng đài Phúc lợi Y tế (129)"
    },
    ja: {
      summary: [
        "突発的な経済危機に直面した住民へ、3ヶ月間月額713,100ウォンの緊急生計費を支援します。",
        "生活困難な世帯だけでなく、独居高齢者の方も冬季暖房費の追加減免を受けられます。",
        "身分証と通帳コピーを持参し、坪内洞総合行政福祉センターの福祉チームへご訪問ください。"
      ],
      terms: [
        { term: "基準中位数所得 75%", explanation: "韓国全世帯を所得順に並べた際に75%以下に位置する所得基準です。" },
        { term: "国民基礎生活保障受給権者", explanation: "所得・財産が基準以下で、国から毎月生計費や医療費の補助を受ける資格です。" },
        { term: "準困窮層（次上位階層）", explanation: "基礎受給者の直上に位置し、各種公共料金の減免恩恵を受けられる世帯です。" }
      ],
      dates: "2026年4月30日(木) 18:00まで（締切前申請必須）",
      target: "南楊州市在住の基礎受給者、次上位階層、および危機独居高齢者世帯",
      documents: ["身分証明書", "本人名義の通帳コピー", "金融情報提供同意書（センター備え付け）", "賃貸借契約書（該当者）"],
      whereToApply: "坪内洞総合行政福祉センター カスタム福祉チーム（訪問受付）",
      contact: "坪内洞福祉チーム (031-590-2605) / 保健福祉相談センター (129)"
    },
    th: {
      summary: [
        "มอบเงินช่วยเหลือค่าครองชีพฉุกเฉิน 713,100 วอน/เดือน เป็นเวลา 3 เดือน สำหรับครอบครัวที่ประสบวิกฤตเศรษฐกิจกะทันหัน",
        "นอกจากครอบครัวยากไร้แล้ว ผู้สูงอายุที่อาศัยอยู่คนเดียวยังได้รับส่วนลดค่าเชื้อเพลิงทำความร้อนในฤดูหนาวเพิ่มเติมด้วย",
        "กรุณานำบัตรประชาชนและสมุดบัญชีธนาคารไปยื่นที่ศูนย์บริการสวัสดิการชุมชนพยองแนดง"
      ],
      terms: [
        { term: "รายได้มัธยฐาน 75% (기준중위소득 75%)", explanation: "เกณฑ์รายได้ที่ต่ำกว่า 75% เมื่อจัดอันดับรายได้ของทุกครัวเรือนในเกาหลีใต้" },
        { term: "ผู้ได้รับสิทธิสวัสดิการขั้นพื้นฐาน (수급권자)", explanation: "ผู้มีสิทธิ์ได้รับเงินช่วยเหลือค่าครองชีพและการรักษาพยาบาลรายเดือนจากรัฐบาล" },
        { term: "กลุ่มเกือบยากจน (차상위계층)", explanation: "กลุ่มที่มีรายได้สูงกว่าผู้รับสวัสดิการขั้นพื้นฐานเล็กน้อย แต่ยังได้รับส่วนลดค่าบริการต่างๆ" }
      ],
      dates: "ภายในวันที่ 30 เมษายน 2026 (พฤหัสบดี) เวลา 18:00 น.",
      target: "ผู้รับสวัสดิการขั้นพื้นฐาน, ครัวเรือนเกือบยากจน และผู้สูงอายุอยู่ลำพังในเมืองนัมยังจู",
      documents: ["บัตรประชาชน/หนังสือเดินทาง", "สำเนาสมุดบัญชีธนาคาร", "หนังสือยินยอมให้ข้อมูลทางการเงิน", "สัญญาเช่าบ้าน (ถ้ามี)"],
      whereToApply: "ศูนย์บริการชุมชนพยองแนดง ทีมสวัสดิการแบบปรับแต่ง (ยื่นด้วยตนเอง)",
      contact: "ทีมสวัสดิการพยองแน (031-590-2605) / สายด่วนสวัสดิการ (129)"
    },
    tl: {
      summary: [
        "Nagbibigay ng emergency living support na 713,100 KRW/buwan hanggang 3 buwan para sa mga pamilyang nahaharap sa biglaang krisis pinansyal.",
        "Makakatanggap din ng karagdagang diskwento sa pampainit sa taglamig ang mga kapus-palad at mag-isang matatanda.",
        "Pumunta lamang sa Custom Welfare Team ng Pyeongnae-dong Community Center dala ang iyong ID at kopya ng bankbook."
      ],
      terms: [
        { term: "Median Income 75% (기준중위소득 75%)", explanation: "Pamantayan sa kita na mas mababa sa 75% kapag inihanay ang lahat ng sambahayan sa Korea." },
        { term: "Basic Livelihood Recipient (수급권자)", explanation: "Kwalipikasyon para sa buwanang tulong pinansyal at medikal mula sa gobyerno dahil sa mababang kita." },
        { term: "Near-Poverty Class (차상위계층)", explanation: "Medyo mas mataas sa basic welfare ngunit kwalipikado pa rin sa mga diskwento ng gobyerno." }
      ],
      dates: "Hanggang Abril 30, 2026 (Huwebes) 18:00 (Mag-apply bago matapos)",
      target: "Mga benepisyaryo ng welfare, near-poverty, at mag-isang matatanda sa Namyangju",
      documents: ["ID Card / Passport", "Kopya ng Bankbook", "Financial Information Consent Form", "Kontrata sa Pagpapaupa (kung mayroon)"],
      whereToApply: "Pyeongnae-dong Community Center - Custom Welfare Team (Personal na pagpunta)",
      contact: "Pyeongnae Welfare Team (031-590-2605) / Welfare Hotline (129)"
    },
    id: {
      summary: [
        "Memberikan bantuan biaya hidup darurat sebesar 713.100 KRW/bulan selama 3 bulan bagi keluarga yang mengalami krisis ekonomi mendadak.",
        "Selain keluarga kurang mampu, lansia yang tinggal sendirian juga mendapat potongan biaya pemanas musim dingin.",
        "Kunjungi Tim Kesejahteraan Khusus di Pusat Komunitas Pyeongnae-dong dengan membawa KTP/Paspor dan salinan buku tabungan."
      ],
      terms: [
        { term: "Pendapatan Median 75% (기준중위소득 75%)", explanation: "Batas pendapatan di bawah 75% dari seluruh rumah tangga di Korea Selatan." },
        { term: "Penerima Jaminan Hidup Dasar (수급권자)", explanation: "Status penerima subsidi biaya hidup dan medis bulanan dari pemerintah karena berpenghasilan rendah." },
        { term: "Golongan Hampir Miskin (차상위계층)", explanation: "Satu tingkat di atas penerima bantuan dasar yang masih berhak atas potongan tarif layanan publik." }
      ],
      dates: "Hingga 30 April 2026 (Kamis) 18:00 (Ajukan sebelum tenggat waktu)",
      target: "Penerima bantuan dasar, golongan hampir miskin, dan lansia sebatang kara di Kota Namyangju",
      documents: ["Kartu Identitas / Paspor", "Salinan Buku Tabungan", "Formulir Persetujuan Informasi Keuangan", "Surat Kontrak Sewa Rumah (jika ada)"],
      whereToApply: "Pusat Layanan Terpadu Pyeongnae-dong - Tim Kesejahteraan Khusus (Datang langsung)",
      contact: "Tim Kesejahteraan Pyeongnae (031-590-2605) / Hotline Kesejahteraan (129)"
    },
    mn: {
      summary: [
        "Гэнэтийн эдийн засгийн хямралд орсон өрхөд 3 сарын турш сар бүр 713,100 воны яаралтай амьжиргааны тэтгэмж олгоно.",
        "Хүнд нөхцөлтэй өрхүүдээс гадна ганц бие өндөр настнуудад өвлийн халаалтын түлшний нэмэлт хөнгөлөлт үзүүлнэ.",
        "Иргэний үнэмлэх болон банкны дэвтрийн хуулбартайгаа Пённэ-донгийн Захиргааны төвийн Халамжийн баг дээр очиж бүртгүүлнэ үү."
      ],
      terms: [
        { term: "Суурь дундаж орлого 75% (기준중위소득 75%)", explanation: "Солонгосын нийт өрхийг орлогоор нь эрэмбэлэхэд 75%-иас доош түвшинд хамаарах орлогын стандарт." },
        { term: "Амьжиргааны үндсэн баталгаа хүлээн авагч (수급권자)", explanation: "Орлого, эд хөрөнгө бага тул улсаас сар бүр амьжиргаа, эрүүл мэндийн тэтгэмж авах эрх." },
        { term: "Нэн ядуугийн өмнөх давхарга (차상위계층)", explanation: "Үндсэн тэтгэмж авагчаас арай дээгүүр боловч төрийн зарим хөнгөлөлт авах эрхтэй иргэд." }
      ],
      dates: "2026 оны 4-р сарын 30-ны (Пүрэв) 18:00 цаг хүртэл (Хугацаанаас өмнө бүртгүүлэх шаардлагатай)",
      target: "Намъянжү хотод оршин суудаг үндсэн тэтгэмж авагчид, ядуугийн өмнөх давхарга болон ганц бие өндөр настнууд",
      documents: ["Иргэний үнэмлэх / Гадаад иргэний үнэмлэх", "Банкны дансны хуулбар", "Санхүүгийн мэдээлэл өгөх зөвшөөрлийн хуудас", "Түрээсийн гэрээ (хэрэв байгаа бол)"],
      whereToApply: "Пённэ-донгийн Захиргааны нэгдсэн төв - Тусгай халамжийн баг (Биечлэн очих)",
      contact: "Пённэ халамжийн баг (031-590-2605) / Эрүүл мэнд, халамжийн зөвлөгөөний төв (129)"
    },
    ru: {
      summary: [
        "Предоставление экстренной помощи на проживание в размере 713 100 вон/мес. на срок до 3 месяцев семьям в кризисной ситуации.",
        "Помимо малообеспеченных граждан, одинокие пожилые люди получат дополнительную скидку на отопление в зимний период.",
        "Обратитесь в Отдел адресной социальной помощи центра Пхённэ-дон с удостоверением личности и копией банковской книжки."
      ],
      terms: [
        { term: "75% медианного дохода (기준중위소득 75%)", explanation: "Порог дохода ниже 75% от среднего уровня всех домохозяйств Республики Корея." },
        { term: "Получатель базовой соцпомощи (수급권자)", explanation: "Статус граждан с низким доходом, дающий право на ежемесячные выплаты и медицинские субсидии." },
        { term: "Малообеспеченный класс (차상위계층)", explanation: "Категория граждан чуть выше уровня бедности, имеющая право на ряд льгот." }
      ],
      dates: "До 30 апреля 2026 г. (Чт) 18:00 (Подать до истечения срока)",
      target: "Получатели базовых пособий, малообеспеченные граждане и одинокие пожилые люди в г. Намъянджу",
      documents: ["Удостоверение личности / Паспорт", "Копия банковской книжки заявителя", "Согласие на обработку финансовых данных", "Договор аренды жилья (при наличии)"],
      whereToApply: "Комплексный центр обслуживания Пхённэ-дон - Отдел адресной помощи (Личный визит)",
      contact: "Отдел соцзащиты Пхённэ (031-590-2605) / Горячая линия Минздрава (129)"
    }
  },
  medical: {
    ko: {
      summary: [
        "남양주시에 등록된 외국인 근로자 및 다문화가족에게 무료 건강검진과 독감 예방접종을 지원합니다.",
        "흉부 X-ray, 혈액검사, 당뇨 검사 등 기본 건강검진을 전액 무료로 받으실 수 있습니다.",
        "외국인등록증이나 여권을 지참하여 남양주시 보건소 또는 평내건강생활지원센터를 방문하시면 됩니다."
      ],
      terms: [
        { term: "계절근로자", explanation: "농번기 등에 일정 기간 농가에서 일하도록 허가받은 외국인 근로자입니다." },
        { term: "인플루엔자 예방접종", explanation: "독감 바이러스 감염을 예방하기 위한 백신 주사입니다." }
      ],
      dates: "2026년 4월 매주 수요일 오전 09:00 ~ 12:00",
      target: "남양주시 관내 사업장 및 농가에 등록된 외국인 등록증 소지자",
      documents: ["외국인등록증 (또는 여권)"],
      whereToApply: "남양주시 보건소 및 평내건강생활지원센터",
      contact: "남양주시 보건행정과 (031-590-8000)"
    },
    en: {
      summary: [
        "Free health checkups and flu vaccinations for registered foreign workers and multicultural families in Namyangju.",
        "Covers chest X-ray, blood test, blood pressure, and diabetes screening completely free of charge.",
        "Visit Namyangju Public Health Center or Pyeongnae Health Support Center with your Alien Registration Card or Passport."
      ],
      terms: [
        { term: "Seasonal Worker (계절근로자)", explanation: "Foreign workers officially permitted to work on farms during peak farming seasons." },
        { term: "Influenza Vaccination (인플루엔자 예방접종)", explanation: "Vaccine injection to prevent infection from the influenza (flu) virus." }
      ],
      dates: "Every Wednesday in April 2026, 09:00 - 12:00",
      target: "Foreign registration holders employed at workplaces/farms in Namyangju",
      documents: ["Alien Registration Card (or Passport)"],
      whereToApply: "Namyangju Public Health Center & Pyeongnae Community Health Center",
      contact: "Namyangju Public Health Administration (031-590-8000)"
    },
    zh: {
      summary: [
        "为在南杨州市登记的外国劳动者及多文化家庭提供免费健康体检与流感疫苗接种。",
        "胸部 X 光、血液检查、血压及血糖等基础体检项目费用全免。",
        "请携带外国人登录证或护照，前往南杨州市保健所或坪内健康生活支援中心。"
      ],
      terms: [
        { term: "季节性劳动者 (계절근로자)", explanation: "获准在农忙时节在农场短期务工的外国劳动者。" },
        { term: "流感疫苗接种 (인플루엔자 예방접종)", explanation: "预防流行性感冒病毒感染的疫苗注射。" }
      ],
      dates: "2026年 4月 每周三 上午 09:00 ~ 12:00",
      target: "在南杨州市内企业及农户登记的外国人登录证持有者",
      documents: ["外国人登录证 (或护照)"],
      whereToApply: "南杨州市保健所及坪内健康生活支援中心",
      contact: "南杨州市保健行政科 (031-590-8000)"
    },
    vi: {
      summary: [
        "Cung cấp khám sức khỏe miễn phí và tiêm phòng cúm cho lao động nước ngoài và gia đình đa văn hóa tại TP Namyangju.",
        "Miễn phí toàn bộ chụp X-quang phổi, xét nghiệm máu, đo huyết áp và kiểm tra đường huyết cơ bản.",
        "Hãy mang theo Thẻ đăng ký người nước ngoài hoặc Hộ chiếu đến Trung tâm Y tế Namyangju hoặc Trung tâm Hỗ trợ Sức khỏe Pyeongnae."
      ],
      terms: [
        { term: "Lao động thời vụ (계절근로자)", explanation: "Lao động nước ngoài được phép làm việc tại các trang trại vào mùa cao điểm nông nghiệp." },
        { term: "Tiêm phòng cúm mùa (인플루엔자 예방접종)", explanation: "Mũi tiêm vắc xin phòng ngừa virus cúm mùa hàng năm." }
      ],
      dates: "Thứ Tư hàng tuần trong tháng 4 năm 2026, từ 09:00 đến 12:00",
      target: "Người có Thẻ đăng ký người nước ngoài đang làm việc tại các cơ sở/nông trại ở Namyangju",
      documents: ["Thẻ đăng ký người nước ngoài (hoặc Hộ chiếu)"],
      whereToApply: "Trung tâm Y tế Công cộng Namyangju & Trung tâm Sức khỏe Pyeongnae",
      contact: "Phòng Quản trị Y tế Namyangju (031-590-8000)"
    },
    ja: {
      summary: [
        "南楊州市に登録された外国人労働者および多文化家族へ無料健康診断とインフルエンザ予防接種を支援します。",
        "胸部レントゲン、血液検査、血圧・血糖検査などの基本検診を全額無料で受診いただけます。",
        "外国人登録証またはパスポートを持参の上、南楊州市保健所または坪内健康生活支援センターへご来所ください。"
      ],
      terms: [
        { term: "季節労働者", explanation: "農繁期などに一定期間農家で就労を許可された外国人労働者です。" },
        { term: "インフルエンザ予防接種", explanation: "インフルエンザウイルスの感染を防ぐためのワクチン注射です。" }
      ],
      dates: "2026年4月 毎週水曜日 午前09:00〜12:00",
      target: "南楊州市内の事業所および農家に登録された外国人登録証所持者",
      documents: ["外国人登録証（またはパスポート）"],
      whereToApply: "南楊州市保健所および坪内健康生活支援センター",
      contact: "南楊州市保健行政課 (031-590-8000)"
    },
    th: {
      summary: [
        "ตรวจสุขภาพฟรีและฉีดวัคซีนป้องกันไข้หวัดใหญ่สำหรับแรงงานต่างชาติและครอบครัวพหุวัฒนธรรมในเมืองนัมยังจู",
        "ตรวจเอกซเรย์ทรวงอก, ตรวจเลือด, ความดันโลหิต และเบาหวานฟรีทั้งหมด",
        "กรุณานำบัตรประจำตัวคนต่างด้าวหรือหนังสือเดินทางไปที่ศูนย์สาธารณสุขนัมยังจู"
      ],
      terms: [
        { term: "แรงงานตามฤดูกาล (계절근로자)", explanation: "แรงงานต่างชาติที่ได้รับอนุญาตให้ทำงานในฟาร์มในช่วงฤดูเก็บเกี่ยว" },
        { term: "การฉีดวัคซีนไข้หวัดใหญ่ (인플루엔자 예방접종)", explanation: "การฉีดวัคซีนเพื่อป้องกันการติดเชื้อไวรัสไข้หวัดใหญ่" }
      ],
      dates: "ทุกวันพุธในเดือนเมษายน 2026 เวลา 09:00 - 12:00 น.",
      target: "ผู้ถือบัตรประจำตัวคนต่างด้าวที่ทำงานในสถานประกอบการ/ฟาร์มในนัมยังจู",
      documents: ["บัตรประจำตัวคนต่างด้าว (หรือหนังสือเดินทาง)"],
      whereToApply: "ศูนย์สาธารณสุขนัมยังจู และศูนย์ส่งเสริมสุขภาพพยองแน",
      contact: "ฝ่ายบริหารสาธารณสุขนัมยังจู (031-590-8000)"
    },
    tl: {
      summary: [
        "Libreng medical check-up at bakuna sa trangkaso para sa mga rehistradong dayuhang manggagawa at pamilyang multikultural sa Namyangju.",
        "Ganap na libreng Chest X-ray, pagsusuri sa dugo, presyon ng dugo, at diabetes test.",
        "Pumunta sa Namyangju Public Health Center o Pyeongnae Health Center dala ang iyong Alien Card o Pasaporte."
      ],
      terms: [
        { term: "Seasonal Worker (계절근로자)", explanation: "Mga dayuhang manggagawa na may pahintulot magtrabaho sa sakahan tuwing panahon ng pag-aani." },
        { term: "Flu Vaccination (인플루엔자 예방접종)", explanation: "Bakuna laban sa impeksyon ng influenza virus." }
      ],
      dates: "Tuwing Miyerkules sa Abril 2026, 09:00 - 12:00 ng umaga",
      target: "Mga dayuhang may Alien Card na nagtatrabaho sa Namyangju",
      documents: ["Alien Registration Card (o Pasaporte)"],
      whereToApply: "Namyangju Public Health Center at Pyeongnae Health Center",
      contact: "Namyangju Health Administration (031-590-8000)"
    },
    id: {
      summary: [
        "Pemeriksaan kesehatan gratis dan vaksin flu bagi pekerja asing terdaftar dan keluarga multikultural di Kota Namyangju.",
        "Mencakup Rontgen dada, tes darah, tekanan darah, dan gula darah secara gratis.",
        "Kunjungi Puskesmas Namyangju atau Pusat Kesehatan Pyeongnae dengan membawa Kartu Izin Tinggal Asing (ARC) atau Paspor."
      ],
      terms: [
        { term: "Pekerja Musiman (계절근로자)", explanation: "Tenaga kerja asing yang diizinkan bekerja di sektor pertanian saat musim panen." },
        { term: "Vaksinasi Influenza (인플루엔자 예방접종)", explanation: "Suntikan vaksin untuk mencegah penularan virus flu musiman." }
      ],
      dates: "Setiap hari Rabu di bulan April 2026, pukul 09:00 - 12:00",
      target: "Pemegang ARC yang terdaftar di tempat kerja/pertanian di Namyangju",
      documents: ["Alien Registration Card (atau Paspor)"],
      whereToApply: "Puskesmas Namyangju & Pusat Kesehatan Komunitas Pyeongnae",
      contact: "Dinas Administrasi Kesehatan Namyangju (031-590-8000)"
    },
    mn: {
      summary: [
        "Намъянжү хотод бүртгэлтэй гадаад ажилчид болон олон соёлт гэр бүлд зориулсан эрүүл мэндийн үнэгүй үзлэг, ханиадны вакцинжуулалт.",
        "Цээжний рентген, цусны шинжилгээ, даралт болон чихрийн шижингийн үзлэгийг бүрэн үнэ төлбөргүй хийнэ.",
        "Гадаад иргэний үнэмлэх эсвэл паспортоо аваад Намъянжү хотын Эрүүл мэндийн төвд очно уу."
      ],
      terms: [
        { term: "Улирлын чанартай ажилчин (계절근로자)", explanation: "Хөдөө аж ахуйн оргил үед фермд ажиллах зөвшөөрөл авсан гадаад иргэд." },
        { term: "Ханиадны вакцинжуулалт (인플루엔자 예방접종)", explanation: "Ханиадны вирусээс урьдчилан сэргийлэх дархлаажуулалтын тарилга." }
      ],
      dates: "2026 оны 4-р сарын Лхагва гараг бүр, 09:00 - 12:00 цагт",
      target: "Намъянжү хотын аж ахуйн нэгж, фермд бүртгэлтэй гадаад иргэний үнэмлэх эзэмшигчид",
      documents: ["Гадаад иргэний үнэмлэх (эсвэл паспорт)"],
      whereToApply: "Намъянжү хотын Эрүүл мэндийн төв ба Пённэ Эрүүл мэндийн төв",
      contact: "Намъянжү хотын Эрүүл мэндийн захиргааны хэлтэс (031-590-8000)"
    },
    ru: {
      summary: [
        "Бесплатный медосмотр и вакцинация против гриппа для зарегистрированных иностранных рабочих и мультикультурных семей в г. Намъянджу.",
        "Включает флюорографию, анализ крови, измерение давления и уровня сахара полностью бесплатно.",
        "Посетите Центр общественного здоровья Намъянджу или Центр Пхённэ с регистрационной картой иностранца или паспортом."
      ],
      terms: [
        { term: "Сезонный рабочий (계절근로자)", explanation: "Иностранные работники, допущенные к временной работе на фермах в пик сельхозсезона." },
        { term: "Вакцинация против гриппа (인플루엔자 예방접종)", explanation: "Прививка для предотвращения заражения вирусом сезонного гриппа." }
      ],
      dates: "Каждую среду в апреле 2026 г. с 09:00 до 12:00",
      target: "Владельцы карт иностранца, занятые на предприятиях и фермах в г. Намъянджу",
      documents: ["Регистрационная карта иностранца (или загранпаспорт)"],
      whereToApply: "Центр здоровья Намъянджу и Центр поддержки здоровья Пхённэ",
      contact: "Отдел управления здравоохранением Намъянджу (031-590-8000)"
    }
  }
};

/**
 * 주어진 텍스트를 선택된 언어로 깔끔하고 자연스럽게 번역 (불필요한 헤더/푸터 태그 없이)
 */
export function translateTextToTargetLang(text: string, targetLang: string): string {
  if (targetLang === "ko" || !text) return text;

  // Check in dictionary
  for (const docKey of ["emergency", "medical"] as const) {
    const koReport = MULTILINGUAL_DOC_ANALYSIS[docKey].ko;
    const targetReport = MULTILINGUAL_DOC_ANALYSIS[docKey][targetLang] || MULTILINGUAL_DOC_ANALYSIS[docKey].en;

    // Check summary items
    for (let i = 0; i < koReport.summary.length; i++) {
      if (text === koReport.summary[i] && targetReport.summary[i]) {
        return targetReport.summary[i];
      }
    }
    // Check dates
    if (text === koReport.dates) return targetReport.dates;
    // Check target
    if (text === koReport.target) return targetReport.target;
    // Check whereToApply
    if (text === koReport.whereToApply) return targetReport.whereToApply;
    // Check contact
    if (text === koReport.contact) return targetReport.contact;
    // Check documents
    for (let i = 0; i < koReport.documents.length; i++) {
      if (text === koReport.documents[i] && targetReport.documents[i]) {
        return targetReport.documents[i];
      }
    }
  }

  // Fallback for general phrases
  if (targetLang === "en") {
    return text
      .replace(/갑작스러운 어려움에 처한 주민에게 3개월간 월 71만 원의 긴급 생계비를 지원합니다\./g, "Provides emergency living support of 713,100 KRW/month for up to 3 months to households facing sudden economic crises.")
      .replace(/어려운 이웃뿐 아니라 독거 어르신도 난방비와 함께 지원받을 수 있습니다\./g, "Vulnerable neighbors and seniors living alone will also receive additional winter heating fuel discounts.")
      .replace(/평내동 종합행정복지센터 복지팀에 신분증과 통장을 가지고 방문하시면 됩니다\./g, "Visit the Custom Welfare Team at Pyeongnae-dong Community Center with your ID card and bankbook copy.")
      .replace(/말씀해주셔서 정말 감사해요/g, "Thank you very much for sharing your situation with us.")
      .replace(/공공데이터포털 연계/g, "Linked with Public Data Portal")
      .replace(/공식 정보를 확인하여/g, "We verified official administrative guidelines");
  }

  return text;
}

/**
 * Dynamically analyzes arbitrary administrative document text (from file upload or user paste)
 */
export function analyzeCustomAdminDoc(inputText: string, lang: string = "ko"): AdminDocReport {
  // 1. Check if matching preset samples
  if (inputText.includes("의료지원") || inputText.includes("건강검진") || inputText.includes("보건소") || inputText.includes("계절근로자")) {
    const preset = MULTILINGUAL_DOC_ANALYSIS.medical?.[lang] || MULTILINGUAL_DOC_ANALYSIS.medical?.ko;
    if (preset) return preset;
  }
  if (inputText.includes("긴급생활안정자금") || inputText.includes("긴급복지") || inputText.includes("생계안정") || inputText.includes("기준중위소득")) {
    const preset = MULTILINGUAL_DOC_ANALYSIS.emergency?.[lang] || MULTILINGUAL_DOC_ANALYSIS.emergency?.ko;
    if (preset) return preset;
  }

  // 2. Dynamic extraction from custom text
  const lines = inputText.split("\n").map((l) => l.trim()).filter(Boolean);
  
  // Extract terms found in text
  const matchedTerms: { term: string; explanation: string }[] = [];
  for (const [term, data] of Object.entries(ADMINISTRATIVE_TERM_SIMPLIFIER)) {
    if (inputText.includes(term)) {
      matchedTerms.push({
        term: `${term} (${data.easy})`,
        explanation: data.explanation
      });
    }
  }

  // Default fallback terms if none found
  if (matchedTerms.length === 0) {
    matchedTerms.push(
      { term: "행정복지센터", explanation: "주민등록등본 발급과 복지 상담을 받는 동네 관공서(동주민센터)입니다." },
      { term: "구비서류", explanation: "신청을 위해 본인이 직접 준비해서 제출해야 하는 서류 목록입니다." },
      { term: "소득인정액", explanation: "복지 자격을 심사하기 위해 월소득과 재산을 합쳐 산정한 공적 기준 금액입니다." }
    );
  }

  // Extract dates / deadline
  let dates = "공고문 내 신청 기한 및 상세 일정 확인 필요";
  const dateLine = lines.find((l) => /(신청기한|기한|일시|기간|접수기간|마감)/i.test(l));
  if (dateLine) {
    dates = dateLine.replace(/^[-*•0-9.\s]+(신청기한|기한|일시|기간|접수기간|마감)[:\s]*/i, "").trim() || dateLine;
  } else {
    const dateMatch = inputText.match(/\d{4}[.\-/년]\s*\d{1,2}[.\-/월]\s*\d{1,2}/);
    if (dateMatch) {
      dates = `${dateMatch[0]} 전후 (상세 기한 공고문 참조)`;
    }
  }

  // Extract target
  let target = "관내 주민등록 거주자 및 공고 지원 조건 충족 가구";
  const targetLine = lines.find((l) => /(지원대상|대상자|대상|신청자격|자격요건)/i.test(l));
  if (targetLine) {
    target = targetLine.replace(/^[-*•0-9.\s]+(지원대상|대상자|대상|신청자격|자격요건)[:\s]*/i, "").trim() || targetLine;
  }

  // Extract documents
  let documents: string[] = ["신분증 (주민등록증, 외국인등록증, 여권 또는 운전면허증)", "통장 사본 (본인 명의 입금 계좌)"];
  const docLine = lines.find((l) => /(구비서류|제출서류|준비물|지참물|첨부서류)/i.test(l));
  if (docLine) {
    const docText = docLine.replace(/^[-*•0-9.\s]+(구비서류|제출서류|준비물|지참물|첨부서류)[:\s]*/i, "").trim();
    if (docText) {
      const parts = docText.split(/[,/·\n]/).map((p) => p.trim()).filter((p) => p.length > 1);
      if (parts.length > 0) {
        documents = parts;
      }
    }
  }

  // Extract place / contact
  let whereToApply = "관할 읍면동 행정복지센터(주민센터) 맞춤형복지팀";
  const placeLine = lines.find((l) => /(신청장소|접수장소|장소|신청방법|접수처)/i.test(l));
  if (placeLine) {
    whereToApply = placeLine.replace(/^[-*•0-9.\s]+(신청장소|접수장소|장소|신청방법|접수처)[:\s]*/i, "").trim() || placeLine;
  }

  let contact = "남양주시청 복지콜센터 / 보건복지상담센터 (129)";
  const contactLine = lines.find((l) => /(문의처|문의|연락처|상담전화|전화번호)/i.test(l));
  if (contactLine) {
    contact = contactLine.replace(/^[-*•0-9.\s]+(문의처|문의|연락처|상담전화|전화번호)[:\s]*/i, "").trim() || contactLine;
  } else {
    const phoneMatch = inputText.match(/0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|\b129\b/);
    if (phoneMatch) {
      contact = `관련 문의처: ${phoneMatch[0]}`;
    }
  }

  // Extract dynamic summary
  const summary: string[] = [];
  const titleCandidate = lines.find((l) => l.includes("공고") || l.includes("안내") || l.includes("지원") || l.includes("계획") || l.includes("프로젝트") || l.length > 8) || lines[0] || "공문서 주요 안내";
  
  const cleanTitle = titleCandidate.replace(/^[0-9.\-•\s]+/, "").slice(0, 120).trim();
  summary.push(`[핵심] ${cleanTitle}`);

  // Find key action or purpose lines
  const keyPoints = lines.filter((l) => {
    if (l === titleCandidate) return false;
    return /(사업목적|목적|문제|배경|지원내용|내용|방법|혜택|지원금|금액|서비스)/i.test(l) && l.length > 15;
  });

  if (keyPoints.length > 0) {
    // Clean up to first 2 concise sentences
    const point1 = keyPoints[0].replace(/^[0-9.\-•\s]+/, "").trim();
    summary.push(point1.length > 150 ? point1.slice(0, 140) + "..." : point1);
    if (keyPoints.length > 1) {
      const point2 = keyPoints[1].replace(/^[0-9.\-•\s]+/, "").trim();
      summary.push(point2.length > 150 ? point2.slice(0, 140) + "..." : point2);
    }
  }

  if (summary.length < 3) {
    summary.push(`신청 방법 및 장소: ${whereToApply} (기한: ${dates})`);
  }

  return {
    summary: summary.slice(0, 3),
    terms: matchedTerms.slice(0, 4),
    dates,
    target,
    documents,
    whereToApply,
    contact
  };
}



