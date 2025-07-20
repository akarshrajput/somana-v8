import React from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import EndNav from "./EndNav";

const Header = () => {
  return (
    <div className="py-2 px-4 bg-white flex flex-col items-center shadow-xs">
      <div className="flex items-center gap-4 w-full">
        <Logo />
        <Nav />
        <EndNav />
      </div>
    </div>
  );
};

export default Header;
