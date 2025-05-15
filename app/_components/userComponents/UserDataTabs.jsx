"use client";
import { useState } from "react";
import UserArticles from "../articleComponents/UserArticles";

export default function UserDataTabs({ session }) {
  const [activeTab, setActiveTab] = useState("article"); // default

  return (
    <div>
      <div className="flex items-center gap-6 mb-6 mt-8">
        <button
          className={`hover:underline text-sm font-medium cursor-pointer underline-offset-8 decoration-red-600 ${
            activeTab === "article" ? "underline" : ""
          }`}
          onClick={() => setActiveTab("article")}
        >
          Articles
        </button>
        <button
          className={`hover:underline text-sm font-medium cursor-pointer underline-offset-8 decoration-red-600 ${
            activeTab === "podcast" ? "underline" : ""
          }`}
          onClick={() => setActiveTab("podcast")}
        >
          Podcasts
        </button>
      </div>

      <div>
        {activeTab === "article" && (
          <div>
            <UserArticles session={session} />
          </div>
        )}

        {activeTab === "podcast" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Podcasts</h2>
            <p>This is where podcasts will be displayed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
