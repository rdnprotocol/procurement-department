"use client";
import { TenderInvitation, NewsSection, FAQSection, FeedbackSection, StatsBanner } from "@/components";
import { Container, Loading } from "@/components/assets";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Container>
        <main className="py-6 space-y-4">
          {/* Тендерийн урилга */}
          <TenderInvitation />
          
          {/* Мэдээ, мэдээлэл */}
          <NewsSection />
        </main>
      </Container>

      {/* Статистик Banner - Full width */}
      <StatsBanner />

      <Container>
        <main className="py-6 space-y-4">
          {/* Түгээмэл асуулт, хариулт */}
          <FAQSection />

          {/* Санал хүсэлт */}
          <FeedbackSection />
        </main>
      </Container>
    </>
  );
}
