import { useState } from "react";

export default function Settings({ onUpdateBudget }) {
  const [newBudget, setNewBudget] = useState("");

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

  return (
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
  );
}
