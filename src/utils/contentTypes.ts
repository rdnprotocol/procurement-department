// Статик контентын төрлүүд

export interface ContentType {
  value: string;
  label: string;
  group: string;
  description?: string;
}

// Бүх статик контент төрлүүд
export const STATIC_CONTENT_TYPES: ContentType[] = [
  // Бидний тухай
  { value: 'mission', label: 'Эрхэм зорилго', group: 'Бидний тухай' },
  { value: 'vision', label: 'Алсын харалт', group: 'Бидний тухай' },
  { value: 'goal', label: 'Стратегийн зорилтууд', group: 'Бидний тухай' },
  { value: 'history', label: 'Түүхэн замнал', group: 'Бидний тухай' },
  { value: 'structure', label: 'Бүтэц, зохион байгуулалт', group: 'Бидний тухай' },
  { value: 'intro', label: 'Байгууллагын танилцуулга', group: 'Бидний тухай' },
  
  // Ил тод байдал - Хүний нөөц
  { value: 'hr-intro', label: 'Хүний нөөц танилцуулга', group: 'Хүний нөөц', description: 'Хүний нөөцийн хуудасны танилцуулга' },
  { value: 'hr-plan', label: 'Хүний нөөц төлөвлөгөө', group: 'Хүний нөөц', description: 'Хүний нөөцийн төлөвлөгөө' },
  { value: 'hr-report', label: 'Хүний нөөц тайлан', group: 'Хүний нөөц', description: 'Хүний нөөцийн тайлан' },
  { value: 'hr-stats', label: 'Хүний нөөц статистик', group: 'Хүний нөөц', description: 'Хүний нөөцийн статистик мэдээ' },
  
  // Ил тод байдал - Хяналт шалгалт
  { value: 'monitoring-intro', label: 'Хяналт шалгалт танилцуулга', group: 'Хяналт шалгалт', description: 'Хяналт шалгалтын хуудасны танилцуулга' },
  { value: 'monitoring-internal', label: 'Дотоод хяналт', group: 'Хяналт шалгалт', description: 'Дотоод хяналт-шинжилгээ үнэлгээ' },
  { value: 'monitoring-government', label: 'Төрийн хяналт', group: 'Хяналт шалгалт', description: 'Төрийн байгууллагын хяналт, дүгнэлт' },
  { value: 'monitoring-client', label: 'Захиалагчийн хяналт', group: 'Хяналт шалгалт', description: 'Захиалагчдад хийгдсэн хяналт, шалгалт' },
  
  // Ил тод байдал - Ёс зүйн дэд хороо
  { value: 'ethics-intro', label: 'Ёс зүй танилцуулга', group: 'Ёс зүйн дэд хороо', description: 'Ёс зүйн дэд хорооны танилцуулга' },
  { value: 'ethics-activity', label: 'Ёс зүй үйл ажиллагаа', group: 'Ёс зүйн дэд хороо', description: 'Ёс зүйн дэд хорооны үйл ажиллагаа' },
  { value: 'ethics-members', label: 'Ёс зүй бүрэлдэхүүн', group: 'Ёс зүйн дэд хороо', description: 'Ёс зүйн дэд хорооны бүрэлдэхүүн' },
  
  // Ил тод байдал - Өргөдөл гомдол
  { value: 'complaints-intro', label: 'Өргөдөл гомдол танилцуулга', group: 'Өргөдөл гомдол', description: 'Өргөдөл гомдлын хуудасны танилцуулга' },
  { value: 'complaints-report', label: 'Өргөдөл гомдол тайлан', group: 'Өргөдөл гомдол', description: 'Өргөдөл гомдлын шийдвэрлэлтийн тайлан' },
  
  // Ил тод байдал - Иргэд хүлээн авах
  { value: 'meetings-intro', label: 'Уулзалт танилцуулга', group: 'Иргэд хүлээн авах', description: 'Иргэд хүлээн авах уулзалтын танилцуулга' },
  { value: 'meetings-schedule', label: 'Уулзалтын хуваарь', group: 'Иргэд хүлээн авах', description: 'Долоо хоногийн уулзалтын хуваарь' },
];

// Төрлөөр бүлэглэх
export const getContentTypesByGroup = () => {
  const groups: Record<string, ContentType[]> = {};
  STATIC_CONTENT_TYPES.forEach(type => {
    if (!groups[type.group]) {
      groups[type.group] = [];
    }
    groups[type.group].push(type);
  });
  return groups;
};

// Төрлийн нэрийг олох
export const getContentTypeLabel = (value: string): string => {
  const type = STATIC_CONTENT_TYPES.find(t => t.value === value);
  return type?.label || value;
};

// Төрлийн бүлгийг олох
export const getContentTypeGroup = (value: string): string => {
  const type = STATIC_CONTENT_TYPES.find(t => t.value === value);
  return type?.group || 'Бусад';
};

// Бүх төрлийн утгууд (validation-д ашиглах)
export const ALL_CONTENT_TYPE_VALUES = STATIC_CONTENT_TYPES.map(t => t.value);

// Ил тод байдлын төрлүүд
export const TRANSPARENCY_CONTENT_TYPES = STATIC_CONTENT_TYPES.filter(t => 
  ['Хүний нөөц', 'Хяналт шалгалт', 'Ёс зүйн дэд хороо', 'Өргөдөл гомдол', 'Иргэд хүлээн авах'].includes(t.group)
);

