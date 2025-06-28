const fs = require('fs/promises');
const path = require('path');
const HabitRepository = require('./HabitRepository');
const Habit = require('../models/Habit');

/**
 * File-based implementation of HabitRepository
 * Stores habits in a JSON file for persistence
 */
class FileHabitRepository extends HabitRepository {
  constructor(filePath = 'habits.json') {
    super();
    this.filePath = path.resolve(filePath);
    this.habits = new Map();
    this.nextId = 1;
  }

  /**
   * Initialize the repository by loading data from file
   */
  async initialize() {
    try {
      await this.loadFromFile();
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, start with empty data
        console.log('No existing habits file found, starting fresh');
        await this.saveToFile();
      } else {
        throw error;
      }
    }
  }

  /**
   * Load habits from JSON file
   */
  async loadFromFile() {
    const data = await fs.readFile(this.filePath, 'utf8');
    const habitsData = JSON.parse(data);
    
    this.habits.clear();
    this.nextId = 1;

    if (habitsData.habits && Array.isArray(habitsData.habits)) {
      habitsData.habits.forEach(habitData => {
        const habit = Habit.fromJSON(habitData);
        this.habits.set(habit.id, habit);
        
        // Update nextId to be higher than any existing ID
        const idNum = parseInt(habit.id);
        if (idNum >= this.nextId) {
          this.nextId = idNum + 1;
        }
      });
    }
  }

  /**
   * Save habits to JSON file
   */
  async saveToFile() {
    const data = {
      habits: Array.from(this.habits.values()).map(habit => habit.toJSON()),
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    await this.initialize();
    return Array.from(this.habits.values()).map(habit => habit.toJSON());
  }

  async getById(id) {
    await this.initialize();
    const habit = this.habits.get(id);
    return habit ? habit.toJSON() : null;
  }

  async create(habitData) {
    await this.initialize();
    
    const id = this.nextId.toString();
    this.nextId++;

    const habit = new Habit(
      id,
      habitData.name,
      habitData.description || '',
      new Date()
    );

    this.habits.set(id, habit);
    await this.saveToFile();
    return habit.toJSON();
  }

  async update(id, habitData) {
    await this.initialize();
    
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

    await this.saveToFile();
    return habit.toJSON();
  }

  async delete(id) {
    await this.initialize();
    
    const deleted = this.habits.delete(id);
    if (deleted) {
      await this.saveToFile();
    }
    return deleted;
  }

  async toggleCompleteForToday(id) {
    await this.initialize();
    
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

    await this.saveToFile();
    return habit.toJSON();
  }

  async markCompletedForToday(id) {
    await this.initialize();
    
    const habit = this.habits.get(id);
    if (!habit) {
      return null;
    }

    habit.markCompleted(new Date());
    await this.saveToFile();
    return habit.toJSON();
  }

  async markNotCompletedForToday(id) {
    await this.initialize();
    
    const habit = this.habits.get(id);
    if (!habit) {
      return null;
    }

    habit.markNotCompleted(new Date());
    await this.saveToFile();
    return habit.toJSON();
  }

  async getAllWithTodayStatus() {
    await this.initialize();
    
    const today = new Date();
    return Array.from(this.habits.values()).map(habit => {
      const habitData = habit.toJSON();
      habitData.isCompletedToday = habit.isCompletedForDate(today);
      return habitData;
    });
  }

  /**
   * Get completion statistics
   * @returns {Promise<Object>} Statistics about habit completion
   */
  async getStatistics() {
    await this.initialize();
    
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
   * Backup current data
   * @param {string} backupPath - Path for backup file
   */
  async backup(backupPath) {
    await this.initialize();
    const data = {
      habits: Array.from(this.habits.values()).map(habit => habit.toJSON()),
      lastUpdated: new Date().toISOString(),
      backupCreated: new Date().toISOString()
    };

    await fs.writeFile(backupPath, JSON.stringify(data, null, 2), 'utf8');
  }

  /**
   * Restore from backup file
   * @param {string} backupPath - Path to backup file
   */
  async restore(backupPath) {
    const data = await fs.readFile(backupPath, 'utf8');
    const backupData = JSON.parse(data);
    
    this.habits.clear();
    this.nextId = 1;

    if (backupData.habits && Array.isArray(backupData.habits)) {
      backupData.habits.forEach(habitData => {
        const habit = Habit.fromJSON(habitData);
        this.habits.set(habit.id, habit);
        
        const idNum = parseInt(habit.id);
        if (idNum >= this.nextId) {
          this.nextId = idNum + 1;
        }
      });
    }

    await this.saveToFile();
  }
}

module.exports = FileHabitRepository; 