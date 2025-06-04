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
    mongolian_name: "Хууль тогтоомж",
  },
  {
    id: 4,
    href: "baiguullagiin-huuli-togtoomj",
    mongolian_name: "Байгууллагын хууль тогтоомж",
  },
  {
    id: 5,
    href: "dargiin-tushaal",
    mongolian_name: "Даргын тушаал",
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
    href: "avilga-tolovlogoo-tailan",
    mongolian_name: "Төлөвлөгөө, тайлан",
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
