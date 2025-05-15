"use client";
import axios from "axios";
import { BadgeCheck } from "lucide-react";
import React, { useEffect, useState } from "react";

const UserProfile = ({ username }) => {
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/v1/users/userName/${username}`);
        setUserProfile(res.data?.data || {});
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [username]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 text-sm w-full">
        <div className="flex items-center gap-6">
          <img
            src={userProfile.photo}
            alt={`${userProfile.name}`}
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <p className="font-semibold text-xl">{userProfile.name}</p>
            <p className="text-muted-foreground flex items-center gap-2">
              @{userProfile.userName}
              {userProfile.verified && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-sky-500">
                  <BadgeCheck size={18} className="text-white" />
                </span>
              )}
            </p>
            <p>
              Subscription:{" "}
              <span className="font-medium">
                {userProfile.subscription ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
        <div>
          <p>{userProfile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
