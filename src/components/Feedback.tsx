"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export const Feedback = () => {
  const [isLoading, setIsLoading] = useState(false);

  const contactForm = useFormik<ContactFormValues>({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required("Нэр оруулах шаардлагатай")
        .min(2, "Нэр хамгийн багадаа 2 тэмдэгт байх ёстой"),
      email: yup
        .string()
        .email("И-мэйл хаягийн формат буруу байна")
        .required("И-мэйл хаяг оруулах шаардлагатай"),
      message: yup
        .string()
        .required("Зурвас оруулах шаардлагатай")
        .min(10, "Зурвас хамгийн багадаа 10 тэмдэгт байх ёстой")
        .max(1000, "Зурвас хамгийн ихдээ 1000 тэмдэгт байх ёстой"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // const response = await fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(values)
        // });

        toast.success("Таны санал хүсэлт амжилттай илгээгдлээ!");
        resetForm();
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 justify-between">
      <div className="p-6 max-w-3xl bg-gray-50 rounded-lg">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-900 mb-4 leading-relaxed">
            Та байгууллагын үйл ажиллагаатай холбоотой санал хүсэлтээ илгээх
            боломжтой
          </h1>
          <p className="text-gray-600">
            Бид таны санал хүсэлтийг анхааралтайгаар авч үзэж, хариу өгөх болно.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={contactForm.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Таны нэр <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Нэрээ оруулна уу"
              value={contactForm.values.name}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              className={`w-full ${
                contactForm.touched.name && contactForm.errors.name
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            {contactForm.touched.name && contactForm.errors.name && (
              <p className="text-sm text-red-600">{contactForm.errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              И-мэйл хаяг <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={contactForm.values.email}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              className={`w-full ${
                contactForm.touched.email && contactForm.errors.email
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            {contactForm.touched.email && contactForm.errors.email && (
              <p className="text-sm text-red-600">{contactForm.errors.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Зурвас <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Санал хүсэлтээ энд бичнэ үү..."
              rows={6}
              value={contactForm.values.message}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              className={`w-full resize-none ${
                contactForm.touched.message && contactForm.errors.message
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            {contactForm.touched.message && contactForm.errors.message && (
              <p className="text-sm text-red-600">
                {contactForm.errors.message}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {contactForm.values.message.length}/1000 тэмдэгт
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || !contactForm.isValid}
              className="w-full md:w-auto px-8 py-3 bg-[#24276B] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Илгээж байна...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send />
                  Илгээх
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-4 bg-blue-50 rounded-lg h-fit">
          <h3 className="font-semibold text-blue-900 mb-2">Анхаар:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Таны санал хүсэлтийг 3-5 ажлын өдрийн дотор хариулах болно
            </li>
            <li>• Яаралтай асуудлын хувьд утсаар холбогдоно уу</li>
            <li>• Хувийн мэдээлэл нууцлагдах болно</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Холбоо барих мэдээлэл:
          </h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>📞 Утас: +976 7755 3579</p>
            <p>📧 И-мэйл: www.tuvprocurement@tov.gov.mn</p>
            <p>
              📍 Хаяг: Төв аймаг, Зуунмод сум, 6 дугаар баг, Төр захиргааны 2-р
              байр
            </p>
            <p>🕐 Ажлын цаг: Даваа-Баасан 09:00-18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};
