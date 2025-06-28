import React from 'react';
import { Check, Edit, Trash2, Flame, Calendar } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';

const HabitCard = ({ habit, onDelete }) => {
  const { toggleHabit, deleteHabit: contextDeleteHabit, showEditModal } = useHabits();

  const handleToggle = async () => {
    try {
      await toggleHabit(habit.id);
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  const handleEdit = () => {
    showEditModal(habit);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      try {
        if (onDelete) {
          await onDelete(habit.id);
        } else {
          await contextDeleteHabit(habit.id);
        }
      } catch (error) {
        console.error('Failed to delete habit:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    if (streak >= 1) return '✨';
    return '💪';
  };

  return (
    <div className={`habit-card ${habit.isCompletedToday ? 'completed' : ''} fade-in`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mb-2">
              {habit.description}
            </p>
          )}
        </div>
        
        {/* Completion Toggle */}
        <button
          onClick={handleToggle}
          className={`completion-indicator ${habit.isCompletedToday ? 'completed' : ''} ml-3`}
          title={habit.isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {habit.isCompletedToday && <Check size={16} />}
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          {/* Streak */}
          <div className="flex items-center space-x-1">
            <Flame size={14} className="text-orange-500" />
            <span className="streak-badge">
              {getStreakEmoji(habit.streak)} {habit.streak} day{habit.streak !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Last Completed */}
          <div className="flex items-center space-x-1">
            <Calendar size={14} className="text-blue-500" />
            <span>Last: {formatDate(habit.lastCompletedDate)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
        <button
          onClick={handleEdit}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          title="Edit habit"
        >
          <Edit size={16} />
        </button>
        
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="Delete habit"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Completion Status */}
      {habit.isCompletedToday && (
        <div className="absolute top-2 right-2">
          <div className="bg-success-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            ✓ Today
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard; 