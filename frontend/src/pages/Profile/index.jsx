import React, { useState, useEffect } from "react";
import {
  Trophy,
  Target,
  Calendar,
  Mail,
  Code2,
  LogOut,
  Clock,
  Code,
  Copy,
  Check,
} from "lucide-react";

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
  const [userStats, setUserStats] = useState({
    problems_solved: 0,
    total_submissions: 0,
    correct_submissions: 0,
    accuracy: 0,
    rank: '0',
  });
  const [submissions, setSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

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

    const fetchProgressData = async () => {
      if (!accessToken) {
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/data`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch progress data");
        }

        const data = await response.json();
        if (data) {
          setUserStats({
            problems_solved: data.problems_solved || 0,
            total_submissions: data.total_submissions || 0,
            correct_submissions: data.correct_submissions || 0,
            accuracy: data.accuracy || 0,
            rank: data.rank || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    const fetchSubmissions = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/submissions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }

        const data = await response.json();

        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchUserData();
    fetchProgressData();
    fetchSubmissions();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    if (!status) return "text-gray-500";

    const lowerCaseStatus = status.toLowerCase();

    if (lowerCaseStatus.includes("passed")) return "text-green-500";
    if (lowerCaseStatus.includes("failed")) return "text-red-500";
    if (lowerCaseStatus.includes("time limit")) return "text-yellow-500";

    return "text-gray-500"; 
  };

  const formatLanguage = (language) => {
    return language === "cpp" ? "C++" : language;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-10">
          <span className="text-4xl font-bold text-white mb-2">Profile</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg transition-colors duration-300 hover:bg-blue-600"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300 hover:bg-slate-950">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Code2 size={20} />
                  <span className="font-semibold">Problems Solved</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.problems_solved}
                </p>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300 hover:bg-slate-950">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Code2 size={20} />
                  <span className="font-semibold">Total Submissions</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.total_submissions}
                </p>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300 hover:bg-slate-950">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Code2 size={20} />
                  <span className="font-semibold">Correct Submissions</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.correct_submissions}
                </p>
              </div>

              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300 hover:bg-slate-950">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Target size={20} />
                  <span className="font-semibold">Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.accuracy}%
                </p>
              </div>

              <div className="bg-gray-950 p-4 rounded-lg transition-all duration-300 hover:bg-slate-950">
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 mb-2">
                  <Trophy size={20} />
                  <span className="font-semibold">Rank</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.rank === "0"
                    ? "none (solve a problem)"
                    : `# ${userStats.rank}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Submissions
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-950 text-slate-300">
                  <th className="p-4 text-left">Problem</th>
                  <th className="p-4 text-left">Language</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Code</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.submission_id}
                    className="border-t border-gray-800 hover:bg-gray-950 transition-colors"
                  >
                    <td className="p-4 text-white">{submission.title}</td>

                    <td className="p-4 text-slate-300">
                      {formatLanguage(submission.language)}
                    </td>
                    <td className={`p-4 ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </td>
                    <td className="p-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {formatDate(submission.submitted_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedCode(submission.code);
                          setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        <Code size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-950 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <h3 className="text-xl font-bold text-white">
                    Submission Code
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCopyCode}
                      className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-slate-300 cursor-pointer hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-slate-300 overflow-x-auto">
                  <code>{selectedCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
