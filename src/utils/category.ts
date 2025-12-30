export const Category = [
  {
    id: 1,
    href: "uil-yvdliin-medee",
    mongolian_name: "Үйл явдлын мэдээ",
  },
  {
    id: 2,
    href: "video-medee",
    mongolian_name: "Видео мэдээ",
  },
  {
    id: 3,
    href: "huuli-togtoomj",
    mongolian_name: "Худалдан авах ажиллагааны хууль тогтоомж",
  },
  {
    id: 4,
    href: "baiguullagiin-huuli-togtoomj",
    mongolian_name: "Байгууллагын хууль тогтоомж",
  },
  {
    id: 5,
    href: "dargiin-tushaal",
    mongolian_name: "Газрын даргын тушаал",
  },
  {
    id: 6,
    href: "strateg-tolovlogoo",
    mongolian_name: "Стратеги төлөвлөгөө",
  },
  {
    id: 7,
    href: "tolovlogoo-tailan",
    mongolian_name: "Төлөвлөгөө, тайлан",
  },
  {
    id: 8,
    href: "at-tolovlogoo-tailan",
    mongolian_name: "Авилгын эсрэг төлөвлөгөө, тайлан",
  },
  { 
    id: 9, 
    href: "hasum-report", 
    mongolian_name: "ХАСУМ хянасан дүгнэлт" 
  },
  {
    id: 10,
    href: "strateg-tolovlogoo-tailan",
    mongolian_name: "Бодлогын баримт бичиг, хууль тогтоомж",
  },
  {
    id: 11,
    href: "statistic",
    mongolian_name: "Худалдан авалтын статистик мэдээ",
  },
  {
    id: 12,
    href: "a3-gerchilgee",
    mongolian_name: "А3 гэрчилгээтэй хүний нөөц",
  },
  {
    id: 13,
    href: "zovlomj",
    mongolian_name: "Захиалагчдад зөвлөмж",
  },
  {
    id: 14,
    href: "tender-urilga",
    mongolian_name: "Тендерийн урилга",
  },
];

export const GetCategoryById = (id: number) => {
  return Category.find((cat) => cat.id === id);
};

export const GetMongolianNameByHref = (href: string | string[] | undefined) => {
  const category = Category.find((cat) => cat.href === href);
  return category?.mongolian_name ?? null;
};

export const GetIdByHref = (href: string | string[] | undefined) => {
  const category = Category.find((cat) => cat.href === href);
  return category?.id ?? null;
};

export const GetMongolianNameById = (id: number) => {
  const category = Category.find((cat) => cat.id === id);
  return category?.mongolian_name ?? null;
};
