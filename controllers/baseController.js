// Base Controller
// This controller handles the home page functionality

const buildHome = async (req, res, next) => {
  try {
    // Flash message testing completed - message removed as instructed
    
    res.render('index', {
      title: 'Sessions and Messages Demo',
      nav: [
        { link: '/', text: 'Home' },
        { link: '/login', text: 'Login' },
        { link: '/register', text: 'Register' }
      ]
    });
  } catch (error) {
    console.error('Error in buildHome:', error);
    next(error);
  }
};

module.exports = { buildHome };
