import mongoose, { Schema, Document, Model, Types } from "mongoose";
import '@/models/User';

// Define cart item structure
export interface Item {
  product_id: mongoose.Types.ObjectId;
  product_code: string;
  quantity: number;
  price: number;
  name: string;
}

export interface TSale {
  _id: string;
  code: string;
  total_price: number;
  cartItems: Item[];
  user_id: mongoose.Types.ObjectId;
  submited: boolean;
  discount: number;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISale extends Document {
  _id: Types.ObjectId;
  code: string;
  total_price: number;
  cartItems: Item[];
  user_id: mongoose.Types.ObjectId;
  submited: boolean;
  discount: number;
  phone?: string;
}

const CartItemSchema = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  product_code: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
});

const SaleSchema = new Schema<ISale>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    code: { type: String, required: true, unique: true },
    total_price: { type: Number, required: true },
    cartItems: { type: [CartItemSchema], required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    submited: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    phone: { type: String, default: null }
  },
  {
    timestamps: true,
    collection: 'sales'
  });

const SaleModel: Model<ISale> =
  mongoose.models.Sales ||
  mongoose.model<ISale>("Sales", SaleSchema);

export default SaleModel;
