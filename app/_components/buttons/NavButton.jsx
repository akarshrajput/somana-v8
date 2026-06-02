import Link from "next/link";
import React from "react";

const NavButton = ({ href = "/", children, isFirst }) => {
  return (
    <Link
      href={href}
      className={`hover:underline px-4 underline-offset-8 decoration-red-600 ${
        isFirst ? "border-l-0 md:border-l" : "border-l"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavButton;
