import { useState, useEffect } from "react";
import { apiFetch } from "./utils/api";

export default function SavingGoals({ fetchSummary }) {
  const [savingGoals, setSavingGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isSavingGoalModalOpen, setIsSavingGoalModalOpen] = useState(false);
  const [savingAmount, setSavingAmount] = useState("");

  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");

  const fetchSavingGoals = async () => {
    const response = await apiFetch(`/api/saving-goals/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setSavingGoals(data);
    }
  };

  const handleCreateGoal = async () => {
    const response = await apiFetch("/api/saving-goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        title: newGoalTitle,
        target_amount: Number(newGoalTarget),
        current_amount: 0,
        deadline: newGoalDeadline,
      }),
    });
    if (response.ok) {
      setIsNewGoalModalOpen(false);
      setNewGoalTitle("");
      setNewGoalTarget("");
      setNewGoalDeadline("");
      fetchSavingGoals();
    }
  };

  const handleAddSaving = async () => {
    const goal = savingGoals.find((goal) => goal.id === selectedGoalId);
    const newAmount = Number(goal.current_amount) + Number(savingAmount);

    const response = await apiFetch(`/api/saving-goals/${selectedGoalId}`, {
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

  useEffect(() => {
    fetchSavingGoals();
  }, []);

  return (
    <div>
      <button
        className="button-settings"
        onClick={() => setIsNewGoalModalOpen(true)}
      >
        [ + New Goal ]
      </button>

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

      {/* Modal: Betrag zu bestehendem Goal hinzufügen */}
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

      {/* Modal: Neues Goal erstellen */}
      {isNewGoalModalOpen && (
        <div className="modal">
          <input
            type="text"
            placeholder="Title"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
          />
          <input
            type="date"
            value={newGoalDeadline}
            onChange={(e) => setNewGoalDeadline(e.target.value)}
          />
          <button onClick={() => setIsNewGoalModalOpen(false)}>Cancel</button>
          <button onClick={handleCreateGoal}>Create</button>
        </div>
      )}
    </div>
  );
}
