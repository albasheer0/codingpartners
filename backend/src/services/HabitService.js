/**
 * Service layer for habit business logic
 * Uses dependency injection to work with any repository implementation
 */
class HabitService {
  constructor(habitRepository) {
    this.habitRepository = habitRepository;
  }

  /**
   * Get all habits
   * @returns {Promise<Array>} Array of habit objects
   */
  async getAllHabits() {
    try {
      return await this.habitRepository.getAll();
    } catch (error) {
      throw new Error(`Failed to get habits: ${error.message}`);
    }
  }

  /**
   * Get all habits with today's completion status
   * @returns {Promise<Array>} Array of habit objects with today's status
   */
  async getAllHabitsWithTodayStatus(limit, offset) {
    return await this.habitRepository.getAllWithTodayStatus(limit, offset);
  }

  /**
   * Get a habit by ID
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Habit object or null if not found
   */
  async getHabitById(id) {
    try {
      if (!id) {
        throw new Error('Habit ID is required');
      }
      return await this.habitRepository.getById(id);
    } catch (error) {
      throw new Error(`Failed to get habit: ${error.message}`);
    }
  }

  /**
   * Create a new habit
   * @param {Object} habitData - Habit data (name, description)
   * @returns {Promise<Object>} Created habit object
   */
  async createHabit(habitData) {
    try {
      if (!habitData.name || habitData.name.trim() === '') {
        throw new Error('Habit name is required');
      }

      // Validate habit name length
      if (habitData.name.length > 100) {
        throw new Error('Habit name must be less than 100 characters');
      }

      // Validate description length
      if (habitData.description && habitData.description.length > 500) {
        throw new Error('Habit description must be less than 500 characters');
      }

      const habit = await this.habitRepository.create({
        name: habitData.name.trim(),
        description: habitData.description ? habitData.description.trim() : ''
      });

      return habit;
    } catch (error) {
      throw new Error(`Failed to create habit: ${error.message}`);
    }
  }

  /**
   * Update a habit
   * @param {string} id - The habit ID
   * @param {Object} habitData - Updated habit data
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async updateHabit(id, habitData) {
    try {
      if (!id) {
        throw new Error('Habit ID is required');
      }

      if (habitData.name !== undefined && habitData.name.trim() === '') {
        throw new Error('Habit name cannot be empty');
      }

      if (habitData.name && habitData.name.length > 100) {
        throw new Error('Habit name must be less than 100 characters');
      }

      if (habitData.description && habitData.description.length > 500) {
        throw new Error('Habit description must be less than 500 characters');
      }

      const updatedHabit = await this.habitRepository.update(id, {
        name: habitData.name ? habitData.name.trim() : undefined,
        description: habitData.description ? habitData.description.trim() : undefined
      });

      if (!updatedHabit) {
        throw new Error('Habit not found');
      }

      return updatedHabit;
    } catch (error) {
      throw new Error(`Failed to update habit: ${error.message}`);
    }
  }

  /**
   * Delete a habit
   * @param {string} id - The habit ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteHabit(id) {
    try {
      if (!id) {
        throw new Error('Habit ID is required');
      }

      const deleted = await this.habitRepository.delete(id);
      if (!deleted) {
        throw new Error('Habit not found');
      }

      return deleted;
    } catch (error) {
      throw new Error(`Failed to delete habit: ${error.message}`);
    }
  }

  /**
   * Toggle completion status for today
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async toggleHabitForToday(id) {
    try {
      if (!id) {
        throw new Error('Habit ID is required');
      }

      const updatedHabit = await this.habitRepository.toggleCompleteForToday(id);
      if (!updatedHabit) {
        throw new Error('Habit not found');
      }

      return updatedHabit;
    } catch (error) {
      throw new Error(`Failed to toggle habit: ${error.message}`);
    }
  }

  /**
   * Mark habit as completed for today
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async markHabitCompletedForToday(id) {
    try {
      if (!id) {
        throw new Error('Habit ID is required');
      }

      const updatedHabit = await this.habitRepository.markCompletedForToday(id);
      if (!updatedHabit) {
        throw new Error('Habit not found');
      }

      return updatedHabit;
    } catch (error) {
      throw new Error(`Failed to mark habit as completed: ${error.message}`);
    }
  }

  /**
   * Mark habit as not completed for today
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async markHabitNotCompletedForToday(id) {
    try {
      if (!id) {
        throw new Error('Habit ID is required');
      }

      const updatedHabit = await this.habitRepository.markNotCompletedForToday(id);
      if (!updatedHabit) {
        throw new Error('Habit not found');
      }

      return updatedHabit;
    } catch (error) {
      throw new Error(`Failed to mark habit as not completed: ${error.message}`);
    }
  }

  /**
   * Get habit statistics
   * @returns {Promise<Object>} Statistics about habit completion
   */
  async getStatistics() {
    try {
      return await this.habitRepository.getStatistics();
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  /**
   * Get habits with completion history
   * @param {number} days - Number of days to look back
   * @returns {Promise<Array>} Array of habits with completion history
   */
  async getHabitsWithHistory(days = 7, limit, offset, habitId) {
    const { habits, total } = await this.habitRepository.getAll(limit, offset);
    let filteredHabits = habits;
    if (habitId) {
      filteredHabits = habits.filter(h => h.id === habitId);
    }
    const result = filteredHabits.map(habit => {
      const habitInstance = require('../models/Habit').fromJSON(habit);
      return {
        ...habit,
        completionHistory: habitInstance.getCompletionHistory(days),
        completionPercentage: habitInstance.getCompletionPercentage(days)
      };
    });
    return { habits: result, total: habitId ? result.length : total };
  }

  async getSummary() {
    return await this.habitRepository.getSummary();
  }

  async getAllIdName() {
    return await this.habitRepository.getAllIdName();
  }
}

module.exports = HabitService; 