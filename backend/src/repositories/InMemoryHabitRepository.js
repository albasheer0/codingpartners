const HabitRepository = require('./HabitRepository');
const Habit = require('../models/Habit');

/**
 * In-memory implementation of HabitRepository
 * Stores habits in memory using a Map for fast access
 */
class InMemoryHabitRepository extends HabitRepository {
  constructor() {
    super();
    this.habits = new Map();
    this.nextId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  /**
   * Initialize with sample habits for demonstration
   */
  initializeSampleData() {
    const sampleHabits = [
      { name: 'Morning Exercise', description: '30 minutes of cardio or strength training' },
      { name: 'Read Books', description: 'Read at least 20 pages daily' },
      { name: 'Drink Water', description: 'Drink 8 glasses of water' },
      { name: 'Meditation', description: '10 minutes of mindfulness practice' },
      { name: 'Sleep Early', description: 'Go to bed before 11 PM' },
      { name: 'Healthy Breakfast', description: 'Eat a balanced breakfast with protein and fiber' },
      { name: 'Stretching', description: '5–10 minutes of stretching in the morning' }
    ];

    sampleHabits.forEach(habitData => {
      this.create(habitData);
    });

    // Mark some habits as completed for demonstration
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Mark first two habits as completed for today and yesterday
    const habitIds = Array.from(this.habits.keys()).slice(0, 2);
    habitIds.forEach(id => {
      const habit = this.habits.get(id);
      habit.markCompleted(today);
      habit.markCompleted(yesterday);
    });
  }

  async getAll(limit, offset) {
    const allHabits = Array.from(this.habits.values()).map(habit => habit.toJSON()).reverse();
    const total = allHabits.length;
    const paginated = typeof limit === 'number' && typeof offset === 'number'
      ? allHabits.slice(offset, offset + limit)
      : allHabits;
    return { habits: paginated, total };
  }

  async getById(id) {
    const habit = this.habits.get(id);
    return habit ? habit.toJSON() : null;
  }

  async create(habitData) {
    const id = this.nextId.toString();
    this.nextId++;

    const habit = new Habit(
      id,
      habitData.name,
      habitData.description || '',
      new Date()
    );

    this.habits.set(id, habit);
    return habit.toJSON();
  }

  async update(id, habitData) {
    const habit = this.habits.get(id);
    if (!habit) {
      return null;
    }

    if (habitData.name !== undefined) {
      habit.name = habitData.name;
    }
    if (habitData.description !== undefined) {
      habit.description = habitData.description;
    }

    return habit.toJSON();
  }

  async delete(id) {
    const deleted = this.habits.delete(id);
    return deleted;
  }

  async toggleCompleteForToday(id) {
    const habit = this.habits.get(id);
    if (!habit) {
      return null;
    }

    const today = new Date();
    if (habit.isCompletedForDate(today)) {
      habit.markNotCompleted(today);
    } else {
      habit.markCompleted(today);
    }

    return habit.toJSON();
  }

  async markCompletedForToday(id) {
    const habit = this.habits.get(id);
    if (!habit) {
      return null;
    }

    habit.markCompleted(new Date());
    return habit.toJSON();
  }

  async markNotCompletedForToday(id) {
    const habit = this.habits.get(id);
    if (!habit) {
      return null;
    }

    habit.markNotCompleted(new Date());
    return habit.toJSON();
  }

  async getAllWithTodayStatus(limit, offset) {
    const today = new Date();
    const allHabits = Array.from(this.habits.values()).map(habit => {
      const habitData = habit.toJSON();
      habitData.isCompletedToday = habit.isCompletedForDate(today);
      return habitData;
    }).reverse();
    const total = allHabits.length;
    const paginated = typeof limit === 'number' && typeof offset === 'number'
      ? allHabits.slice(offset, offset + limit)
      : allHabits;
    return { habits: paginated, total };
  }

  /**
   * Get completion statistics
   * @returns {Promise<Object>} Statistics about habit completion
   */
  async getStatistics() {
    const habits = Array.from(this.habits.values());
    const today = new Date();
    
    const stats = {
      totalHabits: habits.length,
      completedToday: habits.filter(h => h.isCompletedForDate(today)).length,
      totalCompletions: habits.reduce((sum, h) => sum + h.completedDates.length, 0),
      averageStreak: habits.length > 0 
        ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
        : 0,
      bestStreak: Math.max(...habits.map(h => h.streak), 0)
    };

    return stats;
  }

  /**
   * Clear all data (useful for testing)
   */
  clear() {
    this.habits.clear();
    this.nextId = 1;
  }

  async getSummary() {
    const habits = Array.from(this.habits.values());
    const totalHabits = habits.length;
    const today = new Date();
    const completedToday = habits.filter(h => h.isCompletedForDate(today)).length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    return { totalHabits, completedToday, completionRate };
  }

  async getAllIdName() {
    return Array.from(this.habits.values()).map(habit => {
      const h = habit.toJSON();
      return { id: h.id, name: h.name };
    });
  }
}

module.exports = InMemoryHabitRepository; 