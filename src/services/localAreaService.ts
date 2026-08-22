/**
 * LOCAL FIRST 계층형 지역 서비스
 * 기준 파일럿: 대한민국 → 경기도 → 남양주시 → 평내동
 * 연계 지역: 호평동, 금곡동
 */

export interface VillageInfo {
  code: string;
  name: string;
  fullName: string;
  representativeOrg: string;
  communityCenterPhone: string;
  garbageDay: string;
  busInfo: string;
  population: string;
  keyNotice: string;
}

export interface RegionHierarchy {
  country: string;
  province: string;
  city: string;
  township: string; // 읍/면/동
  village: string;  // 통/리
}

export const PILOT_REGION: RegionHierarchy = {
  country: "대한민국",
  province: "경기도",
  city: "남양주시",
  township: "평내동",
  village: "평내동 전역"
};

export const AVAILABLE_REGIONS = [
  {
    province: "경기도",
    city: "남양주시",
    townships: [
      {
        name: "평내·호평·금곡권역",
        villages: [
          {
            code: "pyeongnae",
            name: "평내동",
            fullName: "경기도 남양주시 평내동",
            representativeOrg: "평내동 주민자치센터 및 행정복지센터 (평내로 31)",
            communityCenterPhone: "031-590-2605",
            garbageDay: "일·화·목 일몰 후 배출 (월·수·금 수거)",
            busInfo: "경춘선 평내호평역, 땡큐10번, 땡큐11번, 광역 M2323",
            population: "약 38,500명 (다문화 및 어르신 가구 밀집)",
            keyNotice: "2026 평내동 어르신 안심돌봄 및 저소득 위기가구 긴급복지 지원 접수 중"
          },
          {
            code: "hopyeong",
            name: "호평동",
            fullName: "경기도 남양주시 호평동",
            representativeOrg: "호평동 주민자치센터 및 행정복지센터 (늘을2로 67)",
            communityCenterPhone: "031-590-2604",
            garbageDay: "월·수·금 일몰 후 배출 (화·목·토 수거)",
            busInfo: "경춘선 평내호평역 환승센터, 땡큐10번, 땡큐12번, 직행 1000번",
            population: "약 52,000명",
            keyNotice: "호평동 주민자치센터 2분기 문화·복지 프로그램 및 청년 취업지원 안내"
          },
          {
            code: "geumgok",
            name: "금곡동",
            fullName: "경기도 남양주시 금곡동",
            representativeOrg: "금곡양정 행정복지센터 (홍유릉로 271)",
            communityCenterPhone: "031-590-2603",
            garbageDay: "일·화·목 일몰 후 배출 (월·수·금 수거)",
            busInfo: "경춘선 금곡역, 땡큐10번, 땡큐20번, 시내버스 65번",
            population: "약 19,800명",
            keyNotice: "금곡 도시재생 주민공동체 지원사업 및 어르신 일자리 상담 창구 운영"
          }
        ]
      }
    ]
  }
];

export function getVillageData(code: string): VillageInfo {
  for (const p of AVAILABLE_REGIONS) {
    for (const t of p.townships) {
      for (const v of t.villages) {
        if (v.code === code) return v;
      }
    }
  }
  return AVAILABLE_REGIONS[0].townships[0].villages[0];
}
