import { Document, model, models, Schema } from "mongoose";

export interface Transaction extends Document {
  createdAt?: Date;
  stripeId: string;
  amount: number;
  plan?: string;
  credits?: number;
  buter?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

const TransactionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  stripeId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  plan: { type: String },
  credits: { type: Number },
  buter: { type: Schema.Types.ObjectId, ref: "User" },
});

const Transaction =
  models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
