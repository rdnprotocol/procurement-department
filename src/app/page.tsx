import { getAllNewsSlugs, getNewsData, News } from "@/lib/news";

export default function Home() {
  const slugs = getAllNewsSlugs();
  const newsList: News[] = slugs.map((slug) => getNewsData(slug));

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Мэдээнүүд</h1>
      <ul className="space-y-2">
        {newsList.map((news) => (
          <li key={news.slug}>{news.title}</li>
        ))}
      </ul>
    </main>
  );
}
