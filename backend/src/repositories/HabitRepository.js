/**
 * Interface for Habit data access operations
 * This defines the contract that all habit repositories must implement
 */
class HabitRepository {
  /**
   * Get all habits
   * @returns {Promise<Array>} Array of habit objects
   */
  async getAll() {
    throw new Error('getAll method must be implemented');
  }

  /**
   * Get a habit by ID
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Habit object or null if not found
   */
  async getById(id) {
    throw new Error('getById method must be implemented');
  }

  /**
   * Create a new habit
   * @param {Object} habitData - Habit data (name, description)
   * @returns {Promise<Object>} Created habit object
   */
  async create(habitData) {
    throw new Error('create method must be implemented');
  }

  /**
   * Update a habit
   * @param {string} id - The habit ID
   * @param {Object} habitData - Updated habit data
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async update(id, habitData) {
    throw new Error('update method must be implemented');
  }

  /**
   * Delete a habit
   * @param {string} id - The habit ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    throw new Error('delete method must be implemented');
  }

  /**
   * Toggle completion status for today
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async toggleCompleteForToday(id) {
    throw new Error('toggleCompleteForToday method must be implemented');
  }

  /**
   * Mark habit as completed for today
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async markCompletedForToday(id) {
    throw new Error('markCompletedForToday method must be implemented');
  }

  /**
   * Mark habit as not completed for today
   * @param {string} id - The habit ID
   * @returns {Promise<Object|null>} Updated habit object or null if not found
   */
  async markNotCompletedForToday(id) {
    throw new Error('markNotCompletedForToday method must be implemented');
  }

  /**
   * Get habits with their completion status for today
   * @returns {Promise<Array>} Array of habit objects with today's completion status
   */
  async getAllWithTodayStatus() {
    throw new Error('getAllWithTodayStatus method must be implemented');
  }
}

module.exports = HabitRepository; 