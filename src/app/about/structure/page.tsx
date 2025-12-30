"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/assets";
import { 
  Building2, 
  Users, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin,
  UserCircle,
  X,
  ChevronRight,
  Loader2
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  short_name: string;
  description: string;
  responsibilities: string[];
  contact_person: string;
  contact_position: string;
  contact_room: string;
  contact_phone: string;
  contact_email: string;
  color: string;
  sort_order: number;
  is_director: boolean;
}

export default function StructurePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptClick = (dept: Department) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDept(null), 300);
  };

  const director = departments.find(d => d.is_director);
  const regularDepts = departments.filter(d => !d.is_director);

  if (loading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Уншиж байна...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#24276B] to-[#3d42a0] rounded-2xl mb-6 shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Бүтэц, зохион байгуулалт
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Хэлтэс дээр дарж дэлгэрэнгүй мэдээллийг харна уу
          </p>
        </div>

        {/* Interactive Organization Chart */}
        <div className="mb-16">
          <div className="flex flex-col items-center">
            {/* Top Level - Director */}
            {director && (
              <div className="relative mb-12">
                <div 
                  className={`bg-gradient-to-r ${director.color || 'from-[#24276B] to-[#3d42a0]'} text-white px-10 py-6 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300`}
                  onClick={() => handleDeptClick(director)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <UserCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">{director.name}</p>
                      <p className="text-white/80 text-sm">Удирдах түвшин</p>
                    </div>
                  </div>
                </div>
                
                {/* Connector Line */}
                {regularDepts.length > 0 && (
                  <div className="absolute left-1/2 -bottom-12 w-0.5 h-12 bg-gradient-to-b from-[#24276B] to-gray-300 transform -translate-x-1/2" />
                )}
              </div>
            )}

            {/* Horizontal Connector */}
            {regularDepts.length > 1 && (
              <div className="hidden md:block w-2/3 h-0.5 bg-gray-300 mb-8 relative">
                {regularDepts.map((_, idx) => (
                  <div 
                    key={idx}
                    className="absolute top-1/2 w-3 h-3 bg-gray-300 rounded-full -translate-y-1/2"
                    style={{ left: `${(idx / (regularDepts.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                  />
                ))}
              </div>
            )}

            {/* Department Level */}
            <div className={`grid grid-cols-1 ${regularDepts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 w-full max-w-5xl`}>
              {regularDepts.map((dept) => (
                <div 
                  key={dept.id}
                  onClick={() => handleDeptClick(dept)}
                  className="group cursor-pointer"
                >
                  <div className={`
                    bg-gradient-to-br ${dept.color || 'from-blue-500 to-blue-600'} text-white rounded-2xl p-6 shadow-lg
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-2xl
                    relative overflow-hidden
                  `}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full" />
                      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white rounded-full" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Users className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{dept.short_name}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{dept.description}</p>
                    </div>
                  </div>
                  
                  {/* Vertical Connector for mobile */}
                  <div className="md:hidden flex justify-center">
                    <div className="w-0.5 h-6 bg-gray-300 my-2" />
                  </div>
                </div>
              ))}
            </div>

            {departments.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Бүтцийн мэдээлэл оруулаагүй байна</p>
                <p className="text-sm text-gray-400 mt-2">Админ хэсгээс хэлтсүүдийг нэмнэ үү</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Дэлгэрэнгүй мэдээлэл
              </h3>
              <p className="text-gray-600">
                Дээрх хэлтсүүд дээр дарж холбоо барих мэдээлэл, чиг үүрэг зэргийг харна уу.
                Асуулт байвал холбогдох хэлтэст хандана уу.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Detail Modal */}
      {isModalOpen && selectedDept && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className={`
              bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl
              transform transition-all duration-300
              ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
            `}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedDept.color || 'from-blue-500 to-blue-600'} text-white p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedDept.name}</h2>
                    <p className="text-white/80">{selectedDept.contact_position}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Description */}
              <p className="text-gray-600 mb-6">{selectedDept.description}</p>

              {/* Responsibilities */}
              {selectedDept.responsibilities && selectedDept.responsibilities.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    Чиг үүрэг
                  </h3>
                  <ul className="space-y-3">
                    {selectedDept.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedDept.color || 'from-blue-500 to-blue-600'} mt-2 flex-shrink-0`} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-600" />
                  Холбоо барих
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDept.contact_person && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <UserCircle className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Хариуцсан ажилтан</p>
                        <p className="font-medium text-gray-900">{selectedDept.contact_person}</p>
                      </div>
                    </div>
                  )}
                  {selectedDept.contact_room && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MapPin className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Байршил</p>
                        <p className="font-medium text-gray-900">{selectedDept.contact_room}</p>
                      </div>
                    </div>
                  )}
                  {selectedDept.contact_phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Утас</p>
                        <a href={`tel:${selectedDept.contact_phone}`} className="font-medium text-blue-600 hover:underline">
                          {selectedDept.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedDept.contact_email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Mail className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">И-мэйл</p>
                        <a href={`mailto:${selectedDept.contact_email}`} className="font-medium text-blue-600 hover:underline">
                          {selectedDept.contact_email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
