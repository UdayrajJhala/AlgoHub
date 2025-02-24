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
  CheckCircle,
  Activity,
  User,
} from "lucide-react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      if (!accessToken) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      try {
        // Fetch all data in parallel
        const [profileResponse, progressResponse, submissionsResponse] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/progress/data`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }),
            fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/progress/submissions`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            ),
          ]);

        // Process profile data
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setUserData({
            name: data.name || "N/A",
            email: data.email || "N/A",
            date: data.date || "N/A",
            profilePicUrl: data.profilePicUrl || "",
          });
        }

        // Process progress data
        if (progressResponse.ok) {
          const data = await progressResponse.json();
          setUserStats({
            problems_solved: data.problems_solved || 0,
            total_submissions: data.total_submissions || 0,
            correct_submissions: data.correct_submissions || 0,
            accuracy: data.accuracy || 0,
            rank: data.rank || 0,
          });
        }

        // Process submissions data
        if (submissionsResponse.ok) {
          const data = await submissionsResponse.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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

  // Loading skeleton components
  const SkeletonHeader = () => (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-gray-800"></div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="h-8 bg-gray-800 rounded w-48"></div>
        <div className="h-4 bg-gray-800 rounded w-64"></div>
        <div className="h-4 bg-gray-800 rounded w-56"></div>
      </div>
    </div>
  );

  const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-950 p-4 rounded-lg">
          <div className="h-6 bg-gray-800 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-800 rounded w-16"></div>
        </div>
      ))}
    </div>
  );

  const SkeletonTable = () => (
    <div className="mt-12">
      <div className="h-8 bg-gray-800 rounded w-64 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-950 rounded"></div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-10">
            <div className="h-10 bg-gray-800 rounded w-32"></div>
            <div className="h-10 bg-gray-800 rounded w-24"></div>
          </div>
          <SkeletonHeader />
          <SkeletonStats />
          <SkeletonTable />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-10">
          <span className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Profile
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:from-blue-600 hover:to-blue-700"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-1">
                <img
                  src={userData.profilePicUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full border-2 border-slate-800 bg-slate-800"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full shadow-lg">
                <Trophy size={20} />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="p-6 bg-slate-800 bg-opacity-30 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl">
              <h1 className="text-2xl font-bold text-white mb-4">
                {userData.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 mb-3">
                <Mail size={16} className="text-blue-400" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300">
                <Calendar size={16} className="text-blue-400" />
                <span>Joined {userData.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 bg-opacity-20 backdrop-blur-sm p-5 rounded-xl border border-slate-700 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-lg">
                <div className="flex items-center justify-center md:justify-start gap-3 text-blue-400 mb-3">
                  <Award size={20} />
                  <span className="font-semibold">Problems Solved</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.problems_solved}
                </p>
              </div>

              <div className="bg-slate-800 bg-opacity-20 backdrop-blur-sm p-5 rounded-xl border border-slate-700 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-lg">
                <div className="flex items-center justify-center md:justify-start gap-3 text-blue-400 mb-3">
                  <Code2 size={20} />
                  <span className="font-semibold">Total Submissions</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.total_submissions}
                </p>
              </div>

              <div className="bg-slate-800 bg-opacity-20 backdrop-blur-sm p-5 rounded-xl border border-slate-700 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-lg">
                <div className="flex items-center justify-center md:justify-start gap-3 text-blue-400 mb-3">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Correct Submissions</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.correct_submissions}
                </p>
              </div>

              <div className="bg-slate-800 bg-opacity-20 backdrop-blur-sm p-5 rounded-xl border border-slate-700 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-lg">
                <div className="flex items-center justify-center md:justify-start gap-3 text-blue-400 mb-3">
                  <Target size={20} />
                  <span className="font-semibold">Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {userStats.accuracy}%
                </p>
              </div>

              <div className="bg-slate-800 bg-opacity-20 backdrop-blur-sm p-5 rounded-xl border border-slate-700 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-lg">
                <div className="flex items-center justify-center md:justify-start gap-3 text-blue-400 mb-3">
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
          <h2 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Recent Submissions
          </h2>

          {submissions.length === 0 ? (
            <div className="bg-slate-800 bg-opacity-20 backdrop-blur-sm p-8 rounded-xl border border-slate-700 text-center">
              <Activity size={48} className="mx-auto mb-4 text-blue-400" />
              <p className="text-slate-300 text-lg">
                No submissions yet. Start solving problems to see your history
                here!
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-700 shadow-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800 bg-opacity-50 text-slate-300">
                    <th className="p-4 text-left">Problem</th>
                    <th className="p-4 text-left">Language</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Time</th>
                    <th className="p-4 text-left">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr
                      key={submission.submission_id}
                      className={`border-t border-slate-700 hover:bg-slate-800 hover:bg-opacity-30 transition-colors bg-slate-800 bg-opacity-20`}
                    >
                      <td className="p-4 text-white font-medium">
                        {submission.title}
                      </td>
                      <td className="p-4 text-slate-300">
                        {formatLanguage(submission.language)}
                      </td>
                      <td
                        className={`p-4 font-medium ${getStatusColor(
                          submission.status
                        )}`}
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
                          className="flex cursor-pointer items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
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
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
              <div className="bg-slate-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800 bg-opacity-50">
                  <h3 className="text-xl font-bold text-white">
                    Submission Code
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCopyCode}
                      className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
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
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
                  <pre className="p-4 text-slate-300 overflow-x-auto bg-slate-800 bg-opacity-20">
                    <code>{selectedCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
