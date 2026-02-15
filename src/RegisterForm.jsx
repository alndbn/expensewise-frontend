import React, { useState } from "react"; //Hook importieren

function RegisterForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    //funktion die mit dem backend spricht
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); // Zuerst alten Fehler löschen

        // Ein kleiner Extra-Check direkt im Frontend (bevor wir überhaupt das Internet fragen):
        if (!username || !email || !password) {
            setError("Please fill in all fields!");
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
            // Hier könnte man den Nutzer automatisch zum Login umschalten
        } catch (error) {
            setError("Connection to server failed.");
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
            <div>
                <label htmlFor="email-field">Email</label>
                <input
                    type="email"
                    value={email} // Das Feld zeigt immer das an, was auf unserem "Zettel" steht
                    onChange={(e) => setEmail(e.target.value)} // Beim Tippen aktualisieren wir den Zettel
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
    );
}

export default RegisterForm;