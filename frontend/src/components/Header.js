import { Link, useLocation } from 'react-router-dom';
import { History } from 'lucide-react';
function Header({  completedToday, totalHabits, completionRate }) {
    const location = useLocation();
    return (
    <header className="app-header">
    <div className="header-content">
    <div className="flex items-center gap-4">
          <Link to="/" className={` nav-link ${location.pathname === '/' ? 'active' : ''}`}>My Habits</Link>
          <Link to="/history" className={`flex nav-link ${location.pathname === '/history' ? 'active' : ''}`}> <History size={24} className='mx-1' /> History</Link>
        </div>
      <div >
        <div className="completion-summary">
          <span className="completion-text">
            {completedToday}/{totalHabits} completed today
          </span>
          <div className="completion-bar">
            <div 
              className="completion-fill" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      
       
      </div>
    </div>
  </header>
  );
}

export default Header;