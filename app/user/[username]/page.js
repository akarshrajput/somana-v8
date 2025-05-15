import UserDataTabs from "@/app/_components/userComponents/UserDataTabs";
import UserProfile from "@/app/_components/userComponents/UserProfile";
import { auth } from "@/app/_lib/auth";
import React from "react";

const page = async ({ params }) => {
  const session = await auth();
  const { username } = await params;

  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px]">
        <div className="px-1">
          <UserProfile username={username} />
        </div>
        <div className="mt-6">
          <UserDataTabs session={session} />
        </div>
      </div>
    </div>
  );
};

export default page;
