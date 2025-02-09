import React from "react";
import { CheckCircle, Circle } from "lucide-react";

const questions = [
  {
    id: 1,
    name: "Two Sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Table"],
    solved: true,
  },
  {
    id: 2,
    name: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stack", "String"],
    solved: false,
  },
  {
    id: 3,
    name: "Merge K Sorted Lists",
    difficulty: "Hard",
    topics: ["Linked List", "Divide and Conquer", "Heap"],
    solved: false,
  },
  {
    id: 4,
    name: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: ["Tree", "BFS"],
    solved: true,
  },
  {
    id: 5,
    name: "Maximum Subarray",
    difficulty: "Medium",
    topics: ["Array", "Dynamic Programming"],
    solved: false,
  },
  {
    id: 6,
    name: "Course Schedule",
    difficulty: "Medium",
    topics: ["Graph", "DFS", "Topological Sort"],
    solved: true,
  },
  {
    id: 7,
    name: "Trapping Rain Water",
    difficulty: "Hard",
    topics: ["Array", "Two Pointers", "Stack"],
    solved: false,
  },
  {
    id: 8,
    name: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Array", "Dynamic Programming"],
    solved: true,
  },
  {
    id: 9,
    name: "Word Search",
    difficulty: "Medium",
    topics: ["Array", "Backtracking", "DFS"],
    solved: false,
  },
  {
    id: 10,
    name: "LRU Cache",
    difficulty: "Medium",
    topics: ["Hash Table", "Linked List", "Design"],
    solved: true,
  },
];

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Easy: "bg-green-600",
    Medium: "bg-yellow-600",
    Hard: "bg-red-600",
  };

  return (
    <span
      className={`${colors[difficulty]} px-2 py-1 rounded-full text-xs font-medium`}
    >
      {difficulty}
    </span>
  );
};

const Solve = () => {
  return (
    <div className="min-h-screen bg-slate-900 p-8 pt-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Problems
        </h1>
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-700">
            {questions.map((question) => (
              <div
                key={question.id}
                className="p-4 hover:bg-slate-700 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {question.solved ? (
                        <CheckCircle className="text-green-500 w-5 h-5" />
                      ) : (
                        <Circle className="text-slate-400 w-5 h-5" />
                      )}
                      <h3 className="text-lg font-medium text-white">
                        {question.name}
                      </h3>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <DifficultyBadge difficulty={question.difficulty} />
                      <div className="flex flex-wrap gap-2">
                        {question.topics.map((topic, index) => (
                          <span
                            key={index}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solve;
