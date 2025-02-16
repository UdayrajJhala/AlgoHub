import React, { useEffect, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
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
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/progress/submissions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data || []; // Ensure we return an empty array if data is null/undefined
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return []; // Return empty array on error
    }

    
  };

  // Fetch problems
  const fetchProblems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/problem/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

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
      return []; // Return empty array on error
    }
    
  };

  // Update problems with solved status
  const updateProblemsWithSolvedStatus = (problems = [], submissions = []) => {
    if (!Array.isArray(problems) || !Array.isArray(submissions)) {
      return [];
    }

    return problems.map((problem) => {
      // Check if any submission for this problem was successful
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
      try {
        // Fetch both problems and submissions
        const [problemsData, submissionsData] = await Promise.all([
          fetchProblems(),
          fetchSubmissions(),
        ]);

        // Update problems with solved status
        const updatedProblems = updateProblemsWithSolvedStatus(
          problemsData,
          submissionsData
        );

        setProblems(updatedProblems);
      } catch (error) {
        console.error("Error loading data:", error);
        setProblems([]); // Set empty array on error
      }
    };

    loadData();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-slate-900 p-8 pt-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Problems</h1>
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
      </div>
    </div>
  );
};

export default Solve;
