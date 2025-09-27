// Express.js Application - Sessions and Messages Demo
// CSE340.004 - Web Backend Development

// Require Statements
const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require("body-parser");

// Session and Database Requirements
const session = require("express-session");
const pool = require('./database/');

// Import Controllers
const baseController = require('./controllers/baseController');

// Import Routes
const accountRoute = require('./routes/accountRoute');

// Create Express Application
const app = express();

// View Engine and Templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* ***********************
 * Middleware
 * ************************/
// For testing without database, we'll use memory store
// In production, use PostgreSQL store as configured below
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
  // Uncomment the following lines when PostgreSQL is available:
  // store: new (require('connect-pg-simple')(session))({
  //   createTableIfMissing: true,
  //   pool,
  // }),
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Routes
app.get('/', baseController.buildHome);

// Account Routes
app.use('/account', accountRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'Something went wrong!'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The requested page was not found.'
  });
});

// Start Server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`🔧 Node.js version: ${process.version}`);
  console.log(`💻 Platform: ${process.platform} ${process.arch}`);
  console.log('\n📋 Available endpoints:');
  console.log('   GET  /              - Home page with flash messages demo');
  console.log('   GET  /account       - My Account page');
  console.log('   GET  /account/login - Login page');
  console.log('   GET  /account/register - Registration page');
  console.log('   POST /account/register - Process registration');
  console.log('\n🛑 Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});
