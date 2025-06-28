import { useState, useEffect } from 'react';
import { useHabits } from '../contexts/HabitContext';
import {  Target } from 'lucide-react';
import { habitAPI } from '../services/api';
import '../App.css';
import { CalendarDayCard } from './CalendarDayCard';

function HistoryPage() {
  const { history, loadHistory, loading, error, totalHistory } = useHabits();
  const [days, setDays] = useState(7);
  const [page, setPage] = useState(0);
  const [allHabits, setAllHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState('');
  const pageSize = 9;

  useEffect(() => {
    habitAPI.getAllIdName().then(res => setAllHabits(res.data));
  }, []);

  useEffect(() => {
    loadHistory(days, pageSize, page * pageSize, selectedHabit || undefined);
    // eslint-disable-next-line
  }, [days, page, loadHistory, selectedHabit]);

  const totalPages = Math.ceil(totalHistory / pageSize);

  return (
    <div className="history-page container py-4  ">
  
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading history...</p>
        </div>
      )}
      {error && (
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
        </div>
      )}
      {!loading && !error && history.length === 0 && (
        <div className="empty-state">
          <Target size={48} className="empty-icon" />
          <h3>No history yet</h3>
          <p>Start building your habits to see history here!</p>
        </div>
      )}
      {!loading && !error && history.length > 0 && (
        <>
          <div className="history-container">
          
            <h3 className="history-title flex flex-wrap">History   
              <span className='flex flex-wrap mx-1 gap-2'>
              <label htmlFor="history-days">Last:</label>
        <select
          id="history-days"
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="history-select"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
        </select>
              </span>
                days, 
                <span className="flex flex-wrap mx-1 gap-2">
        <label htmlFor="habit-filter">Showing:</label>
        <select
          id="habit-filter"
          value={selectedHabit}
          onChange={e => { setSelectedHabit(e.target.value); setPage(0); }}
          className="history-select"
        >
          <option value="">All Habits</option>
          {allHabits.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </span>
      </h3>
            <div className="history-grid">
              {selectedHabit
                ? history
                    .filter(habit => habit.id === selectedHabit)
                    .map(habit => (
                      <div key={habit.id} className="history-card">
                        <h4 className="history-habit-name">{habit.name}</h4>
                        <div className="history-stats">
                          <div className="history-stat">
                            <span className="stat-label">Completion Rate: </span>
                            <span className="stat-value">{habit.completionPercentage}%</span>
                          </div>
                          <div className="history-calendar">
                            {habit.completionHistory.map((day, index) => (
                              <CalendarDayCard key={index} date={day.date} completed={day.completed} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                : history.map(habit => (
                    <div key={habit.id} className="history-card">
                      <h4 className="history-habit-name">{habit.name}</h4>
                      <div className="history-stats">
                        <div className="history-stat">
                          <span className="stat-label">Completion Rate: </span>
                          <span className="stat-value">{habit.completionPercentage}%</span>
                        </div>
                        <div className="history-calendar">
                          {habit.completionHistory.map((day, index) => (
                            <CalendarDayCard key={index} date={day.date} completed={day.completed} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="pagination flex justify-center items-center gap-4 mt-6">
            <button
              className="btn-secondary"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Prev
            </button>
            <span>{page + 1} of {totalPages}</span>
            <button
              className="btn-secondary"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryPage; 