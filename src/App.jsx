import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Crosshair from "./Crosshair";
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  const handleLoginSuccess = (name, id) => {
    setIsLoggedIn(true);
    setUsername(name);
    setUserId(id);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
  };

  return (
    <Router>
      <Crosshair color='#FF0707' />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route
          path='/login'
          element={
            <LoginForm
              isLoggedIn={isLoggedIn}
              onLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route
          path='/register'
          element={<RegisterForm isLoggedIn={isLoggedIn} />}
        />
        <Route
          path='/dashboard'
          element={
            <Dashboard
              username={username}
              userId={userId}
              isLoggedIn={isLoggedIn}
              onSignOut={handleSignOut}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;