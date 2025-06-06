const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Register ts-node to handle TypeScript files
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
    declaration: false,
    outDir: './dist',
    rootDir: '.'
  }
});

require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8081', 'exp://192.168.1.100:8081'], // Expo dev server
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Import database service
const { DatabaseService } = require('../src/services/databaseService.ts');

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gothic D&D API is running' });
});

// Quest endpoints
app.get('/api/quests', async (req, res) => {
  try {
    const quests = await DatabaseService.getAllQuests();
    res.json({
      success: true,
      data: quests,
      message: 'Quests retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quests',
      error: error.message
    });
  }
});

// User endpoints
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await DatabaseService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't return password hash
    const { password_hash, ...safeUser } = user;
    
    res.json({
      success: true,
      data: safeUser,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// User profile data endpoint
app.get('/api/users/:id/profile', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const [
      user,
      preferences,
      battleRecord,
      achievements,
      collectionStats,
      completedQuests,
      userMiniatures
    ] = await Promise.all([
      DatabaseService.getUserById(userId),
      DatabaseService.getUserPreferences(userId),
      DatabaseService.getBattleRecord(userId),
      DatabaseService.getUserAchievements(userId),
      DatabaseService.getCollectionStats(userId),
      DatabaseService.getCompletedQuests(userId),
      DatabaseService.getUserMiniatures(userId)
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't return password hash
    const { password_hash, ...safeUser } = user;
    
    res.json({
      success: true,
      data: {
        user: safeUser,
        preferences,
        battleRecord,
        achievements,
        collectionStats,
        completedQuests,
        userMiniatures
      },
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
});

// Complete quest endpoint
app.post('/api/quests/:id/complete', async (req, res) => {
  try {
    const questId = parseInt(req.params.id);
    const userId = parseInt(req.body.userId); // In a real app, get this from JWT token
    
    await DatabaseService.completeQuest(userId, questId);
    
    res.json({
      success: true,
      message: 'Quest completed successfully'
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    
    if (error.message === 'Quest already completed') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to complete quest',
      error: error.message
    });
  }
});

// Miniatures endpoints
app.get('/api/miniatures', async (req, res) => {
  try {
    const miniatures = await DatabaseService.getAllMiniatures();
    res.json({
      success: true,
      data: miniatures,
      message: 'Miniatures retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching miniatures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch miniatures',
      error: error.message
    });
  }
});

// User collection endpoints
app.get('/api/collection/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userMiniatures = await DatabaseService.getUserMiniatures(userId);
    
    res.json({
      success: true,
      data: userMiniatures,
      message: 'User collection retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user collection:', error);
    res.status(500).json({
      success: false,  
      message: 'Failed to fetch user collection',
      error: error.message
    });
  }
});

// Update user preferences
app.put('/api/users/:id/preferences', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const preferences = req.body;
    
    await DatabaseService.updateUserPreferences(userId, preferences);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Gothic D&D API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 