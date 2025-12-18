const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductInStock,
} = require("../controllers/productController.js");
const { requireAdmin } = require("../middleware/roleMiddleware.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const {  uploadMultiple } = require("../middleware/uploadMiddleware.js");

// Public routes (no authentication required)
router.get("/getAll", getAllProducts);
router.get("/get/:id", getProductById);

// Admin routes (requires admin role)
router.post("/create", verifyToken, requireAdmin, uploadMultiple, createProduct);
router.post("/update", verifyToken, requireAdmin, uploadMultiple, updateProduct);
router.put("/update/:id", verifyToken, requireAdmin, uploadMultiple, toggleProductInStock);

router.delete("/delete/:id", verifyToken, requireAdmin, deleteProduct);

module.exports = router;
