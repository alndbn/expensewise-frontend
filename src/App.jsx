import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Crosshair from "./Crosshair";
import LandingPage from './LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className='App'>
        <Crosshair color='#FF0707' />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          {/* isLoggedIn weitergeben, damit das Logo weiß wohin es navigieren soll */}
          <Route path='/login' element={<LoginForm isLoggedIn={isLoggedIn} />} />
          <Route path='/register' element={<RegisterForm isLoggedIn={isLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
