import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  

  const handleLoginSuccess = (name, id, monthlyBudget) => {
    setIsLoggedIn(true);
    setUsername(name);
    setUserId(id);
    setMonthlyBudget(monthlyBudget);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserId(null);
  };

  useEffect(() => {
    fetch('/api/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()  
        }
      })
      .then(data => {
        if (data) {
          handleLoginSuccess(data.username, data.id, data.monthly_budget) 
        }
        setIsLoading(false)
      })
  }, [])

  if (isLoading) return null

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
              monthlyBudget={monthlyBudget}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;