import { useCallback } from "react";

export interface OpenChatOptions {
  category?: string;
  query?: string;
}

/**
 * 마을지기 지능형 AI 상담 모달을 여는 훅.
 * 커스텀 이벤트(open-maeul-chat)를 발행하여
 * 어떤 컴포넌트에서든 즉각적으로 안전하고 빠른 상담 모달을 엽니다.
 */
export function useChatWidget() {
  return useCallback((options?: OpenChatOptions | string) => {
    let payload: OpenChatOptions = {};
    if (typeof options === "string") {
      payload = { query: options };
    } else if (options) {
      payload = options;
    }

    const event = new CustomEvent("open-maeul-chat", { detail: payload });
    window.dispatchEvent(event);
  }, []);
}