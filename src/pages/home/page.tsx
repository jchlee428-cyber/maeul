import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServiceIntro from "./components/ServiceIntro";
import HowItWorks from "./components/HowItWorks";
import Categories from "./components/Categories";
import Principles from "./components/Principles";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import SchemaOrg from "@/seo/SchemaOrg";
import ChatModal from "@/components/ChatModal";
import type { OpenChatOptions } from "@/hooks/useChatWidget";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatOptions, setChatOptions] = useState<OpenChatOptions>({});

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<OpenChatOptions>;
      setChatOptions(customEvent.detail || {});
      setIsChatOpen(true);
    };

    window.addEventListener("open-maeul-chat", handleOpenChat);
    return () => window.removeEventListener("open-maeul-chat", handleOpenChat);
  }, []);

  return (
    <>
      <SchemaOrg />
      <main className="bg-background-50 min-h-screen">
        <Navbar />
        <Hero />
        <ServiceIntro />
        <HowItWorks />
        <Categories />
        <Principles />
        <Faq />
        <Footer />
      </main>

      {/* 내장 지능형 AI 상담 모달 */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuery={chatOptions.query}
        initialCategory={chatOptions.category}
      />
    </>
  );
}