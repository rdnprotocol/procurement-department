import { PropsWithChildren } from "react";
import clsx from "clsx";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={clsx("xl:max-w-[1400px] m-auto px-3 sm:px-6", className)}>
      {children}
    </div>
  );
};
