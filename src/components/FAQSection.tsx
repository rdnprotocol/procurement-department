"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ChevronRight, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Системд хэрхэн бүртгүүлэх бэ?",
    answer: "Баруун дээд хэсэгт – Бүртгүүлэх/Нийлүүлэгч товч дарж, байгууллагын регистрийн дугаар оруулна. Байгуулага системд бүртгэлтэй байвал мэдээлэл автоматаар бөглөгдөж гарч ирнэ."
  },
  {
    id: 2,
    question: "Цахим гарын үсэг хэрхэн авах бэ?",
    answer: "Монпасс ХХК нь тусгай зөвшөөрөл эзэмшдэг эрх бүхий компани бөгөөд www.monpass.mn цахим хуудаснаас дэлгэрэнгүй мэдээллийг авна уу."
  },
  {
    id: 3,
    question: "Хэрхэн тендерт оролцогч болох вэ?",
    answer: "Хэрэглэгчийн эрхээр нэвтэрч, үндсэн цэснээс тендер шалгаруулалт > боломжит тш-н жагсаалт руу орж оролцохоор сонирхсон тендерийн хураамжыг төлнө."
  },
  {
    id: 4,
    question: "Хэрхэн тендерийн баталгаа гаргах вэ?",
    answer: "Тендерийн баталгаа гаргахын тулд тухайн тендерийн хураамжыг төлж тендерт оролцогч болсон байх шаардлагатай."
  },
  {
    id: 5,
    question: "Тендерийн материал хэрхэн илгээх вэ?",
    answer: "Үндсэн цэсийн тендер шалгаруулалт > оролцож буй тш цэсээс материал илгээх гэж буй тендерийн урилгын дугаар дээр дарж техникийн санал хэсэгт илгээнэ."
  },
  {
    id: 6,
    question: "Тендерийн баталгаа хэрхэн цуцлах вэ?",
    answer: "Үндсэн цэсийн Тендер шалгаруулалт > Тендерийн баталгаа хэсгээс тендерээ сонгон 'Баталгаа цуцлах' товчийг дарснаар цуцлуулах хүсэлтээ гаргана."
  }
];

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Түгээмэл асуулт, хариулт
        </h2>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border transition-all duration-300 overflow-hidden ${
              openId === faq.id 
                ? 'border-blue-200 shadow-md' 
                : 'border-gray-100 hover:border-blue-100 hover:shadow'
            }`}
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full p-5 flex items-start gap-4 text-left"
            >
              <div className={`p-2 rounded-lg transition-colors ${
                openId === faq.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-50 text-blue-600'
              }`}>
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold transition-colors ${
                  openId === faq.id ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {faq.question}
                </h3>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  openId === faq.id ? 'rotate-180 text-blue-600' : ''
                }`} 
              />
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${
              openId === faq.id ? 'max-h-48' : 'max-h-0'
            }`}>
              <div className="px-5 pb-5 pt-0">
                <div className="pl-11 border-l-2 border-blue-200">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <MessageCircleQuestion className="w-5 h-5" />
          Бүх асуулт харах
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

