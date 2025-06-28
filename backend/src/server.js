const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const DatabaseConfig = require('./config/database');
const HabitService = require('./services/HabitService');
const HabitController = require('./controllers/HabitController');
const habitRoutes = require('./routes/habits');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.databaseConfig = new DatabaseConfig();
  }

  /**
   * Initialize middleware
   */
  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));
    
    // Request logging
    this.app.use(morgan('combined'));
    
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  /**
   * Initialize dependency injection
   */
  async initializeDependencies() {
    try {
      // Validate database configuration
      if (!this.databaseConfig.isValid()) {
        throw new Error('Invalid database configuration');
      }

      // Get repository instance
      const repository = await this.databaseConfig.getRepository();
      
      // Create service layer
      const habitService = new HabitService(repository);
      
      // Create controller
      const habitController = new HabitController(habitService);
      
      // Make controller available to routes
      this.app.locals.habitController = habitController;
      
      console.log('Dependencies initialized successfully');
      console.log('Database config:', this.databaseConfig.getConfig());
      
    } catch (error) {
      console.error('Failed to initialize dependencies:', error);
      process.exit(1);
    }
  }

  /**
   * Initialize routes
   */
  initializeRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        config: this.databaseConfig.getConfig()
      });
    });

    // API info endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'Habit Tracker API',
        version: '1.0.0',
        endpoints: {
          habits: '/api/habits',
          health: '/health'
        },
        documentation: {
          description: 'RESTful API for habit tracking',
          repositoryType: this.databaseConfig.getRepositoryType()
        }
      });
    });

    // Habit routes
    this.app.use('/api/habits', habitRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        availableEndpoints: [
          'GET /health',
          'GET /api',
          'GET /api/habits',
          'POST /api/habits',
          'GET /api/habits/:id',
          'PUT /api/habits/:id',
          'DELETE /api/habits/:id',
          'PATCH /api/habits/:id/toggle',
          'GET /api/habits/stats/statistics',
          'GET /api/habits/history'
        ]
      });
    });

    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    });
  }

  /**
   * Start the server
   */
  async start() {
    try {
      // Initialize middleware
      this.initializeMiddleware();
      
      // Initialize dependencies
      await this.initializeDependencies();
      
      // Initialize routes
      this.initializeRoutes();
      
      // Start listening
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`📚 API info: http://localhost:${this.port}/api`);
        console.log(`🎯 Habits API: http://localhost:${this.port}/api/habits`);
        console.log(`🔧 Repository type: ${this.databaseConfig.getRepositoryType()}`);
      });
      
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start();
}

module.exports = Server; 