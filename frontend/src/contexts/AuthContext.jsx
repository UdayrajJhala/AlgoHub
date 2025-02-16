import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const refreshTimeoutRef = useRef(null);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await response.json();
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // Schedule the next token refresh
      scheduleTokenRefresh();

      return accessToken;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      throw error;
    }
  };

  const scheduleTokenRefresh = () => {
    // Clear any existing refresh timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Get the current access token
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    // Decode the token to get its expiration time
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const expiresIn = payload.exp * 1000 - Date.now(); // Convert to milliseconds

      // Refresh 1 minute before expiration
      const refreshTime = Math.max(0, expiresIn - 60000);

      refreshTimeoutRef.current = setTimeout(() => {
        refreshAccessToken();
      }, refreshTime);
    } catch (error) {
      console.error("Failed to schedule token refresh:", error);
    }
  };

  const fetchWithToken = async (url, options = {}) => {
    let accessToken = localStorage.getItem("accessToken");

    if (!accessToken && !initialized) {
      throw new Error("Auth not initialized");
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        accessToken = await refreshAccessToken();
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // Skip the check if we don't have any tokens
    if (!accessToken && !refreshToken) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      const response = await fetchWithToken(
        "http://localhost:5000/api/auth/user"
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Schedule token refresh after successful auth check
        scheduleTokenRefresh();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure localStorage is populated
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const login = async (accessToken, refreshToken, userData) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(userData);
    setInitialized(true);
    scheduleTokenRefresh(); // Schedule refresh when logging in
  };

  const logout = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    fetchWithToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
