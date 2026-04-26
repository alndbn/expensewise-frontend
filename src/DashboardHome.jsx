import { useState } from "react";

export default function DashboardHome({
  username,
  monthlyBudget,
  summary,
  fetchSummary,
}) {
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

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

  return (
    <div>
      <p className="dashboard-greeting">Hello {username}</p>
      <p className="dashboard-balance">
        Current Balance: {monthlyBudget - summary["total_amount"]}€
      </p>
      <button className="btn-add-expenses" onClick={() => setIsModalOpen(true)}>
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
  );
}
