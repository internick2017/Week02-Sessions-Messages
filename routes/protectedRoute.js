// Protected Routes
// This file handles protected routes that require JWT authentication

const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const protectedController = require('../controllers/protectedController');
const authMiddleware = require('../utilities/auth-middleware');

// Route to protected content (requires authentication)
router.get('/', 
  authMiddleware.authenticateToken,
  utilities.handleErrors(protectedController.buildProtectedContent)
);

// Route to admin panel (requires admin authentication)
router.get('/admin', 
  authMiddleware.authenticateToken,
  authMiddleware.requireAccountType('Administrator'),
  utilities.handleErrors(protectedController.buildAdminContent)
);

module.exports = router;
