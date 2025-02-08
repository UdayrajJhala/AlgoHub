import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      handleAuthSuccess(token);
    } else if (error) {
      console.error("Authentication error:", error);
    }
  }, []);

  const handleAuthSuccess = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        await login(token, userData);
        navigate("/dashboard"); // Or wherever you want to redirect after login
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="p-8 bg-slate-200 rounded-lg shadow-md">
          <p className="text-slate-900">Loading...</p>
        </div>
      </div>
    );
  }

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
