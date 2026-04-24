import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Transactions from "./Transactions";

function Dashboard({
  username,
  userId,
  isLoggedIn,
  onSignOut,
  monthlyBudget,
  onUpdateBudget,
}) {
  //isLoggedIn, onSignOut props-daten, die von außen eingebettet werden, username/userId kommen vom login
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Dashboard");
  const [summary, setSummary] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [isSavingGoalModalOpen, setIsSavingGoalModalOpen] = useState(false);
  const [savingAmount, setSavingAmount] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
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
    //navigate("/");
  };

  // Logo klick: wenn eingeloggt → bleib auf Dashboard, sonst → LandingPage
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

  const fetchSavingGoals = async () => {
    const response = await fetch(`/api/saving-goals/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setSavingGoals(data);
    }
  };

  const handleUpdateBudget = async () => {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ monthly_budget: newBudget }),
    });
    if (response.ok) {
      onUpdateBudget(Number(newBudget));
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchExpenses();
    fetchSavingGoals();
  }, []);

  const handleAddSaving = async () => {
    const goal = savingGoals.find((goal) => goal.id === selectedGoalId);
    const newAmount = goal.current_amount + Number(savingAmount);

    const response = await fetch(`/api/saving-goals/${selectedGoalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ current_amount: newAmount }),
    });

    if (response.ok) {
      setIsSavingGoalModalOpen(false);
      setSavingAmount("");
      fetchSavingGoals();

      const expenseResponse = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          title: `Saving: ${goal.title}`,
          amount: savingAmount,
          category: "Savings",
          date: new Date().toISOString().split("T")[0],
        }),
      });
      if (expenseResponse.ok) {
        fetchSummary();
      }
    }
  };

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
            <div>
              <p className="dashboard-greeting">Hello {username}</p>
              <p className="dashboard-balance">
                Current Balance: {monthlyBudget - summary["total_amount"]}€
              </p>
              <button
                className="btn-add-expenses"
                onClick={() => setIsModalOpen(true)}
              >
                Add expenses
              </button>
              {isModalOpen && (
                <div className="modal">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button onClick={handleSaveExpenses}>Save</button>
                </div>
              )}
            </div>
          )}
          {activePage === "Transactions" && (
            <Transactions expenses={expenses} fetchExpenses={fetchExpenses} />
          )}
          {activePage === "Saving Goals" && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Target Amount</th>
                    <th>Current Amount</th>
                    <th>Deadline</th>
                    <th>Add Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {savingGoals.map((goal) => (
                    <tr key={goal.id}>
                      <td>{goal.title}</td>
                      <td>{goal.target_amount}</td>
                      <td>{goal.current_amount}</td>
                      <td>{goal.deadline}</td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedGoalId(goal.id);
                            setIsSavingGoalModalOpen(true);
                          }}
                        >
                          +Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isSavingGoalModalOpen && (
                <div className="modal">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={savingAmount}
                    onChange={(e) => setSavingAmount(e.target.value)}
                  />
                  <button onClick={() => setIsSavingGoalModalOpen(false)}>
                    Cancel
                  </button>
                  <button onClick={handleAddSaving}>Save</button>
                </div>
              )}
            </div>
          )}
          {activePage === "Settings" && (
            <div>
              <p>Monthly Budget</p>
              <input
                type="number"
                placeholder="New Budget"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
              />
              <button onClick={handleUpdateBudget}>Save</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
