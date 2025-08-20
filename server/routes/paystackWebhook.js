// routes/paystackWebhook.js
module.exports = (io) => {
  const express = require("express");
  const axios = require("axios");
  const crypto = require("crypto");
  require("dotenv").config();

  const router = express.Router();

  router.post("/webhook", express.json({ type: "*/*" }), async (req, res) => {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      try {
        const verifyRes = await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          }
        );

        const paymentData = verifyRes.data.data;

        if (paymentData.status === "success") {
          const userEmail = paymentData.customer.email;
          const amountPaid = paymentData.amount / 100;

          // Save order in DB
        //   await db.query(
        //     "INSERT INTO orders (user_email, total_amount, payment_reference, status) VALUES (?, ?, ?, ?)",
        //     [userEmail, amountPaid, reference, "paid"]
        //   );

        //   // Clear user's cart in DB
        //   await db.query("DELETE FROM cart WHERE user_email = ?", [userEmail]);

          // 🚀 Emit real-time event to frontend
          io.to(userEmail).emit("payment-success", {
            reference,
            amount: amountPaid,
          });

          console.log(`Order created, cart cleared, event sent to ${userEmail}`);
        }
      } catch (error) {
        console.error("Payment verification failed:", error.response?.data || error.message);
      }
    }

    res.sendStatus(200);
  });

  return router;
};
