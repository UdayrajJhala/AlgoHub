import React, { useState, useEffect } from "react";
import { Trophy, Target, Calendar, Mail, Code2, LogOut } from "lucide-react";

const Profile = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    date: "",
    profilePicUrl: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        if (data) {
          setUserData({
            name: data.name || "N/A",
            email: data.email || "N/A",
            date: data.date || "N/A",
            profilePicUrl: data.profilePicUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const userStats = {
    problemsSolved: 247,
    accuracy: 86.5,
    rank: 156,
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-10">
          <span className="text-4xl font-bold text-white mb-2">Profile</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg transition-colors duration-300"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={userData.profilePicUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                <Trophy size={20} />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {userData.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
                <Mail size={16} />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 mt-2">
                <Calendar size={16} />
                <span>Joined {userData.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Code2 size={20} />
                  <span className="font-semibold">Problems Solved</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.problemsSolved}
                </p>
              </div>

              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Target size={20} />
                  <span className="font-semibold">Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.accuracy}%
                </p>
              </div>

              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Trophy size={20} />
                  <span className="font-semibold">Rank</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  #{userStats.rank}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
