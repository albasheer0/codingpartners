import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { habitAPI } from '../services/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  habits: [],
  totalHabits: 0,
  statistics: null,
  history: [],
  totalHistory: 0,
  summary: { totalHabits: 0, completedToday: 0, completionRate: 0 },
  loading: false,
  error: null,
  selectedHabit: null,
  showCreateModal: false,
  showEditModal: false,
  showHistoryModal: false,
  showStatsModal: false
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_HABITS: 'SET_HABITS',
  ADD_HABIT: 'ADD_HABIT',
  UPDATE_HABIT: 'UPDATE_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  TOGGLE_HABIT: 'TOGGLE_HABIT',
  SET_STATISTICS: 'SET_STATISTICS',
  SET_HISTORY: 'SET_HISTORY',
  SET_SELECTED_HABIT: 'SET_SELECTED_HABIT',
  SHOW_CREATE_MODAL: 'SHOW_CREATE_MODAL',
  HIDE_CREATE_MODAL: 'HIDE_CREATE_MODAL',
  SHOW_EDIT_MODAL: 'SHOW_EDIT_MODAL',
  HIDE_EDIT_MODAL: 'HIDE_EDIT_MODAL',
  SHOW_HISTORY_MODAL: 'SHOW_HISTORY_MODAL',
  HIDE_HISTORY_MODAL: 'HIDE_HISTORY_MODAL',
  SHOW_STATS_MODAL: 'SHOW_STATS_MODAL',
  HIDE_STATS_MODAL: 'HIDE_STATS_MODAL',
  SET_SUMMARY: 'SET_SUMMARY'
};

// Reducer function
const habitReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_HABITS:
      return { ...state, habits: action.payload.habits, totalHabits: action.payload.total, loading: false, error: null };
    
    case ACTIONS.ADD_HABIT:
      return { 
        ...state, 
        habits: [...state.habits, action.payload],
        loading: false,
        error: null
      };
    
    case ACTIONS.UPDATE_HABIT:
      return {
        ...state,
        habits: state.habits.map(habit => 
          habit.id === action.payload.id ? action.payload : habit
        ),
        loading: false,
        error: null
      };
    
    case ACTIONS.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        loading: false,
        error: null
      };
    
    case ACTIONS.TOGGLE_HABIT:
      return {
        ...state,
        habits: state.habits.map(habit => 
          habit.id === action.payload.id ? action.payload : habit
        ),
      };
    
    case ACTIONS.SET_STATISTICS:
      return { ...state, statistics: action.payload, loading: false, error: null };
    
    case ACTIONS.SET_HISTORY:
      return { ...state, history: action.payload.habits, totalHistory: action.payload.total, loading: false, error: null };
    
    case ACTIONS.SET_SELECTED_HABIT:
      return { ...state, selectedHabit: action.payload };
    
    case ACTIONS.SHOW_CREATE_MODAL:
      return { ...state, showCreateModal: true };
    
    case ACTIONS.HIDE_CREATE_MODAL:
      return { ...state, showCreateModal: false };
    
    case ACTIONS.SHOW_EDIT_MODAL:
      return { ...state, showEditModal: true, selectedHabit: action.payload };
    
    case ACTIONS.HIDE_EDIT_MODAL:
      return { ...state, showEditModal: false, selectedHabit: null };
    
    case ACTIONS.SHOW_HISTORY_MODAL:
      return { ...state, showHistoryModal: true };
    
    case ACTIONS.HIDE_HISTORY_MODAL:
      return { ...state, showHistoryModal: false };
    
    case ACTIONS.SHOW_STATS_MODAL:
      return { ...state, showStatsModal: true };
    
    case ACTIONS.HIDE_STATS_MODAL:
      return { ...state, showStatsModal: false };
    
    case ACTIONS.SET_SUMMARY:
      return { ...state, summary: action.payload };
    
    default:
      return state;
  }
};

// Create context
const HabitContext = createContext();

// Provider component
export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load all habits (paginated)
  const loadHabits = useCallback(async (limit, offset) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await habitAPI.getAll(limit, offset);
      dispatch({ type: ACTIONS.SET_HABITS, payload: { habits: response.data, total: response.total } });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error('Failed to load habits');
    }
  }, []);

  // Load habits on component mount
  useEffect(() => {
    loadHabits(10, 0);
  }, [loadHabits]);

  // Load summary
  const loadSummary = useCallback(async () => {
    try {
      const response = await habitAPI.getSummary();
      dispatch({ type: ACTIONS.SET_SUMMARY, payload: response.data });
    } catch (error) {
      // Optionally handle error
    }
  }, []);

  // Load summary on mount
  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Create a new habit
  const createHabit = useCallback(async (habitData, page, pageSize) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await habitAPI.create(habitData);
      dispatch({ type: ACTIONS.ADD_HABIT, payload: response.data });
      dispatch({ type: ACTIONS.HIDE_CREATE_MODAL });
      toast.success('Habit created successfully!');
      await loadHabits(pageSize, page * pageSize);
      await loadSummary();
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message || 'Failed to create habit');
      throw error;
    }
  }, [loadHabits, loadSummary]);

  // Update a habit
  const updateHabit = useCallback(async (id, habitData, page, pageSize) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await habitAPI.update(id, habitData);
      dispatch({ type: ACTIONS.UPDATE_HABIT, payload: response.data });
      dispatch({ type: ACTIONS.HIDE_EDIT_MODAL });
      toast.success('Habit updated successfully!');
      await loadHabits(pageSize, page * pageSize);
      await loadSummary();
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message || 'Failed to update habit');
      throw error;
    }
  }, [loadHabits, loadSummary]);

  // Delete a habit
  const deleteHabit = useCallback(async (id, page, pageSize) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      await habitAPI.delete(id);
      dispatch({ type: ACTIONS.DELETE_HABIT, payload: id });
      toast.success('Habit deleted successfully!');
      await loadHabits(pageSize, page * pageSize);
      await loadSummary();
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message || 'Failed to delete habit');
      throw error;
    }
  }, [loadHabits, loadSummary]);

  // Toggle habit completion for today
  const toggleHabit = useCallback(async (id) => {
    // Find the habit to optimistically update
    const habit = state.habits.find(h => h.id === id);
    if (!habit) return;
    // Optimistically update isCompletedToday and streak/lastCompletedDate if needed
    const optimisticHabit = {
      ...habit,
      isCompletedToday: !habit.isCompletedToday,
      streak: !habit.isCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
      lastCompletedDate: !habit.isCompletedToday ? new Date().toISOString() : habit.lastCompletedDate
    };
    dispatch({ type: ACTIONS.TOGGLE_HABIT, payload: optimisticHabit });
    
    // Also update selectedHabit if it's the same habit
    if (state.selectedHabit && state.selectedHabit.id === id) {
      dispatch({ type: ACTIONS.SET_SELECTED_HABIT, payload: optimisticHabit });
    }
    
    try {
      const response = await habitAPI.toggleForToday(id);
      const updatedHabit = response.data;
      dispatch({ type: ACTIONS.TOGGLE_HABIT, payload: updatedHabit });
      
      // Update selectedHabit with the real data from server
      if (state.selectedHabit && state.selectedHabit.id === id) {
        dispatch({ type: ACTIONS.SET_SELECTED_HABIT, payload: updatedHabit });
      }
      
      await loadSummary();
      const isCompleted = updatedHabit.isCompletedToday;
      if (isCompleted) {
        toast.success(`Great job! "${updatedHabit.name}" completed! 🎉`);
      } else {
        toast('Habit unchecked', { icon: '📝' });
      }
      return updatedHabit;
    } catch (error) {
      // Revert optimistic update
      dispatch({ type: ACTIONS.TOGGLE_HABIT, payload: habit });
      
      // Revert selectedHabit if it was updated
      if (state.selectedHabit && state.selectedHabit.id === id) {
        dispatch({ type: ACTIONS.SET_SELECTED_HABIT, payload: habit });
      }
      
      toast.error(error.message || 'Failed to toggle habit');
      throw error;
    }
  }, [state.habits, state.selectedHabit, loadSummary]);

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await habitAPI.getStatistics();
      dispatch({ type: ACTIONS.SET_STATISTICS, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error('Failed to load statistics');
      throw error;
    }
  }, []);

  // Load history (paginated)
  const loadHistory = useCallback(async (days = 7, limit, offset) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await habitAPI.getHistory(days, limit, offset);
      dispatch({ type: ACTIONS.SET_HISTORY, payload: { habits: response.data, total: response.total } });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      toast.error('Failed to load history');
    }
  }, []);

  // Modal actions
  const openCreateModal = useCallback(() => {
    dispatch({ type: ACTIONS.SHOW_CREATE_MODAL });
  }, []);

  const closeCreateModal = useCallback(() => {
    dispatch({ type: ACTIONS.HIDE_CREATE_MODAL });
  }, []);

  const showEditModal = useCallback((habit) => {
    dispatch({ type: ACTIONS.SHOW_EDIT_MODAL, payload: habit });
  }, []);

  const hideEditModal = useCallback(() => {
    dispatch({ type: ACTIONS.HIDE_EDIT_MODAL });
  }, []);

  const showHistoryModal = useCallback(() => {
    dispatch({ type: ACTIONS.SHOW_HISTORY_MODAL });
  }, []);

  const hideHistoryModal = useCallback(() => {
    dispatch({ type: ACTIONS.HIDE_HISTORY_MODAL });
  }, []);

  const openStatsModal = useCallback(() => {
    dispatch({ type: ACTIONS.SHOW_STATS_MODAL });
  }, []);

  const closeStatsModal = useCallback(() => {
    dispatch({ type: ACTIONS.HIDE_STATS_MODAL });
  }, []);

  // Context value
  const value = {
    ...state,
    loadHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    loadStatistics,
    loadHistory,
    loadSummary,
    openCreateModal,
    closeCreateModal,
    showEditModal,
    hideEditModal,
    showHistoryModal,
    hideHistoryModal,
    openStatsModal,
    closeStatsModal
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to use the habit context
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}; 