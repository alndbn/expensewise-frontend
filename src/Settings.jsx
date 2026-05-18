import { useState } from "react";
import { apiFetch } from "./utils/api";

export default function Settings({
  onUpdateBudget,
  onToggleCrosshair,
  crosshairEnabled,
  handleDeleteAccount,
}) {
  const [newBudget, setNewBudget] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdateBudget = async () => {
    const response = await apiFetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ monthly_budget: newBudget }),
    });
    if (response.ok) {
      onUpdateBudget(Number(newBudget));
      setSuccessMessage("Budget successfully updated! ✓");
      setTimeout(() => setSuccessMessage(""), 3000);
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
      <button className="button-settings" onClick={handleUpdateBudget}>
        Save
      </button>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}{" "}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginTop: "35px",
        }}
      >
        <span>Crosshair</span>
        <button className="button-settings" onClick={onToggleCrosshair}>
          {crosshairEnabled ? "[ On ]" : "[ Off ]"}
        </button>
      </div>
      <div style={{ marginTop: "35px" }}>
        <button className="button-settings" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
