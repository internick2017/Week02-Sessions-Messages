// Inventory Model
// This file contains database operations for inventory management

const pool = require('../database/');

/* *****************************
*   Get all inventory items
* *************************** */
async function getAllInventory() {
  try {
    const sql = "SELECT * FROM inventory ORDER BY inv_name"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error('Error getting inventory:', error)
    return error.message
  }
}

/* *****************************
*   Get inventory item by ID
* *************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1"
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error('Error getting inventory item:', error)
    return error.message
  }
}

/* *****************************
*   Update inventory item
* *************************** */
async function updateInventory(inv_id, inv_name, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
  try {
    const sql = "UPDATE inventory SET inv_name = $1, inv_description = $2, inv_image = $3, inv_thumbnail = $4, inv_price = $5, inv_year = $6, inv_miles = $7, inv_color = $8, classification_id = $9 WHERE inv_id = $10 RETURNING *"
    const result = await pool.query(sql, [inv_name, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error('Error updating inventory:', error)
    return error.message
  }
}

/* *****************************
*   Get all classifications
* *************************** */
async function getClassifications() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error('Error getting classifications:', error)
    return error.message
  }
}

/* *****************************
*   Get classification by ID
* *************************** */
async function getClassificationById(classification_id) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_id = $1"
    const result = await pool.query(sql, [classification_id])
    return result.rows[0]
  } catch (error) {
    console.error('Error getting classification:', error)
    return error.message
  }
}

module.exports = { 
  getAllInventory, 
  getInventoryById, 
  updateInventory, 
  getClassifications, 
  getClassificationById 
};
