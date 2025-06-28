import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useHabits } from './contexts/HabitContext';
import { authAPI } from './services/api';

import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import HistoryPage from './components/HistoryPage';
import NavBar from './components/Navbar';
import './App.css';
import Header from './components/Header';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  const {
    summary,
  } = useHabits();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      const currentUser = authAPI.getCurrentUser();
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  if (!isAuthenticated) {
    return (
      <div className="app">
     <main>
     <LoginForm onLogin={(user) => {
          setIsAuthenticated(true);
          setUser(user);
        }} />
     </main>
        <Toaster position="top-right" />
      </div>
    );
  }

  const completedToday = summary.completedToday;
  const totalHabits = summary.totalHabits;
  const completionRate = summary.completionRate;

  return (
    <Router>
      <NavBar user={user} handleLogout={handleLogout} />
     <Header completedToday={completedToday} totalHabits={totalHabits} completionRate={completionRate} />
      <div  className="app-main-content">
        <main className="app-main">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
        </main>
      </div>
   
     
    </Router>
  );
}

export default App; 