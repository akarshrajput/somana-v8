"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Shield } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const isAdmin = user?.role === "admin";
  const isNoteManager = user?.role === "note-manager";
  
  // Strategy to show the first alphabet if user image is not there or is default avatar
  const hasCustomPhoto = user?.photo && 
    !user.photo.includes("avatar.iran.liara.run/public") && 
    !user.photo.includes("avatar.iran.liara.run/username");

  return (
    <div 
      ref={dropdownRef}
      className="relative"
    >
      {/* Profile Avatar Trigger (Without Chevron Arrow) */}
      <button
        onClick={handleToggle}
        className="flex items-center focus:outline-none cursor-pointer group"
      >
        <Avatar className="size-8 border border-stone-200 group-hover:border-stone-400 transition duration-150">
          {hasCustomPhoto && (
            <AvatarImage 
              src={user.photo} 
              alt={user.name || "User Profile"} 
              className="object-cover" 
            />
          )}
          <AvatarFallback className="font-bold text-xs uppercase bg-stone-100 text-stone-700 select-none flex items-center justify-center w-full h-full">
            {user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-md py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-stone-850">
          {/* User Details header */}
          <div className="px-4 py-2 border-b border-stone-100">
            <p className="text-xs font-bold text-stone-900 truncate leading-none">{user?.name}</p>
            <p className="text-[10px] text-stone-400 truncate mt-1 leading-none">{user?.email}</p>
          </div>

          <div className="py-1">
            {/* Profile Link */}
            <Link 
              href="/me"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition"
            >
              <User size={14} className="text-stone-400" />
              <span>Profile</span>
            </Link>

            {/* Admin Panel Link (Only rendered for admins) */}
            {isAdmin && (
              <Link 
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition border-t border-stone-50"
              >
                <Shield size={14} className="text-stone-400" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Note Panel Link (Only rendered for note-managers) */}
            {isNoteManager && (
              <Link 
                href="/admin/notes-management"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition border-t border-stone-50"
              >
                <Shield size={14} className="text-stone-400" />
                <span>Note Panel</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
