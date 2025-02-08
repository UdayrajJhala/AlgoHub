import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_250%)]" />

      <div className="relative pt-20 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mt-24">
          <div className="text-5xl font-bold text-white min-h-20 mb-0">
            Master DSA with
            <div className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 min-h-20">
              AlgoHub
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-lg text-slate-300">
            Curated Problems, Interactive Visualizations and Progress tracking
            to help you ace your technical interviews.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <Link to="/solve">
              <button className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:opacity-90 transition-opacity hover:cursor-pointer">
                Solve Problems
              </button>
            </Link>

            <Link to="/visualize">
              <button className="px-5 py-3 rounded-lg border bg-gray-900 border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:cursor-pointer transition-colors">
                Visualize Algorithms
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
