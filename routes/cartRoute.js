const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateQuantity,
  deleteCartItem,
  shipping
} = require("../controllers/cartController.js");
const { verifyToken } = require("../middleware/verifyToken.js");

router.use(verifyToken);
// Route to get all products in users cart
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:id", updateQuantity);
router.delete("/delete/:id", deleteCartItem);
router.post("/shipping", shipping);

module.exports = router;
