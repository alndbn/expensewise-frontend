import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LandingPage.css'; // Notizbuch-Hintergrund wiederverwenden

function RegisterForm({ isLoggedIn }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    // Logo-Klick: eingeloggt → Dashboard, sonst → LandingPage
    const handleLogoClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!username || !email || !password) {
            setError("Please fill in all fields");
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Registration failed");
                return;
            }
            const data = await response.json();
            console.log("Success:", data);
        } catch (error) {
            setError("Connection to server failed.");
        }
    };

    return (
        // Gleicher Notizbuch-Wrapper wie die LandingPage
        <div className="landing-page">
            <header className="header">
                <div
                    className="logo"
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                >
                    ExpenseWise
                </div>
            </header>

            <main className="main-content">
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
                    <div>
                        <label htmlFor="email-field">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password-field">Passwort</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="username-field">Username</label>
                        <input
                            id="username-field"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </main>
        </div>
    );
}

export default RegisterForm;
