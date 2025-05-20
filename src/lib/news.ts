import fs from "fs";
import path from "path";
import matter from "gray-matter";

const newsDirectory = path.join(process.cwd(), "src/content/news");

export function getAllNewsSlugs() {
  return fs
    .readdirSync(newsDirectory)
    .map((filename) => filename.replace(/\.md$/, ""));
}

export type News = {
  slug: string;
  title: string;
  date: string;
  content: string;
};

export function getNewsData(slug: string): News {
  const fullPath = path.join(newsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);
  return {
    slug,
    ...data,
    content,
  } as News;
}
