import React, { useEffect, useState } from 'react';
import { X, BarChart3 } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import './StatisticsModal.css';

const StatisticsModal = () => {
  const { showStatsModal, closeStatsModal, loadStatistics, statistics, loading, habits } = useHabits();
  const [localStats, setLocalStats] = useState(null);

  useEffect(() => {
    if (showStatsModal) {
      loadStatistics();
    }
  }, [showStatsModal, loadStatistics]);

  useEffect(() => {
    if (statistics) {
      setLocalStats(statistics);
    }
  }, [statistics]);

  // Reload statistics when habits change (for real-time updates)
  useEffect(() => {
    if (showStatsModal && habits.length > 0) {
      loadStatistics();
    }
  }, [habits, showStatsModal, loadStatistics]);

  const handleClose = () => {
    closeStatsModal();
  };

  const calculateCompletionRate = () => {
    if (!localStats || localStats.totalHabits === 0) return 0;
    return Math.round((localStats.completedToday / localStats.totalHabits) * 100);
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    if (streak >= 1) return '✨';
    return '💪';
  };

  if (!showStatsModal) return null;

  return (
    <div className="stats-modal" onClick={handleClose}>
      <div className="stats-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="stats-header">
          <h2 className="stats-title">
            <BarChart3 size={24} />
            Habit Statistics
          </h2>
          <button className="stats-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="stats-body">
          {loading ? (
            <div className="stats-loading">
              <div className="stats-spinner"></div>
              Loading statistics...
            </div>
          ) : localStats ? (
            <>
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card info">
                  <span className="stat-values">{localStats.totalHabits}</span>
                  <span className="stat-labels">Total Habits</span>
                </div>
                
                <div className="stat-card success">
                  <span className="stat-values">{localStats.completedToday}</span>
                  <span className="stat-labels">Completed Today</span>
                </div>
                
                <div className="stat-card warning">
                  <span className="stat-values">{localStats.totalCompletions}</span>
                  <span className="stat-labels">Total Completions</span>
                </div>
                
                <div className="stat-card">
                  <span className="stat-values">{localStats.averageStreak}</span>
                  <span className="stat-labels">Avg. Streak</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="progress-section">
                <h3 className="progress-title">Today's Progress</h3>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${calculateCompletionRate()}%` }}
                  ></div>
                </div>
                <div className="progress-label">
                  <span>Completion Rate</span>
                  <span className="progress-percentage">{calculateCompletionRate()}%</span>
                </div>
              </div>

              {/* Streak Highlight */}
              {localStats.bestStreak > 0 && (
                <div className="streak-highlight">
                  <span className="streak-number">
                    {getStreakEmoji(localStats.bestStreak)} {localStats.bestStreak}
                  </span>
                  <span className="streak-text">Best Streak</span>
                </div>
              )}

              {/* Additional Insights */}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Insights
                </h4>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  {localStats.totalHabits > 0 ? (
                    <>
                      <p>• You have {localStats.totalHabits} active habits</p>
                      <p>• Completed {localStats.completedToday} out of {localStats.totalHabits} today</p>
                      <p>• Your best streak is {localStats.bestStreak} days</p>
                      <p>• Average streak across all habits: {localStats.averageStreak} days</p>
                      {localStats.completedToday === localStats.totalHabits && (
                        <p style={{ color: '#059669', fontWeight: '600' }}>
                          🎉 Perfect day! All habits completed!
                        </p>
                      )}
                    </>
                  ) : (
                    <p>No habits created yet. Start building your habits!</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="stats-loading">
              <div className="stats-spinner"></div>
              Loading statistics...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal; 