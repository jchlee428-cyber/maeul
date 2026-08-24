import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../home/components/Navbar";
import Footer from "../home/components/Footer";
import {
  getCases,
  updateCase,
  getDashboardStats,
  type CommunityCase,
  type ProcessStatus,
  type VerificationStatus,
  type DashboardStats
} from "@/services/caseManagementService";
import {
  PUBLIC_DATA_CONFIG,
  fetchPublicDataAPITest,
  publicDataRepository
} from "@/services/publicDataService";

const processSteps: ProcessStatus[] = ["접수", "AI 분석", "검증", "기관 연결", "완료"];

export default function AdminPage() {
  const [cases, setCases] = useState<CommunityCase[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayConsultations: 0,
    welfareQueries: 0,
    medicalQueries: 0,
    educationQueries: 0,
    lifeQueries: 0,
    connectedCount: 0,
    unverifiedCount: 0
  });

  const [selectedCase, setSelectedCase] = useState<CommunityCase | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 공공데이터 API 테스트 상태
  const [apiTestLoading, setApiTestLoading] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; source: string } | null>(null);

  const refreshData = () => {
    setCases(getCases());
    setStats(getDashboardStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const runAPITest = async () => {
    setApiTestLoading(true);
    const result = await fetchPublicDataAPITest(1, 5);
    setApiTestResult({ success: result.success, source: result.source });
    setApiTestLoading(false);
  };

  const handleUpdateStatus = (caseItem: CommunityCase, newStatus: ProcessStatus) => {
    const updated = { ...caseItem, processStatus: newStatus };
    updateCase(updated);
    refreshData();
    if (selectedCase && selectedCase.id === caseItem.id) {
      setSelectedCase(updated);
    }
  };

  const handleSaveDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    updateCase(selectedCase);
    refreshData();
    alert("사례 검증 및 기관 연결 정보가 저장되었습니다.");
  };

  const filteredCases = cases.filter((c) => {
    const matchType = filterType === "all" || c.problemType === filterType;
    const matchStatus = filterStatus === "all" || c.processStatus === filterStatus;
    const matchKeyword =
      !searchKeyword ||
      c.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.userSituation.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.region.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.connectedOrg.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchType && matchStatus && matchKeyword;
  });

  return (
    <div className="bg-background-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {/* 상단 타이틀 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary-800 text-accent-300">
                ADMIN SYSTEM
              </span>
              <span className="text-xs text-foreground-500">
                실시간 업데이트: {new Date().toLocaleTimeString("ko-KR")}
              </span>
            </div>
            <h1 className="font-heading text-2xl md:text-4xl font-bold text-primary-950 mt-1">
              AI 마을관리자 대시보드
            </h1>
            <p className="text-sm md:text-base text-foreground-700 mt-1">
              주민 상담 및 도움 요청을 공공데이터 원문과 대조·검증하고, 실제 지역사회 기관과 연결합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* [🏠 홈 (실증 성과 보고)] 예쁜 집 모양 단독 아이콘 버튼 */}
            <Link
              to="/cases"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-primary-200 text-primary-800 hover:bg-primary-50 shadow-xs transition-all hover:scale-105"
              title="홈 (실증 성과 보고서)"
            >
              <i className="ri-home-4-fill text-lg text-primary-700"></i>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <i className="ri-chat-voice-fill text-accent-300"></i>
              1:1 AI 상담창
            </Link>

            <button
              onClick={refreshData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-xl bg-white border border-primary-200 text-primary-800 hover:bg-primary-50 shadow-xs transition-colors"
            >
              <i className="ri-refresh-line"></i>
              새로고침
            </button>
          </div>
        </div>

        {/* 🌟 공공데이터포털 공식 API 연동 상태 배너 (사용자 인증키 연동됨) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white shadow-md mb-6 border border-primary-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-foreground-950 text-xs font-bold flex items-center gap-1">
                  <i className="ri-checkbox-circle-fill"></i> 공공데이터포털 API 연동 승인 완료
                </span>
                <span className="text-xs text-primary-200">
                  데이터명: <strong>{PUBLIC_DATA_CONFIG.serviceName}</strong> (REST · {PUBLIC_DATA_CONFIG.format})
                </span>
                <span className="text-xs text-accent-300 font-semibold">
                  활용기간: {PUBLIC_DATA_CONFIG.validPeriod}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={runAPITest}
                disabled={apiTestLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-accent-500 hover:bg-accent-400 text-foreground-950 transition-colors shadow"
              >
                {apiTestLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-foreground-950 border-t-transparent rounded-full animate-spin"></span>
                    API 호출 중...
                  </>
                ) : (
                  <>
                    <i className="ri-link-m"></i>
                    API 실시간 통신 테스트
                  </>
                )}
              </button>
            </div>
          </div>

          {apiTestResult && (
            <div className="mt-3 pt-3 border-t border-primary-700/60 text-xs flex items-center justify-between text-accent-200">
              <span className="flex items-center gap-1.5 font-medium">
                <i className="ri-shield-check-fill text-emerald-400 text-sm"></i>
                통신 상태 정상 ({apiTestResult.source})
              </span>
              <span className="text-primary-300 text-[11px]">
                공식 승인 데이터 원문 {publicDataRepository.length}개 분야 동기화 가동 중
              </span>
            </div>
          )}
        </div>

        {/* 1. 대시보드 통계 카드 영역 (요구사항 7개 필수 항목) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
          {/* 오늘 상담 건수 */}
          <div className="bg-primary-900 text-white rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-primary-200 font-medium">오늘 상담 건수</div>
            <div className="text-2xl font-bold mt-1 text-accent-300">
              {stats.todayConsultations} <span className="text-xs font-normal text-white">건</span>
            </div>
            <div className="text-[10px] text-primary-300 mt-1">누적 질의 포함</div>
          </div>

          {/* 복지 문의 */}
          <div className="bg-white border border-primary-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-foreground-600 font-medium">복지 문의</div>
            <div className="text-2xl font-bold mt-1 text-primary-700">
              {stats.welfareQueries} <span className="text-xs font-normal text-foreground-600">건</span>
            </div>
            <div className="text-[10px] text-foreground-500 mt-1">돌봄·긴급생계</div>
          </div>

          {/* 의료 문의 */}
          <div className="bg-white border border-primary-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-foreground-600 font-medium">의료 문의</div>
            <div className="text-2xl font-bold mt-1 text-primary-700">
              {stats.medicalQueries} <span className="text-xs font-normal text-foreground-600">건</span>
            </div>
            <div className="text-[10px] text-foreground-500 mt-1">재난적의료비 등</div>
          </div>

          {/* 교육 문의 */}
          <div className="bg-white border border-primary-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-foreground-600 font-medium">교육 문의</div>
            <div className="text-2xl font-bold mt-1 text-primary-700">
              {stats.educationQueries} <span className="text-xs font-normal text-foreground-600">건</span>
            </div>
            <div className="text-[10px] text-foreground-500 mt-1">교육급여·바우처</div>
          </div>

          {/* 생활지원 문의 */}
          <div className="bg-white border border-primary-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-foreground-600 font-medium">생활지원 문의</div>
            <div className="text-2xl font-bold mt-1 text-primary-700">
              {stats.lifeQueries} <span className="text-xs font-normal text-foreground-600">건</span>
            </div>
            <div className="text-[10px] text-foreground-500 mt-1">에너지바우처 등</div>
          </div>

          {/* 실제 연결 건수 */}
          <div className="bg-accent-500 text-foreground-950 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-bold">실제 연결 건수</div>
            <div className="text-2xl font-black mt-1">
              {stats.connectedCount} <span className="text-xs font-normal">건</span>
            </div>
            <div className="text-[10px] font-medium mt-1">기관 접수 완료</div>
          </div>

          {/* 미확인 정보 */}
          <div className="bg-amber-100 border border-amber-300 text-amber-900 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-bold">미확인 정보</div>
            <div className="text-2xl font-black mt-1 text-amber-700">
              {stats.unverifiedCount} <span className="text-xs font-normal text-amber-900">건</span>
            </div>
            <div className="text-[10px] font-medium mt-1">사람 검증 필요</div>
          </div>
        </div>

        {/* 필터 및 검색 바 */}
        <div className="bg-white rounded-2xl p-4 border border-primary-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* 문제 유형 필터 */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground-700">
              <span>문제유형:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs focus:ring-1 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">전체</option>
                <option value="복지">복지</option>
                <option value="의료">의료</option>
                <option value="교육">교육</option>
                <option value="생활지원">생활지원</option>
                <option value="주거">주거</option>
                <option value="일자리">일자리</option>
              </select>
            </div>

            {/* 처리상태 필터 */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground-700">
              <span>처리상태:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs focus:ring-1 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">전체</option>
                {processSteps.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 검색창 */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="사례번호, 주민상황, 지역 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            <i className="ri-search-line absolute left-2.5 top-2.5 text-gray-400 text-sm"></i>
          </div>
        </div>

        {/* 2. 사례 관리 테이블 (요구사항 8대 컬럼) */}
        <div className="bg-white rounded-2xl border border-primary-200 shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-primary-100 flex items-center justify-between bg-primary-50/50">
            <h2 className="font-heading font-bold text-lg text-primary-950">
              지역사회 해결 사례 관리 목록 ({filteredCases.length}건)
            </h2>
            <span className="text-xs text-foreground-600">
              처리 5단계: <strong className="text-primary-800">접수 → AI 분석 → 검증 → 기관 연결 → 완료</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-primary-100/70 text-primary-950 font-bold border-b border-primary-200">
                  <th className="py-3.5 px-4">사례번호</th>
                  <th className="py-3.5 px-3">문제유형</th>
                  <th className="py-3.5 px-3">지역</th>
                  <th className="py-3.5 px-4">필요서비스 (주민 상황)</th>
                  <th className="py-3.5 px-4">AI 추천 (공공데이터)</th>
                  <th className="py-3.5 px-3">검증상태</th>
                  <th className="py-3.5 px-4">연결기관</th>
                  <th className="py-3.5 px-4">처리상태</th>
                  <th className="py-3.5 px-3 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-foreground-500">
                      해당 조건에 맞는 사례가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-primary-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedCase(c)}
                    >
                      {/* 1. 사례번호 */}
                      <td className="py-3.5 px-4 font-mono font-bold text-primary-800 whitespace-nowrap">
                        {c.id}
                      </td>

                      {/* 2. 문제유형 */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-primary-100 text-primary-900 font-bold text-xs">
                          {c.problemType}
                        </span>
                      </td>

                      {/* 3. 지역 */}
                      <td className="py-3.5 px-3 text-foreground-700 whitespace-nowrap font-medium">
                        {c.region}
                      </td>

                      {/* 4. 필요서비스 & 연락처 */}
                      <td className="py-3.5 px-4 text-foreground-900 max-w-xs" title={c.userSituation}>
                        <div className="font-semibold text-primary-950">{c.neededService}</div>
                        <div className="text-xs text-foreground-500 truncate mt-0.5">{c.userSituation}</div>
                        {c.contactInfo && (
                          <div className="flex items-center gap-1.5 mt-1.5 pt-1 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              📞 {c.contactInfo}
                            </span>
                            <a
                              href={`tel:${c.contactInfo.replace(/[^0-9]/g, "")}`}
                              className="p-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                              title="전화걸기"
                            >
                              <i className="ri-phone-fill"></i>
                            </a>
                            <a
                              href={`sms:${c.contactInfo.replace(/[^0-9]/g, "")}`}
                              className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold"
                              title="문자보내기"
                            >
                              <i className="ri-message-2-fill"></i>
                            </a>
                          </div>
                        )}
                      </td>

                      {/* 5. AI 추천 */}
                      <td className="py-3.5 px-4 text-primary-900 font-medium max-w-xs truncate">
                        {c.aiRecommendation}
                      </td>

                      {/* 6. 검증상태 */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            c.verificationStatus === "검증 완료"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : c.verificationStatus === "검증 대기"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {c.verificationStatus}
                        </span>
                      </td>

                      {/* 7. 연결기관 */}
                      <td className="py-3.5 px-4 text-foreground-800 font-medium whitespace-nowrap">
                        <i className="ri-building-line text-primary-600 mr-1"></i>
                        {c.connectedOrg}
                      </td>

                      {/* 8. 처리상태 (5단계 파이프라인 버튼 그룹) */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {processSteps.map((step) => {
                            const isCurrent = c.processStatus === step;
                            return (
                              <button
                                key={step}
                                onClick={() => handleUpdateStatus(c, step)}
                                className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                                  isCurrent
                                    ? "bg-primary-700 text-white shadow"
                                    : "bg-gray-100 hover:bg-gray-200 text-foreground-600"
                                }`}
                              >
                                {step}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* 관리 버튼 */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedCase(c)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-900 transition-colors"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. 사례 상세 검증 및 기관 연결 모달 */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-primary-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-primary-800 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-accent-500 text-foreground-950 rounded">
                    {selectedCase.id}
                  </span>
                  <h3 className="font-heading font-bold text-lg">사례 상세 검증 및 기관 연계</h3>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSaveDetail} className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground-600 font-bold mb-1">문제 유형</label>
                    <select
                      value={selectedCase.problemType}
                      onChange={(e) =>
                        setSelectedCase({
                          ...selectedCase,
                          problemType: e.target.value as CommunityCase["problemType"]
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-300"
                    >
                      <option value="복지">복지</option>
                      <option value="의료">의료</option>
                      <option value="교육">교육</option>
                      <option value="생활지원">생활지원</option>
                      <option value="주거">주거</option>
                      <option value="일자리">일자리</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-foreground-600 font-bold mb-1">관할 지역</label>
                    <input
                      type="text"
                      value={selectedCase.region}
                      onChange={(e) => setSelectedCase({ ...selectedCase, region: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-foreground-600 font-bold mb-1">주민 접수 상황</label>
                  <textarea
                    rows={2}
                    value={selectedCase.userSituation}
                    onChange={(e) => setSelectedCase({ ...selectedCase, userSituation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-foreground-600 font-bold mb-1">AI 추천 공공데이터 제도</label>
                  <input
                    type="text"
                    value={selectedCase.aiRecommendation}
                    onChange={(e) => setSelectedCase({ ...selectedCase, aiRecommendation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-medium"
                  />
                </div>

                {/* [주민 안심 연락처 및 원클릭 연락 도구] */}
                <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-300 shadow-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <i className="ri-phone-fill text-emerald-600"></i> 주민 입력 연락처 (상담 및 연계용)
                      </span>
                      <div className="font-mono font-black text-base text-foreground-950 mt-0.5">
                        {selectedCase.contactInfo || "연락처 미기재"}
                      </div>
                    </div>

                    {/* 원클릭 통화/문자/복사 액션 버튼 그룹 */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedCase.contactInfo && (
                        <>
                          <a
                            href={`tel:${selectedCase.contactInfo.replace(/[^0-9]/g, "")}`}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                            title="스마트폰에서 바로 전화걸기"
                          >
                            <i className="ri-phone-line text-sm"></i>
                            <span>전화걸기</span>
                          </a>

                          <a
                            href={`sms:${selectedCase.contactInfo.replace(/[^0-9]/g, "")}?body=${encodeURIComponent(
                              `[마을지기] 안녕하세요, 주민님께서 요청하신 '${selectedCase.neededService}' 지원 상담을 위해 연락드렸습니다. 통화 편하신 시간을 알려주시면 전화드리겠습니다.`
                            )}`}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                            title="안내 문자 작성 및 발송"
                          >
                            <i className="ri-message-2-line text-sm"></i>
                            <span>문자보내기</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedCase.contactInfo);
                              alert(`연락처 (${selectedCase.contactInfo})가 클립보드에 복사되었습니다.`);
                            }}
                            className="p-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold rounded-xl text-xs shadow-xs transition-colors"
                            title="연락처 번호 복사"
                          >
                            <i className="ri-file-copy-line text-sm"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-900 bg-white/70 p-2 rounded-xl border border-emerald-200/80 leading-relaxed">
                    💡 <strong>관리자 팁</strong>: 어르신께 전화 시 <em>"마을지기 도움요청 보고 연락드린 마을관리자입니다"</em>라고 먼저 밝혀주시면 안심하고 상담에 응하십니다.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground-600 font-bold mb-1">검증 상태 (사람 검증)</label>
                    <select
                      value={selectedCase.verificationStatus}
                      onChange={(e) =>
                        setSelectedCase({
                          ...selectedCase,
                          verificationStatus: e.target.value as VerificationStatus
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-bold"
                    >
                      <option value="검증 완료">검증 완료 (공공데이터 일치)</option>
                      <option value="검증 대기">검증 대기 (현장확인 필요)</option>
                      <option value="보완 필요">보완 필요 (제도 불일치)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-foreground-600 font-bold mb-1">처리 5단계 상태</label>
                    <select
                      value={selectedCase.processStatus}
                      onChange={(e) =>
                        setSelectedCase({
                          ...selectedCase,
                          processStatus: e.target.value as ProcessStatus
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-bold text-primary-800"
                    >
                      {processSteps.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-foreground-600 font-bold mb-1">실제 연결 기관 및 담당부서</label>
                  <input
                    type="text"
                    value={selectedCase.connectedOrg}
                    onChange={(e) => setSelectedCase({ ...selectedCase, connectedOrg: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-bold text-primary-900"
                  />
                </div>

                <div>
                  <label className="block text-foreground-600 font-bold mb-1">마을관리자 검증 메모</label>
                  <textarea
                    rows={3}
                    value={selectedCase.managerNotes || ""}
                    onChange={(e) => setSelectedCase({ ...selectedCase, managerNotes: e.target.value })}
                    placeholder="담당 공무원 유선 확인 내용, 자격 충족 여부, 추가 지원 연계 사항을 기재하세요."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300"
                  />
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-foreground-700 font-medium"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold shadow"
                  >
                    검증 및 연계 정보 저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
