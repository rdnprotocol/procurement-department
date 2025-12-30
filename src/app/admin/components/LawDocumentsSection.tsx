'use client';

import { LawDocumentManager } from "@/components/LawDocumentManager";
import { Scale, Building2 } from 'lucide-react';

export function LawDocumentsSection() {
  return (
    <div className="space-y-6 mt-6">
      {/* Худалдан авах ажиллагааны хууль тогтоомж */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600" />
          Худалдан авах ажиллагааны талаар хууль тогтоомж
        </h4>
        <LawDocumentManager
          type="procurement_law"
          title="Худалдан авах ажиллагааны хууль (Legalinfo.mn линкүүд)"
        />
      </div>
      
      {/* Байгууллагын хууль тогтоомж */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Байгууллагын үйл ажиллагаанд хамаарах хууль тогтоомж
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LawDocumentManager
            type="law_link"
            title="Хууль тогтоомж (Legalinfo.mn линкүүд)"
          />
          <LawDocumentManager
            type="director_order"
            title="Газрын даргын тушаал (PDF файлууд)"
          />
        </div>
      </div>
    </div>
  );
}
