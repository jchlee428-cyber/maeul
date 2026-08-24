import { useState } from "react";
import { addCase, type CommunityCase } from "@/services/caseManagementService";
import type { PublicDataRecord } from "@/services/publicDataService";

interface HelpRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicData: PublicDataRecord | null;
  userQuery: string;
  defaultRegion?: string;
  onSuccess: (newCase: CommunityCase) => void;
}

export default function HelpRequestModal({
  isOpen,
  onClose,
  publicData,
  userQuery,
  defaultRegion = "경기도 남양주시 평내동",
  onSuccess
}: HelpRequestModalProps) {
  const [region, setRegion] = useState(defaultRegion || "경기도 남양주시 평내동");
  const [situation, setSituation] = useState(userQuery || "");
  const [contact, setContact] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [submittedCase, setSubmittedCase] = useState<CommunityCase | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!region.trim() || !contact.trim()) {
      alert("지역과 연락처를 입력해주세요.");
      return;
    }

    const problemTypeMap: Record<string, CommunityCase["problemType"]> = {
      welfare: "복지",
      health: "의료",
      edu: "교육",
      life: "생활지원",
      housing: "주거",
      job: "일자리",
      gov: "복지",
      other: "기타"
    };

    const problemType = publicData ? problemTypeMap[publicData.category] || "복지" : "복지";

    const newCase = addCase({
      problemType,
      region,
      neededService: publicData ? publicData.serviceName : "지역사회 맞춤형 지원",
      userSituation: situation || userQuery,
      contactInfo: contact,
      aiRecommendation: publicData ? `${publicData.serviceName} (${publicData.sourceApi})` : "공공 지원 자원 연계",
      sourceApi: publicData ? publicData.sourceApi : "공공데이터포털",
      managerNotes: "주민 온라인 접수 완료. 지자체 복지팀 담당자 매칭 대기."
    });

    setSubmittedCase(newCase);
    onSuccess(newCase);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-primary-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* 상단 바 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-primary-700 text-white shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent-500 text-foreground-950 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
              <i className="ri-hand-heart-fill"></i>
            </span>
            <div className="truncate">
              <h2 className="font-heading font-bold text-sm sm:text-lg truncate">도움 요청하기</h2>
              <p className="text-[10px] sm:text-xs text-primary-100 truncate">마을관리자 및 관할 기관 직접 연결</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white shrink-0 ml-1"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {submittedCase ? (
          /* 접수 완료 화면 */
          <div className="p-6 md:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
              <i className="ri-checkbox-circle-fill"></i>
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground-900">
              도움 요청이 안전하게 접수되었습니다
            </h3>
            <div className="p-4 rounded-2xl bg-primary-50 border border-primary-200 text-left space-y-1.5 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-primary-200">
                <span className="font-bold text-primary-900">사례 관리 번호</span>
                <span className="font-mono font-bold text-primary-700 bg-white px-2 py-0.5 rounded border border-primary-300">
                  {submittedCase.id}
                </span>
              </div>
              <p><strong>요청 서비스:</strong> {submittedCase.neededService}</p>
              <p><strong>지역:</strong> {submittedCase.region}</p>
              <p><strong>접수 연락처:</strong> <span className="font-mono font-bold text-emerald-800">📞 {submittedCase.contactInfo}</span></p>
              <p><strong>처리 상태:</strong> <span className="text-amber-700 font-semibold">1단계 접수 완료 (마을관리자 확인 중)</span></p>
              <div className="text-xs text-emerald-800 bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-300 mt-2">
                🤝 <strong>마을관리자 연락 안내</strong>: 관할 마을관리자가 요청 내용을 확인 후, 남겨주신 위 번호로 <strong>24시간 내(평일 기준)</strong> 전화 또는 문자로 친절히 연락드릴 예정입니다.
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md"
            >
              확인 및 대화창으로 돌아가기
            </button>
          </div>
        ) : (
          /* 입력 폼 */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-foreground-900">
            {publicData && (
              <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-200">
                <div className="text-xs font-bold text-primary-800">연계 희망 공공서비스</div>
                <div className="font-bold text-foreground-900 text-sm mt-0.5">{publicData.serviceName}</div>
                <div className="text-xs text-foreground-600 mt-1">소관: {publicData.department}</div>
              </div>
            )}

            <div>
              <label className="block font-bold text-foreground-800 mb-1">
                거주 지역 (시/군/구 및 읍·면·동) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="예: 경기도 남양주시 평내동"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">관할 주민센터와 복지관을 매칭하기 위해 필요합니다.</p>
            </div>

            <div>
              <label className="block font-bold text-foreground-800 mb-1">
                상황 및 필요한 도움 요약 <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="도움이 필요한 구체적인 상황을 적어주세요 (이름, 주민번호 등 민감정보 입력 금지)"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground-800 mb-1">
                연락 가능한 전화번호 (휴대폰 또는 일반전화) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="예: 010-1234-5678 또는 031-590-0000"
                className="w-full px-3.5 py-2.5 border-2 border-primary-400 rounded-xl font-mono text-base font-bold focus:ring-2 focus:ring-primary-500 focus:outline-none bg-primary-50/20"
              />
              <p className="text-[11px] text-emerald-800 font-medium mt-1">
                🔒 남겨주신 번호는 <strong>마을관리자가 전화를 드려 지원 제도를 연계해드리는 용도</strong>로만 안전하게 사용됩니다.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-foreground-700">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 text-primary-600 rounded"
                />
                <span>
                  <strong>[필수] 개인정보 최소 수집 및 공공 연계 동의</strong>: 입력하신 연락처와 지역 정보는 관할 지자체/복지기관 연계 목적으로만 활용되며, 문제 해결 후 즉시 파기됩니다.
                </span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-foreground-700 bg-gray-100 hover:bg-gray-200 font-semibold rounded-xl"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!agreed}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <i className="ri-send-plane-fill"></i>
                도움 요청 접수하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
