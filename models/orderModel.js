const db = require("../config/db");

exports.getAllOrders = async () => {
  try {
    const rows = await db.query(
      "SELECT o.id, u.fullname, o.currentstatus, o.shipping_address, o.payment_status, o.created_at, oi.quantity, oi.price_at_purchase, p.name FROM orders o JOIN orderitems oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id JOIN users u ON u.id = o.user_id"
    );
    return rows[0];
  } catch (e) {
    throw e;
  }
};

exports.getOrderById = async (id) => {
  try {
    const rows = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
    return rows[0];
  } catch (e) {
    throw e;
  }
};

exports.createOrder = async (data) => {
  const { userId, totalAmount, shippingAddress, paymentStatus } =
    data;
  try {
    const rows = await db.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address, payment_status) VALUES (?, ?, ?, ?)",
      [userId, totalAmount, shippingAddress, paymentStatus]
    );
    return rows[0];
  } catch (e) {
    throw e;
  }
};

exports.updateOrderStatus = async (id, status) => {
  try {
    const rows = await db.query(
      "UPDATE orders SET payment_status = ? WHERE id = ?",
      [status, id]
    );
    return rows[0];
  } catch (e) {
    throw e;
  }
};
