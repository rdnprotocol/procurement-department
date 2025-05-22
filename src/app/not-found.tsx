import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-360px-125px)] bg-white text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">
        Уучлаарай, энэ хуудас олдсонгүй.
      </p>
      <Link
        href="/"
        className="bg-[#24276B] text-white px-4 py-2 rounded transition"
      >
        Нүүр хуудас руу буцах
      </Link>
    </div>
  );
}
