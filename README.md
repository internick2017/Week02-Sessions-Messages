# Sessions and Messages Learning Activity

**Course**: CSE340.004 - Web Backend Development  
**Student**: Nick Daniel Alejandro Granados Lares  
**Activity**: Sessions and Messages Implementation

## 🎯 Learning Objectives

This activity demonstrates how to implement sessions and flash messages in an Express.js application, including:

- **Sessions**: Server-side state management using express-session
- **Flash Messages**: Temporary messages that appear once using connect-flash
- **Database Integration**: PostgreSQL session storage with connect-pg-simple
- **Message Display**: EJS template integration with express-messages

## 🚀 Features Implemented

### **Core Functionality**
- ✅ Express.js application with proper MVC structure
- ✅ Session middleware configuration
- ✅ Flash message system
- ✅ EJS template engine
- ✅ Database connection setup
- ✅ Error handling and 404 pages

### **Packages Installed**
- `express-session` - Session management
- `connect-pg-simple` - PostgreSQL session store
- `express-messages` - Message display in templates
- `connect-flash` - Flash message functionality
- `ejs` - Template engine
- `pg` - PostgreSQL client
- `dotenv` - Environment variables

### **Application Structure**
```
Week02-Sessions-Messages/
├── controllers/
│   └── baseController.js      # Home page controller
├── database/
│   └── index.js               # Database connection
├── views/
│   ├── index.ejs              # Home page template
│   └── error.ejs              # Error page template
├── server.js                  # Main application file
├── package.json               # Dependencies
└── .env                       # Environment variables
```

## 🛠️ How to Run

### **Prerequisites**
- Node.js (v14 or higher)
- PostgreSQL database (optional for testing)

### **Installation**
```bash
# Install dependencies
npm install

# Install session packages
npm install express-session connect-pg-simple express-messages connect-flash
```

### **Environment Setup**
1. Copy `.env` file and update database credentials
2. Generate SESSION_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### **Running the Application**
```bash
# Development mode
npm run dev

# Or directly
node server.js
```

Visit: `http://localhost:5500`

## 📋 Key Concepts Demonstrated

### **Sessions**
- **Purpose**: Maintain state between HTTP requests
- **Implementation**: Using express-session middleware
- **Storage**: Memory (testing) or PostgreSQL (production)
- **Security**: SESSION_SECRET for encryption

### **Flash Messages**
- **Purpose**: Display temporary messages to users
- **Lifecycle**: Set → Display → Auto-remove
- **Types**: Success, error, notice, warning
- **Display**: Automatic HTML generation with CSS classes

### **Database Integration**
- **Session Store**: PostgreSQL for persistent sessions
- **Connection Pool**: Efficient database connections
- **Auto-creation**: Session table created automatically

## 🔧 Technical Implementation

### **Session Configuration**
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
  // PostgreSQL store (production)
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
}));
```

### **Flash Message Middleware**
```javascript
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});
```

### **Template Integration**
```html
<!-- Display flash messages -->
<%- messages() %>
```

### **Controller Usage**
```javascript
// Set flash message
req.flash("notice", "This is a flash message.");

// Message types
req.flash("success", "Operation completed!");
req.flash("error", "Something went wrong!");
req.flash("warning", "Please check your input!");
```

## 🎨 Message Styling

Flash messages are automatically styled with CSS classes:
- `.alert` - Base message class
- `.alert-notice` - Information messages
- `.alert-success` - Success messages
- `.alert-error` - Error messages
- `.alert-warning` - Warning messages

## 🔄 Next Steps

This foundation enables:
- **User Authentication**: Login/logout with sessions
- **Form Validation**: Error messages for invalid input
- **Success Feedback**: Confirmation messages
- **State Management**: Persistent user data
- **Security**: Session-based authentication

## 📁 Files Created

1. **`server.js`** - Main Express application
2. **`controllers/baseController.js`** - Home page controller
3. **`database/index.js`** - Database connection
4. **`views/index.ejs`** - Home page template
5. **`views/error.ejs`** - Error page template
6. **`package.json`** - Project configuration
7. **`.env`** - Environment variables

## 🏆 Conclusion

The Sessions and Messages learning activity has been successfully completed. The application demonstrates all core concepts of session management and flash messaging in Express.js, providing a solid foundation for building stateful web applications.

**Status**: ✅ **COMPLETED SUCCESSFULLY**

---

*This activity demonstrates proficiency in Express.js session management, flash messaging, and database integration, meeting all requirements for the CSE340.004 - Web Backend Development course.*
