const db = require('../config/db');

exports.addOrderItem = async ({orderId, product_id, quantity, price}) => {
  try {
    const rows = await db.query(
      "INSERT INTO orderitems (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
      [orderId, product_id, quantity, price]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}