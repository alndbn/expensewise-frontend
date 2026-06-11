import { useState, useEffect } from "react";
import { apiFetch } from "./utils/api";

export default function Settings({
  onUpdateBudget,
  onToggleCrosshair,
  crosshairEnabled,
  handleDeleteAccount,
  baseCurrency,
}) {
  const [newBudget, setNewBudget] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency);
  const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "JPY", "CAD", "AUD"];

  const fetchCategories = async () => {
    const response = await apiFetch("/api/categories", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
      setSuccessMessage("Budget successfully updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleUpdateCurrency = async () => {
    const response = await apiFetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ base_currency: selectedCurrency }),
    });
    if (response.ok) {
      setSuccessMessage("Currency successfully updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleAddCategory = async () => {
    const response = await apiFetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ title: newCategory }),
    });
    if (response.ok) {
      setNewCategory("");
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (category_id) => {
    const response = await apiFetch(`/api/categories/${category_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (response.ok) {
      fetchCategories();
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
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <div style={{ marginTop: "35px" }}>
        <p>Base Currency</p>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          {CURRENCIES.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <button className="button-settings" onClick={handleUpdateCurrency}>
          Save
        </button>
      </div>

      <div style={{ marginTop: "35px" }}>
        <p>Categories</p>
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button className="button-settings" onClick={handleAddCategory}>
          Add
        </button>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.title}
              <button onClick={() => handleDeleteCategory(cat.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

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
