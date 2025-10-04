// JWT Utilities
// This file contains JWT token generation and verification functions

const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT secret key - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing user information
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.account_id,
    email: user.account_email,
    firstName: user.account_firstname,
    lastName: user.account_lastname,
    type: user.account_type
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'cse340-app',
    audience: 'cse340-users'
  });
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'cse340-app',
      audience: 'cse340-users'
    });
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Extract token from request headers or cookies
 * @param {Object} req - Express request object
 * @returns {string|null} JWT token or null if not found
 */
function extractToken(req) {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

/**
 * Set JWT token as HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 */
function setTokenCookie(res, token) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  };

  res.cookie('token', token, cookieOptions);
}

/**
 * Clear JWT token cookie
 * @param {Object} res - Express response object
 */
function clearTokenCookie(res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
  setTokenCookie,
  clearTokenCookie
};
