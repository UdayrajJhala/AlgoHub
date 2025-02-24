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
  Award,
  GitCommit,
  CheckCircle,
  User,
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
    rank: "0",
  });
  const [submissions, setSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    Promise.all([fetchUserData(), fetchProgressData(), fetchSubmissions()])
      .catch((error) => console.error("Error in initial data fetch:", error))
      .finally(() => setLoading(false));
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

    if (lowerCaseStatus.includes("passed")) return "text-emerald-400";
    if (lowerCaseStatus.includes("failed")) return "text-rose-400";
    if (lowerCaseStatus.includes("time limit")) return "text-amber-400";

    return "text-gray-400";
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

  // LoadingSkeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gray-800"></div>
        </div>
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div>
            <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg">
                <div className="h-6 bg-gray-800 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="h-8 bg-gray-800 rounded w-48 mb-6"></div>
        <table className="w-full">
          <thead>
            <tr>
              {[...Array(5)].map((_, index) => (
                <th key={index} className="p-4">
                  <div className="h-6 bg-gray-800 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-gray-800">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <div className="h-6 bg-gray-800 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-10">
            <span className="text-4xl font-bold text-white mb-2">Profile</span>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 relative">
            Profile
            <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-500 rounded-full"></span>
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg transition-colors duration-300 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8 border border-slate-800/50">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <img
                  src={userData.profilePicUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 relative z-10 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-full shadow-lg z-20">
                  <Trophy size={20} />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userData.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300">
                  <Mail size={16} className="text-blue-400" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 mt-2">
                  <Calendar size={16} className="text-blue-400" />
                  <span>Joined {userData.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-5 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:shadow-lg group border border-slate-700/30">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 mb-2">
                    <Code2
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-semibold">Problems Solved</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userStats.problems_solved}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:shadow-lg group border border-slate-700/30">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 mb-2">
                    <GitCommit
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-semibold">Total Submissions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userStats.total_submissions}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:shadow-lg group border border-slate-700/30">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 mb-2">
                    <CheckCircle
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-semibold">Correct Submissions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userStats.correct_submissions}
                  </p>
                </div>

                <div className="bg-slate-800/50 p-5 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:shadow-lg group border border-slate-700/30">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 mb-2">
                    <Target
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-semibold">Accuracy</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userStats.accuracy}%
                  </p>
                </div>

                <div className="bg-slate-800/50 p-5 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:shadow-lg group border border-slate-700/30">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 mb-2">
                    <Award
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
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
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-800/50">
          <h2 className="text-2xl font-bold text-white mb-6 relative inline-block">
            Recent Submissions
            <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
          </h2>

          {submissions.length > 0 ? (
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800/70 text-slate-300 rounded-lg overflow-hidden">
                    <th className="p-4 text-left rounded-tl-lg">Problem</th>
                    <th className="p-4 text-left">Language</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Time</th>
                    <th className="p-4 text-left rounded-tr-lg">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr
                      key={submission.submission_id}
                      className={`border-t border-slate-800/50 hover:bg-slate-800/40 transition-colors ${
                        index === submissions.length - 1 ? "rounded-b-lg" : ""
                      }`}
                    >
                      <td className="p-4 text-white font-medium">
                        {submission.title}
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs font-medium">
                          {formatLanguage(submission.language)}
                        </span>
                      </td>
                      <td
                        className={`p-4 ${getStatusColor(
                          submission.status
                        )} font-medium`}
                      >
                        {submission.status}
                      </td>
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-400" />
                          {formatDate(submission.submitted_at)}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setSelectedCode(submission.code);
                            setShowModal(true);
                          }}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer shadow-md shadow-blue-500/10"
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
          ) : (
            <div className="text-center py-12">
              <User size={64} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">No submissions yet</p>
              <p className="text-slate-500">
                Start solving problems to track your progress
              </p>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-700/50 animate-fadeIn">
                <div className="flex justify-between items-center p-4 border-b border-slate-800">
                  <h3 className="text-xl font-bold text-white">
                    Submission Code
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCopyCode}
                      className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-slate-300 cursor-pointer hover:text-white h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <pre className="p-6 text-slate-300 overflow-x-auto bg-slate-950/50 rounded-b-xl">
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
