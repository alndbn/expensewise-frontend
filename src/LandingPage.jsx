import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">

            {/* Das Logo hier navigiert immer zur LandingPage "/" */}
            <header className="header">
                <div
                    className="logo"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    ExpenseWise
                </div>
            </header>

            <main className="main-content">
                <h1>Master your Money with ExpenseWise.</h1>
                <p className="subtitle">
                    The smartest way to track, analyze, and optimize your daily spending. Built for speed and clarity.
                </p>
                <ul className="features-list">
                    <li><strong>Instant Logging:</strong> Record your expenses on the go and see your balance update immediately.</li>
                    <li><strong>Custom Categorization:</strong> Organize your spending your way with personalized categories.</li>
                    <li><strong>Data Visualization:</strong> Beautiful charts that actually make sense of your numbers.</li>
                    <li><strong>Set Monthly Budgets:</strong> Define your limits and get notified before you overspend.</li>
                </ul>
                <div className="cta-buttons">
                    <Link to="/register" className='btn-get-started'>
                        [ Get started ]
                    </Link>
                    <Link to="/login" className='btn-login'>
                        [ Log in ]
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default LandingPage;
