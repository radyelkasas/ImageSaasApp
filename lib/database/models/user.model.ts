import { Document, model, models, Schema } from "mongoose";

export interface User extends Document {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  photo: string;
  planId: string;
  creditBalance?: number;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  photo: { type: String, required: true },
  planId: { type: String, default: "1" },
  creditBalance: { type: Number, default: 10 },
});

const User = models?.User || model("User", UserSchema);

export default User;
