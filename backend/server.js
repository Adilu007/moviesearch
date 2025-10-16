import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './src/routes/auth.js';
import movieRoutes from './src/routes/movies.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Movie Search Save App Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      movies: {
        search: 'GET /api/movies/search?title=<movie_title>',
        save: 'POST /api/movies/save',
        list: 'GET /api/movies/list',
        remove: 'DELETE /api/movies/remove/:imdbID'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}`);
      console.log(`📖 API Documentation at http://localhost:${PORT}`);
      console.log(`🏥 Health check at http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📋 Available Endpoints:');
        console.log('   POST /api/auth/register    - User registration');
        console.log('   POST /api/auth/login       - User login');
        console.log('   GET  /api/movies/search    - Search movies (protected)');
        console.log('   POST /api/movies/save      - Save movie (protected)');
        console.log('   GET  /api/movies/list      - Get saved movies (protected)');
        console.log('   DELETE /api/movies/remove/:imdbID - Remove movie (protected)');
        console.log('\n⚠️  Don\'t forget to:');
        console.log('   1. Install MongoDB and start it');
        console.log('   2. Get your OMDb API key from http://www.omdbapi.com/apikey.aspx');
        console.log('   3. Update the OMDB_API_KEY in your .env file');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('📦 Database connection closed');
    process.exit(0);
  });
});

// Start the server
startServer();