import Image from "next/image";
import Link from "next/link";
import { getValidImagePath } from "@/utils/imageUtils";

type NewsSubProps = {
  notImage: boolean;
  title: string;
  date: string;
  href: string;
  desc?: string;
  image?: string;
};

export const NewsSub = ({
  notImage,
  title,
  href,
  date,
  desc,
  image,
}: NewsSubProps) => {
  return (
    <Link href={href}>
      <div className="flex gap-4 items-start p-2">
        {!notImage && (
          <div className="flex-shrink-0">
            <Image
              src={getValidImagePath(image)}
              width={180}
              height={120}
              alt={title}
              className="rounded-md object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between min-h-28 w-full">
          <div>
            <h3 className="font-semibold text-[#24276B] text-sm md:text-base line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(date).toISOString().slice(0, 10)}
            </p>
          </div>
          {desc && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>
          )}
          <p className="text-xs text-end mt-1 hover:text-[#24276B]">
            Дэлгэрэнгүй...
          </p>
        </div>
      </div>
    </Link>
  );
};
