import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ username, userId, isLoggedIn, onSignOut }) {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('Dashboard');

    const sidebarLinks = ['Dashboard', 'Transactions', 'Saving Goals', 'Receipts', 'Settings'];

    const handleSignOut = () => {
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
                        Current Balance: 2.455,76€
                    </p>
                    <button className="btn-add-expenses">
                        Add expenses
                    </button>
                </main>

            </div>
        </div>
    );
}

export default Dashboard;