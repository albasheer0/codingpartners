const express = require('express');
const router = express.Router();

/**
 * Habit routes
 * All routes are prefixed with /habits
 */

// Middleware to ensure controller is available
const ensureController = (req, res, next) => {
  if (!req.app.locals.habitController) {
    return res.status(500).json({
      success: false,
      error: 'Controller not initialized',
      message: 'Server configuration error'
    });
  }
  next();
};

// Apply controller middleware to all routes
router.use(ensureController);

// GET /habits - Get all habits
router.get('/', (req, res) => {
  req.app.locals.habitController.getAllHabits(req, res);
});

// GET /habits/stats/statistics - Get habit statistics
router.get('/stats/statistics', (req, res) => {
  req.app.locals.habitController.getStatistics(req, res);
});

// GET /habits/history - Get habits with completion history
router.get('/history', (req, res) => {
  req.app.locals.habitController.getHabitsWithHistory(req, res);
});

// GET /habits/summary - Get summary of all habits
router.get('/summary', (req, res) => {
  req.app.locals.habitController.getSummary(req, res);
});

// GET /habits/list - Get all habits (id and name only)
router.get('/list', (req, res) => {
  req.app.locals.habitController.getAllIdName(req, res);
});

// GET /habits/:id - Get a specific habit
router.get('/:id', (req, res) => {
  req.app.locals.habitController.getHabitById(req, res);
});

// POST /habits - Create a new habit
router.post('/', (req, res) => {
  req.app.locals.habitController.createHabit(req, res);
});

// PUT /habits/:id - Update a habit
router.put('/:id', (req, res) => {
  req.app.locals.habitController.updateHabit(req, res);
});

// DELETE /habits/:id - Delete a habit
router.delete('/:id', (req, res) => {
  req.app.locals.habitController.deleteHabit(req, res);
});

// PATCH /habits/:id/toggle - Toggle habit completion for today
router.patch('/:id/toggle', (req, res) => {
  req.app.locals.habitController.toggleHabitForToday(req, res);
});

// PATCH /habits/:id/complete - Mark habit as completed for today
router.patch('/:id/complete', (req, res) => {
  req.app.locals.habitController.markHabitCompletedForToday(req, res);
});

// PATCH /habits/:id/uncomplete - Mark habit as not completed for today
router.patch('/:id/uncomplete', (req, res) => {
  req.app.locals.habitController.markHabitNotCompletedForToday(req, res);
});

module.exports = router; 