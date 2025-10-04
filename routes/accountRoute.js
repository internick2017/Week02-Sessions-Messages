// Account Routes
// This file handles all account-related routes

const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');
const authMiddleware = require('../utilities/auth-middleware');

// Route to build login view (only for guests)
router.get('/login', 
  authMiddleware.requireGuest,
  utilities.handleErrors(accountController.buildLogin)
);

// Route to build registration view (only for guests)
router.get('/register', 
  authMiddleware.requireGuest,
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.processLogin)
);

// Route to build account management view (requires authentication)
router.get('/', 
  authMiddleware.authenticateToken,
  utilities.handleErrors(accountController.buildAccount)
);

// Route to process logout
router.get('/logout', 
  utilities.handleErrors(accountController.processLogout)
);

module.exports = router;
