import mongoose, { Schema, Document, Model, Types } from "mongoose";
import '@/models/Category';
export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  longDescription: string;
  download_link?: string,
  price: number;
  image: string;
  stock: number;
  rating: number;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    download_link: { type: String, required: false },
    price: { type: Number, required: true },
    image: { type: String, required: false },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }
  },
  {
    timestamps: true,
    collection: 'products' // Explicitly set collection name
  });

const ProductModel: Model<IProduct> =
  mongoose.models.Products ||
  mongoose.model<IProduct>("Products", ProductSchema);

export default ProductModel;
