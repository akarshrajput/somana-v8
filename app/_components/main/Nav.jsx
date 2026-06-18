import { Separator } from "@/components/ui/separator";
import React from "react";
import NavButton from "../buttons/NavButton";

const Nav = () => {
  return (
    <div className="flex items-center text-xs font-medium">
      <NavButton href="/notes" isFirst={true}>Notes</NavButton>
      <Separator orientation="vertical" />
      <NavButton href="/podcast">Podcast</NavButton>
      <Separator orientation="vertical" />
      <NavButton href="/story/directory">Blog</NavButton>
    </div>
  );
};

export default Nav;
