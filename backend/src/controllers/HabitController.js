/**
 * Controller for handling habit-related HTTP requests
 * Uses the service layer for business logic
 */
class HabitController {
  constructor(habitService) {
    this.habitService = habitService;
  }

  /**
   * Get all habits
   * GET /habits
   */
  async getAllHabits(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 9;
      const offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const { habits, total } = await this.habitService.getAllHabitsWithTodayStatus(limit, offset);
      res.json({
        success: true,
        data: habits,
        total,
        message: 'Habits retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting habits:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to retrieve habits'
      });
    }
  }

  /**
   * Get a habit by ID
   * GET /habits/:id
   */
  async getHabitById(req, res) {
    try {
      const { id } = req.params;
      const habit = await this.habitService.getHabitById(id);
      
      if (!habit) {
        return res.status(404).json({
          success: false,
          error: 'Habit not found',
          message: 'Habit with the specified ID was not found'
        });
      }

      res.json({
        success: true,
        data: habit,
        message: 'Habit retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting habit:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to retrieve habit'
      });
    }
  }

  /**
   * Create a new habit
   * POST /habits
   */
  async createHabit(req, res) {
    try {
      const { name, description } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Habit name is required'
        });
      }

      const habit = await this.habitService.createHabit({ name, description });
      
      res.status(201).json({
        success: true,
        data: habit,
        message: 'Habit created successfully'
      });
    } catch (error) {
      console.error('Error creating habit:', error);
      
      if (error.message.includes('Validation error') || error.message.includes('required')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          message: 'Invalid habit data'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to create habit'
      });
    }
  }

  /**
   * Update a habit
   * PUT /habits/:id
   */
  async updateHabit(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const habit = await this.habitService.updateHabit(id, { name, description });
      
      res.json({
        success: true,
        data: habit,
        message: 'Habit updated successfully'
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
          message: 'Habit not found'
        });
      }

      if (error.message.includes('Validation error') || error.message.includes('required')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          message: 'Invalid habit data'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to update habit'
      });
    }
  }

  /**
   * Delete a habit
   * DELETE /habits/:id
   */
  async deleteHabit(req, res) {
    try {
      const { id } = req.params;
      await this.habitService.deleteHabit(id);
      
      res.json({
        success: true,
        message: 'Habit deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
          message: 'Habit not found'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to delete habit'
      });
    }
  }

  /**
   * Toggle habit completion for today
   * PATCH /habits/:id/toggle
   */
  async toggleHabitForToday(req, res) {
    try {
      const { id } = req.params;
      const habit = await this.habitService.toggleHabitForToday(id);
      
      res.json({
        success: true,
        data: habit,
        message: 'Habit toggled successfully'
      });
    } catch (error) {
      console.error('Error toggling habit:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
          message: 'Habit not found'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to toggle habit'
      });
    }
  }

  /**
   * Mark habit as completed for today
   * PATCH /habits/:id/complete
   */
  async markHabitCompletedForToday(req, res) {
    try {
      const { id } = req.params;
      const habit = await this.habitService.markHabitCompletedForToday(id);
      
      res.json({
        success: true,
        data: habit,
        message: 'Habit marked as completed'
      });
    } catch (error) {
      console.error('Error marking habit as completed:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
          message: 'Habit not found'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to mark habit as completed'
      });
    }
  }

  /**
   * Mark habit as not completed for today
   * PATCH /habits/:id/uncomplete
   */
  async markHabitNotCompletedForToday(req, res) {
    try {
      const { id } = req.params;
      const habit = await this.habitService.markHabitNotCompletedForToday(id);
      
      res.json({
        success: true,
        data: habit,
        message: 'Habit marked as not completed'
      });
    } catch (error) {
      console.error('Error marking habit as not completed:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
          message: 'Habit not found'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to mark habit as not completed'
      });
    }
  }

  /**
   * Get habit statistics
   * GET /habits/stats/statistics
   */
  async getStatistics(req, res) {
    try {
      const stats = await this.habitService.getStatistics();
      
      res.json({
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to retrieve statistics'
      });
    }
  }

  /**
   * Get habits with completion history
   * GET /habits/history
   */
  async getHabitsWithHistory(req, res) {
    try {
      const { days = 7, limit, offset, habitId } = req.query;
      const parsedLimit = limit ? parseInt(limit) : undefined;
      const parsedOffset = offset ? parseInt(offset) : undefined;
      const { habits, total } = await this.habitService.getHabitsWithHistory(parseInt(days), parsedLimit, parsedOffset, habitId);
      res.json({
        success: true,
        data: habits,
        total,
        message: 'Habits with history retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting habits with history:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to retrieve habits with history'
      });
    }
  }

  /**
   * Get summary of all habits
   * GET /habits/summary
   */
  async getSummary(req, res) {
    try {
      const summary = await this.habitService.getSummary();
      res.json({
        success: true,
        data: summary,
        message: 'Habit summary retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting habit summary:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to retrieve habit summary'
      });
    }
  }

  /**
   * Get all habits (id and name only)
   * GET /habits/list
   */
  async getAllIdName(req, res) {
    try {
      const habits = await this.habitService.getAllIdName();
      res.json({ success: true, data: habits });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = HabitController; 