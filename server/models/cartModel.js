const db = require("../config/db");

exports.getUserCart = async (userId) => {
  try {
    const rows = await db.query("SELECT c.quantity, p.* FROM cart c JOIN products p WHERE p.id = c.product_id", [
      userId,
    ]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getCartItemById = async (id) =>{
  try {
    const rows = await db.query("SELECT c.quantity, p.* FROM cart c JOIN products p WHERE p.id = c.product_id AND c.id = ?", [
      id
    ]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.addUserCart = async (userId, id, quantity) => {
  try {
    const rows = await db.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, id, quantity]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateQuantity = async (userId, productId, quantity) => {
  try {
    const rows = await db.query(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, userId, productId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

exports.deleteCartItem = async (userId, productId) => {
  try {
    const rows = await db.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.clearUserCart = async (userId) => {
  try {
    const rows = await db.query(
      "DELETE FROM cart WHERE user_id = ?",
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};