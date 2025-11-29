import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    address: { type: String, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "on-the-way", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
