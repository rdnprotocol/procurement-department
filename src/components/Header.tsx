import { Mail, PhoneCall } from "lucide-react";
import { Container } from "./assets";

export const Header = () => {
  return (
    <div className="relative bg-[#24276B] text-white font-bold text-xs">
      <div className="absolute inset-0 bg-[url('/tumen-nasan.png')] bg-repeat bg-[length:12%_auto] opacity-10 pointer-events-none" />
      <div className="relative py-3">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <PhoneCall size={16} />
              <p>7755 3579</p>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Mail size={16} />
              <p className="break-all">www.tuvprocurement@tov.gov.mn</p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
//#F3F4F6
