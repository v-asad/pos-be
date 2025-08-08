import mongoose, { Schema, Document } from 'mongoose';

export interface IMembership extends Document {
  name: string;
  description?: string;
  duration: number;
  price: number;
  active: boolean;
  expiryDate?: Date;
}

const MembershipSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMembership>('Membership', MembershipSchema);