"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  Home, 
  LayoutDashboard,
  Folder,
  Menu,
  X
} from "lucide-react";

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const allLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/notes-management", label: "Notes", icon: Folder },
    { href: "#", label: "Content", icon: FileText, disabled: true },
    { href: "#", label: "Feedback", icon: MessageSquare, disabled: true },
    { href: "#", label: "Settings", icon: Settings, disabled: true },
  ];

  const links = user?.role === "note-manager" 
    ? allLinks.filter(l => l.href === "/admin/notes-management") 
    : allLinks;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-stone-200 p-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-stone-900 text-white size-8 rounded-lg flex items-center justify-center font-bold text-sm tracking-wider">
            SO
          </div>
          <p className="font-bold text-stone-900 leading-none">Somana</p>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-stone-600 hover:text-stone-900">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-stone-200 bg-white flex flex-col justify-between h-full text-stone-800 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} shrink-0`}>
        <div className="p-6 overflow-y-auto">
          {/* Logo / Title (Hidden on mobile as it's in the top bar) */}
          <div className="hidden md:flex items-center gap-2.5 mb-8">
            <div className="bg-stone-900 text-white size-8 rounded-lg flex items-center justify-center font-bold text-sm tracking-wider">
              SO
            </div>
            <div>
              <p className="font-bold text-stone-900 leading-none">Somana</p>
              <p className="text-[9px] text-stone-400 font-bold tracking-wider uppercase mt-1">Admin Panel</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = link.disabled ? false : pathname === link.href;

              if (link.disabled) {
                return (
                  <div key={link.label} className="flex items-center justify-between p-2 px-3 rounded-lg text-sm font-medium text-stone-400 cursor-not-allowed group">
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{link.label}</span>
                    </div>
                    <span className="text-[9px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <Link 
                  key={link.label}
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-2 px-3 rounded-lg text-sm font-semibold transition ${isActive ? "bg-stone-900 text-white animate-fade-in" : "text-stone-600 hover:bg-stone-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`size-1.5 rounded-full ${isActive ? "bg-emerald-450" : "bg-emerald-500"} animate-pulse`} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile Area */}
        <div className="p-4 border-t border-stone-100 flex flex-col gap-3 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <img 
              src={user?.photo || "https://avatar.iran.liara.run/public"} 
              alt={user?.name} 
              className="size-9 rounded-full border border-stone-200 object-cover" 
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-stone-900 truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-stone-400 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 p-1.5 rounded-lg text-xs font-semibold border border-stone-200 hover:bg-stone-50 text-stone-750 transition"
          >
            <Home size={14} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
