import mongoose, { Document, Schema } from 'mongoose';

export interface IBarGame extends Document {
  name: string;
  description?: string;
  pricePerHour: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BarGameSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    pricePerHour: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBarGame>('BarGame', BarGameSchema);