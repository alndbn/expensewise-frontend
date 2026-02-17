import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LandingPage.css';

function LoginForm({ isLoggedIn, onLoginSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogoClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Login failed");
                return;
            }
            const data = await response.json();
            setError("");
            onLoginSuccess(data.user.username, data.user.id);
            navigate('/dashboard');
        } catch (error) {
            setError("Connection to server went wrong.");
        }
    };

    return (
        <div className="landing-page">
            <header className="header">
                <div className="logo" onClick={handleLogoClick}>
                    ExpenseWise
                </div>
            </header>
            <main className="main-content">
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Passwort</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Log in</button>
                </form>
            </main>
        </div>
    );
}

export default LoginForm;