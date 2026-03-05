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

    useEffect(() => {
    fetchSummary()
        }, [])

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
                </main>

            </div>
        </div>
    );
}

export default Dashboard;