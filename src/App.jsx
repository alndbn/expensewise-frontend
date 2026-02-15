import React, { useState } from 'react'; //holen den useState hook, um daten(state) in
//der App zu speichern und zu tracken
import LoginForm from './LoginForm'; // Importieren LoginForm aus datei um sie hier anzuzeigen
import RegisterForm from './RegisterForm'; //importieren die RegisterForm-Komponente, damit wir
//zwischen Login und Registrierung wechseln können

function App() {
  //unser 'Schalter', der sich merkt, ob wir gerade den Login oder die Registrierung sehen
  const[isLogin, setIsLogin] = useState(true) //der 'Schalter'
  //'return'-Teil bestimmt, was am Ende im Browser als HTML gezeichnet wird
  return (
  <div className="App">
    <h1>ExpenseWise</h1>
    
    {/* 1. Welches Formular wird gezeigt? */}
    {isLogin ? <LoginForm /> : <RegisterForm />}
    

    {/*Das '!' kehrt den Wert um (von true zu false oder umgekehrt) um von register zu login zu kommen */}
    <button onClick={() => setIsLogin(!isLogin)}>
      {/* Text auf dem Button ändert sich je nach Zustand von 'isLogin'. */}
      {isLogin ? "No account yet? Sign up" : "Already have an account? Log in"}
    </button>
  </div>
);
}
//Damit andere Dateien (wie die index.js) diese App-Komponente nutzen können, müssen wir sie exportieren
export default App;