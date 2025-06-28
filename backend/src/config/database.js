const InMemoryHabitRepository = require('../repositories/InMemoryHabitRepository');
const FileHabitRepository = require('../repositories/FileHabitRepository');

/**
 * Database configuration and dependency injection setup
 * Handles repository selection based on environment variables
 */
class DatabaseConfig {
  constructor() {
    this.repositoryType = process.env.REPOSITORY_TYPE || 'memory';
    this.filePath = process.env.HABITS_FILE_PATH || 'habits.json';
  }

  /**
   * Get the appropriate repository based on configuration
   * @returns {Promise<Object>} Repository instance
   */
  async getRepository() {
    switch (this.repositoryType.toLowerCase()) {
      case 'file':
        console.log('Using FileHabitRepository with file:', this.filePath);
        const fileRepo = new FileHabitRepository(this.filePath);
        await fileRepo.initialize();
        return fileRepo;
      
      case 'memory':
      default:
        console.log('Using InMemoryHabitRepository');
        return new InMemoryHabitRepository();
    }
  }

  /**
   * Get repository type for logging/debugging
   * @returns {string} Repository type
   */
  getRepositoryType() {
    return this.repositoryType;
  }

  /**
   * Get file path for file repository
   * @returns {string} File path
   */
  getFilePath() {
    return this.filePath;
  }

  /**
   * Validate configuration
   * @returns {boolean} True if configuration is valid
   */
  isValid() {
    const validTypes = ['memory', 'file'];
    return validTypes.includes(this.repositoryType.toLowerCase());
  }

  /**
   * Get configuration summary
   * @returns {Object} Configuration details
   */
  getConfig() {
    return {
      repositoryType: this.repositoryType,
      filePath: this.filePath,
      isValid: this.isValid()
    };
  }
}

module.exports = DatabaseConfig; 