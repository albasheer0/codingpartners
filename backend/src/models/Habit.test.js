const Habit = require('./Habit');

describe('Habit Model', () => {
  let habit;

  beforeEach(() => {
    habit = new Habit('1', 'Test Habit', 'Test Description');
  });

  test('should create a habit with correct properties', () => {
    expect(habit.id).toBe('1');
    expect(habit.name).toBe('Test Habit');
    expect(habit.description).toBe('Test Description');
    expect(habit.completedDates).toEqual([]);
    expect(habit.streak).toBe(0);
    expect(habit.lastCompletedDate).toBeNull();
  });

  test('should mark habit as completed for a date', () => {
    const testDate = new Date('2024-01-01');
    habit.markCompleted(testDate);
    
    expect(habit.completedDates).toContain('2024-01-01');
    expect(habit.lastCompletedDate).toBe('2024-01-01');
  });

  test('should not add duplicate completion dates', () => {
    const testDate = new Date('2024-01-01');
    habit.markCompleted(testDate);
    habit.markCompleted(testDate);
    
    expect(habit.completedDates).toHaveLength(1);
    expect(habit.completedDates).toContain('2024-01-01');
  });

  test('should mark habit as not completed for a date', () => {
    const testDate = new Date('2024-01-01');
    habit.markCompleted(testDate);
    habit.markNotCompleted(testDate);
    
    expect(habit.completedDates).not.toContain('2024-01-01');
    expect(habit.completedDates).toHaveLength(0);
  });

  test('should check if habit is completed for a date', () => {
    const testDate = new Date('2024-01-01');
    expect(habit.isCompletedForDate(testDate)).toBe(false);
    
    habit.markCompleted(testDate);
    expect(habit.isCompletedForDate(testDate)).toBe(true);
  });

  test('should calculate streak correctly', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Mark as completed for today and yesterday
    habit.markCompleted(today);
    habit.markCompleted(yesterday);
    
    expect(habit.streak).toBe(2);
  });

  test('should get completion history', () => {
    const history = habit.getCompletionHistory(7);
    expect(history).toHaveLength(7);
    expect(history[0]).toHaveProperty('date');
    expect(history[0]).toHaveProperty('completed');
  });

  test('should calculate completion percentage', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    habit.markCompleted(today);
    habit.markCompleted(yesterday);
    
    const percentage = habit.getCompletionPercentage(7);
    expect(percentage).toBe(29); // 2 out of 7 days = ~29%
  });

  test('should serialize to JSON correctly', () => {
    const json = habit.toJSON();
    expect(json).toHaveProperty('id', '1');
    expect(json).toHaveProperty('name', 'Test Habit');
    expect(json).toHaveProperty('description', 'Test Description');
    expect(json).toHaveProperty('completedDates');
    expect(json).toHaveProperty('streak');
    expect(json).toHaveProperty('lastCompletedDate');
  });

  test('should create from JSON correctly', () => {
    const habitData = {
      id: '2',
      name: 'Another Habit',
      description: 'Another Description',
      createdAt: new Date(),
      completedDates: ['2024-01-01'],
      streak: 1,
      lastCompletedDate: '2024-01-01'
    };
    
    const newHabit = Habit.fromJSON(habitData);
    expect(newHabit.id).toBe('2');
    expect(newHabit.name).toBe('Another Habit');
    expect(newHabit.completedDates).toContain('2024-01-01');
    expect(newHabit.streak).toBe(1);
  });
}); 