import clsx from "clsx";
import Link from "next/link";
import React from "react";

const ButtonGroupLink: React.FC<React.ComponentProps<typeof Link> & {
  position?: "left" | "right"
  active?: boolean
}> = ({className, position, active,...props}) => {
  return (
    <Link
    className={clsx(
      "py-2 px-4 text-sm font-medium border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600",
      !position && "border-t border-b",
      position === "left" && "rounded-l-lg ",
      position === "right" && "rounded-r-md",
      active ? "text-blue-700" : "text-gray-900 hover:text-blue-700",
      className,
    )}
    {...props}
    />
  );
};

export default ButtonGroupLink;
