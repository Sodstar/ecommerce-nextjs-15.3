import mongoose, { Schema, Document, Model, Types } from "mongoose";
import '@/models/Sale';
import '@/models/Driver';

export type DeliveryStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface DeliveryFormData {
  code: string;
  sale_id: string;
  driver_id: string;
  phone: string;
  address: string;
  deliveryPrice: number;
  driverPrice: number;
  summaryPrice: number;
  status?: DeliveryStatus
}

export interface TDelivery {
  _id: string;
  code: string;
  sale_id: string;
  driver_id: string;
  phone: string;
  address: string;
  deliveryPrice: number;
  driverPrice: number;
  summaryPrice: number;
  status: DeliveryStatus
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDelivery extends Document {
  _id: Types.ObjectId;
  code: string;
  sale_id: mongoose.Types.ObjectId;
  driver_id: mongoose.Types.ObjectId;
  phone: string;
  address: string;
  deliveryPrice: number;
  driverPrice: number;
  summaryPrice: number;
  status: DeliveryStatus,
  createdAt: Date; // Add the missing createdAt property

}

const DeliverySchema = new Schema<IDelivery>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    code: { type: String, required: true },
    sale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Sales", required: true },
    driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    deliveryPrice: { type: Number, required: true },
    driverPrice: { type: Number, required: true },
    summaryPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: 'deliveries'
  });

const DeliveryModel: Model<IDelivery> =
  mongoose.models.Delivery ||
  mongoose.model<IDelivery>("Delivery", DeliverySchema);

export default DeliveryModel;
