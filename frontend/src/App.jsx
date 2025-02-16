import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Visualize from "./pages/Visualize";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import LogIn from "./pages/LogIn";
import Solve from "./pages/Solve";
import Problem from "./pages/Problem";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="p-8 bg-slate-200 rounded-lg shadow-md">
          <p className="text-slate-900">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return children;
};

// Handle OAuth callback component
const OAuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const error = params.get("error");

      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            await login(token, userData);
            // Navigate to the intended destination or default to dashboard
            const state = window.history.state;
            navigate(state?.from || "/solve");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/login");
        }
      } else if (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="p-8 bg-slate-200 rounded-lg shadow-md">
        <p className="text-slate-900">Processing login...</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          <Route
            path="/solve"
            element={
              <ProtectedRoute>
                <Solve />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solve/:id"
            element={
              <ProtectedRoute>
                <Problem />
              </ProtectedRoute>
            }
          />
        
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
