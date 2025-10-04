// Inventory Controller
// This controller handles inventory-related functionality

const utilities = require('../utilities/');
const inventoryModel = require('../models/inventory-model');

/* ****************************************
*  Deliver inventory management view
* *************************************** */
async function buildInventoryManagement(req, res, next) {
  let nav = await utilities.getNav();
  
  try {
    const inventory = await inventoryModel.getAllInventory();
    const classifications = await inventoryModel.getClassifications();
    
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      inventory,
      classifications,
      errors: null
    });
  } catch (error) {
    console.error('Error building inventory management:', error);
    req.flash("notice", "Sorry, there was an error loading the inventory.");
    res.status(500).render("inventory/management", {
      title: "Inventory Management",
      nav,
      inventory: [],
      classifications: [],
      errors: null
    });
  }
}

/* ****************************************
*  Deliver inventory update view - Step 1
* *************************************** */
async function buildInventoryUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = req.params.inv_id;
  
  try {
    const inventoryItem = await inventoryModel.getInventoryById(inv_id);
    const classifications = await inventoryModel.getClassifications();
    
    if (!inventoryItem) {
      req.flash("notice", "Inventory item not found.");
      return res.redirect("/inventory");
    }
    
    res.render("inventory/update", {
      title: "Update Inventory Item",
      nav,
      inventoryItem,
      classifications,
      errors: null
    });
  } catch (error) {
    console.error('Error building inventory update:', error);
    req.flash("notice", "Sorry, there was an error loading the inventory item.");
    res.redirect("/inventory");
  }
}

/* ****************************************
*  Process inventory update - Step 2
* *************************************** */
async function processInventoryUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const { 
    inv_id, 
    inv_name, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body;

  try {
    const updateResult = await inventoryModel.updateInventory(
      inv_id,
      inv_name,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      req.flash("notice", `Inventory item "${inv_name}" has been successfully updated.`);
      res.redirect("/inventory");
    } else {
      req.flash("notice", "Sorry, the inventory update failed.");
      res.status(500).render("inventory/update", {
        title: "Update Inventory Item",
        nav,
        inventoryItem: { inv_id, inv_name, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id },
        classifications: await inventoryModel.getClassifications(),
        errors: null
      });
    }
  } catch (error) {
    console.error('Error processing inventory update:', error);
    req.flash("notice", "Sorry, there was an error updating the inventory item.");
    res.status(500).render("inventory/update", {
      title: "Update Inventory Item",
      nav,
      inventoryItem: { inv_id, inv_name, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id },
      classifications: await inventoryModel.getClassifications(),
      errors: null
    });
  }
}

module.exports = { 
  buildInventoryManagement, 
  buildInventoryUpdate, 
  processInventoryUpdate 
};
