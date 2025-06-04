import { FolderOpen, House } from "lucide-react";
import Image from "next/image";

export const Path = ({ path }: { path: string }) => {
  return (
    <div className="relative w-full h-40">
      <Image
        src={"/tov-aimag.jpg"}
        alt="Banner"
        fill
        className="w-full object-cover transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/50 transition duration-300" />

      <div className="absolute w-full h-full flex flex-col items-center justify-center text-white font-bold gap-2">
        <h5 className="text-lg">{path}</h5>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <House size={16} />
            <p className="text-sm">Нүүр хуудас</p>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <FolderOpen size={16} />
            <p className="text-sm">{path}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
