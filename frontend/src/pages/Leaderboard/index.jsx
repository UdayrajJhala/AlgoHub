import { useEffect, useState } from "react";
import { Medal, Trophy, Target, Loader2 } from "lucide-react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [accessToken]);

  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-900 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        </div>

        {loading ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-300 text-lg">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-8 text-center">
            <p className="text-slate-300">No leaderboard data available.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="p-4 text-left text-sm font-medium text-slate-400">
                      Rank
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">
                      Name
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">
                      Problems Solved
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">
                      Submissions
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">
                      Correct
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-slate-400">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-4 text-white">
                        <div className="flex items-center gap-2">
                          {getMedalIcon(index)}
                          <span>{index + 1}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {user.name}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-400" />
                          <span className="text-white">
                            {user.problems_solved}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {user.total_submissions}
                      </td>
                      <td className="p-4 text-emerald-400">
                        {user.correct_submissions}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                          {user.accuracy}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
