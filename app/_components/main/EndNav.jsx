import { Separator } from "@/components/ui/separator";
import { Search, Sparkle, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const EndNav = () => {
  return (
    <div className="ml-auto flex gap-2 items-center text-xs font-medium">
      <Search size={16} />
      <Separator orientation="vertical" />
      <Sparkle size={20} className="text-yellow-600" />
      <Separator orientation="vertical" />
      <User size={16} />
      <Separator orientation="vertical" />
      <Link
        href="/login"
        className="text-stone-200 text-sm bg-stone-800 p-1.5 px-3 rounded-full"
      >
        Login
      </Link>
    </div>
  );
};

export default EndNav;
