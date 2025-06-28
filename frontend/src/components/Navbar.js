import { LogOut, User, Target } from 'lucide-react';

function NavBar({user,handleLogout}) {
    return (
      <nav className="navbar app-header top-0 z-50 bg-white shadow-sm flex items-center justify-between px-4 py-2">
        <div>
        <h1 className="app-title">
          <Target size={28} className="title-icon" />
          Habit Tracker
        </h1>   
        </div>
        <div className="flex ">
        <div className="user-info mx-3">
          <User size={16} />
          <span>Welcome, {user?.name || 'User'}!</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          Logout
        </button>
      </div>
      
      </nav>
    );
  }

  export default NavBar;