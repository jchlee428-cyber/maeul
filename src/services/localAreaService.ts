/**
 * LOCAL FIRST 계층형 지역 서비스
 * 기준 파일럿: 대한민국 → 경기도 → 남양주시 → 수동면 → 송천리
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
  village: string;  // 리/통
}

export const PILOT_REGION: RegionHierarchy = {
  country: "대한민국",
  province: "경기도",
  city: "남양주시",
  township: "수동면",
  village: "송천리"
};

export const AVAILABLE_REGIONS = [
  {
    province: "경기도",
    city: "남양주시",
    townships: [
      {
        name: "수동면",
        villages: [
          {
            code: "songcheon",
            name: "송천리",
            fullName: "경기도 남양주시 수동면 송천리",
            representativeOrg: "수동면 종합행정복지센터 (수동면 운수리 73-1)",
            communityCenterPhone: "031-590-2601",
            garbageDay: "월·수·금 일몰 후 배출 (화·목·토 수거)",
            busInfo: "남양주 땡큐버스 30번, 33번 (송천리 마을회관 앞 수시 운행)",
            population: "약 1,420명 (외국인 주민 약 85명 거주)",
            keyNotice: "2026 어르신 병원안심동행 및 농촌 계절근로자 생활안정 특별지원 접수 중"
          },
          {
            code: "unsu",
            name: "운수리",
            fullName: "경기도 남양주시 수동면 운수리",
            representativeOrg: "수동면 종합행정복지센터",
            communityCenterPhone: "031-590-2601",
            garbageDay: "월·수·금 일몰 후 배출",
            busInfo: "땡큐버스 30번, 33번, 일반 330-1번",
            population: "약 2,100명",
            keyNotice: "수동면 주민자치센터 2분기 문화강좌 접수 안내"
          },
          {
            code: "jidun",
            name: "지둔리",
            fullName: "경기도 남양주시 수동면 지둔리",
            representativeOrg: "수동면 종합행정복지센터",
            communityCenterPhone: "031-590-2601",
            garbageDay: "화·목·일 일몰 후 배출",
            busInfo: "마을버스 33-1번",
            population: "약 890명",
            keyNotice: "봄철 산불조심기간 영농부산물 파쇄 지원 안내"
          }
        ]
      },
      {
        name: "화도읍",
        villages: [
          {
            code: "masan",
            name: "마석우리",
            fullName: "경기도 남양주시 화도읍 마석우리",
            representativeOrg: "화도읍 종합행정복지센터",
            communityCenterPhone: "031-590-2602",
            garbageDay: "일·화·목 일몰 후 배출",
            busInfo: "경춘선 마석역, 광역버스 M2316",
            population: "약 28,000명",
            keyNotice: "화도 민방위 대피시설 점검 및 복지사각지대 발굴의 달"
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
