// routes/payments.js
const express = require("express");
const axios = require("axios");
const { verifyToken } = require("../middleware/verifyToken");

const crypto = require("crypto");
const { clearUserCart } = require("../models/cartModel");
const { createOrder, updateOrderStatus } = require("../models/orderModel");
const { addOrderItem } = require("../models/orderItemsModel");
const { getServer } = require("../utils/socket");

require("dotenv").config();

const router = express.Router();
const io = getServer();
/**
 * POST /initialize
 * Body: { amount: number, email: string }
 */
router.post("/initialize", verifyToken, async (req, res) => {
  try {
    const email = req.user.email; // Assuming user email is stored in the token
    const { amount, shippingAddress, cart } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in the token

    if (!amount || !email) {
      return res.status(400).json({ message: "Amount and email are required" });
    }

    const result = await createOrder({
      userId,
      totalAmount: amount,
      paymentStatus: "unpaid",
      shippingAddress,
    });
    if (!result.insertId) {
      return res.status(500).json({ message: "Failed to create order" });
    }
    // Initialize Paystack transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert Naira to Kobo
        subaccount: process.env.PAYSTACK_SUBACCOUNT_ID, // Your friend's subaccount
        bearer: "subaccount", // Means the subaccount will bear the charges
        metadata: {
          userId,
          orderId: result.insertId, // store orderId from DB here
        },
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      // // ✅ Create order row
      //userId, orderDate, totalAmount, shippingAddress, paymentStatus

      cart.forEach(async (item) => {
        await addOrderItem({
          orderId: result.insertId,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        });
      });

      return res.status(200).json({
        message: "success",
        authorization_url: response.data.data.authorization_url,
        reference: response.data.data.reference,
      });
    } else {
      return res.status(400).json({ message: "Failed to initialize payment" });
    }
  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      message: "An error occurred while initializing payment",
    });
  }
});

/**
 * Paystack Webhook Route
 * Must be publicly accessible (add to Paystack dashboard)
 */
// webhook.js
router.post("/webhook", async (req, res) => {
  const event = req.body;

  console.log("Received Paystack webhook event:", event);

  // 1. Verify webhook came from Paystack (check signature)
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(400).send("Invalid signature");
  }

  // 2. Process payment success
  if (event.event === "charge.success") {
    const paymentData = event.data;
    const userId = paymentData.metadata.userId; // store this in paystack init request

    // // ✅ Clear cart DB
    await clearUserCart(userId);

    // // ✅ Create order row
    await updateOrderStatus(
      paymentData.metadata.orderId, // Assuming you stored orderId in metadata
      "paid"
    );

    // ✅ Emit real-time event to frontend
    io.emit(`payment-${userId}`, {
      status: "success",
      message: "Payment successful, order created!",
    });
  }

  if (event.event === "charge.failed") {
    const { metadata } = event.data;
    await updateOrderStatus(metadata.orderId, "failed");
    io.emit(`payment-${userId}`, {
      status: "failed",
      message: "Payment failed, Please try again!",
    });
  }

  if (event.event === "refund.processed") {
    const { metadata } = event.data;
    await updateOrderStatus(metadata.orderId, "refunded");
    io.emit(`payment-${userId}`, {
      status: "refunded",
      message: "Payment failed, Payment refunded!",
    });
  }

  res.sendStatus(200);
});

module.exports = router;
