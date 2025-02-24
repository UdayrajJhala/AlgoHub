import React, { useEffect, useState } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Easy: "bg-green-600",
    Medium: "bg-yellow-600",
    Hard: "bg-red-600",
  };

  return (
    <span
      className={`${colors[difficulty]} px-2 py-1 rounded-full text-xs font-medium text-white`}
    >
      {difficulty}
    </span>
  );
};

const Solve = () => {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/progress/submissions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return [];
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/problem/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response format");
      }

      return data;
    } catch (error) {
      console.error("Error fetching problems:", error);
      return [];
    }
  };

  const updateProblemsWithSolvedStatus = (problems = [], submissions = []) => {
    if (!Array.isArray(problems) || !Array.isArray(submissions)) {
      return [];
    }

    return problems.map((problem) => {
      const solved = submissions.some(
        (submission) =>
          submission?.problem_id === problem?.problem_id &&
          submission?.status === "Passed"
      );
      return { ...problem, solved };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [problemsData, submissionsData] = await Promise.all([
          fetchProblems(),
          fetchSubmissions(),
        ]);

        const updatedProblems = updateProblemsWithSolvedStatus(
          problemsData,
          submissionsData
        );

        setProblems(updatedProblems);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load problems. Please try again later.");
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-slate-900 p-8 pt-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Problems</h1>

        {loading ? (
          <div className="bg-slate-800 rounded-lg p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-300 text-lg">Loading problems...</p>
          </div>
        ) : error ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-300">No problems available.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-slate-700">
              {problems.map((problem) => (
                <Link
                  to={`/solve/${problem.problem_id}`}
                  key={problem.problem_id}
                  className="block"
                >
                  <div className="p-4 hover:bg-slate-700 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {problem.solved ? (
                            <CheckCircle className="text-green-500 w-5 h-5" />
                          ) : (
                            <Circle className="text-slate-400 w-5 h-5" />
                          )}
                          <h3 className="text-lg font-medium text-white">
                            {problem.title}
                          </h3>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <DifficultyBadge difficulty={problem.difficulty} />
                          <div className="flex flex-wrap gap-2">
                            {problem.topics?.map((topic) => (
                              <span
                                key={`${problem.problem_id}-${topic}`}
                                className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solve;
