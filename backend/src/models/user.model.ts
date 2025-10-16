import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  hobbies: {
    type: [String],
    required: true,
  },
  friends: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  popularityScore: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
