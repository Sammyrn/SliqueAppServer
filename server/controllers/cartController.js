const states = require("../constants/shippingStates.js");
const Cart = require("../models/cartModel.js");
const https = require("https");

exports.getCart = async (req, res) => {
  const user_id = req.user.id;
  try {
    const rows = await Cart.getUserCart(user_id);
    if (!rows) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "success", rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const user_id = req.user.id;
  const { productId, quantity } = req.body;
  //console.log("Product ID:", productId, quantity);

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  try {
    const result = await Cart.addUserCart(user_id, productId, quantity);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or already in cart" });
    }

    //return item to be saved in client store
    const [resultItem] = await Cart.getCartItemById(result.insertId);
    const parseArr = {
      ...resultItem,
      image_url: JSON.parse(resultItem.image_url),
    };
    res.status(201).json({ message: "success", product: parseArr });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  const user_id = req.user.id;
  const product_id = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const result = await Cart.updateQuantity(user_id, product_id, quantity);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  const user_id = req.user.id;
  const product_id = req.params.id;
  try {
    const result = await Cart.deleteCartItem(user_id, product_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.shipping = async (req, res) => {
  try {
    const { state } = req.body;

    if (state) {
      const price = states[state];
      if (!price) {
        return res.status(404).json({ message: `Shipping price for ${state} not found.` });
      }
      return res.status(200).json({ message: "success", state, price });
    }

    // If no specific state provided, return full list
    return res.status(200).json({ message: "success", pricesList: states });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
