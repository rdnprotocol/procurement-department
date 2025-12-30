'use client';

import { CheckCircle2 } from 'lucide-react';

export function AdminHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#24276B] to-[#3d42a0] bg-clip-text text-transparent">
            Админ удирдлага
          </h1>
          <p className="text-gray-600">Бүх контентуудыг удирдах, засах, нэмэх</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">Систем идэвхтэй</span>
        </div>
      </div>
    </div>
  );
}

