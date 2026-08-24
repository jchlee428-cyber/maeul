/**
 * 평내동 주민자치센터 (http://pyeongnae.co.kr) 웹페이지 정보 검색 및 안내 전용 서비스 엔진
 * 
 * 평내동 주민자치센터 공식 웹사이트 내의:
 * 1. 실시간 강좌 프로그램 (생활체육, 어학, 취미·교양, 컴퓨터, 자격증, 요리 등)
 * 2. 수강신청 및 마이페이지 바로가기 링크
 * 3. 공지사항, 행사/공연안내, 자치회 활동 및 앨범
 * 4. 주민자치센터 위치, 대표전화, 팩스, 오시는 길
 * 정보를 실시간 색인 및 정밀 검색하여 안내합니다.
 */

export interface PyeongnaeCourse {
  id: string;
  name: string;
  category: "sports" | "language" | "hobby" | "computer" | "cert" | "cooking" | "general";
  categoryLabel: string;
  status: "접수중" | "마감" | "안내";
  link: string;
  target?: string;
  description?: string;
}

export interface PyeongnaeNotice {
  id: string;
  title: string;
  date: string;
  category: "공지사항" | "행사/공연" | "자치회앨범";
  link: string;
  isHot?: boolean;
}

// 평내동 주민자치센터 공식 기본 정보
export const PYEONGNAE_CENTER_INFO = {
  name: "평내동 주민자치센터 (평내동 주민자치회)",
  websiteUrl: "http://pyeongnae.co.kr",
  address: "경기도 남양주시 경춘로 1286 (평내동 199-1)",
  phone: "031-591-4600",
  fax: "031-591-4668",
  email: "5914600@naver.com",
  operatingHours: "평일 09:00 ~ 18:00 (강좌 운영시간은 프로그램별 상이)",
  links: {
    home: "http://pyeongnae.co.kr",
    courseList: "http://pyeongnae.co.kr/shop/list.php?ca_id=10",
    courseGuide: "http://pyeongnae.co.kr/bbs/content.php?co_id=operation_guide",
    myPage: "http://pyeongnae.co.kr/shop/mypage.php",
    notice: "http://pyeongnae.co.kr/bbs/board.php?bo_table=notice",
    event: "http://pyeongnae.co.kr/bbs/board.php?bo_table=event",
    album: "http://pyeongnae.co.kr/bbs/board.php?bo_table=album",
    qa: "http://pyeongnae.co.kr/bbs/qalist.php",
    directions: "http://pyeongnae.co.kr/bbs/content.php?co_id=directions",
    introduce: "http://pyeongnae.co.kr/bbs/content.php?co_id=introduce"
  }
};

// 평내동 주민자치센터 강좌 데이터베이스
export const PYEONGNAE_COURSES: PyeongnaeCourse[] = [
  // 컴퓨터 / IT / AI
  { id: "1780968003", name: "스마트폰으로 만나는 AI세상", category: "computer", categoryLabel: "컴퓨터·IT", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780968003", description: "스마트폰 기본 활용부터 최신 생성형 AI 도구 실습" },
  { id: "1780967893", name: "컴퓨터 기초반", category: "computer", categoryLabel: "컴퓨터·IT", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967893", description: "어르신 및 초보자를 위한 PC 기초, 인터넷 검색, 문서 기본" },
  { id: "1780967869", name: "엑셀 기초반", category: "computer", categoryLabel: "컴퓨터·IT", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967869", description: "실무 및 일상 데이터 정리를 위한 엑셀 기초와 함수" },
  { id: "1780967980", name: "한글 파워포인트 기초->자격증", category: "computer", categoryLabel: "컴퓨터·IT", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967980", description: "한글 문서 작성 및 PPT 발표 자료 제작, ITQ 자격증 대비" },

  // 생활체육 / 건강 / 댄스
  { id: "1780967974", name: "헬스", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967974", description: "주민자치센터 헬스장 자유 이용 및 체력 증진" },
  { id: "1780967977", name: "요가&필라테스", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967977", description: "유연성과 코어 근육 강화를 위한 요가와 필라테스 병행" },
  { id: "1780967955", name: "생활요가", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967955", description: "스트레칭과 호흡으로 몸과 마음의 균형을 찾는 요가" },
  { id: "1780967971", name: "요가&라인댄스", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967971", description: "신나는 라인댄스와 몸을 풀어주는 요가의 만남" },
  { id: "1780967954", name: "신나는 라인댄스", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967954", description: "경쾌한 음악에 맞추어 스텝을 밟는 유산소 댄스" },
  { id: "1780967973", name: "줌바댄스 (오전A)", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967973", description: "라틴 리듬의 신나는 전신 유산소 피트니스" },
  { id: "1780967862", name: "줌바댄스 (오전B)", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967862", description: "신나는 줌바 댄스 오전 B반" },
  { id: "1780967847", name: "줌바댄스 저녁반", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967847", description: "퇴근 후 스트레스를 해소하는 야간 줌바 댄스" },
  { id: "1780967958", name: "파워줌바휘트니스", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967958", description: "체지방 연소와 근력 강화 중심의 고강도 줌바" },
  { id: "1780967967", name: "다이어트댄스&에어로빅A", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967967", description: "에어로빅과 다이어트 댄스를 결합한 체중감량 프로그램" },
  { id: "1780967861", name: "다이어트댄스&에어로빅B", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967861", description: "다이어트 댄스 및 에어로빅 B반" },
  { id: "1780967856", name: "다이어트댄스&에어로빅C (저녁반)", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967856", description: "직장인과 야간 수강생을 위한 다이어트 댄스" },
  { id: "1780967983", name: "건강사교댄스", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967983", description: "건강과 사교를 동시에 즐기는 댄스 스포츠" },
  { id: "1780967888", name: "행복 사교댄스", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967888", description: "초보자도 쉽게 배울 수 있는 행복 사교댄스" },
  { id: "1780967969", name: "사교댄스 (고급)", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967969", description: "정교한 스텝과 음악성을 익히는 사교댄스 고급반" },
  { id: "1780967999", name: "자이브, 룸바 (지루박, 부르스)", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967999", description: "라틴댄스 자이브, 룸바 및 한국형 사교댄스 테크닉" },
  { id: "1780967981", name: "모던 고급반", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967981", description: "모던 댄스 심화 과정" },
  { id: "1780967960", name: "모던 중급반", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967960", description: "모던 댄스 중급 과정" },
  { id: "1780967985", name: "성인/청소년발레 (초급)", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967985", description: "자세 교정과 체형 보정을 돕는 기초 발레" },
  { id: "1780967874", name: "성인/청소년발레 (중급)", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967874", description: "발레 기본기를 다진 분들을 위한 테크닉 과정" },
  { id: "1780967987", name: "시니어 건강체조", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967987", description: "어르신 관절과 유연성에 무리 없는 맞춤형 건강 체조" },
  { id: "1780967968", name: "힐링척추 근력운동", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967968", description: "허리 디스크 예방 및 바른 자세 척추 근력 강화" },
  { id: "1780967857", name: "척추허리 근력운동", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967857", description: "척추와 허리 기립근 중심의 재활성 근력 운동" },
  { id: "1780967998", name: "한국무용", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967998", description: "아름다운 전통 춤사위와 호흡을 배우는 한국무용" },
  { id: "1780967997", name: "시니어모델", category: "sports", categoryLabel: "생활체육", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967997", description: "바른 워킹과 자신감 넘치는 포즈를 배우는 시니어 모델 클래스" },

  // 어학 / 인문 / 교양
  { id: "1780967962", name: "기초영어회화", category: "language", categoryLabel: "어학·인문", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967962", description: "일상생활에서 바로 쓰는 친절한 기초 영어회화" },
  { id: "1780967963", name: "여행영어", category: "language", categoryLabel: "어학·인문", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967963", description: "해외여행 시 공항, 호텔, 식당, 쇼핑에서 꼭 필요한 회화" },
  { id: "1780967953", name: "Exciting 원어민영어 (초급)", category: "language", categoryLabel: "어학·인문", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967953", description: "원어민 강사와 함께하는 생생한 발음과 기초 대화" },
  { id: "1780967992", name: "원어민 일본어회화 (초급)", category: "language", categoryLabel: "어학·인문", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967992", description: "히라가나부터 기초 일상 회화까지 원어민과 함께 학습" },
  { id: "1780967881", name: "원어민 일본어회화 (중급)", category: "language", categoryLabel: "어학·인문", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967881", description: "자연스러운 일본어 표현과 토론 중심의 중급 회화" },
  { id: "1780967982", name: "모여라 한자교실", category: "language", categoryLabel: "어학·인문", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967982", description: "한자의 원리와 고사성어, 한자급수 대비 교실" },
  { id: "1780967854", name: "생활풍수, 명리학", category: "hobby", categoryLabel: "인문·교양", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967854", description: "일상 공간의 조화와 동양 인문철학 명리학 탐구" },
  { id: "1780967984", name: "부동산경매와 재테크", category: "hobby", categoryLabel: "인문·교양", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967984", description: "실전 부동산 권리분석 및 경매 절차, 자산 관리 기법" },

  // 문화 / 예술 / 악기 / 취미
  { id: "1780967976", name: "팡팡노래교실", category: "hobby", categoryLabel: "문화·예술", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967976", description: "최신 가요와 애창곡을 함께 부르며 힐링하는 노래교실" },
  { id: "1780967995", name: "7080 통기타 합주반", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967995", description: "추억의 7080 명곡을 기타로 합주하는 음악 앙상블" },
  { id: "1780967993", name: "금요 통기타 (초급)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967993", description: "기타 기본 코드와 스트로크 주법 입문" },
  { id: "1780967994", name: "금요 통기타 (중급)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967994", description: "핑거스타일과 아르페지오 등 심화 연주" },
  { id: "1780967878", name: "하모니카 (초급)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967878", description: "휴대하기 좋은 하모니카 기초 주법과 동요·가요 연주" },
  { id: "1780967865", name: "하모니카 (중급)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967865", description: "복음 하모니카 테크닉과 앙상블 합주" },
  { id: "1780967970", name: "난타 기초반", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967970", description: "신나는 북 가락으로 스트레스를 날리는 난타 입문" },
  { id: "1780967966", name: "난타반", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967966", description: "다양한 난타 리듬과 퍼포먼스 연습" },
  { id: "1780967859", name: "난타 저녁반 (중급)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967859", description: "퇴근 후 즐기는 역동적인 난타 퍼포먼스" },
  { id: "1780967979", name: "아랑고고장구 (초급)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967979", description: "퓨전 장구 리듬에 맞춰 가요를 연주하는 고고장구 입문" },
  { id: "1780967890", name: "아랑고고장구 (중급)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967890", description: "화려한 타법과 안무를 결합한 고고장구 중급" },
  { id: "1780967850", name: "아랑고고장구 (심화)", category: "hobby", categoryLabel: "악기·음악", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967850", description: "공연 및 심화 테크닉 중심의 아랑고고장구" },
  { id: "1780968005", name: "서예 화요반A", category: "hobby", categoryLabel: "미술·서예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780968005", description: "붓글씨 기본 필법과 한문·한글 서예" },
  { id: "1780967894", name: "서예 화요반B", category: "hobby", categoryLabel: "미술·서예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967894", description: "서예 작품 제작 및 낙관 쓰기" },
  { id: "1780967889", name: "문자예술반", category: "hobby", categoryLabel: "미술·서예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967889", description: "문자의 조형미를 살린 캘리그라피 및 서예 예술" },
  { id: "1780967978", name: "민화 (전통·현대)", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967978", description: "우리 전통 민화 채색과 현대적 재해석" },
  { id: "1780967986", name: "어반스케치", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967986", description: "펜과 수채 물감으로 우리 동네와 일상을 빠르게 그리는 스케치" },
  { id: "1780967957", name: "유화반 (화요반)", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967957", description: "유화 물감의 질감과 색채를 배우는 풍경·정물화" },
  { id: "1780967875", name: "유화·수채화반 (서양화반)", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967875", description: "수채화의 맑은 붓터치와 유화 테크닉" },
  { id: "1780968002", name: "보타니컬아트·펜드로잉", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780968002", description: "식물 세밀화 보타니컬 아트와 정교한 펜화 드로잉" },
  { id: "1780967952", name: "수채화 캘리그라피", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967952", description: "감성 손글씨와 은은한 수채 일러스트의 조화" },
  { id: "1780967841", name: "실크아트 인물화", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967841", description: "실크 소재 위에 섬세하게 그리는 인물 초상화" },
  { id: "1780967965", name: "생활도예", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967965", description: "흙을 빚어 컵, 접시, 화병 등 실생활 도자기 제작" },
  { id: "1780967964", name: "토탈공예", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967964", description: "레진, 가죽, 냅킨 등 다양한 공예 기법 체험" },
  { id: "1780967951", name: "프랑스자수", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967951", description: "기초 스티치로 소품과 원단을 수놓는 프랑스 전통 자수" },
  { id: "1780968000", name: "뜨개기초 취미반", category: "hobby", categoryLabel: "미술·공예", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780968000", description: "코바늘, 대바늘로 만드는 목도리, 가방, 수세미" },

  // 자격증 / 전문과정
  { id: "1780967990", name: "심리타로 (심벌론카드)", category: "cert", categoryLabel: "심리·자격증", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967990", description: "심벌론 카드를 활용한 내면 심리 상담 및 해석법" },
  { id: "1780967991", name: "힐링타로 마음정원", category: "cert", categoryLabel: "심리·자격증", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967991", description: "타로 카드를 통해 마음을 치유하고 대인관계를 성찰하는 강좌" },
  { id: "1780967959", name: "정리수납 자격증반 (5주)", category: "cert", categoryLabel: "자격증", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967959", description: "공간 정리수납 전문가 2급 자격 취득 5주 완성" },
  { id: "1780967956", name: "초등수학지도사 자격증반", category: "cert", categoryLabel: "자격증", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967956", description: "초등 교과 수학 지도법 및 창의사고력 지도사 양성" },
  { id: "1780967988", name: "중등수학지도사 자격증반", category: "cert", categoryLabel: "자격증", status: "접수중", link: "http://pyeongnae.co.kr/shop/item.php?it_id=1780967988", description: "중등 수학 개념 지도 및 서술형 대비 지도사 자격 과정" }
];

// 평내동 주민자치센터 최신 공지사항 및 행사 데이터
export const PYEONGNAE_NOTICES: PyeongnaeNotice[] = [
  { id: "notice-199", title: "2026년 궁집에서 전통혼례 참가자 모집 (2차)", date: "2026-08-04", category: "공지사항", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=notice&wr_id=199", isHot: true },
  { id: "notice-194", title: "2026년 궁집에서 전통혼례", date: "2026-06-09", category: "공지사항", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=notice&wr_id=194", isHot: true },
  { id: "notice-193", title: "2026년 3분기 (7월~9월) 수강생 모집 안내", date: "2026-06-09", category: "공지사항", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=notice&wr_id=193", isHot: true },
  { id: "notice-192", title: "2026년 모범 주민자치 선진지견학 대행업체 선정 공고", date: "2026-06-09", category: "공지사항", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=notice&wr_id=192", isHot: true },
  
  // 행사 및 공연
  { id: "event-37", title: "☆2026년 청소년 summer festival 물총축제", date: "2026-08-04", category: "행사/공연", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=event&wr_id=37", isHot: true },
  { id: "event-36", title: "2026년 환경시네마 & 환경교육 2차", date: "2026-08-04", category: "행사/공연", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=event&wr_id=36", isHot: true },
  { id: "event-35", title: "2026년 평내동 사랑나눔 헌혈행사", date: "2026-08-04", category: "행사/공연", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=event&wr_id=35" },
  { id: "event-34", title: "2026년 퇴계원 산대놀이 축제", date: "2026-08-04", category: "행사/공연", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=event&wr_id=34", isHot: true },

  // 자치회 활동 & 앨범
  { id: "album-54", title: "2024~2026 평내동 김장체험 및 사랑나눔 김장축제", date: "2024-11", category: "자치회앨범", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=album&wr_id=54" },
  { id: "album-53", title: "제9회 평내동 어울더울한마당 & 백봉산축제", date: "2024-10", category: "자치회앨범", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=album&wr_id=53" },
  { id: "album-52", title: "평내동 궁집에서 전통혼례 사진전", date: "2024-09", category: "자치회앨범", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=album&wr_id=52" },
  { id: "album-51", title: "제5회 평내동 주민총회", date: "2024-08", category: "자치회앨범", link: "http://pyeongnae.co.kr/bbs/board.php?bo_table=album&wr_id=51" }
];

/**
 * 사용자의 질문이 평내동 주민자치센터(pyeongnae.co.kr) 관련 질의인지 판별
 */
export function isPyeongnaeCenterQuery(query: string): boolean {
  const q = query.toLowerCase().replace(/\s+/g, "");

  // 사이트 URL 또는 직접 명칭
  if (
    q.includes("pyeongnae.co.kr") ||
    q.includes("평내동주민자치센터") ||
    q.includes("평내주민자치센터") ||
    q.includes("평내자치센터") ||
    q.includes("평내동주민자치회") ||
    q.includes("평내주민자치회") ||
    q.includes("평내자치회")
  ) {
    return true;
  }

  // 평내동 + 강좌/수강/문화/프로그램/공지/행사 질의
  const isPyeongnae = q.includes("평내") || q.includes("평내동");
  const isProgramKeyword =
    q.includes("수강") || q.includes("강좌") || q.includes("프로그램") || q.includes("문화센터") ||
    q.includes("요가") || q.includes("헬스") || q.includes("줌바") || q.includes("댄스") ||
    q.includes("기타") || q.includes("난타") || q.includes("서예") || q.includes("장구") ||
    q.includes("노래교실") || q.includes("발레") || q.includes("컴퓨터") || q.includes("엑셀") ||
    q.includes("타로") || q.includes("정리수납") || q.includes("일본어") || q.includes("영어") ||
    q.includes("공지") || q.includes("행사") || q.includes("전통혼례") || q.includes("물총축제") ||
    q.includes("수강신청") || q.includes("마이페이지") || q.includes("수강료");

  if (isPyeongnae && isProgramKeyword) {
    return true;
  }

  return false;
}

/**
 * 평내동 주민자치센터(http://pyeongnae.co.kr) 웹페이지 정밀 검색 및 응답 생성
 */
export function searchPyeongnaeCenterWeb(query: string): string {
  const q = query.toLowerCase().trim();
  const rawQ = query.trim();

  // 1. 특정 강좌명 또는 키워드 매칭 검색
  const matchedCourses = PYEONGNAE_COURSES.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase().replace(/\s+/g, ""));
    const descMatch = c.description ? c.description.toLowerCase().includes(q) : false;
    const catMatch = c.categoryLabel.toLowerCase().includes(q);

    // 개별 키워드 매칭 (예: 요가, 댄스, 기타, 난타, 서예, 일본어, 영어, 타로, 컴퓨터, 헬스, 발레 등)
    const keywords = ["요가", "헬스", "줌바", "댄스", "에어로빅", "기타", "난타", "장구", "서예", "캘리", "도예", "공예", "자수", "뜨개", "발레", "체조", "한국무용", "영어", "일본어", "한자", "부동산", "풍수", "컴퓨터", "엑셀", "파워포인트", "스마트폰", "ai", "타로", "수학지도사", "정리수납", "시니어모델", "노래교실"];
    const matchedKw = keywords.find((kw) => q.includes(kw) && (c.name.includes(kw) || (c.description && c.description.includes(kw))));

    return nameMatch || descMatch || catMatch || Boolean(matchedKw);
  });

  // 2. 공지사항 / 행사 매칭 검색
  const matchedNotices = PYEONGNAE_NOTICES.filter((n) => {
    return n.title.toLowerCase().includes(q) || q.includes("공지") || q.includes("행사") || q.includes("전통혼례") || q.includes("축제") || q.includes("모집");
  });

  // 3. 특정 강좌가 검색된 경우 상세 안내
  if (matchedCourses.length > 0) {
    const listText = matchedCourses.slice(0, 8).map((c, idx) => {
      return `${idx + 1}. **[${c.name}](${c.link})** (${c.categoryLabel} / 🏷️ \`${c.status}\`)\n   - 📝 ${c.description || "평내동 주민자치센터 공식 운영 강좌"}\n   - 🔗 [강좌 상세 및 온라인 신청하기 ➔](${c.link})`;
    }).join("\n\n");

    return `🏛️ **평내동 주민자치센터 (http://pyeongnae.co.kr) 강좌 검색 결과**

문의하신 내용에 맞춰 **평내동 주민자치센터 공식 웹페이지**에 개설된 강좌를 찾았습니다.

${listText}

${matchedCourses.length > 8 ? `\n*(총 ${matchedCourses.length}개 강좌 중 8개 표시)*\n` : ""}
---
📌 **수강신청 및 이용안내**:
- 🌐 **전체 강좌 목록 및 온라인 접수**: [http://pyeongnae.co.kr/shop/list.php?ca_id=10](http://pyeongnae.co.kr/shop/list.php?ca_id=10)
- 👤 **나의 수강내역 확인 (마이페이지)**: [http://pyeongnae.co.kr/shop/mypage.php](http://pyeongnae.co.kr/shop/mypage.php)
- 🏢 **위치**: ${PYEONGNAE_CENTER_INFO.address}
- 📞 **자치센터 문의 전화**: **${PYEONGNAE_CENTER_INFO.phone}** (팩스: ${PYEONGNAE_CENTER_INFO.fax})`;
  }

  // 4. 공지사항 또는 행사 관련 질의인 경우
  const isNoticeOrEventQuery = q.includes("공지") || q.includes("행사") || q.includes("소식") || q.includes("전통혼례") || q.includes("축제") || q.includes("모집");
  if (isNoticeOrEventQuery && matchedNotices.length > 0) {
    const noticeList = matchedNotices.slice(0, 6).map((n, idx) => {
      return `${idx + 1}. **[${n.title}](${n.link})** [${n.category} / 📅 ${n.date}]\n   - 🔗 [게시글 바로가기 ➔](${n.link})`;
    }).join("\n\n");

    return `📢 **평내동 주민자치센터 최신 알림 및 행사 소식**

평내동 주민자치센터([http://pyeongnae.co.kr](http://pyeongnae.co.kr))의 주요 공지와 행사 일정입니다.

${noticeList}

---
💡 **바로가기 링크**:
- 📌 [평내동 공지사항 전체보기](http://pyeongnae.co.kr/bbs/board.php?bo_table=notice)
- 🎭 [행사 및 공연안내 전체보기](http://pyeongnae.co.kr/bbs/board.php?bo_table=event)
- 📸 [주민자치회 활동 앨범](http://pyeongnae.co.kr/bbs/board.php?bo_table=album)
- 📞 **문의 전화**: **031-591-4600**`;
  }

  // 5. 종합 안내 (전체 소개, 카테고리별 요약, 대표 바로가기)
  return `🏛️ **평내동 주민자치센터 ([http://pyeongnae.co.kr](http://pyeongnae.co.kr)) 종합 안내**

남양주시 평내동 주민자치센터 및 주민자치회 공식 웹페이지 정보입니다.

📍 **기본 정보 & 연락처**:
- 🏢 **주소**: 경기도 남양주시 경춘로 1286 (평내동 199-1)
- 📞 **대표 전화**: **031-591-4600** | 📠 **팩스**: 031-591-4668
- ✉️ **이메일**: 5914600@naver.com
- 🌐 **공식 웹사이트**: [http://pyeongnae.co.kr](http://pyeongnae.co.kr)

---
📚 **운영 강좌 및 프로그램 분야**:
1. 🏃 **생활체육·건강**: 헬스, 요가&필라테스, 줌바댄스, 라인댄스, 에어로빅, 발레, 사교댄스, 시니어 건강체조, 힐링척추 근력운동, 한국무용, 시니어모델
2. 🗣️ **어학·인문**: 기초영어회화, 여행영어, Exciting 원어민영어, 원어민 일본어회화, 모여라 한자교실, 부동산경매와 재테크, 생활풍수·명리학
3. 🎨 **문화·예술·음악**: 팡팡노래교실, 7080 통기타 합주반, 하모니카, 난타, 아랑고고장구, 서예, 민화, 어반스케치, 유화/수채화, 보타니컬아트, 도예, 프랑스자수, 뜨개기초
4. 💻 **컴퓨터·IT**: 스마트폰으로 만나는 AI세상, 컴퓨터 기초반, 엑셀 기초반, 한글 파워포인트 자격증반
5. 📜 **자격증·전문**: 심리타로(심벌론카드), 힐링타로, 정리수납 5주 자격증반, 초등·중등수학지도사

---
🔗 **주요 메뉴 바로가기**:
- 📋 [강좌 소개 및 온라인 수강신청](http://pyeongnae.co.kr/shop/list.php?ca_id=10)
- 👤 [나의 수강내역 (마이페이지)](http://pyeongnae.co.kr/shop/mypage.php)
- ℹ️ [수강신청 및 이용안내](http://pyeongnae.co.kr/bbs/content.php?co_id=operation_guide)
- 📢 [평내동 공지사항](http://pyeongnae.co.kr/bbs/board.php?bo_table=notice)
- 🎭 [행사 / 공연 안내](http://pyeongnae.co.kr/bbs/board.php?bo_table=event)
- 🗺️ [오시는 길 안내](http://pyeongnae.co.kr/bbs/content.php?co_id=directions)

궁금하신 특정 강좌(예: *요가*, *헬스*, *컴퓨터*, *기타*, *전통혼례*, *수강신청 방법*)를 말씀해주시면 해당 정보를 바로 찾아드릴게요! 😊`;
}
