import { useState, useEffect } from "react";

export default function SavingGoals({ fetchSummary }) {
  const [savingGoals, setSavingGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isSavingGoalModalOpen, setIsSavingGoalModalOpen] = useState(false);
  const [savingAmount, setSavingAmount] = useState("");

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
  );
}
