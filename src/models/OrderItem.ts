import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem extends Document {
  item: mongoose.Types.ObjectId; // Reference to the actual item (CafeItem, BarGameSession)
  itemType: 'CafeItem' | 'GameSession'; // To differentiate between item types
  quantity: number;
  priceAtSale: number; // Price of a single unit at the time of sale
  costAtSale?: number; // Calculated cost for game sessions
}

const OrderItemSchema: Schema = new Schema({
  item: { type: mongoose.Types.ObjectId, required: true, refPath: 'itemType' },
  itemType: { type: String, required: true, enum: ['CafeItem', 'GameSession'] },
  quantity: { type: Number, required: true, default: 1 },
  priceAtSale: { type: Number, required: true },
  costAtSale: { type: Number } // Optional, for game sessions
});

const OrderItem = mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);

export default OrderItem;