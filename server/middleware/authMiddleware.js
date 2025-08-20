const { requireAdmin } = require('./roleMiddleware');

// Keep the old function for backward compatibility
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role !== "2004") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

// Export both old and new versions
exports.isAdmin = isAdmin;
exports.requireAdmin = requireAdmin;