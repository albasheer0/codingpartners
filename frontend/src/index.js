import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HabitProvider } from './contexts/HabitContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HabitProvider>
      <App />
    </HabitProvider>
  </React.StrictMode>
); 