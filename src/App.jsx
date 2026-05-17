import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Crosshair from "./Crosshair";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import { apiFetch } from "./utils/api";

function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) return <Navigate to="/" />;
  return children;
}

function PublicRoute({ children, isLoggedIn }) {
  if (isLoggedIn) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [crosshairEnabled, setCrosshairEnabled] = useState(
    () => localStorage.getItem("crosshair") !== "false",
  );

  const handleLoginSuccess = (name, id, monthlyBudget) => {
    setIsLoggedIn(true);
    setUsername(name);
    setUserId(id);
    setMonthlyBudget(monthlyBudget);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername("");
    setUserId(null);
    return <Navigate to="/" />;
  };

  const handleUpdateBudget = (newBudget) => {
    setMonthlyBudget(newBudget);
  };

  const handleToggleCrosshair = () => {
    setCrosshairEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem("crosshair", String(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const response = await apiFetch("/api/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        setIsLoading(false);
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        const data = await response.json();
        handleLoginSuccess(data.username, data.id, data.monthly_budget);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading)
    return (
      <div style={{ cursor: "wait" }}>
        ExpenseWise is starting up — please wait a moment...
      </div>
    );

  return (
    <Router>
      {crosshairEnabled && <Crosshair color="#FF0707" />}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <LoginForm
                isLoggedIn={isLoggedIn}
                onLoginSuccess={handleLoginSuccess}
              />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <RegisterForm
                isLoggedIn={isLoggedIn}
                onLoginSuccess={handleLoginSuccess}
              />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard
                username={username}
                userId={userId}
                isLoggedIn={isLoggedIn}
                onSignOut={handleSignOut}
                monthlyBudget={monthlyBudget}
                onUpdateBudget={handleUpdateBudget}
                crosshairEnabled={crosshairEnabled}
                onToggleCrosshair={handleToggleCrosshair}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
