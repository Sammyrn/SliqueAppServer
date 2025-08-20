require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http");
const { initializeSocket } = require("./utils/socket.js");

const app = express();

const authRoutes = require("./routes/authRoute.js");
const productRoutes = require("./routes/productRoute.js");
const cartRoutes = require("./routes/cartRoute.js");
const orderRoutes = require("./routes/orderRoute.js");
const paystackRoutes = require("./routes/paystackRoute.js");

app.use(
  cors({
    origin: "http://localhost:5173", // 👈 your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/paystack", paystackRoutes);

//app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5050;
const server = http.createServer(app);
initializeSocket(server);

// app.post("/api/test", async (req, res) => {
//   const io = getServer();
//   io.emit(`payment-4`, {
//     status: "failed",
//     message: "Payment failed, Payment refunded!",
//   });
//   console.log("MESSAGE SENT");

//   res.status(200).json({ msg: "MESSAGE SENT"});
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
