// Account Controller
// This controller handles account-related functionality

const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs");
const jwtUtils = require('../utilities/jwt-utils');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    // Get account by email
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    if (!accountData) {
      req.flash("notice", "Invalid email or password.");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        account_email,
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    
    if (!passwordMatch) {
      req.flash("notice", "Invalid email or password.");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        account_email,
      });
    }

    // Generate JWT token
    const token = jwtUtils.generateToken(accountData);
    
    // Set token as HTTP-only cookie
    jwtUtils.setTokenCookie(res, token);

    // Set session data for compatibility
    req.session.account_id = accountData.account_id;
    req.session.account_email = accountData.account_email;
    req.session.account_firstname = accountData.account_firstname;
    req.session.account_lastname = accountData.account_lastname;
    req.session.account_type = accountData.account_type;

    req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
    res.redirect("/account");
    
  } catch (error) {
    console.error('Login error:', error);
    req.flash("notice", "Sorry, there was an error processing your login.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      account_email,
    });
  }
}

/* ****************************************
*  Deliver Account Management View
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "My Account",
    nav,
    account: req.user || {
      firstName: req.session.account_firstname,
      lastName: req.session.account_lastname,
      email: req.session.account_email,
      type: req.session.account_type
    }
  });
}

/* ****************************************
*  Process Logout
* *************************************** */
async function processLogout(req, res, next) {
  // Clear JWT cookie
  jwtUtils.clearTokenCookie(res);
  
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
  });

  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = { buildLogin, buildRegister, registerAccount, processLogin, buildAccount, processLogout };
