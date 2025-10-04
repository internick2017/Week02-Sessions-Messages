// Inventory Validation
// This file contains validation rules for inventory-related forms

const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Inventory Update Data Validation Rules
 * ********************************* */
validate.inventoryUpdateRules = () => {
  return [
    // inventory name is required and must be string
    body("inv_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an inventory name."),

    // inventory description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a description (minimum 10 characters)."),

    // inventory image is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    // inventory thumbnail is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),

    // inventory price is required and must be a positive number
    body("inv_price")
      .trim()
      .notEmpty()
      .isNumeric()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price (must be a positive number)."),

    // inventory year is required and must be a valid year
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),

    // inventory miles is required and must be a positive number
    body("inv_miles")
      .trim()
      .notEmpty()
      .isNumeric()
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage (must be a positive number)."),

    // inventory color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),

    // classification_id is required and must be a number
    body("classification_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("Please select a classification."),
  ];
};

/* ******************************
 * Check inventory update data and return errors or continue to update
 * ***************************** */
validate.checkInventoryUpdateData = async (req, res, next) => {
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
  
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const inventoryModel = require('../models/inventory-model');
    
    try {
      const inventoryItem = await inventoryModel.getInventoryById(inv_id);
      const classifications = await inventoryModel.getClassifications();
      
      res.render("inventory/update", {
        errors,
        title: "Update Inventory Item",
        nav,
        inventoryItem: inventoryItem || { inv_id, inv_name, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id },
        classifications,
      });
      return;
    } catch (error) {
      console.error('Error in validation:', error);
      req.flash("notice", "Sorry, there was an error processing the form.");
      res.redirect("/inventory");
      return;
    }
  }
  next();
};

module.exports = validate;
