import mongoose, { Document, Schema } from 'mongoose';

export interface ICafeItem extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  inStock: boolean;
  quantity: number;
}

const CafeItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICafeItem>('CafeItem', CafeItemSchema);