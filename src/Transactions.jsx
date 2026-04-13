import { useState } from "react";

export default function Transactions({ expenses, fetchExpenses }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonths, setFilterMonths] = useState("all");
  const filteredExpenses = expenses
    .filter((expense) =>
      expense.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((expense) => {
      if (filterMonths === "all") return true;
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - Number(filterMonths));
      return new Date(expense.date) >= monthsAgo;
    });

  const handleDeleteExpenses = async (expense_id) => {
    const response = await fetch(`/api/expenses/${expense_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (response.ok) {
      fetchExpenses();
    }
  };
  const handleEditExpense = async (expenses_id) => {
    console.log(selectedExpense);
    const response = await fetch(`/api/expenses/${selectedExpense.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        title: selectedExpense.title,
        amount: selectedExpense.amount,
        category: selectedExpense.category,
        date: selectedExpense.date,
      }),
    });

    if (response.ok) {
      setIsEditModalOpen(false);
      fetchExpenses();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        value={filterMonths}
        onChange={(e) => setFilterMonths(e.target.value)}
      >
        <option value="all">All</option>
        <option value="3">Last 3 months</option>
        <option value="6">Last 6 months</option>
        <option value="12">Last 12 months</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.date}</td>
              <td>{expense.title}</td>
              <td>{expense.category}</td>
              <td>{expense.amount}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedExpense(expense);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteExpenses(expense.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalOpen && (
        <div className="modal">
          <input
            type="text"
            placeholder="Title"
            value={selectedExpense.title}
            onChange={(e) =>
              setSelectedExpense({ ...selectedExpense, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Amount"
            value={selectedExpense.amount}
            onChange={(e) =>
              setSelectedExpense({ ...selectedExpense, amount: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category"
            value={selectedExpense.category}
            onChange={(e) =>
              setSelectedExpense({
                ...selectedExpense,
                category: e.target.value,
              })
            }
          />
          <input
            type="date"
            placeholder="Date"
            value={selectedExpense.date}
            onChange={(e) =>
              setSelectedExpense({ ...selectedExpense, date: e.target.value })
            }
          />
          <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          <button onClick={handleEditExpense}>Save</button>
        </div>
      )}
    </div>
  );
}
