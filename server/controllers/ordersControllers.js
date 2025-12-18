const { getAllOrders } = require("../models/orderModel");

exports.getAll = async (req, res) => {
  try {
    const rows = await getAllOrders();
    if(rows.length === 0){
    return res.status(401).json({ message: "No Orders in Database" });
    }
    //console.log(rows);
    return res.status(200).json({ message: "success", rows });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", err: error });
  }
};
