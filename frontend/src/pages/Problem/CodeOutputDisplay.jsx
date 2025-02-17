import React from "react";
import {
  CheckCircle2,
  XCircle,
  Terminal,
  ArrowRight,
  TestTube,
} from "lucide-react";

const CodeOutputDisplay = ({ output }) => {
  const isSuccess = output.includes("✅");
  const isRunning =
    output.includes("Running code...") || output.includes("Submitting code...");
  const hasError = output.includes("❌") || output.includes("Error:");

  const parseOutput = (output) => {
    const sections = {};

    const testCasesMatch = output.match(/Passed: (\d+)\/(\d+)/);
    if (testCasesMatch) {
      sections.testCases = {
        passed: testCasesMatch[1],
        total: testCasesMatch[2],
      };
    }

    if (output.includes("Input:")) {
      const inputMatch = output.match(/Input:\s*\n?([\s\S]*?)(?=\nOutput:|$)/);
      sections.input = inputMatch ? inputMatch[1].trim() : "";
    }

    if (output.includes("Output:")) {
      const outputMatch = output.match(/Output:\s*\n?([\s\S]*?)(?=\nError:|$)/);
      sections.output = outputMatch ? outputMatch[1].trim() : "";
    }

    if (output.includes("Error:")) {
      const errorMatch = output.match(/Error:\s*\n?([\s\S]*?)(?=\nInput:|$)/);
      sections.error = errorMatch ? errorMatch[1].trim() : "";
    }

    if (output.includes("Failed Test Cases:")) {
      sections.failedCases = output.split("Failed Test Cases:")[1].trim();
    }

    return sections;
  };

  const sections = parseOutput(output);

  if (!output) {
    return null;
  }

  if (isRunning) {
    return (
      <div className="flex items-center justify-center p-8 animate-pulse">
        <Terminal className="w-5 h-5 mr-2 text-blue-400" />
        <span className="text-blue-400 font-medium">{output}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`p-4 rounded-lg border ${
          isSuccess
            ? "bg-green-900/20 border-green-700 text-green-400"
            : hasError
            ? "bg-red-900/20 border-red-700 text-red-400"
            : "bg-slate-800 border-slate-700 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <h3 className="text-lg font-semibold">
            {isSuccess ? "Success!" : "Execution Failed"}
          </h3>
        </div>

        {sections.testCases && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <TestTube className="w-4 h-4" />
            <span>
              Passed {sections.testCases.passed} of {sections.testCases.total}{" "}
              test cases
            </span>
          </div>
        )}

        {sections.error && (
          <p className="mt-2 text-red-400">{sections.error}</p>
        )}
      </div>

      {(sections.input || sections.output) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.input && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="font-medium text-slate-300">Input</div>
              </div>
              <pre className="text-sm text-slate-400 whitespace-pre-wrap font-mono overflow-auto max-h-40">
                {sections.input}
              </pre>
            </div>
          )}
          {sections.output && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="font-medium text-slate-300">Output</div>
              </div>
              <pre className="text-sm text-slate-400 whitespace-pre-wrap font-mono overflow-auto max-h-40">
                {sections.output}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Failed Test Cases */}
      {sections.failedCases && (
        <div className="bg-red-950/20 rounded-lg p-4 border border-red-800">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-4 h-4 text-red-400" />
            <div className="font-medium text-red-400">Failed Test Cases</div>
          </div>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono overflow-auto max-h-60">
            {sections.failedCases}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeOutputDisplay;
