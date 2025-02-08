import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Code, Eye, BarChart2, Trophy, Menu, X, LogIn } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Adjust the import path as needed

const Navbar = () => {
  const accessToken = localStorage.getItem("accessToken"); 

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setImageURL(data.profilePicUrl); // Assuming the response contains { profilePicUrl: "https://..." }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePic();
  }, [accessToken]);

  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [imageURL, setImageURL] = useState(null);

  const navItems = [
    { icon: <Code size={20} />, label: "Solve", path: "/solve" },
    { icon: <Eye size={20} />, label: "Visualize", path: "/visualize" },
    { icon: <BarChart2 size={20} />, label: "Progress", path: "/progress" },
    { icon: <Trophy size={20} />, label: "Leaderboard", path: "/leaderboard" },
  ];

  const renderAuthSection = () => {
    if (isAuthenticated) {
      return (
        <NavLink
          to="/profile"
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          <img
            src={imageURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </NavLink>
      );
    }

    return (
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `flex items-center space-x-1 transition-colors ${
            isActive ? "text-blue-500" : "text-slate-300 hover:text-white"
          }`
        }
      >
        <LogIn size={20} />
        <span>Sign In</span>
      </NavLink>
    );
  };

  const renderMobileAuthSection = () => {
    if (isAuthenticated) {
      return (
        <NavLink to="/profile" className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={imageURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </NavLink>
      );
    }

    return (
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `flex items-center space-x-1 transition-colors ${
            isActive ? "text-blue-500" : "text-slate-300 hover:text-white"
          }`
        }
      >
        <LogIn size={20} />
        <span>Sign In</span>
      </NavLink>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              AlgoHub
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 transition-colors ${
                    isActive
                      ? "text-blue-500"
                      : "text-slate-300 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            {renderAuthSection()}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {renderMobileAuthSection()}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-64 opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-blue-500"
                      : "text-slate-300 hover:text-white"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
