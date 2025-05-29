import mongoose, { Schema, Document, Model, Types } from "mongoose";
// Force import Product model first to ensure it's registered
import "../models/Product";

export type OrderStatus = 'ordered' | 'finishied' | 'cancelled';

export interface TOrder {
  _id: string;
  code: string;
  product_id: mongoose.Types.ObjectId;
  qty: Number;
  description: string;
  total_price: number;
  status: OrderStatus;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  code: string;
  product_id: mongoose.Types.ObjectId;
  qty: Number;
  description: string;
  total_price: number;
  status: OrderStatus;
}

const OrderSchema = new Schema<IOrder>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    code: { type: String, required: true, unique: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true },
    description: { type: String, required: false },
    total_price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['ordered', 'finishied', 'cancelled'],
      default: 'ordered',
    },
  },
  {
    timestamps: true,
    collection: 'orders' // Explicitly set collection name
  });

// Check if models are already registered to prevent OverwriteModelError
let OrderModel: Model<IOrder>;
try {
  // Try to get existing model first
  OrderModel = mongoose.model<IOrder>("Orders");
} catch (e) {
  // If not exists, create a new one
  OrderModel = mongoose.model<IOrder>("Orders", OrderSchema);
}

export default OrderModel;
