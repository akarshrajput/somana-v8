import React from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import EndNav from "./EndNav";
import { auth } from "@/app/_lib/auth";

const Header = async () => {
  const session = await auth();
  return (
    <div className="py-2 px-4 bg-white flex flex-col items-center shadow-xs">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full">
        <Logo />
        <div className="order-last w-full md:w-auto md:order-none overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Nav />
        </div>
        <EndNav session={session} />
      </div>
    </div>
  );
};

export default Header;
