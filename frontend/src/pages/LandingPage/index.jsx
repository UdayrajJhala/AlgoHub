import React from "react";
import { Search, Code, BarChart2, Award } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: <Code className="w-6 h-6 text-blue-400" />,
      title: "Curated Problems",
      description: "Handpicked challenges ranging from easy to advanced",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-cyan-400" />,
      title: "Interactive Visualizations",
      description: "See algorithms come to life with dynamic visuals",
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-400" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Enhanced gradient background with animated glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating gradient orbs */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute top-60 left-20 w-64 h-64 bg-cyan-500 rounded-full opacity-10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 mt-24 mb-10">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Master DSA with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-2">
                AlgoHub
              </span>
            </h1>
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl" />
          </div>

          <p className="max-w-2xl mx-auto text-lg text-slate-300">
            Elevate your coding skills with curated problems, interactive
            visualizations, and comprehensive progress tracking to ace your
            technical interviews.
          </p>

          <div className="relative">
            <div className="flex items-center justify-center space-x-5">
              <Link to="/solve">
                <button className="h-15 px-8 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                  Solve Problems
                </button>
              </Link>

              <Link to="/visualize">
                <button className="h-15 px-6 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-800/10 transition-all">
                  <div className="flex flex-col items-center">
                    <span>Visualize Algorithms</span>
                    <span>(no sign-in required)</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:border-slate-600/50 transition-all"
            >
              <div className="bg-slate-700/50 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
