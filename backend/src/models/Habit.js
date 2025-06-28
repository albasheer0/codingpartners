class Habit {
  constructor(id, name, description = '', createdAt = new Date()) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.completedDates = []; // Array of date strings (YYYY-MM-DD)
    this.streak = 0;
    this.lastCompletedDate = null;
  }

  // Mark habit as completed for a specific date
  markCompleted(date = new Date()) {
    const dateString = this.formatDate(date);
    
    if (!this.completedDates.includes(dateString)) {
      this.completedDates.push(dateString);
      this.completedDates.sort(); // Keep dates sorted
      this.lastCompletedDate = dateString;
      this.updateStreak();
    }
  }

  // Mark habit as not completed for a specific date
  markNotCompleted(date = new Date()) {
    const dateString = this.formatDate(date);
    const index = this.completedDates.indexOf(dateString);
    
    if (index > -1) {
      this.completedDates.splice(index, 1);
      this.updateStreak();
    }
  }

  // Check if habit is completed for a specific date
  isCompletedForDate(date = new Date()) {
    const dateString = this.formatDate(date);
    return this.completedDates.includes(dateString);
  }

  // Update streak count
  updateStreak() {
    if (this.completedDates.length === 0) {
      this.streak = 0;
      return;
    }

    const today = new Date();
    const todayString = this.formatDate(today);
    let streak = 0;
    let currentDate = new Date(today);

    // Check consecutive days backwards from today
    while (true) {
      const dateString = this.formatDate(currentDate);
      if (this.completedDates.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    this.streak = streak;
  }

  // Get completion history for the last N days
  getCompletionHistory(days = 7) {
    const history = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = this.formatDate(date);
      
      history.push({
        date: dateString,
        completed: this.completedDates.includes(dateString)
      });
    }
    
    return history;
  }

  // Format date to YYYY-MM-DD string
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // Get completion percentage for the last N days
  getCompletionPercentage(days = 7) {
    const history = this.getCompletionHistory(days);
    const completed = history.filter(day => day.completed).length;
    return Math.round((completed / days) * 100);
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      completedDates: this.completedDates,
      streak: this.streak,
      lastCompletedDate: this.lastCompletedDate,
      isCompletedToday: this.isCompletedForDate(new Date())
    };
  }

  // Create from plain object
  static fromJSON(data) {
    const habit = new Habit(data.id, data.name, data.description, data.createdAt);
    habit.completedDates = data.completedDates || [];
    habit.streak = data.streak || 0;
    habit.lastCompletedDate = data.lastCompletedDate;
    return habit;
  }
}

module.exports = Habit; 