"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Send,
  Building2,
  Clock,
  MessageSquare,
  User,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";

interface Department {
  id: string;
  name: string;
  short_name: string;
  contact_person: string;
  contact_position: string;
  contact_room: string;
  contact_phone: string;
  contact_email: string;
  color: string;
  sort_order: number;
  is_director: boolean;
}

interface ContactInfo {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  address_main: string;
  address_secondary: string;
  map_url: string;
  map_embed_url: string;
  phone: string;
  email: string;
  website: string;
  website_url: string;
  facebook_url: string;
  facebook_label: string;
  meeting_hours: string;
  director_organization: string;
  director_department: string;
  director_position: string;
  director_person: string;
  director_room: string;
  director_phone: string;
}

interface FormState {
  subject: string;
  phone: string;
  name: string;
  email: string;
  message: string;
}

const initialForm: FormState = {
  subject: "",
  phone: "",
  name: "",
  email: "",
  message: "",
};

export default function ContactPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptRes, infoRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/contact-info"),
      ]);

      if (deptRes.ok) {
        const data = await deptRes.json();
        setDepartments(data || []);
      }

      if (infoRes.ok) {
        const data = await infoRes.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Нэр болон текст хэсгийг бөглөнө үү");
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("И-мэйл хаяг буруу байна");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(
          "Таны хүсэлт амжилттай илгээгдлээ. Бид удахгүй холбогдох болно."
        );
        setForm(initialForm);
      } else {
        const data = await res.json();
        toast.error(data?.error || "Илгээхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error(error);
      toast.error("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSubmitting(false);
    }
  };

  const director = departments.find((d) => d.is_director);
  const regularDepts = departments.filter((d) => !d.is_director);

  // Use directly fetched contact info or fallback
  const info = contactInfo;

  if (loading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#24276B] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Уншиж байна...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#24276B] via-[#3d42a0] to-[#5a5fd4] p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {info?.hero_title || "Холбоо барих"}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              {info?.hero_subtitle ||
                "Худалдан авах ажиллагаатай холбоотой санал, хүсэлт, гомдлоо бидэнтэй хуваалцана уу"}
            </p>
          </div>
        </div>

        {/* Main: Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* LEFT - Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-1 h-5 bg-yellow-400 rounded-full" />
                  МАНАЙ ХАЯГ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-6 space-y-4">
                {info?.address_main && (
                  <a
                    href={info?.map_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-gray-700 hover:text-[#24276B] transition-colors"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#24276B]" />
                    </div>
                    <span className="text-sm leading-relaxed pt-1">
                      {info.address_main}
                      {info.address_secondary && (
                        <>
                          <br />
                          <span className="text-gray-500">
                            {info.address_secondary}
                          </span>
                        </>
                      )}
                    </span>
                  </a>
                )}

                {info?.phone && (
                  <a
                    href={`tel:${info.phone.replace(/\s+/g, "")}`}
                    className="group flex items-center gap-3 text-gray-700 hover:text-[#24276B] transition-colors"
                  >
                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">{info.phone}</span>
                  </a>
                )}

                {info?.email && (
                  <a
                    href={`mailto:${info.email}`}
                    className="group flex items-center gap-3 text-gray-700 hover:text-[#24276B] transition-colors"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#24276B]" />
                    </div>
                    <span className="text-sm font-medium">{info.email}</span>
                  </a>
                )}

                {info?.website && (
                  <a
                    href={info.website_url || `https://${info.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-gray-700 hover:text-[#24276B] transition-colors"
                  >
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors flex-shrink-0">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">{info.website}</span>
                  </a>
                )}

                {info?.facebook_label && (
                  <a
                    href={info.facebook_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-gray-700 hover:text-[#24276B] transition-colors"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
                      <FaFacebook className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {info.facebook_label}
                    </span>
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Departments Phones */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-1 h-5 bg-yellow-400 rounded-full" />
                  ХЭЛТСҮҮД
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-6">
                {regularDepts.length === 0 ? (
                  <div className="py-6 text-center text-gray-500 text-sm">
                    <Building2 className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    Хэлтсийн мэдээлэл оруулаагүй байна
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {regularDepts.map((dept) => (
                      <li
                        key={dept.id}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${
                            dept.color || "from-blue-500 to-blue-600"
                          } text-white flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}
                        >
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 uppercase leading-tight">
                            {dept.short_name || dept.name}
                          </p>
                          {dept.contact_phone ? (
                            <a
                              href={`tel:${dept.contact_phone.replace(
                                /\s+/g,
                                ""
                              )}`}
                              className="text-xs text-gray-600 hover:text-[#24276B] transition-colors"
                            >
                              {dept.contact_phone}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Утас оруулаагүй
                            </span>
                          )}
                        </div>
                      </li>
                    ))}

                    {/* Reception Hours */}
                    {info?.meeting_hours && (
                      <li className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 text-white flex-shrink-0 shadow-sm">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 uppercase leading-tight">
                            Иргэдийг хүлээн авч уулзах цагийн хуваарь
                          </p>
                          <span className="text-xs text-gray-700">
                            {info.meeting_hours}
                          </span>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT - Contact Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-xl border-0 overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Санал хүсэлт илгээх
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Гарчиг
                    </label>
                    <Input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Гарчиг"
                      className="h-11 bg-gray-50 border-gray-200 focus-visible:border-[#24276B] focus-visible:ring-[#24276B]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Утасны дугаар
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Утасны дугаар"
                      className="h-11 bg-gray-50 border-gray-200 focus-visible:border-[#24276B] focus-visible:ring-[#24276B]/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Нэр <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Нэр"
                        required
                        className="h-11 bg-gray-50 border-gray-200 focus-visible:border-[#24276B] focus-visible:ring-[#24276B]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        И-мэйл
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="И-мэйл"
                        className="h-11 bg-gray-50 border-gray-200 focus-visible:border-[#24276B] focus-visible:ring-[#24276B]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Текст <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Та санал хүсэлтээ дэлгэрэнгүй бичнэ үү..."
                      required
                      rows={7}
                      className="bg-gray-50 border-gray-200 focus-visible:border-[#24276B] focus-visible:ring-[#24276B]/20 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-[#24276B] to-[#3d42a0] hover:from-[#1a1d4f] hover:to-[#2f338a] text-white font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Илгээж байна...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Илгээх
                      </>
                    )}
                  </Button>
                </form>

                {/* Detailed contact under form */}
                {(info?.director_organization ||
                  info?.director_department ||
                  director) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 uppercase mb-3 text-sm flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-yellow-500" />
                      Дэлгэрэнгүй мэдээлэл авах:
                    </h3>
                    <div className="space-y-1.5 text-sm text-gray-700">
                      {info?.director_organization && (
                        <p className="font-medium">
                          {info.director_organization}
                        </p>
                      )}
                      {info?.director_department && (
                        <p>{info.director_department}</p>
                      )}
                      {(info?.director_position || info?.director_person) && (
                        <p>
                          {info.director_position}
                          {info.director_person && (
                            <>
                              {" "}
                              <span className="font-medium">
                                {info.director_person}
                              </span>
                            </>
                          )}
                        </p>
                      )}
                      {(info?.director_room || info?.director_phone) && (
                        <p className="flex items-center gap-2 flex-wrap">
                          {info?.director_room && <span>{info.director_room}</span>}
                          {info?.director_phone && (
                            <>
                              {info?.director_room && (
                                <span className="text-gray-400">|</span>
                              )}
                              <span>
                                Утас:{" "}
                                <a
                                  href={`tel:${info.director_phone.replace(
                                    /\s+/g,
                                    ""
                                  )}`}
                                  className="text-[#24276B] hover:underline font-medium"
                                >
                                  {info.director_phone}
                                </a>
                              </span>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Google Maps Section */}
        {info?.map_embed_url && (
          <Card className="shadow-xl border-0 overflow-hidden mb-12">
            <CardHeader className="bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Манай байршил
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[450px]">
                <iframe
                  src={info.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Манай байршил - Газрын зураг"
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="w-5 h-5 text-[#24276B]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {info.address_main}
                      </p>
                      {info.address_secondary && (
                        <p className="text-xs text-gray-600">
                          {info.address_secondary}
                        </p>
                      )}
                    </div>
                  </div>
                  {info.map_url && (
                    <a
                      href={info.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#24276B] to-[#3d42a0] text-white text-sm rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Чиглэл харах
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden hover:-translate-y-1">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Шууд утсаар</h3>
              <p className="text-sm text-gray-600 mb-3">
                Шуурхай хариулт авах хамгийн хурдан зам
              </p>
              {info?.phone && (
                <a
                  href={`tel:${info.phone.replace(/\s+/g, "")}`}
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  {info.phone}
                </a>
              )}
            </CardContent>
          </Card>

          <Card className="group shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden hover:-translate-y-1">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-purple-600" />
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-14 h-14 mx-auto bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">И-мэйлээр</h3>
              <p className="text-sm text-gray-600 mb-3">
                Албан ёсны хүсэлт, баримт бичгийг и-мэйлээр илгээнэ үү
              </p>
              {info?.email && (
                <a
                  href={`mailto:${info.email}`}
                  className="text-purple-600 font-medium text-sm hover:underline"
                >
                  {info.email}
                </a>
              )}
            </CardContent>
          </Card>

          <Card className="group shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden hover:-translate-y-1">
            <div className="h-1.5 bg-gradient-to-r from-yellow-500 to-amber-500" />
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-14 h-14 mx-auto bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                <User className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Биечлэн уулзах</h3>
              <p className="text-sm text-gray-600 mb-3">
                Иргэдийг хүлээн авч уулзах цагаар хүрэлцэн ирээрэй
              </p>
              {info?.meeting_hours && (
                <span className="text-yellow-700 font-medium text-sm">
                  {info.meeting_hours}
                </span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
