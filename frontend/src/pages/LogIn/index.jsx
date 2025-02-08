import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="p-8 bg-slate-200 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">
          Welcome to AlgoHub
        </h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-2 text-white bg-slate-900 border border-gray-300 rounded-lg shadow-sm cursor-pointer"
        >
          <FaGoogle className="mr-5" />
          <div>Sign in with Google</div>
        </button>
      </div>
    </div>
  );
};

export default Login;
