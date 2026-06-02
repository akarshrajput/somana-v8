import React from "react";
import { auth } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import connectMongoDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";
import Link from "next/link";
import { headers } from "next/headers";
import Sidebar from "./_components/Sidebar";
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  Home, 
  ShieldAlert, 
  Lock 
} from "lucide-react";

export const metadata = {
  title: "Admin Portal — Somana",
  description: "Somana Organization Administrator Portal",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  // 1. If not authenticated, redirect to login
  if (!session?.user?.email) {
    redirect(`/login?redirectTo=/admin`);
  }

  // 2. Fetch user from DB to verify role
  await connectMongoDB();
  let dbUser = await User.findOne({ email: session.user.email }).lean();
  
  // Convert Mongoose ObjectIds and Dates to standard strings for Next.js serialization
  if (dbUser) {
    dbUser = JSON.parse(JSON.stringify(dbUser));
  }

  // 3. Read current path to enforce route-specific access for restricted roles
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "/admin";

  const isNoteManager = dbUser?.role === "note-manager";
  const isAdmin = dbUser?.role === "admin";
  const isAuthorized = isAdmin || isNoteManager;
  
  // If note-manager, they can ONLY access /admin/notes-management
  const isNoteManagerAccessingRestrictedPath = isNoteManager && currentPath !== "/admin/notes-management";

  // 4. If user is not authorized, or is accessing a restricted path, render Access Denied
  if (!isAuthorized || isNoteManagerAccessingRestrictedPath) {
    return (
      <div className="fixed inset-0 z-[60] bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center p-8 border border-stone-200 rounded-2xl bg-white shadow-xs flex flex-col items-center gap-6">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-full">
            <ShieldAlert size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-stone-900">Access Denied</h1>
            <p className="text-sm text-stone-500 max-w-sm">
              You do not have administrator permissions to access this page. Please contact your system administrator if you believe this is an error.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Link href="/" className="flex-1 py-2 text-center text-sm font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-850 transition">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Render Admin Layout overlaying the public site with z-[60]
  return (
    <div className="fixed inset-0 z-[60] bg-stone-50 flex flex-col md:flex-row overflow-hidden text-stone-800">
      {/* Sidebar */}
      <Sidebar user={dbUser} />

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto h-full bg-stone-50/50">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
