import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ username, userId, isLoggedIn, onSignOut, monthlyBudget }) { //isLoggedIn, onSignOut props-daten, die von außen eingebettet werden, username/userId kommen vom login
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('Dashboard');
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


    const sidebarLinks = ['Dashboard', 'Transactions', 'Saving Goals', 'Receipts', 'Settings'];

    const handleSignOut = () => {
        localStorage.removeItem('access_token')
        onSignOut();
        navigate('/');
    };

    // Logo klick: wenn eingeloggt → bleib auf Dashboard, sonst → LandingPage
    const handleLogoClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };


    const fetchSummary = async() => {
        const response = await fetch(`/api/expenses/user/${userId}/summary`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        if (response.ok) {
            const data = await response.json()
            setSummary(data)
        }
    }

    const fetchExpenses = async() => {
        const response = await fetch(`/api/expenses/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setExpenses(data)
            }
        }


    const handleSaveExpenses = async () => {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({title, amount, category, date, user_id: userId})
            })
            if(response.ok) {
                setIsModalOpen(false)
                fetchSummary()
            }
        }

    const fetchSavingGoals = async() => {
        const response = await fetch(`/api/saving-goals/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
            })
            if (response.ok) {
                const data = await response.json()
                setSavingGoals(data)
            }
        }

    useEffect(() => {
        fetchSummary()
        fetchExpenses()
        fetchSavingGoals()
    }, [])


    const handleAddSaving = async() =>{
        const goal = savingGoals.find((goal) => goal.id === selectedGoalId)
        const newAmount = goal.current_amount + Number(savingAmount)

        const response = await fetch(`/api/saving-goals/${selectedGoalId}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({current_amount: newAmount})
        })

        if (response.ok) {
            setIsSavingGoalModalOpen(false)
            setSavingAmount("")
            fetchSavingGoals()
        }
    }


    return (
        <div className="dashboard-page">

            {/* HEADER */}
            <header className="dashboard-header">
                <div className="dashboard-logo" onClick={handleLogoClick}>
                    ExpenseWise
                </div>
                <button className="dashboard-signout" onClick={handleSignOut}>
                    sign out
                </button>
            </header>

            {/* SIDEBAR + CONTENT */}
            <div className="dashboard-body">

                {/* SIDEBAR */}
                <nav className="dashboard-sidebar">
                    {sidebarLinks.map((link) => (
                        <span
                            key={link}
                            className={`sidebar-link ${activePage === link ? 'active' : ''}`}
                            onClick={() => setActivePage(link)}
                        >
                            {link}
                        </span>
                    ))}
                </nav>

                {/* CONTENT */}
                <main className="dashboard-content">
                    {activePage === 'Dashboard' && (
                        <div>
                        <p className="dashboard-greeting">
                            Hello {username}
                        </p>
                        <p className="dashboard-balance">
                            Current Balance: {monthlyBudget - summary["total amount"]}€ 
                        </p>
                        <button className="btn-add-expenses" onClick={() => setIsModalOpen(true)}>
                            Add expenses
                        </button>
                        {isModalOpen && (
                        <div className="modal">
                            {/* title */}
                            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                            
                            {/* amount */}
                            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            
                            {/* category */}
                            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                            
                            {/* date */}
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            <button onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                            <button onClick={handleSaveExpenses}>
                                Save
                            </button>
                        </div>
                        )}
                    </div>
                    )}
                    {activePage === 'Transactions' && (
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td>{expense.date}</td>
                                            <td>{expense.title}</td>
                                            <td>{expense.category}</td>
                                            <td>{expense.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activePage === 'Saving Goals' && (
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
                                                <button onClick={() => {
                                                    setSelectedGoalId(goal.id)
                                                    setIsSavingGoalModalOpen(true)
                                                }}>
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
                                    <button onClick={handleAddSaving}>
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;