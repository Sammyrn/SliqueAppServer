const db = require("../config/db");

exports.getUser = async (email) => {
  try {
    const results = await db.query(
      "SELECT id, email, fullname, role, address, password_hash FROM users WHERE email = ?",
      [email]
    );

    return results[0];
  } catch (error) {
    throw error;
  }
};

exports.create = async (data) => {
  const { fullname, email, phone, password, address, role } = data;
  console.log(data);
  try {
    const result = await db.query(
      "INSERT INTO users (fullname, email, password_hash, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
      [fullname, email, password, phone, address, role]
    );

    const response = { fullname, email, phone, role };
    return response;
  } catch (error) {
    throw error;
  }
};
exports.getUserById = async (id) => {
  try {
    const results = await db.query(
      "SELECT id, email, fullname, role FROM users WHERE id = ?",
      [id]
    );
    return results[0];
  } catch (error) {
    throw error;
  }
};

// Refresh token functions
exports.storeRefreshToken = async (userId, refreshToken) => {
  try {
    // First, delete any existing refresh tokens for this user
    await db.query("DELETE FROM refresh_tokens WHERE user_id = ?", [userId]);

    // Insert the new refresh token
    await db.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [userId, refreshToken]
    );
  } catch (error) {
    throw error;
  }
};

exports.getRefreshToken = async (refreshToken) => {
  try {
    const results = await db.query(
      "SELECT rt.*, u.id, u.email, u.fullname, u.role FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = ? AND rt.expires_at > NOW()",
      [refreshToken]
    );
    return results[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteRefreshToken = async (userId) => {
  try {
    await db.query("DELETE FROM refresh_tokens WHERE user_id = ?", [userId]);
  } catch (error) {
    throw error;
  }
};
