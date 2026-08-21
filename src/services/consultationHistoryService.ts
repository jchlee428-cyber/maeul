import type { RAGAnalysisResult } from "./publicDataService";

export interface ConsultationRecord {
  id: string; // "CONSULT-20260821-131700"
  timestamp: string; // "2026-08-21 13:17"
  userQuery: string;
  matchedServiceName: string;
  categoryLabel: string;
  replyText?: string; // 챗봇의 실제 상세 답변 내용 (전화번호, 주소, 10단계 요약 등)
  ragResult?: RAGAnalysisResult;
  caseId?: string; // 도움 요청으로 연계된 경우 사례번호
}

const CONSULTATION_DB_KEY = "maeul_consultation_history_db_v1";

/**
 * 저장된 모든 상담 기록을 시간 역순으로 조회
 */
export function getConsultationHistory(): ConsultationRecord[] {
  try {
    const raw = localStorage.getItem(CONSULTATION_DB_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load consultation history", e);
    return [];
  }
}

/**
 * 새로운 상담 기록을 DB에 저장
 */
export function saveConsultationSession(record: Omit<ConsultationRecord, "id" | "timestamp">): ConsultationRecord {
  const history = getConsultationHistory();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const id = `CONSULT-${dateStr}-${timeStr}`;

  const formattedDate = `${now.toLocaleDateString("ko-KR")} ${now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  const newRecord: ConsultationRecord = {
    ...record,
    id,
    timestamp: formattedDate,
  };

  // 최대 50건 보관 (오래된 순 자동 정리)
  const updatedHistory = [newRecord, ...history.slice(0, 49)];

  try {
    localStorage.setItem(CONSULTATION_DB_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save consultation session to DB", e);
  }

  return newRecord;
}

/**
 * 특정 상담 기록 단건 삭제
 */
export function deleteConsultationSession(id: string): void {
  const history = getConsultationHistory();
  const filtered = history.filter((item) => item.id !== id);
  try {
    localStorage.setItem(CONSULTATION_DB_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete consultation session from DB", e);
  }
}

/**
 * 전체 상담 기록 비우기 (초기화)
 */
export function clearAllConsultationHistory(): void {
  try {
    localStorage.removeItem(CONSULTATION_DB_KEY);
  } catch (e) {
    console.error("Failed to clear consultation history DB", e);
  }
}
