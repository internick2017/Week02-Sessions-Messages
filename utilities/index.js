// Utilities
// This file contains utility functions for the application

const getNav = async () => {
  // Navigation items for the site
  return [
    { link: '/', text: 'Home' },
    { link: '/account', text: 'My Account' },
    { link: '/account/login', text: 'Login' },
    { link: '/account/register', text: 'Register' }
  ];
};

// Error handling wrapper for async functions
const handleErrors = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { getNav, handleErrors };
