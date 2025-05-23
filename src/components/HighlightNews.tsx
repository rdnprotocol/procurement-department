import Image from "next/image";
import Link from "next/link";

type HighlightNewsProps = {
  notImage: boolean;
  title: string;
  date: string;
  href: string;
  image?: string;
};

export const HighlightNews = ({
  notImage,
  title,
  date,
  href,
  image,
}: HighlightNewsProps) => {
  return (
    <Link href={href}>
      <div className="relative w-full h-full cursor-pointer overflow-hidden group">
        {!notImage && (
          <Image
            src={image || "/file.jpg"}
            fill
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 group-hover:bg-black/30 transition duration-300" />

        <div className="absolute bottom-16 left-4 right-4 text-white bg-gradient-to-t from-black/70 to-transparent p-4 rounded-md">
          <p className="text-sm">{date}</p>
          <h2 className="text-xl font-semibold leading-tight">{title}</h2>
        </div>
      </div>
    </Link>
  );
};
