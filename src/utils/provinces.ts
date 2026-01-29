export type Province = {
  slug: string;
  title: string;
};

// Sums list used for navigation and content routing
export const PROVINCES: Province[] = [
  { slug: "altanbulag", title: "Алтанбулаг" },
  { slug: "argalant", title: "Аргалант" },
  { slug: "arkhust", title: "Архуст" },
  { slug: "batsumber", title: "Батсүмбэр" },
  { slug: "bayan", title: "Баян" },
  { slug: "bayandelger", title: "Баяндэлгэр" },
  { slug: "bayanjargalan", title: "Баянжаргалан" },
  { slug: "bayan-unjul", title: "Баян-Өнжүүл" },
  { slug: "bayankhangai", title: "Баянхангай" },
  { slug: "bayantsagaan", title: "Баянцагаан" },
  { slug: "bayantsogt", title: "Баянцогт" },
  { slug: "bayanchandmani", title: "Баянчандмань" },
  { slug: "bornuur", title: "Борнуур" },
  { slug: "buren", title: "Бүрэн" },
  { slug: "delgerkhaan", title: "Дэлгэрхаан" },
  { slug: "jargalant", title: "Жаргалант" },
  { slug: "zaamar", title: "Заамар" },
  { slug: "zuunmod", title: "Зуунмод" },
  { slug: "lun", title: "Лүн" },
  { slug: "mungunmorit", title: "Мөнгөнморьт" },
  { slug: "undurshireet", title: "Өндөрширээт" },
  { slug: "sumber", title: "Сүмбэр" },
  { slug: "sergelen", title: "Сэргэлэн" },
  { slug: "ugtaaltsaidam", title: "Угтаалцайдам" },
  { slug: "tseel", title: "Цээл" },
  { slug: "erdene", title: "Эрдэнэ" },
  { slug: "erdenesant", title: "Эрдэнэсант" },
];

export function getProvinceBySlug(slug: string | undefined): Province | undefined {
  if (!slug) return undefined;
  return PROVINCES.find((p) => p.slug === slug);
}

