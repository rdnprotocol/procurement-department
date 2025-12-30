import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 h-full">
      <div className="relative bg-[#24276B] text-white font-bold text-xs -mx-6 px-6 py-3 rounded-t-lg">
        Холбоо барих мэдээлэл
      </div>
      <div className="mt-4 text-gray-700 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-gray-500 mt-1" />
          <div>
            <div className="text-sm font-medium text-[#24276B]">Хаяг</div>
            <div className="text-xs">Улаанбаатар, Монгол улс</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone size={18} className="text-gray-500 mt-1" />
          <div>
            <div className="text-sm font-medium text-[#24276B]">Утас</div>
            <div className="text-xs">(+976) 7010-0000</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail size={18} className="text-gray-500 mt-1" />
          <div>
            <div className="text-sm font-medium text-[#24276B]">Имэйл</div>
            <div className="text-xs">info@procurement.mn</div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">Ажлын цаг: Даваа-Баасан 09:00 - 17:00</div>
      </div>
    </div>
  );
}
