import { useState } from "react";

export default function Settings({
  onUpdateBudget,
  onToggleCrosshair,
  crosshairEnabled,
}) {
  const [newBudget, setNewBudget] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // NEU

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
      setSuccessMessage("Budget successfully updated! ✓"); // NEU
      setTimeout(() => setSuccessMessage(""), 3000); // NEU
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
      {successMessage && (
        <p style={{ color: "green" }}>{successMessage}</p>
      )}{" "}
      {/* NEU */}
      <p>Crosshair</p>
      <button onClick={onToggleCrosshair}>
        {crosshairEnabled ? "[ On ]" : "[ Off ]"}
      </button>
    </div>
  );
}
