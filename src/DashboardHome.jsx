import { useState, useEffect } from "react";
import { apiFetch } from "./utils/api";

export default function DashboardHome({
  username,
  monthlyBudget,
  summary,
  fetchSummary,
  fetchExpenses,
  baseCurrency,
}) {
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "JPY", "CAD", "AUD"];
  const CURRENCY_SYMBOLS = {
    EUR: "€",
    GBP: "£",
    USD: "$",
    CHF: "Fr",
    JPY: "¥",
    CAD: "CA$",
    AUD: "A$",
  };
  const defaultCategories = [
    { id: "Groceries", title: "Groceries" },
    { id: "Transport", title: "Transport" },
    { id: "Health", title: "Health" },
    { id: "Savings", title: "Savings" },
    { id: "Other", title: "Other" },
  ];
  const [categories, setCategories] = useState([]);

  const handleSaveExpenses = async () => {
    const response = await apiFetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ title, amount, category, date, currency }),
    });
    if (response.ok) {
      setIsModalOpen(false);
      fetchSummary();
      fetchExpenses();
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;
      const response = await apiFetch(`/api/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        const fetchedCategories = await response.json();

        setCategories([...defaultCategories, ...fetchedCategories]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <p className="dashboard-greeting">Hello {username}</p>
      <p className="dashboard-balance">
        Current Balance: {(monthlyBudget - summary["total_amount"]).toFixed(2)}
        {CURRENCY_SYMBOLS[baseCurrency]}
      </p>
      <button className="btn-add-expenses" onClick={() => setIsModalOpen(true)}>
        Add expenses
      </button>
      {isModalOpen && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          />
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
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button onClick={handleSaveExpenses}>Save</button>
          </div>
        </>
      )}
    </div>
  );
}
