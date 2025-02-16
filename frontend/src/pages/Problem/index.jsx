import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Play, Send, Clock, Cpu } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { dracula } from "@uiw/codemirror-theme-dracula";

function Problem() {
  const { id } = useParams();
  const [problemData, setProblemData] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [editorContent, setEditorContent] = useState("");
  const [output, setOutput] = useState("");
  const [metrics, setMetrics] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/problem/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch problem data");
        const data = await response.json();
        setProblemData(data);
        setEditorContent(data.cpp_template);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setOutput("Error: Failed to load problem data");
      }
    };

    fetchProblem();
  }, [id, accessToken]);

  useEffect(() => {
    if (problemData) {
      setEditorContent(
        language === "cpp"
          ? problemData.cpp_template
          : problemData.java_template
      );
    }
  }, [language, problemData]);

  const handleRunCode = async () => {
    setOutput("Running code...");
    setMetrics(null);

    try {
      const response = await fetch("http://localhost:5000/api/problem/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          problem_id: id,
          code: editorContent,
          language: language === "cpp" ? "cpp" : "java",
        }),
      });

      if (!response.ok) throw new Error("Failed to run code");

      const data = await response.json();

      setMetrics({
        time: data.time,
        memory: data.memory,
      });

      if (data.correct) {
        setOutput(
          `✅ Correct!\nInput:\n${data.input}\nOutput:\n${data.output}`
        );
      } else if (!data.correct && !data.stderr) {
        setOutput(
          `❌ Incorrect!\nInput:${data.input}\n\nError:\nIncorrect Output:\n${data.output}`
        );
      } else {
        setOutput(`❌ Incorrect!\n\nError:\n${data.stderr || "Unknown Error"}`);
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error: Failed to execute code.");
    }
  };

  const handleSubmit = async () => {
    setOutput("Submitting code...");
    setMetrics(null);

    try {
      const response = await fetch("http://localhost:5000/api/problem/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          problem_id: id,
          code: editorContent,
          language: language === "cpp" ? "cpp" : "java",
        }),
      });

      if (!response.ok) throw new Error("Failed to submit code");

      const data = await response.json();

      setMetrics({
        averageTime: data.averageTime,
        averageMemory: data.averageMemory,
      });

      if (data.passed) {
        setOutput(
          `✅ Submission Successful!\nPassed: ${data.passed}/${data.totalCases}\n`
        );
      } else {
        setOutput(
          `❌ Submission Failed!\nPassed: ${data.passed}/${
            data.totalCases
          }\nFailed Test Cases:\n${data.failed_cases
            .map(
              (test, index) =>
                `Test ${index + 1}:\nInput: ${test.input}\nExpected: ${
                  test.expected
                }\nGot: ${test.output}`
            )
            .join("\n\n")}`
        );
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput("Error: Failed to submit code.");
    }
  };



  if (!problemData)
    return <div className="text-center text-gray-300">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-4 pt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Panel */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{problemData.title}</h1>
            <div className="flex gap-2 items-center">
              <span className="px-2 py-1 rounded bg-green-600 text-sm">
                {problemData.difficulty}
              </span>
              {problemData.topics.map((topic, index) => (
                <span
                  key={`${topic}-${index}`}
                  className="px-2 py-1 rounded bg-slate-700 text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">{problemData.description}</p>
            <div>
              <h3 className="font-semibold mb-2">Input Format:</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {problemData.input_format}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Output Format:</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {problemData.output_format}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Examples:</h3>
              <div className="space-y-4">
                {problemData.example_cases.map((example, index) => (
                  <div key={index} className="bg-slate-800 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="font-semibold">Input:</span>
                      <pre className="text-gray-300 mt-1">{example.input}</pre>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Output:</span>
                      <pre className="text-gray-300 mt-1">{example.output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-gray-100 px-3 py-2 rounded-md border border-slate-700 cursor-pointer"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer"
              >
                <Play size={16} />
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md cursor-pointer"
              >
                <Send size={16} />
                Submit
              </button>
            </div>
          </div>

          <div className="h-[400px] rounded-lg overflow-hidden border border-slate-700">
            <CodeMirror
              value={editorContent}
              height="400px"
              theme={dracula}
              extensions={[language === "cpp" ? cpp() : java()]}
              onChange={(value) => setEditorContent(value)}
              className="text-base"
            />
          </div>

          {metrics && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                {metrics.time !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" />
                    <span>Time: {`${metrics.time} ms`}</span>
                  </div>
                )}
                {metrics.memory !== undefined && (
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-green-400" />
                    <span>Memory: {`${metrics.memory} KB`}</span>
                  </div>
                )}
                {metrics.averageTime !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" />
                    <span>Avg Time: {`${metrics.averageTime} ms`}</span>
                  </div>
                )}
                {metrics.averageMemory !== undefined && (
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-green-400" />
                    <span>Avg Memory: {`${metrics.averageMemory} KB`}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-slate-800 rounded-lg p-4 h-[200px] overflow-auto border border-slate-700">
            <h3 className="font-semibold mb-2">Output:</h3>
            <pre className="text-gray-300 whitespace-pre-line">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problem;
