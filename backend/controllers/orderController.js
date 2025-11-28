import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can create orders" });
    }

    const { items, address, total } = req.body;

    if (!address) return res.status(400).json({ message: "Address is required" });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items required" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      address,
      total,
    });

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all orders" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update status" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected", "on-the-way", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    // only user role
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can view their orders" });
    }

    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

