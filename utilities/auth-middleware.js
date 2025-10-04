// JWT Authorization Middleware
// This file contains middleware for JWT-based authentication and authorization

const jwtUtils = require('./jwt-utils');
const utilities = require('./');

/**
 * Middleware to verify JWT token and authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function authenticateToken(req, res, next) {
  try {
    const token = jwtUtils.extractToken(req);
    
    if (!token) {
      req.flash('notice', 'Access denied. Please log in.');
      return res.status(401).redirect('/account/login');
    }

    const decoded = jwtUtils.verifyToken(token);
    
    if (!decoded) {
      req.flash('notice', 'Invalid or expired token. Please log in again.');
      return res.status(401).redirect('/account/login');
    }

    // Add user information to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      type: decoded.type
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    req.flash('notice', 'Authentication failed. Please log in again.');
    return res.status(401).redirect('/account/login');
  }
}

/**
 * Middleware to check if user has specific account type
 * @param {string|Array} accountTypes - Required account type(s)
 * @returns {Function} Middleware function
 */
function requireAccountType(accountTypes) {
  return (req, res, next) => {
    if (!req.user) {
      req.flash('notice', 'Authentication required.');
      return res.status(401).redirect('/account/login');
    }

    const userType = req.user.type;
    const allowedTypes = Array.isArray(accountTypes) ? accountTypes : [accountTypes];

    if (!allowedTypes.includes(userType)) {
      req.flash('notice', 'Access denied. Insufficient permissions.');
      return res.status(403).redirect('/account/login');
    }

    next();
  };
}

/**
 * Middleware to check if user is authenticated (optional)
 * Sets req.user if token is valid, but doesn't require it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function optionalAuth(req, res, next) {
  try {
    const token = jwtUtils.extractToken(req);
    
    if (token) {
      const decoded = jwtUtils.verifyToken(token);
      if (decoded) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          type: decoded.type
        };
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue even if authentication fails
  }
}

/**
 * Middleware to ensure user is not authenticated (for login/register pages)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function requireGuest(req, res, next) {
  try {
    const token = jwtUtils.extractToken(req);
    
    if (token) {
      const decoded = jwtUtils.verifyToken(token);
      if (decoded) {
        // User is already authenticated, redirect to account page
        return res.redirect('/account');
      }
    }

    next();
  } catch (error) {
    console.error('Guest check error:', error);
    next();
  }
}

module.exports = {
  authenticateToken,
  requireAccountType,
  optionalAuth,
  requireGuest
};
