// Protected Content Controller
// This controller handles protected routes that require JWT authentication

const utilities = require('../utilities/');

/* ****************************************
*  Deliver Protected Content View
* *************************************** */
async function buildProtectedContent(req, res, next) {
  let nav = await utilities.getNav();
  
  // Add protected content navigation
  nav.push({ link: '/account', text: 'My Account' });
  nav.push({ link: '/account/logout', text: 'Logout' });
  
  res.render("protected/content", {
    title: "Protected Content",
    nav,
    user: req.user,
    content: {
      message: "This is protected content that requires JWT authentication!",
      timestamp: new Date().toLocaleString(),
      userInfo: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        type: req.user.type
      }
    }
  });
}

/* ****************************************
*  Deliver Admin Content View (Admin only)
* *************************************** */
async function buildAdminContent(req, res, next) {
  let nav = await utilities.getNav();
  
  // Add admin navigation
  nav.push({ link: '/account', text: 'My Account' });
  nav.push({ link: '/protected', text: 'Protected Content' });
  nav.push({ link: '/account/logout', text: 'Logout' });
  
  res.render("protected/admin", {
    title: "Admin Panel",
    nav,
    user: req.user,
    adminData: {
      message: "Welcome to the admin panel!",
      timestamp: new Date().toLocaleString(),
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      }
    }
  });
}

module.exports = { buildProtectedContent, buildAdminContent };
