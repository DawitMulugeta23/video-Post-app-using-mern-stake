const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/video.routes');
const userRoutes = require('./routes/User.routes');

connectDB();

const app = express();

// ✅ FIXED: Proper CORS configuration for port 3000
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Your React app running on port 3000
    'http://localhost:3001',
    'http://localhost:5173',  // Vite default
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,           // Allow cookies and authentication headers
  optionsSuccessStatus: 200,    // For legacy browser support
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept',
    'Origin'
  ]
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
// Instead of: app.options('*', cors(corsOptions));

// Option 1: Handle OPTIONS method for all routes with a function
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Set CORS headers for preflight
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin) || corsOptions.origin.includes('*')) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});
// Additional CORS headers middleware (backup)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin) || corsOptions.origin.includes('*')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working correctly!',
    origin: req.headers.origin,
    serverTime: new Date().toISOString(),
    headers: {
      'access-control-allow-origin': res.getHeader('Access-Control-Allow-Origin'),
      'access-control-allow-credentials': res.getHeader('Access-Control-Allow-Credentials')
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n=================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`🔧 CORS enabled for: http://localhost:3000`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('=================================\n');
});