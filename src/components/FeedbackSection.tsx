"use client";

import { useState } from "react";
import { Send, Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function FeedbackSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Нэр оруулна уу";
    } else if (formData.name.length < 2) {
      newErrors.name = "Нэр хамгийн багадаа 2 тэмдэгт";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "И-мэйл оруулна уу";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "И-мэйл формат буруу";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Зурвас оруулна уу";
    } else if (formData.message.length < 10) {
      newErrors.message = "Хамгийн багадаа 10 тэмдэгт";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Таны санал хүсэлт амжилттай илгээгдлээ!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: "Утас", value: "+976 7755 3579" },
    { icon: Mail, label: "И-мэйл", value: "tuvprocurement@tov.gov.mn" },
    { icon: MapPin, label: "Хаяг", value: "Төв аймаг, Зуунмод сум" },
    { icon: Clock, label: "Ажлын цаг", value: "Даваа-Баасан 09:00-18:00" }
  ];

  return (
    <section id="feedback" className="py-12 scroll-mt-20">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Санал хүсэлт
        </h2>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Бидэнтэй холбогдох
            </h3>
            <p className="text-gray-600 text-sm">
              Байгууллагын үйл ажиллагаатай холбоотой санал хүсэлтээ илгээнэ үү
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Таны нэр <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Нэрээ оруулна уу"
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  И-мэйл хаяг <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Зурвас <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Санал хүсэлтээ энд бичнэ үү..."
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all resize-none ${
                  errors.message 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.message ? (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                ) : (
                  <span></span>
                )}
                <span className="text-xs text-gray-400">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Илгээж байна...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Илгээх
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4">
          {/* Contact Cards */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Холбоо барих
            </h3>
            <div className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notice Card */}
          <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 backdrop-blur-sm rounded-xl p-5 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Анхаарах зүйлс
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>3-5 ажлын өдрийн дотор хариулна</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Яаралтай асуудалд утсаар холбогдоно уу</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Хувийн мэдээлэл нууцлагдана</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

