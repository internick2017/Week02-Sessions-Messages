// Inventory Routes
// This file handles all inventory-related routes

const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../utilities/auth-middleware');
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory management view (requires authentication)
router.get('/', 
  authMiddleware.authenticateToken,
  utilities.handleErrors(inventoryController.buildInventoryManagement)
);

// Route to build inventory update view - Step 1 (requires authentication)
router.get('/update/:inv_id', 
  authMiddleware.authenticateToken,
  utilities.handleErrors(inventoryController.buildInventoryUpdate)
);

// Route to process inventory update - Step 2 (requires authentication)
router.post('/update', 
  authMiddleware.authenticateToken,
  invValidate.inventoryUpdateRules(),
  invValidate.checkInventoryUpdateData,
  utilities.handleErrors(inventoryController.processInventoryUpdate)
);

module.exports = router;
