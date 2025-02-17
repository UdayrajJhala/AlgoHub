import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  //
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/auth/google`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (accessToken && refreshToken) {
      handleAuthSuccess(accessToken, refreshToken);
    } else if (error) {
      setError(error);
      console.error("Authentication error:", error);
    }
  }, []);

  const handleAuthSuccess = async (accessToken, refreshToken) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        await login(accessToken, refreshToken, userData);

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        navigate("/dashboard");
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to complete login. Please try again.");
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-2 text-white bg-slate-900 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <FaGoogle className="mr-5" />
          <div>Sign in with Google</div>
        </button>
      </div>
    </div>
  );
};

export default Login;
