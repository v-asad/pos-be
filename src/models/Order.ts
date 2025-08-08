import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[];
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
  totalAmount: { type: Number, required: true, default: 0 },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;