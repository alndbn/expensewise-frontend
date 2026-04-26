import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Transactions from "./Transactions";
import Settings from "./Settings";
import SavingGoals from "./SavingGoals";
import DashboardHome from "./DashboardHome";

function Dashboard({
  username,
  userId,
  isLoggedIn,
  onSignOut,
  monthlyBudget,
  onUpdateBudget,
}) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Dashboard");
  const [summary, setSummary] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newBudget, setNewBudget] = useState("");

  const sidebarLinks = [
    "Dashboard",
    "Transactions",
    "Saving Goals",
    "Receipts",
    "Settings",
  ];

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    onSignOut();
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const fetchSummary = async () => {
    const response = await fetch(`/api/expenses/user/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("haaaaalllooo", data);
      setSummary(data);
    }
  };

  const fetchExpenses = async () => {
    const response = await fetch(`/api/expenses/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setExpenses(data);
    }
  };

  const handleSaveExpenses = async () => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ title, amount, category, date }),
    });
    if (response.ok) {
      setIsModalOpen(false);
      fetchSummary();
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-logo" onClick={handleLogoClick}>
          ExpenseWise
        </div>
        <button className="dashboard-signout" onClick={handleSignOut}>
          sign out
        </button>
      </header>

      <div className="dashboard-body">
        <nav className="dashboard-sidebar">
          {sidebarLinks.map((link) => (
            <span
              key={link}
              className={`sidebar-link ${activePage === link ? "active" : ""}`}
              onClick={() => setActivePage(link)}
            >
              {link}
            </span>
          ))}
        </nav>

        <main className="dashboard-content">
          {activePage === "Dashboard" && (
            <DashboardHome
              username={username}
              monthlyBudget={monthlyBudget}
              summary={summary}
              fetchSummary={fetchSummary}
            />
          )}
          {activePage === "Transactions" && (
            <Transactions expenses={expenses} fetchExpenses={fetchExpenses} />
          )}
          {activePage === "Saving Goals" && (
            <SavingGoals fetchSummary={fetchSummary} />
          )}
          {activePage === "Settings" && (
            <Settings onUpdateBudget={onUpdateBudget} />
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
