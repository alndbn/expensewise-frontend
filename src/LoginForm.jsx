import React, { useState } from "react"; //Hook importieren, useState um die Eingaben (E-Mail/Passwort) zu speichern.

function LoginForm(){
    //Hier erstellen wir drrei 'Zettel' (States), um die Tipp-Eingaben des Nutzers live zu speichern
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); //leerer Zettel für Fehlermeldungen

    //diese Funktion wird ausgeführt, wenn der Nutzer auf 'Log in' klickt, kommuniziert mit dem backend
    //'async' bedeutet: Hier passieren Dinge, die einen Moment dauern können
    const handleSubmit = async (event) => {
        //Verhindert, dass die Seite sich neu lädt
        event.preventDefault();
        //Kurze Info in der Browser-Konsole
        console.log("Send Data to Backend...");

        try {
        //'fetch' schickt die Daten an dein Flask-Backend. 
        //'await' sagt: "Warte kurz hier, bis der Server geantwortet hat.
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }), //in json format umwandeln, sonst versteht flask das nicht
        });

        if (!response.ok) {
            const errorData = await response.json(); //fehlermeldung vom server
            setError(errorData.error || "Login failed"); //im state speichern
            return //abbrechen
        }
        //wenn response.ok = true war dann:
        const data = await response.json();
        setError("") //alten Fehler löschen, da es geklappt hat
        console.log("Success:", data);
        } catch (error) {
            setError("Connection to server went wrong.")
        }

    };

    //Teil, den der Nutzer im Browser sieht
    return(
        //wenn Formular abgeschickt wird, rufe unsere 'handleSubmit' Funktion auf
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>} 
            <div>
                <label htmlFor="email-field">Email</label>
                {/*Eingabefeld: 'value' liest vom Zettel, 'onChange' schreibt auf den Zettel aka eingabefeld. */}
                <input
                    type="email"
                    value={email} // Das Feld zeigt immer das an, was auf unserem "Zettel" steht
                    onChange={(e) => setEmail(e.target.value)} //beim Tippen aktualisieren wir den Zettel
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
            {/* Button vom Typ 'submit' löst automatisch das 'onSubmit' im <form> aus. */}
            <button type="submit">Log in</button>
        </form>
    );
}

export default LoginForm;