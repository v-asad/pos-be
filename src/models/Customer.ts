import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string; // Name of the customer
  email: string; // Email of the customer (unique)
  phone?: string;
  membership?: mongoose.Types.ObjectId; // Reference to a Membership document
  createdAt: Date;
  updatedAt: Date;
}

// Define the Customer schema
const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: false, required: false },
  phone: { type: String },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
}, { timestamps: true });

// Create and export the Customer model
const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;