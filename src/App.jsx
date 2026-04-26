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
import Settings from "./Settings";

function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}

function PublicRoute({ children, isLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(0);

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

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/me", {
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

  if (isLoading) return <div style={{ cursor: "wait" }} />;

  const handleUpdateBudget = (newBudget) => {
    setMonthlyBudget(newBudget);
  };

  return (
    <Router>
      <Crosshair color="#FF0707" />
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
              <RegisterForm isLoggedIn={isLoggedIn} />
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
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
